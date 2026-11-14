import { ABOUT_SLIDE, JOIN_ROOM_SLIDE, PARTNER_SLIDE, FOUNDER_WEEKEND_SLIDE, COMMUNITY_CLOSE_SLIDE, takeHomeSlide, WORKUITY } from "./shared.js";

const SLUG = "production-monitoring";

const RUNBOOK_MD = `# RUNBOOK.md · What's for Dinner

## On call
- Primary: the founder. Backup: the cofounder. Both have the Slack app with #alerts notifications on.
- Alerts post to Slack #alerts and nowhere else. Nothing but alerts posts there.
- Sentry's Slack alerts need a Sentry plan that includes them. On the free plan, alerts go by email: to #alerts' channel email address if our Slack has one, or to both of us.
- Grok Bot drafts a triage note for every alert. It never changes production. A human decides.

## SLOs (28-day window)
| Promise | Target | Measured in |
|---|---|---|
| Find dinners works | 99.5% of POST /api/dinners return 2xx (429s and 4xx don't count against us) | Sentry, Vercel logs |
| Find dinners is fast | 99% finish in under 15 seconds | Sentry performance, POST /api/dinners |
| The app is up | /api/health passes 99.9% of checks | Sentry Uptime |
| Emails go out | The daily at-risk email and the Sunday plan check in on time | Sentry Crons |

## Alerts
| Alert | Fires when | Severity | Who acts |
|---|---|---|---|
| App down | Sentry Uptime: /api/health fails 3 checks in a row (1-minute interval) | Page | On call, now |
| New error | Sentry: a new issue in production | High | On call, within 30 minutes |
| Error spike | Sentry: one issue over 20 events in 5 minutes | High | On call, within 30 minutes |
| Slow dinners | Sentry: p95 of POST /api/dinners over 15 seconds for 10 minutes | Medium | Next working hour |
| Cron missed | Sentry Crons: at-risk-daily or sunday-plan missed or failed a check-in | Medium | Same day |
| AI Gateway down | /api/health reports aiGateway failing | High | On call, within 30 minutes |
| Spend | AI Gateway budget alert (email) | Medium | Founder |

## Not alerts
- A single 4xx, a single 429 from our rate limits, a single rejected webhook signature. Reviewed weekly, alert only on spikes.
- Workflow step retries that succeed. Retries are the design.
- Preview deployments, except during a fire drill.

## First three checks (any alert)
1. Open /api/health: which check fails, and which commit is live.
2. Open the Sentry issue: first seen, release, event count, users affected. Did it start with the latest deploy?
3. Vercel logs: \`vercel logs --environment production --query 'level:error' --since 1h\`, then follow one request with \`--query 'requestId:"<id>"'\`, using the x-request-id from the response or the log line.

## Per-area checks
- **Functions**: Vercel Observability, Vercel Functions: error rate and duration by route.
- **AI**: AI Gateway, Logs: filter Status 429 or 5xx, then Model and Provider. Check the credit balance at the top of the AI Gateway tab.
- **Database**: Neon, Monitoring: Postgres connections count against the max line, pooler connections, CPU, deadlocks. Then the Query performance tab, or \`scripts/db-health.sql\` (pg_stat_statements resets when the compute suspends).
- **Workflows**: \`npx workflow inspect runs\` locally, or workflow runs in the Vercel dashboard. Find the run by user and week.
- **Email**: Resend dashboard for the send, and the signed webhook route's logs for bounces.

## Rollback
- If it started with the latest deploy and users are hurting: roll back first, debug second.
- Dashboard: project overview, Production Deployment tile, Instant Rollback. CLI: \`vercel rollback [deployment-id or url]\`, then \`vercel rollback status\`.
- A rollback does not change environment variables or undo database migrations. Cron definitions follow the deployment you roll back to.
- After a rollback, new pushes don't go live. Ship the fix, then \`vercel promote <deployment>\` to resume.
- Hobby plan: only the previous production deployment. Pro: any deployment that was in production.

## Logging rules
- One JSON line per event: ts, level, event, requestId, route, userId (id only), status, durationMs, deployment, commit.
- requestId: Vercel's own request id from the \`x-vercel-id\` header (a random UUID only in local dev), so it matches Vercel's requestId log field. Returned in the \`x-request-id\` header, tagged on every Sentry event.
- The error's name is logged as errorName, because the redact step drops any key called name.
- Never log emails, names, ingredient lists, photos, prompts, tokens, cookies or request bodies (SECURITY.md).

## Grok Bot SRE routine
- **Trigger**: any new message in #alerts (Slack trigger, one channel). Backup: Sentry event trigger.
- **Reads**: the alert message and its thread, the public /api/health response, this RUNBOOK.
- **Can't reach**: Vercel. Vercel's MCP server only accepts reviewed clients, and Grok Bot isn't one. Don't put a Vercel token on its computer. Sentry only if Sentry's MCP server works as a custom connector; test it read-only first.
- **Writes**: a draft reply in the alert's thread: what fired, who is affected, suspected cause with evidence, confidence, checks done, the recommended next step, and a Claude Code prompt for the human.
- **Ask first**: posting anything. **Never**: deploy, roll back, change env vars, write to the database, email users, post outside #alerts.

## Postmortem template
\`\`\`
# Postmortem: <title> · <date>
Impact: who, how many, for how long
Timeline (Phoenix time): started, detected, acknowledged, mitigated, resolved
Detection: did an alert fire first, or did a user tell us?
What happened and why (blameless: systems, not people)
What went well · What didn't
Actions: what, owner, due date
\`\`\`

## Done when
- [ ] Every API log line is JSON with a requestId, and none contains an email or an ingredient list
- [ ] A test error in a preview shows up in Sentry with a readable stack trace and its release
- [ ] /api/health returns 503 when the database is unreachable, and Sentry Uptime alerts #alerts (Slack, or email on the free plan)
- [ ] A missed cron check-in alerts #alerts
- [ ] RUNBOOK.md has every section above, and Part 8's workflow notes still in it
- [ ] A fire drill ends with a Grok Bot triage draft in the thread and a written postmortem
`;

