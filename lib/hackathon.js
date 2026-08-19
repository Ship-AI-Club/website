/* ------------------------------------------------------------------
   Zero to Launch — single source of truth.

   Every date, time, venue and link for the session series and the
   hackathon weekend lives here. /programs/zero-to-launch/hackathon, /programs/zero-to-launch/hackathon/workshops and
   the homepage module all read from it, so changing a date once
   updates the copy, the schedules and the schema.org markup.
------------------------------------------------------------------ */

export const EVENT = {
  name: "Zero to Launch — Ship AI Hackathon",
  dates: "October 16–18, 2026",
  datesShort: "Oct 16–18, 2026",
  // Arizona is MST year-round (UTC-7, no DST)
  startISO: "2026-10-16T18:00:00-07:00",
  endISO: "2026-10-18T17:00:00-07:00",
  city: "Phoenix, AZ",
  // The hackathon weekend and every meetup in the series are at Workuity.
  venueKey: "workuity",
  venue: "Workuity Biltmore",
  street: "2390 E Camelback Rd, Suite 130",
  zip: "85016",
  address: "2390 E Camelback Rd, Suite 130, Phoenix, AZ 85016",
  cost: "Free",
  teams: "Teams of 1–4",
  deadline: "12:00 PM MST, Sunday Oct 18",
  /* The machine-readable half of `deadline`. The submission form and
     the server action both check against this, so "no late
     submissions" is enforced and not just written down. */
  deadlineISO: "2026-10-18T12:00:00-07:00",
  sponsorDeadline: "October 2, 2026",
  buildOpens: "Monday August 3, 2026",
  buildOpensShort: "Aug 3",
  seriesStart: "Wednesday August 5, 2026",
  seriesRange: "Aug 5 – Oct 14, 2026",
  seriesCadence: "every other Wednesday",
  seriesCount: 6,
};

/* Workuity Biltmore hosts and sponsors every meetup in the Zero to Launch
   series, as well as the hackathon weekend. Keep the venue and sponsor
   credit together here so every page renders the same wording. */
export const VENUES = {
  workuity: {
    name: "Workuity Biltmore",
    street: "2390 E Camelback Rd, Suite 130",
    city: "Phoenix",
    region: "AZ",
    zip: "85016",
    address: "2390 E Camelback Rd, Suite 130, Phoenix, AZ 85016",
    url: "https://www.workuity.com/",
    note: "Workuity is the venue sponsor for every meetup in this series.",
    sponsor: "Workuity",
    sponsorUrl: "https://www.workuity.com/",
  },
  chandler: {
    name: "Workuity Chandler",
    street: "3133 W Frye Rd, Suite 101",
    city: "Chandler",
    region: "AZ",
    zip: "85226",
    address: "3133 W Frye Rd, Suite 101, Chandler, AZ 85226",
    url: "https://www.workuity.com/",
    note: "Workuity is the venue sponsor for every meetup in this series.",
    sponsor: "Workuity",
    sponsorUrl: "https://www.workuity.com/",
  },
};

export function venueOf(workshop) {
  return VENUES[workshop?.venue || "workuity"];
}

export const ASCII_ZERO = `███████╗  ███████╗ ██████╗   ██████╗
╚══███╔╝  ██╔════╝ ██╔══██╗ ██╔═══██╗
  ███╔╝   █████╗   ██████╔╝ ██║   ██║
 ███╔╝    ██╔══╝   ██╔══██╗ ██║   ██║
███████╗  ███████╗ ██║  ██║ ╚██████╔╝
╚══════╝  ╚══════╝ ╚═╝  ╚═╝  ╚═════╝`;

export const ASCII_TO = `████████╗  ██████╗
╚══██╔══╝ ██╔═══██╗
   ██║    ██║   ██║
   ██║    ██║   ██║
   ██║    ╚██████╔╝
   ╚═╝     ╚═════╝`;

export const ASCII_LAUNCH = `██╗       █████╗  ██╗   ██╗ ███╗   ██╗  ██████╗ ██╗  ██╗
██║      ██╔══██╗ ██║   ██║ ████╗  ██║ ██╔════╝ ██║  ██║
██║      ███████║ ██║   ██║ ██╔██╗ ██║ ██║      ███████║
██║      ██╔══██║ ██║   ██║ ██║╚██╗██║ ██║      ██╔══██║
███████╗ ██║  ██║ ╚██████╔╝ ██║ ╚████║ ╚██████╗ ██║  ██║
╚══════╝ ╚═╝  ╚═╝  ╚═════╝  ╚═╝  ╚═══╝  ╚═════╝ ╚═╝  ╚═╝`;

