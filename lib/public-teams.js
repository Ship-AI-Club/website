import "server-only";
import { cache } from "react";
import { sql, safeRead } from "./db";
import { EVENT } from "./hackathon";

export const HACKATHON_PATH = "/programs/zero-to-launch/hackathon";
export const publicTeamPath = team => `${HACKATHON_PATH}/teams/${encodeURIComponent(team.slug)}`;

// Public fields only. Draft project content, private profiles, email addresses,
// invite codes, and judge cards never enter this result.
export const publicTeams = cache(async function publicTeams(slug = null) {
  return safeRead(() => sql`
    select t.name, t.slug, t.tagline, t.logo_url,
           s.id is not null as submitted,
           s.project, s.summary, s.live_url, s.repo_url, s.launch, s.receipts, s.pitch,
           (select count(*)::int from team_members m where m.team_id = t.id) as member_count,
           coalesce((
             select jsonb_agg(jsonb_build_object('name', u.name, 'avatar_url', u.avatar_url,
                                                'company', u.company, 'title', u.title)
                              order by m.joined_at, u.name)
               from team_members m join users u on u.id = m.user_id
              where m.team_id = t.id and u.public_profile = true
                and u.onboarded_at is not null and u.name <> ''
           ), '[]'::jsonb) as members
      from teams t
      left join submissions s on s.team_id = t.id and s.status = 'submitted'
     where t.hackathon_id = ${EVENT.id}
       and (${slug}::text is null or t.slug = ${slug})
     order by lower(t.name), t.slug`, []);
});

export async function publicTeam(slug) {
  return (await publicTeams(slug))[0] ?? null;
}
