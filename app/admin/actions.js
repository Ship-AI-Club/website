"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "../../lib/auth";
import { sql, one } from "../../lib/db";
import {
  LIMITS,
  ROLE_IDS,
  SPONSOR_CHOICE_IDS,
  roleLabel,
  slugify,
  text,
} from "../../lib/accounts";
import { CATEGORIES, EDITION, credentialName, certUrl } from "../../lib/results";
import { TIERS, tierFor } from "../../lib/sponsors";
import { SETTINGS, setSetting } from "../../lib/settings";
import { certificateIssuedEmail, judgeAssignedEmail, roleDecidedEmail } from "../../lib/email";

/* ------------------------------------------------------------------
   Administration.

   Everything in this file changes somebody else's standing — grants a
   role, assigns a judge, issues a credential — so every action starts
   with requireAdmin() and ends with an audit_log row. There is no
   "trust the caller" path: the admin check is a server-side session
   lookup, not a hidden field, and the /admin pages hiding a button is
   presentation only.

   The certificate half is the part to read carefully. A certificate
   id becomes a permanent public URL and a LinkedIn credential id, so
   it is minted once, checked for collisions, and never reused.
------------------------------------------------------------------ */

const CATEGORY_NAMES = CATEGORIES.filter((c) => !c.voted).map((c) => c.name);
const TIER_IDS = TIERS.map((t) => t.id);
const SETTING_KEYS = SETTINGS.map((s) => s.key);

async function audit(actorId, action, target, meta = {}) {
  try {
    await sql`
      insert into audit_log (actor_id, action, target, meta)
      values (${actorId}, ${action}, ${target}, ${JSON.stringify(meta)}::jsonb)`;
  } catch {
    // never blocks the action it describes
  }
}

function refresh() {
  revalidatePath("/admin", "layout");
  revalidatePath("/dashboard", "layout");
}

/* ---------- role requests ---------- */

export async function decideRequestAction(prev, formData) {
  const admin = await requireAdmin();

  const id = text(formData.get("request_id"), 40);
  const approve = String(formData.get("decision")) === "approve";
  const note = text(formData.get("admin_note"), LIMITS.note);

  const request = one(await sql`
    select q.*, u.email, u.name from role_requests q
      join users u on u.id = q.user_id
     where q.id = ${id} and q.status = 'pending'`);
  if (!request) return { error: "That request has already been decided." };

  await sql`
    update role_requests
       set status = ${approve ? "approved" : "declined"},
           admin_note = ${note},
           decided_at = now(),
           decided_by = ${admin.id}
     where id = ${id}`;

  if (approve) {
    await sql`
      insert into user_roles (user_id, role, granted_by)
      values (${request.user_id}, ${request.role}, ${admin.id})
      on conflict do nothing`;

    /* A sponsor request that named a tier becomes a pledged
       sponsorship, so the money side starts tracked rather than
       living in someone's inbox. */
    if (request.role === "sponsor") {
      const tier = TIER_IDS.includes(request.sponsor_tier) ? request.sponsor_tier : null;
      const amount = tier ? TIERS.find((t) => t.id === tier).price : 0;
      await sql`
        insert into sponsorships (user_id, org, tier, amount, status, credit_name)
        values (${request.user_id}, ${request.company ?? ""}, ${tier}, ${amount},
                'pledged', ${request.name ?? ""})`;
    }
  }

  await audit(admin.id, approve ? "approve-request" : "decline-request", request.user_id, {
    role: request.role,
  });

  await roleDecidedEmail({
    to: request.email,
    name: request.name,
    role: request.role,
    approved: approve,
    note,
  });

  refresh();
  return {
    ok: `${request.name || request.email} ${approve ? `is now a ${roleLabel(request.role).toLowerCase()}` : "was declined"}.`,
  };
}

/* ---------- roles, granted directly ---------- */

