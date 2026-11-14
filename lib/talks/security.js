import { ABOUT_SLIDE, JOIN_ROOM_SLIDE, PARTNER_SLIDE, FOUNDER_WEEKEND_SLIDE, COMMUNITY_CLOSE_SLIDE, takeHomeSlide, WORKUITY } from "./shared.js";

const SLUG = "security";

const SECURITY_MD = `# SECURITY.md · What's for Dinner

## Rules
- Every route checks who is calling on the server. Hiding a link or a URL is not a check.
- Every route that costs money (AI, email) has a rate limit.
- Every webhook is verified before it is read. Unsigned, invalid or stale requests get a 400. A repeated svix-id gets a 200 and no action, so the sender stops retrying.
- The app connects to Postgres as a role that cannot bypass row level security.
- No plaintext secrets or third-party tokens in the database, the repo, logs or chat.
- Personal data stays out of logs, analytics events and error messages. Use ids.

## Threats (worst first)
1. Someone scripts /api/dinners or the photo route and runs up the AI Gateway bill
2. Credential stuffing or brute force on sign-in
3. A forged webhook marks real users as bounced, or a forged cron call sends email
4. A bug in one query shows one user's dinners or favorites to another
5. A leaked key in the repo, a log or a screenshot
6. Emails from the leads table end up in PostHog, logs or a support screen

## Controls per route
| Route | Who | Auth check | Rate limit | Notes |
|---|---|---|---|---|
| /api/auth/* | anyone | Better Auth | Better Auth limiter, database storage, sign-in 3 per 10s | Generic error messages |
| POST /api/dinners | signed in | session | 20 per hour per user (Upstash), Firewall rule per IP | Validate ingredients with Zod |
| POST /api/photo | signed in | session | 10 per hour per user, Firewall rule per IP | Size and type checks before the AI call |
| POST /api/leads | anyone | none | 5 per hour per IP | Insert only, no reads |
| GET /api/cron/*, GET /api/at-risk | Vercel Cron | Bearer CRON_SECRET, constant-time compare | n/a | Excluded from Firewall deny rules |
| POST /api/plans/[id]/approve | plan owner | session plus owner check before resumeHook | n/a | A hook token is not authorization |
| POST /api/webhooks/resend | Resend | Svix signature on the raw body | n/a | 400 if unsigned, invalid or stale. Store svix-id; a repeat gets 200 and no action |
| /admin (later) | admins | role check on the server | n/a | Firewall allow list by IP. Reads through the server-only connection, after the role check |

## Edge rules (Vercel Firewall)
- Rate limit POST /api/dinners and /api/photo by IP, 429 on exceed
- Deny paths ending in .env or .bak, or containing /.git
- Deny /admin for any IP not on the allow list
- Every rule starts as Log for 10 minutes, then switches to its real action
- Exclude /api/cron and /api/at-risk from every deny or challenge rule

## Data
- App role \`app_user\`: no BYPASSRLS, owns no tables, only the grants it needs
- Row level security, enabled and forced, on dinners, favorites and plans: \`user_id = current_setting('app.user_id', true)\`
- Each request sets \`app.user_id\` from the Better Auth session inside a transaction, never from the request body. That needs Neon's Pool over WebSockets or \`sql.transaction\`, not single HTTP queries
- Cron jobs, workflow steps and the admin console read across users through one server-only connection, \`lib/db-privileged.ts\`. Every caller is listed here
- Leads: app_user can insert, not read. Support reads \`leads_masked\` (j***@example.com)
- Allergies or dietary notes, if stored: treat them like PHI. Owner and server only, never in analytics or AI logs

## Secrets
- Names only in this file. Values live in 1Password and in Vercel as Secret environment variables
- Local dev: \`op run --env-file=.env.tpl -- npm run dev\`
- Stored third-party tokens: AES-256-GCM in the app, key \`APP_ENCRYPTION_KEY\`, versioned for rotation
- Rotation table: key, where it lives, who rotates it, last rotated

## Review
- Claude Code: /security-review before every push
- Cursor Bugbot on every PR, with .cursor/BUGBOT.md built from this file
- A second model from a different lab audits the diff against this file

## Done when
- [ ] The 21st dinner search in an hour gets a 429 (25 calls: 20 pass, 5 get a 429)
- [ ] The 4th sign-in attempt in 10 seconds gets a 429, proven on a Vercel preview
- [ ] An unsigned webhook gets a 400, and a repeated svix-id gets a 200 with no second action
- [ ] Signed in as user A, user B's dinners return nothing, proven on a Neon branch
- [ ] No email, name or ingredient list in logs or PostHog events
- [ ] No secret in the repo or its history, and every key is a Vercel Secret
`;

