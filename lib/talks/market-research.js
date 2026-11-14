import { ABOUT_SLIDE, JOIN_ROOM_SLIDE, PARTNER_SLIDE, FOUNDER_WEEKEND_SLIDE, COMMUNITY_CLOSE_SLIDE, takeHomeSlide, WORKUITY } from "./shared.js";

const SLUG = "market-research";

const RESEARCH_MD = `# What's for Dinner - RESEARCH.md

Is anyone hungry for this? Fill this in before writing any code. Every claim gets a label:
- [data] a number or fact with a link to where it came from
- [opinion] what one person said, with who said it and where
- [inference] what we think it means, with the evidence it rests on

Never invent a number, a quote or a competitor. If we can't find it, write "unknown".

## 1. The customer and the moment
- Who: [one sentence, specific enough to find five of them this week]
- The moment: [when and where they'd open the app]
- What they do today instead: [takeout, the same three meals, scrolling recipes...]
- What it costs them: [time, money, waste, stress - label each]

## 2. Size of the problem
- How many people are in this moment, and how often: [data] (source)
- What they spend on the alternative: [data] (source)
- Signs it's growing or shrinking: [data] (source)
- Places to look: the BLS American Time Use Survey, USDA food spending data, Google Trends, app store rankings

## 3. Competitors
| App | What it does | Price model | Best review theme | Worst review theme | Link |
|---|---|---|---|---|---|
| [verified name] | | | [opinion] | [opinion] | |

Only apps you opened or found a live store listing for. Note any that shut down.

## 4. What people say
- Top five pains, each with two or more [opinion] quotes and links (Reddit, App Store, X)
- What they've already tried, and why it didn't stick
- Words they use for the problem (use these in the copy later)

## 5. Five interviews
| # | Who | Date | Biggest pain | What they do now | Would they try it? |
|---|---|---|---|---|---|
| 1 | | | | | |

Patterns across the five: [inference], with which interviews support it.

## 6. Decision
Criteria, written before the interviews:
- Go: at least 3 of 5 describe the 6pm problem unprompted, and at least 2 ask to try it
- Pivot: the pain is real but the moment or the customer is different
- Stop: fewer than 2 of 5 feel the pain, or a free app already solves it well

Decision: [go / pivot / stop]
Why: [three lines, each pointing at the evidence above]
What carries into the spec: [user, moment, the one job, what's out of scope]

## Done when
- [ ] The customer and the moment fit in two sentences
- [ ] Every number has a source link
- [ ] Competitors are real, verified apps with links
- [ ] Five interviews are written up
- [ ] Go, pivot or stop, decided against criteria written in advance
`;

