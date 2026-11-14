import { ABOUT_SLIDE, JOIN_ROOM_SLIDE, PARTNER_SLIDE, FOUNDER_WEEKEND_SLIDE, COMMUNITY_CLOSE_SLIDE, takeHomeSlide, WORKUITY } from "./shared.js";

const SLUG = "admin-console";

const ADMIN_MD = `# What's for Dinner - ADMIN.md

The internal tool that runs What's for Dinner. It lives at /admin inside the same Next.js app, uses the same Better Auth sessions and the same Neon database, and only admins can reach it.

## Rules
- Least privilege: two roles to start. Nobody gets admin who doesn't need it.
- The server decides. Every /admin page, server action and route handler checks the role on the server. Hiding a link is not a check.
- Every admin action writes one row to the audit log, in the same request as the action. No audit row, no action.
- No secrets in the browser. Database URLs, AI keys and auth secrets stay in server code and .env.local.
- Row level security is forced on user tables (SECURITY.md), so admin reads go through the server-only connection in lib/db-privileged.ts, and only after requireAdmin().
- Destructive actions (ban, hide, revoke sessions, impersonate) ask for confirmation and a reason.
- Impersonation is logged when it starts and when it stops, and the app shows a banner while it's on.

## Roles
Better Auth's admin plugin, with its default roles:
- \`admin\`: full access to /admin
- \`user\`: the app only, no access to /admin (the default for new sign-ups)

The first admin is created from the terminal by the founder, never from the app.

## Pages
1. /admin - metrics: signups, activated users, weekly active
2. /admin/users - users table: search by email or name, filter by role or banned, sort by created date
3. /admin/users/[id] - support view: profile, recent dinners, sessions, actions, AI summary
4. /admin/dinners - dinners: newest first, open one, hide a bad recipe with a reason
5. /admin/audit - audit log: newest first, filter by admin, action or target

## Actions
| Action | Who | Confirm | Audit event |
|---|---|---|---|
| Set role | admin | yes | user.set_role |
| Ban / unban | admin | yes, with reason | user.ban / user.unban |
| Revoke sessions | admin | yes | user.revoke_sessions |
| Send password reset | admin | yes | user.password_reset_sent |
| Impersonate / stop | admin | yes, with reason | user.impersonate_start / user.impersonate_stop |
| Hide / unhide recipe | admin | yes, with reason | recipe.hide / recipe.unhide |
| AI summary | admin | no | ai.summarize_user |

## Audit log
Table \`admin_audit_log\`: id, actor_id, action, target_type, target_id, reason, metadata (JSON), created_at. Insert and read only. Nothing in the code updates or deletes a row.

## Metrics
- Signups: new users per week
- Activated: new users whose first three dinners were found within 24 hours of signup (first \`dinners_found\`)
- Weekly active: users who found dinners at least once that week
These match GROWTH.md from Part 7. If GROWTH.md changes, it wins.

## Done when
- [ ] Signed out, or signed in as a normal user, /admin and every admin action return no data (a Playwright test proves it)
- [ ] An admin can find a user by email, see their recent dinners and ban them, with a confirmation
- [ ] An admin can hide a bad recipe, and the user no longer sees it, in dinners or Favorites
- [ ] Every action above shows up in /admin/audit with who, what, when and why
- [ ] Impersonation shows a banner and writes a start and a stop row
`;

