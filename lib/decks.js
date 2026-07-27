/* ------------------------------------------------------------------
   Zero to Launch — the presentations.

   Slides are data, not slide files. They render as a real deck at
   /hackathon/workshops/<slug>/deck (arrow keys, fullscreen, print to
   PDF) and as an embedded preview on the workshop page, from this one
   source. Nobody has to open Keynote to fix a typo.

   Slide kinds — text:
     title     — the opener, with the globe
     act       — a numbered section divider; the deck's loudest slide
     statement — one line, said slowly
     agenda    — the run of show
     bullets   — heading + points, each with a line under it
     split     — two columns, a versus, paired row by row
     quote     — a closer, usually one of the mantras
     end       — what happens next, plus a QR

   Slide kinds — diagrams (see components/deck-art.jsx):
     funnel    — stages as narrowing bands; `w` is the width fraction,
                 `lit` marks the one the slide is about, and the drop
                 between stages is labelled automatically
     flow      — a left-to-right chain of nodes
     timeline  — the program spine; same position in every deck
     loop      — stages around a ring, for anything that compounds
     matrix    — a comparison table, one `lit` cell per row
     metric    — a row of numbers, at most one `lit`
     bignum    — one number, alone, with a delta chip
     chart     — a step plot, drawn on arrival
     scorecard — proportional bars
     prism     — one input refracted into many channels

   Slide kinds — command:
     terminal  — a skill file, shown as the terminal it actually is

   Rule of thumb: if a slide is a list of things that happen in an
   order, it's a flow. If it's a list of things that shrink, it's a
   funnel. If it comes back around, it's a loop. If one number carries
   it, it's a bignum. Only use bullets when the points genuinely have
   no shape.

   Editorial constraint: no more than two consecutive text-only slides,
   and at least three diagram slides per fifteen. If you find yourself
   writing a third `bullets` in a row, one of them is a diagram.
------------------------------------------------------------------ */

