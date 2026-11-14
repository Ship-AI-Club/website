import { ABOUT_SLIDE, JOIN_ROOM_SLIDE, PARTNER_SLIDE, FOUNDER_WEEKEND_SLIDE, COMMUNITY_CLOSE_SLIDE, takeHomeSlide, WORKUITY } from "./shared.js";

const SLUG = "workflow-automation";

const WORKFLOW_MAP = `# WORKFLOW-MAP.md · Client onboarding

## Firm
Saguaro Books, a five-person bookkeeping firm in Phoenix. About six new clients a week.

## Why this one
Top of TIME-AUDIT.md: 7 hours a week, 6 times a week, Rules 3, Risk 3 once a person approves every email. Score 63.
Score = hours per week x Rules (3 written rules, 2 mixed, 1 judgment) x Risk (3 low, 2 medium, 1 high).

## Trigger
A new client signs the engagement letter and submits the intake form. The form export adds a row to \`intake/new-clients.csv\`.

## Inputs
- Intake row: business name, contact, email, entity type (sole prop, LLC, S corp), accounting software, number of bank and card accounts, payroll yes or no, sales tax yes or no
- \`rules/checklists.md\`: the documents each entity type and answer requires. The firm owns this file
- \`rules/tone.md\`: three lines on how the firm writes to clients
- \`clients/<client>/inbox/\`: where the client's uploaded documents land

## Map
| # | Step | Inputs | Output | Who |
|---|------|--------|--------|-----|
| 1 | Find new intake rows | new-clients.csv, tracker.csv | New client records | Automation |
| 2 | Create the client folder and tracker row | Client record | clients/<client>/, tracker.csv row | Automation |
| 3 | Build the document checklist | Intake answers, rules/checklists.md | CHECKLIST.md | Automation |
| 4 | Draft the welcome email | CHECKLIST.md, rules/tone.md | Draft in outbox/ | AI |
| 5 | Approve and send the welcome | Draft | Sent email, logged | Human |
| 6 | Match uploads to the checklist | PDFs in inbox/, CHECKLIST.md | Items ticked, unsure ones in NEEDS-REVIEW.md | AI |
| 7 | Draft reminders on day 3 and day 7 | Missing items | Draft in outbox/ | AI |
| 8 | Approve and send reminders | Draft | Sent email, logged | Human |
| 9 | Hand off when the checklist is complete | CHECKLIST.md | Handoff note, kickoff call booked | Human |

## Decisions
- The entity type and intake answers pick the checklist. A written rule decides, not AI
- AI ticks an item only when it is confident. Anything else goes to NEEDS-REVIEW.md for a person
- Reminders go on day 3 and day 7. On day 14 a person calls

## Handoffs
- The office manager approves every outgoing email
- The assigned bookkeeper takes the client once every item is ticked

## Exceptions
- The entity type on a document differs from the intake: flag it, a person decides
- The client replies with a question: a person answers
- A file isn't a PDF or can't be read: flag it
- No reply after 14 days: a person calls
- Emails list document names only. Never tax IDs or account numbers

## Flow
\`\`\`mermaid
flowchart TD
  A[New intake row] --> B[Create folder and tracker row]
  B --> C[Build checklist from rules]
  C --> D[AI drafts welcome]
  D --> E{Office manager approves?}
  E -- Edit --> D
  E -- Approve --> F[Send and log]
  F --> G[Uploads arrive in inbox]
  G --> H[AI matches uploads to checklist]
  H --> I{Unsure match?}
  I -- Yes --> J[Person reviews]
  I -- No --> K{All items in?}
  J --> K
  K -- No, day 3 or 7 --> L[AI drafts reminder]
  L --> E
  K -- Yes --> M[Hand off to bookkeeper]
\`\`\`

## Rules
- Nothing sends or spends without a person clicking Approve
- Scripts never rename or delete client files
- Client documents go to a model only after checking the firm's data policy
- Every send is logged in tracker.csv

## Done when
- [ ] A new intake row creates the folder, the tracker row and CHECKLIST.md, and a second run creates nothing
- [ ] The welcome draft waits in the approval queue and nothing sends until Approve
- [ ] Three test PDFs in inbox/ tick the right items and flag anything unsure
- [ ] A day 3 reminder lists only the missing documents
- [ ] Minutes per client are logged for two weeks and compared with TIME-AUDIT.md
`;

