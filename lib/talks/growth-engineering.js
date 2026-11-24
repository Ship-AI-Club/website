import { ABOUT_SLIDE, JOIN_ROOM_SLIDE, PARTNER_SLIDE, FOUNDER_WEEKEND_SLIDE, COMMUNITY_CLOSE_SLIDE, takeHomeSlide, WORKUITY } from "./shared.js";

const GROWTH_PLAN = `# GROWTH.md · What's for Dinner

## Goal
Turn signups into people who cook with the app every week. Find the biggest leak, fix one thing at a time.

## The five stages
| Stage | Definition for What's for Dinner | Event or query |
|---|---|---|
| Acquisition | A new account is created | \`signed_up\` (with utm_source, utm_content) |
| Activation | Their first three dinners found, within 24 hours of signup | first \`dinners_found\` |
| Engagement | Finds dinners in a given week | \`dinners_found\` at least once that week |
| Retention | Still finding dinners in week 4 after signup | week-4 cohort retention |
| Churn | No \`dinners_found\` for 14 days | days since last \`dinners_found\` >= 14 |

At risk: 10 to 13 days since the last \`dinners_found\`.

## Events
- \`signed_up\`: server-side, after the account is created. Properties: utm_source, utm_medium, utm_campaign, utm_content
- \`dinners_found\`: server-side, after three recipes come back. Properties: ingredient_count, seconds
- \`dinners_failed\`: server-side, when the AI call fails or times out
- \`dinner_opened\`: client-side, when someone opens a recipe's steps

Identify users by their user id, never by email. No ingredient lists or recipe text in event properties.

## Dashboard
1. Funnel: signed_up -> first dinners_found (activation rate)
2. Weekly active users: unique users with dinners_found per week (engagement)
3. Retention: weekly cohorts, signed_up -> dinners_found, through week 4
4. At risk and churned: counts from the dinners table
5. Activation by utm_content: which creators bring people who cook

## Biggest leak
The stage with the lowest conversion from the stage before it. Write it down with the number before choosing a fix.

## Experiment
One change, one metric, one decision date.
- Hypothesis: if the empty fridge input shows three tappable starter ingredients, more new users reach their first dinners
- Metric: activation rate
- Split: 50/50 feature flag on new signups
- Run: until each variant has at least 100 signups, or two weeks
- Decide: keep, kill or rerun. Log it here either way.

## Lifecycle email
"What's in your fridge tonight?" sent once to at-risk users (10 days quiet), at most once every 30 days per person.
- Sent with Resend from our verified domain
- One link back to the app with utm_source=email&utm_campaign=at-risk
- An unsubscribe link that works in one click, plus List-Unsubscribe and List-Unsubscribe-Post headers, honored before every send
- Our physical postal address in the footer: [your Stable address] from Company Stack
- Never sent to anyone who unsubscribed or never activated
- Advisor question, not legal advice: if any users are in the EU, UK or Canada, do their consent rules mean we need an opt-in before sending this?

## Weekly review
Every Monday: the five stage numbers, the change from last week, the experiment status, one next step.

## Done when
- [ ] The five stages defined in this file
- [ ] signed_up and dinners_found arriving in analytics, tied to user ids
- [ ] A dashboard with funnel, weekly actives and week-4 retention
- [ ] The biggest leak named with its number, and one experiment running
- [ ] The at-risk email sent to a test account, with a postal address and a working one-click unsubscribe
`;