export const DISCORD = "https://discord.gg/kZSJMNveYM";
export const MEETUP = "https://www.meetup.com/shipai/";
export const LUMA = "https://luma.com/shipai";
export const GITHUB = "https://github.com/Ship-AI-Club";
export const X_URL = "https://x.com/shipaiclub";
export const GTM_DECK = "https://gtm.desic.xyz/";

/* Contact routes through Discord rather than exposing a personal address
   to scrapers. Santos is reachable there and it is already the primary CTA. */
export const SPONSOR_MAIL = DISCORD;
export const JUDGE_MAIL = DISCORD;
export const MENTOR_MAIL = DISCORD;

export const LINKEDIN = "https://www.linkedin.com/company/shipaiclub";

export const SUBMIT_ISSUE =
  "https://github.com/Ship-AI-Club/events/issues/new?template=hackathon-submission.md&labels=hackathon&title=Submission%3A%20";

/* The open-source template repo — a folder per session and 25 GTM skill
   files in .claude/skills. Published for anyone to take and run, during
   the program or long after it. */
export const TEMPLATE_REPO = "https://github.com/Ship-AI-Club/zero-to-launch";
export const TEMPLATE_GENERATE = `${TEMPLATE_REPO}/generate`;
export const REGISTER_ISSUE =
  "https://github.com/Ship-AI-Club/events/issues/new?template=zero-to-launch-register.md&labels=zero-to-launch&title=Register%3A%20";

/* Per-event RSVP links. Luma/Meetup/LinkedIn event URLs don't exist until
   the events are created — until then these fall back to the calendars. */
export function rsvpLinks(workshop) {
  return {
    luma: workshop.luma || LUMA,
    meetup: workshop.meetup || MEETUP,
    linkedin: workshop.linkedin || LINKEDIN,
    pending: !workshop.luma && !workshop.meetup && !workshop.linkedin,
  };
}

export function workshopBySlug(slug) {
  return WORKSHOPS.find((w) => w.slug === slug);
}

export function workshopNeighbours(slug) {
  const i = WORKSHOPS.findIndex((w) => w.slug === slug);
  return { prev: i > 0 ? WORKSHOPS[i - 1] : null, next: i < WORKSHOPS.length - 1 ? WORKSHOPS[i + 1] : null };
}

/* ------------------------------------------------------------------
   The Wednesday series — 6 sessions, every other Wednesday from Aug 5
   to Oct 14, taking the Socratic Night slot for the run of the program.
   Every session is free and open; you don't have to attend all of them
   to compete, and nothing is required of you in the room. Santos
   presents and builds live; following along is optional. Dates match
   the existing Ship AI Meetup calendar.

   `commit` is a suggested takeaway, not a requirement — the thing to
   go do afterward if you want the program to compound.
------------------------------------------------------------------ */

