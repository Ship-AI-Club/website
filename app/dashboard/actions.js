"use server";

import { randomInt } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser, requireOnboarded } from "../../lib/auth";
import { sql, one } from "../../lib/db";
import {
  GOAL_IDS,
  INTEREST_IDS,
  LIMITS,
  MAX_TEAM_SIZE,
  REQUESTABLE_ROLES,
  SPONSOR_CHOICE_IDS,
  TRACK_IDS,
  VOLUNTEER_JOB_IDS,
  pickIds,
  roleLabel,
  safeUrl,
  slugify,
  text,
} from "../../lib/accounts";
import { CATEGORIES } from "../../lib/results";
import { EVENT } from "../../lib/hackathon";
import { submissionsOpen, getSetting } from "../../lib/settings";
import { teamFor, submissionForTeam } from "../../lib/store";
import { adminNotice, roleRequestReceivedEmail, submissionReceiptEmail } from "../../lib/email";

/* ------------------------------------------------------------------
   Everything a signed-in person can do to their own account.

   Two rules run through all of it:

     · authority is re-derived on the server for every call. A form
       field never says who you are or what team you're on — the
       session does, and the query is scoped to it. Passing someone
       else's team id into leaveTeamAction does nothing, because the
       delete is written against `user_id = <you>`.

     · nothing here grants a role. Registering makes you a
       participant, which the rules say anyone can be. Sponsor, mentor
       and judge are requests, and an admin decides them.
------------------------------------------------------------------ */

const CATEGORY_NAMES = CATEGORIES.filter((c) => !c.voted).map((c) => c.name);

/* No I/O/0/1 — an invite code gets read out loud across a room. */
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function inviteCode(length = 8) {
  let out = "";
  for (let i = 0; i < length; i += 1) out += CODE_ALPHABET[randomInt(0, CODE_ALPHABET.length)];
  return out;
}

async function audit(actorId, action, target, meta = {}) {
  try {
    await sql`
      insert into audit_log (actor_id, action, target, meta)
      values (${actorId}, ${action}, ${target}, ${JSON.stringify(meta)}::jsonb)`;
  } catch {
    // the log is a convenience, never a gate
  }
}

function refresh() {
  revalidatePath("/dashboard", "layout");
}

/* ---------- profile ---------- */

export async function updateProfileAction(prev, formData) {
  const user = await requireUser("/dashboard/profile");

  const name = text(formData.get("name"), LIMITS.name);
  if (!name) return { error: "A name is required — it goes on your certificate." };

  const interests = pickIds(formData.getAll("interests"), INTEREST_IDS);
  const goals = pickIds(formData.getAll("goals"), GOAL_IDS);
  const tierRaw = text(formData.get("sponsor_tier"), 40);

  await sql`
    update users set
      name         = ${name},
      title        = ${text(formData.get("title"), LIMITS.title)},
      company      = ${text(formData.get("company"), LIMITS.company)},
      phone        = ${text(formData.get("phone"), LIMITS.phone)},
      discord      = ${text(formData.get("discord"), LIMITS.handle)},
      github       = ${text(formData.get("github"), LIMITS.handle)},
      x_handle     = ${text(formData.get("x_handle"), LIMITS.handle)},
      linkedin     = ${text(formData.get("linkedin"), LIMITS.handle)},
      website      = ${safeUrl(formData.get("website"))},
      bio          = ${text(formData.get("bio"), LIMITS.bio)},
      public_profile = ${formData.get("public_profile") === "on"},
      interests    = ${interests}::text[],
      goals        = ${goals}::text[],
      goal_note    = ${text(formData.get("goal_note"), LIMITS.goalNote)},
      sponsor_tier = ${SPONSOR_CHOICE_IDS.includes(tierRaw) ? tierRaw : null}
    where id = ${user.id}`;

  refresh();
  return { ok: "Saved." };
}

/* ---------- hackathon registration ---------- */

export async function registerAction(prev, formData) {
  const user = await requireOnboarded("/dashboard");

  if (!(await getSetting("registration_open"))) {
    return { error: "Registration is closed. Ask in the Discord — there may still be room." };
  }

  const trackRaw = text(formData.get("track"), 20);
  const track = TRACK_IDS.includes(trackRaw) ? trackRaw : "undecided";

  await sql`
    insert into registrations (user_id, track, product)
    values (${user.id}, ${track}, ${text(formData.get("product"), LIMITS.summary)})
    on conflict (user_id) do update set
      track = excluded.track,
      product = excluded.product,
      withdrawn_at = null,
      registered_at = coalesce(registrations.registered_at, now())`;

  /* Dietary and access notes belong to the person, not to this form —
     the same two questions are asked of judges and sponsors, who
     never touch it. Written here too so registering in one pass still
     captures them. */
  await sql`
    update users set
      dietary     = ${text(formData.get("dietary"), LIMITS.dietary)},
      access_note = ${text(formData.get("note"), LIMITS.note)}
    where id = ${user.id}`;

  /* Anyone can compete — rule 03 — so this role is granted on the
     spot rather than requested. It's what gates the submission form
     and what the crowd-vote check looks at. */
  await sql`
    insert into user_roles (user_id, role) values (${user.id}, 'participant')
    on conflict do nothing`;

  await audit(user.id, "register", user.id, { track });
  refresh();
  return { ok: "You're registered. Next: form a team, or go solo." };
}