const DECK = {
  title: "Market Research",
  includeRoiSlide: false,
  includeShowcaseSlide: false,
  visual: true,
  slides: [
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "swell", dark: true, logo: true, kicker: "SHIP AI TALKS · PART 2", lines: ["Market"], em: "Research", body: "Is anyone hungry for this? Find out before you build." },
    },
    ABOUT_SLIDE,
    JOIN_ROOM_SLIDE,
    PARTNER_SLIDE,
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "voyage", dark: true, kicker: "THE IDEA", lines: ["Building got cheap."], em: "Being wrong didn't." },
    },
    {
      title: "Tonight, the market. Every night stands on its own.",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "BUILD AND HOPE", title: "\"Everyone eats dinner.\"" },
      after: { kicker: "RESEARCH FIRST", title: "Five people. Real sources.", em: "Evidence decides." },
      items: [],
    },
    {
      title: "Tonight",
      layout: "checklist",
      diagram: "result",
      items: [{ title: "Who" }, { title: "Size" }, { title: "Rivals" }, { title: "Decide" }],
    },
    {
      title: "Tonight's example",
      layout: "checklist",
      diagram: "doc",
      doc: {
        file: "RESEARCH.md",
        sections: [
          { h: "The moment", lit: true, lines: ["6pm, the fridge is open, nothing looks like dinner."] },
          { h: "Evidence", lines: ["[data] with a link, [opinion] with a name, [inference] with a reason."] },
          { h: "Done when", lines: ["[ ] Every number has a source", "[ ] Five interviews written up", "[ ] Go, pivot or stop, against criteria"] },
        ],
      },
    },
    {
      title: "Name the customer and the moment",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "claude", text: "\"People who cook\" is everyone. Who exactly?" }, { who: "you", text: "Two working parents, home at 6, tired." }, { who: "claude", text: "What do they do tonight instead?" }, { who: "out", text: "✓ RESEARCH.md: section 1" }] },
      promptLabel: "Copy · the customer interview",
      prompt: "We're researching What's for Dinner before building it: type what's in your fridge, get three dinners you can make tonight. Help me define who it's for.\n\nInterview me one question at a time and wait for each answer. Cover: who exactly the customer is, the moment they'd open the app, what they do today instead, and what that costs them in time, money or waste. Push back when an answer is so broad it describes everyone.\n\nThen create RESEARCH.md with these sections: The customer and the moment, Size of the problem, Competitors, What people say, Five interviews, Decision, Done when. Fill in only the first section, in my words.\n\nLabel every claim [data], [opinion] or [inference]. Everything I tell you tonight is [opinion] or [inference] until we find a source. Stop and wait for my OK.",
      promptPreview: "Interview me until the customer and the moment fit in two sentences, then start RESEARCH.md with every claim labeled. Wait for my OK.",
    },
    {
      title: "Size it with real sources",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "out", text: "→ Searching bls.gov/tus, USDA, Google Trends" }, { who: "out", text: "✓ 4 figures, each with a link [data]" }, { who: "claude", text: "No source for weekly takeout spend. Marked unknown." }] },
      promptLabel: "Copy · size the problem",
      prompt: "Read RESEARCH.md. Fill in Size of the problem using web search and web fetch.\n\nFind real, citable figures for: how many people are in the moment we described and how often, what they spend on the alternative (takeout, delivery, food waste), and whether the trend is growing or shrinking. Start with primary sources like the BLS American Time Use Survey (bls.gov/tus) and USDA food spending data, then Google Trends.\n\nRules:\n- Open every page you cite and quote the exact figure with its year and link.\n- Never invent or estimate a number and present it as data. If you can't find it, write \"unknown\".\n- Label each line [data], [opinion] or [inference]. Any math you do on sourced numbers is [inference]; show the formula.\n\nStop when the section is done and list what's still unknown.",
      promptPreview: "Fill in Size of the problem from real sources like BLS and USDA. Quote each figure with its link. Never invent a number; write unknown.",
      takeaway: "bls.gov/tus",
    },
    {
      title: "Tear down the competition",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "out", text: "✓ SuperCook: recipes from what you have [data]" }, { who: "out", text: "✓ Samsung Food, formerly Whisk [data]" }, { who: "claude", text: "Both search recipes. Neither picks three for tonight. [inference]" }] },
      promptLabel: "Copy · the competitor teardown",
      prompt: "Read RESEARCH.md. Fill in Competitors.\n\n1. Use web search to find apps and sites that suggest meals from ingredients you already have, plus the closest alternatives (meal planners, AI recipe generators).\n2. Only include a competitor if you opened its website or found its live App Store or Google Play listing. Never list an app from memory. Note any that have shut down, with a source.\n3. For each: what it does, the price model as shown on its own site (or \"unknown\"), the most common praise and complaint in its reviews, and the link.\n4. Below the table, write three [inference] lines: where What's for Dinner is different, where it's the same, and the strongest reason someone wouldn't switch.\n\nStop and show me the table before writing the inferences.",
      promptPreview: "Find real competitors, verify each one has a live site or store listing, fill in the table with links, then show me before drawing conclusions.",
    },
    {
      title: "Label the evidence",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "WHAT IT SOUNDS LIKE", title: "\"Millions of people hate cooking.\"" },
      after: { kicker: "WHAT YOU WRITE", title: "[data] with a link, or unknown.", em: "Never invent a number." },
      items: [],
    },
    {
      title: "Mine reviews and forums",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "out", text: "→ App Store reviews read · Reddit blocked, you pasted 3 threads" }, { who: "out", text: "✓ 5 pains, each with two quotes and links" }, { who: "claude", text: "Most common: \"I have food but no ideas.\"" }] },
      promptLabel: "Copy · mine the reviews",
      prompt: "Read RESEARCH.md. Fill in What people say.\n\n1. Use web search and web fetch to read public Reddit threads (for example r/Cooking and r/EatCheapAndHealthy) and the App Store and Google Play reviews of the competitors in our table. Look for people describing the 6pm \"what's for dinner\" problem in their own words.\n2. Group what you find into the top five pains. For each, give two or more short quotes, each labeled [opinion] with a link to where it was posted. Quote exactly; never paraphrase into quotation marks, and never make up a quote.\n3. Note what people have already tried and why it didn't stick, and the words they use for the problem.\n\nKeep quotes under 25 words and leave out usernames.\n\nReddit and some review sites block automated fetching. If a site blocks you, stop and tell me which links you couldn't open, and ask me to paste the thread text. Never fill a quote or a pain from memory or from search snippets you didn't open. Stop when the section is done.",
      promptPreview: "Read Reddit threads and competitor reviews, group the top five pains, back each with two exact, linked quotes. Blocked? Ask me to paste.",
      takeaway: "reddit.com/r/Cooking",
    },
    {
      title: "Talk to five people",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "out", text: "✓ interview-script.md: 8 questions, no pitch" }, { who: "you", text: "[ pastes five sets of notes ]" }, { who: "out", text: "✓ 4 of 5 described the 6pm problem unprompted" }] },
      promptLabel: "Copy · the interview script",
      prompt: "Read RESEARCH.md. Help me run five customer interviews.\n\n1. Write interview-script.md: a 15-minute script with about eight open questions about the last time they decided what to make for dinner. Ask about past behavior, not opinions about the future. No pitching the app until the last question. Include a one-line consent ask for taking notes.\n2. Before I start, add Go, Pivot and Stop criteria to the Decision section of RESEARCH.md, and wait for my OK on them. We set the bar before we see the answers.\n3. Stop. I'll run the interviews myself. Wait until I tell you they're done and paste in my notes.\n4. Then fill in Five interviews: one row per person, no full names, and the patterns across all five, each labeled [inference] with the interviews that support it.",
      promptPreview: "Write a 15-minute interview script, set go/pivot/stop criteria first, then wait for my notes from five interviews and write them up.",
      takeaway: "granola.ai",
    },
    {
      title: "Go, pivot or stop",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "claude", text: "Go: 4 of 5 felt it, 3 asked to try it." }, { who: "claude", text: "Pivot note: parents, not students." }, { who: "out", text: "✓ RESEARCH.md: Decision" }] },
      promptLabel: "Copy · make the call",
      prompt: "Read RESEARCH.md. Make the call.\n\n1. Check the evidence against the Go, Pivot and Stop criteria we wrote before the interviews. Don't change the criteria now.\n2. Recommend go, pivot or stop in one line, then three lines of reasons, each pointing at a specific labeled item in RESEARCH.md.\n3. List the weakest evidence behind the recommendation and what would change your mind.\n4. If it's go or pivot, write What carries into the spec: the user, the moment, the one job, and three things that are out of scope.\n\nThe decision is mine. Stop and wait for me to accept or change it, then tick off the Done when list.",
      promptPreview: "Check the evidence against the criteria we set first, recommend go, pivot or stop with reasons, and list what carries into the spec.",
    },
    {
      title: "",
      layout: "checklist",
      tone: "bonus",
      diagram: "stage",
      stage: { scene: "harbor", dark: true, kicker: "BONUS ROUND", lines: ["Time on the clock?"], em: "Ask Grok on X." },
    },
    {
      title: "Real-time sentiment, labeled",
      layout: "checklist",
      tone: "bonus",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "you", text: "[ pastes Grok's answer with post links ]" }, { who: "you", text: "Opened all 12 myself. 9 real, 3 dead." }, { who: "out", text: "✓ Added 9 [opinion] lines from X" }] },
      promptLabel: "Copy · the X sentiment check",
      prompt: "Three steps: Grok, then your browser, then Claude Code.\n\n1. In Grok (grok.com or the X app), ask:\nSearch recent posts on X where people complain about deciding what to make for dinner, or about recipe and meal-idea apps. Give me 12 posts with the exact text, the date and a link to each. Don't summarize until you've listed them.\n\n2. X needs a login, so Claude Code can't open these links. Open each one yourself and note which posts exist and match the quoted text.\n\n3. Paste Grok's answer into Claude Code with this prompt:\nRead RESEARCH.md. Here are posts from X found with Grok. I opened each link myself; below the list I've marked which are real and match the quoted text. Add only the ones I marked real to What people say as [opinion] lines with links, no usernames, and note how many I couldn't confirm. Don't try to fetch x.com, and never add a post I didn't confirm. Then say in one [inference] line whether X agrees with the interviews.",
      promptPreview: "Ask Grok on X for recent posts with links, open each one yourself, then tell Claude Code which are real before it adds them.",
      promptDestination: "Grok first, then Claude Code",
      takeaway: "Also in the series · Part 3: Build the MVP",
    },
    takeHomeSlide(SLUG),
    FOUNDER_WEEKEND_SLIDE,
    COMMUNITY_CLOSE_SLIDE,
  ],
};

