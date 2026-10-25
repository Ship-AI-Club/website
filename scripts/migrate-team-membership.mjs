// Opt in for the release that enables configurable hackathon memberships.
// Vercel runs this with its existing production credentials; no secrets leave it.
import { neon } from "@neondatabase/serverless";
import { EVENT } from "../lib/hackathon.js";

if (process.env.APPLY_TEAM_MEMBERSHIP_MIGRATION !== "1") {
  console.log("Team membership migration skipped: no explicit migration flag.");
} else {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL === "[SENSITIVE]") {
    throw new Error("A configured DATABASE_URL is required for the team membership migration.");
  }
  const sql = neon(process.env.DATABASE_URL);
  const counts = () => sql`select count(*)::int as teams,
    (select count(*)::int from team_members) as memberships from teams`;
  const before = (await counts())[0];
  await sql.transaction([
    sql`select pg_advisory_xact_lock(hashtext('shipai-team-membership-migration'))`,
    sql`alter table teams add column if not exists hackathon_id text not null default 'zero-to-launch-2026'`,
    sql`create index if not exists teams_hackathon_idx on teams (hackathon_id)`,
    sql`create index if not exists team_members_user_idx on team_members (user_id)`,
    sql`drop index if exists team_members_one_per_person`,
    sql`insert into settings (key, value) values (${`hackathon:${EVENT.id}:multiple_teams_allowed`}, 'true'::jsonb)
      on conflict (key) do update set value = excluded.value, updated_at = now()`,
  ]);
  const after = (await counts())[0];
  console.log("Hackathon team membership migration applied:", JSON.stringify({ hackathon: EVENT.id, multipleTeamsAllowed: true, before, after }));
}
