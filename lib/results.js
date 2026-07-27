/* ------------------------------------------------------------------
   Zero to Launch — results, placements and certifications.

   Two promises on /hackathon are backed by this file: every team that
   submits gets a permanent listing on the site, and every team that
   submits gets a certification at a public URL they can link from
   LinkedIn or a job application.

   Fill ENTRANTS in after the awards on Sunday Oct 18. One object per
   submitted team, in any order — the pages sort. Adding an entrant
   creates /hackathon/certificate/<id> at the next build; nothing else
   needs touching.
------------------------------------------------------------------ */

export const EDITION = {
  year: 2026,
  name: "Zero to Launch 2026",
  event: "Zero to Launch — Ship AI Hackathon",
  held: "October 16–18, 2026",
  venue: "Workuity Biltmore",
  city: "Phoenix, AZ",
  /* certifications are issued at the closing ceremony, not on submission */
  issuedISO: "2026-10-18",
  issued: "October 18, 2026",
  issueMonth: 10,
  issueYear: 2026,
  resultsDay: "Sunday October 18, 2026",
};

export const ISSUER = "Ship AI";
export const SITE = "https://www.shipai.club";

/* The judged categories, in award order. Single source of truth: the
   hackathon page renders these as prize cards and the results page
   groups winners by them, so a renamed category can't drift between
   the two. Crowd Favorite is voted by the room, not scored. */
export const CATEGORIES = [
  { name: "Best B2C Launch", copy: "Real users, real traction, from a launch executed during the weekend." },
  { name: "Best B2B Launch", copy: "Real pipeline or paying customers. Design partners and pilots count." },
  { name: "Best Marketing Site", copy: "Craft and conversion. Positioning, clarity, performance, content." },
  { name: "Best Growth Engine", copy: "The most repeatable channel, with the numbers to prove it repeats." },
  {
    name: "Crowd Favorite",
    wide: true,
    voted: true,
    copy: "Voted by the room at Sunday's pitches, not scored by the judges — the build everyone wanted to try, argued about, or wished they'd thought of first. It's the one award you can take home alongside a judged category.",
  },
];

/* ------------------------------------------------------------------
   Entrant shape:

   {
     id:       "ggbucks",              // url slug + credential id, permanent
     team:     "ggbucks",              // team name as it goes on the certificate
     members:  ["Santos Hernandez"],   // 1–4 people
     project:  "ggbucks",
     url:      "https://ggbucks.com",  // the live URL that was launched
     entered:  "Best B2C Launch",      // category entered
     award:    "Best B2C Launch",      // category won, or null
     crowd:    false,                  // also took Crowd Favorite
     blurb:    "One sentence on what it is.",
     submission: "https://github.com/Ship-AI-Club/events/issues/12",
   }
------------------------------------------------------------------ */

export const ENTRANTS = [];

/* Design preview only. Next sets NODE_ENV=production for `next build`,
   so these never reach a deployed page, never get a static route and
   never appear in the listing — they exist so the certificate and
   results templates can be worked on and reviewed before October,
   when ENTRANTS is still empty. Obvious placeholders on purpose: no
   invented person, team or product goes on a public Ship AI page. */
const PREVIEW_ENTRANTS = [
  {
    id: "preview-example-launch",
    team: "Example Team",
    members: ["Example Builder"],
    project: "Example Project",
    url: "https://www.shipai.club/hackathon",
    entered: "Best B2C Launch",
    award: "Best B2C Launch",
    crowd: true,
    blurb: "Placeholder entry used to preview the certificate template in development.",
    preview: true,
  },
  {
    id: "preview-example-entrant",
    team: "Second Example",
    members: ["Example Builder", "Another Example"],
    project: "Another Example Project",
    url: "https://www.shipai.club/hackathon",
    entered: "Best Marketing Site",
    award: null,
    blurb: "Placeholder entry used to preview a non-winning listing in development.",
    preview: true,
  },
];