export async function grantRoleAction(prev, formData) {
  const admin = await requireAdmin();
  const userId = text(formData.get("user_id"), 40);
  const role = text(formData.get("role"), 20);
  if (!ROLE_IDS.includes(role)) return { error: "Unknown role." };

  await sql`
    insert into user_roles (user_id, role, granted_by) values (${userId}, ${role}, ${admin.id})
    on conflict do nothing`;
  if (role === "admin") await sql`update users set is_admin = true where id = ${userId}`;

  await audit(admin.id, "grant-role", userId, { role });
  refresh();
  return { ok: `Granted ${roleLabel(role).toLowerCase()}.` };
}

export async function revokeRoleAction(prev, formData) {
  const admin = await requireAdmin();
  const userId = text(formData.get("user_id"), 40);
  const role = text(formData.get("role"), 20);

  /* Locking yourself out is a one-click mistake with a painful fix
     (hand-written SQL against production), so it isn't allowed. */
  if (role === "admin" && userId === admin.id) {
    return { error: "You can't remove your own admin access." };
  }

  await sql`delete from user_roles where user_id = ${userId} and role = ${role}`;
  if (role === "admin") await sql`update users set is_admin = false where id = ${userId}`;

  await audit(admin.id, "revoke-role", userId, { role });
  refresh();
  return { ok: `Removed ${roleLabel(role).toLowerCase()}.` };
}

/* ---------- judges ---------- */

export async function assignJudgeAction(prev, formData) {
  const admin = await requireAdmin();
  const submissionId = text(formData.get("submission_id"), 40);
  const judgeId = text(formData.get("judge_id"), 40);
  if (!submissionId || !judgeId) return { error: "Pick a judge and a submission." };

  const isJudge = await sql`
    select 1 from user_roles where user_id = ${judgeId} and role = 'judge'`;
  if (!isJudge.length) return { error: "That person isn't a judge yet — grant the role first." };

  /* A judge on the team is a conflict of interest. The scorecard
     refuses it too, but catching it here keeps a bad assignment from
     ever appearing on someone's queue. */
  const conflict = await sql`
    select 1 from team_members m
      join submissions s on s.team_id = m.team_id
     where s.id = ${submissionId} and m.user_id = ${judgeId}`;
  if (conflict.length) return { error: "That judge is on the team. Conflict of interest." };

  await sql`
    insert into judge_assignments (submission_id, judge_id, assigned_by)
    values (${submissionId}, ${judgeId}, ${admin.id})
    on conflict do nothing`;

  await audit(admin.id, "assign-judge", submissionId, { judge: judgeId });
  refresh();
  return { ok: "Assigned." };
}

export async function unassignJudgeAction(prev, formData) {
  const admin = await requireAdmin();
  const submissionId = text(formData.get("submission_id"), 40);
  const judgeId = text(formData.get("judge_id"), 40);

  await sql`
    delete from judge_assignments
     where submission_id = ${submissionId} and judge_id = ${judgeId}`;
  await audit(admin.id, "unassign-judge", submissionId, { judge: judgeId });
  refresh();
  return { ok: "Removed." };
}

/**
 * Deals every submitted entry out to N judges, round-robin, skipping
 * conflicts. Idempotent: existing assignments are left alone and the
 * pass tops each entry up to the target, so running it again after
 * three more teams submit does the obvious thing.
 */