export const TALK = {
  slug: SLUG,
  series: 2,
  eventTitle: "Market Research",
  key: "Research",
  summary: "Is anyone hungry for this? Find out before you build.",
  copy: "Tonight Claude Code researches the market with real sources, real reviews and five real interviews, and we decide go, pivot or stop before writing a line of code.",
  ...WORKUITY,
  rsvp: [],
  steps: [
    { title: "Who", body: "One customer, one moment, in two sentences." },
    { title: "Size", body: "Real sources for every number, or unknown." },
    { title: "Rivals", body: "Verified competitors, reviews and forum pains." },
    { title: "Decide", body: "Five interviews, then go, pivot or stop." },
  ],
  stepsLede: "Twenty minutes of AI news, then Claude Code researches What's for Dinner on screen, then five-minute demos from the room.",
  closing: ["Bring an idea.", "Leave with evidence."],
  example: {
    name: "What's for Dinner",
    heading: ["Tonight's", "research."],
    lede: "The research brief we fill in on the night. Every claim is labeled, every number has a link, and the decision is made against criteria set in advance.",
    file: "RESEARCH.md",
    pitch: "Before building an app that turns your fridge into dinner, find out who has the problem, how big it is and who already solves it.",
    jobLabel: "The question",
    job: "Is anyone hungry for What's for Dinner?",
    stack: ["Claude Code", "Web search", "Grok on X", "Reddit", "App Store reviews", "Granola"],
    doneLabel: "Done when",
    done: [
      "The customer and the moment fit in two sentences",
      "Every number has a source link",
      "Competitors are real, verified apps",
      "Five interviews are written up",
      "Go, pivot or stop, against criteria set first",
    ],
    spec: RESEARCH_MD,
    specLabel: "The full RESEARCH.md",
    specDestination: "a RESEARCH.md file",
  },
  toolsLede: "Where the evidence comes from, one job each. Claude Code reads and writes it up; you make the call.",
  tools: [
    { name: "Claude Code", job: "Web search and fetch, the interviews, the write-up", cmd: "curl -fsSL https://claude.ai/install.sh | bash", href: "https://code.claude.com/docs/en/setup" },
    { name: "Grok", job: "Real-time sentiment from posts on X", cmd: "grok.com", href: "https://grok.com" },
    { name: "American Time Use Survey", job: "Primary data on time spent cooking and eating", cmd: "bls.gov/tus", href: "https://www.bls.gov/tus/" },
    { name: "Google Trends", job: "Is the search interest growing or shrinking?", cmd: "trends.google.com", href: "https://trends.google.com" },
    { name: "Reddit", job: "People describing the problem in their own words", cmd: "reddit.com/r/Cooking", href: "https://www.reddit.com/r/Cooking/" },
    { name: "Granola", job: "Notes for the five interviews, no bot in the call", cmd: "granola.ai", href: "https://www.granola.ai" },
    { name: "Twenty", job: "Track who you interviewed, from Part 1's pipeline", cmd: "twenty.com", href: "https://twenty.com" },
  ],
  deck: DECK,
};
