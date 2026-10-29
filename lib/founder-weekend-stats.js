import "server-only";

import { sql, safeRead } from "./db";
import { FOUNDER_WEEKEND } from "./founder-weekend";

const EMPTY = { teams: 0, participants: 0, projects: 0 };

export async function founderWeekendStats() {
  return safeRead(async () => {
    const [row] = await sql`
      select
        (select count(*)::int from teams where hackathon_id = ${FOUNDER_WEEKEND.id}) as teams,
        (select count(distinct m.user_id)::int from team_members m join teams t on t.id = m.team_id
          where t.hackathon_id = ${FOUNDER_WEEKEND.id}) as participants,
        (select count(*)::int from submissions s join teams t on t.id = s.team_id
          where t.hackathon_id = ${FOUNDER_WEEKEND.id} and s.status = 'submitted') as projects`;
    return row
      ? { teams: Number(row.teams ?? 0), participants: Number(row.participants ?? 0), projects: Number(row.projects ?? 0) }
      : EMPTY;
  }, EMPTY);
}

export async function founderWeekendTeams() {
  return safeRead(() => sql`
    select t.name, t.slug, t.tagline, t.logo_url,
           (select count(*)::int from team_members m where m.team_id = t.id) as member_count
      from teams t
     where t.hackathon_id = ${FOUNDER_WEEKEND.id}
     order by t.created_at, t.slug`, []);
}