export async function autoAssignJudgesAction(prev, formData) {
  const admin = await requireAdmin();
  const perEntry = Math.min(5, Math.max(1, Number(formData.get("per_entry")) || 3));

  const judges = await sql`
    select u.id from users u join user_roles r on r.user_id = u.id
     where r.role = 'judge' order by u.created_at`;
  if (!judges.length) return { error: "No judges yet. Grant the role first." };

  const submissions = await sql`
    select id, team_id from submissions where status = 'submitted' order by submitted_at`;
  if (!submissions.length) return { error: "Nothing submitted yet." };

  const existing = await sql`select submission_id, judge_id from judge_assignments`;
  const assigned = new Map();
  for (const row of existing) {
    if (!assigned.has(row.submission_id)) assigned.set(row.submission_id, new Set());
    assigned.get(row.submission_id).add(row.judge_id);
  }

  const conflicts = await sql`
    select s.id as submission_id, m.user_id as judge_id
      from submissions s join team_members m on m.team_id = s.team_id`;
  const conflicted = new Set(conflicts.map((c) => `${c.submission_id}:${c.judge_id}`));

  let cursor = 0;
  let added = 0;
  let short = 0;

  for (const submission of submissions) {
    const have = assigned.get(submission.id) ?? new Set();
    let guard = 0;

    while (have.size < perEntry && guard < judges.length * 2) {
      const judge = judges[cursor % judges.length];
      cursor += 1;
      guard += 1;
      if (have.has(judge.id)) continue;
      if (conflicted.has(`${submission.id}:${judge.id}`)) continue;

      await sql`
        insert into judge_assignments (submission_id, judge_id, assigned_by)
        values (${submission.id}, ${judge.id}, ${admin.id})
        on conflict do nothing`;
      have.add(judge.id);
      added += 1;
    }
    /* Ran out of eligible judges before hitting the target — almost
       always conflicts on a small panel. Worth saying out loud: the
       alternative is a silent "all covered" over an entry with one
       judge on it, found on the Sunday. */
    if (have.size < perEntry) short += 1;
    assigned.set(submission.id, have);
  }

  await audit(admin.id, "auto-assign-judges", "all", { perEntry, added, short });
  refresh();

  const shortfall =
    short > 0
      ? ` ${short} ${short === 1 ? "entry is" : "entries are"} still under ${perEntry} — not enough judges without a conflict.`
      : "";

  return {
    ok:
      (added === 0
        ? "Nothing new to assign."
        : `${added} assignment${added === 1 ? "" : "s"} made across ${submissions.length} ${submissions.length === 1 ? "entry" : "entries"}.`) +
      shortfall,
  };
}

/** Tells every judge their queue is ready. Sent by hand, not on assign. */
export async function notifyJudgesAction() {
  const admin = await requireAdmin();
  const rows = await sql`
    select u.email, u.name, count(*)::int as n
      from judge_assignments ja join users u on u.id = ja.judge_id
     group by u.email, u.name`;

  for (const row of rows) {
    await judgeAssignedEmail({ to: row.email, name: row.name, count: row.n });
  }

  await audit(admin.id, "notify-judges", "all", { judges: rows.length });
  return { ok: `Emailed ${rows.length} judge${rows.length === 1 ? "" : "s"}.` };
}

/* ---------- mentors ---------- */

export async function assignMentorAction(prev, formData) {
  const admin = await requireAdmin();
  const teamId = text(formData.get("team_id"), 40);
  const mentorId = text(formData.get("mentor_id"), 40);
  if (!teamId || !mentorId) return { error: "Pick a mentor and a team." };

  const isMentor = await sql`
    select 1 from user_roles where user_id = ${mentorId} and role = 'mentor'`;
  if (!isMentor.length) return { error: "That person isn't a mentor yet — grant the role first." };

  await sql`
    insert into mentor_assignments (team_id, mentor_id, slot, assigned_by)
    values (${teamId}, ${mentorId}, ${text(formData.get("slot"), 60)}, ${admin.id})
    on conflict (team_id, mentor_id) do update set slot = excluded.slot`;

  await audit(admin.id, "assign-mentor", teamId, { mentor: mentorId });
  refresh();
  return { ok: "Assigned." };
}

export async function unassignMentorAction(prev, formData) {
  const admin = await requireAdmin();
  const teamId = text(formData.get("team_id"), 40);
  const mentorId = text(formData.get("mentor_id"), 40);

  await sql`
    delete from mentor_assignments where team_id = ${teamId} and mentor_id = ${mentorId}`;
  await audit(admin.id, "unassign-mentor", teamId, { mentor: mentorId });
  refresh();
  return { ok: "Removed." };
}

/* ---------- sponsorships ---------- */

