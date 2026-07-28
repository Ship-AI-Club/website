"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "../../lib/auth";
import { sql, one } from "../../lib/db";
import { LIMITS, RUBRIC, SCORE_MAX, text } from "../../lib/accounts";

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

function axis(formData, key) {
  const raw = formData.get(key);
  if (raw === null || raw === "") return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0 || n > SCORE_MAX) return null;
  return n;
}

export async function saveScoreAction(prev, formData) {
  const judge = await requireRole("judge", "/judge");

  const submissionId = text(formData.get("submission_id"), 40);
  const finalize = String(formData.get("intent")) === "submit";
  const notes = text(formData.get("notes"), LIMITS.notes);

  const assignment = one(await sql`
    select ja.submission_id, s.team_id, s.project
      from judge_assignments ja
      join submissions s on s.id = ja.submission_id
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

  const card = Object.fromEntries(RUBRIC.map((c) => [c.key, axis(formData, c.key)]));
  const missing = RUBRIC.filter((c) => card[c.key] === null);

  if (finalize && missing.length) {
    return {
      ...card,
      notes,
      error: `Score every axis before filing — still missing ${missing
        .map((c) => c.name.toLowerCase())
        .join(", ")}.`,
    };
  }

  await sql`
    insert into scores (submission_id, judge_id, shipped, receipts, growth, craft, notes, submitted_at)
    values (${submissionId}, ${judge.id}, ${card.shipped}, ${card.receipts}, ${card.growth},
            ${card.craft}, ${notes}, ${finalize ? new Date().toISOString() : null})
    on conflict (submission_id, judge_id) do update set
      shipped = excluded.shipped,
      receipts = excluded.receipts,
      growth = excluded.growth,
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