export const TALK = {
  slug: SLUG,
  standalone: true,
  eventTitle: "Automate the Busywork",
  key: "Busywork",
  summary: "Find the hours, map the work, build the fix.",
  copy: "Most automation starts with a tool and hopes it fits. Tonight we start with a one-week time audit, map the top workflow step by step, then build it with Claude Code, with a person approving anything that sends.",
  ...WORKUITY,
  rsvp: [],
  steps: [
    { title: "Audit", body: "Log a week, then score every task." },
    { title: "Map", body: "One workflow, step by step, owner by owner." },
    { title: "Build", body: "A script first, then a small approval app." },
    { title: "Measure", body: "Minutes per client, before and after." },
  ],
  stepsLede: "A short AI news briefing, then three moves on one bookkeeping firm's onboarding, then five-minute demos from the room.",
  closing: ["Find the hours.", "Build the fix."],
  example: {
    name: "Saguaro Books",
    heading: ["Tonight's", "workflow map."],
    lede: "The map we build from on the night: a five-person bookkeeping firm's client onboarding, every step marked AI, automation or human. Copy it and swap in your own workflow.",
    file: "WORKFLOW-MAP.md",
    pitch: "A five-person bookkeeping firm in Phoenix, onboarding about six new clients a week.",
    jobLabel: "The workflow",
    job: "Turn a signed intake form into a complete document checklist, with every client email approved by a person.",
    stack: ["Claude Code", "Node.js", "Claude API", "Resend", "Mermaid"],
    doneLabel: "Done when",
    done: [
      "A new intake row creates the folder, tracker row and checklist",
      "Nothing sends until a person clicks Approve",
      "Uploaded PDFs tick the right items and flag the unsure ones",
      "Reminders list only the missing documents",
      "Minutes per client compared with the audit after two weeks",
    ],
    spec: WORKFLOW_MAP,
    specLabel: "The full workflow map",
    specDestination: "a WORKFLOW-MAP.md file in your project folder",
  },
  toolsLede: "One builder, one model, one way to send, and three visual builders if you'd rather not keep code.",
  tools: [
    { name: "Claude Code", job: "Runs the audit interview, writes the map and builds the workflow", cmd: "curl -fsSL https://claude.ai/install.sh | bash", href: "https://code.claude.com/docs/en/setup" },
    { name: "Claude API TypeScript SDK", job: "The AI steps: drafting emails and reading PDFs", cmd: "npm install @anthropic-ai/sdk", href: "https://platform.claude.com/docs/en/build-with-claude/pdf-support" },
    { name: "Resend", job: "Sends approved emails, with an idempotency key so each sends once", cmd: "npm install resend", href: "https://resend.com/docs/send-with-nodejs" },
    { name: "Mermaid on GitHub", job: "The flowchart in WORKFLOW-MAP.md renders on GitHub", cmd: "```mermaid", href: "https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams" },
    { name: "n8n", job: "Visual workflows, with a human review step for AI tool calls", cmd: "npx n8n", href: "https://docs.n8n.io/advanced-ai/human-in-the-loop-tools/" },
    { name: "Zapier", job: "Zaps across apps. Its Human in the Loop approval action needs a paid plan (Professional and up)", cmd: "zapier.com/sign-up", href: "https://help.zapier.com/hc/en-us/articles/38733184458765" },
    { name: "Make", job: "Visual scenarios built from trigger and action modules", cmd: "make.com", href: "https://help.make.com/scenarios" },
  ],
  deck: {
    title: "Automate the Busywork",
    includeRoiSlide: false,
    includeShowcaseSlide: false,
    visual: true,
    slides: [
      {
        title: "",
        layout: "checklist",
        diagram: "stage",
        stage: { scene: "workbench", dark: true, logo: true, kicker: "SHIP AI TALKS", lines: ["Automate the"], em: "Busywork", body: "Leave with a time audit, one mapped workflow and a working build." },
      },
      ABOUT_SLIDE,
      JOIN_ROOM_SLIDE,
      PARTNER_SLIDE,
      {
        title: "",
        layout: "checklist",
        diagram: "stage",
        stage: { scene: "harbor", dark: true, kicker: "THE IDEA", lines: ["Don't automate a guess."], em: "Measure, map, then build." },
      },
      {
        title: "Start with the hours",
        layout: "checklist",
        diagram: "versus",
        before: { kicker: "TOOL FIRST", title: "Buy a tool. Hope it fits.", body: "Automates whatever was loudest this week." },
        after: { kicker: "AUDIT FIRST", title: "Find the hours.", em: "Then automate the top one." },
        items: [],
      },
      {
        title: "Tonight",
        layout: "checklist",
        diagram: "result",
        items: [{ title: "Audit" }, { title: "Map" }, { title: "Build" }, { title: "Measure" }],
      },
      {
        title: "Saguaro Books, one week",
        layout: "checklist",
        diagram: "doc",
        doc: {
          file: "TIME-AUDIT.md",
          sections: [
            { h: "Firm", lines: ["Five people. Six new clients a week."] },
            { h: "Score", lines: ["Hours a week x Rules x Risk, each 1 to 3."] },
            { h: "Top task", lit: true, lines: ["Client onboarding: 7 hrs, 6x a week. Score 63."] },
            { h: "Ranked", lines: ["[ ] Categorizing transactions: 18", "[ ] \"Where's my report?\" emails: 15", "[ ] Month-end review: 6"] },
          ],
        },
      },
      {
        title: "Log one week",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "claude · ~/saguaro-ops", lines: [{ who: "claude", text: "Which tasks come back every week?" }, { who: "you", text: "Onboarding, chasing documents, client emails." }, { who: "out", text: "✓ TIME-AUDIT.md: log table, 4 scoring columns" }] },
        promptLabel: "Copy · set up the time audit",
        prompt: "I want to find which work in my business is worth automating. Help me run a one-week time audit.\n\n1. Ask me one question at a time and wait for each answer: my role, team size, and the recurring tasks I think take the most time.\n2. Write TIME-AUDIT.md with:\n   - A Log table: Date, Task, Minutes, What started it, Tools used, Notes. Prefill the Task column with the tasks I named.\n   - A Scoring section that explains the columns we'll fill in after the week: Hours per week, Times per week, Rules (3 = follows written rules, 2 = mixed, 1 = judgment), Risk (3 = low if it goes wrong, 2 = medium, 1 = money, legal or client-facing with no review). Score = hours per week x Rules x Risk.\n   - A short How to log note: log each task when you finish it, rounded to 5 minutes, for five working days. Add new tasks as they come up.\n\nDon't score anything yet. Stop when the file is written.",
        promptPreview: "Interview me about my recurring work, then write TIME-AUDIT.md with a log table and the scoring columns. Stop there.",
      },
      {
        title: "Score the week",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "claude · ~/saguaro-ops", lines: [{ who: "out", text: "Onboarding · 7.0 h · 6x · R3 · K3 · 63" }, { who: "out", text: "Categorizing · 9.0 h · 25x · R2 · K1 · 18" }, { who: "claude", text: "Onboarding is mostly rules. Map it first?" }] },
        promptLabel: "Copy · score and rank",
        prompt: "Read TIME-AUDIT.md. My log for the week is filled in.\n\n1. Total the minutes for each task and add Hours per week and Times per week.\n2. Propose a Rules score and a Risk score for each task, with a one-line reason each. Show me the table and wait for my corrections.\n3. Compute Score = hours per week x Rules x Risk. Rank the tasks, breaking ties by times per week, and add a Ranking section.\n4. For the top three, write one line each: what a machine could do, and what has to stay with a person.\n5. Recommend one workflow to map first, then stop and wait for my pick.",
        promptPreview: "Total the log, propose Rules and Risk scores for me to correct, rank by score, and recommend one workflow to map.",
      },
      {
        title: "Who owns each step",
        layout: "checklist",
        diagram: "skills",
        hub: "One workflow",
        hubCaption: "Every step gets an owner",
        hubNote: "Trigger, inputs, decisions,\nhandoffs, outputs, exceptions",
        items: [
          { title: "Automation", body: "A written rule decides. Same input, same output." },
          { title: "AI", body: "Drafting, reading and matching. A person checks the result." },
          { title: "Human", body: "Anything that sends, spends or touches the books." },
        ],
      },
      {
        title: "Map the workflow",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "claude · ~/saguaro-ops", lines: [{ who: "claude", text: "What happens when a document doesn't match?" }, { who: "you", text: "It goes to the office manager." }, { who: "out", text: "✓ WORKFLOW-MAP.md: 9 steps · 3 automation · 3 AI · 3 human" }] },
        promptLabel: "Copy · write the workflow map",
        prompt: "Read TIME-AUDIT.md. We're mapping the workflow I picked from the Ranking section.\n\nInterview me one question at a time and wait for each answer. Cover: what starts it, every input, each step in order, the decisions and who makes them, the handoffs between people, the outputs, and the exceptions (what goes wrong, and what happens then).\n\nThen write WORKFLOW-MAP.md with these sections: Why this one (its audit score), Trigger, Inputs, Map (a table: #, Step, Inputs, Output, Who), Decisions, Handoffs, Exceptions, Flow (a mermaid flowchart in a ```mermaid code block), Rules, Done when.\n\nMark Who as one of Automation, AI or Human. Use Automation wherever a written rule decides. Use AI only for drafting, reading or matching. Mark Human for anything that sends, spends money or changes the books, and for every exception.\n\nDon't write code. Stop and wait for my OK.",
        promptPreview: "Interview me about the top workflow, then write WORKFLOW-MAP.md: a step table marked AI, Automation or Human, exceptions and a mermaid flowchart.",
        takeaway: "Mermaid renders in Markdown files on GitHub.",
      },
      {
        title: "Tonight's workflow map",
        layout: "checklist",
        diagram: "doc",
        doc: {
          file: "WORKFLOW-MAP.md",
          sections: [
            { h: "Trigger", lines: ["Intake form submitted after the engagement letter."] },
            { h: "Map", lit: true, lines: ["9 steps: 3 automation, 3 AI, 3 human."] },
            { h: "Exceptions", lines: ["Unsure match, client question, day 14: a person."] },
            { h: "Done when", lines: ["[ ] Nothing sends without Approve", "[ ] Uploads tick the right items", "[ ] Minutes per client compared"] },
          ],
        },
      },
      {
        title: "Start with a script",
        layout: "checklist",
        diagram: "setup",
        terminal: { label: "~/saguaro-ops", kicker: "STEPS 1 TO 3, NO AI YET", lines: ["node onboard.mjs", "✓ 3 clients · 3 checklists"], body: "Run it twice. The second run creates nothing." },
        items: [
          { title: "Rules first", body: "The firm owns rules/checklists.md." },
          { title: "Fake data", body: "Three sample clients, no real names." },
          { title: "Safe to rerun", body: "tracker.csv remembers who's done." },
        ],
        promptLabel: "Copy · the onboarding script",
        prompt: "Read WORKFLOW-MAP.md. Build steps 1 to 3 as a plain Node.js script. No AI yet.\n\n1. Run npm init -y in this folder.\n2. Write rules/checklists.md from the Inputs section: the documents each entity type and intake answer requires. Show it to me and wait for my edits. This file is the firm's rules, so keep it readable.\n3. Create intake/new-clients.csv with three fake clients: a sole prop, an LLC with payroll, and an S corp with sales tax. No real names or numbers.\n4. Write onboard.mjs. It reads the CSV, skips anyone already in tracker.csv, creates clients/<client>/inbox/, writes clients/<client>/CHECKLIST.md with one checkbox per required document, and appends a tracker.csv row with status \"checklist ready\".\n5. Run it twice and show me that the second run creates nothing. Stop there.",
        promptPreview: "Write the firm's checklist rules, three fake clients and onboard.mjs: folder, CHECKLIST.md and a tracker row per client. Safe to run twice.",
      },
      {
        title: "Add the AI steps",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "claude · ~/saguaro-ops", lines: [{ who: "out", text: "✓ outbox/mesa-lawn-welcome.md · awaiting approval" }, { who: "out", text: "✓ bank-statement-oct.pdf → Bank statements · high" }, { who: "out", text: "? scan-0042.pdf → NEEDS-REVIEW.md · low" }] },
        promptLabel: "Copy · drafting and matching",
        prompt: "Read WORKFLOW-MAP.md, steps 4, 6 and 7, and the Rules section.\n\n1. Tell me to add ANTHROPIC_API_KEY to .env.local myself, and wait until I tell you it's done. Then run npm install @anthropic-ai/sdk. Check Anthropic's docs for the current model ID instead of guessing.\n2. Create rules/tone.md with three lines on how we write to clients, and wait for my edits.\n3. draft-welcome.mjs: for each client with status \"checklist ready\", ask Claude for a short welcome email that lists the documents from CHECKLIST.md in our tone. Save it to outbox/<client>-welcome.md marked \"awaiting approval\". Never send anything.\n4. match-docs.mjs: for each PDF in clients/<client>/inbox/, send it to Claude as a PDF document block with the checklist. Ask for JSON back: the matching item, confidence (high or low) and a one-line reason. Tick high-confidence items in CHECKLIST.md and list the rest in NEEDS-REVIEW.md. Never rename, move or delete client files.\n5. draft-reminders.mjs: for clients whose welcome went out 3 or 7 days ago with items missing, draft a reminder that lists only the missing document names. No tax IDs or account numbers in any email.\n6. Before we use real client documents, remind me to check our data policy. For now I'll drop three test PDFs into one client's inbox. Wait until I tell you it's done, then run all three scripts and show me the results. Stop there.",
        promptPreview: "I add my API key. Then Claude drafts welcome emails into an outbox, matches uploaded PDFs to the checklist, and drafts reminders. Nothing sends.",
        takeaway: "platform.claude.com/docs",
      },
      {
        title: "Nothing sends without a yes",
        layout: "checklist",
        diagram: "versus",
        before: { kicker: "FULLY AUTOMATIC", title: "The script emails clients.", body: "One bad draft reaches every inbox." },
        after: { kicker: "APPROVAL QUEUE", title: "The script drafts.", em: "A person clicks Approve." },
        items: [],
        promptLabel: "Copy · the approval app",
        prompt: "Read WORKFLOW-MAP.md, steps 5 and 8, and the Rules section.\n\n1. Build a small local app, one page on localhost, that lists every draft in outbox/ marked \"awaiting approval\": recipient, subject, body, with Approve, Edit and Reject buttons.\n2. Approve is the only path that sends. It sends with Resend (npm install resend) using an idempotency key of onboarding/<draft file name>, marks the draft sent, and logs the send in tracker.csv with the time and who approved it. No script sends anything on its own.\n3. Until I say Resend is ready, run Approve in dry-run mode: write to sent-log.md instead of sending.\n4. Tell me to create a Resend account, verify our sending domain, and add RESEND_API_KEY to .env.local myself. Wait until I tell you it's done.\n5. Then switch off dry-run, and have me approve one draft addressed to my own email first. Stop there.",
        promptPreview: "A one-page local approval queue: Approve sends through Resend once and logs it, Reject and Edit don't. Dry-run until I set up Resend.",
      },
      {
        title: "Run it, then measure it",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "npm run daily", lines: [{ who: "out", text: "1 new client · 2 drafts awaiting approval" }, { who: "out", text: "4 items ticked · 1 needs review" }, { who: "claude", text: "Onboarding: 41 min per client, down from 70." }] },
        promptLabel: "Copy · daily run and measurement",
        prompt: "Read WORKFLOW-MAP.md and TIME-AUDIT.md.\n\n1. Add an npm script, daily, that runs onboard, draft-welcome, match-docs and draft-reminders in order, then prints a summary: new clients, drafts awaiting approval, items ticked, items needing review, clients complete.\n2. Write RUNBOOK.md: how to run it each morning, what to do with NEEDS-REVIEW.md, how to pause it, and who to ask when something looks wrong.\n3. Add a Minutes per client table to TIME-AUDIT.md, with the baseline from the audit week. Tell me to log real minutes for the next two weeks.\n4. If I want it to run on a schedule, show me the line to add to my own scheduler. Don't add it yourself.\n5. Check every Done when item in WORKFLOW-MAP.md, tell me which pass, and stop.",
        promptPreview: "One npm run daily with a summary, a RUNBOOK.md, and a minutes-per-client log to compare against the audit. Then check Done when.",
      },
      {
        title: "",
        layout: "checklist",
        tone: "bonus",
        diagram: "stage",
        stage: { scene: "fleet", dark: true, kicker: "BONUS ROUND", lines: ["Same map."], em: "Any builder." },
      },
      {
        title: "Build it in n8n, Zapier or Make",
        layout: "checklist",
        tone: "bonus",
        diagram: "demo",
        demo: { label: "claude · ~/saguaro-ops", lines: [{ who: "you", text: "Plan it for Zapier." }, { who: "out", text: "Step 5 → Human in the Loop · Request Approval" }, { who: "out", text: "✓ BUILDER-PLAN.md · 9 steps · 2 unverified" }] },
        promptLabel: "Copy · a plan for a visual builder",
        prompt: "Bonus round. Read WORKFLOW-MAP.md. I want to build this workflow in a visual builder instead of code: n8n, Zapier or Make. Ask me which, and wait for my answer.\n\n1. Read that tool's current docs before writing anything.\n2. Write BUILDER-PLAN.md: for each step in the Map table, the trigger, node, action or module to use, and the app connections I'll need.\n3. Put the human approval where the map says Human. For n8n, check the docs on human review steps for AI tool calls. For Zapier, check the Human in the Loop Request Approval action. For Make, look up what its docs offer, and say so plainly if there's no built-in approval step.\n4. Mark anything you couldn't confirm in the docs as unverified.\n\nI'll do the signup and the build myself. Don't sign up for anything. Stop when the file is written.",
        promptPreview: "Pick n8n, Zapier or Make, read its docs, and turn WORKFLOW-MAP.md into a step-by-step build plan with the approval steps in place.",
        takeaway: "More talks at shipai.club/talks. Bring your map to the Discord.",
      },
      takeHomeSlide(SLUG),
      FOUNDER_WEEKEND_SLIDE,
      COMMUNITY_CLOSE_SLIDE,
    ],
  },
};
