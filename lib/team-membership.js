import "server-only";

import { db } from "./db";
import { MAX_TEAM_SIZE } from "./accounts";
import { EVENT } from "./hackathon";

export const SINGLE_TEAM_ERROR = "This hackathon allows one team per person. Leave your current team first.";

// Lock the person before checking their memberships. Joining also locks the
// destination team, so concurrent requests cannot exceed either limit.
// Creation and its owner membership commit together, leaving no orphan team.
export async function createTeamMembership({ userId, name, slug, inviteCode, hackathonId = EVENT.id }) {
  const sql = db();
  const results = await sql.transaction([
    sql`select id from users where id = ${userId} for no key update`,
    sql`
      with created as (
        insert into teams (hackathon_id, name, slug, invite_code, created_by)
        select ${hackathonId}, ${name}, ${slug}, ${inviteCode}, ${userId}
         where coalesce((select value = 'true'::jsonb from settings
                          where key = ${`hackathon:${hackathonId}:multiple_teams_allowed`}),
                        ${hackathonId === EVENT.id && EVENT.allowMultipleTeams === true})
            or not exists (select 1 from team_members m join teams t on t.id = m.team_id
                            where m.user_id = ${userId} and t.hackathon_id = ${hackathonId})
        returning id
      )
      insert into team_members (team_id, user_id, is_owner)
      select id, ${userId}, true from created
      returning team_id as id`,
  ], { isolationLevel: "ReadCommitted" });
  return results[1][0] ?? null;
}

export async function joinTeamMembership({ userId, code, hackathonId = EVENT.id }) {
  const sql = db();
  const results = await sql.transaction([
    sql`select id from users where id = ${userId} for no key update`,
    sql`select id from teams where invite_code = ${code} and hackathon_id = ${hackathonId}
         for no key update`,
    sql`
      with joined as (
        insert into team_members (team_id, user_id)
        select t.id, ${userId} from teams t
         where t.invite_code = ${code} and t.hackathon_id = ${hackathonId}
           and (select count(*) from team_members m where m.team_id = t.id) < ${MAX_TEAM_SIZE}
           and (coalesce((select value = 'true'::jsonb from settings
                           where key = ${`hackathon:${hackathonId}:multiple_teams_allowed`}),
                         ${hackathonId === EVENT.id && EVENT.allowMultipleTeams === true})
                or not exists (select 1 from team_members m join teams other on other.id = m.team_id
                                where m.user_id = ${userId} and other.hackathon_id = ${hackathonId}))
        on conflict (team_id, user_id) do nothing
        returning team_id
      )
      select t.id, t.name,
             case when exists (select 1 from joined)
                        or exists (select 1 from team_members m where m.team_id = t.id and m.user_id = ${userId})
                    then 'joined'
                  when (select count(*) from team_members m where m.team_id = t.id) >= ${MAX_TEAM_SIZE}
                    then 'full'
                  else 'single_team' end as result
        from teams t where t.invite_code = ${code} and t.hackathon_id = ${hackathonId}`,
  ], { isolationLevel: "ReadCommitted" });
  return results[2][0] ?? null;
}
