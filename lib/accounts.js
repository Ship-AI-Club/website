/* ------------------------------------------------------------------
   Accounts — the shared vocabulary.

   Interests, roles, goals, the scoring rubric and every field limit
   live here, imported by the forms, the server actions and the admin
   screens alike. The rule is the same one lib/intake.js follows: the
   client and the server validate against one list, in one file, so
   they cannot drift.

   The goals list is not invented. It is the six deliverables from
   /programs/zero-to-launch/hackathon ("What you leave with") plus the reasons people show up
   who aren't competing — so what someone picks at onboarding maps
   one-to-one onto what the site already promises them.
------------------------------------------------------------------ */

import { TIERS } from "./sponsors";

/* ---------- what brought you here ---------- */

export const INTERESTS = [
  {
    id: "participating",
    label: "Participating",
    blurb: "Bring something you've built and launch it during the weekend.",
  },
  {
    id: "sponsoring",
    label: "Sponsoring",
    blurb: "Fund a piece of the program and get your name on it.",
  },
  {
    id: "mentoring",
    label: "Mentoring",
    blurb: "Saturday's 1:1 rotations — an hour with teams who need what you know.",
  },
  {
    id: "judging",
    label: "Judging",
    blurb: "Sunday's pitches. Score against published criteria and present an award.",
  },
  {
    id: "volunteering",
    label: "Volunteering",
    blurb: "A few hours on the door or behind a camera. The weekend doesn't run without it.",
  },
];

export const INTEREST_IDS = INTERESTS.map((i) => i.id);

/* The interest a person picks at onboarding is a statement of intent.
   The role they end up holding is granted by an admin. These are the
   same four words for a reason, but they are not the same thing —
   `interests` on the user row, `user_roles` for the grant. */
export const ROLES = [
  { id: "participant", label: "Participant", interest: "participating" },
  { id: "sponsor", label: "Sponsor", interest: "sponsoring" },
  { id: "mentor", label: "Mentor", interest: "mentoring" },
  { id: "judge", label: "Judge", interest: "judging" },
  { id: "volunteer", label: "Volunteer", interest: "volunteering" },
  { id: "admin", label: "Admin", interest: null },
];

export const ROLE_IDS = ROLES.map((r) => r.id);

/* Roles you can ask for. Participant isn't here — registering for the
   hackathon grants it directly, no approval needed, because the rules
   say anyone can compete. Admin isn't here for obvious reasons. */
export const REQUESTABLE_ROLES = ["sponsor", "mentor", "judge", "volunteer"];

/* ---------- volunteer jobs ---------- */

/* What a volunteer is actually signing up to do. A list rather than a
   role each: adding "rings the bell" next season is a line here and
   no migration, and someone can offer two without filing two
   requests. `hours` is what they're committing to, said out loud,
   because "volunteer" with no number attached is how people end up
   surprised on the day. */
export const VOLUNTEER_JOBS = [
  {
    id: "photography",
    label: "Photography",
    blurb:
      "Shoot the room, the teams and Sunday's pitches. The recap film and every announcement after this one run on those photos.",
    hours: "A few hours, any day",
  },
  {
    id: "checkin",
    label: "Check-in booth",
    blurb:
      "Work the door: badges, names, pointing people at food and power. Friday evening is the busy one.",
    hours: "2–3 hours, Friday or Saturday",
  },
];

export const VOLUNTEER_JOB_IDS = VOLUNTEER_JOBS.map((j) => j.id);

export function volunteerJobLabel(id) {
  return VOLUNTEER_JOBS.find((j) => j.id === id)?.label ?? id;
}

export function roleLabel(id) {
  return ROLES.find((r) => r.id === id)?.label ?? id;
}

export function interestToRole(interest) {
  return ROLES.find((r) => r.interest === interest)?.id ?? null;
}

/* ---------- what you want out of it ---------- */

/* The six deliverables, verbatim from the "What you leave with"
   section of /programs/zero-to-launch/hackathon. If that section changes, change these with
   it — a builder picking "a public launch" here should be picking the
   same thing the page promised them. */
export const BUILDER_GOALS = [
  { id: "positioning", label: "Positioning that holds up" },
  { id: "pitch", label: "An elevator pitch I've delivered" },
  { id: "site", label: "A live marketing site" },
  { id: "launch", label: "A public launch" },
  { id: "growth-engine", label: "A growth engine" },
  { id: "receipts", label: "Receipts — real numbers on the board" },
];

/* Everyone else's reasons, and the ones builders have that aren't
   deliverables. Shown to every account regardless of interest. */
