/* ------------------------------------------------------------------
   Zero to Launch — results, placements and certifications.

   Two promises on /programs/zero-to-launch/hackathon are backed by this file: every team that
   submits gets a permanent listing on the site, and every team that
   submits gets a certification at a public URL they can link from
   LinkedIn or a job application.

   The entrants themselves are no longer written here. They're rows in
   the `certificates` table, issued from /admin after the awards on
   Sunday Oct 18 — one click, no deploy. What stays in this file is
   everything that decides how a credential *reads*: the edition, the
   categories, the placement wording, the LinkedIn field list and the
   sort order. That is presentation, it belongs in source, and it is
   reviewable months before anybody wins anything.
------------------------------------------------------------------ */

import { EVENT, HACKATHON_PRIZES } from "./hackathon";
import { SUBMISSION_CATEGORY } from "./submissions";

export const EDITION = {
  year: 2026,
  name: "Ship AI AZ GTM Hackathon 2026",
  event: EVENT.name,
  held: EVENT.dates,
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

/* All submissions compete for the marketing site prizes. Teams do not
   pick a category: the judges place the top three, and the room votes
   Crowd Favorite separately. `award` on a certificate is the place. */
const PLACE_COPY = {
  "First place": "The team that shipped the best marketing site, judged on design, craft, and evidence of what shipped.",
  "Second place": "Second on the judges' scorecard for design, craft, and evidence of what shipped.",
  "Third place": "Third on the judges' scorecard for design, craft, and evidence of what shipped.",
};

export const CATEGORIES = [
  ...HACKATHON_PRIZES.map((prize) => ({
    name: prize.name,
    copy: PLACE_COPY[prize.name],
  })),
  {
    name: "Crowd Favorite",
    wide: true,
    voted: true,
    copy: "The room's favorite site from Sunday's pitches. A team can also win a judged place.",
  },
];

/* ------------------------------------------------------------------
   Entrant shape.

   Entrants are no longer written here — they're rows in the
   `certificates` table, issued from /admin once the awards are done,
   and this file is what turns one into the words on a certificate.
   fromCertificate() is the only adapter; everything downstream sees
   the same plain object it always did:

   {
     id:       "ggbucks",              // url slug + credential id, permanent
     team:     "ggbucks",              // team name as it goes on the certificate
     members:  ["Santos Hernandez"],   // 1–4 people
     project:  "ggbucks",
     url:      "https://ggbucks.com",  // the live URL that was launched
     entered:  "Best Marketing Site",      // category entered
     award:    "First place",              // place won, or null
     crowd:    false,                  // also took Crowd Favorite
     blurb:    "One sentence on what it is.",
   }
------------------------------------------------------------------ */

export function fromCertificate(row) {
  if (!row) return null;
  return {
    id: row.id,
    team: row.team,
    project: row.project || row.team,
    members: row.members ?? [],
    url: row.url ?? "",
    entered: row.entered || SUBMISSION_CATEGORY,
    award: row.award ?? null,
    crowd: Boolean(row.crowd),
    blurb: row.blurb ?? "",
    issuedISO: row.issued_at ? new Date(row.issued_at).toISOString().slice(0, 10) : EDITION.issuedISO,
  };
}

/* Design preview only — see previewEntrants() below for how they're
   gated. Obvious placeholders on purpose: no invented person, team or
   product goes on a public Ship AI page. */
const PREVIEW_ENTRANTS = [
  {
    id: "preview-example-launch",
    team: "Example Team",
    members: ["Example Builder"],
    project: "Example Project",
    url: "https://www.shipai.club/programs/zero-to-launch/hackathon",
    entered: "Best Marketing Site",
    award: null,
    crowd: true,
    blurb: "Placeholder entry used to preview the certificate template in development.",
    preview: true,
  },
  {
    id: "preview-example-entrant",
    team: "Second Example",
    members: ["Example Builder", "Another Example"],
    project: "Another Example Project",
    url: "https://www.shipai.club/programs/zero-to-launch/hackathon",
    entered: "Best Marketing Site",
    award: null,
    blurb: "Placeholder entry used to preview a non-winning listing in development.",
    preview: true,
  },
  ...[
    ["dropdone", "Dropdone", "First place"],
    ["agent-task-lock", "Agent Task Lock", "Second place"],
    ["orvis", "Orvis", "Third place"],
  ].map(([id, team, award]) => ({
    id,
    team,
    members: [],
    project: team,
    url: "",
    entered: SUBMISSION_CATEGORY,
    award,
    crowd: false,
    blurb: "",
    preview: true,
  })),
];

/* Opt-in by explicit env var rather than by NODE_ENV: a future
   `experimental.allowDevelopmentBuild` in next.config.mjs would flip a
   NODE_ENV check silently and ship the placeholders. SHIPAI_PREVIEW is
   set nowhere but a developer's own shell.

   Still worth keeping now that entrants live in the database: it lets
   the certificate and results templates be worked on without a
   database at all, which is the difference between designing them in
   July and designing them at 11pm on the Sunday. */
export function previewEntrants() {
  return process.env.SHIPAI_PREVIEW === "1" ? PREVIEW_ENTRANTS : [];
}

/* Winners first, in category order, then everyone else alphabetically.
   Placing is not a ranking of the rest — an entrant who launched and
   didn't place still shipped, which is the whole point of the weekend. */
export function sortedEntrants(entrants = []) {
  const order = new Map(CATEGORIES.map((c, i) => [c.name, i]));
  return [...entrants].sort((a, b) => {
    const ai = a.award ? order.get(a.award) ?? 98 : 99;
    const bi = b.award ? order.get(b.award) ?? 98 : 99;
    if (ai !== bi) return ai - bi;
    return a.team.localeCompare(b.team);
  });
}

export function winners(entrants = []) {
  return CATEGORIES.map((c) => ({
    category: c,
    entrant: entrants.find((e) => (c.voted ? e.crowd : e.award === c.name)),
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
  return `/programs/zero-to-launch/hackathon/certificate/${encodeURIComponent(e.id)}`;
}

export function certUrl(e) {
  return `${SITE}${certPath(e)}`;
}

/* The company page the credential is issued under, so LinkedIn shows
   the Ship AI logo and links the credential to the page. */
export const LINKEDIN_ORG_ID = "133437155";

/* LinkedIn's add-to-profile form. The parameters are the documented
   ones; certFields() below stays on the page as the copy-paste
   fallback for when the form opens empty. */
export function linkedinAddUrl(e) {
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: credentialName(e),
    organizationId: LINKEDIN_ORG_ID,
    issueYear: String(EDITION.issueYear),
    issueMonth: String(EDITION.issueMonth),
    certUrl: certUrl(e),
    certId: e.id,
  });
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

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
