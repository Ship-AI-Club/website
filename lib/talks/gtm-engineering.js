import { ABOUT_SLIDE, JOIN_ROOM_SLIDE, PARTNER_SLIDE, FOUNDER_WEEKEND_SLIDE, COMMUNITY_CLOSE_SLIDE, takeHomeSlide, WORKUITY } from "./shared.js";

const GTM_PLAN = `# GTM-PLAN.md · What's for Dinner

## Goal
100 signups from people who cook dinner at home, in six weeks, tracked to the message that brought them.

## ICP
Busy parents who cook weeknight dinners, decide what to make after 5pm, and already follow food creators for ideas.

## One channel
Small family-dinner and meal-prep creators (roughly 5k to 50k followers) who post weeknight recipes. One creator who shares it reaches people who already have the problem.

Not now: paid ads, cold email to strangers, Product Hunt, every social network at once.

## Lead list
Built from public sources only: creator profiles, their blogs, and the business contact they list publicly.
Fields: name, handle, platform, followers (approx.), niche, recent post that fits, public contact, source URL, fit score 1-5.
Anything we couldn't open (many Instagram and TikTok pages need a login) stays blank. Never filled from memory.
Never collect personal emails or phone numbers a person didn't publish for business.

## System of record
Twenty CRM. Deals stay in Opportunities from Company Stack. For creators we track outreach on People, with an Outreach stage field: New, Contacted, Replied, Trying it, Shared, Not a fit.
Two timestamps on each Person: contacted_at (set when the first message goes out) and replied_at (set on their first reply).
Every reply and next step is a note on that Person.

## Outreach
Lead with their audience's problem, not our product.
- First line: a specific post of theirs and the question their followers keep asking ("what can I make with what's left?")
- One line on what the app does
- One small ask: try it free, reply with what's in your fridge tonight
- Their own tracked link
- An easy out: "Not your thing? No reply needed."

Rules: the human sends every message by hand. Ten a day, maximum. Follow each platform's rules on DMs and promotion. One follow-up after five days, then stop. Anyone who says no or asks to stop is marked Not a fit and never contacted again.

## Tracking
One link per creator:
https://whats-for-dinner.vercel.app/?utm_source=instagram&utm_medium=creator&utm_campaign=first-100&utm_content=<handle>
The app saves first-touch UTM values on the user record at signup.

## Weekly loop
- Monday: add 20 new leads, score them, drop anything below 3
- Tuesday to Thursday: send 10 a day; in Twenty set Contacted and contacted_at
- Friday: count contacted_at and replied_at this week, signups by utm_content; read every reply; change one thing for next week

## Numbers we watch
- Reply rate = replies / messages sent
- Signups per creator = signups with that utm_content
- Weekly signups toward 100

## Done when
- [ ] One ICP and one channel written down, with what we're not doing
- [ ] 50 scored leads in Twenty, every one with a public source URL
- [ ] Three outreach drafts, each opening with the reader's problem
- [ ] A tracked link per creator, and signups showing utm_content in the database
- [ ] The first Friday report: sent, replies, signups, one change
`;