/**
 * The two practical questions asked of everyone who'll be in the
 * room, competing or not. Judges, mentors and sponsors get this on
 * its own rather than the whole registration form — they aren't
 * entering, and asking them which track they're on would be noise.
 */
export async function saveAttendanceAction(prev, formData) {
  const user = await requireOnboarded("/dashboard");

  await sql`
    update users set
      dietary     = ${text(formData.get("dietary"), LIMITS.dietary)},
      access_note = ${text(formData.get("note"), LIMITS.note)}
    where id = ${user.id}`;

  refresh();
  return { ok: "Saved. That's everything we need." };
}

export async function withdrawRegistrationAction() {
  const user = await requireUser("/dashboard");
  await sql`update registrations set withdrawn_at = now() where user_id = ${user.id}`;
  await audit(user.id, "withdraw-registration", user.id);
  refresh();
}

/* ---------- teams ---------- */

export async function createTeamAction(prev, formData) {
  const user = await requireOnboarded("/dashboard/team");

  const name = text(formData.get("name"), LIMITS.team);
  if (!name) return { error: "Give the team a name. It goes on the certificate." };

  if (await teamFor(user.id)) {
    return { error: "You're already on a team. Leave it first — one team per person." };
  }

  /* Slugs are public (they show up in admin URLs and exports) and the
     column is unique, so a clash walks forward rather than 500s. */
  const base = slugify(name) || "team";
  let slug = base;
  for (let i = 2; i < 40; i += 1) {
    const taken = await sql`select 1 from teams where slug = ${slug} limit 1`;
    if (!taken.length) break;
    slug = `${base}-${i}`;
  }

  let team = null;
  for (let attempt = 0; attempt < 6 && !team; attempt += 1) {
    try {
      team = one(await sql`
        insert into teams (name, slug, invite_code, created_by)
        values (${name}, ${slug}, ${inviteCode()}, ${user.id})
        returning *`);
    } catch (error) {
      // invite_code is unique; a collision is rare and worth one retry
      if (attempt === 5) throw error;
    }
  }

  await sql`
    insert into team_members (team_id, user_id, is_owner)
    values (${team.id}, ${user.id}, true)`;

  await audit(user.id, "create-team", team.id, { name });
  refresh();
  redirect("/dashboard/team");
}

export async function joinTeamAction(prev, formData) {
  const user = await requireOnboarded("/dashboard/team");

  const code = text(formData.get("code"), 16).toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!code) return { error: "Enter the invite code your teammate sent you." };

  if (await teamFor(user.id)) {
    return { error: "You're already on a team. Leave it first — one team per person." };
  }

  const team = one(await sql`select * from teams where invite_code = ${code}`);
  if (!team) return { error: "No team with that code. Check it with whoever sent it." };

  const [{ n }] = await sql`
    select count(*)::int as n from team_members where team_id = ${team.id}`;
  if (n >= MAX_TEAM_SIZE) {
    return { error: `That team is full — ${MAX_TEAM_SIZE} is the cap.` };
  }

  await sql`
    insert into team_members (team_id, user_id) values (${team.id}, ${user.id})
    on conflict do nothing`;

  await audit(user.id, "join-team", team.id, { name: team.name });
  refresh();
  return { ok: `You're on ${team.name}.` };
}

export async function updateTeamAction(prev, formData) {
  const user = await requireUser("/dashboard/team");
  const name = text(formData.get("name"), LIMITS.team);
  if (!name) return { error: "The team needs a name." };

  /* Scoped to a team this user owns — the id never comes from the
     form, so passing someone else's simply matches no rows. */
  const rows = await sql`
    update teams set name = ${name}, tagline = ${text(formData.get("tagline"), 160)}
     where id = (select team_id from team_members
                  where user_id = ${user.id} and is_owner = true)
    returning id`;
  if (!rows.length) return { error: "Only the person who made the team can change this." };

  refresh();
  revalidatePath("/dashboard/team");
  return { ok: "Saved." };
}