const DECK = {
  title: "Admin Console",
  includeRoiSlide: false,
  includeShowcaseSlide: false,
  visual: true,
  slides: [
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "workbench", dark: true, logo: true, kicker: "SHIP AI TALKS · PART 11", lines: ["Admin"], em: "Console", body: "Tonight, the controls. Every night stands on its own." },
    },
    ABOUT_SLIDE,
    JOIN_ROOM_SLIDE,
    PARTNER_SLIDE,
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "harbor", dark: true, kicker: "THE IDEA", lines: ["Every app has a second app."], em: "The one you run it with." },
    },
    {
      title: "Stop editing production by hand",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "FIX IT IN PROD", title: "\"I'll just edit the database.\"" },
      after: { kicker: "ADMIN CONSOLE", title: "Roles, checks, a record.", em: "Every action leaves a trail." },
      items: [],
    },
    {
      title: "Tonight",
      layout: "checklist",
      diagram: "result",
      items: [{ title: "Roles" }, { title: "Pages" }, { title: "Actions" }, { title: "Audit" }],
    },
    {
      title: "Tonight's example",
      layout: "checklist",
      diagram: "doc",
      doc: {
        file: "ADMIN.md",
        sections: [
          { h: "Roles", lines: ["admin and user. The first admin comes from the terminal."] },
          { h: "Rules", lit: true, lines: ["The server decides. Every action is logged."] },
          { h: "Pages", lines: ["Metrics, users, support, dinners, audit log."] },
          { h: "Done when", lines: ["[ ] A normal user gets nothing from /admin", "[ ] Every action shows up in the audit log"] },
        ],
      },
    },
    {
      title: "Write ADMIN.md first",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "claude", text: "What do you need to do for a user today?" }, { who: "you", text: "Find them, see their dinners, ban a spammer." }, { who: "claude", text: "Should banning ask for a reason?" }, { who: "out", text: "✓ Wrote ADMIN.md: 2 roles, 5 pages, 10 audit events" }] },
      promptLabel: "Copy · the ADMIN.md interview",
      prompt: "Read SPEC.md and look at the current database schema and auth setup. We're adding an internal admin console at /admin inside this same Next.js app.\n\nInterview me one question at a time and wait for each answer:\n- Which jobs do I do for users today, by hand or in the database?\n- Which of those are destructive and need a confirmation and a reason?\n- Who needs admin access, and who doesn't?\n- Which three numbers I want to see every morning (use GROWTH.md if it exists)\n\nThen write ADMIN.md with these sections: Rules, Roles, Pages, Actions (a table with who, confirm and audit event), Audit log, Metrics, Done when.\n\nThe Rules section must say: least privilege; every page and action checks the role on the server; every admin action writes an audit row; no secrets in the browser; destructive actions confirm; impersonation is logged.\n\nStop and wait for my OK before writing any code.",
      promptPreview: "Interview me about the admin jobs, roles and metrics, then write ADMIN.md with rules, pages, actions, audit events and Done when. Wait for my OK.",
    },
    {
      title: "Roles with Better Auth's admin plugin",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "out", text: "✓ admin() on the server, adminClient() on the client" }, { who: "out", text: "✓ role, banned, banReason, banExpires on user" }, { who: "out", text: "✓ impersonatedBy on session" }, { who: "claude", text: "Your turn: create the first admin in your terminal." }] },
      promptLabel: "Copy · add the admin plugin",
      prompt: "Read ADMIN.md. Add roles with Better Auth's admin plugin. Check the current docs at better-auth.com/docs/plugins/admin before writing code. Stop after each step.\n\n1. Add admin() from better-auth/plugins to the server auth config and adminClient() from better-auth/client/plugins to the auth client. Keep the default roles: admin and user, with user as the default for new sign-ups.\n2. Add the plugin's database columns the way Better Auth's docs say for this project's setup (npx auth@latest migrate or generate). Show me what changes before applying it.\n3. Tell me to create the first admin myself in my terminal with:\n   npx auth@latest create-admin --email <my email> --name \"<my name>\" --role admin\n   Wait until I tell you it's done.\n\nDon't build any admin pages yet. Never put my password or any secret in a file or in chat.",
      promptPreview: "Add Better Auth's admin plugin on server and client, add its columns, then stop so I can create the first admin in my terminal.",
      takeaway: "better-auth.com/docs/plugins/admin",
    },
    {
      title: "Lock the door on the server",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "out", text: "✓ requireAdmin() in the /admin layout and every action" }, { who: "out", text: "✓ e2e/admin-access.spec.ts" }, { who: "out", text: "3 passed: signed out, normal user, admin" }, { who: "claude", text: "A normal user gets a 404 and no data." }] },
      promptLabel: "Copy · server checks and the Playwright test",
      prompt: "Read ADMIN.md. Lock /admin down on the server before building any page. Stop after each step.\n\n1. Write one server-only helper, requireAdmin(), that reads the Better Auth session from the request headers and returns the user only if their role is admin. Otherwise it stops the request (notFound or a 403) before any data is loaded. Part 9 forced row level security on dinners, favorites and plans, so every admin data path runs after requireAdmin() through lib/db-privileged.ts, the server-only connection from Part 9, never lib/db-as-user.ts. If that file doesn't exist yet, read SECURITY.md, section Data, and ask me before creating it.\n2. Call it in app/admin/layout.tsx, and also at the top of every admin page, server action and route handler. Don't rely on the layout alone, and don't rely on hiding links.\n3. Check for playwright.config.ts (Part 4 created it). If it exists, reuse it. If it doesn't, tell me to run npm init playwright@latest myself and wait until I tell you it's done.\n4. Write e2e/admin-access.spec.ts with three tests: signed out, /admin shows no admin content; signed in as a normal test user, /admin and one admin server action return no data; signed in as an admin, /admin loads. Read test account emails and passwords from environment variables I'll add to .env.local myself; never write real credentials into the test.\n5. Run npx playwright test and show me the result.",
      promptPreview: "Write requireAdmin() and call it in the layout, every page, action and route. Then a Playwright test that a normal user gets nothing.",
      takeaway: "playwright.dev/docs/auth",
    },
    {
      title: "Hidden is not locked",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "HIDE THE LINK", title: "No Admin button in the nav." },
      after: { kicker: "CHECK ON THE SERVER", title: "Every page. Every action.", em: "No role, no data." },
      items: [],
    },
    {
      title: "A users table you can search",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "you", text: "Search \"gmail\", banned only, newest first." }, { who: "out", text: "✓ listUsers: searchValue, filterField, sortBy" }, { who: "claude", text: "Ban asks for a reason, then writes user.ban." }, { who: "out", text: "✓ 1 row in admin_audit_log" }] },
      promptLabel: "Copy · the users table and the audit log",
      prompt: "Read ADMIN.md. Build the audit log first, then the users table. Stop after each step.\n\n1. Create the admin_audit_log table from ADMIN.md (id, actor_id, action, target_type, target_id, reason, metadata JSON, created_at). Write one server-only function, logAdminAction(), that inserts a row. Nothing in the code may update or delete audit rows.\n2. Check for components.json. If it doesn't exist, tell me to run npx shadcn@latest init in my own terminal, because it asks questions, and wait until I tell you it's done. Then add the components this console uses: npx shadcn@latest add table button dropdown-menu input dialog textarea, and npm install @tanstack/react-table. Follow the data table guide on ui.shadcn.com.\n3. Build /admin/users. Load users on the server with Better Auth's listUsers, passing the request headers, and use its search (email or name), filter (role, banned) and sort (created date) options, with pagination.\n4. Add a row actions menu: set role, ban, unban. Each one is a server action that calls requireAdmin(), asks for confirmation in a dialog (ban also asks for a reason), calls the admin plugin, then calls logAdminAction(). An admin can't ban or demote themselves.\n5. Show me the page at desktop width and one audit row after a test ban.",
      promptPreview: "Create admin_audit_log and logAdminAction(), then a shadcn data table on listUsers with search, filter, sort and confirmed, logged actions.",
      takeaway: "ui.shadcn.com/docs/components/radix/data-table",
    },
    {
      title: "Hide a bad recipe",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "you", text: "This recipe says to bake lettuce for an hour." }, { who: "claude", text: "Hide it? It needs a reason." }, { who: "you", text: "Unsafe cooking step." }, { who: "out", text: "✓ Hidden from the user · recipe.hide logged" }] },
      promptLabel: "Copy · the dinners view",
      prompt: "Read ADMIN.md. Build /admin/dinners. Stop after each step.\n\n1. Propose the smallest schema change that lets an admin hide one recipe inside a dinner result, with who hid it, when and why. Wait for my OK, then apply it.\n2. Build the page: newest dinners first, with the user's email, the ingredients and the three recipe names. Opening one shows the full recipes.\n3. Add Hide and Unhide as server actions: requireAdmin(), a confirmation dialog with a required reason, the change, then logAdminAction() with recipe.hide or recipe.unhide.\n4. Update the user-facing app so hidden recipes no longer show anywhere: in that user's dinners and in Favorites (favorites from Part 4 point at dinner_id and recipe_index, so filter those out too). Keep the favorites rows so Unhide brings them back. Show me both sides: the admin view and the user's view, including Favorites.",
      promptPreview: "Propose the schema change to hide one recipe, build /admin/dinners, add confirmed and logged Hide and Unhide, and hide it from the user's dinners and Favorites.",
    },
    {
      title: "Support in one page",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "you", text: "Look up maria@example.com." }, { who: "out", text: "✓ 2 sessions · 6 dinners this week" }, { who: "claude", text: "Send a reset link or sign her out everywhere?" }, { who: "out", text: "✓ user.password_reset_sent logged" }] },
      promptLabel: "Copy · the support view",
      prompt: "Read ADMIN.md. Build the support view at /admin/users/[id]. Stop after each step.\n\n1. Show the user's profile (email, name, role, created date, banned and why), their 10 most recent dinners, and their active sessions. Load it all on the server after requireAdmin().\n2. Add three actions, each with a confirmation and logAdminAction():\n   - Revoke sessions, with the admin plugin's revokeUserSessions\n   - Send password reset, with Better Auth's requestPasswordReset. If the auth config has no sendResetPassword function yet, tell me and skip this one instead of adding an email provider.\n   - Impersonate, with impersonateUser, asking for a reason\n3. While impersonating, show a banner across the app with a Stop button that calls stopImpersonating. Log user.impersonate_start and user.impersonate_stop, using the session's impersonatedBy field to know who the admin is.\n4. Show me the page, then the banner while impersonating a test user.",
      promptPreview: "Build /admin/users/[id]: profile, recent dinners, sessions, plus revoke, password reset and impersonate, each confirmed and logged, with a banner while impersonating.",
    },
    {
      title: "Three numbers every morning",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "out", text: "Signups this week: 41" }, { who: "out", text: "Activated in 24 hours: 26 (63%)" }, { who: "out", text: "Weekly active: 118" }, { who: "claude", text: "Same definitions as GROWTH.md." }] },
      promptLabel: "Copy · the metrics page",
      prompt: "Read ADMIN.md, and GROWTH.md from Part 7 if it exists. Build /admin, the metrics page.\n\n1. Write the queries on the server through lib/db-privileged.ts, after requireAdmin(): signups (new users per week), activated (new users whose first three dinners were found within 24 hours of signing up, the same definition as GROWTH.md) and weekly active (users who found dinners at least once that week). If GROWTH.md has changed since Part 7, use its current definitions and tell me.\n2. Show each number with last week's number beside it, and an eight-week table under each one. No charts library unless one is already installed.\n3. Call requireAdmin() first. No analytics keys or database URLs in client components.\n4. Show me the page, and the SQL behind each number so I can check it.",
      promptPreview: "Build /admin with signups, activated users and weekly active from server-side queries, using GROWTH.md's definitions if they exist. Show me the SQL.",
    },
    {
      title: "One AI assist",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "whats-for-dinner · /admin/users/maria", lines: [{ who: "you", text: "Summarize this user" }, { who: "claude", text: "Active 5 of 7 days. Mostly eggs and spinach." }, { who: "claude", text: "Hit two errors Tuesday, then stopped." }, { who: "out", text: "✓ ai.summarize_user logged" }] },
      promptLabel: "Copy · the AI summary",
      prompt: "Read ADMIN.md. Add one AI assist to the support view: a Summarize button on /admin/users/[id].\n\n1. A server action calls requireAdmin(), loads the user's last 30 days of dinners and errors, and sends only what's needed (no email, no password hashes, no session tokens) to a Claude model through the AI SDK and Vercel AI Gateway with a \"provider/model\" string. Check the AI Gateway model list for the current Claude Sonnet model ID instead of guessing.\n2. Ask for four short lines: how often they use it, what they cook, anything that went wrong, and one suggested next step for support. It must not invent facts that aren't in the data.\n3. Use the existing AI_GATEWAY_API_KEY in .env.local; never send it to the browser. 15-second timeout, and a plain error message on failure.\n4. Log ai.summarize_user with logAdminAction(). Show me the summary for a test user.",
      promptPreview: "Add a Summarize button: a server action sends the user's recent activity, minus personal data, to Claude through AI Gateway and logs the call.",
      takeaway: "vercel.com/docs/ai-gateway",
    },
    {
      title: "Ship the console",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "out", text: "✓ 5 of 5 checks under Done when" }, { who: "out", text: "✓ npx playwright test: all passed" }, { who: "out", text: "✓ 10 audit events, no client-side secrets" }, { who: "claude", text: "Deployed. /admin is live and locked." }] },
      promptLabel: "Copy · check and ship",
      prompt: "Read ADMIN.md. Before we ship, review the admin console like an attacker would.\n\n1. List every file under app/admin and every admin server action and route handler, and confirm each one calls requireAdmin() before loading or changing data. Fix any that don't.\n2. Search client components for secrets or server-only imports (database URLs, AI keys, auth secrets). Fix anything you find.\n3. Confirm every action in the Actions table writes its audit event. Show me the audit log after one of each.\n4. Run npx playwright test and every check under Done when, and tell me which pass.\n5. Commit and push so Vercel deploys. Ask me before any step that needs my login, and give me the live /admin URL when it's done.",
      promptPreview: "Check every admin route and action for requireAdmin(), hunt for client-side secrets, confirm every audit event, run the tests, then ship.",
      takeaway: "Also in the series: Part 12, AI Ops Team. A live team of Grok Bots to run it with you.",
    },
    takeHomeSlide(SLUG),
    FOUNDER_WEEKEND_SLIDE,
    COMMUNITY_CLOSE_SLIDE,
  ],
};