export async function saveSponsorshipAction(prev, formData) {
  const admin = await requireAdmin();
  const id = text(formData.get("sponsorship_id"), 40);
  const userId = text(formData.get("user_id"), 40);
  const amount = Math.max(0, Math.min(1_000_000, Number(formData.get("amount")) || 0));

  /* Tier is derived from the money unless it's set explicitly — same
     rule as lib/sponsors.js, where stacking two Bronze items makes
     Silver. Hand-writing a tier that the amount doesn't clear is
     allowed (in-kind deals do it), it just isn't the default. */
  const tierRaw = text(formData.get("tier"), 40);
  const tier = SPONSOR_CHOICE_IDS.includes(tierRaw) ? tierRaw : tierFor(amount)?.id ?? null;

  const fields = {
    org: text(formData.get("org"), LIMITS.company),
    items: text(formData.get("items"), LIMITS.items),
    status: text(formData.get("status"), 20) || "pledged",
    credit_name: text(formData.get("credit_name"), LIMITS.company),
    note: text(formData.get("note"), LIMITS.note),
  };

  if (id) {
    await sql`
      update sponsorships set
        org = ${fields.org}, tier = ${tier}, amount = ${amount}, items = ${fields.items},
        status = ${fields.status}, credit_name = ${fields.credit_name}, note = ${fields.note},
        updated_at = now()
      where id = ${id}`;
  } else {
    if (!userId) return { error: "Pick the account this sponsorship belongs to." };
    await sql`
      insert into sponsorships (user_id, org, tier, amount, items, status, credit_name, note)
      values (${userId}, ${fields.org}, ${tier}, ${amount}, ${fields.items},
              ${fields.status}, ${fields.credit_name}, ${fields.note})`;
    await sql`
      insert into user_roles (user_id, role, granted_by) values (${userId}, 'sponsor', ${admin.id})
      on conflict do nothing`;
  }

  await audit(admin.id, "save-sponsorship", userId || id, { amount, tier });
  refresh();
  return { ok: "Saved." };
}

export async function deleteSponsorshipAction(prev, formData) {
  const admin = await requireAdmin();
  const id = text(formData.get("sponsorship_id"), 40);
  await sql`delete from sponsorships where id = ${id}`;
  await audit(admin.id, "delete-sponsorship", id);
  refresh();
  return { ok: "Deleted." };
}

/* ---------- awards ---------- */

export async function setAwardAction(prev, formData) {
  const admin = await requireAdmin();
  const submissionId = text(formData.get("submission_id"), 40);
  const awardRaw = text(formData.get("award"), 80);
  const award = CATEGORY_NAMES.includes(awardRaw) ? awardRaw : null;
  const crowd = formData.get("crowd") === "on" || formData.get("crowd") === "true";

  /* One judged category per team, and one team per category — rule
     09. Clearing the previous holder keeps the results page honest
     without needing a second click. */
  if (award) {
    await sql`update submissions set award = null where award = ${award}`;
  }
  if (crowd) {
    await sql`update submissions set crowd = false where crowd = true`;
  }

  await sql`
    update submissions set award = ${award}, crowd = ${crowd}, updated_at = now()
     where id = ${submissionId}`;

  await audit(admin.id, "set-award", submissionId, { award, crowd });
  refresh();
  revalidatePath("/programs/zero-to-launch/hackathon/results");
  return { ok: award || crowd ? "Award recorded." : "Award cleared." };
}

/* ---------- certificates ---------- */

/** A permanent, unique, human-readable credential id. */
async function mintCertificateId(preferred) {
  const base = slugify(preferred) || "entrant";
  let id = base;
  for (let i = 2; i < 60; i += 1) {
    const taken = await sql`select 1 from certificates where id = ${id} limit 1`;
    if (!taken.length) return id;
    id = `${base}-${i}`;
  }
  return `${base}-${Date.now()}`;
}