const DEMO_LABEL = "claude · ~/whats-for-dinner";

const DECK = {
  title: "Production Monitoring",
  includeRoiSlide: false,
  includeShowcaseSlide: false,
  visual: true,
  slides: [
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "voyage", dark: true, logo: true, kicker: "CLAUDE CODE BUILD NIGHT · PART 10", lines: ["Production"], em: "Monitoring", body: "Tonight, the alarms. Every night stands on its own." },
    },
    ABOUT_SLIDE,
    JOIN_ROOM_SLIDE,
    PARTNER_SLIDE,
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "fleet", dark: true, kicker: "THE IDEA", lines: ["Your users are not"], em: "your alarm system." },
    },
    {
      title: "Signal, not noise",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "LOGS YOU NEVER READ", title: "Ten thousand lines. Nobody looking." },
      after: { kicker: "ALERTS YOU ACT ON", title: "A few alerts.", em: "Each with an owner and a first check." },
      items: [],
    },
    {
      title: "Tonight",
      layout: "checklist",
      diagram: "result",
      items: [{ title: "Log" }, { title: "Catch" }, { title: "Alert" }, { title: "Triage" }],
    },
    {
      title: "Tonight's runbook",
      layout: "checklist",
      diagram: "doc",
      doc: {
        file: "RUNBOOK.md",
        sections: [
          { h: "SLOs", lines: ["99% of Find dinners under 15 seconds."] },
          { h: "Alerts", lit: true, lines: ["Each one: who acts, first three checks."] },
          { h: "Rollback", lines: ["Roll back first. Debug second."] },
          { h: "Done when", lines: ["[ ] Logs are JSON, no PII", "[ ] Down means #alerts in 3 minutes", "[ ] Grok Bot drafts the triage"] },
        ],
      },
    },
    {
      title: "Logs a machine can read",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "out", text: "✓ lib/log.ts · one JSON line, requestId on every response" }, { who: "out", text: "{\"event\":\"dinners_found\",\"status\":200,\"ms\":8412}" }, { who: "claude", text: "Removed 3 console.logs that printed ingredients." }] },
      promptLabel: "Copy · structured logs",
      prompt: "Read SPEC.md and SECURITY.md, especially the rule about personal data in logs.\n\n1. Create lib/log.ts: a small logger that writes one JSON line per event with console.log (console.error for errors). Fields: ts, level, event, requestId, route, userId (the id only), status, durationMs, plus deployment from VERCEL_DEPLOYMENT_ID and commit from VERCEL_GIT_COMMIT_SHA.\n2. Give every API request a requestId: Vercel's own id from the x-vercel-id request header, falling back to crypto.randomUUID() in local dev. Return it in an x-request-id response header. Using Vercel's id means vercel logs --query 'requestId:\"<id>\"' finds the same request; after the next preview deploy, check that it does, and if it doesn't, search the bare id as text instead and tell me.\n3. Add a redact step that drops these keys anywhere in the object: email, name, ingredients, prompt, photo, token, authorization, cookie. Never log request bodies.\n4. Use it in POST /api/dinners, POST /api/photo, the Resend webhook route and every cron route: one line when the request finishes (status, duration) and one on error (errorName and message, never the input). Log the error's name as errorName, because the redact step drops name.\n5. Search the codebase for any other console.log that prints user data and list them before changing anything.\n\nRun the dev server, call /api/dinners once, show me the log lines, and stop.",
      promptPreview: "Add a JSON logger with Vercel's request id on every response, redact personal data, use it on the API and cron routes, and show me the lines.",
      takeaway: "vercel.com/docs/logs/runtime",
    },
    {
      title: "Catch every error",
      layout: "checklist",
      diagram: "setup",
      terminal: { label: "~/whats-for-dinner", kicker: "YOU RUN THE WIZARD", lines: ["npx @sentry/wizard@latest -i nextjs", "source maps · global-error · tunnel"], body: "Claude reviews what it wrote." },
      items: [
        { title: "You sign in", body: "The wizard creates the project and config files." },
        { title: "Claude tightens it", body: "No PII, a sample rate, the requestId tag." },
        { title: "Prove it", body: "A test error with a readable stack trace." },
      ],
      promptLabel: "Copy · set up Sentry",
      prompt: "Read RUNBOOK.md if it exists and SECURITY.md.\n\n1. In my own terminal I'll run npx @sentry/wizard@latest -i nextjs. It signs me in, creates the Sentry project and writes the config. I'll also install Sentry's Vercel integration so each deploy notifies Sentry and uploads source maps. Wait until I tell you it's done.\n2. Read what the wizard created (instrumentation-client.ts, sentry.server.config.ts, sentry.edge.config.ts, instrumentation.ts, app/global-error.tsx and the withSentryConfig wrapper in next.config) and explain each file in one line.\n3. Make sure sendDefaultPii is off, and add a beforeSend that strips emails, cookies and request bodies. Set a modest tracesSampleRate for production and tell me the tradeoff. Set environment explicitly to VERCEL_ENV (development when it's missing) in every Sentry.init, so events say production or preview, not vercel-production, and our alert filters match. After the test error, check the Environment dropdown in Sentry shows those names.\n4. Tag every event with the requestId from lib/log.ts and the user's id, never their email.\n5. Wrap the daily at-risk email cron and the Sunday plan cron with Sentry.withMonitor, using the slugs at-risk-daily and sunday-plan and their real schedules. Tell me to check how many cron monitors our Sentry plan includes; the free plan has one, so if that's ours, ask me which cron gets it.\n6. Check that .env.sentry-build-plugin is in .gitignore. Never print the auth token.\n7. Add a temporary /api/debug-sentry route that throws, and only works when VERCEL_ENV is not production. Tell me to deploy a preview, hit it, and check that the stack trace in Sentry points at real source lines. Then remove the route and stop.",
      promptPreview: "I run the Sentry wizard. Claude reviews its files, strips PII, tags the requestId, monitors both crons, and proves it with one test error.",
      takeaway: "docs.sentry.io/platforms/javascript/guides/nextjs",
    },
    {
      title: "Is it up?",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "curl /api/health", lines: [{ who: "out", text: "{\"status\":\"ok\",\"db\":{\"ok\":true,\"ms\":38}," }, { who: "out", text: "\"aiGateway\":{\"ok\":true,\"ms\":112},\"commit\":\"8c1e2f4\"}" }, { who: "claude", text: "Database stopped: 503 in 2.1s. Restored." }] },
      promptLabel: "Copy · health route and uptime",
      prompt: "Read RUNBOOK.md and SECURITY.md. Build GET /api/health.\n\n1. Database: run select 1 with a 2-second timeout.\n2. AI Gateway, without spending tokens: call its credit balance endpoint (read the AI Gateway REST API docs for GET /v1/credits, its URL and auth) with a 3-second timeout, and cache that result for 60 seconds so the route can't be used to hammer it. AI_GATEWAY_API_KEY is already in .env.local.\n3. Return JSON: status (ok or degraded), ok and ms for each check, the first 7 characters of VERCEL_GIT_COMMIT_SHA and VERCEL_ENV. No hostnames, no error details, no keys. 200 when every check passes, 503 when any fails. Cache the response for about 10 seconds (Cache-Control: public, s-maxage=10, or a 10-second in-memory cache) so a burst of requests can't hit the database every time.\n4. Keep it outside auth, and check it isn't blocked by any Firewall rule from SECURITY.md.\n5. Ask me whether the database check should run on every ping: a check every minute keeps Neon's compute from scaling to zero. Wait for my answer.\n6. Prove the 503 locally by pointing at a bad database URL, then restore it.\n7. Tell me to create an Uptime Monitor in Sentry for our production /api/health at a 1-minute interval (the free plan includes one). Tell me to check our Sentry plan includes Slack alerts. If it does, the alert posts downtime issues to Slack #alerts. If it doesn't, it emails #alerts' channel email address if our Slack has one, or the on-call team. Wait until I tell you it's done, then stop.",
      promptPreview: "A /api/health route that checks Neon and AI Gateway without spending tokens, returns 503 on failure, and a Sentry Uptime monitor I set up.",
      takeaway: "docs.sentry.io/product/uptime-monitoring",
    },
    {
      title: "Is the database okay?",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "out", text: "connections · 14 active, 31 idle, max 104" }, { who: "out", text: "slowest · favorites by user_id · 41 ms × 3,120" }, { who: "claude", text: "No index on favorites.user_id. Want a migration?" }] },
      promptLabel: "Copy · database health",
      prompt: "Read RUNBOOK.md. We're adding database checks. Nothing in this prompt writes to the database.\n\n1. In the Neon SQL Editor I'll run CREATE EXTENSION IF NOT EXISTS pg_stat_statements; on the production database. Wait until I tell you it's done.\n2. Write scripts/db-health.sql with read-only queries: the ten slowest statements by mean_exec_time from pg_stat_statements, the ten most called, and current connections grouped by state from pg_stat_activity.\n3. Tell me how to run it against production with a read-only role, and note that pg_stat_statements resets when the compute suspends or restarts. The Query performance tab on Neon's Monitoring page shows top queries without the extension.\n4. Add a Database section to RUNBOOK.md: which Neon Monitoring charts to open first (Postgres connections count against the max line, pooler connections, CPU, deadlocks) and what each pattern usually means.\n5. Check that serverless routes use Neon's pooled connection string.\n\nIf a slow query needs an index, write the migration but don't run it. Stop and wait.",
      promptPreview: "I enable pg_stat_statements. Claude writes read-only health queries, a Database section for the runbook, and checks we use the pooler.",
      takeaway: "neon.com/docs/introduction/monitoring",
    },
    {
      title: "Alerts worth waking for",
      layout: "checklist",
      diagram: "skills",
      hub: "#alerts",
      hubCaption: "ONE CHANNEL",
      hubNote: "Every alert has an owner\nand a first check.",
      items: [
        { title: "SLO", body: "99% of Find dinners under 15 seconds." },
        { title: "Page", body: "App down: three failed checks in a row." },
        { title: "Not an alert", body: "One 429. One retry. One bad webhook." },
      ],
      promptLabel: "Copy · SLOs and alerts",
      prompt: "Read SPEC.md, GROWTH.md, SECURITY.md and RUNBOOK.md.\n\nInterview me one question at a time and wait for each answer: what users must always be able to do, how slow is too slow for Find dinners, who is on call, and what should wake someone up versus wait until morning.\n\nThen extend the RUNBOOK.md from Part 8. Keep its workflow notes and move them under Per-area checks, Workflows. Add these sections:\n1. On call: primary, backup, and where alerts go.\n2. SLOs: plain sentences, each with a number and a 28-day window, for example \"99% of Find dinners finish in under 15 seconds.\"\n3. An Alerts table: alert, fires when, severity, who acts, first check.\n4. A Not alerts list.\n5. First three checks for any alert: /api/health, the Sentry issue, then vercel logs --environment production --query 'level:error' --since 1h and one request with --query 'requestId:\"<id>\"'.\n6. Per-area checks: Functions, AI Gateway, Database (keep the section we wrote), Workflows, Email.\n7. Rollback: read vercel.com/docs/instant-rollback and write the dashboard and CLI steps, what a rollback doesn't undo, and vercel promote to resume.\n8. Logging rules from lib/log.ts.\n9. Grok Bot SRE routine: trigger, reads, can't reach, writes, ask first and never. We fill in the brief later tonight.\n10. A blameless Postmortem template: impact, timeline in Phoenix time, detection, what happened and why, what went well and didn't, actions with owners.\n\nRules: every alert has an owner and a first check. Nothing pages on a single event. Our own 429s and rejected webhooks are expected, so they alert only on spikes. Preview deployments never alert. Alert filters use the environment names Sentry shows: production and preview.\n\nThen give me a click-by-click checklist for creating each rule in Sentry. Check our Sentry plan includes Slack alerts: if it does, the action is Slack #alerts; if not, email to #alerts' channel email address if our Slack has one, or to the on-call team. I'll create them myself. Stop and wait.",
      promptPreview: "Interview me, then extend RUNBOOK.md: on call, SLOs, alerts with owners, first checks, rollback, logging, the Grok Bot routine and a postmortem template. I create the Sentry rules.",
      takeaway: "docs.sentry.io/organization/integrations/notification-incidents/slack",
    },
    {
      title: "Debug with Claude Code",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "you", text: "Find dinners is slow since 2pm." }, { who: "claude", text: "Sentry: p95 31s since release 8c1e2f4. Logs: 3 retries per request." }, { who: "claude", text: "Roll back or fix forward? Your call." }] },
      promptLabel: "Copy · investigate an alert",
      prompt: "1. In my own terminal I'll run:\nclaude mcp add --transport http sentry https://mcp.sentry.dev/mcp\nclaude mcp add --transport http vercel https://mcp.vercel.com\nThen I'll restart Claude Code and sign in to both with /mcp. Wait until I tell you it's done.\n2. Read RUNBOOK.md. When I give you an alert, a Sentry issue link or a request id, investigate read-only:\n- Sentry: first seen, release, event count, users affected, the stack trace.\n- Vercel: runtime logs for that request id (our requestId is Vercel's x-vercel-id, so --query 'requestId:\"<id>\"' finds it), and which deployment was live. vercel logs --environment production --query 'level:error' --since 1h works too.\n- AI Gateway: its request list isn't in the API, so tell me what to filter on its Logs page (Status 429 or 5xx, Model, Provider).\n- Workflows: npx workflow inspect runs, if the Sunday plan is involved.\n3. Write a triage note: what's broken, since when, who is affected, the suspected cause with evidence, and options (roll back, fix forward, wait).\n\nDon't deploy, roll back, change environment variables or write to the database. Those are my call. Start with the latest unresolved Sentry issue in production.",
      promptPreview: "I add the Sentry and Vercel MCP servers. Claude investigates an alert read-only across Sentry, Vercel logs and workflows, then writes a triage note.",
      takeaway: "mcp.sentry.dev",
    },
    {
      title: "An AI SRE in Grok Bot",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "Grok Bot · #alerts routine", lines: [{ who: "out", text: "Sentry · Error spike · POST /api/dinners" }, { who: "claude", text: "Health ok. Started 14:02, after commit 8c1e2f4." }, { who: "out", text: "→ Triage note and a Claude Code prompt drafted. Approve to post?" }] },
      promptLabel: "Copy · the Grok Bot SRE brief",
      prompt: "Read RUNBOOK.md and SECURITY.md. Write grok-bot-sre.md: a routine brief I'll paste into Grok Bot, xAI's AI teammate, myself. Keep it under 300 words.\n\n1. Trigger: any new message in Slack #alerts (a Slack trigger on that one channel). I'll test that alerts arriving in #alerts, from the Sentry app or by email, start it; if they don't, use Grok Bot's Sentry event trigger instead.\n2. Reads: the alert message and its thread, our public /api/health response, and RUNBOOK.md, which I'll give it.\n3. Say plainly what it can't reach: Vercel (Vercel's MCP server only accepts reviewed clients, and we won't put a Vercel token on its computer), and Sentry unless I add Sentry's MCP server as a custom connector and it works read-only.\n4. Output: a draft reply in the alert's thread with what fired, who is affected, the suspected cause with evidence and confidence, the first three checks from RUNBOOK.md and what they showed, the recommended next step, and a ready-to-paste Claude Code prompt for me.\n5. Ask first rules: posting anything. Never: deploy, roll back, change environment variables, write to the database, email users or post outside #alerts.\n\nDon't sign up for or connect anything. I'll do that myself.",
      promptPreview: "Write a Grok Bot routine brief: on each #alerts message it reads the alert and /api/health, drafts a triage note and a Claude Code prompt, and asks before posting.",
      takeaway: "docs.x.ai/grok-bot",
    },
    {
      title: "Drafts, not deploys",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "AN AGENT WITH PROD KEYS", title: "Fixes at 3 AM. Nobody reviewed it." },
      after: { kicker: "AN SRE THAT DRAFTS", title: "Triage in minutes.", em: "The rollback is your click." },
      items: [],
    },
    {
      title: "Run a fire drill",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "out", text: "✗ Sentry · TypeError in POST /api/dinners (preview)" }, { who: "out", text: "→ #alerts · Grok Bot draft in the thread" }, { who: "claude", text: "Postmortem written. 2 actions, both owned." }] },
      promptLabel: "Copy · fire drill and postmortem",
      prompt: "Read RUNBOOK.md. We're running a fire drill on a preview deployment. Never production.\n\n1. Add a FIRE_DRILL environment flag that makes POST /api/dinners throw a TypeError, and only when VERCEL_ENV is preview.\n2. Tell me to set FIRE_DRILL=1 for one preview branch in Vercel, add a temporary Sentry alert rule for the preview environment that notifies #alerts the same way our real alerts do (Slack, or email), and deploy. Wait until I tell you it's done.\n3. I'll call the route a few times. Then ask me, one at a time: did Sentry open an issue, did #alerts get it, did Grok Bot draft a triage note, and how many minutes did each take?\n4. Walk me through the Rollback section of RUNBOOK.md without running anything: Instant Rollback in the dashboard or vercel rollback, what it doesn't undo, and vercel promote to resume.\n5. Write postmortems/fire-drill.md from the template, with today's date and real timings, and add any fixes to RUNBOOK.md.\n6. Remove the flag and tell me to delete the temporary alert rule. Stop.",
      promptPreview: "Break a preview on purpose, time the path from error to #alerts to Grok Bot's draft, rehearse the rollback, and write the postmortem.",
      takeaway: "Also in the series: Part 11, Admin Console. The controls to act on what monitoring finds.",
    },
    {
      title: "",
      layout: "checklist",
      tone: "bonus",
      diagram: "stage",
      stage: { scene: "slipway", dark: true, kicker: "BONUS ROUND", lines: ["Errors aren't the only fire."], em: "Watch the bill." },
    },
    {
      title: "AI spend by feature",
      layout: "checklist",
      tone: "bonus",
      diagram: "demo",
      demo: { label: "npx tsx scripts/ai-spend.ts", lines: [{ who: "out", text: "feature:dinners · 61% of spend" }, { who: "out", text: "feature:photo · 33% · up 4x this week" }, { who: "claude", text: "Photo spend jumped after Tuesday's deploy." }] },
      promptLabel: "Copy · AI spend tracking",
      prompt: "Bonus round. Read RUNBOOK.md and SECURITY.md, then the AI Gateway Custom Reporting and Budgets docs.\n\n1. Tag every AI Gateway call with a feature tag (feature:dinners, feature:photo, feature:sunday-plan) and the user's id as the user, using the exact fields the Custom Reporting docs show.\n2. Tell me to set a monthly budget for this project in AI Gateway with spend alerts going to my email. I'll do it in the dashboard. Wait until I tell you it's done.\n3. Write scripts/ai-spend.ts that calls the Custom Reporting API for the last 7 days grouped by tag and prints a table. Read AI_GATEWAY_API_KEY from .env.local and never print it.\n4. Add a Spend section to RUNBOOK.md: where to look, what a normal week costs once we know, and who acts on the budget alert.\n\nRun the script once and stop.",
      promptPreview: "Tag AI calls by feature and user, set a budget with spend alerts, and print a weekly spend-by-feature table.",
      takeaway: "vercel.com/docs/ai-gateway/observability-and-spend",
    },
    takeHomeSlide(SLUG),
    FOUNDER_WEEKEND_SLIDE,
    COMMUNITY_CLOSE_SLIDE,
  ],
};

