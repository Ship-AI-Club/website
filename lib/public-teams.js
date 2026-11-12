import "server-only";
import { cache } from "react";
import { sql, safeRead } from "./db";
import { EVENT } from "./hackathon";

export const HACKATHON_PATH = "/programs/zero-to-launch/hackathon";
export const publicTeamPath = team => `${HACKATHON_PATH}/teams/${encodeURIComponent(team.slug)}`;

// Full pitch edits are hosted as public GitHub release assets. Keep the stable
// team route slugs as keys so previously shared team URLs continue to work.
const pitchFiles = {
  tensorverse: { video: "01-tensorverse-linkedin.mp4", poster: "01-tensorverse.jpg" },
  "apimatch-com": { video: "02-apimatch-com-linkedin.mp4", poster: "02-apimatch-com.jpg" },
  "bell-boi": { video: "03-rsvpete-linkedin.mp4", poster: "03-rsvpete.jpg" },
  "nhi-vu": { video: "04-nhi-vu-linkedin.mp4", poster: "04-nhi-vu.jpg" },
  anshul: { video: "05-anshul-linkedin.mp4", poster: "05-anshul.jpg" },
  "sacred-dialogue": { video: "06-sacred-dialogue-linkedin.mp4", poster: "06-sacred-dialogue.jpg" },
  "get-done": { poster: "07-get-done.jpg" },
  proppros: { video: "08-proppros-linkedin.mp4", poster: "08-proppros.jpg" },
  "front-page-kid": { video: "09-front-page-kid-linkedin.mp4", poster: "09-front-page-kid.jpg" },
  clickatick: { video: "10-clickatick-linkedin.mp4", poster: "10-clickatick.jpg" },
  launchcraft: { video: "11-launchcraft-linkedin.mp4", poster: "11-launchcraft.jpg" },
  "zero-to-employed": { video: "12-zero-to-employed-linkedin.mp4", poster: "12-zero-to-employed.jpg" },
  "5-cs-travel": { video: "13-5-cs-travel-linkedin.mp4", poster: "13-5-cs-travel.jpg" },
  "agent-task-lock": { video: "14-agent-task-lock-linkedin.mp4", poster: "14-agent-task-lock.jpg" },
  "internet-sleuth": { video: "15-internet-sleuth-linkedin.mp4", poster: "15-internet-sleuth.jpg" },
  "project-nexus": { video: "16-project-nexus-linkedin.mp4", poster: "16-project-nexus.jpg" },
};

const pitchBaseUrl = "https://github.com/Ship-AI-Club/website/releases/download/shipai-hackathon-pitch-videos-2026-10";
const pitchPosterBase = "/hackathon-team-pitches";

function decorateTeam(team) {
  if (!team) return team;
  const rsvpete = team.slug === "bell-boi";
  const { video, poster } = pitchFiles[team.slug] || {};
  return {
    ...team,
    /* the name the team registered under, before any display rename
       below: certificates are issued in that name */
    registered_name: team.name,
    ...(team.slug === "5-cs-travel" ? { live_url: "https://5cstravel.net/" } : {}),
    ...(rsvpete ? {
      name: "RSVPete",
      project: "RSVPete",
      live_url: "https://rsvpete.com",
      summary: "An AI event helper accessed from a custom keyboard, helping people create and share plans from the messaging apps they already use.",
    } : {}),
    pitch_video_url: video ? `${pitchBaseUrl}/${video}` : null,
    pitch_video_poster_url: poster ? `${pitchPosterBase}/${poster}` : null,
  };
}

/* Design preview only, for working on the team page without a database.
   Returned when SHIPAI_PREVIEW=1 is set in a developer's own shell and
   the query comes back empty (see previewEntrants in lib/results.js for
   the same switch). Obvious placeholders on purpose: no invented person,
   team or product goes on a public Ship AI page. The first entry borrows
   one public pitch recording so the video layout can be seen. */
const LOREM = "Placeholder answer used to preview the team page in development. It runs to a few sentences so the row has something to open. See https://www.shipai.club/programs/zero-to-launch/hackathon for the event, or example.com/path for a bare address.\n- A first line in a list.\n- A second line in a list.";
const PREVIEW_TEAMS = [
  {
    name: "Example Team", slug: "example-team", tagline: "", logo_url: "", submitted: true,
    project: "Example Project", summary: "Placeholder summary used to preview the team page in development. One paragraph on what the project does and who it is for.",
    live_url: "https://www.shipai.club", repo_url: "https://github.com/Ship-AI-Club", launch: LOREM, receipts: LOREM,
    pitch: { mode: "custom", deck_url: "https://www.shipai.club", positioning: LOREM, icp: LOREM, design: LOREM },
    member_count: 3, members: [{ name: "Example Builder", title: "Designer", company: "Example Co" }, { name: "Another Example" }, { name: "Third Example" }],
    pitch_video_url: `${pitchBaseUrl}/01-tensorverse-linkedin.mp4`, pitch_video_poster_url: `${pitchPosterBase}/01-tensorverse.jpg`,
  },
  {
    name: "Second Example", slug: "second-example", tagline: "A placeholder tagline for the preview.", logo_url: "", submitted: true,
    project: "Second Example", summary: "Placeholder summary for an entry with a preview image and no recording.",
    live_url: "https://www.shipai.club", repo_url: "", launch: "", receipts: LOREM, pitch: {},
    member_count: 1, members: [{ name: "Example Builder" }],
    pitch_video_url: null, pitch_video_poster_url: `${pitchPosterBase}/07-get-done.jpg`,
  },
  {
    name: "Third Example", slug: "third-example", tagline: "", logo_url: "", submitted: true,
    project: "A Third Example Project With A Long Name", summary: "", live_url: "https://www.shipai.club", repo_url: "",
    launch: "", receipts: "example.com", pitch: {}, member_count: 1, members: [],
    pitch_video_url: null, pitch_video_poster_url: null,
  },
  {
    name: "Fourth Example", slug: "fourth-example", tagline: "", logo_url: "", submitted: false,
    project: "", summary: "", live_url: "", repo_url: "", launch: "", receipts: "", pitch: {},
    member_count: 2, members: [{ name: "Example Builder" }],
    pitch_video_url: null, pitch_video_poster_url: null,
  },
];

// Public fields only. Draft project content, private profiles, email addresses,
// invite codes, and judge cards never enter this result.
export const publicTeams = cache(async function publicTeams(slug = null) {
  const teams = await safeRead(() => sql`
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
  if (!teams.length && process.env.SHIPAI_PREVIEW === "1") {
    return PREVIEW_TEAMS.filter((team) => !slug || team.slug === slug);
  }
  return teams.map(decorateTeam)
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()) || a.slug.localeCompare(b.slug));
});

export async function publicTeam(slug) {
  return (await publicTeams(slug))[0] ?? null;
}