export async function leaveTeamAction() {
  const user = await requireUser("/dashboard/team");
  const team = await teamFor(user.id);
  if (!team) return;

  await sql`delete from team_members where user_id = ${user.id}`;

  /* An empty team is a dead row that still holds its name and slug.
     Delete it — and its draft submission with it, by cascade. */
  const [{ n }] = await sql`
    select count(*)::int as n from team_members where team_id = ${team.id}`;
  if (n === 0) {
    await sql`delete from teams where id = ${team.id}`;
  } else {
    /* Never leave a team without an owner. */
    await sql`
      update team_members set is_owner = true
       where team_id = ${team.id}
         and user_id = (select user_id from team_members
                         where team_id = ${team.id} order by joined_at limit 1)`;
  }

  await audit(user.id, "leave-team", team.id);
  refresh();
}

export async function removeMemberAction(prev, formData) {
  const user = await requireUser("/dashboard/team");
  const memberId = text(formData.get("member_id"), 40);
  if (memberId === user.id) return { error: "Use “Leave team” to remove yourself." };

  const rows = await sql`
    delete from team_members
     where user_id = ${memberId}
       and team_id = (select team_id from team_members
                       where user_id = ${user.id} and is_owner = true)
    returning team_id`;
  if (!rows.length) return { error: "Only the team owner can remove someone." };

  await audit(user.id, "remove-member", memberId, { team: rows[0].team_id });
  refresh();
  return { ok: "Removed." };
}

export async function regenerateInviteAction() {
  const user = await requireUser("/dashboard/team");
  await sql`
    update teams set invite_code = ${inviteCode()}
     where id = (select team_id from team_members
                  where user_id = ${user.id} and is_owner = true)`;
  refresh();
}

/* ---------- the submission ---------- */

/** Reads the form into the submission shape, validating as it goes. */
function readSubmission(formData) {
  const category = text(formData.get("category"), 80);
  const track = text(formData.get("track"), 20);
  return {
    project: text(formData.get("project"), LIMITS.project),
    track: TRACK_IDS.includes(track) ? track : "",
    category: CATEGORY_NAMES.includes(category) ? category : "",
    live_url: safeUrl(formData.get("live_url")),
    repo_url: safeUrl(formData.get("repo_url")),
    summary: text(formData.get("summary"), LIMITS.summary),
    launch: text(formData.get("launch"), LIMITS.launch),
    receipts: text(formData.get("receipts"), LIMITS.receipts),
    growth: text(formData.get("growth"), LIMITS.growth),
  };
}

/** The four things rule 04 and the submission page say are required. */
function missingFields(entry) {
  const missing = [];
  if (!entry.project) missing.push("a project name");
  if (!entry.category) missing.push("a category");
  if (!entry.live_url) missing.push("a live URL");
  if (!entry.receipts) missing.push("receipts");
  return missing;
}

export async function saveSubmissionAction(prev, formData) {
  const user = await requireOnboarded("/dashboard/submission");
  const team = await teamFor(user.id);
  if (!team) return { error: "Form a team first — solo teams of one are fine." };

  if (!(await submissionsOpen())) {
    return { error: `Submissions closed at ${EVENT.deadline}. No late submissions.` };
  }

  const entry = readSubmission(formData);
  const finalize = String(formData.get("intent")) === "submit";

  if (finalize) {
    const missing = missingFields(entry);
    if (missing.length) {
      return { ...entry, error: `Still needs ${missing.join(", ")}.` };
    }
  }

  const existing = await submissionForTeam(team.id);
  const status = finalize ? "submitted" : existing?.status ?? "draft";

  await sql`
    insert into submissions
      (team_id, project, track, category, live_url, repo_url, summary, launch, receipts, growth,
       status, submitted_at)
    values
      (${team.id}, ${entry.project}, ${entry.track}, ${entry.category}, ${entry.live_url},
       ${entry.repo_url}, ${entry.summary}, ${entry.launch}, ${entry.receipts}, ${entry.growth},
       ${status}, ${finalize ? new Date().toISOString() : null})
    on conflict (team_id) do update set
      project = excluded.project,
      track = excluded.track,
      category = excluded.category,
      live_url = excluded.live_url,
      repo_url = excluded.repo_url,
      summary = excluded.summary,
      launch = excluded.launch,
      receipts = excluded.receipts,
      growth = excluded.growth,
      status = ${status},
      submitted_at = coalesce(submissions.submitted_at, excluded.submitted_at),
      updated_at = now()`;

  refresh();
  revalidatePath("/dashboard/submission");

  if (finalize && !existing?.submitted_at) {
    await audit(user.id, "submit", team.id, { project: entry.project });
    for (const member of team.members) {
      await submissionReceiptEmail({
        to: member.email,
        project: entry.project,
        category: entry.category,
        deadline: EVENT.deadline,
      });
    }
    await adminNotice({
      subject: `Submission: ${entry.project} (${team.name})`,
      lines: [
        `Team: ${team.name}`,
        `Category: ${entry.category}`,
        `Live URL: ${entry.live_url}`,
        "",
        entry.summary,
      ],
      cta: { href: "https://www.shipai.club/admin/submissions", label: "Open the admin" },
      replyTo: team.members.find((m) => m.is_owner)?.email ?? team.members[0]?.email,
    });
    return { ok: "Submitted. You can keep editing until the deadline." };
  }

  return { ok: finalize ? "Updated." : "Draft saved." };
}