export const DECKS = {
  "gtm-engineering": [
    { kind: "title", sub: "Go-to-market engineering, end to end" },
    {
      kind: "statement",
      text: "You can ship code forever and never launch anything.",
      note: "That's the room. That's why this program exists.",
    },
    {
      kind: "bullets",
      title: "What this program is",
      items: [
        { t: "Six Wednesdays, then a weekend", c: "Aug 5 to Oct 14, then Oct 16–18. Free, in person, teams of 1–4." },
        { t: "You launch something you already built", c: "Most hackathons ban existing projects. This one rewards shipping the thing that's been sitting at 90%." },
        { t: "Nothing is required of you in the room", c: "Sit and watch, or build along. Nobody is put on the spot." },
      ],
    },
    {
      kind: "statement",
      text: "Tonight is the map. Everything after this hangs off it.",
    },
    {
      kind: "agenda",
      title: "Tonight",
      items: [
        "The three acts — Launch, Grow, Optimize",
        "Funnel modeling, and which numbers lie",
        "GTM engineering vs. marketing",
        "B2C and B2B, side by side",
        "Program mechanics — 15 minutes, then it's out of the way",
      ],
    },

    {
      kind: "timeline",
      title: "Where we are",
      note: "Six Wednesdays, then the weekend. Every session is free and standalone — you don't have to attend all of them to compete in October, and catching up late is explicitly allowed.",
    },

    { kind: "act", n: "01", eyebrow: "Act one", title: "The three acts", c: "Every go-to-market motion is one of three jobs. Doing them out of order is the most common way a good product stays invisible." },
    {
      kind: "flow",
      title: "Launch → Grow → Optimize",
      steps: [
        { t: "Launch", c: "Get it in front of anyone at all. The bar is a stranger using it, not a perfect product.", lit: true },
        { t: "Grow", c: "Find one channel that repeats. One — two at once and you learn nothing from either." },
        { t: "Optimize", c: "Squeeze the funnel you already have. Cheapest act, and the one everybody starts with." },
      ],
      note: "The failure mode is jumping to act three. You cannot optimize a funnel nobody is in.",
    },
    {
      kind: "statement",
      text: "Most builders pick tactics before they have a model.",
      note: "An ad account before a funnel. A blog before a keyword. A pricing page before unit economics.",
    },

    { kind: "act", n: "02", eyebrow: "Act two", title: "Model the funnel", c: "Not the six stages from a template. The four you can actually put a number against this week." },
    {
      kind: "funnel",
      title: "Measure every stage, not the last one",
      stages: [
        { t: "Awareness", c: "impressions, referrers", w: 1 },
        { t: "Interest", c: "sessions, time on page", w: 0.78 },
        { t: "Activation", c: "signup → first real use", w: 0.52, lit: true },
        { t: "Revenue", c: "first paid event", w: 0.34 },
        { t: "Retention", c: "week 4 still here", w: 0.22 },
      ],
      note: "Revenue is a lagging number. It tells you something broke, never where. The lit stage is where most builder funnels actually leak.",
    },
    {
      kind: "split",
      title: "Two ways to do this",
      left: {
        h: "Marketing",
        items: ["Buy ads", "Hire salespeople", "Agency retainer", "Attribution by vibes", "Scale by spending more"],
      },
      right: {
        h: "GTM engineering",
        items: [
          "Programmatic pages",
          "Outbound agents",
          "Automated attribution",
          "Community as a funnel stage",
          "Scale by shipping more",
        ],
      },
      note: "One of these is a budget. The other is a codebase. You already know how to build a codebase.",
    },
    {
      kind: "prism",
      title: "One product, many routes to market",
      note: "GTM engineering is the work of splitting one thing you built into every surface a stranger might find it on — and instrumenting each one so you know which of them worked.",
      channels: ["Search", "Community", "Outbound", "Paid"],
      rays: 4,
    },

    { kind: "act", n: "03", eyebrow: "Act three", title: "The fork", c: "Nearly every framework splits at B2C and B2B. You get a dedicated session on each — the next two Wednesdays." },
    {
      kind: "matrix",
      title: "B2C and B2B, side by side",
      heads: ["B2C", "B2B"],
      rows: [
        { t: "Funnel", cells: ["Awareness → Activation → Revenue → Referral", "Awareness → Evaluation → Decision → Expansion"] },
        { t: "Shape", cells: ["Many users, small cheques", "Few customers, large cheques"] },
        { t: "The work", cells: ["Channels and creative", "Named accounts and conversations"] },
        { t: "Time to first sale", cells: ["Minutes", "Weeks"] },
        { t: "Your session", cells: ["02 — Aug 19", "03 — Sep 2"] },
      ],
      note: "Attend both anyway. Plenty transfers, and the one you think you are is sometimes wrong.",
    },
    {
      kind: "terminal",
      cmd: "/gtm-map",
      out: ["reading package.json, README.md, app/", "proposing 5 funnel stages…", "wrote 01-roadmap/README.md"],
      title: "Do this tonight",
      c: "Reads your repo and your site first, proposes the funnel stages that apply to you specifically, calls the fork, and writes it to 01-roadmap/README.md.",
      note: "Argue with it. If it proposes a stage you'll never measure, cut the stage.",
    },
    {
      kind: "terminal",
      cmd: "/funnel-audit",
      out: ["pulling 30d of events…", "stage 3 → 4 converting at 6%", "wrote 01-roadmap/audit.md"],
      title: "If you already have traffic",
      c: "Finds the stage that's actually leaking, which is almost never the one you assumed.",
    },
    {
      kind: "bullets",
      title: "Program mechanics",
      items: [
        { t: "Everything is open source", c: "The template repo, the skill files, these slides. Take them and run the process years from now if you want." },
        { t: "Attending is open to everyone", c: "Competing in October needs a registered repo and a deliverable per workshop. Catching up late is fine." },
        { t: "Build window opens Aug 3", c: "Existing products welcome. That's the whole point." },
        { t: "Five prize categories", c: "Four judged, plus a room-voted Crowd Favorite — the one you can win alongside a judged category." },
      ],
    },
    {
      kind: "scorecard",
      title: "How October is scored",
      rows: [
        { t: "Shipped", pct: 40, lit: true },
        { t: "Receipts", pct: 30 },
        { t: "Growth engine", pct: 20 },
        { t: "Craft", pct: 10 },
      ],
      note: "Shipped is the biggest band on purpose — this is a launch weekend, not a build weekend. Receipts is the one most teams under-invest in, and it's worth almost as much.",
    },
    {
      kind: "flow",
      title: "Work backwards from October 16",
      steps: [
        { t: "Aug", c: "Roadmap, first channel, funnel instrumented." },
        { t: "Sep", c: "Pipeline or paid test. Positioning settled." },
        { t: "Oct 7", c: "Site deployed, profiles fixed." },
        { t: "Oct 16", c: "It goes public.", lit: true },
      ],
      note: "Ten weeks. A dated list with fewer than ten items on it — longer than that and it isn't a plan.",
    },
    { kind: "quote", text: "Feel the fear and do it anyways." },
    {
      kind: "end",
      next: "Zero to $3,000 — Wed Aug 19, CEI Gateway",
      qr: "session-b2c-ggbucks-case-study",
      qrLabel: "Session page",
      c: "One business, one dashboard, no redactions. $0 to $3,000 in 30 days with zero paid, then scaling into paid profitably.",
    },
  ],

  "b2c-ggbucks-case-study": [
    { kind: "title", sub: "B2C, with the dashboard open" },
    {
      kind: "statement",
      text: "Case studies are usually told by someone with an outcome to sell.",
      note: "This one is told with the analytics open, including the money that got wasted finding out what didn't work.",
    },
    {
      kind: "bignum",
      label: "First 30 days",
      v: "$3,000",
      delta: "$0 ad spend",
      c: "One product, one dashboard, no redactions — including the channels that produced nothing and the money it cost to find that out.",
    },
    {
      kind: "chart",
      title: "The first thirty days",
      points: [
        { l: "d1", v: 0 },
        { l: "d5", v: 90 },
        { l: "d10", v: 340 },
        { l: "d15", v: 620 },
        { l: "d20", v: 1150 },
        { l: "d25", v: 2050 },
        { l: "d30", v: 3000 },
      ],
      peak: "$3,000",
      note: "Not a hockey stick — a slope that got steeper each time a channel was confirmed rather than guessed at. The flat first week is the part nobody publishes.",
    },
    {
      kind: "metric",
      title: "Where it is now",
      items: [
        { v: "$0", l: "paid spend for the first $3k", lit: true },
        { v: "$100–200", l: "per day, profitably" },
        { v: "4 mo", l: "payback" },
      ],
      note: "The zero is the interesting number. Paid came later, and only once the arithmetic said it could.",
    },
    {
      kind: "agenda",
      title: "Tonight",
      items: [
        "$0 → $3,000 in 30 days, zero paid",
        "The switch to paid, and what had to be true first",
        "Scaling to $100–200/day",
        "Community as the compounding half",
        "What didn't work",
        "Instrument it before you need it",
        "The same structure, pointed at your product",
      ],
    },

    {
      kind: "timeline",
      title: "Where we are",
      note: "Six Wednesdays, then the weekend. Every session is free and standalone — you don't have to attend all of them to compete in October, and catching up late is explicitly allowed.",
    },

    { kind: "act", n: "01", eyebrow: "Act one", title: "Thirty days, no budget", c: "What the channels actually were, in what order, and how much of it was repeatable versus lucky." },
    {
      kind: "flow",
      title: "The arc",
      steps: [
        { t: "Manual", c: "Do it by hand until it works. Automating a guess just makes it faster." },
        { t: "One channel", c: "Sequence beats coverage this early. Two at once teaches you nothing." },
        { t: "Repeatable", c: "Name which part was the method and which part was a lucky post.", lit: true },
        { t: "Then paid", c: "Only once the funnel converted organically and payback was known." },
      ],
    },
    {
      kind: "statement",
      text: "Spending before the unit economics were clear would have killed it.",
      note: "Paid doesn't find product-market fit. It buys more of whatever you already have — including more of a leak.",
    },
    {
      kind: "bullets",
      title: "The switch to paid",
      items: [
        { t: "What had to be true first", c: "A funnel that converted organically, a known payback period, and a number I'd stop at." },
        { t: "Creative angles, not variations", c: "Five ways of saying the same thing is one test. Five different reasons to care is five." },
        { t: "The daily loop", c: "One look a day, three decisions available: raise, hold, cut. Not a dashboard you stare at." },
      ],
    },

    { kind: "act", n: "02", eyebrow: "Act two", title: "The compounding half", c: "Paid stops the day you stop paying. This doesn't." },
    {
      kind: "loop",
      title: "Community as a funnel stage",
      label: "compounds",
      steps: [
        { t: "A user gets real value" },
        { t: "They're given somewhere to say so" },
        { t: "Superfans become ambassadors" },
        { t: "Their reach brings new users" },
      ],
      note: "It's a stage with a conversion rate, not a Discord you open and hope. It's slow, then it isn't — and ambassadors make the creative you'd otherwise pay for.",
    },
    {
      kind: "statement",
      text: "What didn't work, at the same length as what did.",
      note: "Because that's the half nobody publishes, and it's the half that saves you a month.",
    },

    { kind: "act", n: "03", eyebrow: "Act three", title: "Receipts", c: "Thirty percent of the October score. \"We didn't really track that\" is the most common way a good launch loses." },
    {
      kind: "funnel",
      title: "An event per stage, verified firing",
      stages: [
        { t: "Landed", c: "page_view + referrer", w: 1 },
        { t: "Engaged", c: "scroll_75 / demo_start", w: 0.72 },
        { t: "Signed up", c: "signup_complete", w: 0.4 },
        { t: "Activated", c: "first_real_action", w: 0.24, lit: true },
        { t: "Paid", c: "purchase", w: 0.12 },
      ],
      note: "Wiring an event and never watching it fire is how you get eight weeks of empty charts. Take a baseline today, with today's date — in eight weeks it's the \"before\" half of your launch story.",
    },
    {
      kind: "terminal",
      cmd: "/channel-plan",
      out: ["reading 01-roadmap/README.md", "drafting test, budget, go/no-go…", "wrote 02-b2c/README.md"],
      title: "Your first channel",
      c: "One channel, the specific test, the budget, and the go/no-go number — decided before you spend, or it's a rationalisation instead of a threshold.",
    },
    {
      kind: "terminal",
      cmd: "/analytics-wire  →  /bi-agent",
      out: ["wiring 5 events…", "verified 5/5 firing", "weekly report scheduled"],
      title: "Then instrument it",
      c: "Events per stage, wired and verified. Then an agent that reads the numbers weekly and tells you what moved, in plain English. Set it once in August and it reports all the way to the hackathon.",
    },
    {
      kind: "split",
      title: "Also tonight",
      left: { h: "/paid-test", items: ["Small budget", "One variable", "A fixed end date", "A test you could stop tomorrow"] },
      right: { h: "/community-plan", items: ["Community as a stage", "Named conversion step", "Ambassador path", "Measured, not hoped"] },
    },
    {
      kind: "statement",
      text: "Now point the same structure at your own product.",
      note: "First channel, the test, the budget, the go/no-go number. Four lines. Write them tonight.",
    },
    { kind: "quote", text: "Just ship it." },
    {
      kind: "end",
      next: "Outbound Agents — Wed Sep 2, Workuity Biltmore",
      qr: "session-b2b-pipeline-sales",
      qrLabel: "Session page",
      c: "The B2B counterpart. An ICP tight enough to write the email to, twenty named accounts, and a sequence built live from a blank page.",
    },
  ],

  "b2b-pipeline-sales": [
    { kind: "title", sub: "B2B, and your first ten customers" },
    {
      kind: "statement",
      text: "Your first ten B2B customers are hand-won, one at a time.",
      note: "That work looks nothing like a funnel diagram, which is why so many B2B founders run B2C tactics and wonder why nothing converts.",
    },
    {
      kind: "agenda",
      title: "Tonight",
      items: [
        "An ICP you can write an email to",
        "The six stages, and what moves a deal between them",
        "Outbound that gets replies",
        "Design partners and pilots",
        "Champions → advisors → references",
        "A pipeline you can show a judge",
        "Twenty accounts and a sequence, built live",
      ],
    },

    {
      kind: "timeline",
      title: "Where we are",
      note: "Six Wednesdays, then the weekend. Every session is free and standalone — you don't have to attend all of them to compete in October, and catching up late is explicitly allowed.",
    },

    { kind: "act", n: "01", eyebrow: "Act one", title: "Who, exactly", c: "The whole method rests on this. Get it wrong and every email after it is aimed at nobody." },
    {
      kind: "statement",
      text: "If you can't name twenty real accounts, the ICP is still too broad.",
    },
    {
      kind: "bullets",
      title: "An ICP you can write an email to",
      items: [
        { t: "Company", c: "Size, stage, stack, industry. Specific enough that some obviously don't qualify." },
        { t: "Role", c: "The person with the problem, and separately the person with the budget. Often not the same human." },
        { t: "Trigger event", c: "The thing that just happened that makes this urgent now instead of someday. This is the part everyone skips." },
      ],
    },

    { kind: "act", n: "02", eyebrow: "Act two", title: "The six stages", c: "For each arrow, the specific thing that has to happen. An event, not an opinion." },
    {
      kind: "flow",
      title: "What actually moves a deal",
      steps: [
        { t: "Awareness", c: "They replied. That's the whole bar for this arrow." },
        { t: "Interest", c: "A real call happened, and they brought someone else to it." },
        { t: "Evaluation", c: "Security review, procurement, a pilot scope.", lit: true },
        { t: "Decision", c: "Signed. Where B2B deals stall is the arrow before this one." },
        { t: "Onboarding", c: "They got value without you in the room." },
        { t: "Expansion", c: "Where B2B economics actually come from." },
      ],
    },
    {
      kind: "split",
      title: "Outbound",
      left: { h: "Volume", items: ["Send 500", "Merge tags", "Follow up 7 times", "Reply rate < 1%", "Domain burned"] },
      right: {
        h: "Relevance",
        items: ["Send 20", "You read their site", "Follow up twice, then stop", "Reply rate you'd tell people", "Domain intact"],
      },
      note: "Twenty good emails take an afternoon. Five hundred bad ones take an afternoon too.",
    },
    {
      kind: "bullets",
      title: "What a good first touch does",
      items: [
        { t: "Proves you looked", c: "One specific line about them that couldn't be in anyone else's email." },
        { t: "Names the problem, not the product", c: "They care about the thing that's broken, not your architecture." },
        { t: "Asks for something small", c: "Fifteen minutes, or a yes/no question. Not a demo, not a deck." },
        { t: "Fits on a phone screen", c: "If it scrolls, it's a document — and nobody reads documents from strangers." },
      ],
    },

    { kind: "act", n: "03", eyebrow: "Act three", title: "Trust compounds", c: "Slowly, and then quickly. The first reference is the expensive one." },
    {
      kind: "loop",
      title: "Champions → advisors → references",
      label: "compounds",
      steps: [
        { t: "One champion inside one account" },
        { t: "A pilot scoped to produce a story" },
        { t: "A quotable customer sentence" },
        { t: "The next deal starts warm" },
      ],
      note: "Structure the pilot before you offer it — scope, length, and what you're allowed to publish, decided before the call rather than during it.",
    },
    {
      kind: "terminal",
      cmd: "/icp-builder",
      out: ["reading the product…", "20 named accounts, 4 filtered out", "wrote 03-b2b/accounts.md"],
      title: "Do this tonight",
      c: "Defines the ICP tight enough to write to, then builds the named account list. It drafts; you check every row — a list you haven't read is a list you won't send to.",
    },
    {
      kind: "terminal",
      cmd: "/outbound-sequence  →  /funnel-metrics",
      out: ["drafting 1 touch + 2 follow-ups", "stages instrumented", "wrote 03-b2b/README.md"],
      title: "Then write the sequence",
      c: "First touch, two follow-ups, and a break-up that doesn't grovel. Then instrument the stages, and add /bi-agent for the weekly read.",
    },
    {
      kind: "statement",
      text: "A spreadsheet is a fine CRM. An anecdote is not a pipeline.",
      note: "In October a judge will ask what moved last week. Receipts are 30% of the score.",
    },
    { kind: "quote", text: "Feel the fear and do it anyways." },
    {
      kind: "end",
      next: "Unfair Advantage — Wed Sep 16, CEI Gateway",
      qr: "session-positioning-and-pitch",
      qrLabel: "Session page",
      c: "Why should anyone pick you over the thing they already use? Value prop, USPs, positioning and the pitch — written live, cut, said out loud, cut again.",
    },
  ],

  "positioning-and-pitch": [
    { kind: "title", sub: "Value prop, USP, positioning and the pitch" },
    {
      kind: "statement",
      text: "Why should anyone pick you over the thing they already use?",
      note: "If that takes you more than a sentence, tonight is the most valuable session in the program.",
    },
    {
      kind: "statement",
      text: "Run the site session first and you get beautiful pages that say nothing.",
      note: "Positioning is the input, not a nice-to-have. That's why it sits immediately before Ship the Surface.",
    },
    {
      kind: "agenda",
      title: "Tonight, in this order",
      items: [
        "Who exactly is this for?",
        "What are they doing today instead?",
        "Value proposition, not a feature list",
        "USPs versus table stakes",
        "Your sharp edge",
        "Proof for each claim",
        "The one-liner",
        "The sixty-second pitch",
      ],
    },

    {
      kind: "timeline",
      title: "Where we are",
      note: "Six Wednesdays, then the weekend. Every session is free and standalone — you don't have to attend all of them to compete in October, and catching up late is explicitly allowed.",
    },

    { kind: "act", n: "01", eyebrow: "Act one", title: "Who, and instead of what", c: "Two questions. Most builders have written down neither." },
    {
      kind: "statement",
      text: "Narrow it until it's uncomfortable.",
      note: "\"Developers\" isn't an answer. \"Solo founders shipping their first paid API\" is.",
    },
    {
      kind: "bullets",
      title: "The real alternative",
      items: [
        { t: "It's usually not a competitor", c: "It's a spreadsheet, a manual process, or nothing at all." },
        { t: "Get it wrong and every comparison misses", c: "You end up arguing with a product nobody was considering." },
        { t: "Ask what today looks like without you", c: "Literally: walk through their Tuesday. The answer is your alternative." },
      ],
    },
    {
      kind: "matrix",
      title: "Features versus outcomes",
      heads: ["What it does", "What they get"],
      rows: [
        { t: "Search", cells: ["Vector search over your docs", { v: "Answers from your own docs", lit: true }] },
        { t: "Sync", cells: ["Webhook-driven sync", { v: "Never re-enter the same data", lit: true }] },
        { t: "Tenancy", cells: ["Multi-tenant by default", { v: "Onboard a customer without a migration", lit: true }] },
        { t: "Latency", cells: ["Sub-100ms p99", { v: "It doesn't feel slow", lit: true }] },
      ],
      note: "Most builder copy dies in the left column. You're describing machinery to people who only care about the result.",
    },

    { kind: "act", n: "02", eyebrow: "Act two", title: "Find the sharp edge", c: "Half of what founders call a differentiator is something every competitor also has." },
    {
      kind: "funnel",
      title: "Everything you could say, narrowed",
      stages: [
        { t: "Everything true about it", c: "the feature list", w: 1 },
        { t: "Things customers care about", c: "outcomes, not machinery", w: 0.74 },
        { t: "Not table stakes", c: "still say them, just don't lead", w: 0.5 },
        { t: "Only true of you", c: "the actual USPs", w: 0.3 },
        { t: "The sharp edge", c: "they can't copy it this quarter", w: 0.16, lit: true },
      ],
      note: "The positioning gets built on the bottom band — not the longest list, the most defensible item on it.",
    },
    {
      kind: "bullets",
      title: "Proof, per claim",
      items: [
        { t: "A number", c: "Measured, with the method available if asked." },
        { t: "A screenshot", c: "The product doing the thing, not a mockup of it." },
        { t: "A customer sentence", c: "Their words. One real sentence beats a page of yours." },
        { t: "A benchmark", c: "Reproducible, and fair to the alternative — an unfair benchmark loses the room twice." },
      ],
      note: "Claims without proof are the fastest way to lose a room. Receipts are 30% of the October score.",
    },

    { kind: "act", n: "03", eyebrow: "Act three", title: "Compress it", c: "One line, then sixty seconds. Written on screen, cut, said out loud, cut again." },
    {
      kind: "statement",
      text: "For [who] who [problem], [product] is a [category] that [outcome]. Unlike [alternative], it [edge].",
      note: "Then the swap test: put a competitor's name in it. If it still reads true, it isn't positioning — it's a description.",
    },
    {
      kind: "flow",
      title: "Sixty seconds, five beats",
      steps: [
        { t: "Hook", c: "The problem, stated the way they'd state it." },
        { t: "Who it's for", c: "Narrow. The narrower it sounds, the more credible it gets." },
        { t: "What it does", c: "One sentence. The one-liner, out loud." },
        { t: "Why you", c: "The sharp edge, and the proof behind it." },
        { t: "The ask", c: "A real one. \"Let me know what you think\" is not an ask.", lit: true },
      ],
      note: "Two versions. Customers and investors want completely different beats four and five.",
    },
    {
      kind: "terminal",
      cmd: "/positioning-brief",
      out: ["reading the feature list…", "3 USPs survive, 1 sharp edge", "wrote 04-positioning/README.md"],
      title: "Do this tonight",
      c: "Walks who it's for, the real alternative, the value prop, the three buckets and the proof, then compresses to the one-liner and applies the swap test.",
    },
    {
      kind: "terminal",
      cmd: "/pitch-doctor",
      out: ["5 beats, 2 audiences", "customer cut: 58s", "wrote 04-positioning/pitch.md"],
      title: "Then build the sixty seconds",
      c: "Five beats, two audience versions. Say it out loud and time it — the version you stumble on is the version that needs cutting.",
    },
    {
      kind: "statement",
      text: "If a listener can't repeat it back, it isn't done.",
    },
    { kind: "quote", text: "Feel the fear and do it anyways." },
    {
      kind: "end",
      next: "Ship the Surface — Wed Oct 7, Workuity Biltmore",
      qr: "session-marketing-site",
      qrLabel: "Session page",
      c: "Your site and every page that points at it. Structure, teardowns, the Next.js handoff, and a live pass on the profiles a stranger actually finds.",
    },
  ],

  "marketing-site": [
    { kind: "title", sub: "Your site and every page that points at it" },
    {
      kind: "statement",
      text: "The site is the one asset every channel points at.",
      note: "Get it wrong and every visitor you earn leaks straight back out of it.",
    },
    {
      kind: "bullets",
      title: "Builder sites fail the same three ways",
      items: [
        { t: "The hero describes the technology", c: "Written for the person who built it, read by someone who doesn't care yet." },
        { t: "The proof is adjectives", c: "\"Blazing fast\", \"powerful\", \"seamless\". A stranger discounts all of it instantly." },
        { t: "Five competing CTAs", c: "Which is the same as none." },
      ],
      note: "None of these are fixed by a faster build. They're fixed by judgement — which is what tonight is for.",
    },
    {
      kind: "agenda",
      title: "Tonight",
      items: [
        "The structure, and section order",
        "Teardowns, live",
        "Positioning above the fold",
        "Proof over adjectives, one CTA",
        "The Next.js boilerplate handoff",
        "The content plan",
        "Audit the rest of your surface",
        "Set the pages up, one at a time",
      ],
    },

    {
      kind: "timeline",
      title: "Where we are",
      note: "Six Wednesdays, then the weekend. Every session is free and standalone — you don't have to attend all of them to compete in October, and catching up late is explicitly allowed.",
    },

    { kind: "act", n: "01", eyebrow: "Act one", title: "The page", c: "Every section has a job. Anything without a job gets cut, however nice it looks." },
    {
      kind: "flow",
      title: "Section order, top to bottom",
      steps: [
        { t: "Hero", c: "What it is, who it's for, one CTA. September's one-liner, unchanged if it was any good.", lit: true },
        { t: "Proof", c: "Immediately. Logos, numbers, a real sentence from a real user." },
        { t: "How it works", c: "Three steps. If it needs five, the product is explaining itself badly." },
        { t: "The objection", c: "Name what they're worried about before they leave to go worry about it." },
        { t: "CTA", c: "The same one. Not a second one." },
      ],
    },
    {
      kind: "statement",
      text: "If the positioning doesn't survive contact with the page, the positioning was the problem.",
      note: "The hero is a test of session 04, not a writing exercise.",
    },
    {
      kind: "split",
      title: "Proof",
      left: { h: "Adjectives", items: ["Blazing fast", "Enterprise grade", "Seamless", "Powerful", "Trusted by teams"] },
      right: {
        h: "Evidence",
        items: ["p99 under 100ms", "SOC 2, report on request", "Two clicks, here's the video", "Here's it doing the hard case", "Three named logos"],
      },
      note: "You need less of the right-hand column than you think. Three real items beat a page of the left.",
    },
    {
      kind: "terminal",
      cmd: "/site-structure  →  /landing-copy",
      out: ["reading 04-positioning/README.md", "6 sections, 1 CTA", "wrote 05-site/structure.md"],
      title: "Plan, then write",
      c: "Structure first: sections, order, and the job each one does. Then copy from the positioning brief — hero, sections, CTA — so the page says what you decided in September.",
    },
    {
      kind: "terminal",
      cmd: "/site-scaffold  →  /og-image  →  /perf-pass",
      out: ["scaffolding app/ …", "og images: 4 routes", "LCP 1.2s — deployed"],
      title: "The boilerplate handoff",
      c: "Next.js routing, metadata and sections; then links that preview properly; then the Core Web Vitals fixes that actually move the number. Deployed on a real URL tonight if you're building along.",
      note: "This is one of the two sessions where the boilerplate lands. Up to here the program runs light on purpose.",
    },

    { kind: "act", n: "02", eyebrow: "Act two", title: "Everywhere else", c: "Your site is one of maybe eight places someone lands when they go looking for you." },
    {
      kind: "prism",
      title: "One positioning, every surface",
      note: "They'll check X, LinkedIn, GitHub, an app store listing, an old Product Hunt page. Each reads differently, so each gets set up individually — but every one of them refracts the same brief.",
      channels: ["Site", "X", "LinkedIn", "GitHub"],
      rays: 4,
    },
    {
      kind: "bullets",
      title: "One profile at a time",
      items: [
        { t: "Handle and name", c: "Findable, consistent, the same everywhere. Boring is correct here." },
        { t: "Bio", c: "The one line that has to match the site hero. If they disagree, a stranger believes neither." },
        { t: "Banner and pinned post", c: "The two things seen before anything is read." },
        { t: "Links", c: "Pointing at the current thing, not the last one." },
      ],
      note: "/social-audit finds the damage — usually a stale bio and a banner from two products ago. /social-profile fixes one platform per run.",
    },
    {
      kind: "bullets",
      title: "The content plan",
      items: [
        { t: "Start from what they search", c: "Work backwards from the ICP's actual query to the page that answers it." },
        { t: "Twenty pages, not two hundred", c: "Templated where the data is real, hand-written where judgement is needed." },
        { t: "Generation is a skill file", c: "/content-map, then /programmatic-pages and /article-draft. Not a lecture." },
      ],
    },
    {
      kind: "statement",
      text: "Once the positioning is settled, the whole pass is mechanical.",
      note: "Which means it belongs in an agent, not in an afternoon of tab-switching.",
    },
    { kind: "quote", text: "Just ship it." },
    {
      kind: "end",
      next: "Agentic Growth — Wed Oct 14, CEI Gateway",
      qr: "session-growth-engineering",
      qrLabel: "Session page",
      c: "Two days before the hackathon. Automated distribution, performance marketing basics, and the CAC ceiling that decides whether paid works at all.",
    },
  ],

  "growth-engineering": [
    { kind: "title", sub: "Automated content, paid marketing, and the CAC ceiling" },
    {
      kind: "statement",
      text: "Two days from now, this all goes public.",
      note: "Last session before the weekend. Two failure modes to close out, both cheap to fix now and expensive to fix later.",
    },
    {
      kind: "split",
      title: "The two failures",
      left: {
        h: "Content that needs you",
        items: ["Posting depends on memory", "Stops the first busy week", "Restarts with an apology post", "Never compounds"],
      },
      right: {
        h: "Paid without a ceiling",
        items: ["Spend first, measure later", "Every customer loses money", "The launch \"worked\"", "The business didn't"],
      },
    },
    {
      kind: "agenda",
      title: "Tonight",
      items: [
        "Automating the content pipeline",
        "Distribution without a social media manager",
        "Performance marketing basics",
        "The CAC ceiling",
        "Pricing, quickly",
        "Weekend logistics",
      ],
    },

    {
      kind: "timeline",
      title: "Where we are",
      note: "Six Wednesdays, then the weekend. Every session is free and standalone — you don't have to attend all of them to compete in October, and catching up late is explicitly allowed.",
    },

    { kind: "act", n: "01", eyebrow: "Act one", title: "Distribution that runs without you", c: "Built on screen. The half most builders never automate." },
    {
      kind: "loop",
      title: "The content pipeline",
      label: "runs weekly",
      steps: [
        { t: "Content map in, topics out" },
        { t: "Agent drafts, holding your voice" },
        { t: "You review — genuinely, or not at all" },
        { t: "Queued, repurposed per channel" },
      ],
      note: "Decide where a human actually stays in the loop. A checkpoint you always rubber-stamp is theatre — remove it or mean it.",
    },
    {
      kind: "statement",
      text: "The ambitious cadence is the one you abandon in week three. Halve it.",
      note: "One piece of work, repurposed across channels automatically, at a rate that survives a bad month.",
    },

    { kind: "act", n: "02", eyebrow: "Act two", title: "Paid, and its ceiling", c: "Everything about performance marketing is downstream of one number." },
    {
      kind: "bullets",
      title: "Performance marketing basics",
      items: [
        { t: "Account structure", c: "Simple enough that you can tell what's working. Complexity buys nothing at this budget." },
        { t: "Angles, not variations", c: "Five ways to say one thing is one test. Five different reasons to care is five tests." },
        { t: "Narrow before broad", c: "Start where you're confident. Broad-first spends your budget teaching the platform." },
        { t: "The daily loop", c: "One look, three options: raise, hold, cut — against a number you set in advance." },
      ],
    },
    {
      kind: "metric",
      title: "The CAC ceiling",
      items: [
        { v: "LTV", l: "what a customer is worth" },
        { v: "÷ payback", l: "how fast you need it back" },
        { v: "= ceiling", l: "the most you can pay" },
      ],
      note: "Work it out with your real numbers, not a template's.",
    },
    {
      kind: "matrix",
      title: "The same channel, two businesses",
      heads: ["Unsustainable", "Sustainable"],
      rows: [
        { t: "Cost per customer", cells: ["$90", { v: "$90", lit: true }] },
        { t: "First-year value", cells: ["$70", { v: "$310", lit: true }] },
        { t: "Payback", cells: ["never", { v: "4 months", lit: true }] },
        { t: "Verdict", cells: ["Scaling this loses money faster", { v: "Scaling this is the job", lit: true }] },
      ],
      note: "The channel isn't good or bad. The arithmetic underneath it is.",
    },
    {
      kind: "statement",
      text: "If the ceiling is lower than any channel can hit, that's not a marketing problem.",
      note: "It's pricing or retention. Fix it before Saturday, not after.",
    },
    {
      kind: "bullets",
      title: "Pricing, quickly",
      items: [
        { t: "Match how value arrives", c: "Per-seat, usage, flat — the model should track the thing that grows when they succeed." },
        { t: "Decide it deliberately tonight", c: "Rather than anxiously on Saturday afternoon with a judge walking over." },
        { t: "Defensible in a sentence", c: "If you can't explain it in one, customers can't understand it either." },
      ],
    },
    {
      kind: "terminal",
      cmd: "/social-automation  →  /unit-economics  →  /paid-basics",
      out: ["queue: 7 posts scheduled", "CAC ceiling: $86", "wrote 06-growth/README.md"],
      title: "Tonight's runs",
      c: "The pipeline, then the arithmetic, then the plan that has to clear it. Add /pricing-model if pricing isn't settled, and /launch-checklist on Friday night.",
    },

    { kind: "act", n: "03", eyebrow: "Act three", title: "The weekend", c: "Venue, timings, what to bring. Then it's on." },
    {
      kind: "flow",
      title: "October 16–18, Workuity Biltmore",
      steps: [
        { t: "Fri 6:00 PM", c: "Kickoff and Launch Rehearsal. Teams of 1–4." },
        { t: "Saturday", c: "Build, launch, gather receipts. Mentors in the room." },
        { t: "Sun 12:00 PM", c: "Submissions close.", lit: true },
        { t: "Sunday PM", c: "Judging, then Crowd Favorite voted by the room." },
      ],
      note: "Scoring: shipped 40, receipts 30, growth engine 20, craft 10.",
    },
    {
      kind: "statement",
      text: "You've had ten weeks and a roadmap. The only thing left is to launch it.",
    },
    { kind: "quote", text: "Feel the fear and do it anyways." },
    {
      kind: "end",
      next: "Zero to Launch — Oct 16–18, Workuity Biltmore",
      qr: "workshops",
      qrLabel: "The program",
      c: "Doors Friday at 6. Bring the thing that's been sitting at 90%.",
    },
  ],
};

export function deckFor(slug) {
  return DECKS[slug];
}

export function deckLength(slug) {
  return DECKS[slug]?.length ?? 0;
}
