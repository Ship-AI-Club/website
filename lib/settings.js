import "server-only";

import { sql, safeRead } from "./db";
import { EVENT } from "./hackathon";

/* ------------------------------------------------------------------
   Runtime switches.

   Four things about the weekend need to change on the day, not on a
   deploy: whether submissions are still open, whether the room can
   vote, whether results are public, and whether registration is
   taking new people. Each one is a row in `settings`, flipped from
   /admin.

   Every switch has a computed default, so an empty settings table
   behaves correctly on its own — submissions close when the published
   deadline passes whether or not anyone remembers to press the button.
   An admin override is exactly that: an override of the default, both
   directions.
------------------------------------------------------------------ */

export const DEADLINE = new Date(EVENT.deadlineISO);

export function pastDeadline(now = new Date()) {
  return now.getTime() > DEADLINE.getTime();
}

export const SETTINGS = [
  {
    key: "submissions_open",
    label: "Submissions open",
    copy: `Teams can create and edit their entry. Closes on its own at ${EVENT.deadline}.`,
    fallback: () => !pastDeadline(),
  },
  {
    key: "registration_open",
    label: "Registration open",
    copy: "New accounts can register for the hackathon and form teams.",
    fallback: () => true,
  },
  {
    key: "voting_open",
    label: "Crowd Favorite voting",
    copy: "Signed-in accounts can cast one vote at Sunday's pitches. Open it when the pitches start.",
    fallback: () => false,
  },
  {
    key: "results_published",
    label: "Results published",
    copy: "Puts the entrant listing and every issued certificate on the public results page.",
    fallback: () => false,
  },
];

const KEYS = SETTINGS.map((s) => s.key);

function fallbackFor(key) {
  return SETTINGS.find((s) => s.key === key)?.fallback() ?? false;
}

/** All four switches, resolved. Never throws — falls back if Neon is down. */
export async function allSettings() {
  const rows = await safeRead(() => sql`select key, value from settings`, []);
  const stored = new Map(rows.map((r) => [r.key, r.value]));
  const out = {};
  for (const key of KEYS) {
    const value = stored.get(key);
    out[key] = value === undefined || value === null ? fallbackFor(key) : Boolean(value);
  }
  return out;
}

export async function getSetting(key) {
  return (await allSettings())[key];
}

export async function setSetting(key, value) {
  if (!KEYS.includes(key)) throw new Error(`Unknown setting "${key}"`);
  await sql`
    insert into settings (key, value) values (${key}, ${JSON.stringify(Boolean(value))}::jsonb)
    on conflict (key) do update set value = excluded.value, updated_at = now()`;
}

/**
 * The one check the submission action makes. Deadline first: an admin
 * can reopen submissions after the deadline for a genuine reason
 * (a venue outage on Sunday morning), but nothing else can.
 */
export async function submissionsOpen() {
  const rows = await safeRead(
    () => sql`select value from settings where key = 'submissions_open'`,
    [],
  );
  if (rows.length) return Boolean(rows[0].value);
  return !pastDeadline();
}
