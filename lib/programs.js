/* ------------------------------------------------------------------
   Ship AI programs — the registry for every multi-session run.

   Program routes and generated kits read this list instead of assuming
   one hardcoded workshop series. Keep program-specific session content
   in its own data file; this module only supplies the shared contract.
------------------------------------------------------------------ */

import { EVENT, WORKSHOPS, ACTS, TEMPLATE_REPO } from "./hackathon.js";
import { DAY_ZERO_SESSIONS, DAY_ZERO_STEPS } from "./dayzero.js";

export const PROGRAMS = [
  {
    slug: "zero-to-launch",
    name: "Zero to Launch",
    status: "running",
    tagline:
      "Six free sessions build the go-to-market, then a hackathon in October where you don’t build — you launch.",
    headline: "Six Wednesdays that end in a launch.",
    description:
      "Six free go-to-market workshops at Workuity Biltmore in Phoenix, every other Wednesday from August 5 to October 14, 2026. Workuity is the venue sponsor for the meetup series. B2C and B2B case studies, positioning, agentic analytics, marketing sites and pricing — leading into the Zero to Launch hackathon.",
    datesLabel: EVENT.seriesRange,
    datesCopy: null,
    startISO: "2026-08-05T18:00:00-07:00",
    endISO: "2026-10-14T21:00:00-07:00",
    defaultVenue: "workuity",
    sessions: WORKSHOPS,
    acts: ACTS,
    hasHackathon: true,
    hackathonHref: "/programs/zero-to-launch/hackathon",
    kitPrefix: "zero-to-launch",
    templateRepo: TEMPLATE_REPO,
    /* Where the skills are told to write, used by the shared guide setup. */
    outputDir: "docs/gtm/",
    nextProgram: null,
  },
  {
    slug: "day-zero",
    name: "Day Zero",
    status: "tbd",
    tagline:
      "Four free beginner-to-intermediate sessions — from a blank chat box to a site that answers customers on its own.",
    headline: "Four sessions from zero.",
    description:
      "Four free beginner-to-intermediate AI workshops at Workuity Biltmore, Phoenix — dates TBD. Get real work out of ChatGPT and Claude, put routines and reports on a schedule, ship a marketing site with programmatic SEO, then add a support agent and a workflow that runs while you sleep.",
    datesLabel: "Dates TBD",
    datesCopy:
      "Dates announced soon — evenings, 6:00 PM at Workuity Biltmore. Watch Discord and the Luma and Meetup calendars.",
    startISO: null,
    endISO: null,
    defaultVenue: "workuity",
    sessions: DAY_ZERO_SESSIONS,
    acts: DAY_ZERO_STEPS,
    hasHackathon: false,
    hackathonHref: null,
    kitPrefix: "day-zero",
    templateRepo: null,
    outputDir: "01-voice/",
    /* Day Zero writes into one folder per session, so the shared setup
       step names the whole shape rather than only the first folder. */
    outputNote:
      "One folder per session — 01-voice/ through 04-agents/ — at the root of your project. Make tonight's before you start rather than mid-run.",
    /* Where a Day Zero graduate goes next — the four sessions end at a
       working thing, and Zero to Launch is how it finds customers. */
    nextProgram: "zero-to-launch",
  },
];

export function programBySlug(slug) {
  return PROGRAMS.find((program) => program.slug === slug);
}

export function sessionBySlug(program, slug) {
  return program?.sessions.find((session) => session.slug === slug);
}

export function sessionNeighbours(program, slug) {
  const i = program?.sessions.findIndex((session) => session.slug === slug) ?? -1;
  return {
    prev: i > 0 ? program.sessions[i - 1] : null,
    next: i >= 0 && i < program.sessions.length - 1 ? program.sessions[i + 1] : null,
  };
}

export function sessionScheduled(w) {
  return Boolean(w?.iso);
}
