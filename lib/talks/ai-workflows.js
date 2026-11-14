import { ABOUT_SLIDE, JOIN_ROOM_SLIDE, PARTNER_SLIDE, FOUNDER_WEEKEND_SLIDE, COMMUNITY_CLOSE_SLIDE, takeHomeSlide, WORKUITY } from "./shared.js";

const WORKFLOW_SPEC = `# WORKFLOW.md · Sunday plan

## Job
Every Sunday morning, each opted-in user gets five dinners for the week, built from their saved ingredients. Nothing is emailed until they approve it.

## Stack
- Next.js App Router, already deployed on Vercel
- Workflow SDK (\`npm i workflow\`), with \`withWorkflow\` from \`workflow/next\` in next.config
- AI SDK (\`ai\`) through Vercel AI Gateway, model as a "provider/model" string from the AI Gateway model list
- Resend for email, Neon for data, Better Auth for the approval page
- Nitro works too: add \`modules: ["workflow/nitro"]\` to nitro.config.ts

## Trigger
- A Vercel cron calls \`GET /api/cron/sunday-plan\` at \`0 16 * * 0\` (9:00 AM in Phoenix, which stays on UTC-7)
- The route checks \`Authorization: Bearer $CRON_SECRET\`, finds users with \`sunday_plan_opt_in = true\`, and calls \`start(sundayPlan, [userId, weekOf])\` from \`workflow/api\` for each
- It skips any user who already has a plan for that \`weekOf\`, because cron can deliver twice

## Workflow: sundayPlan(userId, weekOf)  "use workflow"
1. **loadPantry** (step): read the user's \`saved_ingredients\`. If empty, use the ingredients from their five most recent \`dinners\`. If there are still none, throw \`FatalError\` and stop
2. **generateWeek** (step): \`generateText\` with \`Output.object\` and a Zod schema: exactly five dinners, each with name, minutes, ingredients used, five steps. Only saved ingredients plus salt, oil and pepper
3. **savePlan** (step): insert the plan with status \`pending\`
4. **Approval hook** (workflow level): \`createHook({ token: "plan:" + planId })\`
5. **askForApproval** (step): email a link to \`/plans/[planId]\` with Resend
6. **Wait**: \`Promise.race([hook, sleep("2d")])\`. On timeout, mark the plan \`expired\` and stop
7. If the user asked for swaps, run **generateWeek** once more with their notes and save the new version
8. **sendPlan** (step): email the approved plan with Resend, using an idempotency key of \`sunday-plan/\${planId}\`
9. **markSent** (step): set status \`sent\`

## Approval route
\`POST /api/plans/[planId]/approve\` with \`{ approved, swaps? }\`. Require a Better Auth session, check the plan belongs to that user, then call \`resumeHook("plan:" + planId, payload)\` from \`workflow/api\`.

## Retries and errors
- Steps retry on thrown errors (3 retries by default); generateWeek sets \`maxRetries = 5\`
- AI Gateway rate limit (429): throw \`RetryableError\` with \`retryAfter: "1m"\`
- Bad input (no ingredients, plan not found): throw \`FatalError\`, no retries
- Every step with a side effect is idempotent: inserts check for an existing row, emails use an idempotency key

## Observability
- Local: \`npx workflow web\`, or \`npx workflow inspect runs\`
- Production: workflow runs in the Vercel dashboard
- Each run is named by user and week, so support can find it

## Data
\`plans\`: id, user_id, week_of, dinners (JSON), status (pending, approved, expired, sent), created_at. Unique on (user_id, week_of).
\`users\`: add \`sunday_plan_opt_in\` (boolean, default false) and \`saved_ingredients\` (text array).
\`saved_ingredients\` is seeded from the distinct ingredients in each user's five most recent \`dinners\` rows, and the user can edit it in a field next to the opt-in toggle.

## Done when
- [ ] Starting the workflow by hand for a test user creates a pending plan and sends the approval email
- [ ] Approving on the plans page sends the plan email exactly once
- [ ] Not approving within the wait (shortened to 2 minutes for testing) marks the plan expired
- [ ] A forced failure in generateWeek retries and then succeeds, visible in the run's timeline
- [ ] The cron route is protected, skips users who already have a plan, and is live on Vercel
`;