async function issueFor(submission, adminId) {
  const existing = one(await sql`
    select * from certificates where submission_id = ${submission.id}`);

  const members = await sql`
    select u.id, u.email, coalesce(nullif(u.name, ''), u.email) as name
      from team_members m join users u on u.id = m.user_id
     where m.team_id = ${submission.team_id}
     order by m.is_owner desc, m.joined_at`;

  const kind = submission.award ? "winner" : submission.crowd ? "crowd" : "launch";
  const shape = {
    kind,
    team: submission.team_name,
    project: submission.project || submission.team_name,
    members: members.map((m) => m.name),
    award: submission.award,
    crowd: submission.crowd,
    url: submission.live_url,
    blurb: (submission.summary || "").slice(0, 300),
  };

  let id = existing?.id;
  if (existing) {
    /* Re-issuing after an award is decided updates the credential in
       place. The id can't change — it's already on somebody's
       LinkedIn — so only the wording moves. */
    await sql`
      update certificates set
        kind = ${shape.kind}, team = ${shape.team}, project = ${shape.project},
        members = ${shape.members}::text[], award = ${shape.award}, crowd = ${shape.crowd},
        url = ${shape.url}, blurb = ${shape.blurb}, revoked_at = null
      where id = ${id}`;
  } else {
    id = await mintCertificateId(submission.project || submission.team_name);
    await sql`
      insert into certificates
        (id, kind, submission_id, team, project, members, award, crowd, url, blurb)
      values
        (${id}, ${shape.kind}, ${submission.id}, ${shape.team}, ${shape.project},
         ${shape.members}::text[], ${shape.award}, ${shape.crowd}, ${shape.url}, ${shape.blurb})`;
  }

  for (const member of members) {
    await sql`
      insert into certificate_holders (certificate_id, user_id) values (${id}, ${member.id})
      on conflict do nothing`;
  }

  await audit(adminId, existing ? "update-certificate" : "issue-certificate", id, {
    submission: submission.id,
  });

  return { id, members, isNew: !existing, shape };
}

/**
 * Issues a certificate to every submitted team that doesn't have one,
 * and refreshes the wording on the ones that do. This is the "after
 * the awards" button: run it once on Sunday evening and every team
 * that submitted has a credential.
 */
export async function issueCertificatesAction(prev, formData) {
  const admin = await requireAdmin();
  const notify = formData.get("notify") === "on";

  const submissions = await sql`
    select s.*, t.name as team_name from submissions s join teams t on t.id = s.team_id
     where s.status = 'submitted' order by s.submitted_at`;
  if (!submissions.length) return { error: "Nothing submitted yet." };

  let issued = 0;
  let updated = 0;

  for (const submission of submissions) {
    const result = await issueFor(submission, admin.id);
    if (result.isNew) issued += 1;
    else updated += 1;

    if (notify && result.isNew) {
      const entrant = {
        id: result.id,
        award: result.shape.award,
        crowd: result.shape.crowd,
      };
      for (const member of result.members) {
        await certificateIssuedEmail({
          to: member.email,
          name: member.name,
          credential: credentialName(entrant),
          url: certUrl(entrant),
        });
      }
    }
  }

  refresh();
  revalidatePath("/programs/zero-to-launch/hackathon/results");
  return {
    ok: `${issued} issued, ${updated} updated. ${EDITION.name} credentials are live.`,
  };
}

export async function revokeCertificateAction(prev, formData) {
  const admin = await requireAdmin();
  const id = text(formData.get("certificate_id"), 80);
  await sql`update certificates set revoked_at = now() where id = ${id}`;
  await audit(admin.id, "revoke-certificate", id);
  refresh();
  revalidatePath("/programs/zero-to-launch/hackathon/results");
  return { ok: "Revoked. The public URL now 404s." };
}

/* ---------- settings ---------- */

export async function setSettingAction(prev, formData) {
  const admin = await requireAdmin();
  const key = text(formData.get("key"), 40);
  if (!SETTING_KEYS.includes(key)) return { error: "Unknown setting." };

  const value = formData.get("value") === "on" || formData.get("value") === "true";
  await setSetting(key, value);

  await audit(admin.id, "set-setting", key, { value });
  refresh();
  revalidatePath("/programs/zero-to-launch/hackathon/results");
  return { ok: `${key.replace(/_/g, " ")} is now ${value ? "on" : "off"}.` };
}