const DEMO_LABEL = "claude · ~/whats-for-dinner";

const DECK = {
  title: "Lock It Down",
  includeRoiSlide: false,
  includeShowcaseSlide: false,
  visual: true,
  slides: [
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "harbor", dark: true, logo: true, kicker: "CLAUDE CODE BUILD NIGHT · PART 9", lines: ["Lock It"], em: "Down", body: "Tonight, we harden every door. Every night stands on its own." },
    },
    ABOUT_SLIDE,
    JOIN_ROOM_SLIDE,
    PARTNER_SLIDE,
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "fleet", dark: true, kicker: "THE IDEA", lines: ["Every route is a front door."], em: "Lock each one." },
    },
    {
      title: "Hidden is not secure",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "HIDDEN", title: "\"Nobody knows that URL.\"" },
      after: { kicker: "LOCKED", title: "Checked on every request.", em: "Limited, signed, logged." },
      items: [],
    },
    {
      title: "Tonight",
      layout: "checklist",
      diagram: "result",
      items: [{ title: "Map" }, { title: "Limit" }, { title: "Lock" }, { title: "Review" }],
    },
    {
      title: "Tonight's checklist",
      layout: "checklist",
      diagram: "doc",
      doc: {
        file: "SECURITY.md",
        sections: [
          { h: "Threats", lines: ["A scripted AI bill. A forged webhook. A leaked key."] },
          { h: "Controls", lit: true, lines: ["Every route: who, check, limit."] },
          { h: "Data", lines: ["Row level security. Masked emails. Encrypted tokens."] },
          { h: "Done when", lines: ["[ ] The 21st search gets a 429", "[ ] Forged webhooks get a 400", "[ ] User A can't see user B"] },
        ],
      },
    },
    {
      title: "Map every door",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "out", text: "✓ 9 routes, 3 cost money, 1 has no auth check" }, { who: "claude", text: "Who should be able to call /api/leads?" }, { who: "you", text: "Anyone, but insert only." }, { who: "out", text: "✓ Wrote SECURITY.md: 6 threats, 8 routes" }] },
      promptLabel: "Copy · write SECURITY.md",
      prompt: "Read SPEC.md, WORKFLOW.md and GROWTH.md, then the code under app/api, app/actions and lib. We're hardening What's for Dinner before more people use it.\n\n1. List every route and server action: what it does, who may call it, what it reads or writes, and what it costs (AI calls, emails).\n2. Interview me one question at a time about anything the code doesn't tell you, and wait for each answer.\n3. Write SECURITY.md with these sections: Rules, Threats (worst first), Controls per route (a table: route, who, auth check, rate limit, notes), Data (which columns hold personal data and who may read them), Secrets (names only, and where each one lives), Review, Done when.\n\nNever open, print or paste the contents of any .env file or any secret value. Refer to secrets by name only. Don't change any code. Stop and wait for my OK.",
      promptPreview: "Map every route, what it costs and who may call it, interview me, then write SECURITY.md. No secrets, no code changes. Wait for my OK.",
    },
    {
      title: "Limit what costs money",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "out", text: "✓ Better Auth limiter · database storage" }, { who: "out", text: "✓ lib/ratelimit.ts · 20 searches an hour per user" }, { who: "out", text: "200 ×20 · 429 ×5" }, { who: "claude", text: "The UI shows \"Try again in 12 minutes.\"" }] },
      promptLabel: "Copy · rate limits in the app",
      prompt: "Read SECURITY.md, section Controls per route. Check the current docs first: better-auth.com/docs/concepts/rate-limit and upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted. Stop after each step.\n\n1. Better Auth: turn on rateLimit with storage: \"database\", because in-memory counters don't hold across serverless instances. Keep its stricter sign-in default and add customRules for sign-up and password reset. Two catches from the docs: the limiter is off in development by default, and server-side auth.api calls skip it. Check that sign-in goes through the Better Auth client or the /api/auth routes, not auth.api inside a server action. Read the IP address section, then check Vercel's docs for which client IP header Vercel sets, and configure ipAddressHeaders to match. Database storage needs a migration: show it to me before applying it.\n2. Tell me to create an Upstash Redis database myself and add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env.local and to the Vercel project. Wait until I tell you it's done.\n3. Run npm install @upstash/ratelimit @upstash/redis. In lib/ratelimit.ts create sliding-window limiters: 20 dinner searches an hour per user id, 10 fridge photos an hour per user id, 5 guide signups an hour per IP.\n4. Call them at the top of /api/dinners, the photo route and the leads route, before any AI call or database write. Return 429 with a Retry-After header and a friendly message the UI shows.\n5. Write a small script that calls /api/dinners 25 times as my test user on localhost and prints the status codes: 20 should pass and the 21st onward get a 429. Then prove the sign-in limit, 4 attempts in 10 seconds with the 4th getting a 429, on a Vercel preview, or locally with rateLimit enabled: true set temporarily, then remove it. Everyone on this Wi-Fi shares one IP, so test per-user limits and don't hammer per-IP limits on a shared app. Run it and stop.",
      promptPreview: "Turn on Better Auth's limiter with database storage, wait while I set up Upstash, then limit the AI and signup routes per user and prove it with 25 calls.",
      takeaway: "better-auth.com/docs/concepts/rate-limit",
    },
    {
      title: "Rules at the edge",
      layout: "checklist",
      diagram: "setup",
      terminal: { label: "Vercel · Firewall", kicker: "CUSTOM RULES", lines: ["POST /api/dinners · per IP · 429", "*.env, */.git*, *.bak · Deny", "/admin · not on my list · Deny"], body: "Every rule starts as Log." },
      items: [
        { title: "Claude writes FIREWALL.md", body: "Each rule's conditions, action and undo." },
        { title: "You publish it", body: "In the dashboard, after 10 minutes on Log." },
        { title: "Cron stays open", body: "Exclude the cron routes from deny rules." },
      ],
      promptLabel: "Copy · Firewall rules and IP lists",
      prompt: "Read SECURITY.md. We're adding rules in the Vercel Firewall, which I set up myself in the dashboard. Read vercel.com/docs/vercel-firewall/vercel-waf first, including rate limiting, custom rules and IP blocking, and check the plan limits for our plan.\n\n1. Write FIREWALL.md with each rule I should add: name, If conditions, Then action, and how to undo it. Include:\n   - A rate limit on POST requests to /api/dinners and the photo route, keyed by IP. Hobby allows one rate limit rule, so put both paths in it.\n   - A deny rule for paths ending in .env or .bak, or containing /.git (so /.git/config is caught too).\n   - An allow list for /admin: deny any request to /admin from an IP that isn't on my list. We build the admin console in a later part.\n   - Where to block one abusive IP or CIDR range under IP Blocking.\n   - Exclude /api/cron and /api/at-risk (the at-risk email cron from Part 7) from every deny or challenge rule, so Vercel Cron still runs.\n   - Note that everyone on one Wi-Fi shares an IP, so a per-IP limit tested from a room trips for everyone at once.\n2. Every rule starts with the Log action. Tell me how to watch it in the Firewall overview for 10 minutes before switching it to 429 or Deny.\n3. Tell me to add the rules, review the changes and publish them. Wait until I tell you it's done.\n4. Add an Edge rules section to SECURITY.md listing what's live. Never ask me for a Vercel token, and never put my IP addresses in a committed file.",
      promptPreview: "Write FIREWALL.md: an IP rate limit on the AI routes, a deny rule, an /admin allow list, cron excluded, all starting as Log. I publish them, then you update SECURITY.md.",
      takeaway: "vercel.com/docs/vercel-firewall/vercel-waf",
    },
    {
      title: "Verify every webhook",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "out", text: "unsigned request → 400" }, { who: "out", text: "repeated svix-id → 200, skipped" }, { who: "out", text: "✓ cron secret · timingSafeEqual" }, { who: "claude", text: "The approve route checks the plan owner before resumeHook." }] },
      promptLabel: "Copy · signed webhooks and secret checks",
      prompt: "Read SECURITY.md. We're receiving Resend webhooks for bounces and complaints, so we stop emailing those addresses. Read resend.com/docs/webhooks/verify-webhooks-requests first. Stop after each step.\n\n1. Tell me to create the webhook in Resend pointing at /api/webhooks/resend, and to add its signing secret as RESEND_WEBHOOK_SECRET to .env.local and to the Vercel project as a Secret. Wait until I tell you it's done.\n2. Build the route: read the raw body as text before any JSON parsing, verify it with resend.webhooks.verify using the svix-id, svix-timestamp and svix-signature headers, and return 400 on any failure without saying why.\n3. Replays: check whether the verifier already rejects old timestamps. If it doesn't, reject anything more than 5 minutes old with a 400. Store each svix-id with a unique constraint. A verified request whose svix-id is already stored returns 200 and does nothing: Resend retries any delivery that doesn't get a 2xx, so a 400 here would make it keep retrying. Show me the migration before applying it.\n4. On bounce and complaint events (check Resend's event names), mark that address suppressed, and make every send check it first.\n5. Change the cron routes' CRON_SECRET check to crypto.timingSafeEqual, comparing lengths first.\n6. Read the Workflow SDK hooks docs in node_modules/workflow/docs. A hook token is not authorization, so confirm the plan approval route takes the user from the Better Auth session and checks they own the plan before calling resumeHook.\n7. Send one unsigned request with curl and show me the 400. Then replay one signed test event from the Resend dashboard and show me the repeat gets a 200 with no second suppression or row. Stop.",
      promptPreview: "Verify Resend webhooks on the raw body, reject stale requests, skip repeats with a 200, compare the cron secret in constant time, and check the approval route before resumeHook.",
      takeaway: "resend.com/docs/webhooks/verify-webhooks-requests",
    },
    {
      title: "Rows only their owner sees",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "claude", text: "The app connects as the owner role. It bypasses RLS." }, { who: "out", text: "Proposed: app_user, 3 policies, FORCE on 3 tables" }, { who: "you", text: "Run it on the branch." }, { who: "out", text: "user A → user B's dinners: 0 rows" }] },
      promptLabel: "Copy · row level security on Neon",
      prompt: "Read SECURITY.md, section Data. Then read neon.com/docs/guides/rls-query-execution and the Postgres row security docs. Propose everything first; don't apply anything until I say so. Stop after each step.\n\n1. Check which role the app connects as today. Neon's owner role has BYPASSRLS, so policies would be ignored. Propose a login role app_user with no BYPASSRLS that owns no tables, and list exactly the grants it needs: what Better Auth's tables need, SELECT, INSERT, UPDATE and DELETE on dinners, favorites and plans, and INSERT only on leads. Migrations keep using the owner role.\n2. Write the migration: ENABLE and FORCE ROW LEVEL SECURITY on dinners, favorites and plans, with policies that match user_id to current_setting('app.user_id', true). Show it to me. Don't run it.\n3. Check which Neon driver the app uses. set_config(..., true) only lasts for one transaction, so the HTTP neon() function's single queries won't carry it. Use Pool over WebSockets for these queries, or sql.transaction([...]) with the set_config as the first query. Then write lib/db-as-user.ts: every user-facing query runs in a transaction that first calls set_config('app.user_id', userId, true), with the id taken from the Better Auth session, never from the request body. List the cron jobs, workflow steps and the admin console (Part 11) that read across users. They use lib/db-privileged.ts: one server-only connection (import \"server-only\") that client code can never import. Add every caller to SECURITY.md.\n4. Tell me to create a Neon branch, create the app_user role and its password myself, and put its connection string in .env.local as DATABASE_URL_APP. Wait until I tell you it's done.\n5. Run the migration on the branch only. Prove that signed in as user A, user B's dinners and favorites return nothing. Then tell me the steps for production and stop.",
      promptPreview: "Propose a least-privilege app role, forced RLS policies and per-request set_config, wait while I create the role on a Neon branch, then prove user A can't see user B.",
      takeaway: "neon.com/docs/guides/rls-query-execution",
    },
    {
      title: "Keep personal data out of sight",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "out", text: "⚠ lib/ai.ts:41 logs the request body" }, { who: "out", text: "⚠ signed_up sends email to PostHog" }, { who: "out", text: "✓ leads_masked · j***@gmail.com" }, { who: "claude", text: "Events now carry user ids only." }] },
      promptLabel: "Copy · mask and minimize PII",
      prompt: "Read SECURITY.md, section Data, and GROWTH.md, section Events.\n\n1. List every place an email, name, IP address, ingredient list or dietary note could leak: logs, error messages, PostHog events, AI request logs, emails. Show me file and line only, never the values.\n2. Propose a view leads_masked that shows each email as its first letter, three stars and the domain, plus the date and source. Support screens and the admin console will read the view, never the table. Show me the migration before applying it.\n3. PostHog: check posthog.com/docs/libraries/js/config, add email and name to property_denylist, and add a before_send that drops any property whose key contains email, phone or ingredients. Identify users by id only.\n4. Replace any log of a request body or user object with a log of ids.\n5. If we store allergies or dietary needs, treat them like PHI: only the owner and the server read them, and they never reach analytics, logs or error reports.\n\nShow me the diff and stop.",
      promptPreview: "Find every PII leak by file and line, add a masked leads view, strip emails from PostHog with property_denylist and before_send, and log ids only.",
      takeaway: "posthog.com/docs/product-analytics/privacy",
    },
    {
      title: "Stored is not safe",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "PLAINTEXT", title: "One leaked backup, every token." },
      after: { kicker: "ENCRYPTED", title: "Useless without the key.", em: "And the key lives elsewhere." },
      items: [],
      promptLabel: "Copy · encrypt tokens at rest",
      prompt: "Read SECURITY.md, section Secrets. No token or credential we store goes in the database as plaintext. Stop after each step.\n\n1. Better Auth: if we add social sign-in, set account.encryptOAuthTokens to true. Check better-auth.com/docs/reference/options for the current option first.\n2. Write lib/crypto.ts with encrypt and decrypt using Node's crypto and aes-256-gcm: a random 12-byte IV per value, the auth tag stored with the ciphertext, and a key version prefix such as v1: so we can rotate keys.\n3. The key comes from APP_ENCRYPTION_KEY. Tell me to generate it myself with openssl rand -base64 32 and add it to .env.local and to the Vercel project as a Secret. Wait until I tell you it's done. Never print it or read it back.\n4. Find any column that stores a third-party token or key today. Propose a migration that encrypts existing rows in batches, and show it to me before running anything.\n5. Write ROTATION.md: add a v2 key, re-encrypt rows in batches, then retire v1.\n6. Tell me in two lines why we encrypt in the app here instead of with pgcrypto: the key would travel inside SQL that can end up in query logs. Stop.",
      promptPreview: "AES-256-GCM in lib/crypto.ts with a versioned key I generate myself, encrypted OAuth tokens, a proposed migration for old rows and a rotation plan.",
    },
    {
      title: "Secrets stay secret",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "out", text: "✓ .env*.local ignored · never committed" }, { who: "out", text: "✓ .env.tpl · 9 op:// references" }, { who: "out", text: "⚠ RESEND_API_KEY is Config, not Secret" }, { who: "claude", text: "Re-save it as a Secret, then rotate it." }] },
      promptLabel: "Copy · secrets audit",
      prompt: "Read SECURITY.md, section Secrets. Never print a secret value. Report key names, files and line numbers only.\n\n1. Check .gitignore covers .env and .env*.local, and search the git history by filename for any committed .env file. If one was ever committed, list the key names I need to rotate.\n2. Search the code for hardcoded keys and tokens by pattern. Report locations only.\n3. Write .env.tpl with a 1Password secret reference for every key name, in the form op://<vault>/<item>/<field>, using the vault plan from Part 1, so I can run: op run --env-file=.env.tpl -- npm run dev\n4. Write me a checklist: in Vercel, make sure every API key, token and password is a Secret environment variable, not Config; in GitHub, check what secret scanning and push protection cover for this repo, since public and private repos differ. Wait until I tell you it's done.\n5. Add a Rotation table to SECURITY.md: each key name, where it lives, who rotates it and when it was last rotated. Stop.",
      promptPreview: "Check .gitignore and git history, find hardcoded keys by location only, write a 1Password .env.tpl, and give me the Vercel and GitHub checklist.",
      takeaway: "1password.dev/cli",
    },
    {
      title: "A second model audits the diff",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "npx tsx scripts/audit-diff.ts", lines: [{ who: "out", text: "deepseek/deepseek-v4.1-flash · 14 files" }, { who: "out", text: "HIGH · app/api/photo/route.ts:22 · no size limit" }, { who: "out", text: "LOW · lib/email.ts:9 · logs recipient" }, { who: "claude", text: "Both are real. The size check goes before the AI call." }] },
      promptLabel: "Copy · the cross-lab audit",
      prompt: "Read SECURITY.md. We're adding a second opinion from a cheaper model from a different lab: \"deepseek/deepseek-v4.1-flash\" through AI Gateway. Check the AI Gateway model list first that the ID is still current.\n\n1. Write scripts/audit-diff.ts: run git fetch, then get the diff with git diff origin/main...HEAD (ask me first if our default branch isn't main, and warn me if the diff is empty), drop any .env file, key file or lockfile, and send the rest with SECURITY.md to the model using generateText with output: Output.object and a Zod schema: findings, each with file, line, severity, which threat in SECURITY.md it maps to, and a suggested fix. If structured output fails with this model, ask for JSON in the prompt and parse it with the same Zod schema.\n2. Print the findings as a table, and exit with a non-zero code on any high-severity finding.\n3. AI_GATEWAY_API_KEY is already in .env.local. Don't print it.\n4. Run it on this branch. Check every finding against the code yourself and tell me which are real and which are noise. Don't fix anything yet. Stop.",
      promptPreview: "A script sends the branch diff and SECURITY.md to DeepSeek V4.1 Flash via AI Gateway for typed findings, then Claude checks each one against the code.",
      takeaway: "vercel.com/ai-gateway/models",
    },
    {
      title: "A second set of eyes on every PR",
      layout: "checklist",
      diagram: "skills",
      hub: "Every PR",
      hubCaption: "Three reviewers",
      hubNote: "Rules from SECURITY.md\nin .cursor/BUGBOT.md",
      items: [
        { title: "Bugbot", body: "Cursor reviews each PR for bugs and security issues." },
        { title: "Security Review", body: "Cursor's Security Reviewer agents, set up in Automations." },
        { title: "/security-review", body: "You type it in Claude Code before every push." },
      ],
      promptLabel: "Copy · Bugbot rules and the review habit",
      promptDestination: "Claude Code, then the Cursor dashboard and your PR",
      prompt: "Read SECURITY.md. Read cursor.com/docs/bugbot first.\n\n1. Write .cursor/BUGBOT.md from SECURITY.md: the threats, the rules every route follows, and what to flag: a route without a session check, a costly route without a rate limit, a webhook read before its signature is verified, personal data in logs or events, a user query that doesn't go through lib/db-as-user.ts, and any secret in code.\n2. Tell me to connect this repo to Bugbot in the Cursor dashboard, and to set up Security Review in Automations if our plan includes Cloud Agents. Wait until I tell you it's done.\n3. Open a small PR that adds .cursor/BUGBOT.md. Tell me to comment bugbot run on it, and wait until I tell you it's done.\n4. Add to the Review section of SECURITY.md: I type /security-review in Claude Code myself before every push. Check every Done when item in SECURITY.md, tell me which pass, and stop.",
      promptPreview: "Turn SECURITY.md into .cursor/BUGBOT.md, wait while I connect Bugbot, trigger it on a PR, then check every Done when item.",
      takeaway: "Also in the series: Part 10, Production Monitoring. Know the moment it breaks.",
    },
    takeHomeSlide(SLUG),
    FOUNDER_WEEKEND_SLIDE,
    COMMUNITY_CLOSE_SLIDE,
  ],
};

