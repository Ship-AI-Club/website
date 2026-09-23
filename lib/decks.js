/* ------------------------------------------------------------------
   Zero to Launch — the presentations.

   Slides are data, not slide files. They render as a real deck at
   /programs/<program>/<slug>/deck (arrow keys, fullscreen, print to
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

   Slide kinds — live night (the meetup, not just the talk):
     news      — one story from the wire: index numeral, headline,
                 facts, and a prompt the room argues about
     break     — a timed intermission; the bar drains in pixel steps
                 from the moment the slide arrives
     thanks    — a sponsor or host, with their mark
     sponsors  — the community wall: every mark in one row, monochrome
     contact   — where to find the speaker, one row per surface
     walk      — a progressive walkthrough: → steps through the stages
                 one at a time, lighting the rail and swapping the
                 detail card, before the deck moves on. Steps are also
                 clickable. `t` names the stage, `c` is the one-line
                 caption on the rail, `d` is the full explanation.

   Rule of thumb: if a slide is a list of things that happen in an
   order, it's a flow. If it's a list of things that shrink, it's a
   funnel. If it comes back around, it's a loop. If one number carries
   it, it's a bignum. Only use bullets when the points genuinely have
   no shape.

   Editorial constraint: no more than two consecutive text-only slides,
   and at least three diagram slides per fifteen. If you find yourself
   writing a third `bullets` in a row, one of them is a diagram.
------------------------------------------------------------------ */

import { B2B_CASE_DECK } from "./b2b-case-deck.js";
import { ABOUT_SLIDE, HOST_SLIDE } from "./deck-shared.js";
import { DAY_ZERO_DECKS } from "./dayzero-decks.js";
import { PRODUCT_BUILDER_DECKS } from "./product-builder-decks.js";
import { GROWTH_LOOPS_DECKS } from "./growth-loops-decks.js";

/* The GTM title mark — ANSI-shadow block letters, same face as the
   homepage hero. Letters are fixed-width cells joined with one space,
   so the pre stays rectangular. */
const ASCII_GTM = ` ██████╗  ████████╗ ███╗   ███╗
██╔════╝  ╚══██╔══╝ ████╗ ████║
██║  ███╗    ██║    ██╔████╔██║
██║   ██║    ██║    ██║╚██╔╝██║
╚██████╔╝    ██║    ██║ ╚═╝ ██║
 ╚═════╝     ╚═╝    ╚═╝     ╚═╝`;

/* Session marks — one short word each, same face. Generated with
   figlet "ANSI Shadow"; keep letters fixed-width so the pre stays
   rectangular. */
const ASCII_3K = `▄▄███▄▄·██████╗ ██╗  ██╗
██╔════╝╚════██╗██║ ██╔╝
███████╗ █████╔╝█████╔╝
╚════██║ ╚═══██╗██╔═██╗
███████║██████╔╝██║  ██╗
╚═▀▀▀══╝╚═════╝ ╚═╝  ╚═╝`;

const ASCII_UNFAIR_ADVANTAGE = `██╗   ██╗███╗   ██╗███████╗ █████╗ ██╗██████╗
██║   ██║████╗  ██║██╔════╝██╔══██╗██║██╔══██╗
██║   ██║██╔██╗ ██║█████╗  ███████║██║██████╔╝
██║   ██║██║╚██╗██║██╔══╝  ██╔══██║██║██╔══██╗
╚██████╔╝██║ ╚████║██║     ██║  ██║██║██║  ██║
 ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝
 █████╗ ██████╗ ██╗   ██╗ █████╗ ███╗   ██╗████████╗ █████╗  ██████╗ ███████╗
██╔══██╗██╔══██╗██║   ██║██╔══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔════╝ ██╔════╝
███████║██║  ██║██║   ██║███████║██╔██╗ ██║   ██║   ███████║██║  ███╗█████╗
██╔══██║██║  ██║╚██╗ ██╔╝██╔══██║██║╚██╗██║   ██║   ██╔══██║██║   ██║██╔══╝
██║  ██║██████╔╝ ╚████╔╝ ██║  ██║██║ ╚████║   ██║   ██║  ██║╚██████╔╝███████╗
╚═╝  ╚═╝╚═════╝   ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝`;

const ASCII_SITE = `███████╗██╗████████╗███████╗
██╔════╝██║╚══██╔══╝██╔════╝
███████╗██║   ██║   █████╗
╚════██║██║   ██║   ██╔══╝
███████║██║   ██║   ███████╗
╚══════╝╚═╝   ╚═╝   ╚══════╝`;

const ASCII_GROW = ` ██████╗ ██████╗  ██████╗ ██╗    ██╗
██╔════╝ ██╔══██╗██╔═══██╗██║    ██║
██║  ███╗██████╔╝██║   ██║██║ █╗ ██║
██║   ██║██╔══██╗██║   ██║██║███╗██║
╚██████╔╝██║  ██║╚██████╔╝╚███╔███╔╝
 ╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚══╝╚══╝`;

const ZERO_TO_LAUNCH_PARTNERS = {
  kind: "sponsors",
  title: "Sponsors & community partners",
  orgs: [
    { name: "Workuity", img: "/sponsor-workuity.png", tag: "Platinum sponsor · Venue" },
    { name: "desic", img: "/sponsor-desic.svg", tag: "Gold sponsor · AI deployment" },
    { name: "AutomationInterns.com", img: "/sponsor-automationinterns.png", tag: "Gold sponsor · Everyday AI", color: true },
  ],
  note: "Workuity hosts the room. desic and AutomationInterns.com help keep every session free and public.",
};

