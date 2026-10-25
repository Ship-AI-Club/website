// One explicitly requested cleanup, using Vercel's existing credentials.
// The audit row retains the complete team and membership record for recovery.
import { neon } from "@neondatabase/serverless";
import { EVENT } from "../lib/hackathon.js";

const id = process.env.APPLY_EMPTY_TEAM_REMOVAL_ID;
if (!id) {
  console.log("Empty team cleanup skipped: no explicit team ID.");
} else {
  if (id !== "d31098e3-a8b7-4dcd-8b2e-c330f2b0d222") throw new Error("This cleanup is only approved for the Aviva Ounap team.");
  if (process.env.VERCEL !== "1" || process.env.VERCEL_ENV !== "production" || !process.env.DATABASE_URL || process.env.NEON_LOCAL_PROXY) throw new Error("Team cleanup requires the existing Vercel production database.");
  const sql = neon(process.env.DATABASE_URL);
  const removed = await sql`
    with target as (
      select t.* from teams t
       where t.id = ${id} and t.name = 'Aviva Ounap' and t.hackathon_id = ${EVENT.id}
         and not exists (select 1 from submissions s where s.team_id = t.id)
       for update
    ), backed_up as (
      insert into audit_log (actor_id, action, target, meta)
      select (select id from users where email = 'hi@santos.lol' and is_admin = true),
             'delete-empty-team', t.id::text,
             jsonb_build_object('team', to_jsonb(t), 'members',
               coalesce((select jsonb_agg(to_jsonb(m)) from team_members m where m.team_id = t.id), '[]'::jsonb),
               'reason', 'User requested deletion of Team Aviva Ounap; preserve CLICKATICK.')
        from target t returning target
    )
    delete from teams where id in (select id from target)
      and exists (select 1 from backed_up) returning id, name`;
  if (!removed.length) {
    const existing = await sql`select id from teams where id = ${id}`;
    if (existing.length) throw new Error("Team cleanup stopped: team changed or has a submission.");
    console.log("Aviva Ounap team is already removed.");
  } else {
    console.log("Deleted empty team:", JSON.stringify(removed[0]), "Team and membership snapshot saved in audit_log.");
  }
}