export const TALK = {
  slug: SLUG,
  series: 9,
  toolsLede: "The guards we add on the night, one job each.",
  eventTitle: "Lock It Down",
  key: "Down",
  summary: "Harden the app before anyone tests it for you.",
  copy: "Tonight Claude Code hardens it: rate limits on the AI and auth routes, Firewall rules, signed webhooks, row level security on Neon, encrypted tokens, clean secrets and a second set of eyes on every PR.",
  ...WORKUITY,
  rsvp: [],
  steps: [
    { title: "Map", body: "Every route, who may call it, what it costs." },
    { title: "Limit", body: "Rate limits in the app and at the edge." },
    { title: "Lock", body: "Signed webhooks, row level security, encrypted secrets." },
    { title: "Review", body: "Bugbot, /security-review and a second model." },
  ],
  stepsLede: "A short AI news briefing, then we harden What's for Dinner route by route with Claude Code, then five-minute demos from the room.",
  closing: ["Working is not safe.", "Lock it down."],
  example: {
    name: "What's for Dinner",
    heading: ["Tonight's", "checklist."],
    lede: "The security checklist we build on the night: threats worst first, the controls on every route, and the checks that prove them. Copy it and swap in your own routes.",
    file: "SECURITY.md",
    pitch: "Type what's in your fridge. Get three dinners you can make tonight.",
    jobLabel: "The job",
    job: "Make every route checked, limited and logged, before strangers find it.",
    stack: ["Vercel Firewall", "Upstash", "Better Auth", "Neon", "Resend", "1Password", "Bugbot", "AI Gateway"],
    doneLabel: "Done when",
    done: [
      "The 21st search in an hour gets a 429",
      "Unsigned webhooks get a 400, repeats do nothing",
      "User A can't read user B's dinners",
      "No emails or ingredients in logs or analytics",
      "No secret in the repo, every key a Vercel Secret",
    ],
    spec: SECURITY_MD,
    specLabel: "The full security checklist",
    specDestination: "a SECURITY.md file in your repo",
  },
  tools: [
    { name: "Vercel Firewall", job: "Rate limit, deny and allow-list rules at the edge, plus IP blocking", cmd: "vercel.com/dashboard", href: "https://vercel.com/docs/vercel-firewall/vercel-waf" },
    { name: "Upstash Ratelimit", job: "Per-user limits on the AI routes from your own code", cmd: "npm install @upstash/ratelimit @upstash/redis", href: "https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted" },
    { name: "Resend webhooks", job: "Verify the Svix signature on every webhook with resend.webhooks.verify", cmd: "npm install resend", href: "https://resend.com/docs/webhooks/verify-webhooks-requests" },
    { name: "1Password CLI", job: "Load secrets from op:// references into one process", cmd: "op run --env-file=.env.tpl -- npm run dev", href: "https://www.1password.dev/cli/secrets-environment-variables/" },
    { name: "Vercel CLI", job: "Store keys as write-only Secret environment variables", cmd: "vercel env add APP_ENCRYPTION_KEY production --sensitive", href: "https://vercel.com/docs/environment-variables/sensitive-environment-variables" },
    { name: "DeepSeek V4.1 Flash", job: "A cheaper model from a different lab audits the diff, through AI Gateway", cmd: "deepseek/deepseek-v4.1-flash", href: "https://vercel.com/ai-gateway/models" },
    { name: "Cursor Bugbot", job: "Reviews every PR for bugs and security issues, with rules in .cursor/BUGBOT.md", cmd: "bugbot run", href: "https://cursor.com/docs/bugbot" },
    { name: "Claude Code security review", job: "A security pass over the changes on your branch, before you push", cmd: "/security-review", href: "https://code.claude.com/docs/en/security" },
  ],
  deck: DECK,
};
