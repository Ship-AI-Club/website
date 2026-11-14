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
| # | Who | Date | Biggest pain | What they do now | Would they try it? | Would they pay the draft price? |
|---|---|---|---|---|---|---|
| 1 | | | | | | |

Patterns across the five: [inference], with which interviews support it.

## 6. Money
Who pays, how, at what price, and does the margin hold? Fill this in before the interviews, so the draft price gets tested in them. Every number is [data] with a link and the date you read it, or [assumption] to replace later.

### Pricing model
How people get value: [how often they'd use it, e.g. most weeknights, or a few times a month]

| Model | Fits how they get value? | Protects the margin? |
|---|---|---|
| Subscription with a monthly allowance | | |
| Credits or packs | | |
| Freemium: a free limit, then a plan | | |
| One-time purchase | | |

Pick: [model], because [one line pointing at the evidence above]

### Competitor pricing
| App | Plan | Price (as shown) | What it charges for | Free limit | Link | Date checked |
|---|---|---|---|---|---|---|
| [verified name] | | | | | | |

Only prices read on the app's own pricing page or live store listing. "Unknown" is a fine answer.

### Cost per dinner request
Formula: cost per request = (input tokens x input rate + output tokens x output rate) / 1,000,000 x retry factor

| Assumption | Value | Source |
|---|---|---|
| Input tokens per request (instructions + ingredients) | 800 | [assumption], replace with the measured average once the MVP logs real calls |
| Output tokens per request (three recipes) | 900 | [assumption], same |
| Retry factor | 1.25 | [assumption] |
| Model rate per 1M tokens, in / out | $3.00 / $15.00 | [assumption], replace with your model's rate from vercel.com/ai-gateway/models and the date you read it |
| Hosting + database per paying user, per month | $0.25 | [assumption] |
| Hosting + database per free user, per month | $0.10 | [assumption] |
| Card fee | 2.9% + $0.30 | stripe.com/pricing, US domestic cards, read Nov 2026 |
| Stripe Billing fee | 0.7% of Billing volume | stripe.com/pricing, pay as you go, read Nov 2026 |
| Draft price | $5 / month | [assumption], the price we test in the interviews |
| Free limit | 10 requests / month | [assumption] |
| Fair-use cap on the plan | 60 requests / month | [assumption], about two a night |

Cost per request = (800 x $3.00 + 900 x $15.00) / 1,000,000 x 1.25 = $0.0199

### Margin at the draft price
Formulas:
- AI cost = requests x $0.0199
- Fees = price x 2.9% + $0.30 + price x 0.7% = $0.48 on $5
- Gross profit = price - AI cost - hosting - fees
- Margin = gross profit / price

| User | Requests / month | Revenue | AI cost | Hosting | Fees | Gross profit | Margin |
|---|---|---|---|---|---|---|---|
| Typical | 20 | $5.00 | $0.40 | $0.25 | $0.48 | $3.87 | 77.4% |
| Heavy, at the cap | 60 | $5.00 | $1.19 | $0.25 | $0.48 | $3.08 | 61.6% |
| Heavy, no cap | 300 | $5.00 | $5.97 | $0.25 | $0.48 | -$1.70 | -34.0% |
| Free, at the limit | 10 | $0.00 | $0.20 | $0.10 | $0.00 | -$0.30 | - |

Target: 70% or better. Any row under it gets a lower cap, a cheaper model or a new price. Fix chosen: [which one, and why]
The free tier costs $0.30 per free user a month at the limit. Count it as a cost of getting customers.

### Limits
- Free limit: [10 requests a month], then a friendly message, never an error
- Fair-use cap: [60 a month], checked on the server, not only in the UI
- Track AI calls per user from day one, so every assumption above gets replaced with a real number

### Willingness to pay
From the five interviews, in their words:

| # | What they spend on the alternative now | Reaction to the draft price | Would pay? |
|---|---|---|---|
| 1 | | | yes / no / maybe |

- [inference] The price that holds up, and how many of the five support it:

## 7. Decision
Criteria, written before the interviews:
- Go: at least 3 of 5 describe the 6pm problem unprompted, at least 2 ask to try it, and at least 2 of 5 say they'd pay the draft price
- Pivot: the pain is real but the moment, the customer or the price is different
- Stop: fewer than 2 of 5 feel the pain, a free app already solves it well, or no price that 2 of 5 would pay keeps every capped row at 70% margin or better

Decision: [go / pivot / stop]
Why: [three lines, each pointing at the evidence above]
What carries into the spec: [user, moment, the one job, what's out of scope, the pricing model, the free limit, and "track AI calls per user from day one"]

## Done when
- [ ] The customer and the moment fit in two sentences
- [ ] Every number has a source link
- [ ] Competitors are real, verified apps with links
- [ ] Competitor prices are cited with a link and a date
- [ ] Cost per request and the margin table are worked from labeled assumptions
- [ ] Five interviews are written up, each with a reaction to the draft price
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
      stage: { scene: "swell", dark: true, logo: true, kicker: "CLAUDE CODE BUILD NIGHT · PART 2", lines: ["Market"], em: "Research", body: "Is anyone hungry for this, and will they pay? Find out before you build." },
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
      title: "Tonight, the market and the money",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "BUILD AND HOPE", title: "\"Everyone eats dinner.\"" },
      after: { kicker: "RESEARCH FIRST", title: "Five people. Real sources. A draft price.", em: "Evidence decides." },
      items: [],
    },
    {
      title: "Tonight",
      layout: "checklist",
      diagram: "result",
      items: [{ title: "Research" }, { title: "Price" }, { title: "Interview" }, { title: "Decide" }],
    },
    {
      title: "Tonight's example",
      layout: "checklist",
      diagram: "doc",
      doc: {
        file: "RESEARCH.md",
        sections: [
          { h: "The moment", lit: true, lines: ["6pm, the fridge is open, nothing looks like dinner."] },
          { h: "Money", lines: ["Cost per dinner, a draft price, the margin."] },
          { h: "Done when", lines: ["[ ] Every number has a source", "[ ] 2 of 5 would pay", "[ ] Go, pivot or stop"] },
        ],
      },
    },
    {
      title: "Name the customer and the moment",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "claude", text: "\"People who cook\" is everyone. Who exactly?" }, { who: "you", text: "Two working parents, home at 6, tired." }, { who: "claude", text: "What do they do tonight instead?" }, { who: "out", text: "✓ RESEARCH.md: section 1" }] },
      promptLabel: "Copy · the customer interview",
      prompt: "We're researching What's for Dinner before building it: type what's in your fridge, get three dinners you can make tonight. Help me define who it's for.\n\nInterview me one question at a time and wait for each answer. Cover: who exactly the customer is, the moment they'd open the app, what they do today instead, and what that costs them in time, money or waste. Push back when an answer is so broad it describes everyone.\n\nThen create RESEARCH.md with these sections: The customer and the moment, Size of the problem, Competitors, What people say, Five interviews, Money, Decision, Done when. Fill in only the first section, in my words.\n\nLabel every claim [data], [opinion] or [inference]. Everything I tell you tonight is [opinion] or [inference] until we find a source. Stop and wait for my OK.",
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
      title: "Price before you build",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "PRICE LATER", title: "\"We'll add pricing once people love it.\"" },
      after: { kicker: "PRICE FIRST", title: "Cost per dinner, a draft price, a free limit.", em: "Then ask five people." },
      items: [],
    },
    {
      title: "Charge the way they get value",
      layout: "checklist",
      diagram: "skills",
      hub: "How do they get value?",
      hubCaption: "Charge for the\nsame unit",
      hubNote: "Then check it\nagainst the cost",
      items: [
        { title: "Most weeknights", body: "Subscription with a monthly allowance." },
        { title: "Now and then", body: "Credits or packs." },
        { title: "Try it first", body: "Freemium: a free limit, then a plan." },
      ],
    },
    {
      title: "Work out the money",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "out", text: "→ 6 pricing pages opened, 1 hides prices" }, { who: "out", text: "✓ $0.0199 per dinner, from stated assumptions" }, { who: "claude", text: "Heavy user at the cap: 61.6%. Under 70%." }] },
      promptLabel: "Copy · price it before you build",
      prompt: "Read RESEARCH.md. Fill in the Money section. Nothing is built yet, so every number is [data] with a link and today's date, or [assumption]. Never present an assumption as data.\n\n1. Pricing model: ask me how often our customer would use the app, one question at a time. Compare subscription with an allowance, credits, freemium and one-time purchase in the table, recommend one in two lines, and wait for my OK.\n2. Competitor pricing: open the pricing page or live store listing of every app in our Competitors table with web fetch. Record only what the page says today: plan, price, what it charges for, free limit, link and date. If a page hides prices or won't load, write \"unknown\". Never fill in a price from memory or a search snippet.\n3. Cost per dinner request: start from these assumptions and label each one: 800 input tokens, 900 output tokens, retry factor 1.25. Stop and ask me for our model's input and output rates per million tokens. I'll read them on vercel.com/ai-gateway/models and paste them; wait until I tell you it's done. Never use a rate from memory. Then show the math: (input tokens x input rate + output tokens x output rate) / 1,000,000 x retry factor.\n4. Ask me for a draft price, a free limit and a fair-use cap. Open stripe.com/pricing and quote the card fee and the Billing fee with today's date. Ask me for hosting per paying and per free user, or mark them as guesses.\n5. Build the margin table at the draft price: a typical user, a heavy user at the cap, a heavy user with no cap, and a free user at the limit. Write each formula once above the table, and round so every row adds up as shown.\n\nStop and flag any capped row under 70% margin, with three fixes: a lower cap, a cheaper model or a new price. The choice is mine.",
      promptPreview: "Pick a pricing model, read real competitor pricing pages, wait for my model rates, then work out cost per dinner and the margin table.",
      takeaway: "vercel.com/ai-gateway/models",
    },
    {
      title: "Talk to five people",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "out", text: "✓ interview-script.md: 8 questions, no pitch" }, { who: "you", text: "[ pastes five sets of notes ]" }, { who: "out", text: "✓ 4 of 5 felt the 6pm problem · 2 would pay $5" }] },
      promptLabel: "Copy · the interview script",
      prompt: "Read RESEARCH.md. Help me run five customer interviews.\n\n1. Write interview-script.md: a 15-minute script with about eight open questions about the last time they decided what to make for dinner. Ask about past behavior, not opinions about the future. No pitching the app until the last two questions. Include a one-line consent ask for taking notes.\n2. Add one question about money in the middle: what they spent on dinner the last time they gave up and ordered in. Then end with a willingness-to-pay question: describe the app in one line, say the draft price from the Money section, and ask \"Would you pay that? What would make it a no?\" Tell me to write down their exact words.\n3. Before I start, add Go, Pivot and Stop criteria to the Decision section of RESEARCH.md, including how many of five must say they'd pay the draft price, and wait for my OK on them. We set the bar before we see the answers.\n4. Stop. I'll run the interviews myself. Wait until I tell you it's done and I've pasted in my notes.\n5. Then fill in Five interviews and the Willingness to pay table: one row per person, no full names, exact words for the price reaction, and the patterns across all five, each labeled [inference] with the interviews that support it.",
      promptPreview: "Write a 15-minute script that ends with a willingness-to-pay question, set go/pivot/stop criteria first, then write up my five interviews.",
      takeaway: "granola.ai",
    },
    {
      title: "Go, pivot or stop",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "claude", text: "Go: 4 of 5 felt it, 2 would pay $5." }, { who: "claude", text: "Freemium: 10 free, then $5 a month." }, { who: "out", text: "✓ RESEARCH.md: Decision" }] },
      promptLabel: "Copy · make the call",
      prompt: "Read RESEARCH.md. Make the call.\n\n1. Check the evidence against the Go, Pivot and Stop criteria we wrote before the interviews. Don't change the criteria now.\n2. Recommend go, pivot or stop in one line, then three lines of reasons, each pointing at a specific labeled item in RESEARCH.md.\n3. List the weakest evidence behind the recommendation and what would change your mind.\n4. If it's go or pivot, write What carries into the spec: the user, the moment, the one job, three things that are out of scope, the pricing model, the free limit and the fair-use cap, and the line \"track AI calls per user from day one\".\n\nThe decision is mine. Stop and wait for me to accept or change it, then tick off the Done when list.",
      promptPreview: "Check demand and willingness to pay against the criteria set first, recommend go, pivot or stop, and carry the price into the spec.",
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
  summary: "Is anyone hungry for this, and will they pay? Find out before you build.",
  copy: "Tonight Claude Code researches the market with real sources, reviews and pricing pages, and works out what one dinner costs and what it could charge. Five real interviews test the pain and the price, and we decide go, pivot or stop before writing a line of code.",
  ...WORKUITY,
  rsvp: [],
  steps: [
    { title: "Research", body: "The customer, the size and verified competitors, every number sourced." },
    { title: "Price", body: "A pricing model, cost per dinner and the margin at a draft price." },
    { title: "Interview", body: "Five people on the pain and on the price." },
    { title: "Decide", body: "Go, pivot or stop, against criteria set first." },
  ],
  stepsLede: "Twenty minutes of AI news, then Claude Code researches What's for Dinner on screen, then five-minute demos from the room.",
  closing: ["Bring an idea.", "Leave with evidence and a price."],
  example: {
    name: "What's for Dinner",
    heading: ["Tonight's", "research."],
    lede: "The research brief we fill in on the night. Every claim is labeled, every number has a link or is a stated assumption, the margin is worked out at a draft price, and the decision is made against criteria set in advance.",
    file: "RESEARCH.md",
    pitch: "Before building an app that turns your fridge into dinner, find out who has the problem, who already solves it, what one dinner costs us to make, and whether people would pay enough to cover it.",
    jobLabel: "The question",
    job: "Is anyone hungry for What's for Dinner, and will they pay for it?",
    stack: ["Claude Code", "Web search", "Grok on X", "Reddit", "App Store reviews", "AI Gateway model list", "Granola"],
    doneLabel: "Done when",
    done: [
      "The customer and the moment fit in two sentences",
      "Every number and competitor price has a source link",
      "Cost per dinner and the margin are worked from stated assumptions",
      "Five interviews are written up, with what they'd pay",
      "Go, pivot or stop, against criteria set first",
    ],
    spec: RESEARCH_MD,
    specLabel: "The full RESEARCH.md",
    specDestination: "a RESEARCH.md file",
  },
  toolsLede: "Where the evidence and the numbers come from, one job each. Claude Code reads and writes it up; you make the call.",
  tools: [
    { name: "Claude Code", job: "Web search and fetch, the interviews, the write-up", cmd: "curl -fsSL https://claude.ai/install.sh | bash", href: "https://code.claude.com/docs/en/setup" },
    { name: "Grok", job: "Real-time sentiment from posts on X", cmd: "grok.com", href: "https://grok.com" },
    { name: "American Time Use Survey", job: "Primary data on time spent cooking and eating", cmd: "bls.gov/tus", href: "https://www.bls.gov/tus/" },
    { name: "Google Trends", job: "Is the search interest growing or shrinking?", cmd: "trends.google.com", href: "https://trends.google.com" },
    { name: "Reddit", job: "People describing the problem in their own words", cmd: "reddit.com/r/Cooking", href: "https://www.reddit.com/r/Cooking/" },
    { name: "Granola", job: "Notes for the five interviews, no bot in the call", cmd: "granola.ai", href: "https://www.granola.ai" },
    { name: "Vercel AI Gateway", job: "Model rates per million tokens for the cost math", cmd: "vercel.com/ai-gateway/models", href: "https://vercel.com/ai-gateway/models" },
    { name: "Twenty", job: "Track who you interviewed", cmd: "twenty.com", href: "https://twenty.com" },
  ],
  deck: DECK,
};