export const TALK = {
  slug: "gtm-engineering",
  series: 4,
  eventTitle: "First Users",
  key: "Users",
  summary: "Your first 100 users, from a system you can run every week.",
  copy: "Tonight Claude Code helps us pick one customer and one channel, build a lead list from public sources, and run a weekly loop measured in replies and signups.",
  ...WORKUITY,
  startISO: "2027-01-19T17:00:00-07:00",
  endISO: "2027-01-19T19:00:00-07:00",
  dateLabel: "Tue Jan 19, 2027",
  timeLabel: "5:00 - 7:00 PM MST",
  rsvp: [
    { label: "RSVP on Luma", href: "https://luma.com/dckebkgi" },
    { label: "RSVP on Meetup", href: "https://www.meetup.com/shipai/events/317558890/" },
  ],
  steps: [
    { title: "Focus", body: "One ideal customer, one channel, written down." },
    { title: "List", body: "Fifty leads from public sources, scored, in Twenty." },
    { title: "Outreach", body: "Messages that open with their problem, sent by you." },
    { title: "Loop", body: "Tracked links and a Friday report on replies and signups." },
  ],
  stepsLede: "A short AI news briefing, then we engineer What's for Dinner's first 100 users live, then five-minute demos from the room.",
  closing: ["Skip the hustle.", "Run the loop."],
  example: {
    name: "What's for Dinner",
    heading: ["Tonight's", "plan."],
    lede: "The go-to-market plan we write on the night for What's for Dinner. Copy it, swap in your own customer and channel, and run it next week.",
    file: "GTM-PLAN.md",
    pitch: "Type what's in your fridge. Get three dinners you can make tonight.",
    jobLabel: "The goal",
    job: "100 signups from home cooks, each one traced to the message that brought them.",
    stack: ["Claude Code", "Twenty CRM", "UTM links", "Neon", "Vercel"],
    doneLabel: "Done when",
    done: [
      "One ICP and one channel, plus what we're not doing",
      "50 scored leads in Twenty, each with a public source",
      "Three outreach drafts that open with the reader's problem",
      "Signups saved with their UTM values",
      "The first Friday report: sent, replies, signups, one change",
    ],
    spec: GTM_PLAN,
    specLabel: "The full GTM plan",
    specDestination: "a GTM-PLAN.md file in your repo",
  },
  toolsLede: "The tools behind the weekly loop, one job each. Claude Code drafts and counts; you send every message.",
  tools: [
    { name: "Claude Code", job: "Writes the plan, researches public profiles, drafts messages and reports", cmd: "curl -fsSL https://claude.ai/install.sh | bash", href: "https://code.claude.com/docs" },
    { name: "Twenty", job: "Open-source CRM: the system of record for every lead and reply", cmd: "app.twenty.com", href: "https://twenty.com" },
    { name: "Twenty REST API", job: "Load leads and log notes from a script, with your own API key", cmd: "https://api.twenty.com/rest/people", href: "https://docs.twenty.com/developers/extend/api" },
    { name: "Campaign URL Builder", job: "Check the UTM links Claude Code generates", cmd: "ga-dev-tools.google/campaign-url-builder", href: "https://ga-dev-tools.google/campaign-url-builder/" },
    { name: "Dub", job: "Optional short links with UTM templates and click counts", cmd: "npm install dub", href: "https://dub.co/help/article/utm-builder" },
    { name: "Neon", job: "The app's Postgres, where signups keep their UTM values", cmd: "npx neon@latest init", href: "https://neon.com" },
  ],
  deck: {
    title: "First Users",
    includeRoiSlide: false,
    includeShowcaseSlide: false,
    visual: true,
    slides: [
      {
        title: "",
        layout: "checklist",
        diagram: "stage",
        stage: { scene: "voyage", dark: true, logo: true, kicker: "CLAUDE CODE BUILD NIGHT · PART 4 · TUE JAN 5", lines: ["First"], em: "Users", body: "Tonight, the first 100 users, from one channel." },
      },
      ABOUT_SLIDE,
      JOIN_ROOM_SLIDE,
      PARTNER_SLIDE,
      {
        title: "",
        layout: "checklist",
        diagram: "stage",
        stage: { scene: "fleet", dark: true, kicker: "THE IDEA", lines: ["Hustle doesn't repeat."], em: "Systems do." },
      },
      {
        title: "Engineer the first 100",
        layout: "checklist",
        diagram: "versus",
        before: { kicker: "HUSTLE", title: "Post everywhere. Hope." },
        after: { kicker: "SYSTEM", title: "One customer. One channel.", em: "Measured every Friday." },
        items: [],
      },
      {
        title: "Tonight",
        layout: "checklist",
        diagram: "result",
        items: [{ title: "Focus" }, { title: "List" }, { title: "Outreach" }, { title: "Loop" }],
      },
      {
        title: "Tonight's plan",
        layout: "checklist",
        diagram: "doc",
        doc: {
          file: "GTM-PLAN.md",
          sections: [
            { h: "ICP", lines: ["Busy parents deciding dinner after 5pm."] },
            { h: "One channel", lit: true, lines: ["Small family-dinner creators who share it."] },
            { h: "Outreach", lines: ["Their problem first. You send every message."] },
            { h: "Done when", lines: ["[ ] 50 scored leads in Twenty", "[ ] A tracked link per creator", "[ ] The first Friday report"] },
          ],
        },
      },
      {
        title: "Pick one customer, one channel",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "claude", text: "Who feels the 6pm problem most often?" }, { who: "you", text: "Parents cooking on weeknights." }, { who: "claude", text: "Where do they already look for dinner ideas?" }, { who: "out", text: "✓ GTM-PLAN.md: ICP and one channel" }] },
        promptLabel: "Copy · focus the plan",
        prompt: "Read SPEC.md and RESEARCH.md if they exist. Help me write GTM-PLAN.md for getting this app its first 100 users.\n\nInterview me one question at a time and wait for each answer:\n1. Who has this problem most often, and when?\n2. Where do those people already go for help with it?\n3. Which one channel could reach 100 of them in six weeks without paid ads?\n\nPush back if I pick more than one customer or more than one channel. Then write GTM-PLAN.md with these sections: Goal, ICP, One channel (with a short \"Not now\" list), Lead list, System of record, Outreach, Tracking, Weekly loop, Numbers we watch, Done when. Leave Lead list onward as headings for now.\n\nStop and wait for my OK before doing anything else.",
        promptPreview: "Interview me one question at a time, push back if I pick two channels, then write GTM-PLAN.md and wait for my OK.",
      },
      {
        title: "Build the list from public sources",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "out", text: "✓ 50 creators found, 9 dropped as off-niche" }, { who: "out", text: "✓ Enriched: niche, recent post, public contact" }, { who: "claude", text: "41 leads in leads.csv. Top fit: weeknight one-pan creators." }] },
        promptLabel: "Copy · build the lead list",
        prompt: "Read GTM-PLAN.md. Build a lead list for the ICP and channel it names.\n\n1. Search the web for 50 candidates that fit the channel. Use public pages only: profiles, blogs, about and contact pages.\n2. For each, record: name, handle, platform, approximate followers, niche, one recent post that fits our problem (with its URL), the business contact they publish, the source URL, and a fit score from 1 to 5 with one line of reasoning.\n3. Do not guess or construct email addresses, and skip anyone who only lists a personal contact. Leave the contact blank if none is published.\n4. Many Instagram and TikTok pages need a login, so you may not be able to open them. Leave blank any field you couldn't read on a page you actually opened, and mark the row \"needs a look\". Never fill a field, follower count or post from memory.\n5. Save it as leads.csv. Show me the top 10, the rows marked \"needs a look\", and anything you were unsure about.\n\nThen fill in the Lead list section of GTM-PLAN.md and stop. Don't contact anyone.",
        promptPreview: "Find 50 leads from public pages, record a source and fit score for each, never guess emails, save leads.csv and stop.",
      },
      {
        title: "Twenty is the system of record",
        layout: "checklist",
        diagram: "setup",
        terminal: { label: "Twenty · People", kicker: "ONE PLACE FOR EVERY LEAD", lines: ["41 people.", "One Outreach stage each."], body: "New, Contacted, Replied, Trying it, Shared, Not a fit." },
        items: [
          { title: "You set it up", body: "Create the workspace and an API key yourself." },
          { title: "Claude loads it", body: "A small script imports leads.csv as People." },
          { title: "Notes, not memory", body: "Every send and reply gets logged on the record." },
        ],
        promptLabel: "Copy · load leads into Twenty",
        prompt: "Read GTM-PLAN.md and leads.csv. We're using Twenty as the CRM from the Company Stack Lunch & Learn. If we skipped it, tell me to create a free Twenty workspace at app.twenty.com first, and wait until I tell you it's done.\n\n1. Tell me to create an API key in Twenty's settings and add it to .env.local as TWENTY_API_KEY myself. Wait until I tell you it's done. Never print the key.\n2. Read Twenty's current REST API docs for people and custom fields. Tell me which fields I should add to the Person object myself and wait until I tell you they exist: handle, platform, fit score, source URL, utm_content, Outreach stage (a select with New, Contacted, Replied, Trying it, Shared, Not a fit; deals stay in the Opportunity stages from Company Stack), contacted_at and replied_at (date and time).\n3. Write scripts/import-leads.ts that reads leads.csv and creates one Person per row with Outreach stage New, skipping anyone already in Twenty by handle. Run it on the first 3 rows only and tell me to check them in Twenty.\n4. After my OK, import the rest and report the count.",
        promptPreview: "I add the Twenty API key and fields myself. Then write an import script, test it on 3 rows, and wait for my OK before the rest.",
        takeaway: "docs.twenty.com",
      },
      {
        title: "Lead with their problem",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "out", text: "Your one-pan orzo post got 40 comments asking for swaps." }, { who: "out", text: "We built a free app for the \"what can I make with this?\" moment." }, { who: "claude", text: "Draft 1 of 3. You send it, not me." }] },
        promptLabel: "Copy · draft the outreach",
        prompt: "Read GTM-PLAN.md and the top 10 leads in Twenty or leads.csv.\n\nWrite three short outreach drafts for the channel in the plan. Each one:\n- Opens with a specific post of theirs and the problem their audience keeps raising, in their words\n- Says in one line what What's for Dinner does\n- Makes one small ask (try it free, or reply with what's in your fridge tonight)\n- Includes a placeholder for their tracked link\n- Ends with an easy out, like \"Not your thing? No reply needed.\"\n- Stays under 80 words, with no hype words and no fake urgency\n\nThen personalize draft 1 for the top 3 leads and save everything to outreach.md. Do not send anything or open any messaging app. I send every message myself. Fill in the Outreach section of GTM-PLAN.md and stop.",
        promptPreview: "Three drafts under 80 words that open with the reader's problem and end with an easy out. Save outreach.md. I send everything myself.",
      },
      {
        title: "The human sends",
        layout: "checklist",
        diagram: "versus",
        before: { kicker: "SPAM", title: "500 automated DMs." },
        after: { kicker: "CONSENT", title: "Ten a day, by hand.", em: "Every one worth a reply." },
        items: [],
        promptLabel: "Copy · check the rules first",
        prompt: "Read GTM-PLAN.md and outreach.md. Before I send anything, check the current rules for the platform in our One channel section: its terms on direct messages and promotion, and any rules a community posts for itself. Summarize what's allowed in five bullets with links to the source. Add a Rules line to the Outreach section: I send by hand, ten a day maximum, one follow-up after five days, and anyone who says no is marked Not a fit and never contacted again. Flag any draft that breaks a rule. Don't send anything.",
        promptPreview: "Check the platform's current rules on DMs and promotion, add our sending rules to the plan, and flag any draft that breaks one.",
      },
      {
        title: "Track every link",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "out", text: "✓ 41 links: utm_content=<handle>" }, { who: "out", text: "✓ users.utm_source, utm_medium, utm_campaign, utm_content" }, { who: "claude", text: "Sign up from a test link, then check Neon." }] },
        promptLabel: "Copy · UTM links and signup tracking",
        prompt: "Read GTM-PLAN.md and SPEC.md.\n\n1. Generate one tracked link per lead in this format: our live URL plus utm_source=<platform>, utm_medium=creator, utm_campaign=first-100, utm_content=<handle>. Save them to a links column in leads.csv and update the utm_content field in Twenty.\n2. In the app, when someone lands with UTM parameters, keep them in a first-party cookie for 30 days. At signup, save utm_source, utm_medium, utm_campaign and utm_content on the user record. Add the columns with a migration, and don't overwrite values that are already set.\n3. Mention the cookie in the privacy page if we have one.\n4. Tell me to sign up with a test link at phone width, then show me the saved row. Stop there.",
        promptPreview: "One UTM link per lead, then save first-touch UTM values on the user record at signup. Test it with one link and stop.",
      },
      {
        title: "Run the weekly loop",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "you", text: "It's Friday. How did week one go?" }, { who: "out", text: "Sent 42 · Replies 9 (21%) · Signups 17" }, { who: "claude", text: "Recipe creators replied 3x more. Next week: more of them." }] },
        promptLabel: "Copy · the Friday report",
        prompt: "Read GTM-PLAN.md. Write scripts/friday-report.ts and run it.\n\n1. From Twenty: count People whose contacted_at falls in this week (first messages sent) and whose replied_at falls in this week (replies). If either field is empty on someone marked Contacted or Replied, list them so I can fix it.\n2. From the database: count signups this week grouped by utm_content, and the running total toward 100.\n3. Print: messages sent, replies, reply rate, signups, signups per creator, and the five best creators.\n4. Read this week's reply notes in Twenty and sum up what people said in three bullets.\n5. Suggest exactly one change for next week, based only on these numbers, and wait for me to pick it.\n\nAppend the report to a Weekly log section in GTM-PLAN.md. Never print API keys.",
        promptPreview: "Every Friday: sent, replies, reply rate and signups by creator from Twenty and the database, plus one change for next week.",
        takeaway: "Next: Pitch Night, Tue Jan 26.",
      },
      {
        title: "",
        layout: "checklist",
        tone: "bonus",
        diagram: "stage",
        stage: { scene: "swell", dark: true, kicker: "BONUS ROUND", lines: ["Replies coming in?"], em: "Triage them." },
      },
      {
        title: "Sort replies, draft answers",
        layout: "checklist",
        tone: "bonus",
        diagram: "demo",
        demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "out", text: "@weeknightmeals: \"Tried it, my kids loved the frittata\"" }, { who: "claude", text: "Outreach stage: Trying it. Draft: ask if they'd share it." }, { who: "out", text: "✓ Note saved in Twenty. Ready for you to send." }] },
        promptLabel: "Copy · reply triage",
        prompt: "Bonus round. I'll paste replies I received below this prompt, one per line, with the sender's handle.\n\nFor each reply:\n1. Find the person in Twenty by handle.\n2. Pick the new Outreach stage: Replied, Trying it, Shared or Not a fit. If replied_at is empty, set it to when the reply arrived. Anyone who says no or asks to stop is Not a fit, with no draft.\n3. Draft a short answer under 50 words that responds to what they actually said.\n4. Save the stage, replied_at and a note with the draft on their record.\n\nShow me a table of handle, stage and draft. Don't send anything. I review and send each one myself.",
        promptPreview: "Paste replies. Claude sets each stage in Twenty and drafts an answer. Anyone who says no gets no draft. You send.",
      },
      takeHomeSlide("gtm-engineering"),
      FOUNDER_WEEKEND_SLIDE,
      COMMUNITY_CLOSE_SLIDE,
    ],
  },
};