export const DECKS = {
  "gtm-engineering": [
    { kind: "title", ascii: ASCII_GTM, art: "sail", sub: "Go-to-market engineering, end to end" },
    {
      kind: "agenda",
      title: "Tonight",
      items: [
        "The brief — thirty minutes of AI news worth arguing about",
        "Break — five minutes, timed by the slide",
        { t: "GTM engineering — why it matters, what it is, what the systems look like", lit: true },
        "Live demos — real systems, dashboards open",
        "What's next — and who made tonight happen",
      ],
    },
    ABOUT_SLIDE,
    {
      kind: "bullets",
      cols: 2,
      title: "How the room works",
      items: [
        { t: "Free and Open", c: "No tickets, no tiers, no gatekeeping. You pay by teaching what you know back to the room." },
        { t: "Demos Over Memos", c: "Show the build. Founders too — demo the product, skip the hard sell. If it ships, it speaks." },
        { t: "Craft Over Hype", c: "The toolchain, the tradeoffs, the parts that hurt." },
        { t: "Honest Starting Points", c: "Say where you actually are. Nothing solid gets built on an inflated baseline." },
        { t: "Proof of Work", c: "A small real result beats a big vague claim. Receipts over adjectives." },
        { t: "Community-Driven", c: "Every session ends in five-minute demos, and what you're stuck on shapes the next one." },
      ],
    },
    {
      kind: "split",
      title: "Come as you are, if you build",
      left: {
        h: "Maybe not yet if",
        items: [
          "You're here to hard-sell or fill a lead list",
          "\"AI-powered\" is the whole pitch, with no build behind it",
        ],
      },
      right: {
        h: "This is for you if",
        items: [
          "You're new to this — Day Zero takes you from a blank chat box to something running",
          "You've shipped something and nobody's using it yet — that's this program",
          "You'd rather watch a real demo, even one that breaks, than a canned pitch",
          "You want a room that argues about tradeoffs, not definitions",
        ],
      },
    },
    HOST_SLIDE,
    {
      kind: "end",
      eyebrow: "Before we start",
      next: "Join the Ship AI Discord",
      qrLabel: "discord.gg/kZSJMNveYM",
      c: "Everything from tonight lands there — the deck, the skills, the demos, the arguments we don't finish. Free, always.",
    },
    {
      kind: "sponsors",
      title: "Community partners",
      orgs: [
        { name: "Workuity", img: "/sponsor-workuity.png", tag: "Platinum sponsor · Venue" },
        { name: "CEI Gateway", img: "/sponsor-cei.png", tag: "Community partner" },
        { name: "Venture Café Phoenix", img: "/sponsor-venturecafe.png", tag: "Community", wide: true },
      ],
      note: "The rooms, the nights, the coffee. Ship AI is free because these three show up for builders.",
    },
    {
      kind: "sponsors",
      title: "Current sponsors",
      orgs: [
        { name: "desic", img: "/sponsor-desic.svg", tag: "Gold · AI deployment" },
        { name: "AutomationInterns.com", img: "/sponsor-automationinterns.png", tag: "Gold · Everyday AI", color: true },
      ],
    },
    {
      kind: "end",
      eyebrow: "Sponsors",
      next: "Ship AI is seeking corporate sponsors",
      qr: "sponsors",
      qrLabel: "The menu — shipai.club",
      c: "Free for the room means funded by somebody. Published tiers run $1,000 to $10,000 — cash, credits, or hours all count — and we're flexible: there's opportunity at every price point, and a custom arrangement is always on the table.",
    },

    /* ---- segment one: the brief ---- */
    {
      kind: "act",
      n: "01",
      eyebrow: "Segment one",
      title: "The brief",
      art: "net",
      c: "Five stories from the last week, plus quick hits. Thirty minutes of the loudest room in AI — then we go build things with it.",
    },
    {
      kind: "news",
      n: "01",
      title: "Meta ships Muse Code",
      src: "@AIatMeta · @finkd · today",
      href: "https://x.com/finkd/status/2085080750034940201",
      video: "https://x.com/AIatMeta/status/2085084718416949323",
      facts: [
        "A terminal coding agent, in beta today: plans changes, writes code, validates results across large repos. Powered by Muse Spark 1.2.",
        "The demo: feed it an mp4 fly-through of a house, get back a finished website.",
        "Stress test: 24-hour runs, 1,000+ tool calls, optimizing GPU kernels on Hopper past hand-tuned baselines.",
      ],
      prompt: "Zuck says they're so back. Does Muse Code crack your terminal rotation, or is it a benchmark toy?",
    },
    {
      kind: "news",
      n: "02",
      title: "OpenAI cuts Luna pricing 80% — forever",
      src: "@thsottiaux · Aug 3",
      href: "https://x.com/thsottiaux/status/2084506501834829833",
      facts: [
        "GPT-5.6 Luna's price drop is permanent — \"efficiency gains,\" not a promo, straight from OpenAI.",
        "The community read: \"your usage will feel infinite.\" Max reasoning effort as the default, not the splurge.",
        "Cheap-and-smart is now a tier every lab has to answer.",
      ],
      prompt: "When intelligence gets this cheap, what breaks first — per-seat pricing, agencies, or your roadmap?",
    },
    {
      kind: "news",
      n: "03",
      title: "DeepSeek V4 Flash resets the price floor",
      src: "@arena · Aug 4",
      href: "https://x.com/arena/status/2084807343926399463",
      facts: [
        "$0.024 median cost per task on Agent Arena — a new point on the cost-performance frontier, right past GPT-5.6 Luna on xHigh.",
        "#3 open-source model overall, measured on 12,500 real agentic sessions, not a benchmark suite.",
        "Open weights keep landing weeks behind the frontier, at a fraction of the price.",
      ],
      prompt: "Is there any moat left for closed models under three cents a task?",
    },
    {
      kind: "news",
      n: "04",
      title: "“Source code is the new assembly”",
      src: "@elonmusk · Aug 3",
      href: "https://x.com/elonmusk/status/2084304083851034949",
      facts: [
        "Musk's claim: the next step is skipping source entirely — AI emitting efficient binaries directly.",
        "The spark: a 50-year engineer saying he trusts AI output the way he learned to trust compilers.",
        "27K likes, 8M views, and every senior engineer on X has a take.",
      ],
      prompt: "Provocation or roadmap? What would it take before you stopped reading your own code?",
    },
    {
      kind: "news",
      n: "05",
      title: "SSI's first model, reportedly this month",
      src: "via @MTSlive · Aug 4",
      href: "https://x.com/MTSlive/status/2084675767053824332",
      facts: [
        "Ilya Sutskever's Safe Superintelligence is said to launch its first model in August 2026.",
        "The most-funded startup with zero shipped products is about to have one.",
        "Nobody outside knows what a \"straight shot to superintelligence\" looks like as a product.",
      ],
      prompt: "What actually ships — a frontier model, a research demo, or nothing at all?",
    },
    {
      kind: "bullets",
      title: "Quick hits",
      items: [
        { t: "Mayo Clinic sued by its own AI compliance lead", c: "The allegation: a concealed 67% error rate in a deployed clinical tool. Deployment is the hard part." },
        { t: "Cuban: AI datacenters are the next pickleball courts", c: "His bet — massively overbuilt capacity looking for a second life." },
        { t: "Mathematicians report a “very rapid, very unsettling change”", c: "Open problems are falling to AI faster than the field can referee." },
        { t: "Markets can't make up their mind", c: "S&P record high then a plunge, same day. AI capex argues both sides." },
      ],
      note: "Anything we missed that deserved the top five? That's what the walk to the break is for.",
    },

    /* ---- the break, timed by the slide ---- */
    {
      kind: "break",
      clock: "05:00",
      secs: 300,
      c: "Stretch, refill, introduce yourself to somebody you haven't met. The bar knows when time's up.",
    },

    /* ---- segment two: GTM engineering ---- */
    {
      kind: "act",
      n: "02",
      eyebrow: "Segment two",
      title: "GTM engineering",
      art: "mark",
      c: "Why distribution matters more than another feature, what go-to-market actually is, and the systems that do it while you sleep.",
    },
    {
      kind: "statement",
      text: "You can ship code forever and never launch anything.",
      note: "That's the room. That's why this program exists.",
    },
    {
      kind: "statement",
      text: "Products rarely die of bad code. They die unseen.",
      note: "Distribution is a system, and systems can be engineered — which is very good news for a room full of engineers.",
    },
    {
      kind: "timeline",
      title: "Tonight is the bird's-eye view",
      note: "Six workshops, then the October 16–18 weekend. Tonight is the whole go-to-market system in one pass — catch the shape now, collect the specifics as we go.",
    },
    { kind: "act", n: "03", eyebrow: "The map", title: "The three acts", art: "globe", c: "Every go-to-market motion is one of three jobs. Doing them out of order is the most common way a good product stays invisible." },
    {
      kind: "walk",
      title: "Launch → Grow → Optimize",
      steps: [
        {
          t: "Launch",
          c: "get to market, get to signal",
          d: "Get it in front of anyone at all. The bar is a stranger using it — not a perfect product. Seed the first fifty users by hand, charge from day one, and instrument every event before you tell a soul.",
        },
        {
          t: "Grow",
          c: "one channel that repeats",
          d: "Find one channel that repeats and feed it. One — run two at once and you learn nothing from either. Then turn users into distribution: community, referrals, building in public. Compounding beats bursts.",
        },
        {
          t: "Optimize",
          c: "squeeze the funnel you have",
          d: "Know your numbers — CAC, LTV, payback, churn. Kill what doesn't convert and double down on what does. It's the cheapest act, and the one everybody wrongly starts with: you cannot optimize a funnel nobody is in.",
        },
      ],
      note: "The order is the point. Each act only pays off once the one before it has.",
    },
    {
      kind: "statement",
      text: "Most builders pick tactics before they have a model.",
      note: "An ad account before a funnel. A blog before a keyword. A pricing page before unit economics.",
    },

    { kind: "act", n: "04", eyebrow: "The model", title: "Model the funnel", art: "dome", c: "Not the six stages from a template. The four you can actually put a number against this week." },
    {
      kind: "funnel",
      title: "Measure every stage, not the end",
      stages: [
        { t: "Awareness", c: "impressions, referrers", w: 1 },
        { t: "Interest", c: "sessions, time on page", w: 0.78 },
        { t: "Activation", c: "signup → first real use", w: 0.52, lit: true },
        { t: "Revenue", c: "first paid event", w: 0.34 },
        { t: "Retention", c: "week 4 still here", w: 0.22 },
      ],
      note: "Revenue is a lagging number. It tells you something broke, never where. Activation — signup to first real use — is where most builder funnels actually leak.",
    },
    {
      kind: "statement",
      title: "Live walkthrough",
      text: "Same funnel, two real businesses.",
      tags: ["desic.xyz — B2B", "ggbucks.com — B2C"],
      note: "Dashboards open: where each stage is measured, and where each one actually leaks.",
    },
    {
      kind: "statement",
      title: "What is GTM engineering",
      text: "The intersection of growth, product, and distribution — built with code, not campaigns.",
      tags: ["Growth", "Product", "Distribution"],
      note: "The test is simple: if the work ships as software — pages, agents, pipelines, dashboards — it's GTM engineering. If it ships as spend, it's marketing.",
    },
    {
      kind: "split",
      title: "Two ways to do this",
      left: {
        h: "By default",
        items: [
          "Ads before the funnel exists",
          "Hire salespeople early",
          "Agency retainer",
          "Attribution by vibes",
          "Scale by spending more",
        ],
      },
      right: {
        h: "GTM engineering",
        items: [
          "Paid ads, wired to the funnel",
          "Outbound agents",
          "Programmatic pages",
          "Automated attribution",
          "Scale by shipping more",
        ],
      },
      note: "Nothing wrong with ads — performance marketing is core, and session 06 is a whole night on scaling it profitably. The left column fails because it's a budget without a system. The right one is a codebase, and you already know how to build a codebase.",
    },
    {
      kind: "prism",
      title: "One product, many routes to market",
      note: "GTM engineering is the work of splitting one thing you built into every surface a stranger might find it on — and instrumenting each one so you know which of them worked.",
      channels: ["Search", "Community", "Outbound", "Paid"],
      rays: 4,
    },
    {
      kind: "engine",
      title: "The distribution engine",
      note: "Write it once. The engine does the rest — and every surface reports back.",
    },

    {
      kind: "loop",
      title: "A growth loop, not a to-do list",
      steps: [{ t: "Instrument — a data event fires at every stage" }, { t: "Ship — a page, a sequence, an agent" }, { t: "Measure — against the funnel, not vibes" }, { t: "Cut or scale — kill losers fast, feed winners" }],
      label: "Weekly",
      note: "Repeatable — four steps a week. Scalable — code runs it, not headcount. Dynamic — each pass steers the next.",
    },
    {
      kind: "matrix",
      title: "The fork: B2C and B2B",
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
      kind: "statement",
      text: "Every system in this deck takes the same three inputs.",
      note: "Who it's for. What they get. Why you, and not the thing they already use. Get those wrong and the machine runs perfectly, aimed at nobody.",
    },
    {
      kind: "flow",
      title: "The input to everything",
      steps: [
        { t: "Who", c: "One segment, narrow enough to name twenty real accounts." },
        { t: "Instead of", c: "The real alternative is a spreadsheet or nothing. Rarely a competitor." },
        { t: "Value prop", c: "What they get, in their words. Not what it does, in yours." },
        { t: "USP", c: "The differentiators every competitor can't also claim." },
        { t: "Sharp edge", c: "The one they can't copy this quarter.", lit: true },
      ],
      note: "Write these five once and they become your hero, your cold email, your ad and your pitch. Skip them and you write all four separately, and they disagree.",
    },
    { kind: "act", n: "05", eyebrow: "The systems", title: "In production", art: "bolt", c: "Not theory — running systems. The day-one stack, three shapes you'll see everywhere, the toolkit behind them, and the numbers that say they're working." },
    {
      kind: "bullets",
      title: "Your launch stack — six day-one decisions",
      cols: 2,
      items: [
        { t: "Product", c: "Next.js, Supabase, Clerk. A working MVP, not a prototype." },
        { t: "Monetization", c: "Revenue from day one — fees, subscriptions, or usage. Never ship free without a plan." },
        { t: "Distribution", c: "Programmatic SEO, content, social — built into the product itself." },
        { t: "Attribution", c: "Dub.co from day one. If you can't trace a user to a channel, you can't scale." },
        { t: "Community", c: "A Discord from launch. Your first users are your feedback loop and your first superfans." },
        { t: "Analytics", c: "PostHog. Instrument every event — no data, no decisions." },
      ],
      note: "Ship in weeks, not months. Deciding these six up front is what makes every system after this slide possible.",
    },
    {
      kind: "walk",
      title: "System one: the programmatic SEO engine",
      steps: [
        {
          t: "Dataset",
          c: "what buyers actually search",
          d: "Build a table of every competitor, alternative, use case, and city your buyer types into a search box. This is a data problem, not a writing problem — agents compile it in an afternoon.",
        },
        {
          t: "Template",
          c: "one component, n pages",
          d: "One page component renders the whole dataset: comparison pages, \"[X] alternative\" pages, \"[product] for [niche]\" pages. Fifty good AI-drafted, human-edited pages beat five perfect ones.",
        },
        {
          t: "Publish",
          c: "pages ship like code",
          d: "Reviewed, deployed, indexed — the same pipeline as your product. Google rewards freshness and topical authority, so the engine keeps compounding while you sleep.",
        },
        {
          t: "Measure",
          c: "revenue per page",
          d: "Track impressions → clicks → signups → revenue, per page. Kill pages that get traffic but never convert; scale the ones that do. SEO without attribution is just blogging.",
        },
      ],
      note: "Organic search is the cheapest compounding channel there is. Start it on day one.",
    },
    {
      kind: "walk",
      title: "System two: the outbound machine",
      steps: [
        {
          t: "List",
          c: "200 perfect-fit accounts",
          d: "200 perfect-fit accounts beat 5,000 spray-and-pray contacts. Score by ICP fit, budget, and timeline — qualify ruthlessly before you write a single word.",
        },
        {
          t: "Enrich",
          c: "find the hook",
          d: "Agents research each account and surface the specific thing worth mentioning — the launch, the hire, the public complaint. \"I noticed [specific thing]\" is the whole cold-email formula.",
        },
        {
          t: "Sequence",
          c: "day 1 · 3 · 7 · 14",
          d: "Automated follow-ups on days 1, 3, 7 and 14, a different angle each touch. 80% of deals close after the fifth touchpoint — the machine never forgets to follow up.",
        },
        {
          t: "Reply",
          c: "a human closes",
          d: "The moment someone answers, automation stops. A person books the call, runs the demo, closes the deal. That part shouldn't scale — that's the point.",
        },
      ],
      note: "Inbound compounds over months; outbound generates pipeline this week. Systems let one founder run both.",
    },
    {
      kind: "walk",
      title: "System three: your brand, built like code",
      steps: [
        {
          t: "Tokens",
          c: "pick your look once",
          d: "One file holds your colors, your fonts, your spacing. Everything you make reads from it. Spend an hour picking once — then never argue with yourself about it again.",
        },
        {
          t: "Components",
          c: "the same ten pieces everywhere",
          d: "Buttons, cards, headers — built once, reused everywhere. Your site, your deck, and your one-pager are made of the same pieces, so they can't drift apart.",
        },
        {
          t: "Generator",
          c: "slides and one-pagers from data",
          d: "Write the content; let the system make it look right. Decks, one-pagers, social images — all generated. These slides are a list in a file, and fixing a typo is a one-line change.",
        },
        {
          t: "Every surface",
          c: "site, deck, email, README",
          d: "Someone might meet you on your site, your deck, or your GitHub first. All of them should look and sound like the same company. That's the whole trick.",
        },
      ],
      note: "An hour on day one. Everything you make after that matches — automatically.",
    },
    {
      kind: "statement",
      text: "Polish takes you from looking like a 4 to a 9.",
      note: "Same product, same founder. The delta is consistency on every surface — a build step now, not a hire. Your product isn't behind the brand. It is the brand.",
    },
    {
      kind: "matrix",
      title: "The toolkit, one job each",
      heads: ["Tool", "Why it earns a slot"],
      rows: [
        { t: "Attribution", cells: ["Dub.co", "If you can't trace a user to a channel, you can't scale."] },
        { t: "Analytics", cells: ["PostHog", "Events, replays, flags. No data, no decisions."] },
        { t: "Outbound", cells: ["Instantly", "A thousand emails a day for thirty dollars."] },
        { t: "CRM", cells: ["Attio", "The free tier gets you to $1M ARR."] },
        { t: "Social", cells: ["Postiz", "Write once, post everywhere."] },
        { t: "Content", cells: ["AI SDK", "Text, images, video on demand — a content team of one."] },
        { t: "Demos", cells: ["Screen Studio", "Recordings good enough to be the ad."] },
        { t: "Scheduling", cells: ["Cal.com", "\"When are you free?\" answered with a link."] },
      ],
      note: "The stack is a rounding error next to one ad campaign. The moat isn't the tools — it's the loop you wire them into.",
    },
    {
      kind: "metric",
      title: "Know your numbers",
      items: [
        { v: "3×", l: "LTV over CAC — the golden ratio", lit: true },
        { v: "6", l: "Months to CAC payback, or it's broken" },
        { v: "40%", l: "D1 retention floor — or fix onboarding" },
      ],
      note: "If you don't know these, you're not running a business — you're running a hobby. The dashboard comes before month six, not after.",
    },
    {
      kind: "statement",
      title: "The rule",
      text: "Doing it manually? Automate it — with Eve.",
      art: "bolt",
      note: "Every system in this deck started as a manual task somebody refused to do a third time. If you catch yourself doing one, that's the signal.",
    },
    {
      kind: "statement",
      title: "Your turn",
      text: "Enough slides. Open Excalidraw.",
      tags: ["excalidraw.com"],
      note: "Sketch your funnel — the stages, the data event each one fires, and where you think it leaks. Then we'll put live dashboards next to it and see who guessed right.",
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
      kind: "matrix",
      title: "What each session hands off",
      heads: ["When", "You leave with", "It feeds"],
      rows: [
        { t: "01 · GTM Engineering", cells: ["Tonight", "The map — acts, funnel, systems", "Every session after it"] },
        { t: "02 · Zero to $3,000", cells: ["Aug 19", "The B2C playbook, receipts included", "The paid ceiling in 06"] },
        { t: "03 · Outbound Agents", cells: ["Sep 2", "Twenty named accounts", "The sequence you send in October"] },
        { t: "04 · Unfair Advantage", cells: ["Sep 16", "Positioning brief and pitch", { v: "The hero, the bio, the ad, the pitch", lit: true }] },
        { t: "05 · Ship the Surface", cells: ["Oct 7", "A deployed site, profiles fixed", "What every channel points at"] },
        { t: "06 · Agentic Growth", cells: ["Oct 14", "Content automation, a CAC ceiling", "The weekend"] },
      ],
      note: "Six deliverables, each one the input to the next. The chain is why the order is the order.",
    },
    {
      kind: "flow",
      title: "Work backwards from Oct 16",
      steps: [
        { t: "Aug", c: "Roadmap, first channel, funnel wired." },
        { t: "Sep", c: "Pipeline or paid test. Positioning settled." },
        { t: "Oct 7", c: "Site deployed, profiles fixed." },
        { t: "Oct 16", c: "It goes public.", lit: true },
      ],
      note: "Ten weeks. A dated list with fewer than ten items on it — longer than that and it isn't a plan.",
    },
    {
      kind: "statement",
      text: "Ship. Measure. Iterate.",
      note: "GTM engineering isn't a department. It's a mindset — and it's the whole curriculum between now and October.",
    },
    {
      kind: "thanks",
      title: "Dan & Workuity",
      tag: "Platinum sponsor · The venue",
      c: "Workuity Biltmore hosts and sponsors every meetup in this series and the October weekend. Rooms like tonight don't happen without Dan and this community — thank him on your way out.",
      img: "/sponsor-workuity.png",
      imgAlt: "Workuity",
    },
    {
      kind: "thanks",
      title: "AutomationInterns.com",
      tag: "Gold sponsor",
      c: "Affordable AI for everyday business — and the newest name on the Ship AI sponsor wall. Welcome Jon S and the interns.",
      img: "/sponsor-automationinterns.png",
      imgAlt: "AutomationInterns.com",
      color: true,
    },
    {
      kind: "end",
      eyebrow: "Sponsors",
      next: "Your logo belongs on this wall",
      qr: "sponsors",
      qrLabel: "The menu — shipai.club",
      c: "If tonight was useful, this is how it stays free. Every tier is published, every arrangement is negotiable — cash, credits, or hours, at every price point. Talk to Santos before you leave, or scan for the menu.",
    },
    {
      kind: "contact",
      title: "Say hi",
      art: "dome",
      rows: [
        { l: "X", v: "@5antoshernandez", c: "Build in public — arguments welcome.", lit: true },
        { l: "Discord", v: "discord.gg/kZSJMNveYM", c: "Where tonight's links, slides, and skills land." },
        { l: "Work with me", v: "desic.xyz", c: "Want systems like these built and run for you? That's my team." },
      ],
      note: "Everything tonight is open source — the deck, the skills, the template repo. Take it all.",
    },
    { kind: "quote", text: "Feel the fear and do it anyways." },
    {
      kind: "end",
      next: "Zero to $3,000 — Wed Aug 19, Workuity Biltmore",
      qr: "session-b2c-ggbucks-case-study",
      qrLabel: "Session page",
      c: "One business, one dashboard, no redactions. $0 to $3,000 in 30 days with zero paid, then scaling into paid profitably. Bring somebody.",
    },
  ],

  "b2c-ggbucks-case-study": [
    { kind: "title", ascii: ASCII_3K, sub: "B2C, with the dashboard open" },
    ABOUT_SLIDE,
    HOST_SLIDE,
    {
      kind: "agenda",
      title: "Tonight",
      items: [
        "The brief — seven stories, then a five-minute break",
        "Zero to $3k — the case study, with the dashboard open",
        "The knowledge share — the same structure, pointed at your product",
        "Q&A — anything with a number in it",
        "Next event",
      ],
    },
    {
      kind: "timeline",
      title: "Where we are",
      note: "Six Wednesdays, then the weekend. Every session is free and standalone. Join late and you can still compete in October.",
    },
    {
      kind: "sponsors",
      title: "Community partners",
      orgs: [
        { name: "Workuity", img: "/sponsor-workuity.png", tag: "Platinum sponsor · Venue" },
        { name: "CEI Gateway", img: "/sponsor-cei.png", tag: "Community partner" },
        { name: "Venture Café Phoenix", img: "/sponsor-venturecafe.png", tag: "Community", wide: true },
      ],
      note: "The rooms, the nights, the coffee. Ship AI is free because these three show up for builders.",
    },
    {
      kind: "sponsors",
      title: "Current sponsors",
      orgs: [
        { name: "desic", img: "/sponsor-desic.svg", tag: "Gold · AI deployment" },
        { name: "AutomationInterns.com", img: "/sponsor-automationinterns.png", tag: "Gold · Everyday AI", color: true },
      ],
    },
    {
      kind: "end",
      eyebrow: "Sponsors",
      next: "This room is free because somebody funded it",
      qr: "sponsors",
      qrLabel: "The menu — shipai.club",
      c: "Ship AI is seeking sponsors. Tiers run $1,000 to $10,000. Cash, credits and hours all count the same.",
    },

    /* ---- segment one: the brief ---- */
    {
      kind: "act",
      n: "01",
      eyebrow: "Segment one",
      title: "The brief",
      art: "net",
      c: "Seven stories from the last week, and the argument under each one. Then five minutes, then we open the dashboard.",
    },
    {
      kind: "news",
      n: "01",
      of: "07",
      title: "Grok 4.6 ties Opus 5 Max on agentic work",
      src: "@changis_k · Artificial Analysis",
      href: "https://x.com/changis_k/status/2089366682083225893",
      facts: [
        "Both score 59 on the Agentic Index. It measures tool use, planning and autonomy, not single answers.",
        "Grok finishes a task in about 53 turns. Opus 5 Max takes about 103.",
        "$0.84 per completed task.",
      ],
      prompt: "You pay per finished task, not per benchmark point. Which of your agents survives that maths?",
    },
    {
      kind: "news",
      n: "02",
      of: "07",
      title: "Claude Code can design now",
      src: "@ClaudeDevs",
      href: "https://x.com/ClaudeDevs/status/2089471692762673408",
      facts: [
        "A /design skill in research preview, in the CLI and the desktop app.",
        "Editable artboards for your interface. Pick one, change it, then have Claude build it.",
        "Design moves into the same window as the code.",
      ],
      prompt: "Who still opens a design tool before they open an editor?",
    },
    {
      kind: "news",
      n: "03",
      of: "07",
      title: "Whop goes native inside Grok",
      src: "@whop",
      href: "https://x.com/whop/status/2089444773601935642",
      facts: [
        "Whop is now a native connector in Grok.",
        "The pitch is turning tokens into economic value.",
        "Distribution is moving inside the assistant.",
      ],
      prompt: "If your product were a connector in somebody's assistant, what would they ask it for?",
    },
    {
      kind: "news",
      n: "04",
      of: "07",
      title: "Cursor runs Git like a database",
      src: "@cursor_ai",
      href: "https://cursor.com/blog/git-at-any-scale",
      facts: [
        "They built their own Git storage, called Origin, and run it like a database.",
        "The post traces twenty years of Git infrastructure to explain why.",
        "Agents write far more commits than people do. The old assumptions break.",
      ],
      prompt: "What in your stack was sized for human traffic and now takes agent traffic?",
    },
    {
      kind: "news",
      n: "05",
      of: "07",
      title: "Grok Bot ships quality-of-life fixes",
      src: "@bot",
      href: "https://x.com/bot/status/2089802845239587150",
      facts: [
        "Mobile notifications now group by bot and carry their own icon.",
        "Small, unglamorous, shipped.",
        "This is most of the work.",
      ],
      prompt: "What is the smallest fix on your list that users would actually notice?",
    },
    {
      kind: "news",
      n: "06",
      of: "07",
      title: "Two labs took 43% of all venture dollars",
      src: "Q2 2026 funding data",
      href: "https://news.crunchbase.com/sections/ai/",
      facts: [
        "AI captured more than 70% of global venture funding in Q2.",
        "OpenAI and Anthropic together: $217B, about 43% of every venture dollar in the quarter.",
        "Infrastructure keeps clearing too. Fireworks AI raised $1.5B, Together AI $800M.",
      ],
      prompt: "None of that money is available to you. So what is the advantage of being small?",
    },
    {
      kind: "news",
      n: "07",
      of: "07",
      title: "Phoenix: MiiHealth raises $2.8M seed",
      src: "local · August 2026",
      href: "https://thebusinessperspective.com/ai-startups-that-raised-funding-in-august-2026/",
      facts: [
        "An AI patient-intake assistant, built here, funded this month.",
        "Not a frontier lab. One workflow, one regulated industry, sold to people who have that problem.",
        "That is the shape of company this room can build.",
      ],
      prompt: "What boring workflow do you already understand better than almost anyone?",
    },

    /* ---- the break, timed by the slide ---- */
    {
      kind: "break",
      clock: "05:00",
      secs: 300,
      c: "Five minutes. Get a refill, meet somebody you didn't come with. When the bar empties we open the dashboard.",
    },

    /* ---- segment two: the case study ---- */
    {
      kind: "act",
      n: "02",
      eyebrow: "Segment two",
      title: "The case study",
      art: "globe",
      c: "One product, one dashboard, no redactions. What it made, what it lost, and what it took to climb back.",
    },
    {
      kind: "statement",
      text: "Case studies are usually told by someone with an outcome to sell.",
      note: "Told with the analytics open, including the money wasted on what didn't work.",
    },
    {
      kind: "bignum",
      label: "First 30 days",
      v: "$3,318",
      delta: "$0 ad spend",
      c: "Feb 7 to Mar 8, 2026, straight off the dashboard. No ad spend. The first paid dollar went out on July 14.",
    },
    {
      kind: "chart",
      wide: true,
      title: "The first thirty days",
      points: [
        { l: "d1", v: 1 },
        { l: "d7", v: 159 },
        { l: "d10", v: 245 },
        { l: "d14", v: 1084 },
        { l: "d18", v: 1974 },
        { l: "d21", v: 2595 },
        { l: "d30", v: 3318 },
      ],
      peak: "$3,318",
      peakLabel: "day 30 · cumulative",
      note: "Cumulative from the day it shipped. $159 by day seven, $3,318 by day thirty. Look at day seven before you panic in your own first week.",
    },
    {
      kind: "chart",
      title: "The trough, seen from August",
      points: [
        { l: "Feb", v: 2815 },
        { l: "Mar", v: 813 },
        { l: "Apr", v: 534 },
        { l: "May", v: 303 },
        { l: "Jun", v: 377 },
        { l: "Jul", v: 2219 },
        { l: "Aug 17", v: 15504 },
        { l: "EOM", v: 30401, proj: true },
      ],
      peak: "$15,504",
      peakLabel: "August MTD · banked, Aug 1–17",
      projValue: "$30,401",
      projLabel: "projected EOM · not banked",
      note: "Monthly revenue, complete days only. Solid is banked. Dashed is a forecast: the trailing 7-day average of $1,064/day held to the 31st. At this scale February is a bump and May's $303 is flat.",
    },
    {
      kind: "curve",
      title: "It isn't your graph. It's the graph.",
      marks: [
        { t: "Feb", c: "the spike" },
        { t: "Mar", c: "reality sets in" },
        { t: "Mar–Jun", c: "$303 floor" },
        { t: "Jul", c: "it starts working" },
        { t: "Aug", c: "$1,060/day", lit: true },
      ],
      note: "Paul Graham named this shape twenty years ago. Cal.com posted theirs at $10m ARR this week, h/t @peer_rich. The trough is where most people quit.",
    },
    {
      kind: "metric",
      title: "Where it is now",
      items: [
        { v: "$1,064", l: "revenue per day, 7-day average", lit: true },
        { v: "$61", l: "ad spend per day" },
        { v: "68%", l: "of this month's installs organic" },
      ],
      note: "Aug 11–17: $7,449 of revenue on $426 of spend, blended. The product had already done $4,949 before the first paid dollar on July 14.",
    },

    { kind: "act", n: "03", eyebrow: "The organic half", title: "Thirty days, no budget", art: "sail", c: "What the channels actually were, in what order, and how much of it was repeatable versus lucky." },
    {
      kind: "walk",
      title: "The arc, in order",
      steps: [
        {
          t: "Manual",
          c: "by hand until it works",
          d: "Find and onboard the first users one at a time. Automating a guess only makes the guess arrive faster.",
        },
        {
          t: "One channel",
          c: "sequence beats coverage",
          d: "One channel at a time, fed until it repeats or clearly doesn't. Run two at once and you can't tell which one moved the number.",
        },
        {
          t: "Repeatable",
          c: "method vs. lucky post",
          d: "Then the honest audit. Which part was the method, and which part was one lucky post? You scale the method.",
        },
        {
          t: "Then paid",
          c: "only once the maths held",
          d: "Paid came last, once the funnel converted organically and payback was a number I could say out loud.",
        },
      ],
      note: "Thirty days, four moves. None needed a budget. They needed doing in this order.",
    },
    {
      kind: "bullets",
      cols: 2,
      title: "The shipping sequence, in order",
      items: [
        { t: "Store prep", c: "Everything that has to be true before you submit. Review turnaround is a schedule input, not a surprise." },
        { t: "ASO", c: "The listing is a ranked surface, not a formality. Title, subtitle, keyword field, screenshots." },
        { t: "Social pages", c: "Set up where the audience already is. Two pages done properly beat six abandoned." },
        { t: "Marketing site", c: "The one asset every channel points at. Oct 7 builds it properly." },
        { t: "Articles, SEO, pSEO", c: "Written once, ranking for months. Programmatic pages where the data supports them: one template, many queries." },
        { t: "Automated content", c: "Drafts off competitor coverage, scheduled and distributed. A pipeline, not a habit." },
        { t: "Friends and family", c: "The ask nearly everyone skips. Your first reviews and installs come from people who already know you." },
      ],
    },
    {
      kind: "flow",
      title: "The same sequence, with the real dates on it",
      steps: [
        { t: "Nov 2025", c: "Marketing site. A landing page existed months before there was an app to land on." },
        { t: "Jan 4", c: "Twenty-two articles, written for search rather than for us." },
        { t: "Jan 21", c: "Social automation: generated images, scheduled to five platforms." },
        { t: "Feb 3", c: "Programmatic pages. Five template families, four locales." },
        { t: "Feb 7", c: "The app goes live in both stores.", lit: true },
        { t: "Jul 14", c: "First paid dollar. Five months and one week after shipping." },
      ],
      note: "Read the gap. Every distribution machine was running before the product existed, and paid came five months after that. The order is the lesson, not the dates.",
    },
    {
      kind: "terminal",
      cmd: "/seo-audit  →  /programmatic-seo",
      out: ["35 articles on disk", "5 template families × 4 locales", "rank proof: none yet"],
      title: "The SEO half, mostly not typed by hand",
      c: "Four skills off skills.sh: seo-audit, programmatic-seo, ai-seo and content-strategy, from coreyhaines31/marketingskills. The pages exist. The rankings aren't proven.",
    },
    {
      kind: "split",
      title: "Automated content, end to end",
      left: { h: "Drafting", items: ["Competitor coverage as the input", "AI SDK does the drafting", "Every claim marked verified or not", "A human reads it before it goes out"] },
      right: { h: "Distribution", items: ["Postiz, until Jul 22", "Then direct, in our own service", "Now moving to Zernio", "Three publishers in seven months"] },
    },
    {
      kind: "flow",
      title: "How the old machine actually worked",
      steps: [
        { t: "Template", c: "A post template with an image prompt and variables: tournament banner, prize pool, activity." },
        { t: "Brand context", c: "Colours and style injected into every prompt automatically, so it all came out looking related." },
        { t: "Nano Banana Pro", c: "google/gemini-3-pro-image through the Vercel AI Gateway. Flux 2 Pro as fallback, Gemini Flash as the cheap seat." },
        { t: "Postiz", c: "Image buffer uploaded, post created, scheduled. No human between the model and the calendar." },
        { t: "Five platforms", c: "Facebook, Instagram, X, YouTube, TikTok — on a schedule, indefinitely.", lit: true },
      ],
      note: "Five steps, no approval gate anywhere. That's the whole design, and it's why it produced 783 posts.",
    },
    {
      kind: "matrix",
      title: "Volume does work. For people with something to say.",
      heads: ["Followers", "Brand searches / mo"],
      rows: [
        { t: "5 posts a week", cells: ["5,194", "302"] },
        { t: "10 a week", cells: ["8,042", "634"] },
        { t: "15 a week", cells: ["11,587", "591"] },
        { t: "25 a week", cells: ["19,531", "2,833"] },
        { t: "26+ a week", cells: [{ v: "53,002", lit: true }, { v: "6,037", lit: true }] },
      ],
      note: "Neil Patel's numbers, published this week. Cadence really does compound. We posted 783 times and got none of this, because the posts were about nothing in particular.",
    },
    {
      kind: "split",
      pair: true,
      title: "Two machines, one idea",
      left: {
        h: "SEO",
        items: [
          "One template, many queries",
          "5 families × 4 locales",
          "35 articles written once",
          "Ranks while you sleep",
        ],
      },
      right: {
        h: "Social",
        items: [
          "One brief, many posts",
          "Images generated, not commissioned",
          "Scheduled to five platforms",
          "Posts while you sleep",
        ],
      },
      note: "Leverage is work you do once that keeps paying. Both machines are cheap to build now and neither one cares how big you are. That is the whole advantage you have over a company with a marketing department.",
    },

    { kind: "act", n: "04", eyebrow: "The compounding half", title: "Community and retention", art: "mark", c: "Paid stops the day you stop paying. This doesn't. Neither does a leak." },
    {
      kind: "loop",
      title: "Community as a growth loop",
      label: "compounds",
      steps: [
        { t: "A user gets real value" },
        { t: "They're given somewhere to say so" },
        { t: "Superfans become ambassadors" },
        { t: "Their reach brings new users" },
      ],
      note: "It's a loop with a conversion rate, not a Discord you open and hope. Ours: 51 referrals started, 5 completed, no ambassador programme yet.",
    },
    {
      kind: "shot",
      title: "The top of the funnel is four buttons",
      img: "/decks/b2c/funnel-01-signin.png",
      imgAlt: "The ggbucks sign-in screen: continue with Google, Apple, email or phone",
      points: [
        "Google and Apple are one tap. No password, no inbox.",
        "Email and phone both cost you a code and a context switch.",
        "Every provider you add is a reason not to bounce here.",
      ],
      note: "This screen is the first thing every ad you buy pays for. Four options rather than a form is the cheapest conversion work available, and it is done once.",
    },
    {
      kind: "funnel",
      title: "An event per stage, verified firing",
      stages: [
        { t: "Installed", c: "session_started", w: 1 },
        { t: "Registered", c: "sng_complete_registration", w: 0.62 },
        { t: "Activated", c: "gg_first_reward_earned", w: 0.31, lit: true },
        { t: "Repeating", c: "gg_reward_earned", w: 0.18 },
        { t: "Cashed out", c: "shop_purchase", w: 0.07 },
      ],
      note: "Our actual events, not a website funnel. The middle three are what Google bids on. Take a baseline today; in eight weeks it's the before half of your October story.",
    },
    {
      kind: "cohorts",
      title: "Fix the leak before you turn on the tap",
      days: 7,
      series: [
        { t: "Jul 20", n: "913", v: [12.3, 8.4, 6.7, 5.5, 4.6, 4.7, 3.1] },
        { t: "Jul 27", n: "785", v: [17.1, 12.4, 11.5, 10.1, 8.9, 8.5, 7.3] },
        { t: "Aug 3", n: "1,316", v: [18.1, 13.6, 12.1, 10.0, 8.5, 6.9, 6.3], lit: true },
        { t: "Aug 10", n: "1,430", v: [25.8, 20.1, 17.7, 19.3, 20.3, 13.0, 12.1], partial: true },
      ],
      note: "Four weekly cohorts, day one to day seven. Aug 3 is the last closed window, so read that one. Aug 10 is dashed and will still move.",
    },

    { kind: "act", n: "05", eyebrow: "The paid half", title: "Then paid", art: "bolt", c: "It came last, on purpose. What had to be true first, what it actually bought, and where the ceiling really sits." },
    {
      kind: "statement",
      text: "Spending before the unit economics were clear would have killed it.",
      note: "Paid doesn't find product-market fit. It buys more of whatever you already have, leak included.",
    },
    {
      kind: "walk",
      title: "The switch to paid",
      steps: [
        {
          t: "Preconditions",
          c: "three things, all true",
          d: "A funnel converting organically, a payback period I could state, and a number I'd stop at. All three written down before the first dollar.",
        },
        {
          t: "Angles, not variations",
          c: "five reasons, not five wordings",
          d: "Five wordings of the same thing is one test. Five reasons to care is five. The angles come out of the value props, not the ad account.",
        },
        {
          t: "The daily loop",
          c: "raise · hold · cut",
          d: "One look a day. Three decisions, judged against a threshold you set in advance.",
        },
        {
          t: "The ceiling",
          c: "$61/day, and not by choice",
          d: "August: $1,098 of spend against $15,479 of revenue. Android is capped at $61/day. Google limits the ad groups over the video claims, and Meta has sat on a billing hold since Aug 13.",
        },
      ],
      note: "Paid didn't create the business. It bought more of a funnel that already worked.",
    },

    {
      kind: "act",
      n: "06",
      eyebrow: "The other half",
      title: "What didn't work",
      art: "net",
      c: "The same length as what did. This is the half nobody publishes, and the half that saves you a month.",
    },
    {
      kind: "matrix",
      title: "Every paid channel, lifetime",
      heads: ["Spend", "Installs", "CPI"],
      rows: [
        { t: "Google Android", cells: ["$1,847", "3,132", "$0.59"], tone: "good" },
        { t: "Apple Search Ads", cells: ["$21", "44", "$0.49"], tone: "good" },
        { t: "Facebook", cells: ["$144", "87", "$1.65"] },
        { t: "TikTok", cells: ["$60", "15", "$4.01"], tone: "bad" },
      ],
      note: "Google does the volume. Apple Search Ads is the cheapest install we buy, on almost no money. TikTok cost seven times Google per install and was killed on day six.",
    },
    {
      kind: "bullets",
      cols: 2,
      title: "The rest of what didn't work",
      items: [
        { t: "The onboarding rewrite", c: "Eight steps at ~81% completion became five steps at ~57%. Step-one abandonment went 6.6% to 33.8%. Shorter is not easier." },
        { t: "Reverting didn't fix it", c: "Completion went 68% to 58% anyway, with region blocks and network failures underneath. The rewrite wasn't the only thing broken." },
        { t: "The reward-progress card", c: "94% of the people who tapped it could not afford the reward. The button's main job was disappointing people." },
        { t: "The sub-$5 cashout test", c: "Measured nothing. A provider sync wiped the treatment group mid-test, and it ended on 2 redemptions and $4. We shipped the $5 floor on judgement." },
        { t: "The Google video flag", c: "13 of 14 videos limited for exaggerated claims. Recutting the copy changed nothing. The claim Google read was inside our own app UI, in a screenshot." },
        { t: "Play prominent disclosure", c: "The ad SDK could start before consent. Correct finding, our bug, fixed in a later build. The appeal is still open." },
      ],
    },

    /* ---- segment three: the presentation — from this business to yours ---- */
    {
      kind: "act",
      n: "07",
      eyebrow: "Segment three",
      title: "Your turn",
      art: "dome",
      c: "Same structure, your product. One channel, one test, an event per stage. Receipts are thirty percent of the October score.",
    },
    {
      kind: "terminal",
      cmd: "/channel-plan",
      out: ["reading 01-roadmap/README.md", "drafting test, budget, go/no-go…", "wrote 02-b2c/README.md"],
      title: "Your first channel",
      c: "One channel, the test, the budget, and the go/no-go number. Decide them before you spend.",
    },
    {
      kind: "statement",
      text: "Now point the same structure at your own product.",
      note: "First channel, the test, the budget, the go/no-go number. Four lines. Write them tonight.",
    },
    {
      kind: "end",
      eyebrow: "Next program",
      next: "Growth Loops",
      qr: "growth-loops",
      qrLabel: "Waitlist — shipai.club/programs/growth-loops",
      c: "Tonight is acquisition. Growth Loops is the other half: the value event, the path to first value, cohorts, and one proven behaviour turned into a loop. Six sessions, dates soon.",
    },

    /* ---- questions, then the close ---- */
    {
      kind: "statement",
      title: "Q&A",
      text: "Ask me anything with a number in it.",
      tags: ["What did it cost?", "What broke?", "What would you do first?"],
      note: "The dashboard is open and nothing is off the table. Spend, retention, the appeal, the parts I got wrong.",
    },
    {
      kind: "thanks",
      title: "Dan & Workuity",
      tag: "Platinum sponsor · The venue",
      c: "Workuity Biltmore hosts and sponsors every meetup in this series and the October weekend. Rooms like tonight don't happen without Dan and this community — thank him on your way out.",
      img: "/sponsor-workuity.png",
      imgAlt: "Workuity",
    },
    {
      kind: "thanks",
      title: "AutomationInterns.com",
      tag: "Gold sponsor",
      c: "Affordable AI for everyday business — and the newest name on the Ship AI sponsor wall. Welcome Jon S and the interns.",
      img: "/sponsor-automationinterns.png",
      imgAlt: "AutomationInterns.com",
      color: true,
    },
    {
      kind: "end",
      eyebrow: "Sponsors",
      next: "Your logo belongs on this wall",
      qr: "sponsors",
      qrLabel: "The menu — shipai.club",
      c: "If tonight was useful, this is how it stays free. Every tier is published and every arrangement is negotiable — cash, credits or hours, at every price point. Talk to Santos before you leave, or scan for the menu.",
    },
    {
      kind: "contact",
      title: "Say hi",
      art: "dome",
      rows: [
        { l: "X", v: "@5antoshernandez", c: "Build in public. Arguments welcome.", lit: true },
        { l: "Discord", v: "discord.gg/kZSJMNveYM", c: "Where tonight's links, slides, and skills land." },
        { l: "Work with me", v: "desic.xyz", c: "Want systems like these built and run for you? That's my team." },
      ],
      note: "Everything is open source: the deck, the skills, the template repo. Take it all.",
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

  "b2b-pipeline-sales": B2B_CASE_DECK,

  "positioning-and-pitch": [
    { kind: "title", ascii: ASCII_UNFAIR_ADVANTAGE, asciiWide: true, art: "sail", sub: "From customer evidence to the words that ship" },
    ABOUT_SLIDE,
    HOST_SLIDE,
    {
      kind: "statement",
      text: "You chose the audience. Tonight we find the edge and give it words.",
      note: "Evidence becomes a claim. The claim becomes the homepage, profiles, pinned post and pitch.",
    },
    {
      kind: "agenda",
      title: "Tonight",
      items: [
        "Bring forward the audience and evidence",
        "Define the terms and map the competition",
        "Build, test and compress one sharp claim",
        "Adapt the claim for the site, socials and pitch",
        "Ship the surface, then launch at the hackathon",
      ],
    },
    ZERO_TO_LAUNCH_PARTNERS,
    {
      kind: "end",
      eyebrow: "Sponsors",
      next: "Somebody funds the free part",
      qr: "sponsors",
      qrLabel: "The menu — shipai.club",
      c: "Ship AI is seeking sponsors. Published tiers run $1,000–$10,000. Cash, credits and hours all count. Custom arrangements are welcome.",
    },

    {
      kind: "timeline",
      title: "Where we are",
      note: "Six Wednesdays feed the Oct 16–18 launch weekend. Every session stands alone, and late arrivals can still compete.",
    },
    { kind: "act", n: "01", eyebrow: "Act one", title: "Find the language", art: "globe", c: "Start with what customers say, do and compare. Do not start with a blank headline." },
    {
      kind: "walk",
      title: "If you do not know how to win, get closer",
      steps: [
        {
          t: "Go where they are",
          c: "find the room",
          d: "Read the subreddits, reviews, support threads, Discords and call notes where customers already talk without your survey framing.",
        },
        {
          t: "Hear the problem",
          c: "save their exact words",
          d: "Capture the task, the frustration and the moment it becomes urgent. Their language is better raw material than your category jargon.",
        },
        {
          t: "Trace the workaround",
          c: "watch what they do next",
          d: "Look for spreadsheets, manual cleanup, support calls, migration plans and products they are considering instead.",
        },
        {
          t: "Rank the pain",
          c: "frequency × severity × intent",
          d: "Prioritize problems that repeat, cost time or money, and make someone actively search for another way.",
        },
      ],
      note: "Competitor research tells you what companies claim. Customer research tells you where they fail—and what customers will switch to fix.",
    },
    {
      kind: "gallery",
      title: "The switching moment is public",
      note: "“I’m done” + a named alternative + a migration question: pain, competitor and buying trigger in one post.",
      imgs: [
        {
          src: "/decks/positioning-and-pitch/quickbooks-switching-post.png",
          alt: "A QuickBooks Online customer says the product is slow and difficult, names Sage Cloud as an alternative and asks how to transfer data.",
        },
      ],
    },
    {
      kind: "gallery",
      title: "The workaround is the product brief",
      note: "Slow pages, noisy screens, poor reports, support failure, errors and a spreadsheet workaround. Each complaint points to an outcome.",
      imgs: [
        {
          src: "/decks/positioning-and-pitch/quickbooks-pain-comment.png",
          alt: "A customer lists QuickBooks frustrations including slow pages, hard-to-read information, poor reports, scanning errors and replacing the product with a spreadsheet.",
        },
      ],
    },
    {
      kind: "news",
      n: "01",
      of: "01",
      eyebrow: "Pain → product",
      title: "The strongest solution mirrors the complaint",
      src: "Immad · Mercury Books launch thread · X",
      href: "https://x.com/immad/status/2100256806413140181",
      facts: [
        "Categorize and reconcile transactions as they happen—not weeks after month-end.",
        "Banking, cards, bill pay and invoices feed the books automatically.",
        "Ask what changed or where the money went; get a plain-language answer.",
        "Bring your own bookkeeper or work with a partner.",
      ],
      prompt: "The product story reverses the pain customers already described: less waiting, less manual cleanup and less report hunting.",
    },
    {
      kind: "bullets",
      cols: 2,
      title: "Research the problem space",
      items: [
        { t: "Talk to five people", c: "Ask them to show you the last time the problem happened." },
        { t: "Watch the current workflow", c: "Capture the tools, handoffs, delays and manual fixes." },
        { t: "Mine public pain", c: "Read communities, competitor reviews and “how do I…” searches." },
        { t: "Trace switching intent", c: "Save alternative mentions, migration questions and spreadsheet workarounds." },
      ],
      note: "You do not need users to have evidence. Label direct quotes, public evidence and your own inference separately.",
    },
    {
      kind: "walk",
      title: "Five columns, filled from evidence",
      steps: [
        {
          t: "Who",
          c: "carry it forward",
          d: "Paste the audience from last session. B2B uses company, role and trigger. B2C uses behaviour, context and intent.",
        },
        {
          t: "Situation",
          c: "the scene before you",
          d: "Write a moment they recognise: reconciling three systems on Friday, or playing a mobile game during a commute.",
        },
        {
          t: "Alternative",
          c: "what happens today",
          d: "Copy the real workaround: spreadsheet, agency, another app or nothing. Name a competitor only when customers do.",
        },
        {
          t: "Outcome",
          c: "the change they want",
          d: "Show the before and after. “Faster” is vague. “Close the weekly report before lunch” is visible.",
        },
        {
          t: "Proof",
          c: "the receipt",
          d: "Attach a number, screenshot, customer sentence or demo. Without a receipt, mark the outcome as a hypothesis.",
        },
      ],
      note: "Keep the exact words. They become the hero and pinned post.",
    },
    {
      kind: "matrix",
      title: "Same brief, different filters",
      heads: ["B2B", "B2C"],
      rows: [
        { t: "Who", cells: ["Company + role", "Behaviour + context"] },
        { t: "Why now", cells: ["Hire, migration, backlog", "Intent, habit, life moment"] },
        { t: "Alternative", cells: ["Manual work or an agency", "Another app or workaround"] },
        { t: "Action", cells: [{ v: "Report, call, pilot", lit: true }, { v: "Download, try, buy", lit: true }] },
      ],
      note: "Do not force a consumer into an account-based template. The logic is shared; the evidence and the next action are not.",
    },
    {
      kind: "matrix",
      title: "A thirty-minute evidence pull",
      heads: ["Target", "Collect", "Example"],
      rows: [
        { t: "10 phrases", cells: ["Copy the customer’s words", { v: "“Slow,” “noisy,” “hard to see”", lit: true }] },
        { t: "5 alternatives", cells: ["Name what they use or consider", "Sage Cloud, spreadsheets, manual entry"] },
        { t: "3 proof items", cells: ["Save evidence you can show", "Quote, screenshot or timed task"] },
        { t: "1 costly objection", cells: ["Find what blocks the switch", { v: "“How easy is it to transfer data?”", lit: true }] },
      ],
      note: "Link every source and keep the exact words. Stop when the same pains repeat.",
    },

    { kind: "act", n: "02", eyebrow: "Act two", title: "Find the edge", art: "bolt", c: "Define the layers, map the competition, then build one outcome competitors cannot claim with the same proof." },
    {
      kind: "matrix",
      title: "Three layers, three jobs",
      heads: ["Layer", "Job", "Contains"],
      rows: [
        { t: "Positioning", cells: ["Choose the frame", "Audience, alternative, category, edge"] },
        { t: "Value proposition", cells: [{ v: "Promise useful value", lit: true }, "Outcome + reason to believe"] },
        { t: "Tagline", cells: ["Make it memorable", "The shortest public expression"] },
      ],
      note: "A tagline can carry the value proposition. It cannot replace the positioning. Now inspect what the market already says.",
    },
    {
      kind: "walk",
      title: "Competitive intelligence finds the edge",
      steps: [
        {
          t: "Name the field",
          c: "give the agent a starting list",
          d: "List three to five competitors with URLs. Add the category, audience and real alternatives customers use today.",
        },
        {
          t: "Reverse-engineer the pitch",
          c: "collect their public claims",
          d: "Capture each tagline, value proposition, positioning, CTA, pricing and proof. Quote the source and date it.",
        },
        {
          t: "Define the contrast",
          c: "say why you are better",
          d: "Document where they win, what users say sucks and where you are superior. Attach proof to every advantage.",
        },
      ],
      note: "Start with a list, not a blank research request. The agent investigates; you decide which differences matter.",
    },
    {
      kind: "bullets",
      cols: 2,
      title: "Skills to stack",
      items: [
        { t: "marketing:competitive-analysis", c: "Map messaging, category, pricing, content and public proof." },
        { t: "sales:competitive-intelligence", c: "Build battlecards, objections, talk tracks and landmine questions." },
        { t: "agent-browser", c: "Inspect homepages, pricing, changelogs, demos and reviews." },
        { t: "/positioning-brief", c: "Turn the comparison into your sharp edge, claim and receipt." },
      ],
      note: "Public research works alone. CRM, documents and call transcripts add the evidence competitors cannot publish.",
    },
    {
      kind: "bullets",
      title: "Copy this prompt",
      items: [
        { t: "Context", c: "We sell [product] to [audience] when [trigger]. Our site is [URL]." },
        { t: "Competitors", c: "Research [A + URL], [B + URL] and [C + URL]. Add an alternative only when evidence supports it." },
        { t: "Collect", c: "Find each tagline, value proposition, positioning, CTA, pricing, proof and recurring customer complaint." },
        { t: "Compare", c: "Show where they win, where we win and which claims still need proof. Cite and date every source." },
      ],
      note: "End with the artifact you need: a messaging matrix, one-page battlecards and three positioning recommendations.",
    },
    {
      kind: "flow",
      title: "Grok Bot for competitive research",
      steps: [
        { t: "Create the Bot", c: "Job: track competitors and deliver a sourced change brief." },
        { t: "Connect sources", c: "Sign in to the websites, files and tools it needs." },
        { t: "Run one real brief", c: "Give it the competitor list, sources, output and approval limits." },
        { t: "Correct, then save", c: "Turn the working process into a reusable Skill.", lit: true },
        { t: "Add a Routine", c: "Run it weekly after the second good result." },
      ],
      note: "The Bot owns the job. The Skill stores the method. The Routine starts it. Keep publishing behind approval. Source: xAI Grok Bot Docs, Sep 2026.",
    },
    {
      kind: "matrix",
      title: "Feature → outcome → proof",
      heads: ["What it does", "What they get", "What proves it"],
      rows: [
        { t: "B2B", cells: ["Opportunity report", { v: "Know what to automate first", lit: true }, "Prioritised report before a paid build"] },
        { t: "B2B", cells: ["Team builds and runs it", { v: "Ship without staffing an AI team", lit: true }, "A production workflow doing the job"] },
        { t: "B2C", cells: ["Rewards app", { v: "Turn playtime into cash", lit: true }, "$5 minimum cashout"] },
        { t: "B2C", cells: ["Daily quests", { v: "Earn more from the same games", lit: true }, "Up to 1,500 bonus ggbucks a day"] },
      ],
      note: "Competitor research found the open space. Read right to left to make sure your product and proof can occupy it.",
    },
    {
      kind: "statement",
      text: ["Agents expand.", "Operators compress."],
      tags: ["Generate wide", "Approve narrow"],
      note: "An agent gives you options, not judgment. Keep the breadth. Own the cuts.",
    },
    {
      kind: "funnel",
      title: "The operator’s job is subtraction",
      stages: [
        { t: "40 plausible drafts", c: "the agent explores", w: 1 },
        { t: "12 distinct angles", c: "duplicates removed", w: 0.74 },
        { t: "3 evidence-backed claims", c: "swap + receipt tests", w: 0.46 },
        { t: "1 line a stranger repeats", c: "human approved", w: 0.2, lit: true },
      ],
      note: "Agents produce volume cheaply. Your value is reducing it to one true, useful and memorable line.",
    },
    { kind: "quote", text: "Design is still a human problem." },
    {
      kind: "matrix",
      title: "A candidate is not a USP yet",
      heads: ["Classification", "What to do"],
      rows: [
        { t: "AI-powered", cells: ["Table stakes", "Cut it from the hero"] },
        { t: "Dedicated team", cells: ["Category claim", "Show ownership and a shipped system"] },
        { t: "$5 cashout", cells: [{ v: "Differentiator candidate", lit: true }, "Benchmark the alternatives"] },
        { t: "Paid in minutes", cells: [{ v: "Outcome candidate", lit: true }, "Prove it with payout data and reviews"] },
      ],
      note: "A USP must pass both competitor and receipt checks. Until then, call it a candidate.",
    },
    {
      kind: "walk",
      title: "Four tests before a claim ships",
      steps: [
        {
          t: "Swap",
          c: "can a competitor say it?",
          d: "Put the nearest competitor’s name over yours. If it still works, it describes the category—not your edge.",
        },
        {
          t: "Receipt",
          c: "can you show it?",
          d: "Point to the number, screenshot, customer sentence or demo. No receipt means no present-tense claim.",
        },
        {
          t: "Relevance",
          c: "does this audience care?",
          d: "Read it beside the situation from act one. The sharpest claim in the wrong room is still dull.",
        },
        {
          t: "Repeat-back",
          c: "can a stranger retell it?",
          d: "Show the line for five seconds, hide it, then ask what the product does. Their version is the result.",
        },
      ],
      note: "The claim survived the market test. Now make it easy for a stranger to understand and repeat.",
    },
    {
      kind: "statement",
      text: "Write in eighth-grade English.",
      tags: ["Short words", "Short sentences", "One idea at a time"],
      note: "Respect the reader; reduce the load. Plain English travels farther across sites, socials and spoken pitches.",
    },
    {
      kind: "news",
      n: "01",
      of: "01",
      eyebrow: "Writing tip",
      title: "Borrow from aircraft manuals",
      src: "ASD-STE100 · Simplified Technical English",
      href: "https://www.asd-ste100.org/",
      facts: [
        "Keep instructions near 20 words and descriptions near 25.",
        "Give one word one meaning; prefer “start” over “commence.”",
        "Use active voice and one instruction per sentence.",
      ],
      prompt: "Grade level is a readability target. STE is stricter. Borrow the discipline, then test the language on real B2B and B2C examples.",
    },
    {
      kind: "split",
      title: "B2B teardown: specificity lives in the CTA",
      left: {
        h: "Current hero",
        items: ["Transform Your Business With AI.", "Every consultancy can say it", "The buyer and the job are invisible", "The report carries the useful detail"],
      },
      right: {
        h: "Working direction",
        items: ["Find where AI will pay off before you fund a build", "For teams still running critical work by hand", "Free opportunity report as the first action", "Still needs a verified buyer and proof point"],
      },
      note: "Working direction only. Move the concrete value hiding in the CTA into the first claim a stranger sees.",
    },
    {
      kind: "split",
      pair: true,
      title: "B2C teardown: keep the line, stack the proof",
      left: {
        h: "The line works",
        items: ["Play games. Get paid.", "Immediate activity and payoff", "Readable in one second", "Do not rewrite clarity for novelty"],
      },
      right: {
        h: "Reasons to believe",
        items: ["Cash out from $5", "PayPal, Venmo or gift cards", "500+ games", "Real payout reviews near the action"],
      },
      note: "The hero need not carry the whole brief. Keep the strong line; place concrete proof directly below it.",
    },

    { kind: "act", n: "03", eyebrow: "Act three", title: "Make the surface pack", art: "net", c: "One source of truth travels across the site and socials. The words change; the promise does not." },
    {
      kind: "split",
      pair: true,
      title: "Two useful one-liner shapes",
      left: {
        h: "B2B",
        items: ["For [role] at [company]", "who [situation + trigger]", "we help [outcome]", "unlike [alternative], [edge + proof]"],
      },
      right: {
        h: "B2C",
        items: ["For people who [behaviour]", "and want [payoff]", "[product] lets them [action]", "with [edge or proof]"],
      },
      note: "These are drafting rails. The final hero should sound like the customer, not a worksheet.",
    },
    {
      kind: "split",
      pair: true,
      title: "The shapes, filled in",
      left: {
        h: "B2B · desic",
        items: ["For operations leaders whose teams still move critical work through inboxes and spreadsheets, desic finds the AI workflow with the fastest payoff before they fund a build."],
      },
      right: {
        h: "B2C · Scrambly",
        items: ["For people who already play mobile games, Scrambly turns that time into cash with more than 500 games and withdrawals from $5."],
      },
      note: "Each line carries the audience, situation, outcome and proof. The homepage can compress it further.",
    },
    {
      kind: "flow",
      title: "One brief, four surfaces",
      steps: [
        { t: "Positioning brief", c: "Audience, situation, outcome, edge, proof." },
        { t: "Homepage hero", c: "What it is, who it is for, one action.", lit: true },
        { t: "Profile", c: "The same promise, compressed for discovery." },
        { t: "Pinned post", c: "The proof story and the next step." },
      ],
      note: "Tonight approves the source copy. Oct 7 turns it into a site and profiles ready for launch.",
    },
    {
      kind: "bullets",
      cols: 2,
      title: "B2B surface pack · working example",
      items: [
        { t: "Hero", c: "Find where AI will pay off before you fund a build." },
        { t: "Subhead", c: "A free report maps the manual work, the likely payoff and what to automate first." },
        { t: "LinkedIn bio", c: "AI strategy and engineering built around the work, then run in production." },
        { t: "Pinned post", c: "Paste your website. Get the opportunity report. Use one finding even if you never hire us." },
      ],
      note: "Teaching drafts only. Each surface advances the same idea while doing a different job.",
    },
    {
      kind: "bullets",
      cols: 2,
      title: "B2C surface pack · live example",
      items: [
        { t: "Hero", c: "Play games. Get paid." },
        { t: "Subhead", c: "Earn from games and quick surveys. Cash out to PayPal, Venmo or gift cards from $5." },
        { t: "Social bio", c: "Play games, take quick surveys, cash out from $5." },
        { t: "Pinned post", c: "Show the first payout, the time it took and the download link. Proof first, promotion second." },
      ],
      note: "The wording gets shorter as the surface gets smaller. The promise, proof and action stay aligned.",
    },
    {
      kind: "matrix",
      title: "Same idea, different job",
      heads: ["Job", "Constraint", "Pass test"],
      rows: [
        { t: "Hero", cells: ["Orient and move", "One claim + one action", { v: "Understood in 4 seconds", lit: true }] },
        { t: "Bio", cells: ["Be found and qualified", "One or two lines", "Matches the hero"] },
        { t: "Banner", cells: ["Leave one memory", "Six to eight words", "Readable on a phone"] },
        { t: "Pinned post", cells: ["Demonstrate the claim", "One proof story + CTA", "Next step is obvious"] },
      ],
      note: "Consistency is not repetition. It means a stranger never has to reconcile four promises.",
    },
    {
      kind: "split",
      pair: true,
      title: "The action must fit the business",
      left: {
        h: "B2B ladder",
        items: ["Analyze the website", "Receive the report", "Choose one opportunity", "Scope a pilot"],
      },
      right: {
        h: "B2C ladder",
        items: ["Download the app", "Complete the first activity", "Reach the first $5", "Cash out"],
      },
      note: "Ask for the next credible step. Do not make a cold visitor leap to the final outcome.",
    },
    {
      kind: "statement",
      title: "Elevator pitch",
      text: ["Say who you are.", "Say what your business does."],
      tags: ["At events: earn the next question", "Written or video: about 4 seconds"],
      note: "If people need a longer explanation to understand, you have lost them. Give them enough to ask the next question, not your whole company history.",
    },

    { kind: "act", n: "04", eyebrow: "Act four", title: "Say it, test it, hand it off", art: "mark", c: "If the promise survives sixty spoken seconds, it is ready for the build—and the launch." },
    {
      kind: "walk",
      title: "Sixty seconds, five beats",
      steps: [
        {
          t: "Situation",
          c: "a scene they recognise",
          d: "Open on the customer’s Tuesday, not a market-size statistic. Give the listener a scene they can picture.",
        },
        {
          t: "Who",
          c: "say who it is for",
          d: "Name the audience. B2B uses role and company. B2C uses behaviour and moment of intent.",
        },
        {
          t: "Outcome",
          c: "deliver the one-liner",
          d: "Say the change before the machinery. If you stumble over the sentence, rewrite it.",
        },
        {
          t: "Edge + proof",
          c: "one claim, one receipt",
          d: "Use the strongest claim and its receipt. One number or customer sentence is enough.",
        },
        {
          t: "Ask",
          c: "the next credible action",
          d: "Ask for the report, scoping call, download or first activity. “Let me know” is not an ask.",
        },
      ],
      note: "Aim for 120–150 spoken words. Record it once, transcribe the stumble, cut the setup and keep the proof.",
    },
    {
      kind: "walk",
      title: "B2B pitch · five beats in motion",
      steps: [
        { t: "Situation", c: "manual work, unclear priority", d: "Most service businesses know AI could remove manual work, but they cannot tell which workflow is worth funding first." },
        { t: "Who", c: "operations leaders", d: "We help operations leaders whose teams still move critical work between inboxes, spreadsheets and disconnected tools." },
        { t: "Outcome", c: "find the fastest payoff", d: "Our free opportunity report shows where automation can save time, reduce errors and produce the fastest payoff." },
        { t: "Edge + proof", c: "rank live processes", d: "Unlike a generic strategy deck, it starts with your live processes and ranks each opportunity by effort and return." },
        { t: "Ask", c: "paste in the website", d: "Paste in your website. We will send the report, then help you scope one workflow if the numbers hold." },
      ],
      note: "Read the five sentences as one paragraph. The labels are training wheels.",
    },
    {
      kind: "terminal",
      cmd: "/positioning-brief",
      out: ["reading customer evidence…", "3 claims tested, 1 sharp edge", "wrote 04-positioning/brief.md"],
      title: "Build the source of truth",
      c: "Carries forward the audience, alternative, outcomes and proof. Inferences stay marked until somebody verifies them.",
    },
    {
      kind: "terminal",
      cmd: "/pitch-doctor",
      out: ["5 beats, 2 audiences", "customer cut: 136 words", "wrote 04-positioning/pitch.md"],
      title: "Then say it out loud",
      c: "Builds the spoken version from the brief, changes the ask by audience, reports the word count and cuts the part you stumble on.",
    },
    {
      kind: "bullets",
      cols: 2,
      title: "Leave with these, or stay in the room",
      items: [
        { t: "One evidence sheet", c: "Ten phrases, five alternatives, three receipts, one objection." },
        { t: "One claim stack", c: "Feature, outcome, edge, proof — with weak claims visibly cut." },
        { t: "One surface pack", c: "Hero, subhead, bio, banner line, pinned-post outline and CTA." },
        { t: "One pitch", c: "Under 150 words, recorded once, with a real ask." },
      ],
      note: "These feed Ship the Surface on Oct 7, then the public launch at the Oct 16–18 hackathon.",
    },
    {
      kind: "flow",
      title: "Before Oct 7",
      steps: [
        { t: "Three strangers", c: "Run the five-second repeat-back test." },
        { t: "One customer", c: "Verify the situation and wording." },
        { t: "One proof gap", c: "Capture the missing screenshot, number or quote.", lit: true },
        { t: "Freeze this version", c: "Bring approved copy to the build." },
      ],
      note: "The next session begins at page structure. Freeze the current words long enough to build and test them.",
    },
    {
      kind: "statement",
      text: ["Positioning is a working theory.", "Refine it as you talk to more customers."],
      tags: ["New language", "New objections", "Stronger proof"],
      note: "Ship the clearest version you can defend today. Change it when repeated customer evidence gives you a better answer.",
    },
    {
      kind: "end",
      eyebrow: "Hackathon · Oct 16–18",
      next: "This is where the words become a launch.",
      qr: "hackathon",
      qrLabel: "Register + rules",
      c: "Workuity Biltmore · Free · Teams of 1–4 · Submit by noon Sunday. Judging: shipped 40%, receipts 30%, growth engine 20%, craft 10%.",
    },
    ZERO_TO_LAUNCH_PARTNERS,
    {
      kind: "end",
      eyebrow: "Sponsors",
      next: "There's room on the sponsor wall",
      qr: "sponsors",
      qrLabel: "The menu — shipai.club",
      c: "Ship AI is seeking sponsors. Published tiers run $1,000–$10,000. Cash, credits and hours all count. Custom arrangements are welcome.",
    },
    {
      kind: "contact",
      title: "Say hi",
      art: "dome",
      rows: [
        { l: "X", v: "@5antoshernandez", c: "Build in public — arguments welcome.", lit: true },
        { l: "Discord", v: "discord.gg/kZSJMNveYM", c: "Where tonight's links, slides, and skills land." },
        { l: "Work with me", v: "desic.xyz", c: "Want systems like these built and run for you? That's my team." },
      ],
      note: "Everything is open source — the deck, the skills, the template repo. Take it all.",
    },
    { kind: "quote", text: "Feel the fear and do it anyways." },
    {
      kind: "end",
      next: "Ship the Surface — Wed Oct 7, Workuity Biltmore",
      qr: "session-marketing-site",
      qrLabel: "Session page",
      c: "Build the site, profiles and pages a stranger actually finds. Bring tonight's approved words; leave ready for the hackathon.",
    },
  ],

  "marketing-site": [
    { kind: "title", ascii: ASCII_SITE, sub: "Your site and every page that points at it" },
    ABOUT_SLIDE,
    HOST_SLIDE,
    {
      kind: "statement",
      text: "The site is the one asset every channel points at.",
      note: "Get it wrong and every visitor you earn leaks straight back out of it.",
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
      kind: "end",
      eyebrow: "Sponsors",
      next: "Sponsors are why none of this has a ticket price",
      qr: "sponsors",
      qrLabel: "The menu — shipai.club",
      c: "Ship AI is seeking corporate sponsors. Published tiers, $1,000 through $10,000, paid in cash, credits or hours — all three count the same. There's an opportunity at every price point, and a custom arrangement is always on the table.",
    },

    {
      kind: "timeline",
      title: "Where we are",
      note: "Six Wednesdays, then the weekend. Every session is free and standalone — you don't have to attend all of them to compete in October, and catching up late is explicitly allowed.",
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

    { kind: "act", n: "01", eyebrow: "Act one", title: "The page", art: "globe", c: "Every section has a job. Anything without a job gets cut, however nice it looks." },
    {
      kind: "walk",
      title: "Section order, top to bottom",
      steps: [
        {
          t: "Hero",
          c: "what · who · one CTA",
          d: "What it is, who it's for, one call to action. This is September's one-liner, unchanged if it was any good. A stranger decides here, in about four seconds, whether to keep reading.",
        },
        {
          t: "Proof",
          c: "immediately, not later",
          d: "Logos, numbers, one real sentence from a real user — right under the hero, before you've earned any patience. Proof placed halfway down the page is proof nobody sees.",
        },
        {
          t: "How it works",
          c: "three steps, not five",
          d: "Three steps. If it genuinely needs five, the product is explaining itself badly and the fix is upstream of the page. Show the thing doing the thing; a screenshot outperforms a paragraph.",
        },
        {
          t: "The objection",
          c: "name it before they do",
          d: "Price, lock-in, security, \"we already use X\" — say the worried thing out loud and answer it. Otherwise they leave to go worry about it somewhere you can't reply.",
        },
        {
          t: "CTA",
          c: "the same one, again",
          d: "The same call to action from the hero, repeated. Not a second one. Five competing CTAs is the same as none, and it's the most common self-inflicted wound on a builder site.",
        },
      ],
      note: "Five sections, five jobs. Anything on the page that can't name its job is decoration, and decoration is what you cut first.",
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
      out: ["reading 04-positioning/brief.md", "6 sections, 1 CTA", "wrote 05-site/structure.md"],
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

    { kind: "act", n: "02", eyebrow: "Act two", title: "The brand as a build artifact", art: "dome", c: "Session one promised this one. A brand isn't a logo you commission — it's a system in your repo that every surface imports." },
    {
      kind: "walk",
      title: "The brand system, in code",
      steps: [
        {
          t: "Tokens",
          c: "colour · type · spacing, one file",
          d: "Palette, type scale, spacing scale, the wordmark — one file the whole surface reads from. Not a Figma page someone copies hex codes out of by hand, but a module an agent can import. Decide it in an hour on day one and never decide it again.",
        },
        {
          t: "Components",
          c: "the same ten pieces everywhere",
          d: "Buttons, cards, tables, section headers, the footer. Build them once and consistency stops being discipline and becomes a dependency — you get it for free even at 1am on a Saturday of the hackathon.",
        },
        {
          t: "Generated collateral",
          c: "from data, not from Keynote",
          d: "Decks, one-pagers, case studies, OG images — rendered from structured content by the same components as the site. These slides are an array in a repo, drawn by the design system you're looking at. No export step, and a typo is a one-line commit.",
        },
        {
          t: "The copy layer",
          c: "ICP · value props · USPs",
          d: "The brand isn't only visual. The segment, the value props and the USPs from Sep 16 get baked into the strings every surface renders — hero, bio, pinned post, email footer. One brief, many outputs, no drift.",
        },
        {
          t: "Every surface",
          c: "site · deck · README · invoice",
          d: "The pitch deck, the sales one-pager, the GitHub README, the banner, the receipt. A stranger meets you in a random order and shouldn't be able to tell which one you built first.",
        },
      ],
      note: "A design system on day one is the cheapest decision in the program. It costs an hour, and every artifact after it is close to free.",
    },
    {
      kind: "statement",
      text: "Polish is a build step now, not a hire.",
      note: "Session one claimed polish takes you from looking like a 4 to a 9 — same product, same features, same founder. This is the build step that does it, and it's why the deck, the site and the one-pager can't disagree with each other.",
    },

    { kind: "act", n: "03", eyebrow: "Act three", title: "Everywhere else", art: "net", c: "Your site is one of maybe eight places someone lands when they go looking for you." },
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
      kind: "flow",
      title: "The content plan",
      steps: [
        { t: "The query", c: "What the ICP actually types, not what you'd enjoy writing about." },
        { t: "The page", c: "One page per query, answering it properly. Twenty of them, not two hundred." },
        { t: "Template or write", c: "Templated where the data is real, hand-written where judgement is needed.", lit: true },
        { t: "Generate", c: "/content-map, then /programmatic-pages and /article-draft. A skill file, not a lecture." },
      ],
      note: "Every page here is another door into the same brand system — same components, same claims, no second writing session.",
    },
    {
      kind: "statement",
      text: "Once the positioning is settled, the whole pass is mechanical.",
      note: "Which means it belongs in an agent, not in an afternoon of tab-switching. The brief came from Sep 16; tonight it just gets rendered onto every surface that has one.",
    },
    {
      kind: "thanks",
      title: "Dan & Workuity",
      tag: "Platinum sponsor · The venue",
      c: "Workuity Biltmore hosts and sponsors every meetup in this series and the October weekend that closes this program. Thank Dan on your way out — nine days from now we're back in this room for real.",
      img: "/sponsor-workuity.png",
      imgAlt: "Workuity",
    },
    {
      kind: "end",
      eyebrow: "Sponsors",
      next: "Back the room, not a billboard",
      qr: "sponsors",
      qrLabel: "The menu — shipai.club",
      c: "Ship AI is seeking corporate sponsors for the weekend and the next program. Tiers run $1,000 to $10,000 and they're published on purpose — cash, credits or hours, whichever you actually have. Opportunity at every price point, custom arrangements always welcome.",
    },
    {
      kind: "contact",
      title: "Say hi",
      art: "dome",
      rows: [
        { l: "X", v: "@5antoshernandez", c: "Build in public — arguments welcome.", lit: true },
        { l: "Discord", v: "discord.gg/kZSJMNveYM", c: "Where tonight's links, slides, and skills land." },
        { l: "Work with me", v: "desic.xyz", c: "Want systems like these built and run for you? That's my team." },
      ],
      note: "Everything is open source — the deck, the skills, the template repo. Take it all.",
    },
    { kind: "quote", text: "Just ship it." },
    {
      kind: "end",
      next: "Agentic Growth — Wed Oct 14, Workuity Biltmore",
      qr: "session-growth-engineering",
      qrLabel: "Session page",
      c: "Two days before the hackathon. Automated distribution, performance marketing basics, and the CAC ceiling that decides whether paid works at all.",
    },
  ],

  "growth-engineering": [
    { kind: "title", ascii: ASCII_GROW, sub: "Automated content, paid marketing, and the CAC ceiling" },
    ABOUT_SLIDE,
    HOST_SLIDE,
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
      kind: "end",
      eyebrow: "Sponsors",
      next: "Ship AI runs on sponsors",
      qr: "sponsors",
      qrLabel: "The menu — shipai.club",
      c: "Six free sessions and a free weekend, funded by companies rather than tickets. Tiers are published — $1,000 to $10,000 — and cash, credits or hours all count. There's an opportunity at every price point, and a custom arrangement is always on the table.",
    },

    {
      kind: "timeline",
      title: "Where we are",
      note: "Six Wednesdays, then the weekend. Every session is free and standalone — you don't have to attend all of them to compete in October, and catching up late is explicitly allowed.",
    },

    { kind: "act", n: "01", eyebrow: "Act one", title: "Distribution that runs without you", art: "net", c: "Built on screen. The half most builders never automate." },
    {
      kind: "walk",
      title: "The content pipeline",
      steps: [
        {
          t: "Map in",
          c: "topics from a table",
          d: "The content map from Oct 7 is the input — the queries your ICP actually types, ranked by how close they sit to a purchase. Topics come out of a table, not out of whatever occurred to you in the shower.",
        },
        {
          t: "Draft",
          c: "an agent, holding your voice",
          d: "The agent drafts against a voice file: your vocabulary, your register, the things you never say. That file is a brand asset — it sits next to the design tokens from Oct 7 and it's written out of the positioning brief from Sep 16.",
        },
        {
          t: "Review",
          c: "genuinely, or not at all",
          d: "Decide where a human actually stays in the loop. A checkpoint you always rubber-stamp is theatre — remove it or mean it. The honest answer is usually: read the first ten closely, then spot-check.",
        },
        {
          t: "Repurpose",
          c: "one piece, every channel",
          d: "One piece of work reshaped per channel automatically — the thread, the post, the newsletter section, the short. Different register each time, same claim underneath, no second writing session.",
        },
        {
          t: "Queue",
          c: "a cadence you'll survive",
          d: "Scheduled ahead at a rate that survives a bad month. Then it comes back around: last week's numbers choose next week's topics, which is what makes this a loop and not a batch you burned a Sunday on.",
        },
      ],
      note: "Built on screen tonight. This is the half most builders never automate, and it's the half that stops the first busy week if they don't.",
    },
    {
      kind: "statement",
      text: "The ambitious cadence is the one you abandon in week three. Halve it.",
      note: "One piece of work, repurposed across channels automatically, at a rate that survives a bad month.",
    },

    { kind: "act", n: "02", eyebrow: "Act two", title: "Paid, and its ceiling", art: "globe", c: "Everything about performance marketing is downstream of one number." },
    {
      kind: "walk",
      title: "Performance marketing, in four moves",
      steps: [
        {
          t: "Structure",
          c: "simple enough to read",
          d: "One campaign, a couple of ad sets, clear names. Complexity buys nothing at this budget and costs you the ability to say what worked. If you can't read the account in thirty seconds, you can't act on it daily.",
        },
        {
          t: "Angles",
          c: "five reasons, not five wordings",
          d: "Five ways to say one thing is one test. Five different reasons to care is five tests. The angles are your value props from Sep 16, one per ad — if you never wrote them down, this is where that bill arrives.",
        },
        {
          t: "Narrow first",
          c: "confidence before reach",
          d: "Start where you're already confident the buyer is. Going broad first spends your budget teaching the platform something you could have told it. Widen only after something converts.",
        },
        {
          t: "The daily loop",
          c: "raise · hold · cut",
          d: "One look a day, three options, judged against a threshold you set before spending. The discipline isn't watching more closely — it's deciding in advance what would make you stop.",
        },
      ],
      note: "Every ad points at a page. If the page doesn't say what the ad said, you're paying for a click and then losing it in the hero — that's the Oct 7 session doing its job.",
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

    { kind: "act", n: "03", eyebrow: "Act three", title: "The weekend", art: "mark", c: "Venue, timings, what to bring. Then it's on." },
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
      text: "You've had ten weeks and a roadmap. The only thing left is to ship it.",
    },
    {
      kind: "thanks",
      title: "Workuity Biltmore",
      tag: "Platinum sponsor · Meetup venue",
      c: "Workuity hosts and sponsors every meetup in this series, tonight included. Last session before the weekend — thank them on your way out.",
      img: "/sponsor-workuity.png",
      imgAlt: "Workuity Biltmore",
    },
    {
      kind: "end",
      eyebrow: "Sponsors",
      next: "Sponsor the weekend, before Friday",
      qr: "sponsors",
      qrLabel: "The menu — shipai.club",
      c: "Ship AI is seeking corporate sponsors for the hackathon and whatever comes after it. Published tiers, $1,000 to $10,000, settled in cash, credits or hours. There's an opportunity at every price point and a custom arrangement is always on the table — talk to Santos tonight.",
    },
    {
      kind: "contact",
      title: "Say hi",
      art: "dome",
      rows: [
        { l: "X", v: "@5antoshernandez", c: "Build in public — arguments welcome.", lit: true },
        { l: "Discord", v: "discord.gg/kZSJMNveYM", c: "Where tonight's links, slides, and skills land." },
        { l: "Work with me", v: "desic.xyz", c: "Want systems like these built and run for you? That's my team." },
      ],
      note: "Everything is open source — the deck, the skills, the template repo. Take it all.",
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

/* Program seam: each program owns its deck collection while the existing
   Zero to Launch deck data above stays byte-for-byte unchanged. */
export const DECKS_BY_PROGRAM = {
  "zero-to-launch": DECKS,
  "day-zero": DAY_ZERO_DECKS,
  "the-first-build": PRODUCT_BUILDER_DECKS,
  "growth-loops": GROWTH_LOOPS_DECKS,
};

export function deckFor(program, slug) {
  return DECKS_BY_PROGRAM[program]?.[slug];
}

export function deckLength(program, slug) {
  return deckFor(program, slug)?.length ?? 0;
}