/* ---------- role requests: the gated contact form ---------- */

export async function requestRoleAction(prev, formData) {
  const user = await requireOnboarded("/dashboard/requests");

  const role = text(formData.get("role"), 20);
  if (!REQUESTABLE_ROLES.includes(role)) {
    return { error: "Pick sponsor, mentor or judge." };
  }

  if (user.roles?.includes(role)) {
    return { error: `You're already confirmed as a ${roleLabel(role).toLowerCase()}.` };
  }

  const open = await sql`
    select 1 from role_requests
     where user_id = ${user.id} and role = ${role} and status = 'pending' limit 1`;
  if (open.length) {
    return { error: "That request is already in. Santos will come back to you." };
  }

  const message = text(formData.get("message"), LIMITS.message);
  if (!message) {
    return { error: "Say a little about what you have in mind — it's the whole point." };
  }

  const tierRaw = text(formData.get("sponsor_tier"), 40);
  const tier = role === "sponsor" && SPONSOR_CHOICE_IDS.includes(tierRaw) ? tierRaw : null;

  const jobs =
    role === "volunteer" ? pickIds(formData.getAll("jobs"), VOLUNTEER_JOB_IDS) : [];
  if (role === "volunteer" && !jobs.length) {
    return { error: "Pick at least one thing you can cover." };
  }

  await sql`
    insert into role_requests (user_id, role, message, expertise, jobs, sponsor_tier)
    values (${user.id}, ${role}, ${message},
            ${text(formData.get("expertise"), LIMITS.expertise)},
            ${jobs}::text[], ${tier})`;

  await audit(user.id, "request-role", user.id, { role });

  await roleRequestReceivedEmail({ to: user.email, name: user.name, role });
  await adminNotice({
    subject: `${roleLabel(role)} request — ${user.name || user.email}`,
    lines: [
      `${user.name || "(no name)"} <${user.email}>`,
      user.company ? `${user.title || "—"}, ${user.company}` : user.title || "",
      tier ? `Tier: ${tier}` : "",
      "",
      message,
    ].filter(Boolean),
    cta: { href: "https://www.shipai.club/admin/requests", label: "Review the request" },
    /* Hitting reply on this should reach the person who asked. */
    replyTo: user.email,
  });

  refresh();
  revalidatePath("/dashboard/requests");
  return { ok: "Sent. Santos reads every one of these himself." };
}

export async function withdrawRequestAction(prev, formData) {
  const user = await requireUser("/dashboard/requests");
  const id = text(formData.get("request_id"), 40);

  await sql`
    update role_requests set status = 'withdrawn', decided_at = now()
     where id = ${id} and user_id = ${user.id} and status = 'pending'`;

  refresh();
  revalidatePath("/dashboard/requests");
  return { ok: "Withdrawn." };
}

/* ---------- crowd favorite ---------- */

export async function castVoteAction(prev, formData) {
  const user = await requireOnboarded("/dashboard");

  if (!(await getSetting("voting_open"))) {
    return { error: "Voting isn't open yet. It opens at Sunday's pitches." };
  }

  const submissionId = text(formData.get("submission_id"), 40);
  const entry = one(await sql`
    select s.id, s.project, s.team_id from submissions s
     where s.id = ${submissionId} and s.status = 'submitted'`);
  if (!entry) return { error: "That entry isn't in the running." };

  const own = await sql`
    select 1 from team_members where team_id = ${entry.team_id} and user_id = ${user.id}`;
  if (own.length) return { error: "You can't vote for your own team." };

  await sql`
    insert into votes (user_id, submission_id) values (${user.id}, ${submissionId})
    on conflict (user_id) do update set submission_id = excluded.submission_id, cast_at = now()`;

  refresh();
  return { ok: `Voted for ${entry.project || "that entry"}.` };
}
