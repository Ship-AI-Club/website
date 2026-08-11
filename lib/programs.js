/* ------------------------------------------------------------------
   Ship AI programs — the registry for every multi-session run.

   Program routes and generated kits read this list instead of assuming
   one hardcoded workshop series. Keep program-specific session content
   in its own data file; this module only supplies the shared contract.
------------------------------------------------------------------ */

import { EVENT, WORKSHOPS, ACTS, TEMPLATE_REPO } from "./hackathon.js";
import { DAY_ZERO_SESSIONS, DAY_ZERO_STEPS } from "./dayzero.js";
import {
  PRODUCT_BUILDER_SESSIONS,
  PRODUCT_BUILDER_STEPS,
} from "./product-builder.js";
import { GROWTH_LOOPS_SESSIONS, GROWTH_LOOPS_STEPS } from "./growth-loops.js";

/* The public learning path: learn the tools, build the product, then
   take it to market. Registry order drives cards, schema and navigation. */
const PROGRAM_ORDER = new Map([
  ["day-zero", 0],
  ["the-first-build", 1],
  ["zero-to-launch", 2],
  ["growth-loops", 3],
]);

export const PROGRAMS = [
  {
    slug: "the-first-build",
    name: "The First Build",
    status: "tbd",
    tagline:
      "Three hands-on sessions take you from vibe coding fundamentals to agentic engineering, followed by a capstone hackathon where you ship a focused product.",
    headline: "Learn the stack. Direct the agent. Ship the product.",
    description:
      "A free four-part, beginner-friendly builder program in Phoenix for founders, designers and developers who want to move from AI prototypes to working software. Learn prompting, Git and application fundamentals; connect interfaces, APIs and databases; practice agentic engineering with tests and logs; then build and demo a focused product at the capstone hackathon.",
    datesLabel: "Dates TBD",
    datesCopy:
      "Dates TBD — evening workshops followed by a longer capstone hackathon at Workuity Biltmore. Join Discord or follow the Luma and Meetup calendars for the next cohort.",
    startISO: null,
    endISO: null,
    defaultVenue: "workuity",
    sessions: PRODUCT_BUILDER_SESSIONS,
    acts: PRODUCT_BUILDER_STEPS,
    /* The capstone is modeled as session four until its standalone
       schedule and event operations are set; this avoids routing people
       into the unrelated Zero to Launch hackathon experience. */
    hasHackathon: false,
    hackathonHref: null,
    kitPrefix: "the-first-build",
    templateRepo: null,
    outputDir: "01-foundations/",
    outputNote:
      "One folder per stage — 01-foundations/ through 04-hackathon/ — in the product repository you carry through the program.",
    nextProgram: "zero-to-launch",
  },
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
    nextProgram: "growth-loops",
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
    /* Day Zero teaches the tools; The First Build turns them into a
       product before Zero to Launch takes it to market. */
    nextProgram: "the-first-build",
  },
  {
    slug: "growth-loops",
    name: "Growth Loops",
    status: "tbd",
    tagline:
      "Six hands-on sessions for founders, product teams and builders with something live. Instrument the journey, improve first and repeat value, catch churn earlier and ship a growth loop you can measure.",
    headline: "Turn first use into repeat value.",
    description:
      "A free six-part product growth program in Phoenix for teams working on a live product. Follow real customer behavior from activation through engagement, retention, churn and re-engagement. Each session adds a working piece to the same measurement system, ending with a bounded growth-loop experiment and a clear decision: ship, revise or stop.",
    datesLabel: "Dates TBD",
    datesCopy:
      "Dates TBD — evening workshops at Workuity Biltmore. Join Discord or follow the Luma and Meetup calendars for the next cohort.",
    startISO: null,
    endISO: null,
    defaultVenue: "workuity",
    sessions: GROWTH_LOOPS_SESSIONS,
    acts: GROWTH_LOOPS_STEPS,
    hasHackathon: false,
    hackathonHref: null,
    kitPrefix: "growth-loops",
    templateRepo: null,
    outputDir: "01-measurement/",
    outputNote:
      "One folder per session — 01-measurement/ through 06-growth-loop/ — attached to the live product you carry through the program.",
    nextProgram: null,
  },
].sort(
  (a, b) =>
    (PROGRAM_ORDER.get(a.slug) ?? Number.MAX_SAFE_INTEGER) -
    (PROGRAM_ORDER.get(b.slug) ?? Number.MAX_SAFE_INTEGER)
);

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
