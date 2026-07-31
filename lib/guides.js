/* ------------------------------------------------------------------
   Zero to Launch — follow-along guides.

   One per session. Deliberately short: the guide is what you keep open
   on the second monitor while Santos presents, not a course. Every step
   names the skill that does the mechanical half and what "done" looks
   like, so you can tell whether to move on.

   Rendered at /programs/<program>/<slug>/guide, and written out as
   markdown downloads by scripts/build-kits.mjs from this same data.
------------------------------------------------------------------ */

import { DAY_ZERO_GUIDES } from "./dayzero-guides.js";

/* Shown once on every guide — the five minutes that make the rest work. */
export const SETUP = {
  title: "Five-minute setup",
  note: "Do this before the session starts, or in the first ten minutes while the framing happens. Nothing here is required to attend.",
  steps: [
    {
      t: "Have an agent installed",
      c: "Claude Code, the Codex extension, or whatever you already run. Every skill file below is plain markdown with frontmatter — it works in anything that reads a skills directory.",
    },
    {
      t: "Get the skills",
      c: "Download this session's bundle and unzip it at the root of your project. It writes into .claude/skills/ and nothing else.",
      /* {BUNDLE} is swapped for the session's own zip filename by the page
         and by scripts/build-kits.mjs — one string, six sessions */
      run: "unzip -o {BUNDLE} -d .",
    },
    {
      t: "Not sure which skill you need?",
      c: "Run /ask-santos and describe the problem in your own words. It names one skill, says why that one, and tells you what comes after it. You don't have to learn the catalogue.",
    },
    {
      t: "Point it at a real product",
      c: "An idea in a notes app counts. The skills read your repo, your site and your README before asking you anything, so run them from inside the project rather than a blank folder.",
    },
    {
      t: "Make somewhere to put the output",
      c: "The template repo already has the folders. If you're working in your own project, a docs/gtm/ directory is fine — the skills write markdown, they don't care where.",
    },
  ],
};

/* Two of those steps assume Zero to Launch: the /ask-santos router, which
   only ships in that program's bundles, and the template repo, which Day
   One doesn't have. Rather than fork the whole block, drop or reword the
   steps that don't apply and leave the rest shared. */
const ASK_SANTOS_STEP = "Not sure which skill you need?";
const OUTPUT_STEP = "Make somewhere to put the output";

export function setupFor(program) {
  const hasAskSantos = Boolean(
    program?.sessions?.some((w) => w.skills?.includes("ask-santos"))
  );
  const steps = SETUP.steps
    .filter((s) => hasAskSantos || s.t !== ASK_SANTOS_STEP)
    .map((s) =>
      s.t === OUTPUT_STEP && !program?.templateRepo
        ? {
            ...s,
            c: `The skills write markdown and don't care where it lands. ${
              program?.outputNote ||
              `A ${
                program?.outputDir || "docs/"
              } directory at the root of your project is enough — make it before you start rather than mid-run.`
            }`,
          }
        : s
    );
  return { ...SETUP, steps };
}