export const TALK = {
  slug: SLUG,
  series: 11,
  eventTitle: "Admin Console",
  key: "Console",
  summary: "Build the internal tool that runs the business.",
  copy: "What's for Dinner has users, recipes and the occasional spammer. Tonight Claude Code builds the admin console that runs it: roles, a users table, support, metrics and an audit log, locked on the server.",
  ...WORKUITY,
  rsvp: [],
  steps: [
    { title: "Roles", body: "Better Auth's admin plugin and the first admin." },
    { title: "Pages", body: "Metrics, users, support, dinners and the audit log." },
    { title: "Actions", body: "Ban, hide, reset, impersonate, each confirmed." },
    { title: "Audit", body: "Every action logged, every route checked." },
  ],
  stepsLede: "Twenty minutes of AI news, then we build the admin console for What's for Dinner from one ADMIN.md, then five-minute demos from the room.",
  closing: ["Bring your app.", "Leave with the controls."],
  example: {
    name: "What's for Dinner",
    heading: ["Tonight's", "console."],
    lede: "The internal tool that runs the app, written down before it's built. Paste it into your repo and let Claude Code build from it.",
    file: "ADMIN.md",
    pitch: "Two roles, five pages, seven actions and an audit log, all inside the same Next.js app and locked on the server.",
    jobLabel: "The rule",
    job: "The server decides, and every action leaves a record.",
    stack: ["Better Auth admin plugin", "shadcn/ui", "TanStack Table", "Neon", "AI SDK", "AI Gateway", "Playwright"],
    doneLabel: "Done when",
    done: [
      "A normal user gets nothing from /admin, proven by a test",
      "Find a user, see their dinners, ban them with a reason",
      "Hide a bad recipe and the user stops seeing it",
      "Every action shows up in the audit log",
      "Impersonation shows a banner and is logged",
    ],
    spec: ADMIN_MD,
    specLabel: "The full ADMIN.md",
    specDestination: "the root of your repo",
  },
  toolsLede: "Everything behind the console, one job each, inside the app you already run.",
  tools: [
    { name: "Better Auth admin plugin", job: "Roles, list users, ban and unban, impersonate, set role", cmd: "npm install better-auth", href: "https://www.better-auth.com/docs/plugins/admin" },
    { name: "Better Auth CLI", job: "Create the first admin from your terminal", cmd: "npx auth@latest create-admin --email you@example.com --name \"You\" --role admin", href: "https://www.better-auth.com/docs/concepts/cli" },
    { name: "shadcn/ui data table", job: "The users table: sorting, filtering, pagination and row actions", cmd: "npx shadcn@latest add table button dropdown-menu input dialog textarea", href: "https://ui.shadcn.com/docs/components/radix/data-table" },
    { name: "TanStack Table", job: "The headless table engine behind the data table", cmd: "npm install @tanstack/react-table", href: "https://tanstack.com/table" },
    { name: "Playwright", job: "The test that proves a normal user can't get in", cmd: "npm init playwright@latest", href: "https://playwright.dev" },
    { name: "AI SDK + AI Gateway", job: "One AI assist: summarize a user's recent activity", cmd: "npm install ai", href: "https://vercel.com/docs/ai-gateway" },
    { name: "Neon", job: "The same Postgres database, now with an audit log table", cmd: "npx neon@latest init", href: "https://neon.com" },
  ],
  deck: DECK,
};