export const COMMUNITY_GOALS = [
  { id: "meet-builders", label: "Meet other builders in Phoenix" },
  { id: "cofounder", label: "Find a co-founder or teammates" },
  { id: "customers", label: "Find customers or design partners" },
  /* Hiring and being hired are opposite sides of the same room and
     want opposite introductions, so they're two answers, not one. */
  { id: "hire", label: "Hire someone" },
  { id: "get-hired", label: "Get hired" },
  { id: "invest", label: "See what's worth investing in" },
  { id: "give-back", label: "Give back — teach what I know" },
  { id: "learn-gtm", label: "Learn GTM engineering properly" },
];

export const ALL_GOALS = [...BUILDER_GOALS, ...COMMUNITY_GOALS];
export const GOAL_IDS = ALL_GOALS.map((g) => g.id);

export function goalLabel(id) {
  return ALL_GOALS.find((g) => g.id === id)?.label ?? id;
}

/* Builder goals are only offered to someone who said they're
   competing — asking a prospective sponsor whether they want an
   elevator pitch is noise. */
export function goalsFor(interests = []) {
  const list = interests.includes("participating") ? BUILDER_GOALS : [];
  return { builder: list, community: COMMUNITY_GOALS };
}

/* ---------- sponsorship interest ---------- */

/* The four tiers as onboarding offers them, plus the two answers the
   tier list doesn't cover. Prices come from lib/sponsors.js so the
   figure someone picks here is the figure on /programs/zero-to-launch/hackathon/sponsor —
   they're published on purpose, and a sponsor should see the same
   number in both places. */
export const SPONSOR_CHOICES = [
  ...TIERS.map((t) => ({
    id: t.id,
    label: `${t.name} — ${t.priceLabel}`,
    blurb: t.buys,
  })),
  {
    id: "in-kind",
    label: "In-kind",
    blurb: "Credits, hours or services rather than cash — they sit on the same ladder.",
  },
  {
    id: "undecided",
    label: "Not sure yet",
    blurb: "Talk it through first. The menu is itemised, so you can fund one thing.",
  },
];

export const SPONSOR_CHOICE_IDS = SPONSOR_CHOICES.map((c) => c.id);

export function sponsorChoiceLabel(id) {
  return SPONSOR_CHOICES.find((c) => c.id === id)?.label ?? id;
}

/* ---------- the rubric ---------- */

/* The four published criteria and their weights, matching the "How
   it's scored" block on /programs/zero-to-launch/hackathon exactly. `key` is the column name
   in the scores table. Each axis is scored 0–10 by each judge; the
   weighted total is what the leaderboard sorts on.

   Changing a weight here changes the scorecard, the leaderboard and
   the public rubric copy together — that is the point of the file. */
export const RUBRIC = [
  {
    key: "shipped",
    pct: 40,
    name: "Did you ship it?",
    copy: "Publicly launched during the weekend, live URL. This gates everything — an unlaunched product cannot place.",
    guide: "0 = nothing reachable. 5 = live but launched before the weekend. 10 = launched publicly during the weekend, working for a stranger.",
  },
  {
    key: "receipts",
    pct: 30,
    name: "Receipts",
    copy: "Evidence over narrative. Small and true beats big and vague.",
    guide: "0 = assertions only. 5 = numbers, thinly evidenced. 10 = numbers on screen, sourced, including the ones that didn't go their way.",
  },
  {
    key: "growth",
    pct: 20,
    name: "Growth engine",
    copy: "Does the channel run again next month without a hero effort?",
    guide: "0 = no channel. 5 = a channel that worked once. 10 = a repeatable channel with the numbers to prove it repeats.",
  },
  {
    key: "craft",
    pct: 10,
    name: "Craft",
    copy: "The site, the product, the taste.",
    guide: "0 = unusable. 5 = competent and unremarkable. 10 = you'd send it to someone.",
  },
];

export const RUBRIC_KEYS = RUBRIC.map((c) => c.key);
export const SCORE_MAX = 10;

/**
 * One judge's weighted score, 0–10 to one decimal. Returns null until
 * every axis has a number — a half-filled card must not drag an
 * average down, so it doesn't count at all.
 */
export function weightedScore(card) {
  if (!card) return null;
  let total = 0;
  for (const c of RUBRIC) {
    const v = card[c.key];
    if (v === null || v === undefined || v === "") return null;
    total += Number(v) * c.pct;
  }
  return Math.round(total / 100 * 10) / 10;
}

/** Mean of the judges who finished their cards. Null if nobody has. */
export function averageScore(cards = []) {
  const totals = cards.map(weightedScore).filter((n) => n !== null);
  if (!totals.length) return null;
  const mean = totals.reduce((a, b) => a + b, 0) / totals.length;
  return Math.round(mean * 10) / 10;
}

/* ---------- tracks and categories ---------- */

export const TRACKS = [
  { id: "b2c", label: "B2C" },
  { id: "b2b", label: "B2B" },
  { id: "undecided", label: "Not sure yet" },
];

export const TRACK_IDS = TRACKS.map((t) => t.id);

/* ---------- field limits ---------- */

/* Every text input is capped server-side. Same shape as
   lib/intake.js FIELD_LIMITS so the two read alike. */
