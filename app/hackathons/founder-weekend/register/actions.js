"use server";

import { randomInt } from "node:crypto";
import { revalidatePath } from "next/cache";

import { requireOnboarded, requireUser } from "../../../../lib/auth";
import { sql } from "../../../../lib/db";
import { LIMITS, MAX_TEAM_SIZE, slugify, text } from "../../../../lib/accounts";
import { teamFor } from "../../../../lib/store";
import { createTeamMembership, joinTeamMembership } from "../../../../lib/team-membership";
import { FOUNDER_WEEKEND as FW } from "../../../../lib/founder-weekend";

const RETURN = `${FW.path}/register`;
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ONE_TEAM = "You're already on a Founder Weekend team. Leave it first to start or join another.";

function inviteCode(length = 8) {
  let out = "";
  for (let i = 0; i < length; i += 1) out += CODE_ALPHABET[randomInt(0, CODE_ALPHABET.length)];
  return out;
}

async function audit(actorId, action, target, meta = {}) {
  try {
    await sql`
      insert into audit_log (actor_id, action, target, meta)
      values (${actorId}, ${action}, ${target}, ${JSON.stringify({ ...meta, hackathon: FW.id })}::jsonb)`;
  } catch {}
}

function refresh() {
  revalidatePath(RETURN);
  revalidatePath(FW.path);
}

export async function createFounderTeamAction(prev, formData) {
  const user = await requireOnboarded(RETURN);
  const name = text(formData.get("name"), LIMITS.team);
  if (!name) return { error: "Give the team a name. It goes on the certificate." };

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
      team = await createTeamMembership({ userId: user.id, name, slug, inviteCode: inviteCode(), hackathonId: FW.id });
      if (!team) return { error: ONE_TEAM };
    } catch (error) {
      if (error.code !== "23505" || attempt === 5) throw error;
      slug = `${base}-${inviteCode().toLowerCase()}`;
    }
  }

  await audit(user.id, "create-team", team.id, { name });
  refresh();
  return { ok: `${name} is registered. Send your invite code to your teammates.` };
}

export async function joinFounderTeamAction(prev, formData) {
  const user = await requireOnboarded(RETURN);
  const code = text(formData.get("code"), 16).toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!code) return { error: "Enter the invite code your teammate sent you." };

  const team = await joinTeamMembership({ userId: user.id, code, hackathonId: FW.id });
  if (!team) return { error: "No Founder Weekend team has that code. Check it with whoever sent it." };
  if (team.result === "single_team") return { error: ONE_TEAM };
  if (team.result === "full") return { error: `That team is full. ${MAX_TEAM_SIZE} is the cap.` };

  await audit(user.id, "join-team", team.id, { name: team.name });
  refresh();
  return { ok: `You're on ${team.name}.` };
}

export async function leaveFounderTeamAction(formData) {
  const user = await requireUser(RETURN);
  const teamId = text(formData.get("team_id"), 40);
  if (!teamId) return;
  const team = await teamFor(user.id, teamId, FW.id);
  if (!team) return;

  await sql`delete from team_members where user_id = ${user.id} and team_id = ${team.id}`;
  const [{ n }] = await sql`select count(*)::int as n from team_members where team_id = ${team.id}`;
  if (n === 0) {
    await sql`delete from teams where id = ${team.id}`;
  } else {
    await sql`
      update team_members set is_owner = true
       where team_id = ${team.id}
         and not exists (select 1 from team_members where team_id = ${team.id} and is_owner = true)
         and user_id = (select user_id from team_members
                         where team_id = ${team.id} order by joined_at limit 1)`;
  }

  await audit(user.id, "leave-team", team.id);
  refresh();
}
