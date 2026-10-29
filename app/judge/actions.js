"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "../../lib/auth";
import { sql, one } from "../../lib/db";
import { LIMITS, text } from "../../lib/accounts";
import { EVENT } from "../../lib/hackathon";
import { hackathonById } from "../../lib/hackathons";

/* ------------------------------------------------------------------
   Scoring.

   A judge can only ever write to a submission they were assigned, and
   never to one their own team entered. Both are checked here against
   the session, not against anything the form said — the submission id
   in the form is a claim, and this is where it gets tested.

   A card can be saved half-finished and finished later; only a card
   with `submitted_at` set counts toward an average (see
   weightedScore(), which returns null until every axis has a number).
------------------------------------------------------------------ */

function axis(formData, key, min, max) {
  const raw = formData.get(key);
  if (raw === null || raw === "") return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < min || n > max) return null;
  return n;
}

export async function saveScoreAction(prev, formData) {
  const judge = await requireRole("judge", "/judge");

  const submissionId = text(formData.get("submission_id"), 40);
  const finalize = String(formData.get("intent")) === "submit";
  const notes = text(formData.get("notes"), LIMITS.notes);

  const assignment = one(await sql`
    select ja.submission_id, s.team_id, s.project, t.hackathon_id
      from judge_assignments ja
      join submissions s on s.id = ja.submission_id
      join teams t on t.id = s.team_id
     where ja.submission_id = ${submissionId} and ja.judge_id = ${judge.id}`);
  if (!assignment) {
    return { error: "That entry isn't assigned to you." };
  }

  const conflict = await sql`
    select 1 from team_members
     where team_id = ${assignment.team_id} and user_id = ${judge.id}`;
  if (conflict.length) {
    return { error: "You're on that team. Tell the organisers — this shouldn't be on your list." };
  }

  const hackathon = hackathonById(assignment.hackathon_id);
  if (!hackathon) return { error: "That entry isn't part of a hackathon being judged." };
  const { rubric, scoreMin, scoreMax } = hackathon;
  const card = Object.fromEntries(rubric.map((c) => [c.key, axis(formData, c.key, scoreMin, scoreMax)]));
  const missing = rubric.filter((c) => card[c.key] === null);

  if (finalize && missing.length) {
    return {
      ...card,
      notes,
      error: `Score every axis before filing — still missing ${missing
        .map((c) => c.name.toLowerCase())
        .join(", ")}.`,
    };
  }

  if (hackathon.criteriaColumn) {
    await sql`
      insert into scores (submission_id, judge_id, criteria, notes, submitted_at)
      values (${submissionId}, ${judge.id}, ${JSON.stringify(card)}::jsonb, ${notes},
              ${finalize ? new Date().toISOString() : null})
      on conflict (submission_id, judge_id) do update set
        criteria = excluded.criteria,
        notes = excluded.notes,
        submitted_at = ${finalize ? new Date().toISOString() : null},
        updated_at = now()`;
  } else await sql`
    insert into scores (submission_id, judge_id, design, receipts, craft, notes, submitted_at)
    values (${submissionId}, ${judge.id}, ${card.design}, ${card.receipts},
            ${card.craft}, ${notes}, ${finalize ? new Date().toISOString() : null})
    on conflict (submission_id, judge_id) do update set
      design = excluded.design,
      receipts = excluded.receipts,
      craft = excluded.craft,
      notes = excluded.notes,
      submitted_at = ${finalize ? new Date().toISOString() : null},
      updated_at = now()`;

  revalidatePath("/judge", "layout");
  revalidatePath("/admin/scores");

  return {
    ...card,
    notes,
    ok: finalize ? `Card filed for ${assignment.project || "that entry"}.` : "Draft saved.",
  };
}

// The shared lineup is open to the whole judging panel immediately. Create
// coverage when a judge saves, so these cards also appear in existing reports.
export async function savePresentationScoreAction(prev, formData) {
  const judge = await requireRole("judge", "/judge/presentations");
  const submissionId = text(formData.get("submission_id"), 40);
  if (!/^[0-9a-f-]{36}$/i.test(submissionId)) return { error: "Choose a submitted project." };
  const hackathonId = hackathonById(text(formData.get("hackathon"), 60))?.id ?? EVENT.id;

  const eligible = one(await sql`
    select s.id,
           exists (select 1 from team_members tm
                    where tm.team_id = s.team_id and tm.user_id = ${judge.id}) as conflict
      from submissions s join teams t on t.id = s.team_id
     where s.id = ${submissionId} and s.status = 'submitted' and t.hackathon_id = ${hackathonId}`);
  if (!eligible) return { error: "That project is no longer submitted. Refresh the lineup." };
  if (eligible.conflict) return { error: "You cannot score your own team's project." };

  await sql`
    insert into judge_assignments (submission_id, judge_id)
    values (${submissionId}, ${judge.id}) on conflict do nothing`;

  const advance = formData.get("intent") === "next";
  if (advance) formData.set("intent", "submit");
  const result = await saveScoreAction(prev, formData);
  if (result.ok && advance) {
    const [next] = await sql`
      select later.id from submissions later join teams t on t.id = later.team_id
      join submissions current on current.id = ${submissionId}
       where later.status = 'submitted' and t.hackathon_id = ${hackathonId}
         and (coalesce(later.submitted_at, 'infinity'::timestamptz), later.created_at, later.id)
           > (coalesce(current.submitted_at, 'infinity'::timestamptz), current.created_at, current.id)
       order by later.submitted_at asc nulls last, later.created_at, later.id limit 1`;
    if (next) return { ...result, nextUrl: `/judge/presentations?event=${hackathonId}&team=${next.id}` };
  }
  return result;
}
