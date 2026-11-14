import { ABOUT_SLIDE, JOIN_ROOM_SLIDE, PARTNER_SLIDE, FOUNDER_WEEKEND_SLIDE, COMMUNITY_CLOSE_SLIDE, takeHomeSlide, WORKUITY } from "./shared.js";

const SLUG = "company-stack";

const STACK_MD = `# What's for Dinner - STACK.md

The company behind the app, set up in the order a founder actually needs it. Claude Code drafts the checklists, plans and templates. You do every signup, payment, signature and legal acceptance yourself.

This is a checklist, not legal or tax advice. Bring the questions to a lawyer or accountant when the answer matters.

## 1. Legal and money

### Stable - business address (usestable.com)
- [ ] Pick the address you'll use on formation, banking and tax forms (keeps your home address private)
- [ ] Turn on mail scanning and decide who gets the scans
- Ask: Can this address be used for the IRS, my bank and my state filings?

### Stripe Atlas - incorporation (stripe.com/atlas)
- [ ] Decide the legal name, plus two backups
- [ ] Decide C corporation or LLC (Atlas offers both; ask an advisor which fits)
- [ ] List founders, ownership split, vesting period, cliff and start date
- [ ] Have a US address and phone number ready for the tax ID (EIN) step
- Ask: Who files the 83(b) election, by when, and how do I get proof it was filed?
- Ask: What do I file every year to stay in good standing?

### Mercury - banking (mercury.com)
- [ ] Apply from the Atlas dashboard perks if you want to apply before the EIN arrives
- [ ] Two accounts: operating and tax set-aside
- [ ] Debit cards per person, with limits
- Ask: Who else needs access, and at what permission level?

### Carta - cap table (carta.com)
- [ ] Enter founder shares exactly as the Atlas documents say
- [ ] Upload the signed stock purchase agreements
- Ask: What changes when we sign our first SAFE?

## 2. Identity and comms

### Google Workspace - email and calendar (workspace.google.com)
- [ ] Buy or connect the domain
- [ ] Add the DNS records Google's admin console shows you (MX, SPF, DKIM, DMARC)
- [ ] Founder inboxes, plus groups: hello@, support@, billing@
- [ ] One shared calendar for customer calls

### 1Password - shared secrets (1password.com)
- [ ] Vaults: Founders, Banking and Legal, Engineering, Vendors, Social
- [ ] Every account in this file gets an item, with 2FA turned on
- [ ] Recovery: a second admin who can get back in if you can't

### Quo - business phone, formerly OpenPhone (quo.com)
- [ ] One business number, shared by the founders
- [ ] Greeting and business hours
- [ ] Text replies for the three questions people will ask

### Slack - team chat (slack.com)
- [ ] Channels: #general, #build, #customers, #research, #alerts, #random
- [ ] Alerts from Vercel and the CRM go to #alerts, never #general

### Notion - docs and wiki (notion.com)
- [ ] Home, Company, Product, Research, Customers, Ops, Decisions
- [ ] Paste this file into Ops and check items off there

## 3. Build and sell

### Vercel - hosting (vercel.com)
- [ ] A team for the company, not your personal account
- [ ] Connect the domain; the app arrives in Part 3

### Twenty - CRM (twenty.com)
- [ ] Opportunity stages: Found, Contacted, Interview booked, Interviewed, Beta tester, Paying
- [ ] Import companies.csv first, then people.csv
- [ ] Every interview from Part 2 gets a record
- [ ] Deals live in Opportunities; Part 6 adds an Outreach stage field on People for creators

## 4. AI helpers

### Granola - meeting notes (granola.ai)
- [ ] Use it for customer calls; tell people you're taking AI notes
- [ ] Share notes to the Customers space in Notion

### Grok Bot - an AI teammate on a cloud computer (x.ai/bot)
- [ ] Connect Gmail, Google Calendar, Slack, Notion and Granola only after the rest is set up
- [ ] One weekly routine: drafts the founder update for your approval (check your plan includes routines)

## Done when
- [ ] The company exists, with its tax ID
- [ ] Money lands in the company bank account, not yours
- [ ] hello@ reaches both founders, and the phone number rings
- [ ] Every login lives in 1Password with 2FA
- [ ] The CRM has a pipeline ready for the first five interviews
`;