export const LIMITS = {
  name: 120,
  email: 160,
  handle: 32,
  phone: 40,
  title: 160,
  company: 160,
  handle: 80,
  url: 400,
  bio: 600,
  goalNote: 1200,
  message: 4000,
  expertise: 1000,
  team: 80,
  project: 120,
  summary: 800,
  launch: 1500,
  receipts: 2000,
  growth: 1500,
  notes: 4000,
  dietary: 200,
  note: 1000,
  items: 600,
  blurb: 300,
};

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value) {
  return EMAIL_RE.test(String(value ?? "").trim());
}

export function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase().slice(0, LIMITS.email);
}

/** Trim, cap, and never return undefined — the shape every column wants. */
export function text(value, limit = 200) {
  return String(value ?? "").trim().slice(0, limit);
}

/** Keeps only ids that are actually in `allowed`, deduped, order preserved. */
export function pickIds(values, allowed) {
  const list = Array.isArray(values) ? values : values ? [values] : [];
  const seen = new Set();
  const out = [];
  for (const v of list) {
    const id = String(v);
    if (allowed.includes(id) && !seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

/* A URL we're willing to put on a public page. http(s) only — a
   javascript: or data: URL in a submission's "live URL" field would
   otherwise render as a link on the results page. */
export function safeUrl(value, limit = LIMITS.url) {
  const raw = text(value, limit);
  if (!raw) return "";
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.toString().slice(0, limit);
  } catch {
    return "";
  }
}

/* Lowercase, hyphenated, URL-safe. Used for team slugs and the
   certificate ids that become permanent public URLs. */
export function slugify(value, limit = 60) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, limit);
}

export const MAX_TEAM_SIZE = 4;

/* ---------- handles ---------- */

/* Lowercase letters, digits, hyphen and underscore. Deliberately
   narrower than slugify(): a handle is typed by a person, read aloud
   at a table and shown next to their face, so it should look like a
   username rather than a URL fragment. */
const HANDLE_RE = /^[a-z0-9][a-z0-9_-]{1,31}$/;

export const HANDLE_RULES =
  "2–32 characters: lowercase letters, numbers, hyphen or underscore.";

export function normalizeHandle(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/^@+/, "")
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "")
    .slice(0, LIMITS.handle);
}

export function isHandle(value) {
  return HANDLE_RE.test(String(value ?? ""));
}

/* A first guess at a handle from a display name, so the field arrives
   filled in rather than as another thing to invent. */
export function suggestHandle(name) {
  return normalizeHandle(String(name ?? "").replace(/\s+/g, "-")) || "";
}

/* Handles that would read as the club speaking rather than a person,
   or that collide with a route. */
export const RESERVED_HANDLES = [
  "admin", "administrator", "shipai", "ship-ai", "team", "teams", "judge",
  "judges", "mentor", "mentors", "sponsor", "sponsors", "dashboard", "login",
  "logout", "onboarding", "hackathon", "api", "auth", "settings", "profile",
  "certificate", "certificates", "results", "support", "help", "root", "null",
];

export function handleAvailableShape(value) {
  const handle = normalizeHandle(value);
  if (!handle) return { error: "Pick a handle." };
  if (!isHandle(handle)) return { error: HANDLE_RULES };
  if (RESERVED_HANDLES.includes(handle)) return { error: "That one's reserved. Try another." };
  return { handle };
}

/* ---------- uploads ---------- */

export const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

export const AVATAR_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/gif",
];

/* Blob layout for profile and team images:
     avatars/<user-id>/<file>
     team-logos/<team-id>/<file>
   parseUploadPath() is the security boundary — the token route
   refuses to sign anything it rejects, exactly as lib/intake.js does
   for the sponsor intake. */
export const UPLOAD_KINDS = ["avatar", "team-logo"];

const UPLOAD_PREFIX = { avatar: "avatars", "team-logo": "team-logos" };
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SAFE_FILE_RE = /^[a-z0-9][a-z0-9._-]{0,120}$/;

export function uploadPath({ kind, ownerId, fileName }) {
  const prefix = UPLOAD_PREFIX[kind];
  if (!prefix) return null;
  const safe =
    String(fileName || "")
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/-{2,}/g, "-")
      .replace(/^[-.]+/, "")
      .slice(0, 100) || "image";
  return `${prefix}/${ownerId}/${safe}`;
}

export function parseUploadPath(pathname) {
  const parts = String(pathname || "").split("/");
  if (parts.length !== 3) return null;

  const [root, ownerId, file] = parts;
  const kind = Object.keys(UPLOAD_PREFIX).find((k) => UPLOAD_PREFIX[k] === root);
  if (!kind) return null;
  if (!UUID_RE.test(ownerId)) return null;
  if (!SAFE_FILE_RE.test(file)) return null;

  return { kind, ownerId, file };
}
