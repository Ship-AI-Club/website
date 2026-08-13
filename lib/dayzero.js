/* ------------------------------------------------------------------
   Day Zero — the beginner-to-intermediate series, four sessions.

   Same shape as WORKSHOPS in hackathon.js so every program surface can
   read either one. Session one has dates: `nights` lists each room.
   Remaining sessions keep `date` and `iso` null, and everything
   downstream keys off an empty nights list to render "Dates TBD" —
   no RSVP row, no Event JSON-LD, no relative timeframes.
   When the later dates land, fill `date`/`iso` (or `nights`) here
   and the schema, the schedules and the copy turn on with no route
   changes.

   No luma/meetup/linkedin fields until those event URLs exist;
   RSVP falls back to the Ship AI calendars.

   `commit` is a suggested takeaway, not a requirement — the thing to
   go do afterward if you want the four nights to compound.
------------------------------------------------------------------ */

export const DAY_ZERO_STEPS = [
  {
    name: "Use",
    copy: "Skills so you only have to explain yourself once, and connectors so it reads your real material instead of guessing at it.",
    range: "Session 01",
  },
  {
    name: "Co-work",
    copy: "The same skills on a schedule: a live calendar, a weekly report that arrives without you, outbound drafted.",
    range: "Session 02",
  },
  {
    name: "Build",
    copy: "Everything so far lived in a chat window. This is the night it gets a URL.",
    range: "Session 03",
  },
  {
    name: "Automate",
    copy: "An agent answering on your own site, and one workflow that runs while you sleep.",
    range: "Session 04",
  },
];