export const TALK = {
  slug: SLUG,
  series: 10,
  eventTitle: "Production Monitoring",
  key: "Monitoring",
  summary: "Know the moment it breaks, and what to check first.",
  copy: "Tonight Claude Code wires up structured logs, Sentry, a health check, database checks and a few alerts worth acting on, and Grok Bot drafts the triage note when one fires.",
  ...WORKUITY,
  rsvp: [],
  steps: [
    { title: "Log", body: "JSON lines with a request id, no personal data." },
    { title: "Catch", body: "Errors, slow requests and missed crons in Sentry." },
    { title: "Alert", body: "A few alerts in Slack, each with an owner." },
    { title: "Triage", body: "Grok Bot drafts the note. You decide." },
  ],
  stepsLede: "A short AI news briefing, then we wire up What's for Dinner's monitoring live and run a fire drill, then five-minute demos from the room.",
  closing: ["Hear it first.", "Fix it calmly."],
  example: {
    name: "What's for Dinner",
    heading: ["Tonight's", "runbook."],
    lede: "The runbook we build on the night: SLOs, alerts with owners, the first three checks, rollback, the Grok Bot SRE routine and a postmortem template. Copy it and swap in your own app.",
    file: "RUNBOOK.md",
    pitch: "Type what's in your fridge. Get three dinners you can make tonight.",
    jobLabel: "The job",
    job: "Know within minutes when What's for Dinner breaks, and know exactly what to check first.",
    stack: ["Vercel Observability", "Sentry", "Neon", "AI Gateway", "Slack", "Grok Bot"],
    doneLabel: "Done when",
    done: [
      "Every log line is JSON with a request id and no personal data",
      "A test error shows in Sentry with a readable stack trace",
      "A failed health check reaches #alerts in about three minutes",
      "A missed cron check-in reaches #alerts",
      "A fire drill ends with a Grok Bot triage draft and a postmortem",
    ],
    spec: RUNBOOK_MD,
    specLabel: "The full runbook",
    specDestination: "a RUNBOOK.md file in your repo",
  },
  tools: [
    { name: "Vercel runtime logs", job: "Query production logs by level, route or request id", cmd: "vercel logs --environment production --query 'level:error' --since 1h", href: "https://vercel.com/docs/cli/logs" },
    { name: "Instant Rollback", job: "Point production back at the last good deployment", cmd: "vercel rollback", href: "https://vercel.com/docs/instant-rollback" },
    { name: "Sentry for Next.js", job: "Errors, performance, uptime and cron monitors", cmd: "npx @sentry/wizard@latest -i nextjs", href: "https://docs.sentry.io/platforms/javascript/guides/nextjs/" },
    { name: "Sentry MCP", job: "Lets Claude Code read Sentry issues while it investigates", cmd: "claude mcp add --transport http sentry https://mcp.sentry.dev/mcp", href: "https://mcp.sentry.dev" },
    { name: "Vercel MCP", job: "Lets Claude Code read deployments and runtime logs", cmd: "claude mcp add --transport http vercel https://mcp.vercel.com", href: "https://vercel.com/docs/agent-resources/vercel-mcp" },
    { name: "Neon monitoring", job: "Connections, CPU and slow queries via pg_stat_statements", cmd: "CREATE EXTENSION IF NOT EXISTS pg_stat_statements;", href: "https://neon.com/docs/introduction/monitoring" },
    { name: "Workflow CLI", job: "Find the Sunday plan run for one user and week", cmd: "npx workflow inspect runs", href: "https://workflow-sdk.dev/docs/observability" },
    { name: "Grok Bot", job: "xAI's AI teammate, here as the SRE that drafts triage notes", cmd: "x.ai/bot", href: "https://docs.x.ai/grok-bot" },
  ],
  deck: DECK,
};
