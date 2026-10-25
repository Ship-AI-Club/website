import "server-only";

import { sql } from "./db";
import { EVENT } from "./hackathon";

// Everyone sees the same order. Later submissions join the end of the lineup.
// Only the current viewer's card is returned to the page.
export async function presentationQueue(judgeId) {
  return sql`
    select s.id, s.team_id, s.project, s.live_url, s.repo_url, s.summary,
           s.launch, s.receipts, s.pitch, t.name as team_name,
           sc.design, sc.craft, sc.receipts as score_receipts,
           sc.notes, sc.submitted_at as scored_at,
           exists (select 1 from team_members tm
                    where tm.team_id = t.id and tm.user_id = ${judgeId}) as conflict,
           array(select coalesce(nullif(u.name, ''), nullif(u.handle, ''), 'Team member')
                   from team_members tm join users u on u.id = tm.user_id
                  where tm.team_id = t.id order by tm.joined_at, tm.user_id) as members
      from submissions s
      join teams t on t.id = s.team_id
      left join scores sc on sc.submission_id = s.id and sc.judge_id = ${judgeId}
     where s.status = 'submitted' and t.hackathon_id = ${EVENT.id}
     order by s.submitted_at asc nulls last, s.created_at, s.id`;
}

export async function presentationSubmission(id) {
  const rows = await sql`
    select s.*, t.name as team_name
      from submissions s join teams t on t.id = s.team_id
     where s.id = ${id} and s.status = 'submitted' and t.hackathon_id = ${EVENT.id}`;
  return rows[0] ?? null;
}
