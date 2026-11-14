import { ABOUT_SLIDE, JOIN_ROOM_SLIDE, PARTNER_SLIDE, FOUNDER_WEEKEND_SLIDE, COMMUNITY_CLOSE_SLIDE, takeHomeSlide, WORKUITY } from "./shared.js";

const SLUG = "internal-tool";

const TOOL_SPEC_MD = `# Desert Bloom Landscaping - TOOL-SPEC.md

Purchase requests, moved out of "Purchase Requests 2026.xlsx" and the office inbox into one small internal app. 30 people, 6 crews, one office in Phoenix.

## Today
Crew leads email the office manager when they need equipment or supplies. She copies each email into the spreadsheet, forwards it to the ops manager, and he replies "approved" or "no". Requests get lost, nobody knows the status, and there's no record of who approved what.

## Users and roles
Better Auth's admin plugin with three custom roles:
- \`requester\`: crew leads. Create requests, see only their own. The default role.
- \`approver\`: the ops manager. Sees every request, approves, rejects or asks for info.
- \`admin\`: the office manager and the owner. Everything an approver can do, plus add people, set roles, import the sheet and mark requests ordered and received.

There is no public sign-up. Admins add people from the People screen. The first admin is created from the terminal.

## The workflow
| From | To | Who | Note required |
|---|---|---|---|
| (new) | submitted | requester, admin | no |
| submitted | needs_info | approver, admin | yes |
| needs_info | submitted | the requester | no |
| submitted | approved | approver, admin | no |
| submitted | rejected | approver, admin | yes |
| approved | ordered | admin | no |
| ordered | received | admin, the requester | no |
| submitted, needs_info | cancelled | the requester | no |

- Requests with an estimated cost over $2,500 can only be approved by an admin.
- Nobody approves their own request.

## Screens
1. New request: item, quantity, vendor, estimated cost, needed by, crew, why
2. My requests: the requester's own requests, newest first, with status
3. Queue (approver, admin): submitted and needs_info first, oldest first, filter by crew and status
4. Request page: the details, the timeline from request_events, the actions this person is allowed to take, and the AI helper
5. People (admin): add a person, set their role, ban someone who left

## Data
- \`requests\`: id, requester_id, crew, item, quantity, vendor, est_cost_cents, needed_by, reason, status, created_at, updated_at
- \`request_events\`: id, request_id, actor_id, action, from_status, to_status, note, created_at
- Better Auth's own tables for users, sessions and roles

## Permissions
| Action | requester | approver | admin |
|---|---|---|---|
| Create a request | yes | no | yes |
| Read a request | own only | all | all |
| Approve, reject, ask for info | no | yes, up to $2,500 | yes |
| Mark ordered | no | no | yes |
| Use the AI helper | no | yes | yes |
| Add people, set roles | no | no | yes |
| Import the CSV | no | no | yes, from the terminal |

## Rules
- The server decides. Every page, server action and route handler checks the session and the role on the server, through one module, lib/requests.ts. Hiding a button is not a check.
- Row-level access: a requester's queries are always scoped to requester_id = their own id. Asking for anyone else's request by ID returns a 404.
- Every status change goes through one function that writes a request_events row in the same transaction. Nothing updates or deletes an event.
- No secrets in the browser. DATABASE_URL, BETTER_AUTH_SECRET and AI_GATEWAY_API_KEY stay in server code and .env.local.

## Audit trail
The request page shows every event: who, what, from which status to which, the note, and when. Imported rows get one \`imported\` event with the status they had in the sheet.

## AI helper
"Summarize and draft" on the request page, for approvers and admins. It reads the request and its timeline (no emails, no user IDs) and returns a three-line summary and a short draft reply to the requester. A person edits the draft and clicks Post reply, or discards it. The AI never changes a status and never sends anything on its own. Both outcomes are logged.

## Import
The sheet's columns: Date, Requested by, Crew, Item, Qty, Vendor, Est. cost, Needed by, Status, Approved by, Notes.
- Match Requested by and Approved by to people by name or email. Stop on any name that doesn't match.
- Map statuses: New -> submitted, OK / Approved -> approved, No -> rejected, Ordered -> ordered, Got it -> received.
- Dry run first, then one transaction. Running it twice creates no duplicates.
- The CSV lives in data/, which is never committed.

## Out of scope
Email notifications, budgets, vendor accounts, receipts and photo uploads, a mobile app.

## Done when
- [ ] The spreadsheet's rows are in the app, and the counts by status match the CSV
- [ ] A crew lead submits a request, the ops manager approves it, the office marks it ordered, and the timeline shows all three
- [ ] A requester asking for someone else's request gets a 404, proven by a Playwright test
- [ ] An approver can't approve over $2,500 or their own request, proven by a test
- [ ] The AI draft is only posted after a person clicks Post reply
- [ ] It's live on Vercel, sign-up is off, and preview deployments are locked to the Vercel team
`;

