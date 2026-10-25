import "server-only";
import { createHash } from "node:crypto";
import { sql } from "./db";

// Isolated, idempotent setup also lives in schema.sql for normal migrations.
// First use initializes only these new tables, never unrelated schema changes.
let ready;
export function assessmentStorage() {
  if (!ready) ready = (async () => {
    await sql`create table if not exists workshop_assessments (
      id uuid primary key, email text not null, answers jsonb not null,
      ip_hash text not null, share_token text unique not null,
      status text not null default 'pending', result jsonb,
      created_at timestamptz not null default now()
    )`;
    await sql`create table if not exists workshop_assessment_limits (
      bucket text not null, day date not null default current_date,
      requests integer not null default 1, primary key (bucket, day)
    )`;
  })().catch(error => { ready = undefined; throw error; });
  return ready;
}
export function assessmentIpHash(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`${process.env.AUTH_SECRET || "local"}:${ip}`).digest("hex");
}
// Atomic increments enforce caps across concurrent serverless instances.
export async function takeAssessmentCredit(bucket, limit) {
  const rows = await sql`insert into workshop_assessment_limits (bucket, day, requests)
    values (${bucket}, current_date, 1)
    on conflict (bucket, day) do update set requests = workshop_assessment_limits.requests + 1
      where workshop_assessment_limits.requests < ${limit}
    returning requests`;
  return rows.length > 0;
}