export const TALK = {
  slug: "ai-workflows",
  series: 8,
  eventTitle: "AI Workflows",
  key: "Workflows",
  summary: "AI that keeps working after the request ends.",
  copy: "The MVP left meal planning out on purpose; now it's the top request. Tonight Claude Code builds a durable Sunday plan with the Workflow SDK and the AI SDK: steps that retry, a wait for the user's approval, and every run visible.",
  ...WORKUITY,
  rsvp: [],
  steps: [
    { title: "Spec", body: "One workflow, written as steps in WORKFLOW.md." },
    { title: "Steps", body: "AI SDK calls inside retryable steps." },
    { title: "Wait", body: "Sleep for days and pause for a human yes." },
    { title: "Watch", body: "Every run, step and retry on screen." },
  ],
  stepsLede: "A short AI news briefing, then we build What's for Dinner's Sunday plan live with the Workflow SDK, then five-minute demos from the room.",
  closing: ["Write the steps.", "Let it run all week."],
  example: {
    name: "What's for Dinner",
    heading: ["Tonight's", "workflow."],
    lede: "The workflow spec we build from on the night: a Sunday plan that generates a week of dinners, waits for approval, then emails it. Copy it and swap in your own job.",
    file: "WORKFLOW.md",
    pitch: "Type what's in your fridge. Get three dinners you can make tonight.",
    jobLabel: "The workflow",
    job: "Every Sunday, five dinners from your saved ingredients, emailed only after you approve.",
    stack: ["Workflow SDK", "AI SDK", "AI Gateway", "Next.js", "Resend", "Vercel"],
    doneLabel: "Done when",
    done: [
      "A manual run creates a pending plan and asks for approval",
      "Approving sends the plan email exactly once",
      "No approval in time marks the plan expired",
      "A forced failure retries, visible in the run timeline",
      "The Sunday cron is protected and live",
    ],
    spec: WORKFLOW_SPEC,
    specLabel: "The full workflow spec",
    specDestination: "a WORKFLOW.md file in your repo",
  },
  toolsLede: "The pieces of a durable workflow, one job each: the SDK, the model call, the email and the Sunday trigger.",
  tools: [
    { name: "Workflow SDK", job: "Durable workflows: \"use workflow\", \"use step\", sleep, hooks, retries", cmd: "npm i workflow", href: "https://workflow-sdk.dev" },
    { name: "Workflow SDK skills", job: "Teaches Claude Code the SDK from the docs bundled with your installed version", cmd: "npx skills add https://github.com/vercel/workflow --skill workflow", href: "https://github.com/vercel/workflow" },
    { name: "Workflow CLI and Web UI", job: "Inspect runs, steps and retries locally or on Vercel", cmd: "npx workflow web", href: "https://workflow-sdk.dev/docs/observability" },
    { name: "AI SDK", job: "generateText with Output.object for typed results", cmd: "npm install ai", href: "https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data" },
    { name: "AI Gateway", job: "One key, \"provider/model\" strings, every request logged", cmd: "vercel.com/ai-gateway", href: "https://vercel.com/docs/ai-gateway" },
    { name: "Nitro", job: "The non-Next.js option, with the workflow/nitro module", cmd: "npx create-nitro-app", href: "https://workflow-sdk.dev/docs/getting-started/nitro" },
    { name: "Resend", job: "The approval and plan emails", cmd: "npm install resend", href: "https://resend.com/docs/send-with-nextjs" },
    { name: "Vercel Cron Jobs", job: "Starts the Sunday run", cmd: "vercel crons add --path /api/cron/sunday-plan --schedule \"0 16 * * 0\"", href: "https://vercel.com/docs/cron-jobs" },
  ],
  deck: {
    title: "AI Workflows",
    includeRoiSlide: false,
    includeShowcaseSlide: false,
    visual: true,
    slides: [
      {
        title: "",
        layout: "checklist",
        diagram: "stage",
        stage: { scene: "launch", dark: true, logo: true, kicker: "SHIP AI TALKS · PART 8", lines: ["AI"], em: "Workflows", body: "Tonight, AI that runs all week. Every night stands on its own." },
      },
      ABOUT_SLIDE,
      JOIN_ROOM_SLIDE,
      PARTNER_SLIDE,
      {
        title: "",
        layout: "checklist",
        diagram: "stage",
        stage: { scene: "workbench", dark: true, kicker: "THE IDEA", lines: ["A request forgets."], em: "A workflow remembers." },
      },
      {
        title: "Make it durable",
        layout: "checklist",
        diagram: "versus",
        before: { kicker: "ONE BIG FUNCTION", title: "Times out. Starts over." },
        after: { kicker: "A WORKFLOW", title: "Steps that survive.", em: "Retry, sleep, wait for a yes." },
        items: [],
      },
      {
        title: "Tonight",
        layout: "checklist",
        diagram: "result",
        items: [{ title: "Spec" }, { title: "Steps" }, { title: "Wait" }, { title: "Watch" }],
      },
      {
        title: "Tonight's workflow",
        layout: "checklist",
        diagram: "doc",
        doc: {
          file: "WORKFLOW.md",
          sections: [
            { h: "Job", lines: ["Sunday: five dinners from saved ingredients."] },
            { h: "Wait", lit: true, lines: ["Nothing is emailed until they approve."] },
            { h: "Retries", lines: ["Each step retries. Emails send exactly once."] },
            { h: "Done when", lines: ["[ ] Approve sends one email", "[ ] No answer in 2 days expires", "[ ] Every run visible"] },
          ],
        },
      },
      {
        title: "The Sunday plan",
        layout: "checklist",
        diagram: "result",
        items: [
          { title: "Generate", body: "Five dinners, typed output" },
          { title: "Ask", body: "Email an approval link" },
          { title: "Wait", body: "Up to two days, no compute" },
          { title: "Send", body: "The plan, exactly once" },
        ],
      },
      {
        title: "Spec the steps",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "claude", text: "What happens if they never approve?" }, { who: "you", text: "After two days, expire it." }, { who: "claude", text: "Which steps have side effects?" }, { who: "out", text: "✓ WORKFLOW.md: 9 steps, 1 hook, 1 sleep" }] },
        promptLabel: "Copy · write the workflow spec",
        prompt: "Read SPEC.md and GROWTH.md. We're adding a weekly \"Sunday plan\": every Sunday, each opted-in user gets five dinners from their saved ingredients, and nothing is emailed until they approve.\n\nInterview me one question at a time and wait for each answer: what starts it, what each step does, what needs a human, how long to wait, what happens on failure, and which steps have side effects that must happen only once.\n\nThen write WORKFLOW.md with these sections: Job, Stack, Trigger, Workflow (numbered steps, marking which are steps and which are workflow-level waits), Approval route, Retries and errors, Observability, Data, Done when.\n\nDon't write code yet. Stop and wait for my OK.",
        promptPreview: "Interview me about the Sunday plan, then write WORKFLOW.md as numbered steps, waits and retry rules. Wait for my OK.",
      },
      {
        title: "Install the Workflow SDK",
        layout: "checklist",
        diagram: "setup",
        terminal: { label: "~/whats-for-dinner", kicker: "ONE PACKAGE, ONE WRAPPER", lines: ["npm i workflow", "withWorkflow(nextConfig)"], body: "Nitro: modules: [\"workflow/nitro\"]." },
        items: [
          { title: "You install the skill", body: "It reads the docs for your installed version." },
          { title: "Claude wires it", body: "next.config, tsconfig plugin, a workflows folder." },
          { title: "Prove it", body: "A hello workflow with one step and one sleep." },
        ],
        promptLabel: "Copy · set up the Workflow SDK",
        prompt: "Read WORKFLOW.md.\n\n1. In my own terminal I'll run:\nnpx skills add https://github.com/vercel/workflow --skill workflow\nWait until I tell you it's done, and tell me to restart Claude Code if you can't see the skill.\n2. Run npm i workflow. Then read the Next.js getting-started guide in node_modules/workflow/docs and follow it: wrap next.config with withWorkflow from workflow/next and add the TypeScript plugin if it says to.\n3. Create workflows/hello.ts with one \"use workflow\" function that calls one \"use step\" function, sleeps for 10 seconds with sleep from workflow, then calls the step again. Add a route that starts it with start from workflow/api.\n4. Tell me to run npm run dev, hit the route, and open npx workflow web to watch the run. Stop there.",
        promptPreview: "I add the workflow skill. Then npm i workflow, wrap next.config, and prove it with a hello workflow I can watch in npx workflow web.",
        takeaway: "workflow-sdk.dev",
      },
      {
        title: "AI inside a step",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "out", text: "✓ loadPantry · 9 ingredients" }, { who: "out", text: "✓ generateWeek · 5 dinners, schema valid" }, { who: "out", text: "✓ savePlan · status pending" }, { who: "claude", text: "Run it for your test user and open the timeline." }] },
        promptLabel: "Copy · the AI steps",
        prompt: "Read WORKFLOW.md. Build steps 1 to 3 of the workflow in workflows/sunday-plan.ts.\n\n1. Add the plans table and the users columns from the Data section with a migration. In the same migration, fill saved_ingredients for every existing user with the distinct ingredients from their five most recent dinners rows (the dinners table from Part 3 already stores ingredients as a text array). Show me the count of users who got at least one ingredient.\n2. loadPantry: a \"use step\" function that reads saved_ingredients, falls back to the ingredients from the user's five most recent dinners if it's empty, and throws FatalError from workflow if there are still none.\n3. generateWeek: a \"use step\" function that calls generateText from ai with output: Output.object and a Zod schema for exactly five dinners. Use AI Gateway with a \"provider/model\" string; check the AI Gateway model list for the current model ID instead of guessing. AI_GATEWAY_API_KEY is already in .env.local.\n4. savePlan: insert the plan as pending, and return the existing plan if one exists for that user and week.\n5. sundayPlan(userId, weekOf): a \"use workflow\" function that runs the three steps in order. Keep fetch, database and AI calls inside steps only.\n\nStart it for my test user and tell me what to look for in npx workflow web. Stop there.",
        promptPreview: "Build loadPantry, generateWeek (AI SDK with Output.object through AI Gateway) and savePlan as steps, then run it once.",
      },
      {
        title: "Retry the step, not the run",
        layout: "checklist",
        diagram: "versus",
        before: { kicker: "WITHOUT", title: "The model times out. Everything restarts." },
        after: { kicker: "WITH STEPS", title: "Only that step retries.", em: "The email sends once." },
        items: [],
        promptLabel: "Copy · retries and idempotency",
        prompt: "Read WORKFLOW.md, section Retries and errors, and the Workflow SDK errors and idempotency docs in node_modules/workflow/docs.\n\n1. Set generateWeek.maxRetries = 5.\n2. When AI Gateway returns a rate limit, throw RetryableError with retryAfter: \"1m\". For input that can never succeed, throw FatalError.\n3. Check every step with a side effect: database writes must check for an existing row, and emails must use Resend's idempotency key option with a key built from the plan id.\n4. Add a temporary flag that makes generateWeek fail on its first attempt. Run the workflow, and tell me where to see the failed attempt and the retry in npx workflow web. Then remove the flag.",
        promptPreview: "Set retries, use RetryableError for rate limits and FatalError for bad input, make side effects idempotent, then force one failure to watch it retry.",
      },
      {
        title: "Wait for a human yes",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "out", text: "⏸ Waiting on hook plan:8f2c · up to 2 days" }, { who: "you", text: "[ taps Approve on the plans page ]" }, { who: "out", text: "✓ sendPlan · ✓ markSent" }] },
        promptLabel: "Copy · the approval step",
        prompt: "Read WORKFLOW.md, steps 4 to 9 and Approval route, and the hooks docs in node_modules/workflow/docs.\n\n1. In the workflow, create a hook with createHook and the token \"plan:\" plus the plan id. Follow the docs on registering a hook before a step hands out its link.\n2. askForApproval: a step that emails a link to /plans/[planId] with Resend. RESEND_API_KEY is already in .env.local.\n3. Wait with Promise.race between the hook and sleep(\"2d\"). On timeout, mark the plan expired and return. Make the wait 2 minutes when an env flag is set for testing.\n4. Build /plans/[planId]: the five dinners, Approve, and a short \"swap something\" note. Its POST route requires a Better Auth session, checks the plan belongs to that user, then calls resumeHook from workflow/api.\n5. If there are swaps, run generateWeek once more. Then sendPlan and markSent.\n\nTell me to approve one test plan and let another expire, and check both in npx workflow web. Stop there.",
        promptPreview: "Pause on a hook, email an approval link, race it against sleep(\"2d\"), resume from an authenticated route, then send the plan once.",
      },
      {
        title: "Start it every Sunday",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "claude · ~/whats-for-dinner", lines: [{ who: "out", text: "✓ vercel.json: 0 16 * * 0 (9am Phoenix)" }, { who: "out", text: "✓ /api/cron/sunday-plan checks CRON_SECRET" }, { who: "claude", text: "12 opted in · 12 runs started · 0 duplicates" }] },
        promptLabel: "Copy · the Sunday trigger",
        prompt: "Read WORKFLOW.md, section Trigger.\n\n1. Build GET /api/cron/sunday-plan. Return 401 unless the Authorization header is \"Bearer \" plus CRON_SECRET. Find opted-in users, skip anyone who already has a plan for this week, and call start(sundayPlan, [userId, weekOf]) for the rest.\n2. Add the cron to vercel.json with the schedule 0 16 * * 0, which is 9 AM in Phoenix. Check Vercel's current cron docs first.\n3. Add an opt-in toggle for the Sunday plan on the account page, with a \"Your ingredients\" field next to it that shows saved_ingredients and lets the user edit them. When someone opts in with an empty list, fill it from their five most recent dinners first.\n4. Tell me to add CRON_SECRET to .env.local and to the Vercel project's environment variables myself, and to make sure system environment variables are enabled for the project, as the Workflow SDK deploy docs say. Wait until I tell you it's done.\n5. Call the route locally twice with the secret, show me that the second call starts nothing, then deploy.",
        promptPreview: "A protected cron route starts one run per opted-in user each Sunday at 9 AM Phoenix time, skips duplicates, then deploy.",
      },
      {
        title: "Watch every run",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "npx workflow inspect runs", lines: [{ who: "out", text: "sundayPlan · user 41 · completed · 2 retries" }, { who: "out", text: "sundayPlan · user 57 · waiting on hook" }, { who: "out", text: "sundayPlan · user 63 · expired" }] },
        promptLabel: "Copy · observability",
        prompt: "Read WORKFLOW.md, section Observability, and the observability docs in node_modules/workflow/docs.\n\n1. Show me how to list this week's runs locally with npx workflow inspect runs and in npx workflow web, and how to see the same runs for production in the Vercel dashboard.\n2. Make runs easy to find by user and week, using whatever the docs offer for naming or attributes.\n3. Write a short RUNBOOK.md: how to find one user's run, what each status means, how to cancel a stuck run, and how to start a run by hand for one user.\n\nCheck every Done when item in WORKFLOW.md, tell me which pass, and stop.",
        promptPreview: "List runs locally and on Vercel, make them findable by user and week, write a short RUNBOOK.md, and check Done when.",
        takeaway: "Also in the series: Part 9, Lock It Down. Security before anyone gets an admin console.",
      },
      {
        title: "",
        layout: "checklist",
        tone: "bonus",
        diagram: "stage",
        stage: { scene: "slipway", dark: true, kicker: "BONUS ROUND", lines: ["Photos fail sometimes."], em: "Retry them." },
      },
      {
        title: "A fridge-photo pipeline",
        layout: "checklist",
        tone: "bonus",
        diagram: "demo",
        demo: { label: "workflow · fridgePhoto", lines: [{ who: "out", text: "✗ readPhoto · 429 rate limited · retry in 1m" }, { who: "out", text: "✓ readPhoto · eggs, spinach, feta, onion" }, { who: "out", text: "✓ findDinners · 3 dinners" }] },
        promptLabel: "Copy · the photo workflow",
        prompt: "Bonus round. Read WORKFLOW.md and the Snap your fridge section of SPEC.md if it exists.\n\nMove photo reading into a workflow, workflows/fridge-photo.ts:\n1. readPhoto: a step that sends the uploaded image to a vision-capable model through AI Gateway (check the model list for the ID) and returns ingredients as structured output. On a rate limit throw RetryableError with retryAfter: \"1m\"; if there's no food in the photo, throw FatalError with a friendly message.\n2. findDinners: a step that reuses our existing three-dinner logic.\n3. The upload route starts the workflow and returns the run id. The page polls a status route until it finishes or fails, and shows \"Couldn't read that photo\" on failure.\n4. Workflow inputs and step results are saved in the run's event log. Before building, read the serialization and data retention docs in node_modules/workflow/docs and tell me how to keep the photo bytes out of the log (for example, a short-lived upload the step reads and deletes). Wait for my pick.\n5. Show me one success and one forced failure in npx workflow web.",
        promptPreview: "Turn Snap your fridge into a workflow: a retrying vision step, then the dinner step, with status polling and photos kept out of the run log.",
      },
      takeHomeSlide("ai-workflows"),
      FOUNDER_WEEKEND_SLIDE,
      COMMUNITY_CLOSE_SLIDE,
    ],
  },
};