export const TALK = {
  slug: "growth-engineering",
  series: 5,
  eventTitle: "Growth Engineering",
  key: "Growth",
  summary: "Find where users leak out, and fix one thing at a time.",
  copy: "Tonight Claude Code helps us define activation, engagement, retention and churn, instrument them, find the biggest leak and ship one experiment and one email to fix it.",
  ...WORKUITY,
  startISO: "2027-01-26T17:00:00-07:00",
  endISO: "2027-01-26T19:00:00-07:00",
  dateLabel: "Tue Jan 26, 2027",
  timeLabel: "5:00 - 7:00 PM MST",
  rsvp: [
    { label: "RSVP on Luma", href: "https://luma.com/th31yqbc" },
    { label: "RSVP on Meetup", href: "https://www.meetup.com/shipai/events/317558906/" },
  ],
  steps: [
    { title: "Define", body: "Five stages, written for What's for Dinner." },
    { title: "Measure", body: "Real events and one dashboard." },
    { title: "Fix", body: "Name the biggest leak, ship one experiment." },
    { title: "Nudge", body: "One email for people about to drift away." },
  ],
  stepsLede: "Part 5 of the Tuesday Founders Nights: we instrument What's for Dinner and find its biggest leak on screen, one prompt at a time. Bring a laptop, or just watch.",
  closing: ["Count what matters.", "Fix one leak."],
  example: {
    name: "What's for Dinner",
    heading: ["Tonight's", "metrics plan."],
    lede: "The growth plan we write on the night: five stages defined for one app, the events behind them, the dashboard, one experiment and one email. Copy it and swap in your own app.",
    file: "GROWTH.md",
    pitch: "Type what's in your fridge. Get three dinners you can make tonight.",
    jobLabel: "The goal",
    job: "Turn signups into people who cook with the app every week.",
    stack: ["PostHog", "Resend", "Neon", "Next.js", "Vercel"],
    doneLabel: "Done when",
    done: [
      "Five stages defined for this app",
      "signed_up and dinners_found arriving, tied to user ids",
      "A dashboard with funnel, weekly actives and week-4 retention",
      "The biggest leak named, one experiment running",
      "The at-risk email working, with address and unsubscribe",
    ],
    spec: GROWTH_PLAN,
    specLabel: "The full metrics plan",
    specDestination: "a GROWTH.md file in your repo",
  },
  toolsLede: "The tools that measure the habit and nudge people back, one job each.",
  tools: [
    { name: "PostHog", job: "Product analytics, funnels, retention, feature flags and experiments", cmd: "npx @posthog/wizard", href: "https://posthog.com/docs/libraries/next-js" },
    { name: "PostHog MCP", job: "Lets Claude Code read your data and build insights and dashboards", cmd: "npx @posthog/wizard mcp add", href: "https://posthog.com/docs/model-context-protocol/claude-code" },
    { name: "PostHog Query API", job: "SQL over your events from a script, with a personal API key", cmd: "POST /api/projects/:project_id/query/", href: "https://posthog.com/docs/api/queries" },
    { name: "Resend", job: "Sends the at-risk email from your own domain", cmd: "npm install resend", href: "https://resend.com/docs/send-with-nextjs" },
    { name: "Vercel Web Analytics", job: "Privacy-friendly page traffic, if you only need visits", cmd: "npm install @vercel/analytics", href: "https://vercel.com/docs/analytics" },
    { name: "Vercel Cron Jobs", job: "Runs the daily at-risk check on a schedule", cmd: "vercel crons add --path /api/at-risk --schedule \"0 16 * * *\"", href: "https://vercel.com/docs/cron-jobs" },
  ],
  deck: {
    title: "Growth Engineering",
    includeRoiSlide: false,
    includeShowcaseSlide: false,
    visual: true,
    slides: [
      {
        title: "",
        layout: "checklist",
        diagram: "stage",
        stage: { scene: "swell", dark: true, logo: true, kicker: "FOUNDERS NIGHT · PART 5 · TUE JAN 26", lines: ["Growth"], em: "Engineering", body: "Tonight, getting users and keeping them." },
      },
      ABOUT_SLIDE,
      JOIN_ROOM_SLIDE,
      PARTNER_SLIDE,
      {
        title: "",
        layout: "checklist",
        diagram: "stage",
        stage: { scene: "harbor", dark: true, kicker: "THE IDEA", lines: ["Signups aren't users."], em: "Habits are." },
      },
      {
        title: "Measure the habit",
        layout: "checklist",
        diagram: "versus",
        before: { kicker: "VANITY", title: "\"We hit 100 signups.\"" },
        after: { kicker: "LIFECYCLE", title: "How many cooked in week 4?", em: "That's the number." },
        items: [],
      },
      {
        title: "Tonight",
        layout: "checklist",
        diagram: "result",
        items: [{ title: "Define" }, { title: "Measure" }, { title: "Fix" }, { title: "Nudge" }],
      },
      {
        title: "Tonight's metrics plan",
        layout: "checklist",
        diagram: "doc",
        doc: {
          file: "GROWTH.md",
          sections: [
            { h: "Activation", lit: true, lines: ["Their first three dinners found."] },
            { h: "Retention", lines: ["Still finding dinners in week 4."] },
            { h: "Churn", lines: ["No dinners found in 14 days."] },
            { h: "Done when", lines: ["[ ] Events tied to user ids", "[ ] One dashboard", "[ ] One experiment running"] },
          ],
        },
      },
      {
        title: "Five stages, one app",
        layout: "checklist",
        diagram: "result",
        items: [
          { title: "Acquire", body: "Signed up" },
          { title: "Activate", body: "First three dinners" },
          { title: "Engage", body: "Cooks weekly" },
          { title: "Retain", body: "Back in week 4" },
          { title: "Churn", body: "Quiet 14 days" },
        ],
      },
      {
        title: "Write the definitions first",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "claude", text: "What moment shows someone got the value?" }, { who: "you", text: "Their first three dinners come back." }, { who: "claude", text: "And how long quiet before they're gone?" }, { who: "out", text: "✓ GROWTH.md: five stages, one event each" }] },
        promptLabel: "Copy · define the stages",
        prompt: "Read SPEC.md and GTM-PLAN.md. Help me write GROWTH.md for this app.\n\nWe use five stages: acquisition, activation, engagement, retention and churn. Ask me one question at a time to define each one for this app, as a specific event or query, not a vague goal. Suggest a default for each and let me change it. Push back if a definition can't be measured.\n\nThen write GROWTH.md with: Goal, The five stages (a table of stage, definition, event or query), Events (name, when it fires, properties, server or client), Dashboard, Biggest leak, Experiment, Lifecycle email, Weekly review, Done when.\n\nNo personal data or ingredient text in event properties. Stop and wait for my OK.",
        promptPreview: "Define acquisition, activation, engagement, retention and churn as measurable events for this app, write GROWTH.md, and wait.",
      },
      {
        title: "Instrument the events",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "out", text: "✓ signed_up · server, with UTM values" }, { who: "out", text: "✓ dinners_found · server, after 3 recipes" }, { who: "claude", text: "Find dinners once, then check PostHog's activity feed." }] },
        promptLabel: "Copy · instrument the events",
        prompt: "Read GROWTH.md.\n\n1. Tell me to sign up for PostHog and run npx @posthog/wizard in my own terminal. Wait until I tell you it's done, then read what it changed and summarize it.\n2. Add server-side capture with posthog-node for the server events in GROWTH.md (signed_up, dinners_found, dinners_failed). Use the user id as the distinct id, call identify on the client after sign-in, and flush events before the route returns.\n3. Add the client events in GROWTH.md, and nothing else custom.\n4. Never log email addresses, ingredient lists or recipe text as properties.\n5. Tell me to sign up a test account and find dinners once, then confirm each event arrived with the right properties. Stop there.",
        promptPreview: "I run the PostHog wizard myself. Then add the events from GROWTH.md on the server, tied to user ids, and verify each one arrives.",
        takeaway: "posthog.com/docs/libraries/next-js",
      },
      {
        title: "One dashboard",
        layout: "checklist",
        diagram: "skills",
        hub: "PostHog MCP",
        hubCaption: "CLAUDE CODE BUILDS IT",
        hubNote: "You log in.\nIt builds the insights.",
        items: [
          { title: "Funnel", body: "Signed up to first dinners found." },
          { title: "Weekly actives", body: "Users finding dinners each week." },
          { title: "Retention", body: "Weekly cohorts through week 4." },
        ],
        promptLabel: "Copy · build the dashboard",
        prompt: "Read GROWTH.md.\n\n1. Tell me to add PostHog's MCP server by running npx @posthog/wizard mcp add in my own terminal, then restart Claude Code and log in when asked. Wait until I tell you it's done.\n2. Use the PostHog tools to create a dashboard called \"What's for Dinner growth\" with the insights listed under Dashboard in GROWTH.md: the activation funnel, weekly active users, weekly retention through week 4, and activation by utm_content.\n3. For at-risk and churned counts, write a small SQL query against our dinners table and tell me how to run it.\n4. Give me the dashboard link and today's number for each insight. If there isn't enough data yet, say so plainly.",
        promptPreview: "I add PostHog's MCP server and log in. Then Claude builds the funnel, weekly actives and retention dashboard from GROWTH.md.",
      },
      {
        title: "Find the biggest leak",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "out", text: "Signup → first dinners: 41%" }, { who: "out", text: "Activated → week 4: 63%" }, { who: "claude", text: "Biggest leak: activation. Most quit at the empty input." }] },
        promptLabel: "Copy · find the leak",
        prompt: "Read GROWTH.md and use the PostHog tools and our database.\n\n1. For the last 30 days, give me the conversion from each stage to the next as a table, with the number of users at each step.\n2. Name the stage with the biggest drop. If the sample is too small to trust, say how many users we need first.\n3. For that stage, look at what users did before dropping off (session recordings, if I've turned them on, and events) and list three possible causes, each with the evidence.\n4. Write the leak and its number under Biggest leak in GROWTH.md.\n\nDon't change any code. Stop and wait.",
        promptPreview: "Stage-to-stage conversion for 30 days, name the biggest drop with evidence, write it in GROWTH.md, change nothing.",
      },
      {
        title: "Ship one experiment",
        layout: "checklist",
        diagram: "versus",
        before: { kicker: "GUESSING", title: "Change five things at once." },
        after: { kicker: "EXPERIMENT", title: "One change, one metric.", em: "Then decide." },
        items: [],
        promptLabel: "Copy · ship the experiment",
        prompt: "Read GROWTH.md, especially Biggest leak and Experiment.\n\n1. Restate the hypothesis, the one metric, the split and the decision rule in four lines. Wait for my OK.\n2. Use the PostHog tools to create the experiment and its feature flag as a draft, and show me what you made. Wait for my OK before starting it.\n3. Build the variant behind the flag, for example three tappable starter ingredients on an empty fridge input. The control stays exactly as it is. New signups only.\n4. Show me both variants at phone width. Log the experiment, start date and decision date in GROWTH.md, then stop.",
        promptPreview: "Restate one hypothesis, metric and decision rule, put one change behind a PostHog flag for new signups, and log it in GROWTH.md.",
      },
      {
        title: "Catch them before they churn",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "out", text: "3 users quiet for 10 days" }, { who: "out", text: "✓ \"What's in your fridge tonight?\" sent via Resend" }, { who: "claude", text: "1 unsubscribed: skipped. Check your test inbox." }] },
        promptLabel: "Copy · the at-risk email",
        prompt: "Read GROWTH.md, section Lifecycle email.\n\n1. Tell me to create a Resend account, verify our sending domain and add RESEND_API_KEY to .env.local myself. Wait until I tell you it's done. Never print the key.\n2. Add an email_opt_out column and a one-click unsubscribe route that sets it.\n3. Write a route that finds activated users with no dinners for 10 to 13 days who haven't opted out and weren't emailed in the last 30 days, then sends \"What's in your fridge tonight?\" with resend.emails.send: two sentences, one tracked link back to the app, the unsubscribe link, and a footer with our physical postal address (use the placeholder [your Stable address] from Company Stack and tell me to fill it in). Add List-Unsubscribe and List-Unsubscribe-Post: List-Unsubscribe=One-Click headers that point at the same route, so mail apps can unsubscribe in one click. Record each send.\n4. Add an advisor question to the Lifecycle email section of GROWTH.md: if any users are in the EU, UK or Canada, do their consent rules mean we need an opt-in first? It's a checklist item, not legal advice.\n5. Protect the route with CRON_SECRET and add a daily Vercel cron for it.\n6. Run it once against a test account only, and tell me to check the inbox, the postal address footer and the unsubscribe link. Stop there.",
        promptPreview: "I set up Resend. Then a daily, protected route emails users quiet for 10 days, once a month at most, with a working unsubscribe.",
        takeaway: "resend.com/docs",
      },
      {
        title: "Review it every Monday",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "you", text: "Weekly review, please." }, { who: "out", text: "Activation 41% → 48% · Week 4 63% · Churned 11" }, { who: "claude", text: "Starter chips are ahead. Decision date is Friday." }] },
        promptLabel: "Copy · the weekly review",
        prompt: "Read GROWTH.md. Using the PostHog tools and our database, write this week's review:\n1. The five stage numbers, and the change from last week.\n2. Experiment status: users per variant, the metric for each, and whether we've reached the decision rule. Don't call a winner early.\n3. Lifecycle email: sent, clicks back to the app, unsubscribes.\n4. One next step.\n\nAppend it to a Weekly review log in GROWTH.md and stop.",
        promptPreview: "Every Monday: five stage numbers, experiment status without calling it early, email results and one next step.",
        takeaway: "Next: Founder Weekend, Feb 6-7. Bring your numbers.",
      },
      {
        title: "",
        layout: "checklist",
        tone: "bonus",
        diagram: "stage",
        stage: { scene: "fleet", dark: true, kicker: "BONUS ROUND", lines: ["Which creators bring cooks?"], em: "Follow the cohort." },
      },
      {
        title: "Retention by source",
        layout: "checklist",
        tone: "bonus",
        diagram: "demo",
        demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "out", text: "@weeknightmeals · 22 signups · 59% week 4" }, { who: "out", text: "@mealprepdaily · 31 signups · 18% week 4" }, { who: "claude", text: "Fewer signups, better cooks. Update GTM-PLAN.md?" }] },
        promptLabel: "Copy · retention by source",
        prompt: "Bonus round. Read GROWTH.md, and GTM-PLAN.md if it exists.\n\nUsing the PostHog tools or our database, show activation and week-4 retention grouped by utm_content, for sources with at least 10 signups. Sort by week-4 retention, not signups. Flag any group too small to trust.\n\nThen suggest one change to the lead scoring in GTM-PLAN.md based on which kinds of creators bring people who stay. Wait for my OK before editing it.",
        promptPreview: "Activation and week-4 retention by utm_content, sorted by who stays, then one suggested change to GTM lead scoring.",
      },
      takeHomeSlide("growth-engineering"),
      FOUNDER_WEEKEND_SLIDE,
      COMMUNITY_CLOSE_SLIDE,
    ],
  },
};
