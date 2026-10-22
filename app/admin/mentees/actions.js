"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "../../../lib/auth";
import { sql } from "../../../lib/db";
import { LIMITS, isEmail, normalizeEmail, text } from "../../../lib/accounts";
import { AREAS, CRITERIA, cleanScores } from "../../../lib/mentee-assessment";
import { getMenteeAssessment, menteeAssessmentStorage } from "../../../lib/mentee-assessment-store";

async function audit(actorId, action, target, meta = {}) {
  try {
    await sql`
      insert into audit_log (actor_id, action, target, meta)
      values (${actorId}, ${action}, ${target}, ${JSON.stringify(meta)}::jsonb)`;
  } catch {
  }
}

function readForm(formData) {
  const scores = cleanScores(Object.fromEntries(CRITERIA.map((c) => [c.key, formData.get(`score:${c.key}`)])));
  const notes = Object.fromEntries(AREAS.map((a) => [a.key, text(formData.get(`note:${a.key}`), LIMITS.notes)]).filter(([, v]) => v));
  const date = text(formData.get("session_date"), 10);
  return {
    name: text(formData.get("mentee_name"), LIMITS.name),
    venture: text(formData.get("venture"), LIMITS.company),
    email: normalizeEmail(formData.get("email")),
    date: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null,
    scores,
    notes,
    nextSteps: text(formData.get("next_steps"), LIMITS.notes),
  };
}

export async function saveMenteeAssessmentAction(prev, formData) {
  const admin = await requireAdmin("/admin/mentees");
  const data = readForm(formData);
  if (!data.name) return { error: "Add the mentee's name." };
  if (data.email && !isEmail(data.email)) return { error: "That email doesn't look right. Leave it blank if you don't have it." };
  await menteeAssessmentStorage();

  const id = text(formData.get("id"), 36);
  if (id) {
    if (!(await getMenteeAssessment(id))) return { error: "That assessment no longer exists." };
    await sql`
      update mentee_ai_assessments set
        mentee_name = ${data.name}, venture = ${data.venture}, email = ${data.email},
        session_date = ${data.date}::date, scores = ${JSON.stringify(data.scores)}::jsonb,
        notes = ${JSON.stringify(data.notes)}::jsonb, next_steps = ${data.nextSteps}, updated_at = now()
      where id = ${id}`;
    await audit(admin.id, "update-mentee-assessment", id);
    revalidatePath("/admin/mentees");
    revalidatePath(`/admin/mentees/${id}`);
    return { ok: "Assessment saved." };
  }

  const [row] = await sql`
    insert into mentee_ai_assessments (mentee_name, venture, email, session_date, scores, notes, next_steps, created_by)
    values (${data.name}, ${data.venture}, ${data.email}, ${data.date}::date,
            ${JSON.stringify(data.scores)}::jsonb, ${JSON.stringify(data.notes)}::jsonb, ${data.nextSteps}, ${admin.id})
    returning id`;
  await audit(admin.id, "create-mentee-assessment", row.id);
  revalidatePath("/admin/mentees");
  redirect(`/admin/mentees/${row.id}`);
}

export async function deleteMenteeAssessmentAction(prev, formData) {
  const admin = await requireAdmin("/admin/mentees");
  const id = text(formData.get("id"), 36);
  if (!(await getMenteeAssessment(id))) return { error: "That assessment no longer exists." };
  await sql`delete from mentee_ai_assessments where id = ${id}`;
  await audit(admin.id, "delete-mentee-assessment", id);
  revalidatePath("/admin/mentees");
  redirect("/admin/mentees");
}