/* Opt-in by explicit env var rather than by NODE_ENV: a future
   `experimental.allowDevelopmentBuild` in next.config.mjs would flip a
   NODE_ENV check silently and ship the placeholders. SHIPAI_PREVIEW is
   set nowhere but a developer's own shell. */
const PREVIEW = process.env.SHIPAI_PREVIEW === "1";

export const ALL_ENTRANTS = PREVIEW ? [...ENTRANTS, ...PREVIEW_ENTRANTS] : ENTRANTS;

/* Both branches are reachable locally, which is the point of making
   the preview opt-in: run the dev server normally and you see exactly
   what production serves until October (the pending state); run it
   with SHIPAI_PREVIEW=1 and you see the published listing. */
export const RESULTS_PUBLISHED = ALL_ENTRANTS.length > 0;

/* Ids become public URLs and go on certificates, so they get checked
   at module load: a typo fails the build rather than shipping a dead
   credential link, and a duplicate can't hand one team another team's
   certificate (Next dedupes the params, so the second team's URL would
   quietly resolve to the first team's page). */
const ID_RE = /^[a-z0-9][a-z0-9-]*$/;
const seenIds = new Set();
for (const e of ALL_ENTRANTS) {
  if (!ID_RE.test(e.id)) {
    throw new Error(`results.js: entrant id "${e.id}" must be lowercase a–z, 0–9 and hyphens.`);
  }
  if (seenIds.has(e.id)) {
    throw new Error(`results.js: duplicate entrant id "${e.id}" — ids are permanent and unique.`);
  }
  seenIds.add(e.id);
}

export function entrantById(id) {
  return ALL_ENTRANTS.find((e) => e.id === id);
}

/* Winners first, in category order, then everyone else alphabetically.
   Placing is not a ranking of the rest — an entrant who launched and
   didn't place still shipped, which is the whole point of the weekend. */
export function sortedEntrants() {
  const order = new Map(CATEGORIES.map((c, i) => [c.name, i]));
  return [...ALL_ENTRANTS].sort((a, b) => {
    const ai = a.award ? order.get(a.award) ?? 98 : 99;
    const bi = b.award ? order.get(b.award) ?? 98 : 99;
    if (ai !== bi) return ai - bi;
    return a.team.localeCompare(b.team);
  });
}

export function winners() {
  return CATEGORIES.map((c) => ({
    category: c,
    entrant: ALL_ENTRANTS.find((e) => (c.voted ? e.crowd : e.award === c.name)),
  })).filter((w) => w.entrant);
}

/* What goes on the certificate and in the listing's placement column. */
export function placementOf(e) {
  if (e.award && e.crowd) return `Winner — ${e.award} · Crowd Favorite`;
  if (e.award) return `Winner — ${e.award}`;
  if (e.crowd) return "Winner — Crowd Favorite";
  return "Launched";
}

export function isWinner(e) {
  return Boolean(e.award || e.crowd);
}

/* The credential's own name, as it reads on LinkedIn. */
export function credentialName(e) {
  if (e.award) return `${EDITION.name} — Winner, ${e.award}`;
  if (e.crowd) return `${EDITION.name} — Winner, Crowd Favorite`;
  return `${EDITION.name} — Launch Certification`;
}

export function certPath(e) {
  return `/hackathon/certificate/${encodeURIComponent(e.id)}`;
}

export function certUrl(e) {
  return `${SITE}${certPath(e)}`;
}

/* LinkedIn retired prefilled add-to-profile links — the parameters are
   accepted and then ignored, and the user lands on an empty
   certification form. So the link only opens the right form, and the
   fields it asks for are published here for copying instead. Don't
   re-add the promise of prefilling without re-testing it first. */
export const LINKEDIN_ADD_URL =
  "https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME";

/* Exactly the fields LinkedIn's certification form asks for, in the
   order it asks for them. */
export function certFields(e) {
  return [
    ["Name", credentialName(e)],
    ["Issuing organization", ISSUER],
    ["Issue date", `${EDITION.issueMonth}/${EDITION.issueYear}`],
    ["Credential ID", e.id],
    ["Credential URL", certUrl(e)],
  ];
}
