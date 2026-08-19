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

const ASCII_B2B = `██████╗ ██████╗ ██████╗
██╔══██╗╚════██╗██╔══██╗
██████╔╝ █████╔╝██████╔╝
██╔══██╗██╔═══╝ ██╔══██╗
██████╔╝███████╗██████╔╝
╚═════╝ ╚══════╝╚═════╝`;

const ASCII_USP = `██╗   ██╗███████╗██████╗
██║   ██║██╔════╝██╔══██╗
██║   ██║███████╗██████╔╝
██║   ██║╚════██║██╔═══╝
╚██████╔╝███████║██║
 ╚═════╝ ╚══════╝╚═╝`;

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

/* The org, in two slides — the same pair opens every session deck, so
   a first-timer in week five gets the same footing as week one. */
const ABOUT_SLIDE = {
  kind: "statement",
  title: "What Ship AI is",
  text: "Builders showing each other the work.",
  tags: ["Builders & founders", "Phoenix & Tempe", "Free, always"],
  note: "A free, community-run AI education project. The premise is simple: the best AI education isn't behind a paywall or on a stage — it's in the open, in a room, for free.",
};

const HOST_SLIDE = {
  kind: "thanks",
  eyebrow: "Your host",
  title: "Santos Hernandez",
  tag: "Founder & Host",
  c: "Founder and Lead Product Engineer building agentic AI systems. Founding product hire at ZBD — the money layer for games — $0 to $12M ARR, the EU's first MiCAR approval, and money transmitter licenses in 26 states and D.C. He started Ship AI to give Phoenix and Tempe builders a room where you show the work, not talk about it.",
  img: "/santos.jpg",
  imgAlt: "Santos Hernandez",
  color: true,
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
        { t: "Free and open", c: "No tickets, no tiers, no gatekeeping. You pay by teaching what you know back to the room." },
        { t: "Demos over memos", c: "Show the build. Founders too — demo the product, skip the hard sell. If it ships, it speaks." },
        { t: "Craft over hype", c: "The toolchain, the tradeoffs, the parts that hurt." },
        { t: "Honest starting points", c: "Say where you actually are. Nothing solid gets built on an inflated baseline." },
        { t: "Proof of work", c: "A small real result beats a big vague claim. Receipts over adjectives." },
        { t: "Community-driven", c: "Every session ends in five-minute demos, and what you're stuck on shapes the next one." },
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
      kind: "news",
      n: "01",
      of: "04",
      title: "Anthropic in talks to buy Decart for ~$6B",
      src: "reported · week of Aug 10",
      href: "https://techstartups.com/2026/08/13/top-tech-news-today-august-13-2026-anthropic-deepmind-google-lenovo-microsoft-spacexai-more/",
      facts: [
        "Israeli startup, real-time generative video and world models, plus GPU optimisation work.",
        "Would be one of Anthropic's largest acquisitions to date.",
        "The read: compute costs are pushing the labs to buy efficiency rather than rent it.",
      ],
      prompt: "When a lab buys a GPU-optimisation team instead of more GPUs, what does that tell you about the next two years of pricing?",
    },
    {
      kind: "news",
      n: "02",
      of: "04",
      title: "Two labs took 43% of all venture dollars",
      src: "Q2 2026 funding data",
      href: "https://news.crunchbase.com/sections/ai/",
      facts: [
        "AI captured more than 70% of global venture funding in Q2.",
        "OpenAI and Anthropic together: $217B, about 43% of every venture dollar reported in the quarter.",
        "Infrastructure keeps clearing too — Fireworks AI $1.5B Series D, Together AI $800M Series C.",
      ],
      prompt: "Nothing in that number is available to you. So what is the advantage of being small right now?",
    },
    {
      kind: "news",
      n: "03",
      of: "04",
      title: "Ten models, six providers, seventeen days",
      src: "release trackers · August 2026",
      href: "https://llmgateway.io/timeline",
      facts: [
        "Gemini 3.7 Flash landed Aug 13. Qwen3.8-27B and GLM-5.3 both on Aug 14.",
        "Google closed out the previous image-generation endpoints on Aug 17 and pointed callers at the Gemini image model.",
        "If you pinned a model six weeks ago, something cheaper and better shipped while you were building.",
      ],
      prompt: "Who here has actually re-benchmarked their default model this month?",
    },
    {
      kind: "news",
      n: "04",
      of: "04",
      title: "Phoenix: MiiHealth raises $2.8M seed",
      src: "local · August 2026",
      href: "https://thebusinessperspective.com/ai-startups-that-raised-funding-in-august-2026/",
      facts: [
        "AI patient-intake assistant, built here, funded this month.",
        "Not a frontier lab. A specific workflow, in a regulated industry, sold to people who have that problem.",
        "That's the shape of company this room can actually build in a weekend and keep building.",
      ],
      prompt: "Closest thing to this in your own backlog — what boring workflow do you already understand better than anyone?",
    },
    {
      kind: "statement",
      text: "Case studies are usually told by someone with an outcome to sell.",
      note: "This one is told with the analytics open, including the money that got wasted finding out what didn't work.",
    },
    {
      kind: "bignum",
      label: "First 30 days",
      v: "$3,318",
      delta: "$0 ad spend",
      c: "Feb 7 to Mar 8, 2026 — the first thirty days after it shipped, straight off the dashboard. Not a dollar of it was bought: the first paid dollar wasn't spent until July 14.",
    },
    {
      kind: "chart",
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
      note: "Cumulative from the day it shipped. Not a hockey stick — $159 by day seven, $3,318 by day thirty, and every step up is a channel that got confirmed rather than guessed at. Day seven is the number to look at if you're about to panic in your own first week.",
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
      note: "Monthly revenue, complete days only. The solid line and the top figure are money in the account. The dashed leg and the lower figure are a forecast — the trailing 7-day average of $1,064/day held to the 31st, and it might not hold. Both partners backfill for days afterwards, so every number here moves slightly after I say it. Then look at what August's scale does to the rest: February, the spike that felt like the business taking off, is a bump; the four months that felt like dying are a flat line near zero. May was $303.",
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
      note: "Paul Graham named this shape twenty years ago; Cal.com posted theirs at $10m ARR this week (h/t @peer_rich) and it's the same one. Ours is on it too — that's the point. The trough isn't evidence the thing is broken. It's where most people quit.",
    },
    {
      kind: "metric",
      title: "Where it is now",
      items: [
        { v: "$1,064", l: "revenue per day, 7-day average", lit: true },
        { v: "$61", l: "ad spend per day" },
        { v: "68%", l: "of this month's installs organic" },
      ],
      note: "Aug 11–17: $7,449 of revenue on $426 of spend — blended, not paid-cohort, and 68% of this month's installs were unpaid. The first paid dollar wasn't spent until July 14; the product had already done $4,949 before it. The ratio is the point: paid is a small input into a machine that mostly runs without it.",
    },
    {
      kind: "agenda",
      title: "Tonight",
      items: [
        "$0 → $3,318 in 30 days, zero paid",
        "App Store and Google Play prep, then ASO",
        "Social pages: where your audience already is",
        "The marketing site",
        "Articles, SEO, programmatic SEO",
        "Automated content, distributed on a schedule",
        "Friends and family: the ask everyone skips",
        "The switch to paid, and what had to be true first",
        "What didn't work, and instrumenting before you need it",
      ],
    },
    {
      kind: "end",
      eyebrow: "Sponsors",
      next: "This room is free because somebody funded it",
      qr: "sponsors",
      qrLabel: "The menu — shipai.club",
      c: "Ship AI is seeking corporate sponsors. Tiers are published — $1,000 to $10,000 — and cash, credits or hours all count the same. We're flexible: there's an opportunity at every price point, and a custom arrangement is always on the table.",
    },

    {
      kind: "timeline",
      title: "Where we are",
      note: "Six Wednesdays, then the weekend. Every session is free and standalone — you don't have to attend all of them to compete in October, and catching up late is explicitly allowed.",
    },

    { kind: "act", n: "01", eyebrow: "Act one", title: "Thirty days, no budget", art: "net", c: "What the channels actually were, in what order, and how much of it was repeatable versus lucky." },
    {
      kind: "walk",
      title: "The arc, in order",
      steps: [
        {
          t: "Manual",
          c: "by hand until it works",
          d: "The first users were found and onboarded one at a time, by hand. Automating a guess only makes the guess arrive faster. Doing things that don't scale is allowed; skipping the part where you find out whether they work is not.",
        },
        {
          t: "One channel",
          c: "sequence beats coverage",
          d: "One channel at a time, fed until it either repeated or clearly didn't. Run two at once and you learn nothing from either, because you can't tell which one moved the number.",
        },
        {
          t: "Repeatable",
          c: "method vs. lucky post",
          d: "Then the honest audit: which part was the method, and which part was a post that happened to land. The method is what you scale. The lucky post is a story, not a channel.",
        },
        {
          t: "Then paid",
          c: "only once the maths held",
          d: "Paid came last, and only once the funnel converted organically and payback was a number I could say out loud. The first three steps are what made the fourth safe.",
        },
      ],
      note: "Thirty days, four moves. None of them needed a budget — they needed doing in this order.",
    },
    {
      kind: "bullets",
      cols: 2,
      title: "The shipping sequence, in order",
      items: [
        { t: "Store prep", c: "App Store and Google Play, everything that has to be true before you submit. Review turnaround is a schedule input, not a surprise." },
        { t: "ASO", c: "The listing is a ranked surface, not a formality. Title, subtitle, keyword field, screenshots — the free distribution channel most builders fill in at 2am." },
        { t: "Social pages", c: "Set up where the audience already is, not everywhere. The analysis first, then two pages done properly instead of six abandoned." },
        { t: "Marketing site", c: "The one asset every channel points at. Oct 7 builds it properly; tonight is where it sits in the order." },
        { t: "Articles, SEO, pSEO", c: "Written once, ranking for months. Programmatic pages where the data supports them — one template, many queries." },
        { t: "Automated content", c: "Drafts off competitor coverage, scheduled and distributed rather than posted by hand. A pipeline, not a habit." },
        { t: "Friends and family", c: "The ask nearly everyone skips. Specific, small, and made person by person — the first reviews and installs come from people who already know you." },
      ],
    },
    {
      kind: "terminal",
      cmd: "/seo-audit  →  /programmatic-seo",
      out: ["35 articles on disk", "5 template families × 4 locales", "rank proof: none yet"],
      title: "The SEO half, mostly not typed by hand",
      c: "Off skills.sh — seo-audit, programmatic-seo, ai-seo and content-strategy, from coreyhaines31/marketingskills. That's the real ggbucks inventory, and the last line is the honest one: the pages exist, the rankings aren't proven. Generating pages is the easy half. Deciding which queries deserve a page, and checking those pages don't contradict your own product, is the half that decides whether any of it works.",
    },
    {
      kind: "flow",
      title: "How the old machine actually worked",
      steps: [
        { t: "Template", c: "A post template with an image prompt and variables — tournament banner, prize pool, activity." },
        { t: "Brand context", c: "Colours and style injected into every prompt automatically, so it all came out looking related." },
        { t: "Nano Banana Pro", c: "google/gemini-3-pro-image through the Vercel AI Gateway. Flux 2 Pro as fallback, Gemini Flash as the cheap seat." },
        { t: "Postiz", c: "Image buffer uploaded, post created, scheduled. No human between the model and the calendar." },
        { t: "Five platforms", c: "Facebook, Instagram, X, YouTube, TikTok — on a schedule, indefinitely.", lit: true },
      ],
      note: "Five steps, no approval gate anywhere in them. That's the whole design, and it's why it produced 783 posts. It ran from January until we fenced Postiz on Jul 22.",
    },
    {
      kind: "gallery",
      title: "What it made, 783 times",
      imgs: [
        { src: "/decks/b2c/early-product-choice-4x5.jpg", alt: "Paper-craft illustration, person tapping a play symbol", cap: "product-choice" },
        { src: "/decks/b2c/early-discovery-lifestyle-4x5.jpg", alt: "Paper-craft lifestyle scene", cap: "discovery-lifestyle" },
        { src: "/decks/b2c/early-tournament-arena-4x5.jpg", alt: "Paper-craft tournament arena", cap: "tournament-arena" },
        { src: "/decks/b2c/early-community-motion-9x16.jpg", alt: "Paper-craft community scene", cap: "community-motion" },
      ],
      note: "These are genuinely nice. They are also advertisements for no product in particular — swap the logo and they sell a meditation app. 502 posts on Facebook, 281 on Instagram, and late-era engagement rounds to zero. The model was never the bottleneck. Having nothing specific to say was.",
    },
    {
      kind: "split",
      title: "Automated content, end to end",
      left: { h: "Drafting", items: ["Competitor coverage as the input", "AI SDK does the drafting", "Every claim marked verified or not", "A human reads it before it goes out"] },
      right: { h: "Distribution", items: ["Direct adapters, five channels", "Postiz was cut on Jul 22", "Fail-closed: paused until proven", "Honest status: not posting yet"] },
    },
    {
      kind: "statement",
      text: "Spending before the unit economics were clear would have killed it.",
      note: "Paid doesn't find product-market fit. It buys more of whatever you already have — including more of a leak.",
    },
    {
      kind: "walk",
      title: "The switch to paid",
      steps: [
        {
          t: "Preconditions",
          c: "three things, all true",
          d: "A funnel converting organically, a payback period I could state, and a number I'd stop at. All three written down before the first dollar. Two out of three is how people end up funding a leak.",
        },
        {
          t: "Angles, not variations",
          c: "five reasons, not five wordings",
          d: "Five ways of saying the same thing is one test. Five different reasons to care is five. The angles come out of the value props, not the ad account — that's session 04 on Sep 16, and it's why positioning sits upstream of spend.",
        },
        {
          t: "The daily loop",
          c: "raise · hold · cut",
          d: "One look a day, three decisions available, judged against a threshold set in advance. Not a dashboard you stare at, and not a call you make at 11pm because a number twitched.",
        },
        {
          t: "The ceiling",
          c: "$61/day, and not by choice",
          d: "August: $1,098 of spend against $15,479 of revenue. The Android budget is set at $61/day — but what actually caps it is Google flagging the videos for exaggerated claims, so the ad groups run limited by policy, and Meta sitting in a billing hold since Aug 13. A channel isn't good or bad; the numbers under it are, and so are the policy flags.",
        },
      ],
      note: "Paid didn't create the business. It bought more of a funnel that already worked.",
    },

    { kind: "act", n: "02", eyebrow: "Act two", title: "The compounding half", art: "mark", c: "Paid stops the day you stop paying. This doesn't." },
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
      note: "It's a stage with a conversion rate, not a Discord you open and hope. Our own numbers: 51 referrals started, 5 completed. There's no ambassador programme yet. This is a stage being instrumented, not one that's already compounding — and saying that out loud is the difference between a plan and a pitch.",
    },
    {
      kind: "statement",
      text: "What didn't work, at the same length as what did.",
      note: "Because that's the half nobody publishes, and it's the half that saves you a month.",
    },
    {
      kind: "matrix",
      title: "Every paid channel, lifetime",
      heads: ["Spend", "Installs", "CPI"],
      rows: [
        { t: "Google Android", cells: ["$1,847", "3,040", "$0.61"] },
        { t: "Facebook", cells: ["$144", "87", "$1.65"] },
        { t: "TikTok", cells: ["$60", "10", "$6.01"] },
        { t: "Apple Search Ads", cells: ["$21", "not reported", "—"] },
      ],
      note: "Google does the volume. TikTok cost ten times as much per install and was killed on day six. And Apple Search Ads reports zero installs into this table — while the attribution table, for the same spend, shows 44 registrations and $407 of revenue events against $21. Same channel, two tables, opposite conclusions. I nearly put \"returned nothing\" on this slide.",
    },
    {
      kind: "bullets",
      cols: 2,
      title: "The rest of what didn't work",
      items: [
        { t: "The onboarding rewrite", c: "Eight steps at ~81% completion became five steps at ~57%. Abandonment on step one went 6.6% → 33.8%. Shorter is not the same as easier." },
        { t: "Reverting didn't fix it", c: "Completion went 68% → 58% anyway, with GEO_BLOCKED and NETWORK_ERROR underneath. The rollback proved the rewrite wasn't the only thing broken." },
        { t: "The reward-progress card", c: "94% of the people who tapped it could not afford the reward. We built a button whose main job was disappointing people." },
        { t: "The sub-$5 cashout test", c: "Measured nothing. A provider sync wiped the treatment group mid-test; it ended on 2 redemptions and $4. We shipped the $5 floor anyway, on judgement, and said so." },
        { t: "Organic social at volume", c: "502 Facebook posts and 281 on Instagram, generated and scheduled. Late-era engagement rounds to zero. Volume was the strategy and volume was the problem." },
        { t: "The Google video flag", c: "13 of 14 videos limited for exaggerated claims. Recutting the copy changed nothing — the claim Google was reading was inside our own app UI, in a screenshot." },
        { t: "Play prominent disclosure", c: "The ad SDK could initialise before consent. Correct finding, our bug, fixed in a later build — and it is still an open appeal." },
        { t: "Monitoring that wasn't", c: "The scheduled efficiency reports only ran while a desktop app happened to be open. Automation you don't verify is a cron job you imagined." },
      ],
    },

    {
      kind: "matrix",
      title: "Apple Search Ads, same $21, two tables",
      heads: ["campaign_stats", "attributions"],
      rows: [
        { t: "Spend", cells: ["$21", "$21"] },
        { t: "Installs", cells: ["0", "not a column"] },
        { t: "Registrations", cells: ["—", "44"] },
        { t: "First rewards", cells: ["—", "13"] },
        { t: "Revenue events", cells: ["—", { v: "$407", lit: true }] },
      ],
      note: "Same channel, same money, same week. One table says dead, the other says it's the best thing we bought. Neither is lying — iOS install postbacks never populated that column, so nobody wired it. A channel you can't measure looks exactly like a channel that doesn't work, and you'll kill it for the wrong reason.",
    },
    { kind: "act", n: "03", eyebrow: "Act three", title: "Receipts", art: "dome", c: "Thirty percent of the October score. \"We didn't really track that\" is the most common way a good ship weekend loses." },
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
      note: "Our actual events, not a website funnel — and the middle three are what Google bids on. Wiring gg_first_reward_earned and never watching it fire is how you get eight weeks of empty charts. Take a baseline today, with today's date; in eight weeks it's the \"before\" half of the story you take to October.",
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
      note: "First channel, the test, the budget, the go/no-go number. Four lines. Write them tonight. Every one of those channels points at a page — Oct 7 is the session that builds it.",
    },
    {
      kind: "thanks",
      title: "Workuity Biltmore",
      tag: "Platinum sponsor · Meetup venue",
      c: "Workuity hosts and sponsors every meetup in this series, tonight included. A free room with a real projector doesn't happen on its own — say thanks on your way out.",
      img: "/sponsor-workuity.png",
      imgAlt: "Workuity Biltmore",
    },
    {
      kind: "end",
      eyebrow: "Sponsors",
      next: "Sponsor a night, not a banner ad",
      qr: "sponsors",
      qrLabel: "The menu — shipai.club",
      c: "If tonight's numbers were worth the drive, this is how the next five stay free. Published tiers from $1,000 to $10,000, paid in cash, credits or hours — every price point has something, and we'll build a custom package if none of them fit. Grab Santos before you leave.",
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
      next: "Outbound Agents — Wed Sep 2, Workuity Biltmore",
      qr: "session-b2b-pipeline-sales",
      qrLabel: "Session page",
      c: "The B2B counterpart. An ICP tight enough to write the email to, twenty named accounts, and a sequence built live from a blank page.",
    },
  ],

  "b2b-pipeline-sales": [
    { kind: "title", ascii: ASCII_B2B, sub: "B2B, and your first ten customers" },
    ABOUT_SLIDE,
    HOST_SLIDE,
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
      kind: "end",
      eyebrow: "Sponsors",
      next: "Ship AI is looking for corporate sponsors",
      qr: "sponsors",
      qrLabel: "The menu — shipai.club",
      c: "Every tier is published, $1,000 through $10,000, and cash, credits and hours sit on the same ladder. We're flexible on purpose: there's an opportunity at every price point, and a custom arrangement is always on the table.",
    },

    {
      kind: "timeline",
      title: "Where we are",
      note: "Six Wednesdays, then the weekend. Every session is free and standalone — you don't have to attend all of them to compete in October, and catching up late is explicitly allowed.",
    },

    { kind: "act", n: "01", eyebrow: "Act one", title: "Who, exactly", art: "globe", c: "The whole method rests on this. Get it wrong and every email after it is aimed at nobody." },
    {
      kind: "statement",
      text: "If you can't name twenty real accounts, the ICP is still too broad.",
    },
    {
      kind: "walk",
      title: "An ICP you can write an email to",
      steps: [
        {
          t: "Company",
          c: "size · stage · stack · industry",
          d: "Specific enough that some companies obviously don't qualify. If nothing gets excluded, you've written a description of the market rather than a filter. Stack is the underrated one — it tells you what they've already decided.",
        },
        {
          t: "Role",
          c: "the pain and the budget",
          d: "The person with the problem and the person with the budget, named separately. They're often not the same human, and the email that works on one bores the other. Write to the problem holder; give them the sentence they'll forward.",
        },
        {
          t: "Trigger",
          c: "why now, not someday",
          d: "The thing that just happened — the raise, the hire, the migration, the public complaint. This is the part everyone skips, and it's the difference between a cold email and a timely one.",
        },
        {
          t: "The test",
          c: "twenty names, no shrugging",
          d: "Open a doc and write twenty real companies that fit. If you stall at eleven, the ICP is still too broad. Session 04 on Sep 16 takes the same narrowing all the way down to the one-liner and the pitch.",
        },
      ],
      note: "Four fields. Everything tonight — the list, the email, the sequence, the pipeline — is downstream of getting these right.",
    },

    { kind: "act", n: "02", eyebrow: "Act two", title: "The six stages", art: "dome", c: "For each arrow, the specific thing that has to happen. An event, not an opinion." },
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
    {
      kind: "walk",
      title: "The sequence, touch by touch",
      steps: [
        {
          t: "Day 1 · the hook",
          c: "the line only they could get",
          d: "One specific observation about them, the problem named in their language, and a small ask. Four sentences. The agent drafts the observation from real research; you read every one before it sends.",
        },
        {
          t: "Day 3 · the proof",
          c: "a different angle, not a bump",
          d: "Not \"just following up\". A second reason to care — a number, a screenshot, a customer sentence from someone who looks like them. If your first email led with the outcome, this one leads with the evidence.",
        },
        {
          t: "Day 7 · the sideways",
          c: "wrong person, right company",
          d: "Change the angle or change the recipient. Ask whether they're the right person rather than asking again for the meeting. \"Who owns this?\" gets answered more often than \"do you have fifteen minutes?\"",
        },
        {
          t: "Day 14 · the close",
          c: "leave without grovelling",
          d: "One line: you're closing the loop, here's the thing that might be useful anyway, door's open. No guilt, no fake deadline. Break-ups get replies precisely because they ask for nothing.",
        },
      ],
      note: "Four touches, then stop. Everything up to the reply is automated; the moment someone answers, a human takes it. Every one of these links to a page — Oct 7 is the session that makes sure the page agrees with the email.",
    },

    { kind: "act", n: "03", eyebrow: "Act three", title: "Trust compounds", art: "mark", c: "Slowly, and then quickly. The first reference is the expensive one." },
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
    {
      kind: "thanks",
      title: "Dan & Workuity",
      tag: "Platinum sponsor · The venue",
      c: "Workuity Biltmore hosts and sponsors every meetup in this series and the October weekend. Dan gives this community a room before it has anything to show him — thank him on your way out.",
      img: "/sponsor-workuity.png",
      imgAlt: "Workuity",
    },
    {
      kind: "end",
      eyebrow: "Sponsors",
      next: "Put your name on the next six months",
      qr: "sponsors",
      qrLabel: "The menu — shipai.club",
      c: "Ship AI is seeking corporate sponsors, and the prices are published on purpose — $1,000 to $10,000, settled in cash, credits or hours. There's an opportunity at every price point and a custom arrangement is always on the table. Scan for the menu, or find Santos.",
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
      next: "Unfair Advantage — Wed Sep 16, Workuity Biltmore",
      qr: "session-positioning-and-pitch",
      qrLabel: "Session page",
      c: "Why should anyone pick you over the thing they already use? Value prop, USPs, positioning and the pitch — written live, cut, said out loud, cut again.",
    },
  ],

  "positioning-and-pitch": [
    { kind: "title", ascii: ASCII_USP, sub: "Value prop, USP, positioning and the pitch" },
    ABOUT_SLIDE,
    HOST_SLIDE,
    {
      kind: "statement",
      text: "Why should anyone pick you over the thing they already use?",
      note: "If that takes you more than a sentence, tonight is the most valuable session in the program.",
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
      kind: "end",
      eyebrow: "Sponsors",
      next: "Somebody funds the free part",
      qr: "sponsors",
      qrLabel: "The menu — shipai.club",
      c: "Ship AI is seeking corporate sponsors. The tiers are published — $1,000 to $10,000 — and cash, credits and hours all count toward the same ladder. There's an opportunity at every price point, and a custom arrangement is always on the table.",
    },

    {
      kind: "timeline",
      title: "Where we are",
      note: "Six Wednesdays, then the weekend. Every session is free and standalone — you don't have to attend all of them to compete in October, and catching up late is explicitly allowed.",
    },
    {
      kind: "statement",
      text: "Run the site session first and you get beautiful pages that say nothing.",
      note: "Positioning is the input, not a nice-to-have. That's why it sits three weeks before Ship the Surface on Oct 7, and not after it.",
    },
    {
      kind: "walk",
      title: "The line, five fields",
      steps: [
        {
          t: "Who",
          c: "one segment, twenty names",
          d: "One segment, narrow enough that you could name twenty real customers. Narrow sounds smaller and converts better, because a stranger can tell in one read whether the sentence is about them.",
        },
        {
          t: "Instead of",
          c: "the real alternative",
          d: "What their Tuesday looks like without you. Usually a spreadsheet, a manual process, or nothing at all — rarely a competitor. Get this wrong and every comparison you write argues with a product nobody was considering.",
        },
        {
          t: "Value prop",
          c: "what they get, in their words",
          d: "The outcome, stated the way they'd state it — not what the product does, stated in yours. This is where most builder copy dies: machinery explained to people who only care about the result.",
        },
        {
          t: "USPs",
          c: "only true of you",
          d: "The claims a competitor can't also make. Half of what founders call a differentiator is table stakes — you still say it, you just don't lead with it. Every survivor needs proof attached to it.",
        },
        {
          t: "Sharp edge",
          c: "not copyable this quarter",
          d: "Of the USPs that survive, the most defensible one. The positioning gets built on this — not on the longest list — and it's the line that ends up in the hero, the cold email, the ad and the pitch.",
        },
      ],
      note: "Acts one to three fill these in, in this order. Write them once and every surface on Oct 7 renders from them. Skip them and you write each surface separately, and they disagree.",
    },

    { kind: "act", n: "01", eyebrow: "Act one", title: "Who, and instead of what", art: "globe", c: "Two questions. Most builders have written down neither." },
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

    { kind: "act", n: "02", eyebrow: "Act two", title: "Find the sharp edge", art: "bolt", c: "Half of what founders call a differentiator is something every competitor also has." },
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

    { kind: "act", n: "03", eyebrow: "Act three", title: "Compress it", art: "mark", c: "One line, then sixty seconds. Written on screen, cut, said out loud, cut again." },
    {
      kind: "statement",
      text: "For [who] who [problem], [product] is a [category] that [outcome]. Unlike [alternative], it [edge].",
      note: "Then the swap test: put a competitor's name in it. If it still reads true, it isn't positioning — it's a description.",
    },
    {
      kind: "walk",
      title: "Sixty seconds, five beats",
      steps: [
        {
          t: "Hook",
          c: "their problem, their words",
          d: "Open on the problem, stated the way they'd state it to a colleague. Ten seconds. If the first sentence is about you, you've spent the only attention you were given.",
        },
        {
          t: "Who it's for",
          c: "narrow, out loud",
          d: "Say the segment. The narrower it sounds, the more credible it gets — a listener who isn't your buyer immediately thinks of someone who is, which is the whole point of saying it out loud.",
        },
        {
          t: "What it does",
          c: "the one-liner, spoken",
          d: "One sentence: the one-liner you just wrote, said rather than read. If you stumble over it here, it's the writing that's wrong, not the delivery.",
        },
        {
          t: "Why you",
          c: "the edge, plus proof",
          d: "The sharp edge and the receipt behind it, in one breath. A number, a screenshot, or a customer sentence. Claim without proof and the whole minute gets discounted retroactively.",
        },
        {
          t: "The ask",
          c: "a real one",
          d: "Name the next step and make it small and specific. \"Let me know what you think\" is not an ask — it's a way of ending without risking a no.",
        },
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
      note: "Tonight's brief is the input to Oct 7 — the hero, the bio, the pinned post and the OG image all render from these five fields.",
    },
    {
      kind: "thanks",
      title: "Workuity Biltmore",
      tag: "Platinum sponsor · Meetup venue",
      c: "Workuity hosts and sponsors every meetup in this series, tonight included. Space, power and a screen, given to a room of strangers building things — thank them on your way out.",
      img: "/sponsor-workuity.png",
      imgAlt: "Workuity Biltmore",
    },
    {
      kind: "end",
      eyebrow: "Sponsors",
      next: "There's room on the sponsor wall",
      qr: "sponsors",
      qrLabel: "The menu — shipai.club",
      c: "Ship AI is seeking corporate sponsors, and the prices are published rather than negotiated in the dark — $1,000 to $10,000, paid in cash, credits or hours. Opportunity at every price point, and custom arrangements are always on the table.",
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
      c: "Your site and every page that points at it. Structure, teardowns, the Next.js handoff, and a live pass on the profiles a stranger actually finds.",
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