export const WORKSHOPS = [
  {
    n: "01",
    slug: "gtm-engineering",
    venue: "workuity",
    eventTitle: "GTM Engineering",
    date: "Wed Aug 5",
    iso: "2026-08-05",
    title: "Go-to-market engineering, end to end",
    act: "Vision",
    copy: "The high-level vision and the map everything else hangs off. Launch → Grow → Optimize, funnel modeling, where revenue actually comes from, and why the engineering-shaped version of go-to-market suits this room.",
    take: "The full framework, and a clear picture of what a roadmap to October looks like.",
    deck: true,
    lede:
      "Session one is the roadmap. We walk the full GTM engineering framework end to end so that when September's positioning session comes around, or October's site build, you already know what job that piece is doing and what it feeds — and how it lands at a launch on Oct 16. Presentation format: sit and watch, or open a laptop and map your own product as we go.",
    why:
      "Most builders pick tactics before they have a model — an ad account before a funnel, a blog before a keyword, a pricing page before unit economics. This session gives you the model first, so the tactics have somewhere to attach.",
    agenda: [
      { t: "The three acts", c: "Launch, Grow, Optimize — what each phase is actually for, and the failure mode of skipping straight to the third." },
      { t: "Funnel modeling", c: "Measuring every stage rather than the last one. Where the numbers come from and which ones lie to you." },
      { t: "GTM engineering vs marketing", c: "Programmatic SEO, automated attribution and community distribution, versus buying ads and hiring salespeople." },
      { t: "B2C and B2B, side by side", c: "Nearly every framework splits here. You get both, and the next two sessions go deep on each." },
      { t: "Program mechanics", c: "The open-source repo, the skill files, and how the hackathon weekend works. Fifteen minutes, then it's out of the way." },
    ],
    bring: "Nothing. Show up and watch. If you want to follow along, bring a laptop and whatever you're currently building — even if it's an idea in a notes app.",
    commit: "01-roadmap/gtm-map.md — if you want somewhere to put it: your funnel sketched out with the stages you can actually measure today, and a roadmap to a launch in October.",
    skills: ["ask-santos", "gtm-map", "funnel-audit"],
    /* uploaded with scripts/upload-event-media.mjs, served public from
       Vercel Blob. The recording is the Remotion-branded cut: intro
       card, watermarked session, outro. Captions are Whisper-generated
       and shifted to sit behind the 4s intro. */
    media: {
      recording: "https://nhns5q7vlweke0ar.public.blob.vercel-storage.com/events/gtm-engineering/gtm-engineering-recording-v2.mp4",
      captions: "https://nhns5q7vlweke0ar.public.blob.vercel-storage.com/events/gtm-engineering/gtm-engineering.vtt",
      photos: [
        "https://nhns5q7vlweke0ar.public.blob.vercel-storage.com/events/gtm-engineering/gtm-engineering-01.jpg",
        "https://nhns5q7vlweke0ar.public.blob.vercel-storage.com/events/gtm-engineering/gtm-engineering-02.jpg",
        "https://nhns5q7vlweke0ar.public.blob.vercel-storage.com/events/gtm-engineering/gtm-engineering-03.jpg",
        "https://nhns5q7vlweke0ar.public.blob.vercel-storage.com/events/gtm-engineering/gtm-engineering-04.jpg",
      ],
    },
  },
  {
    n: "02",
    slug: "b2c-ggbucks-case-study",
    venue: "workuity",
    audience: "B2C",
    eventTitle: "Zero to $3,000",
    date: "Wed Aug 19",
    iso: "2026-08-19",
    title: "B2C, with the dashboard open",
    act: "Vision",
    copy: "Santos walks his own B2C case study as a live demo with the real numbers on screen: $0 to $3,318 in the first 30 days after it shipped with zero paid ad spend, four months of decay after that, and roughly $1,000 a day now on about $65 a day of ad spend. The shipping sequence in order — store prep, ASO, social pages, site, SEO, automated content, friends and family — then the switch to paid, and the parts that didn't work in the same detail as the parts that did.",
    take: "A channel plan with somebody else's receipts to compare yours against.",
    lede:
      "One business, one dashboard, no redactions. The dedicated B2C presentation: I walk the ggbucks launch as a live demo with the real numbers on screen, then pull out the parts that transfer to a different product — and the parts that don't.",
    why:
      "Case studies are usually told after the fact by someone with an outcome to sell. This one is told with the analytics open, including the channels that produced nothing and the money that was wasted finding that out. It runs early on purpose — seeing the whole arc once makes every session after it concrete.",
    agenda: [
      { t: "$0 → $3,318 in 30 days, zero paid", c: "Shipped Feb 7. What the channels actually were, in what order, and how much of it was repeatable versus lucky — including the four flat months that followed the first spike." },
      { t: "Store prep, then ASO", c: "Everything that has to be true before you submit to the App Store and Google Play, then the listing treated as a ranked surface rather than a formality." },
      { t: "Social pages and the site", c: "Where the audience already is, analysed before anything gets set up. Then the marketing site every channel points at." },
      { t: "Articles, SEO, programmatic SEO", c: "Written once, ranking for months — plus programmatic pages where the data supports one template across many queries." },
      { t: "Automated content and distribution", c: "Drafts off competitor coverage, scheduled and distributed on a pipeline rather than posted by hand." },
      { t: "Friends and family", c: "The ask nearly everyone skips. Specific, small, person by person — where the first installs and reviews actually come from." },
      { t: "The switch to paid", c: "What had to be true first. Why spending before the unit economics were clear would have killed it." },
      { t: "Scaling paid, profitably", c: "The first paid dollar wasn't spent until month five. Creative, targeting, the daily loop, and the numbers watched to decide whether to raise or cut spend — currently about $65 a day against roughly $1,000 a day of revenue." },
      { t: "Community as the compounding half", c: "Superfans → ambassadors → organic growth, and how it feeds back into the paid side." },
      { t: "What didn't work", c: "Given the same airtime as what did, because that's the half nobody publishes." },
      { t: "Instrument it before you need it", c: "The measurement half, folded in: events per funnel stage, verified firing, and an agent that reads your analytics and reports weekly in plain English. Receipts are 30% of the October score, and \"we didn't really track that\" is the most common way a good launch loses." },
      { t: "The structure, generalized", c: "The same plan reduced to something you can point at your own product: first channel, test, budget, go/no-go number." },
    ],
    bring: "Nothing required. If you want to follow along: your roadmap from session one, analytics access for whatever you\u2019ve built, and any early signal you already have.",
    commit: "02-b2c/ — afterward, if you want it: your own channel plan (first channel, test, budget, go/no-go number) plus an instrumented funnel and a baseline snapshot.",
    skills: ["channel-plan", "paid-test", "community-plan", "analytics-wire", "bi-agent"],
  },
  {
    n: "03",
    slug: "b2b-pipeline-sales",
    venue: "workuity",
    audience: "B2B",
    eventTitle: "Outbound Agents",
    date: "Wed Sep 2",
    iso: "2026-09-02",
    title: "B2B, and your first ten customers",
    act: "Vision",
    copy: "The B2B counterpart. An ICP tight enough to write the email to. Awareness → Interest → Evaluation → Decision → Onboarding → Expansion, and what actually moves a deal between stages. Outbound that gets replies, design partners, pilots, and pricing that survives procurement.",
    take: "A method for building a named account list and writing the first outbound sequence.",
    lede:
      "The dedicated B2B presentation, and the counterpart to session two. Less about traffic, more about ten specific companies and how you get the first conversation with each of them. I'll build an account list and write a sequence live, for a real product, so you can see what the finished thing looks like before you make your own.",
    why:
      "B2B founders often run B2C tactics — broad content, a waitlist, a launch post — and then wonder why nothing converts. The first ten B2B customers are almost always hand-won, one relationship at a time, and that work looks nothing like a funnel diagram.",
    agenda: [
      { t: "An ICP you can write an email to", c: "Company, role, trigger event. If you can't name twenty real accounts, the ICP is still too broad." },
      { t: "The stages", c: "Awareness → Interest → Evaluation → Decision → Onboarding → Expansion, and what specifically moves a deal from one to the next." },
      { t: "Outbound that gets replies", c: "Relevance over volume. Structure, length, the ask, and the follow-up that isn't annoying." },
      { t: "Design partners and pilots", c: "Structuring an early deal so it produces a reference and a case study, not just revenue." },
      { t: "Champions → advisors → references", c: "How B2B trust compounds, slowly and then quickly." },
      { t: "Tracking a pipeline you can show", c: "The measurement half for B2B: stages instrumented, touches logged, and an agent that reports weekly on what moved. A spreadsheet is fine — what isn't fine is a judge asking about pipeline in October and getting an anecdote." },
      { t: "The list, built live", c: "Twenty named accounts and a first sequence, put together on screen from a blank page." },
    ],
    bring: "Nothing required. If you want to follow along: your roadmap and LinkedIn open. B2C builders are welcome — plenty of this transfers.",
    commit: "03-b2b/ — afterward, if you want it: twenty named accounts, an outbound sequence, the pilot structure you're offering, and how you're tracking the pipeline.",
    skills: ["icp-builder", "outbound-sequence", "funnel-metrics", "bi-agent"],
  },
  {
    n: "04",
    slug: "positioning-and-pitch",
    venue: "workuity",
    eventTitle: "Unfair Advantage",
    date: "Wed Sep 16",
    iso: "2026-09-16",
    title: "Value prop, USP, positioning and the pitch",
    act: "Craft",
    copy: "Why should anyone pick you over the thing they already use? This is the session that answers it. Who exactly it's for, what they use today instead, the value proposition in their language rather than your architecture, the selling points that are genuinely yours versus the ones every competitor also claims. Then it compresses: the one-liner, then a sixty-second pitch ending in a real ask. Written live on screen, cut, said out loud, cut again.",
    take: "A worksheet you can fill in for your own product: value prop, the selling points that are actually yours, positioning, and the pitch that comes out of it.",
    lede:
      "The most-skipped session in any GTM program, and the one everything downstream depends on. Value proposition, unique selling points, positioning statement, one-liner, pitch — built in that order on screen, in real time, for a real product, including the cuts. You'll see what \"done\" looks like at every layer, which is most of the battle. Follow along on your own product if you want; nobody is asked to present.",
    why:
      "Most builders have never written down who the product is for or why anyone would pick it over the alternative. Run the site session first and you get beautifully built pages that say nothing. Positioning is the input, not a nice-to-have — which is why it sits immediately before the site session.",
    agenda: [
      { t: "Who exactly is this for?", c: "Narrow it until it's uncomfortable. \"Developers\" isn't an answer. \"Solo founders shipping their first paid API\" is." },
      { t: "What are they doing today instead?", c: "The real alternative is usually a spreadsheet, a manual process, or nothing at all — not a competitor." },
      { t: "Value proposition, not a feature list", c: "The difference between what it does and what they get. We take a real feature list and translate it into outcomes in the customer's language, live. Most builder copy dies here — it describes the machinery to people who only care about the result." },
      { t: "Unique selling points versus table stakes", c: "Half of what founders call a differentiator is something every competitor also has. We separate the two: what is genuinely only true of you, what is merely true, and what is table stakes you still have to say out loud because customers check for it." },
      { t: "What's your sharp edge?", c: "Of the USPs that survive, the one the alternative can't copy this quarter. That's what the positioning gets built on — not the longest list, the most defensible item." },
      { t: "Proof for each claim", c: "Every selling point needs something behind it: a number, a screenshot, a customer sentence, a benchmark. Claims without proof are the fastest way to lose a room, and receipts are 30% of the October score." },
      { t: "Compress it to the one-liner", c: "For [who] who [problem], [product] is a [category] that [outcome]. Unlike [alternative], it [edge]. Then the swap test and the stranger test, applied live to a real one until it breaks." },
      { t: "The elevator pitch", c: "Sixty seconds, five beats: hook, who it's for, what it does, why you plus proof, and the ask. Two versions — one for customers, one for investors." },
      { t: "Delivered out loud", c: "I'll give the pitch as written, then say what I'd cut on the second pass. If a listener can't repeat it back, it isn't done." },
    ],
    bring: "Nothing required. If you want to follow along: your roadmap and channel plan, and a tolerance for writing something that isn't finished.",
    commit: "04-positioning/ — afterward, if you want it: your one-page brief plus both pitch versions, written out.",
    skills: ["positioning-brief", "pitch-doctor"],
  },
  {
    n: "05",
    slug: "marketing-site",
    venue: "workuity",
    eventTitle: "Ship the Surface",
    date: "Wed Oct 7",
    iso: "2026-10-07",
    title: "Your site and every page that points at it",
    act: "Craft",
    copy: "Everything a stranger finds when they go looking. Site structure and section order, what separates a great one from a template, the Next.js boilerplate handoff, and a content plan — then an audit of your social pages and a live setup pass on each one. Performance work and content generation ship as skill files you run yourself.",
    take: "The structure of a site that converts, watched being built, plus a repeatable pass for every social page that points at it.",
    lede:
      "Everything about the site in one evening. The live time goes on the part that's hard to write down — structure, sequence, craft and judgement — with a site scaffolded and deployed on screen as we go. The mechanical half ships as skill files you run yourself: performance passes, OG images, article drafting and programmatic pages.",
    why:
      "A marketing site is the one asset every channel points at. Get it wrong and every visitor you earn leaks out of it. Most builder sites fail the same three ways: the hero describes the technology, the proof is adjectives, and there are five competing CTAs. None of those are fixed by a faster build — they're fixed by judgement, which is what the live session is for.",
    agenda: [
      { t: "The structure", c: "Sections, the order they go in, and what the page has to accomplish before it earns a scroll." },
      { t: "Teardowns, live", c: "Good sites and bad ones, pulled apart on screen. Send yours ahead in Discord if you want it looked at." },
      { t: "Positioning above the fold", c: "The one-liner from session four becomes the hero. If it doesn't survive contact with the page, the positioning was the problem." },
      { t: "Proof over adjectives, one CTA", c: "What counts as evidence to a stranger, how little of it you need, and cutting everything that competes with the primary CTA." },
      { t: "The boilerplate handoff", c: "The Next.js setup: routing, metadata, OG images. Enough to get deployed the same night if you're building along — the depth lives in the skill files." },
      { t: "The content plan", c: "Working backwards from what an ICP searches for to the first twenty pages. Generation itself is a skill file, not a lecture." },
      { t: "Audit the rest of your surface", c: "The site is one of maybe eight places someone lands. We pull up a real set of profiles and read them cold: what does each one signal, what contradicts the positioning, what is abandoned, what is missing. Most of the damage is a stale bio and a banner from two products ago." },
      { t: "Set the pages up, one at a time", c: "Handle, bio, banner, pinned post, links, and the one line that has to match the site hero. Done individually rather than blasted, because each platform reads differently. A few done live so you see the pattern." },
      { t: "Run it agentically", c: "Once the positioning is settled the whole pass is mechanical, so it belongs in Claude Code or the Codex extension rather than an afternoon of tab-switching. Skill files generate the copy per platform, to the right length, from the same brief." },
    ],
    bring: "Nothing required. If you want to build along: laptop, Node installed, a deploy account you can log into, your positioning brief, a domain if you have one, and logins for whichever social accounts you already have.",
    commit: "05-site/ — afterward, if you want it: your deployed URL, a performance snapshot, and your content map.",
    skills: ["site-structure", "landing-copy", "site-scaffold", "og-image", "perf-pass", "content-map", "programmatic-pages", "article-draft", "social-audit", "social-profile"],
    boilerplate: true,
  },
  {
    n: "06",
    slug: "growth-engineering",
    venue: "workuity",
    eventTitle: "Agentic Growth",
    date: "Wed Oct 14",
    iso: "2026-10-14",
    title: "Automated content, paid marketing, and the CAC ceiling",
    act: "Launch",
    copy: "The last session before the weekend. Automating social posting and content creation so distribution runs without you, then performance marketing basics — creative, targeting, the daily loop — anchored to the one number that decides whether paid works at all: the most you can afford to pay for a customer.",
    take: "A content engine wired up on screen, and the arithmetic behind a paid ceiling you can defend.",
    lede:
      "Two days before the hackathon. Distribution is the half most builders never automate and paid is the half most builders get wrong by spending first and measuring later. We cover both, in that order, with the automation built live, and finish on the arithmetic that governs them.",
    why:
      "Content that depends on you remembering to post stops the first busy week. Paid spend without a CAC ceiling is how a working launch still loses money on every customer. Both failures are avoidable and both are cheap to fix before the money is committed rather than after.",
    agenda: [
      { t: "Automating the content pipeline", c: "Built on screen: agents that draft from a content map, hold a voice, and queue posts on a schedule. Where the human stays in the loop, and where the loop is theatre." },
      { t: "Social distribution without a social media manager", c: "One piece of work, repurposed across channels automatically. Cadence that survives a busy month, because the one that doesn't is the one you'll abandon." },
      { t: "Performance marketing basics", c: "Account structure, creative angles versus creative variations, targeting narrow before broad, and the daily loop for deciding to raise, hold or cut." },
      { t: "The CAC ceiling", c: "LTV, churn and payback, inverted into the maximum you can pay per customer, worked through with real numbers. This is what makes a channel viable or not — and what weekend spend has to clear." },
      { t: "Pricing, quickly", c: "The model has to match how customers get value. Better set deliberately now than anxiously on Saturday." },
      { t: "Weekend logistics", c: "Venue, timings, what to bring, what happens when. Then it's on." },
    ],
    bring: "Nothing required. If you're building along: your site, your content map, the analytics you wired back in August, and any real numbers you have.",
    commit: "06-growth/ — afterward, if you want it: your content automation setup, your paid plan, and the CAC ceiling it has to clear.",
    skills: ["social-automation", "social-post", "content-repurpose", "ship-announcement", "paid-basics", "paid-test", "unit-economics", "pricing-model", "launch-checklist"],
  },
].sort((a, b) => a.n.localeCompare(b.n));

export const ACTS = [
  { name: "Vision", copy: "The roadmap, then what it looks like when it works — two businesses, real numbers, B2C and B2B.", range: "Aug 5 – Sep 2" },
  { name: "Craft", copy: "Positioning that holds up, and the site that carries it.", range: "Sep 16 – Oct 7" },
  { name: "Launch", copy: "Automated distribution, paid, and the CAC ceiling — then the weekend where it all goes public.", range: "Oct 14 – Oct 18" },
];