export const DAY_ZERO_SESSIONS = [
  {
    n: "01",
    slug: "first-threads",
    venue: "workuity",
    eventTitle: "First Threads",
    date: "Tue Aug 25",
    iso: "2026-08-25",
    nights: [
      { date: "Tue Aug 25", iso: "2026-08-25", venue: "workuity" },
      { date: "Wed Aug 26", iso: "2026-08-26", venue: "chandler" },
    ],
    title: "Getting real work out of ChatGPT and Claude",
    act: "Use",
    copy: "Most people use these tools like a search box, and get search-box answers back. This is the other way to work: skills so you explain yourself once instead of every time, and connectors so it reads your real material instead of whatever you remembered to paste. Built live on one real business — the one you carry through all four nights.",
    take: "A brand voice skill and an ICP skill built from your own material, one connector wired to where that material already lives, the positioning one-pager they produce, and your first article drafted.",
    lede:
      "Day zero is the day you actually start — not the day you meant to. Session one is where you pick the business. Everything across the next three nights gets built on it, so the first ten minutes are spent naming it out loud. Then the real work: what separates a thread that produces something from a thread that produces conversation, how to turn the thing you keep re-explaining into a skill file you run with one word, and how to connect the tool to where your material already lives so it stops guessing. Follow along on a laptop, or just watch.",
    why:
      "The blank box is the whole problem. Nobody was ever taught what to put in it, so most first hours with these tools end in a paragraph that sounds fine and does nothing. A thread with a job — context, role, task, format, artifact — ends in a file you keep and reuse. That's the difference, and it's learnable in one evening.",
    agenda: [
      { t: "Pick the business", c: "Ten minutes, out loud: the thing you sell, or the thing you'd sell if it existed. Every artifact in the program points at this one, so pick the real one rather than the impressive one." },
      { t: "Anatomy of a thread that works", c: "Context, role, task, format, and the artifact it ends in. We take a vague ask and rebuild it live, one layer at a time, until the output is something you'd actually keep." },
      { t: "Chat as search vs chat as work", c: "Two windows side by side, same question. One gives you a paragraph you'll close and forget; the other gives you a file with your name on it. The input is the only difference." },
      { t: "Skills: teach it once", c: "A skill file is instructions you wrote down once so you stop repeating yourself every thread. What belongs in one, what doesn't, and how to check it works in a fresh thread with no context." },
      { t: "Connectors: stop pasting", c: "A skill tells it how to work. A connector gives it something to work from — your drive, your notes, your calendar. We wire one on screen and read a real file back. Also which ones to leave switched off, and how to take access away again." },
      { t: "Your brand voice, built live", c: "From three real writing samples, never adjectives. \"Friendly and professional\" produces identical copy for you and your closest competitor. Your own sent emails don't." },
      { t: "Your ICP, built live", c: "Who pays, what makes it urgent this month, and who you'd turn down. Written as a skill rather than a document, so every draft after tonight reads it first." },
      { t: "The one-pager, then the first draft", c: "Voice plus ICP into a positioning one-pager, then one article drafted from it with every claim marked verified or not. Drafted tonight, published when the claims check out." },
    ],
    bring: "A laptop if you want to follow along, and three real writing samples — sent emails, old posts, anything you actually wrote. A free ChatGPT or Claude account is enough for tonight. Following along is optional; plenty of people just watch the first one.",
    commit: "01-voice/ — if you want somewhere to put it: your brand-voice and ICP skill files, the positioning one-pager they produced, and the first article draft with its claims marked.",
    skills: ["skill-writer", "brand-voice", "icp-profile", "positioning-brief", "article-draft"],
  },
  {
    n: "02",
    slug: "coworking-with-ai",
    venue: "workuity",
    eventTitle: "Daily Driver",
    date: null,
    iso: null,
    title: "Routines, artifacts, and work that runs on a schedule",
    act: "Co-work",
    copy: "AI that waits to be asked is a tool. AI on a calendar is a coworker. Tonight the skills from session one become routines: a four-week content calendar you update instead of regenerate, a weekly numbers report that arrives without you asking, and outbound drafted to a folder. Nothing sends itself.",
    take: "Three routines running on your own business, each with a written checkpoint line naming the human who reads it.",
    lede:
      "Session two turns last session's skills into a week that runs on rails. We build a four-week content calendar as a live artifact, put a weekly report on an actual schedule and wait for the first one to land on screen, then draft an outbound sequence to the ICP you already wrote. Every routine leaves with one line: what it produces, when, and who checks it before anything reaches a customer.",
    why:
      "The gap between people who get value out of these tools and people who don't isn't prompting skill. It's whether anything happens when they aren't typing. A routine is three parts — a skill, a trigger, and a checkpoint — and most people build the first, skip the second, and are vague about the third.",
    agenda: [
      { t: "What a routine actually is", c: "A skill, a trigger, and a checkpoint. Drop any one of the three and you're left with either a chat log or an unsupervised robot with your name on it." },
      { t: "Artifacts vs live artifacts", c: "A dead artifact is generated once and rots. A live one gets edited, appended to and read back next week. The difference is a habit, not a file format — and regenerating throws away everything you learned since." },
      { t: "The content calendar, built live", c: "Four weeks, worked backwards from questions your ICP actually asks. Then we add one entry by hand in the room, because that's the move that keeps it alive." },
      { t: "Scheduled tasks, on screen", c: "The scheduler in ChatGPT and the one in Claude, both demoed for real. Same pattern, different buttons — plus the cron version for anyone who'd rather own it outright." },
      { t: "The weekly report", c: "Three to five numbers you can genuinely obtain, under 200 words, in plain English. Scheduled during the session, and we wait for the first run to arrive rather than assuming it did." },
      { t: "Outbound, drafted", c: "Your ICP into twenty named accounts with a reason each, then a sequence written to a folder. You send every one of them by hand. Nothing sends itself, tonight or later." },
      { t: "The checkpoint rule", c: "One written line per routine naming who reviews what. A checkpoint you never actually read isn't a checkpoint, and unread automation is how a wrong number ends up in front of a customer." },
    ],
    bring: "A laptop, your files from session one, and whatever numbers you can already see — signups, orders, visits, replies. Free accounts cover most of the evening; scheduled tasks sit behind a paid plan on both ChatGPT and Claude today, so we demo them on screen and show the cron path for anyone not paying. Missed session one? Come anyway — we'll point you at the two skills to run first.",
    commit: "02-routines/ — if you want somewhere to put it: your four-week calendar, the weekly report format and its first real run, the outbound drafts, and a checkpoint line for each of the three.",
    skills: ["content-calendar", "weekly-report", "icp-builder", "outbound-sequence", "social-post"],
  },
  {
    n: "03",
    slug: "first-deploy",
    venue: "workuity",
    eventTitle: "First Deploy",
    date: null,
    iso: null,
    title: "A marketing site, built and deployed in one sitting",
    act: "Build",
    copy: "Everything so far lived in a chat window. Tonight it gets a URL. Claude Code and the Codex extension are the same chat moved into your files — we install one together, scaffold the site, make the session-one one-pager the hero, generate five pages from real data, and deploy before the room clears.",
    take: "A live URL with your own positioning on it, plus five programmatic pages that survive a stranger reading them.",
    lede:
      "Session three is the biggest step in the program and it's budgeted as a room: setup happens together, out loud, with the slowest laptop setting the pace. Then the site — structure first, copy from the one-pager you already wrote, pages generated from data you already have — and a deploy on screen. Watching is fine. This is the night where following along pays for itself.",
    why:
      "The site is the one thing every channel points at, and \"I'll do it when I know how to code\" is the sentence that keeps most builders in the chat window permanently. The agent handles the typing. The judgement — one CTA, proof instead of adjectives, whether a page deserves to exist at all — is what the evening is actually for.",
    agenda: [
      { t: "The chat, in your files", c: "What changes when the model can read your project and write to it. No more copy-paste, and an error message stops being the end of the evening and becomes something you paste back." },
      { t: "Setup, together", c: "Install and authenticate as a room, at the pace of whoever's stuck. This is the slowest fifteen minutes of the program and we plan for it rather than pretending it takes two." },
      { t: "The one-pager becomes the hero", c: "Your positioning from session one, above the fold, in the customer's words. If it doesn't survive contact with the page, the positioning was the problem — not the design." },
      { t: "Structure that converts", c: "Section order, one CTA, and proof where the adjectives were. Real sites pulled apart on screen first, so you can see the pattern before you build yours." },
      { t: "Pages at scale, without the spam", c: "One dataset, many pages. The doorway test comes first: if the only difference between two pages is a swapped noun, it's spam and the whole domain pays for it. Ship a sample of five before you generate five hundred." },
      { t: "Your articles get a home", c: "The draft from session one goes somewhere real — a canonical, internal links, and a place in the content map rather than a lonely /blog nobody links to." },
      { t: "Deploy", c: "Git, a deploy account, and a real URL on screen before the night ends. If a build fails, that's the useful part — we read the error and fix it in front of everyone." },
    ],
    bring: "A laptop with Node installed, a GitHub account, and a deploy account you can log into. Access to Claude Code or the Codex extension — both need a paid plan or an API key with a few dollars on it, so sort that out beforehand. Exact setup steps go in Discord the week before. Not set up in time? Sit next to someone and watch: the template is public and it'll still be there tomorrow.",
    commit: "03-site/ — if you want somewhere to put it: your deployed URL, the site structure, five sample programmatic pages, and an OG image that renders when someone shares the link.",
    skills: ["site-structure", "landing-copy", "site-scaffold", "content-map", "programmatic-pages", "og-image", "perf-pass"],
    boilerplate: true,
  },
  {
    n: "04",
    slug: "agentic-workflows",
    venue: "workuity",
    eventTitle: "The Night Shift",
    date: null,
    iso: null,
    title: "A support agent and a workflow that runs while you sleep",
    act: "Automate",
    copy: "Until tonight, everything waited for you to show up. Session four puts an agent on the site you shipped — answering from your own pages, escalating what it shouldn't touch — and one workflow on a schedule that drafts into a review queue you approve. Same repo as last session, extended from a prepared branch.",
    take: "A chat agent live on your site with its guardrails written down, and one scheduled workflow you've watched run and watched fail.",
    lede:
      "The last session extends the exact repo from session three. You pull a prepared branch, so nobody spends the evening on plumbing. We build a support agent that answers from your own content and knows when to hand off to a human, write the guardrails before it goes live, then put one workflow on a schedule and watch a run land in the logs. Then we break it on purpose, because a job that failed silently is the worst outcome available.",
    why:
      "An agent that's confident and wrong costs more than no agent at all. It reaches for model memory instead of your pages, promises things you would never promise, and does it in front of a customer. The fix isn't a better model. It's a guardrails file, three legal outcomes, and a human at the end of the queue.",
    agenda: [
      { t: "Agent vs workflow", c: "One waits for a message, one waits for a clock. Different triggers, different shapes, different ways of going wrong. We build one of each and name which of your problems is which." },
      { t: "The handoff", c: "Pull the prepared branch onto session three's repo and add your keys. Ten minutes of wiring somebody else already did, so the evening goes on the parts that need your judgement." },
      { t: "The support agent", c: "A chat route on your own site, answering from your own pages rather than model memory. Three legal outcomes: answer, escalate, refuse. \"I don't know — here's a human\" is a correct answer, and making it correct is most of the work." },
      { t: "Guardrails, written first", c: "Never promise a date, never negotiate a price, never send email. Written to a file before deploy, because the version you write afterwards is the version written after the screenshot." },
      { t: "The night shift", c: "One scheduled workflow, picked in the room: weekly article drafts into a review queue, or the numbers report rebuilt to run itself. Nothing publishes without a human. The path we don't build is written up in the guide." },
      { t: "Watch it run, then break it", c: "Manual trigger first and read the whole log. Then enable the schedule, wire a failure alert, and make one run fail on purpose so you know what the silence would have hidden." },
      { t: "What compounds from here", c: "Four sessions ago this was a blank box. Now something runs while you sleep. Where it goes next is a business with numbers on it, and that's the job Zero to Launch — the six-session program and the hackathon weekend — picks up." },
    ],
    bring: "A laptop, session three's repo, and the deploy account it's sitting on. Tonight needs an API key with real credit on it; a few dollars covers the evening, and we'll name the exact keys in Discord beforehand. Missed session three? Clone the finished template and start from there — nothing tonight assumes you typed it yourself.",
    commit: "04-agents/ — if you want somewhere to put it: your guardrails file, the agent's ten-question test log including the two escalations, the workflow, and a screenshot of the run you made fail.",
    skills: ["support-agent", "scheduled-workflow", "content-repurpose"],
  },
].sort((a, b) => a.n.localeCompare(b.n));
