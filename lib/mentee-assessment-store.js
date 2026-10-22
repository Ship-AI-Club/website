import "server-only";
import { sql } from "./db";

let ready;
export function menteeAssessmentStorage() {
  if (!ready) ready = sql`create table if not exists mentee_ai_assessments (
      id uuid primary key default gen_random_uuid(),
      mentee_name text not null, venture text not null default '', email text not null default '',
      session_date date, program text not null default 'Venture Café Phoenix',
      scores jsonb not null default '{}'::jsonb, notes jsonb not null default '{}'::jsonb,
      next_steps text not null default '', created_by uuid,
      created_at timestamptz not null default now(), updated_at timestamptz not null default now()
    )`.catch((error) => { ready = undefined; throw error; });
  return ready;
}

export async function listMenteeAssessments() {
  await menteeAssessmentStorage();
  return sql`select id, mentee_name, venture, session_date::text as session_date, scores, updated_at
    from mentee_ai_assessments order by coalesce(session_date, created_at::date) desc, created_at desc limit 500`;
}

export async function getMenteeAssessment(id) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id))) return null;
  await menteeAssessmentStorage();
  const [row] = await sql`select id, mentee_name, venture, email, session_date::text as session_date, scores, notes, next_steps from mentee_ai_assessments where id = ${id}`;
  return row || null;
}