export const GUIDES = {
  "gtm-engineering": {
    minutes: "40 min",
    lede:
      "By the end you have a funnel you can actually measure and a dated path to October 16. Not a strategy document — a page you'll keep reopening.",
    steps: [
      {
        t: "Sketch the funnel before you touch a tool",
        run: "/gtm-map",
        c: "Let the skill read the product first, then argue with the stages it proposes. B2C and B2B diverge here and picking wrong costs you the next two sessions.",
        good: "Four to six named stages, and for each one an honest label: measurable today, measurable this week, or nothing.",
      },
      {
        t: "Call the fork out loud",
        c: "B2C or B2B, based on who signs, who pays, and how long they take. If it's genuinely both, pick the one you'll work in first — session 02 and session 03 go deep on each and you can attend the other anyway.",
        good: "One sentence you'd defend to a stranger: \"we're B2C because ___.\"",
      },
      {
        t: "Find the stage that's leaking",
        run: "/funnel-audit",
        c: "Only if you already have traffic. It finds the stage where people actually fall out, which is almost never the one you assumed.",
        good: "One named stage and the number behind it.",
      },
      {
        t: "Work backwards from Oct 16",
        c: "Ten weeks, six sessions. Put the launch date at the end and fill in what has to be true before it — positioning by mid-September, site by early October, distribution running by the 14th.",
        good: "A dated list with fewer than ten items on it. Longer than that and it isn't a plan.",
      },
      {
        t: "Name the three things to fix first",
        c: "From everything above, the three that unblock the most. Write them at the top of the file, not the bottom.",
        good: "Three. Not eight.",
      },
    ],
    output: "01-roadmap/gtm-map.md — funnel, fork call, dated roadmap, three fixes. Plus funnel-audit.md if you had traffic to audit.",
    stuck:
      "If the funnel keeps growing stages, you're modelling the business you want instead of the one you have. Cut it to what you can measure this week.",
  },

  "b2c-ggbucks-case-study": {
    minutes: "50 min",
    lede:
      "The session is a case study; the guide is how you run the same play. You leave with a first channel, a budget, a go/no-go number, and a funnel that's actually instrumented.",
    steps: [
      {
        t: "Pick one channel, not a mix",
        run: "/channel-plan",
        c: "The first thirty days of ggbucks were one channel at a time. Two channels at once means you learn nothing from either.",
        good: "Channel, the specific test, the budget, and the number that decides whether you keep going.",
      },
      {
        t: "Write the go/no-go number down before you spend",
        c: "Decided in advance it's a threshold; decided afterward it's a rationalisation. Cost per signup, reply rate, whatever fits — one number, one date.",
        good: "\"If it isn't ___ by ___, I stop.\" In the file, not in your head.",
      },
      {
        t: "Instrument the funnel now, not in October",
        run: "/analytics-wire",
        c: "Events per stage, then verify each one actually fires. Receipts are 30% of the October score and this is where they come from.",
        good: "Every stage in your session-01 funnel has an event, and you've seen each fire in the dashboard.",
      },
      {
        t: "Take a baseline snapshot",
        c: "Today's numbers, saved with today's date. In eight weeks this is the before half of your launch story.",
        good: "A screenshot or a table committed to the repo.",
      },
      {
        t: "Decide whether paid is worth trying at all",
        run: "/paid-test",
        c: "The gate, not the execution. It checks the funnel is instrumented, there's organic demand, and you can afford a test big enough to read. If those two budget numbers don't overlap, it tells you to stop — which is the useful answer.",
        good: "A go or a no-go, with the number that decided it written down.",
      },
      {
        t: "Treat community as a funnel stage",
        run: "/community-plan",
        c: "Superfans → ambassadors → organic. It's a stage with a conversion rate, not a Discord you open and hope.",
        good: "You can name the step that turns a user into someone who brings other users.",
      },
      {
        t: "Wire up the weekly report",
        run: "/bi-agent",
        c: "An agent that reads your analytics on a schedule and tells you what moved, in plain English. Set it once in August and it reports all the way to the hackathon.",
        good: "One report has landed. If it hasn't run once, it isn't set up.",
      },
    ],
    output: "02-b2c/ — channel-plan.md, analytics.md with a verified event per stage, community-plan.md, and a bi-agent/ that has reported once.",
    stuck:
      "No traffic to instrument yet? Wire the events anyway. Ten minutes now beats reconstructing eight weeks of history the night before judging.",
  },

  "b2b-pipeline-sales": {
    minutes: "50 min",
    lede:
      "Twenty named accounts and the first sequence, written. B2B's first ten customers are hand-won, so the guide is deliberately manual in the places that matter.",
    steps: [
      {
        t: "Tighten the ICP until it hurts",
        run: "/icp-builder",
        c: "Company, role, trigger event. \"Developers\" is not an ICP. The test is whether you can write one specific email to it.",
        good: "A description narrow enough that some real companies obviously don't qualify.",
      },
      {
        t: "Build the list of twenty",
        c: "Named companies, named people. The skill will draft it; you check every row. A list you haven't read is a list you won't send to.",
        good: "Twenty rows, each with a reason that account is on the list.",
      },
      {
        t: "Write the sequence",
        run: "/outbound-sequence",
        c: "Relevance over volume. First touch, two follow-ups, and a break-up that doesn't grovel. Short enough to read on a phone.",
        good: "You'd reply to it if it landed in your inbox cold.",
      },
      {
        t: "Define what moves a deal between stages",
        run: "/funnel-metrics",
        c: "Awareness → Interest → Evaluation → Decision → Onboarding → Expansion. For each arrow, the specific thing that has to happen.",
        good: "Every stage transition has an event, not an opinion.",
      },
      {
        t: "Structure the pilot before you offer it",
        c: "An early deal should produce a reference and a case study, not just revenue. Decide the scope, the length and what you get to publish — before the call, not during it.",
        good: "One paragraph you could paste into a proposal.",
      },
      {
        t: "Make the pipeline showable",
        run: "/bi-agent",
        c: "A spreadsheet is fine. What isn't fine is a judge asking about pipeline in October and getting an anecdote.",
        good: "You can answer \"how many accounts moved stage last week\" without doing arithmetic.",
      },
    ],
    output: "03-b2b/ — icp.md with twenty named accounts, outbound.md with the sequence, and funnel-metrics.md for the pipeline.",
    stuck:
      "If you can't find twenty accounts, the ICP is wrong in one of two directions — too narrow to exist, or too broad to search for. Usually it's the second.",
  },

  "positioning-and-pitch": {
    minutes: "45 min",
    lede:
      "The most-skipped session, and the input to everything after it. You leave with a one-liner that survives a stranger, and sixty seconds you can say out loud.",
    steps: [
      {
        t: "Answer who it's for, uncomfortably narrowly",
        run: "/positioning-brief",
        c: "Narrow it until it feels like you're leaving money on the table. \"Solo founders shipping their first paid API\" beats \"developers\" every time.",
        good: "You can picture one specific person.",
      },
      {
        t: "Name the real alternative",
        c: "Usually a spreadsheet, a manual process, or nothing at all — not a competitor. Get this wrong and every comparison you write is aimed at the wrong thing.",
        good: "The alternative is something people actually do today.",
      },
      {
        t: "Translate features into outcomes",
        c: "Take your feature list and rewrite each line as what the customer gets. Most builder copy dies here, describing machinery to people who only care about the result.",
        good: "No line mentions your architecture.",
      },
      {
        t: "Separate USPs from table stakes",
        c: "Three buckets: only true of you, merely true, table stakes you still have to say. Half of what founders call a differentiator is in bucket two.",
        good: "Bucket one has at least one item and you'd bet money it's accurate.",
      },
      {
        t: "Attach proof to every claim",
        c: "A number, a screenshot, a customer sentence, a benchmark. Claims without proof lose rooms, and receipts are 30% of the October score.",
        good: "Every bucket-one item has something behind it.",
      },
      {
        t: "Compress to the one-liner",
        c: "For [who] who [problem], [product] is a [category] that [outcome]. Unlike [alternative], it [edge]. Then the swap test: put a competitor's name in. If it still reads true, it isn't positioning.",
        good: "It fails the swap test.",
      },
      {
        t: "Build the sixty seconds",
        run: "/pitch-doctor",
        c: "Five beats: hook, who it's for, what it does, why you plus proof, the ask. Two versions — customers and investors want different beats four and five.",
        good: "You said it out loud, timed it, and cut the part you stumbled on.",
      },
    ],
    output: "04-positioning/ — brief.md with the one-liner, and pitch.md with both audience versions.",
    stuck:
      "If the one-liner keeps growing clauses, the positioning isn't settled — you're compensating with words. Go back to who it's for.",
  },

  "marketing-site": {
    minutes: "60 min",
    lede:
      "Everything a stranger finds when they go looking. Site first, then every profile that points at it. The live half is judgement; the rest is skill files you run.",
    steps: [
      {
        t: "Plan the structure before you write a line",
        run: "/site-structure",
        c: "Sections, the order they go in, and what each one has to accomplish before it earns a scroll.",
        good: "You can say what job every section does. Anything without a job gets cut.",
      },
      {
        t: "Make the hero your one-liner",
        run: "/landing-copy",
        c: "Straight from session 04. If the positioning doesn't survive contact with the page, the positioning was the problem — not the page.",
        good: "The hero says what it is and who it's for, above the fold, without scrolling.",
      },
      {
        t: "Cut to one CTA",
        c: "Five competing calls to action is the same as none. Pick the one thing you want a stranger to do and delete the rest.",
        good: "One primary button, repeated. Everything else is a link.",
      },
      {
        t: "Scaffold and deploy",
        run: "/site-scaffold",
        c: "The Next.js boilerplate lands here — routing, metadata, sections. Deployed the same night is the target, on a real URL.",
        good: "A URL you can send someone.",
      },
      {
        t: "Make links preview properly",
        run: "/og-image",
        c: "Every share you get for the next ten weeks runs through this. Ten minutes, permanently.",
        good: "Paste the URL into Discord and it looks deliberate.",
      },
      {
        t: "Run the performance pass",
        run: "/perf-pass",
        c: "Core Web Vitals, but only the fixes that move the number. Skip the ones that don't.",
        good: "You know your LCP and it isn't embarrassing.",
      },
      {
        t: "Work backwards to the content plan",
        run: "/content-map",
        c: "From what your ICP searches for to the first twenty pages. Then /programmatic-pages for the templated set, /article-draft for the ones that need a human.",
        good: "Twenty page titles, each tied to something a real person types into a search box.",
      },
      {
        t: "Read your own profiles cold",
        run: "/social-audit",
        c: "Eight or so places a stranger lands. Most of the damage is a stale bio and a banner from two products ago.",
        good: "A list of what contradicts the positioning, per platform.",
      },
      {
        t: "Fix them one at a time",
        run: "/social-profile",
        c: "Handle, bio, banner, pinned post, links, and the one line that has to match the site hero. One platform per run — each reads differently.",
        good: "Every profile says the same thing in that platform's shape.",
      },
    ],
    output: "05-site/ — structure.md, copy.md applied to the real page, a deployed URL in scaffold.md, perf.md, content-map.md, and social-profiles.md.",
    stuck:
      "Site looks fine and says nothing? That's a positioning problem wearing a design costume. Session 04 output, then come back.",
  },

  "growth-engineering": {
    minutes: "50 min",
    lede:
      "Two days before the hackathon. Distribution that runs without you, and the one number that decides whether paid works at all.",
    steps: [
      {
        t: "Automate the content pipeline",
        run: "/social-automation",
        c: "Agents that draft from your content map, hold your voice, and queue on a schedule. Decide where a human stays in the loop and be honest about where the loop is theatre.",
        good: "A week of posts is queued and you didn't write them the morning of.",
      },
      {
        t: "Pick a cadence that survives a busy month",
        c: "The ambitious schedule is the one you abandon in week three. Halve it.",
        good: "You'd still hit it during a bad week.",
      },
      {
        t: "Do the CAC ceiling arithmetic",
        run: "/unit-economics",
        c: "LTV, churn and payback, inverted into the most you can pay for a customer. Everything about paid is downstream of this number.",
        good: "One number, and you can show the arithmetic that produced it.",
      },
      {
        t: "Set pricing deliberately",
        run: "/pricing-model",
        c: "The model has to match how customers actually get value. Better decided now than anxiously on Saturday.",
        good: "You can explain why it's per-seat, or usage, or flat — in one sentence.",
      },
      {
        t: "Plan the paid push",
        run: "/paid-basics",
        c: "Only if /paid-test cleared. Account structure, creative angles versus variations, targeting narrow before broad, and the daily raise/hold/cut loop.",
        good: "You know what you'd check tomorrow morning and what you'd do about each outcome.",
      },
      {
        t: "Write the announcement and its cuts",
        run: "/ship-announcement  →  /social-post",
        c: "The post for the day it goes live: what it does and who it's for in one sentence, the proof inside the post, what isn't done yet, and one ask. Then the platform cuts from that same core version — X and LinkedIn drafted separately, never the same paragraphs pasted twice. Nothing sends until the checklist below comes back clean.",
        good: "An announcement with a working proof link, the first-hour list of ten people you'd message by hand, and both platform drafts written.",
      },
      {
        t: "Run the pre-launch checklist",
        run: "/launch-checklist",
        c: "The Friday-night one. Analytics firing, links working, OG images, the thing that always breaks.",
        good: "It comes back clean, or you know what's still broken and it's on purpose.",
      },
    ],
    output:
      "06-growth/ — unit-economics.md with the CAC ceiling, pricing.md, paid-basics.md, social-automation.md with a week queued, announcement.md with its first-hour list, social/ with the platform cuts, and launch-checklist.md.",
    stuck:
      "If the CAC ceiling comes out lower than any channel can hit, that's not a marketing problem — it's pricing or retention. Fix it before Saturday.",
  },
};

/* Program seam: add future guide collections here without changing the
   shared setup instructions or the route implementation. */
export const GUIDES_BY_PROGRAM = { "zero-to-launch": GUIDES, "day-zero": DAY_ZERO_GUIDES };

export function guideFor(program, slug) {
  return GUIDES_BY_PROGRAM[program]?.[slug];
}