const DECK = {
  title: "Replace the Spreadsheet",
  includeRoiSlide: false,
  includeShowcaseSlide: false,
  visual: true,
  slides: [
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "workbench", dark: true, logo: true, kicker: "SHIP AI TALKS", lines: ["Replace the"], em: "spreadsheet.", body: "Leave with a spec, eight prompts and an app your team signs in to." },
    },
    ABOUT_SLIDE,
    JOIN_ROOM_SLIDE,
    PARTNER_SLIDE,
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "harbor", dark: true, kicker: "THE IDEA", lines: ["Every team runs on a sheet and an inbox."], em: "Give it one small app." },
    },
    {
      title: "Out of the inbox",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "SHEET + EMAIL", title: "\"Did anyone approve this?\"" },
      after: { kicker: "ONE APP", title: "One queue, one status.", em: "Every decision on the record." },
      items: [],
    },
    {
      title: "Tonight",
      layout: "checklist",
      diagram: "result",
      items: [{ title: "Spec" }, { title: "Build" }, { title: "Protect" }, { title: "Ship" }],
    },
    {
      title: "Tonight's example",
      layout: "checklist",
      diagram: "doc",
      doc: {
        file: "TOOL-SPEC.md",
        sections: [
          { h: "Desert Bloom Landscaping", lines: ["Purchase requests, out of a spreadsheet and an inbox."] },
          { h: "Roles", lines: ["requester, approver, admin. No public sign-up."] },
          { h: "Rules", lit: true, lines: ["The server decides. Every change leaves a record."] },
          { h: "Done when", lines: ["[ ] The sheet's rows are in the app", "[ ] A requester can't see anyone else's"] },
        ],
      },
    },
    {
      title: "Write TOOL-SPEC.md first",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/requests", lines: [{ who: "claude", text: "What happens to a request today?" }, { who: "you", text: "Crew lead emails Dana. She logs it. Marco replies yes." }, { who: "claude", text: "Who should see a crew lead's requests?" }, { who: "out", text: "✓ Wrote TOOL-SPEC.md: 3 roles, 7 statuses, 5 screens" }] },
      promptLabel: "Copy · the TOOL-SPEC.md interview",
      prompt: "I want to replace one spreadsheet-and-email process at work with a small internal app. Interview me one question at a time and wait for each answer:\n- What happens today: who sends what to whom, and where is it tracked?\n- Who uses it, and what roles do they need? Three at most.\n- What is the one workflow, from request to done, with every status and who moves each one?\n- What are the spreadsheet's columns? I'll paste the header row.\n- Who can see which rows, and who can change what?\n- What should anyone be able to find out later: who decided what, when and why?\n- Where would one AI helper save time, with a person approving what it writes?\n\nThen write TOOL-SPEC.md with these sections: Today, Users and roles, The workflow (a table: from, to, who, note required), Screens, Data, Permissions (a table of actions by role), Rules, Audit trail, AI helper, Import, Out of scope, Done when.\n\nThe Rules section must say: the server checks the session and role on every page, action and route; requesters only ever load their own rows; every status change writes an audit row in the same transaction; there is no public sign-up, admins add people; the AI drafts and a person decides; no secrets in the browser.\n\nStop and wait for my OK before writing any code.",
      promptPreview: "Interview me about the process, roles, workflow, columns and permissions, then write TOOL-SPEC.md with rules and Done when. Wait for my OK.",
    },
    {
      title: "Set up the project",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/requests", lines: [{ who: "out", text: "✓ Next.js app created" }, { who: "out", text: "✓ TOOL-SPEC.md moved into requests" }, { who: "claude", text: "Run neon init in requests, then restart me there." }] },
      promptLabel: "Copy · set up the project",
      prompt: "Read TOOL-SPEC.md. Set up the project one step at a time and stop after each step.\n\n1. Create a Next.js app with TypeScript, Tailwind CSS and the App Router:\nnpx create-next-app@latest requests --ts --tailwind --app --eslint --use-npm --yes\n2. Move TOOL-SPEC.md into requests.\n3. Stop and tell me to do three things myself, then wait until I tell you it's done:\n   - cd requests\n   - run npx neon@latest init, which sets up Neon's agent tooling for this folder, links a project and writes DATABASE_URL to .env.local. If it asks me to log in or link, I run the commands it prints\n   - start Claude Code again inside requests\n\nDo not build any features yet.",
      promptPreview: "Create the Next.js app, move TOOL-SPEC.md into it, then stop so I can run neon init there and restart Claude Code.",
      takeaway: "neon.com/docs/reference/cli-init",
    },
    {
      title: "Sign-in with roles",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/requests", lines: [{ who: "out", text: "✓ Drizzle on Neon, transactions on" }, { who: "out", text: "✓ Better Auth: email and password, sign-up off" }, { who: "out", text: "✓ Roles: requester, approver, admin" }, { who: "claude", text: "Your turn: create the first admin in your terminal." }] },
      promptLabel: "Copy · database, auth and roles",
      prompt: "Read TOOL-SPEC.md. Add the database and sign-in with roles. Read the current docs before writing code: better-auth.com/docs/plugins/admin and better-auth.com/docs/adapters/drizzle. Stop after each step.\n\n1. Database: install drizzle-orm and @neondatabase/serverless, and drizzle-kit as a dev dependency. Connect with DATABASE_URL from .env.local, using Drizzle's neon-serverless driver so transactions work. Never print the connection string.\n2. Auth: install better-auth and the Drizzle adapter its docs name. Turn on email and password with disableSignUp: true, so nobody can create their own account. Generate BETTER_AUTH_SECRET with a command that writes it to .env.local without printing it, and set BETTER_AUTH_URL to http://localhost:3000.\n3. Roles: add the admin plugin with the custom roles from TOOL-SPEC.md, using createAccessControl. Add a request resource with create, read_own, read_all, decide and fulfill. Keep the default admin statements for admin. Set defaultRole to requester. Pass the same ac and roles to adminClient().\n4. Generate the auth schema with npx auth@latest generate, then the Drizzle migration. Show me the changes before applying them.\n5. Tell me to create the first admin myself in my terminal with:\n   npx auth@latest create-admin --email <my email> --name \"<my name>\" --role admin\n   Wait until I tell you it's done.\n\nDon't build screens yet. Never print a secret or put one in tracked files or chat.",
      promptPreview: "Add Drizzle on Neon, Better Auth with sign-up off, and the admin plugin with three custom roles. Then stop so I can create the first admin.",
      takeaway: "better-auth.com/docs/plugins/admin",
    },
    {
      title: "Three roles, one check",
      layout: "checklist",
      diagram: "skills",
      hub: "lib/requests.ts",
      hubCaption: "ON THE SERVER",
      hubNote: "Every page and action\nasks the same module.",
      items: [
        { title: "Requester", body: "Creates requests. Only ever loads their own." },
        { title: "Approver", body: "Sees the queue. Approves up to $2,500." },
        { title: "Admin", body: "Adds people, imports the sheet, marks ordered." },
      ],
    },
    {
      title: "Build the one workflow",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/requests", lines: [{ who: "you", text: "Approve the $3,100 trencher as Marco." }, { who: "claude", text: "Blocked: over $2,500 needs an admin." }, { who: "you", text: "Approve it as Dana." }, { who: "out", text: "✓ submitted → approved · 1 event logged" }] },
      promptLabel: "Copy · the workflow and screens",
      prompt: "Read TOOL-SPEC.md. Build the one workflow. Stop after each step.\n\n1. Create the requests and request_events tables from the Data section. Nothing in the code may update or delete a request_events row.\n2. Write one server-only module, lib/requests.ts, that every page and server action goes through. Each function reads the session from the request headers, checks the role with auth.api.userHasPermission, and scopes the query: for a requester, every query includes requester_id = their own id. No page or component queries the requests table directly.\n3. Write one function, moveRequest(), that checks the move against the workflow table in TOOL-SPEC.md for this person's role, enforces the $2,500 rule and \"nobody approves their own request\", then updates the status and inserts a request_events row in the same transaction. Rejecting and asking for info require a note.\n4. Build the screens from TOOL-SPEC.md: New request, My requests, Queue, the request page with its timeline, and People (admin only: add a person with the admin plugin's createUser, set their role with setRole, ban someone who left).\n5. Add two test people from People, a requester and an approver. Then show me the queue and one request's timeline after I submit, approve and mark it ordered.",
      promptPreview: "Create requests and request_events, one server-only module that scopes every query, one moveRequest() that logs every change, then the five screens.",
    },
    {
      title: "Import the spreadsheet",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/requests", lines: [{ who: "out", text: "Dry run: 412 rows · 397 ok · 15 skipped" }, { who: "claude", text: "\"J. Ortiz\" matches no one. Who is it?" }, { who: "you", text: "Jorge Ortiz, crew 4. I added him." }, { who: "out", text: "✓ 412 imported · counts match the CSV" }] },
      promptLabel: "Copy · import the CSV",
      prompt: "Read TOOL-SPEC.md, section Import. First add data/ to .gitignore. I'll export the sheet to data/requests.csv myself; wait until I tell you it's there. Never commit it.\n\n1. Install papaparse and @types/papaparse. Write scripts/import-requests.ts that parses the CSV with its header row and maps each column to the requests table the way the Import section says, including the status mapping.\n2. Match Requested by and Approved by to people by name or email. List every name that doesn't match and stop. I'll add those people in the app or tell you how to map them.\n3. Run a dry run first with npx tsx: total rows, rows by status, and every row it would skip and why (missing item, bad date, unknown status). Wait for my OK.\n4. Then import inside one transaction. Each imported request gets one request_events row with action imported and the status it had in the sheet. Running the script twice must not create duplicates.\n5. Show me the counts by status in the app next to the counts in the CSV.",
      promptPreview: "Parse the CSV with Papa Parse, match names to people, dry run with a skip report, then import in one transaction with an imported event per row.",
      takeaway: "papaparse.com",
    },
    {
      title: "One AI helper",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "requests · Request #388", lines: [{ who: "you", text: "Summarize and draft" }, { who: "claude", text: "Two hedge trimmers for crew 2. No vendor quote yet." }, { who: "claude", text: "Draft: \"Can you attach the Ewing quote?\"" }, { who: "out", text: "✓ Edited and posted by Marco · ai.draft_used" }] },
      promptLabel: "Copy · summarize and draft",
      prompt: "Read TOOL-SPEC.md, section AI helper. Add a Summarize and draft button to the request page for approvers and admins. Stop after each step.\n\n1. Install the AI SDK with npm install ai. Ask me to create an AI Gateway API key in the Vercel dashboard and add it to .env.local as AI_GATEWAY_API_KEY myself. Wait until I tell you it's done.\n2. Write a server action that checks the role through lib/requests.ts, loads the request and its timeline, and calls generateText through AI Gateway with a \"provider/model\" string. Check the AI Gateway model list for the current Claude Sonnet model ID instead of guessing. Send only the request fields and notes: no emails, no user IDs.\n3. Ask for a three-line summary (what, why, what's missing) and a short, friendly draft reply to the requester. It must not invent anything that isn't in the request.\n4. Show the draft in an editable box. Nothing is saved until a person clicks Post reply, which saves it as a comment event in request_events. Log ai.draft_used or ai.draft_discarded. The AI never changes a status.\n5. Use a 15-second timeout and a plain error message on failure. Show me a draft for one imported request.",
      promptPreview: "Add Summarize and draft: a server action sends the request, minus personal data, to Claude through AI Gateway. A person edits and posts the draft.",
      takeaway: "vercel.com/docs/ai-gateway",
    },
    {
      title: "The AI drafts. You decide.",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "AI SENDS IT", title: "A reply nobody read." },
      after: { kicker: "AI DRAFTS IT", title: "A person edits, then posts.", em: "The decision stays human." },
      items: [],
    },
    {
      title: "Protect it on the server",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/requests", lines: [{ who: "you", text: "As a crew lead, open request 12. It's someone else's." }, { who: "out", text: "404 from the page and the server action" }, { who: "out", text: "✓ e2e/access.spec.ts · 7 passed" }, { who: "claude", text: "Every route goes through lib/requests.ts." }] },
      promptLabel: "Copy · server checks and the access test",
      prompt: "Read TOOL-SPEC.md, sections Permissions, Rules and Done when. Review the app like a curious person on the team would. Stop after each step.\n\n1. List every page, server action and route handler. Confirm each one checks the session and role on the server, through lib/requests.ts, before loading or changing data. Hiding a button doesn't count. Fix any that don't.\n2. Confirm row-level access: a requester asking for someone else's request by ID gets a 404, from the page and from every server action.\n3. Confirm the Permissions table: a requester can't approve, an approver can't approve over $2,500, add people or import, and nobody can approve their own request.\n4. Check for playwright.config.ts. If it's missing, tell me to run npm init playwright@latest myself and wait until I tell you it's done. Write e2e/access.spec.ts covering steps 2 and 3, plus a signed-out visitor. Read test account emails and passwords from environment variables I'll add to .env.local myself. Never write real credentials into the test.\n5. Run npx playwright test and show me the result.",
      promptPreview: "Check every page, action and route for a server-side role check, prove row-level access and the Permissions table with a Playwright test.",
      takeaway: "playwright.dev/docs/auth",
    },
    {
      title: "Only the team gets in",
      layout: "checklist",
      diagram: "setup",
      terminal: { label: "Vercel · Settings · Deployment Protection", kicker: "STANDARD PROTECTION", lines: ["Vercel Authentication: on", "Previews: your Vercel team only", "Production: the app's own sign-in"], body: "Available on every Vercel plan." },
      items: [
        { title: "Previews", body: "Locked to your Vercel team by Vercel Authentication." },
        { title: "Production", body: "Better Auth sign-in. Sign-up off. Admins add people." },
        { title: "All on Vercel?", body: "All Deployments puts Vercel's login in front of everything." },
      ],
    },
    {
      title: "Ship it to the team",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/requests", lines: [{ who: "out", text: "✓ 6 of 6 checks under Done when" }, { who: "out", text: "✓ Pushed · deployed on Vercel" }, { who: "out", text: "Signed out → sign-in page only" }, { who: "claude", text: "Live. Previews locked to your Vercel team." }] },
      promptLabel: "Copy · check and ship",
      prompt: "Read TOOL-SPEC.md. Get it live for the team only. Stop after each step.\n\n1. Run every check under Done when and npx playwright test. Fix what fails.\n2. Create a GitHub repo and push. Confirm .env.local and data/ are not committed.\n3. Tell me to connect the repo to a new Vercel project in the dashboard, or run vercel link in my terminal. Wait until I tell you it's done.\n4. List the environment variables production needs (DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL set to the live URL, AI_GATEWAY_API_KEY). Tell me to add each one myself with vercel env add <NAME> --environment production, or in the dashboard. Don't print any values. Wait until I tell you it's done.\n5. Tell me to open the project's Settings, Deployment Protection, and turn on Vercel Authentication with Standard Protection, so preview deployments are only visible to our Vercel team. Production stays behind the app's own sign-in with sign-up off. Wait until I tell you it's done.\n6. Deploy, then help me check the live URL: a signed-out visitor sees only the sign-in page, and each role sees only what the Permissions table says. Give me the live URL.",
      promptPreview: "Run the checks and tests, push, have me set env vars and Deployment Protection in Vercel, then deploy and check each role on the live URL.",
      takeaway: "More talks at shipai.club/talks. Bring your questions to the Discord.",
    },
    takeHomeSlide(SLUG),
    FOUNDER_WEEKEND_SLIDE,
    COMMUNITY_CLOSE_SLIDE,
  ],
};

