/* ------------------------------------------------------------------
   Session 03 — Outbound Agents.

   Live board (atlas.desic.xyz), a survey of three first-ten stories,
   then the method you'd run this week. Wired as DECKS["b2b-pipeline-sales"].
------------------------------------------------------------------ */

import { ABOUT_SLIDE, HOST_SLIDE } from "./deck-shared.js";

const ASCII_B2B = `██████╗ ██████╗ ██████╗
██╔══██╗╚════██╗██╔══██╗
██████╔╝ █████╔╝██████╔╝
██╔══██╗██╔═══╝ ██╔══██╗
██████╔╝███████╗██████╔╝
╚═════╝ ╚══════╝╚═════╝`;

export const B2B_CASE_DECK = [
  { kind: "title", ascii: ASCII_B2B, sub: "A live board, a survey of the first ten, then the method" },
  ABOUT_SLIDE,
  {
    kind: "statement",
    title: "The room",
    text: "We're becoming grokbot.community.",
    tags: ["Same room", "Same work", "New name"],
    note: "Ship AI stays the program. The community name is catching up to the thing we actually talk about.",
  },
  HOST_SLIDE,
  {
    kind: "statement",
    text: "Lead gen, enrichment, outbound — on the board.",
    tags: ["atlas.desic.xyz", "Lead Engine", "GTM"],
    note: "desic is in GTM. This is the Lead Engine we run. Then three companies that published how their first ten arrived, and the method you'd run this week.",
  },
  {
    kind: "agenda",
    title: "Tonight",
    items: [
      "The board: find, enrich, send",
      "Why the first ten look nothing like a funnel",
      "Three companies, the same shape",
      "An ICP you can write an email to",
      "Outbound that gets replies",
      "After they reply: the call, the pilot, the stall",
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

  { kind: "act", n: "01", eyebrow: "Act one", title: "The survey", art: "globe", c: "Three companies published how they started. Steal the shape, not the logo." },
  {
    kind: "statement",
    text: "Every famous B2B company looks like a machine in year five. In month three it was a founder and a list of names.",
    note: "The board is the live look. The survey is the shape. The playbook after it is how you'd run the same thing this week.",
  },
  {
    kind: "news",
    n: "01",
    of: "03",
    eyebrow: "The survey",
    title: "Stripe: \"Right then, give me your laptop.\"",
    src: "Paul Graham · Do Things that Don't Scale",
    href: "https://paulgraham.com/ds.html",
    facts: [
      "The ICP was the YC batch — a room they could name, not \"developers who need payments.\"",
      "If someone said yes, the Collisons installed Stripe on the spot. YC still calls it a Collison installation.",
      "They didn't send a link. Sending a link is how a yes becomes a maybe overnight.",
    ],
    prompt: "Who is your YC batch — the twenty people who already trust you enough to open a laptop?",
  },
  {
    kind: "news",
    n: "02",
    of: "03",
    eyebrow: "The survey",
    title: "Amplitude: one paid yes, then the diaspora",
    src: "Spenser Skates · first customer, July 2013",
    href: "https://www.productboard.com/blog/cpo-series-amplitude/",
    facts: [
      "They talked to about thirty companies before writing the product. The first paying customer was Super Lucky Casino.",
      "Skates later said he should have asked for money earlier — free users were the wrong companies.",
      "That champion was an ex-Zynga PM. The next customers were other ex-Zynga PMs. The graph is a reference, not a funnel.",
    ],
    prompt: "If tonight's design partner said yes, who are the five people they could introduce by Friday?",
  },
  {
    kind: "news",
    n: "03",
    of: "03",
    eyebrow: "The survey",
    title: "Segment: a year to two paid deals",
    src: "Peter Reinhardt · YC interview",
    href: "https://www.ycombinator.com/blog/peter-reinhardt-on-finding-product-market-fit-at-segment",
    facts: [
      "They open-sourced on Hacker News. The first users were those threads — a named room again.",
      "It still took almost a year to close the first two paid contracts. Usage is not a pipeline.",
      "The product they scaled was found later, on a sales trip: five customers described the same S3-to-warehouse job. They went and listened.",
    ],
    prompt: "What would you learn if you sat with your five warmest users and only asked what they already do with you?",
  },
  {
    kind: "matrix",
    title: "Three companies. One shape.",
    heads: ["The room", "The first move", "What compounded"],
    rows: [
      { t: "Stripe", cells: ["YC batch", { v: "Install it now", lit: true }, "One founder told another"] },
      { t: "Amplitude", cells: ["Ex-Zynga PMs", { v: "Ask for money", lit: true }, "Champion intros"] },
      { t: "Segment", cells: ["Hacker News", { v: "Ship, then sit with them", lit: true }, "The job they were already doing"] },
    ],
    note: "Named room. Founder in the room. A paid yes. The next deal starts warm. None of this is a 500-email sequence.",
  },
  {
    kind: "flow",
    title: "The shape, written down",
    steps: [
      { t: "A room", c: "Twenty names you can actually reach." },
      { t: "A first yes", c: "Paid, or scoped so it produces a story." },
      { t: "A champion", c: "They can introduce the next five.", lit: true },
      { t: "Then a process", c: "The sequence, the stages, the sheet." },
    ],
    note: "The playbook in acts two and three is that process. It is not how you get the first yes. That is the survey.",
  },
  {
    kind: "statement",
    text: "None of them started with five hundred emails.",
    note: "Outbound is how you refill the list after the room you already have. If you cannot name the room, the sequence has nowhere to go.",
  },

  { kind: "act", n: "02", eyebrow: "Act two", title: "Who, exactly", art: "globe", c: "The whole method rests on this. Get it wrong and every email after it is aimed at nobody." },
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
        d: "Specific enough that some companies obviously don't qualify. Stripe's first room was YC, not \"any company that takes payments.\" If nothing gets excluded, you've written a description of the market rather than a filter.",
      },
      {
        t: "Role",
        c: "the pain and the budget",
        d: "The person with the problem and the person with the budget, named separately. They're often not the same human. Write to the problem holder; give them the sentence they'll forward.",
      },
      {
        t: "Trigger",
        c: "why now, not someday",
        d: "The thing that just happened — the raise, the hire, the migration, the public complaint. Amplitude's trigger was ex-Zynga PMs who had just lost their internal analytics. That's a why-now, not a persona.",
      },
      {
        t: "The test",
        c: "twenty names, no shrugging",
        d: "Open a doc and write twenty real companies that fit. If you stall at eleven, the ICP is still too broad. Session 04 on Sep 16 takes the same narrowing all the way down to the one-liner and the pitch.",
      },
    ],
    note: "Four fields. Everything tonight — the list, the email, the sequence, the pipeline — is downstream of getting these right.",
  },
  {
    kind: "split",
    pair: true,
    title: "Where the twenty names actually come from",
    left: { h: "Warm first", items: ["People who already reply to you", "A community you already post in", "A champion's old teammates", "The five users you'd text"] },
    right: {
      h: "Then cold",
      items: ["Job posts and stack pages", "A raise, a hire, a migration", "A public complaint", "The sequence, after the room"],
    },
    note: "Stripe started in the batch. Amplitude started in a diaspora. Segment started on a thread. Cold email is how you leave the room — it is not the room.",
  },
  {
    kind: "flow",
    title: "Community is a room you can name",
    steps: [
      { t: "A room", c: "A meetup, a Discord, a thread. People who already reply." },
      { t: "Shared work", c: "Workshops, not a broadcast." },
      { t: "A few stay", c: "They show up. They tell a friend.", lit: true },
      { t: "The next twenty", c: "You write the list from the room." },
    ],
    note: "This room is the example. You do not need a thousand members. You need twenty people who come back.",
  },
  {
    kind: "flow",
    title: "Then expand to content",
    steps: [
      { t: "Record the fix", c: "Problems your ICP is already having." },
      { t: "Record the talk", c: "The presentation, once." },
      { t: "Cut shorts", c: "The same talk, in pieces." },
      { t: "Post it", c: "LinkedIn, Instagram, X.", lit: true },
    ],
    note: "One recording should die as twenty posts, not one upload.",
  },
  {
    kind: "prism",
    title: "Learn what travels before you buy attention",
    note: "LinkedIn, Instagram and X will tell you what gets seen, what gets a reply, and what dies. Do not buy ads until the first ten clients — outbound or inbound — have told you what resonated.",
    channels: ["LinkedIn", "Instagram", "X"],
    rays: 3,
  },

  { kind: "act", n: "03", eyebrow: "Act three", title: "Outbound, then the call", art: "dome", c: "The sequence gets you the reply. Everything after that is a human." },
  {
    kind: "split",
    pair: true,
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
  {
    kind: "walk",
    title: "The fifteen minutes, after they reply",
    steps: [
      {
        t: "Their Tuesday",
        c: "what they do today",
        d: "Walk the current job in their words. Segment's later AE opened a meeting with twenty minutes of this before anyone touched a deck. The product comes second.",
      },
      {
        t: "The trigger",
        c: "why they answered",
        d: "The raise, the migration, the thing that's on fire this month. If there isn't one, this is a nice conversation and not a deal.",
      },
      {
        t: "Who else",
        c: "the second human",
        d: "Interest, in this program, means they brought someone else. Ask who has to say yes, and whether you can meet them. One champion is not a committee.",
      },
      {
        t: "Qualify or walk",
        c: "budget · yes · now · a date",
        d: "Can they pay, who can say yes, do they need it this month, and when. If you cannot answer all four on the first call, walk. Size the deal against what they already spend on the problem — seats, the current tool, the integration — not what it costs you to deliver.",
      },
    ],
    note: "The agent stops at the reply on purpose. Everything after this is a human.",
  },
  {
    kind: "flow",
    title: "After they reply, the week",
    steps: [
      { t: "The call", c: "The fifteen minutes you just ran." },
      { t: "A channel", c: "Shared Slack, not a thread that dies in email." },
      { t: "A next step", c: "Written, dated, owned.", lit: true },
      { t: "A weekly check-in", c: "You set the pace. They don't have to." },
    ],
    note: "You go quiet first, the deal dies. Start the procurement paperwork before the pilot Friday, not after.",
  },

  { kind: "act", n: "04", eyebrow: "Act four", title: "The stall, and the story", art: "mark", c: "Where B2B deals die is the arrow before signed. Where they compound is the paragraph you wrote before the call." },
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
    kind: "walk",
    title: "The pilot, before you offer it",
    steps: [
      {
        t: "Scope",
        c: "one job, one team",
        d: "A design partner is not \"try the product.\" It is one workflow, one team, a start date. Stripe's version was the install — value before anyone left the room.",
      },
      {
        t: "Success",
        c: "a number you both say",
        d: "What would make them keep it. Written down. If you cannot name it, you are giving away software and calling it a pilot.",
      },
      {
        t: "Commercial",
        c: "paid, or story rights",
        d: "Amplitude's lesson: free users were the wrong companies. Charge something, or get the logo, the sentence, and the intro in writing. Preferably both.",
      },
      {
        t: "Kill date",
        c: "a Friday on the calendar",
        d: "Length, and what happens if it doesn't work. Decided before the call, not during it. A pilot without an end date is a stalled deal with a nicer name.",
      },
    ],
    note: "One paragraph you could paste into a proposal. That's the homework the guide already asked for.",
  },
  {
    kind: "split",
    title: "Where the deal dies",
    left: { h: "The stall", items: ["The person who can spend isn't on the call", "Security review, nobody owns it", "Your champion left", "Stuck in vendor paperwork"] },
    right: {
      h: "What you do",
      items: ["Name the second human on the first call", "A questionnaire with a name on it", "A written next step, dated", "A price their company can actually pay"],
    },
    note: "If they can't buy it the way they already buy things, the deal dies in paperwork. That is why Evaluation never becomes Decision.",
  },
  {
    kind: "split",
    title: "When they go quiet",
    left: { h: "Don't", items: ["Just checking in", "Another deck", "A fake deadline", "Guilt"] },
    right: {
      h: "Wow them",
      items: ["Ship the thing they asked for", "A sixty-second Loom of it", "A sentence from a company that looks like them", "A feature they can take upstairs"],
    },
    note: "Give them a reason to come back that isn't a calendar invite.",
  },
  {
    kind: "loop",
    title: "Champions → advisors → references",
    label: "compounds",
    steps: [
      { t: "One champion inside one account" },
      { t: "A roadmap preview they can take upstairs" },
      { t: "A quotable customer sentence" },
      { t: "A priced intro — credit on their renewal" },
    ],
    note: "Feed them something they can present as their idea. The next deal is an intro with a price on it, not a favor. Scope, length, and the sentence, decided before the call.",
  },
  {
    kind: "split",
    pair: true,
    title: "Referrals",
    left: { h: "The ask", items: ["Who else has this problem?", "Five names, not a newsletter", "You write the email they forward", "A credit on their next invoice"] },
    right: {
      h: "Why it lands",
      items: ["They already said yes", "The next deal starts warm", "Cheaper than any sequence", "Amplitude's graph was this"],
    },
    note: "Ask after the yes, not in the first email. The intro is a priced ask — a credit, not a favor.",
  },
  {
    kind: "bullets",
    title: "Expansion is a trigger, not a calendar",
    items: [
      { t: "Eighty percent of seats", c: "They're about to hit the wall. That's the ask, not a Q4 reminder." },
      { t: "A feature only in the next tier", c: "They're already using the thing you charge more for. Name it." },
      { t: "Three people every day", c: "One champion is a pilot. Three daily users is a company that will fight to keep it." },
    ],
    note: "You will not have this graph tonight. Write the triggers now so you recognize them when they fire.",
  },
  {
    kind: "matrix",
    title: "A spreadsheet is a fine CRM",
    heads: ["Column", "What \"moved\" means"],
    rows: [
      { t: "Account", cells: ["The company, the person, the trigger"] },
      { t: "Stage", cells: [{ v: "An event, not a feeling", lit: true }] },
      { t: "Last touch", cells: ["Date, and what you sent"] },
      { t: "Next action", cells: ["A verb and a day. Empty means dead."] },
    ],
    note: "In October a judge will ask what moved last week. Receipts are 30% of the score. An anecdote is not a pipeline.",
  },

  {
    kind: "terminal",
    cmd: "/icp-builder",
    out: ["reading the product…", "20 named accounts, 4 filtered out", "wrote 03-b2b/accounts.md"],
    title: "Do this tonight",
    c: "Defines the ICP tight enough to write to, then builds the named account list. Start with the warm room from the survey — then fill the rest. It drafts; you check every row.",
  },
  {
    kind: "terminal",
    cmd: "/outbound-sequence  →  /funnel-metrics",
    out: ["drafting 1 touch + 2 follow-ups", "stages instrumented", "wrote 03-b2b/README.md"],
    title: "Then write the sequence",
    c: "First touch, two follow-ups, and a break-up that doesn't grovel. Then instrument the stages, and add /bi-agent for the weekly read.",
  },
  {
    kind: "news",
    n: "01",
    of: "01",
    eyebrow: "After tonight",
    title: "You can also follow this guide to stand the agents up.",
    src: "Gojiberry · 13 outbound agents in Grok Bot",
    href: "https://x.com/gojiberryai/status/2095081419202560010",
    facts: [
      "They open-sourced the whole outbound team.",
      "Thirteen agents inside Grok Bot. You give the objective.",
      "The thread is the setup. Comment BOT if you want them to send it.",
    ],
  },
  {
    kind: "statement",
    text: "Your first ten will not look like Stripe's graph.",
    note: "They will look like twenty names, a few replies, one pilot paragraph, and a sheet you can read out loud. That's the case you can show in October.",
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
  { kind: "quote", text: "The first ten are a room, not a funnel." },
  {
    kind: "end",
    next: "Unfair Advantage — Wed Sep 16, Workuity Biltmore",
    qr: "session-positioning-and-pitch",
    qrLabel: "Session page",
    c: "Why should anyone pick you over the thing they already use? Value prop, USPs, positioning and the pitch — written live, cut, said out loud, cut again.",
  },
];