const DECK = {
  title: "Company Stack",
  includeRoiSlide: false,
  includeShowcaseSlide: false,
  visual: true,
  slides: [
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "slipway", dark: true, logo: true, kicker: "SHIP AI TALKS · PART 1", lines: ["Company"], em: "Stack", body: "Form the company. Set up its tools. Start it in one night." },
    },
    ABOUT_SLIDE,
    JOIN_ROOM_SLIDE,
    PARTNER_SLIDE,
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "workbench", dark: true, kicker: "THE IDEA", lines: ["Set up the company once."], em: "Then build on it." },
    },
    {
      title: "Before the first line of code",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "LATER, SOMEHOW", title: "\"I'll sort the company out later.\"" },
      after: { kicker: "ONE CHECKLIST", title: "Thirteen tools, in order.", em: "Claude drafts. You sign." },
      items: [],
    },
    {
      title: "Tonight",
      layout: "checklist",
      diagram: "result",
      items: [{ title: "Legal" }, { title: "Comms" }, { title: "Sell" }, { title: "Helpers" }],
    },
    {
      title: "The stack, in order",
      layout: "checklist",
      diagram: "logos",
      groups: [
        { label: "Legal and money", items: [{ name: "Stable" }, { name: "Stripe Atlas", icon: "siStripe" }, { name: "Mercury" }, { name: "Carta" }] },
        { label: "Identity and comms", items: [{ name: "Google Workspace", icon: "siGoogle" }, { name: "1Password", icon: "si1password" }, { name: "Quo" }, { name: "Slack" }, { name: "Notion", icon: "siNotion" }] },
        { label: "Build and sell", items: [{ name: "Vercel", icon: "siVercel" }, { name: "Twenty", icon: "siTwenty" }] },
        { label: "AI helpers", items: [{ name: "Granola" }, { name: "Grok Bot", icon: "grok" }] },
      ],
    },
    {
      title: "Prepare the paperwork",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner-co", lines: [{ who: "claude", text: "Two founders. What's the split and the vesting?" }, { who: "you", text: "50/50, four years, one-year cliff." }, { who: "out", text: "✓ Wrote atlas-prep.md: 14 items, 9 questions" }, { who: "claude", text: "Your turn: sign up at stripe.com/atlas." }] },
      promptLabel: "Copy · legal and money prep",
      prompt: "We're forming the company behind What's for Dinner, a phone app that turns what's in your fridge into three dinners you can make tonight. Help me prepare. You are not a lawyer or accountant: write checklists and questions, never advice.\n\nInterview me one question at a time and wait for each answer: company name and two backups, founders and ownership split, vesting period, cliff and start date, the state I live in, and whether I have a US address and phone number for the tax ID.\n\nThen write atlas-prep.md with four sections in this order:\n1. Stable (business address): what to decide before signing up.\n2. Stripe Atlas (incorporation): everything Atlas will ask me for, as checkboxes, plus questions to ask an advisor, including C corporation or LLC, who files the 83(b) election and by when, and what I file each year to stay in good standing.\n3. Mercury (banking): what to have ready, which accounts to open, and who gets access.\n4. Carta (cap table): what to enter from the Atlas documents.\n\nCheck each product's current website before you write about it, and leave out anything you can't confirm. No prices.\n\nStop there. I do every signup, payment and signature myself. Wait until I tell you it's done.",
      promptPreview: "Interview me about founders, split and vesting, then write atlas-prep.md: checklists and advisor questions for Stable, Stripe Atlas, Mercury and Carta. I do the signups.",
      takeaway: "stripe.com/atlas",
    },
    {
      title: "One vault per job",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner-co", lines: [{ who: "out", text: "✓ 5 vaults: Founders, Banking and Legal, Engineering, Vendors, Social" }, { who: "out", text: "✓ Wrote vaults.sh for you to run" }, { who: "claude", text: "I never see a password. You run the script." }] },
      promptLabel: "Copy · the 1Password plan",
      prompt: "Read atlas-prep.md. Design a 1Password setup for this company.\n\n1. Propose vaults by job (for example Founders, Banking and Legal, Engineering, Vendors, Social), who can see each one, and which accounts from atlas-prep.md go where. Include a recovery plan: who the second admin is. Wait for my OK.\n2. Tell me to install the 1Password CLI myself with brew install 1password-cli, turn on the CLI integration in the 1Password app, and confirm with op --version. Wait until I tell you it's done.\n3. Write vaults.sh with one op vault create command per vault, and show it to me. Don't run it; I'll run it myself.\n\nNever ask me for a password, recovery code or secret, and never put one in a file.",
      promptPreview: "Propose 1Password vaults by job with a recovery plan, wait while I install the CLI, then write vaults.sh for me to run. Never touch a secret.",
      takeaway: "1password.dev/cli",
    },
    {
      title: "Who holds the pen",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "CLAUDE CODE", title: "Checklists, plans, templates." },
      after: { kicker: "YOU", title: "Signups, payments, signatures.", em: "Never hand over the pen." },
      items: [],
    },
    {
      title: "Email, phone and chat",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner-co", lines: [{ who: "out", text: "✓ hello@, support@, billing@ as Google groups" }, { who: "out", text: "✓ Quo greeting and three text replies" }, { who: "out", text: "✓ Slack: 6 channels, alerts kept out of #general" }] },
      promptLabel: "Copy · the comms plan",
      prompt: "Read atlas-prep.md. Write comms.md with three sections, then stop and wait for my review.\n\n1. Google Workspace: the founder inboxes, the groups (hello@, support@, billing@) and who is in each, and a checklist for the DNS step. Don't invent DNS values; tell me to copy the exact MX, SPF, DKIM and DMARC records Google's admin console shows me.\n2. Quo (the business phone, formerly OpenPhone): who shares the number, business hours, a 20-second greeting for What's for Dinner, and short text replies to the three questions a new user is most likely to ask.\n3. Slack: a channel plan with a one-line purpose for each channel (general, build, customers, research, alerts, random), and which tools post where.\n\nI'll do the signups, domain purchase and DNS changes myself.",
      promptPreview: "Write comms.md: Google Workspace inboxes and groups, a Quo greeting and text replies, and a Slack channel plan. I do the signups and DNS.",
      takeaway: "quo.com",
    },
    {
      title: "A wiki that runs the company",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner-co", lines: [{ who: "claude", text: "Notion is connected. Create seven pages?" }, { who: "you", text: "Yes, under a page called Company." }, { who: "out", text: "✓ Home, Company, Product, Research, Customers, Ops, Decisions" }] },
      promptLabel: "Copy · the Notion workspace",
      prompt: "Draft a Notion workspace for What's for Dinner as notion-outline.md: pages for Home, Company, Product, Research, Customers, Ops and Decisions, with the sections and starter content each one needs. Put atlas-prep.md and comms.md under Ops. Add a Decisions log template with date, decision, why and owner. Wait for my OK.\n\nThen, if I want it built for me: tell me to run this in my terminal and authenticate with /mcp in Claude Code:\nclaude mcp add --transport http notion https://mcp.notion.com/mcp\nWait until I tell you it's done, and tell me to restart Claude Code if the Notion tools don't show up.\n\nUse the Notion tools to create the pages under one parent page I choose. Show me the plan before creating anything, and don't edit or delete existing pages.",
      promptPreview: "Draft notion-outline.md, wait for my OK, then connect Notion's MCP server and create the pages under one parent I choose.",
      takeaway: "developers.notion.com",
    },
    {
      title: "A pipeline before the first call",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner-co", lines: [{ who: "out", text: "✓ Stages: Found → Contacted → Interview booked → Interviewed → Beta tester → Paying" }, { who: "out", text: "✓ companies.csv and people.csv" }, { who: "claude", text: "Import companies first, then people." }] },
      promptLabel: "Copy · the Twenty CRM setup",
      prompt: "We'll use Twenty, the open-source CRM, to track the people we interview and recruit as beta testers for What's for Dinner.\n\n1. Check Twenty's current user guide on pipelines and CSV import before you start.\n2. Propose five to seven Opportunity stages from first contact to paying user (for example Found, Contacted, Interview booked, Interviewed, Beta tester, Paying), with a one-line exit rule for each stage. Deals stay in Opportunities; in Part 6 we'll track creator outreach separately with an Outreach stage field on People. Wait for my OK.\n3. Write crm/companies.csv and crm/people.csv as import templates with a header row and two clearly fake rows each. People link to a company by its name or domain. Write crm/README.md with the import order: companies first, then people, matching columns to the sample file Twenty offers in its import dialog.\n\nI'll create the workspace and run the import myself. Wait until I tell you it's done.",
      promptPreview: "Propose Twenty pipeline stages with exit rules, then write companies.csv and people.csv import templates. Companies first, then people.",
      takeaway: "twenty.com",
    },
    {
      title: "Ship the checklist",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner-co", lines: [{ who: "out", text: "✓ STACK.md: 4 sections, 13 tools" }, { who: "out", text: "✓ 5 checks under Done when" }, { who: "claude", text: "Paste it into Notion under Ops." }] },
      promptLabel: "Copy · write STACK.md",
      prompt: "Read atlas-prep.md, comms.md, notion-outline.md and crm/README.md. Combine them into STACK.md, one checklist I'll paste into Notion.\n\nOrder it the way a founder does it: 1. Legal and money (Stable, Stripe Atlas, Mercury, Carta). 2. Identity and comms (Google Workspace, 1Password, Quo, Slack, Notion). 3. Build and sell (Vercel, Twenty). 4. AI helpers (Granola, Grok Bot).\n\nFor each tool: what it's for in one line, its website, the checkboxes, and any questions for an advisor. End with a Done when section of five checks. Put a line at the top saying this is a checklist, not legal or tax advice.\n\nThen mark what I've already finished tonight and list what's left, in order.",
      promptPreview: "Combine everything into STACK.md in founder order, with a Done when section, then show me what's finished and what's left.",
    },
    {
      title: "",
      layout: "checklist",
      tone: "bonus",
      diagram: "stage",
      stage: { scene: "voyage", dark: true, kicker: "BONUS ROUND", lines: ["Time on the clock?"], em: "Hire the helpers." },
    },
    {
      title: "Granola takes notes. Grok Bot follows up.",
      layout: "checklist",
      tone: "bonus",
      diagram: "demo",
      demo: { label: "Grok Bot · Monday routine", lines: [{ who: "you", text: "[ pasted routine brief ]" }, { who: "claude", text: "Read 3 Granola calls, #customers and Decisions." }, { who: "out", text: "→ Founder update drafted. Approve to post?" }] },
      promptLabel: "Copy · the Grok Bot routine brief",
      prompt: "Read STACK.md. Write grok-bot-routine.md: a brief I'll paste into Grok Bot, xAI's AI teammate, myself.\n\nThe routine runs every Monday morning. It reads last week's Granola meeting notes, the #customers channel in Slack and the Decisions page in Notion. It drafts a short founder update: what we learned from users, what we decided, what's blocked, and the three most important things this week. It posts nothing without my approval.\n\nList the connections I need to turn on in Grok Bot (Granola, Slack, Notion; all three are on its connector list) and what it must never do: send email, change Notion pages, or post to any channel other than #general. Keep the brief under 200 words.\n\nAdd a note to check that my Grok plan includes scheduled routines before I set it up. Don't sign up for or connect anything. I'll do that myself.",
      promptPreview: "Write a Grok Bot routine brief: every Monday it reads Granola, Slack and Notion and drafts a founder update for my approval.",
      takeaway: "Also in the series · Part 2: Market Research",
    },
    takeHomeSlide(SLUG),
    FOUNDER_WEEKEND_SLIDE,
    COMMUNITY_CLOSE_SLIDE,
  ],
};