export const TALK = {
  slug: SLUG,
  standalone: true,
  eventTitle: "Replace the Spreadsheet",
  key: "Spreadsheet",
  summary: "Turn one spreadsheet-and-email process into an app your team signs in to.",
  copy: "Every team has a process that lives in a spreadsheet and an inbox. Tonight Claude Code turns one into a small internal app: roles, one workflow, an audit trail, the old sheet imported, one AI helper, and access limited to your team.",
  ...WORKUITY,
  rsvp: [],
  steps: [
    { title: "Spec", body: "Roles, the one workflow, permissions and Done when." },
    { title: "Build", body: "Next.js, Neon, Better Auth roles and the CSV import." },
    { title: "Protect", body: "Server-side checks, row-level access, an audit trail." },
    { title: "Ship", body: "Live on Vercel, open only to your team." },
  ],
  stepsLede: "Twenty minutes of AI news, then Claude Code replaces one spreadsheet-and-email process with a small internal app, from one TOOL-SPEC.md, then five-minute demos from the room.",
  closing: ["Bring your spreadsheet.", "Leave with an app."],
  example: {
    name: "Desert Bloom Landscaping",
    heading: ["Tonight's", "tool."],
    lede: "A Phoenix landscaping company's purchase requests, moved out of a spreadsheet and the office inbox. Swap in your own process and let Claude Code build from it.",
    file: "TOOL-SPEC.md",
    pitch: "Three roles, one approval workflow, five screens and an audit trail, with the old sheet imported and one AI helper a person signs off on.",
    jobLabel: "The rule",
    job: "The server decides, and every change leaves a record.",
    stack: ["Next.js", "Neon", "Drizzle", "Better Auth admin plugin", "Papa Parse", "AI SDK", "AI Gateway", "Vercel", "Playwright"],
    doneLabel: "Done when",
    done: [
      "The sheet's rows are in the app and the counts match",
      "Submit, approve and order a request, with all three on the timeline",
      "A requester can't open anyone else's request, proven by a test",
      "The AI draft only posts after a person clicks Post reply",
      "Live on Vercel with sign-up off and previews locked",
    ],
    spec: TOOL_SPEC_MD,
    specLabel: "The full TOOL-SPEC.md",
    specDestination: "an empty folder, then start Claude Code there",
  },
  toolsLede: "Everything behind the tool, one job each.",
  tools: [
    { name: "Next.js", job: "The app: screens, server actions and route handlers", cmd: "npx create-next-app@latest", href: "https://nextjs.org" },
    { name: "Neon", job: "Postgres for requests and the audit trail, linked from your terminal", cmd: "npx neon@latest init", href: "https://neon.com/docs/reference/cli-init" },
    { name: "Drizzle ORM", job: "Typed tables, migrations and transactions on Neon", cmd: "npm install drizzle-orm @neondatabase/serverless", href: "https://orm.drizzle.team" },
    { name: "Better Auth admin plugin", job: "Sign-in, custom roles, add people, set roles, create the first admin", cmd: "npx auth@latest create-admin --email you@example.com --name \"You\" --role admin", href: "https://www.better-auth.com/docs/plugins/admin" },
    { name: "Papa Parse", job: "Read the old spreadsheet's CSV export", cmd: "npm install papaparse", href: "https://www.papaparse.com" },
    { name: "AI SDK + AI Gateway", job: "Summarize a request and draft a reply a person approves", cmd: "npm install ai", href: "https://vercel.com/docs/ai-gateway" },
    { name: "Playwright", job: "The test that proves a requester only sees their own requests", cmd: "npm init playwright@latest", href: "https://playwright.dev" },
    { name: "Vercel", job: "Deploy, environment variables and Deployment Protection", cmd: "npm i -g vercel", href: "https://vercel.com/docs/deployment-protection" },
  ],
  deck: DECK,
};