export const TALK = {
  slug: SLUG,
  series: 1,
  eventTitle: "Company Stack",
  key: "Stack",
  summary: "Form the company. Set up its tools.",
  copy: "Before What's for Dinner has a line of code, it needs a company: an entity, a bank account, an inbox, a phone number and a place for every password. Claude Code drafts the checklists and plans; you do the signups.",
  ...WORKUITY,
  rsvp: [],
  steps: [
    { title: "Legal", body: "Address, incorporation, bank and cap table." },
    { title: "Comms", body: "Email, phone, chat, wiki and passwords." },
    { title: "Sell", body: "Hosting and a CRM pipeline, ready early." },
    { title: "Helpers", body: "AI notes and an AI teammate, last." },
  ],
  stepsLede: "Twenty minutes of AI news, then we set up the company behind What's for Dinner in founder order, then five-minute demos from the room.",
  closing: ["Bring a company name.", "Leave with a checklist."],
  example: {
    name: "What's for Dinner",
    heading: ["Tonight's", "checklist."],
    lede: "The company behind the app, set up in the order a founder needs it. Paste it into Notion and check items off as you go.",
    file: "STACK.md",
    pitch: "Thirteen tools, in founder order: legal and money first, then identity and comms, then build and sell, then the AI helpers.",
    jobLabel: "The rule",
    job: "Claude Code drafts. You sign up, pay and sign.",
    stack: ["Stripe Atlas", "Mercury", "Carta", "Google Workspace", "1Password", "Notion", "Twenty", "Grok Bot"],
    doneLabel: "Done when",
    done: [
      "The company exists, with its tax ID",
      "Money lands in the company account",
      "hello@ reaches both founders",
      "Every login in 1Password, with 2FA",
      "A CRM pipeline ready for five interviews",
    ],
    spec: STACK_MD,
    specLabel: "The full STACK.md",
    specDestination: "a Notion page",
  },
  toolsLede: "Every tool the company needs, in the order you set them up. Claude Code drafts; you sign up, pay and sign.",
  tools: [
    { name: "Stripe Atlas", job: "Incorporation: a Delaware C corporation or LLC, the tax ID and founder equity", cmd: "stripe.com/atlas", href: "https://stripe.com/atlas" },
    { name: "Mercury", job: "Business banking; Atlas companies can apply before the EIN arrives", cmd: "mercury.com", href: "https://mercury.com" },
    { name: "1Password CLI", job: "Vaults for every shared login, scripted with op", cmd: "brew install 1password-cli", href: "https://www.1password.dev/cli/get-started/" },
    { name: "Notion MCP", job: "Lets Claude Code create the wiki pages it drafted", cmd: "claude mcp add --transport http notion https://mcp.notion.com/mcp", href: "https://developers.notion.com" },
    { name: "Twenty", job: "Open-source CRM: an Opportunities pipeline for interviews and beta testers", cmd: "twenty.com", href: "https://twenty.com" },
    { name: "Vercel", job: "Hosting under a company team, ready for Part 3", cmd: "npx vercel", href: "https://vercel.com" },
    { name: "Granola", job: "AI meeting notes from your own device, no bot in the call", cmd: "granola.ai", href: "https://www.granola.ai" },
    { name: "Grok Bot", job: "xAI's AI teammate on a cloud computer, for routines like the weekly update", cmd: "x.ai/bot", href: "https://x.ai/bot" },
  ],
  deck: DECK,
};
