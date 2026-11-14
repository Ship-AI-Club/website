import { ABOUT_SLIDE, JOIN_ROOM_SLIDE, PARTNER_SLIDE, FOUNDER_WEEKEND_SLIDE, COMMUNITY_CLOSE_SLIDE, takeHomeSlide, WORKUITY } from "./shared.js";

const AGENT_SPEC = `# AGENT-SPEC.md · Deskhand

## Job
Deskhand answers customer questions in a small online store's chat: where is my order, can I return this, how do I care for it. It resolves what it can from store data. Anything that moves money waits for the owner's yes in Slack. First customer: one Phoenix candle shop.

## Users
- Shoppers: anonymous on the storefront chat, known by a random visitor id in a signed cookie that \`proxy.ts\` issues. No valid cookie, no chat (401). Order details only after the order number and the email on the order match.
- Owner: one person in Slack. Approves refunds, gets handoffs.

## Stack
- Chat SDK (\`chat\`): Web adapter (\`@chat-adapter/web\`) for the storefront chat, Slack adapter (\`@chat-adapter/slack\`) for the owner, Redis state (\`@chat-adapter/state-redis\`) in production
- Scaffold: \`npm create chat-sdk@latest -- deskhand --adapter web slack memory -y\`
- Chat UI: the Chat pattern from shadcn/ui AI Elements, on \`useChat\` from \`@chat-adapter/web/react\`
- AI SDK (\`ai\`): \`ToolLoopAgent\`, \`tool()\` with Zod schemas, \`stopWhen: isStepCount(8)\`, streamed with \`thread.post(result.fullStream)\`
- AI Gateway: model as a "provider/model" string; OIDC on Vercel, \`AI_GATEWAY_API_KEY\` locally
- Workflow SDK (\`workflow\`): the refund workflow, with \`requestApproval\` from \`chat/workflow\`
- Resend for customer emails
- Vercel: deploy, environment variables, logs, workflow runs, AI Gateway spend, Firewall rate limits

## Tools
| Tool | Reads or writes | Approval |
| --- | --- | --- |
| lookupOrder(orderNumber, email) | Reads one order, only if the email matches. On a match, stores the order number as verified for this thread in Redis state | None |
| trackShipment(trackingNumber) | Reads carrier status | None |
| searchPolicies(query) | Reads returns, shipping and care policies | None |
| handOff(summary) | Posts a summary to the owner's Slack DM | None |
| requestRefund(orderNumber, amount, reason) | Starts the refund workflow only for an order verified in this thread, with the email from that record. Never refunds directly | Owner, in Slack |

## Never
- Refund, cancel or change an order without the owner's approval
- Start a refund for an order that lookupOrder hasn't verified in this thread
- Share order details unless the order number and email match
- Promise anything that isn't in the policies
- Ask for card numbers, passwords or full addresses

## Refund workflow
\`refundRequest({ orderNumber, email, amount, reason })\`, "use workflow"
1. **loadOrder** (step): fetch the order. FatalError if it isn't found, the email doesn't match the order, the amount is more than the order total, or it's outside the 30-day return policy
2. **openOwnerDM** (step): \`bot.openDM(OWNER_SLACK_USER_ID)\`
3. **requestApproval** (workflow level): card with order, amount and reason; \`approvers\` is the owner only; \`timeout: "24h"\` (2 minutes when testing)
4. Denied: **notifyCustomer** with a polite no. Timed out: **handOff**
5. Approved: **issueRefund** (step) with idempotency key \`refund/<orderNumber>\`
6. **notifyCustomer** (step): Resend email with an idempotency key

## Guardrails
- Rate limit: \`checkRateLimit("deskhand-chat", { request })\` from \`@vercel/firewall\` at the top of \`/api/chat\`, keyed by client IP (the default, so clearing the cookie doesn't reset it), 429 when limited
- Cost: messages capped at 2,000 characters, 8 steps per turn, a daily token cap per client IP and per visitor counted from \`totalUsage\` in Redis, and a monthly AI Gateway project budget
- Logs: one JSON line per turn with a hashed thread id, tool names, token counts, latency and outcome. Never message text, emails, names, addresses, raw IPs or order contents

## Evals
\`evals/cases.json\`: 13 conversations with expected outcomes. 4 order questions (one with the wrong email), 3 policy questions, 2 refund requests (one outside policy), 1 handoff, 1 off-topic, 1 attempt to talk the agent into a refund, 1 refund request for an order this thread never verified. Run locally with \`npx tsx evals/run.ts\` against \`data/orders.json\`, with issueRefund, Resend and the Slack calls stubbed.

## Done when
- [ ] A wrong email on an order lookup reveals nothing
- [ ] A refund for an order not verified in this thread is refused
- [ ] A refund request posts an approval card in the owner's Slack, and nothing is refunded before Approve
- [ ] Approve refunds exactly once, even when clicked twice
- [ ] No answer in the wait (2 minutes when testing) hands off to the owner
- [ ] Rapid messages from one IP get a 429, even after clearing cookies
- [ ] All 13 eval cases pass locally
`;

export const TALK = {
  slug: "agent-product",
  standalone: true,
  eventTitle: "Ship an Agent Product",
  key: "Agent Product",
  summary: "An agent people pay for, not a demo that works once.",
  copy: "Tonight Claude Code builds Deskhand, a support agent for small online stores, on Vercel's stack: Chat SDK for the chat, the AI SDK for tools, the Workflow SDK for refunds that wait for the owner's yes, then deploy, guardrails and a small eval set.",
  ...WORKUITY,
  rsvp: [],
  steps: [
    { title: "Spec", body: "The job, the tools, what needs approval." },
    { title: "Tools", body: "A chat UI and an agent that reads store data." },
    { title: "Approve", body: "Refunds wait for the owner's yes in Slack." },
    { title: "Guard", body: "Deploy, rate limits, cost caps, evals." },
  ],
  stepsLede: "A short AI news briefing, then we build Deskhand live with Claude Code from one AGENT-SPEC.md, then five-minute demos from the room.",
  closing: ["Write the limits.", "Then charge for it."],
  example: {
    name: "Deskhand",
    heading: ["Tonight's", "agent."],
    lede: "The agent spec we build from on the night: a support agent for a small online store, with its tools, its approvals and its evals. Copy it and swap in your own agent's job.",
    file: "AGENT-SPEC.md",
    pitch: "A support agent for small online stores. It answers order questions and asks the owner before money moves.",
    jobLabel: "The job",
    job: "Answer order, return and care questions in the store's chat; refunds wait for the owner's yes in Slack.",
    stack: ["Chat SDK", "AI SDK", "AI Gateway", "Workflow SDK", "Next.js", "Vercel"],
    doneLabel: "Done when",
    done: [
      "A wrong email on an order lookup reveals nothing",
      "Refunds wait for Approve in the owner's Slack",
      "Approve refunds exactly once",
      "Rapid messages get a 429",
      "All 13 eval cases pass",
    ],
    spec: AGENT_SPEC,
    specLabel: "The full agent spec",
    specDestination: "an AGENT-SPEC.md file in your project folder",
  },
  toolsLede: "Vercel's agent stack, one job each: the chat, the model calls, the long-running work and the platform it runs on.",
  tools: [
    { name: "Chat SDK", job: "One bot for the web chat and Slack, with typed handlers, cards and streaming", cmd: "npm create chat-sdk@latest", href: "https://chat-sdk.dev/docs" },
    { name: "Chat SDK skill", job: "Teaches Claude Code the Chat SDK from the docs bundled with the package", cmd: "npx skills add vercel/chat", href: "https://chat-sdk.dev/docs" },
    { name: "AI Elements", job: "The Chat pattern for the storefront UI, copied into your project from shadcn/ui", cmd: "npx shadcn@latest init", href: "https://ui.shadcn.com/docs/ai-elements/base/chat" },
    { name: "AI SDK", job: "ToolLoopAgent, tools with Zod schemas, streaming and structured output", cmd: "npm install ai zod", href: "https://ai-sdk.dev/docs/agents/building-agents" },
    { name: "AI Gateway", job: "\"provider/model\" strings, request logs and spend budgets", cmd: "vercel ai-gateway budgets set project deskhand --amount <limit> --refresh-period monthly", href: "https://vercel.com/docs/ai-gateway/observability-and-spend/budgets" },
    { name: "Workflow SDK", job: "Durable steps, retries and waits that survive deploys", cmd: "npm i workflow", href: "https://workflow-sdk.dev" },
    { name: "Vercel CLI", job: "Link the project, pull env vars, deploy", cmd: "npm i -g vercel", href: "https://vercel.com/docs/cli" },
    { name: "Vercel Firewall SDK", job: "Per-IP rate limits in code", cmd: "npm i @vercel/firewall", href: "https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting-sdk" },
  ],
  deck: {
    title: "Ship an Agent Product",
    includeRoiSlide: false,
    includeShowcaseSlide: false,
    visual: true,
    slides: [
      {
        title: "",
        layout: "checklist",
        diagram: "stage",
        stage: { scene: "launch", dark: true, logo: true, kicker: "SHIP AI TALKS", lines: ["Ship an"], em: "agent product", body: "Leave with an agent spec, a deployed support agent and the limits that let you charge for it." },
      },
      ABOUT_SLIDE,
      JOIN_ROOM_SLIDE,
      PARTNER_SLIDE,
      {
        title: "",
        layout: "checklist",
        diagram: "stage",
        stage: { scene: "harbor", dark: true, kicker: "THE IDEA", lines: ["A demo answers."], em: "A product knows its limits." },
      },
      {
        title: "Demo or product",
        layout: "checklist",
        diagram: "versus",
        before: { kicker: "A DEMO", title: "One prompt. Works on stage." },
        after: { kicker: "A PRODUCT", title: "Tools, approvals, limits.", em: "Evals before customers." },
        items: [],
      },
      {
        title: "Tonight",
        layout: "checklist",
        diagram: "result",
        items: [{ title: "Spec" }, { title: "Tools" }, { title: "Approve" }, { title: "Guard" }],
      },
      {
        title: "Tonight's agent",
        layout: "checklist",
        diagram: "doc",
        doc: {
          file: "AGENT-SPEC.md",
          sections: [
            { h: "Job", lines: ["Answer a candle shop's order and return questions."] },
            { h: "Tools", lines: ["Look up orders, track, read policies, hand off."] },
            { h: "Approval", lit: true, lines: ["Refunds wait for the owner's yes in Slack."] },
            { h: "Done when", lines: ["[ ] Wrong email reveals nothing", "[ ] Approve refunds once", "[ ] 13 evals pass"] },
          ],
        },
      },
      {
        title: "Vercel's agent stack",
        layout: "checklist",
        diagram: "result",
        items: [
          { title: "Chat SDK", body: "Web chat and Slack, one bot" },
          { title: "AI SDK", body: "Agent, tools, streaming" },
          { title: "Workflow SDK", body: "Refunds that wait for a yes" },
          { title: "Vercel", body: "Deploy, env vars, logs, spend" },
        ],
      },
      {
        title: "Spec the agent",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "claude · ~/deskhand", lines: [{ who: "claude", text: "Which tools can move money?" }, { who: "you", text: "Only refunds. The owner approves those." }, { who: "claude", text: "What may we log?" }, { who: "out", text: "✓ AGENT-SPEC.md: 5 tools, 1 approval, 13 evals" }] },
        promptLabel: "Copy · write the agent spec",
        prompt: "I'm building Deskhand, a support agent for small online stores, starting with one Phoenix candle shop. Shoppers chat on the store's site. The owner approves anything that moves money from Slack.\n\nInterview me one question at a time and wait for each answer: the job, who the users are, which tools the agent may call and what each one reads or writes, what must wait for the owner's approval, what the agent must never do, which limits protect us (rate, cost, message length), what we may and may not log, and how we'll know it works.\n\nThen write AGENT-SPEC.md with these sections: Job, Users, Stack, Tools (a table: tool, reads or writes, approval), Never, Refund workflow (numbered steps), Guardrails, Evals, Done when. The stack is Chat SDK with the Web and Slack adapters, the AI SDK through Vercel AI Gateway, the Workflow SDK, and Vercel.\n\nDon't write code yet. Stop and wait for my OK.",
        promptPreview: "Interview me about Deskhand, then write AGENT-SPEC.md: job, users, tools, approvals, never list, guardrails, evals. Wait for my OK.",
      },
      {
        title: "Scaffold with Chat SDK",
        layout: "checklist",
        diagram: "setup",
        terminal: { label: "~/deskhand", kicker: "ONE BOT, TWO CHANNELS", lines: ["npm create chat-sdk@latest -- deskhand", "  --adapter web slack memory -y"], body: "Webhook routes, bot.ts and .env.example." },
        items: [
          { title: "You add the skills", body: "Chat SDK and Workflow SDK, from their own docs." },
          { title: "Claude scaffolds", body: "The CLI runs without prompts inside Claude Code." },
          { title: "One folder", body: "Move the spec in, restart Claude Code there." },
        ],
        promptLabel: "Copy · scaffold the bot",
        prompt: "Read AGENT-SPEC.md.\n\n1. In my own terminal I'll run:\nnpx skills add vercel/chat\nnpx skills add https://github.com/vercel/workflow --skill workflow\nWait until I tell you it's done.\n2. From this parent folder (where AGENT-SPEC.md is, not inside a deskhand folder), run: npm create chat-sdk@latest -- deskhand --adapter web slack memory -y\nMemory state is for local development only. We switch to Redis before deploying.\n3. Move AGENT-SPEC.md into the deskhand folder. Show me the generated files and what each one does.\n4. Tell me to restart Claude Code inside the deskhand folder so the skills load there. Stop and wait.",
        promptPreview: "I add the Chat SDK and Workflow SDK skills. Then scaffold with create-chat-sdk (web, slack, memory), move the spec in, and restart.",
        takeaway: "chat-sdk.dev",
      },
      {
        title: "The storefront chat",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "claude · ~/deskhand", lines: [{ who: "out", text: "✓ proxy.ts · signed visitor cookie" }, { who: "out", text: "✓ app/page.tsx · Chat pattern on useChat" }, { who: "out", text: "✓ onDirectMessage · streaming fullStream" }, { who: "claude", text: "Run npm run dev and ask about returns." }] },
        promptLabel: "Copy · the chat UI",
        prompt: "Read AGENT-SPEC.md, src/lib/bot.ts and src/app/api/chat/route.ts. Use the Chat SDK skill and the docs in node_modules/chat/docs.\n\n1. Issue the visitor cookie in src/proxy.ts. Next.js 16 renamed middleware to proxy, so check https://nextjs.org/docs/app/api-reference/file-conventions/proxy first. When a request has no valid cookie, create a random visitor id (no colon in it), sign it with COOKIE_SECRET, and set it on the response as httpOnly, secure and sameSite lax. Skip static files in the matcher.\n2. Replace the getUser stub so it only reads and verifies that cookie: return { id } when the signature checks out, and null (a 401) when the cookie is missing or invalid. getUser never creates a cookie. Tell me to add COOKIE_SECRET to .env.local myself (a long random string) for local dev, and wait until I tell you it's done.\n3. The scaffold has no pages, no root layout and no Tailwind. Add a root layout and Tailwind CSS, then run npx shadcn@latest init. Build the storefront chat in src/app/page.tsx from the Chat pattern at https://ui.shadcn.com/docs/ai-elements/base/chat.md. Its components import @ai-sdk/react, so install that too, but wire the page to useChat from @chat-adapter/web/react.\n4. In bot.ts, handle onDirectMessage with a ToolLoopAgent from ai. Its instructions come from the Job and Never sections. No tools yet. Pass earlier turns with toAiMessages from chat/ai, then post the agent's fullStream to the thread with thread.signal as the abort signal.\n5. Use AI Gateway with a \"provider/model\" string. Check the AI Gateway model list for a current model ID instead of guessing. Tell me to add AI_GATEWAY_API_KEY to .env.local myself, and wait until I tell you it's done.\n6. Tell me to run npm run dev and ask it about the return policy. Stop there.",
        promptPreview: "A signed visitor cookie from proxy.ts, the shadcn/ui Chat pattern on useChat, and a streaming ToolLoopAgent through AI Gateway.",
      },
      {
        title: "Give it tools",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "localhost:3000", lines: [{ who: "you", text: "Where's order 1042? jen@example.com" }, { who: "out", text: "→ lookupOrder · → trackShipment" }, { who: "claude", text: "It shipped Tuesday and arrives Friday." }] },
        promptLabel: "Copy · the AI SDK tools",
        prompt: "Read AGENT-SPEC.md, sections Tools and Never.\n\n1. Create data/orders.json with 15 realistic sample orders for a candle shop (order number, email, items, total, status, tracking number, order date) and data/policies.md with returns, shipping and candle-care policies. Put all reads behind lib/store.ts so it can call the real store API later.\n2. Add tools with tool() from ai and a Zod inputSchema each: lookupOrder (returns details only when the email matches the order, otherwise a generic \"I couldn't find that order\"; on a match, it also stores the order number and email as verified for this thread on the server, in the bot's state, memory now and Redis once deployed, keyed by the thread id from the handler, never by anything the model or the browser sends), trackShipment, searchPolicies, and handOff (for now it logs a one-line summary).\n3. Give them to the agent with stopWhen: isStepCount(8). No refund tool yet.\n4. Give me five questions to try in the chat, including one with the wrong email, and tell me what a correct answer looks like for each. Stop there.",
        promptPreview: "Sample orders and policies behind lib/store.ts, then lookupOrder, trackShipment, searchPolicies and handOff as AI SDK tools.",
      },
      {
        title: "Read freely. Ask before money moves.",
        layout: "checklist",
        diagram: "versus",
        before: { kicker: "A DEMO AGENT", title: "Calls refund() on its own." },
        after: { kicker: "DESKHAND", title: "The agent asks.", em: "The owner decides in Slack." },
        items: [],
        promptLabel: "Copy · connect the owner's Slack",
        prompt: "Read AGENT-SPEC.md and the \"Create a Slack app from manifest\" section of node_modules/@chat-adapter/slack/README.md.\n\n1. Write slack-manifest.yaml from that manifest, with the app named Deskhand and both request_url fields set to https://YOUR-TUNNEL/api/webhooks/slack.\n2. Tell me how to expose localhost:3000 with a tunnel. I'll create the app from the manifest at api.slack.com/apps, install it to my workspace, replace YOUR-TUNNEL, and add SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET and OWNER_SLACK_USER_ID to .env.local myself. Wait until I tell you it's done.\n3. Change handOff: open a DM with the owner with bot.openDM(OWNER_SLACK_USER_ID) and post the summary there.\n4. Tell me to ask for a human in the storefront chat and check my Slack. Stop there.",
        promptPreview: "A Slack manifest for Deskhand, I install the app and add the keys, then handOff posts to the owner's DM.",
      },
      {
        title: "Refunds wait for a yes",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "workflow · refundRequest", lines: [{ who: "out", text: "✓ loadOrder · 1042 · within 30 days" }, { who: "out", text: "⏸ requestApproval · owner's DM · up to 24h" }, { who: "you", text: "[ owner taps Approve in Slack ]" }, { who: "out", text: "✓ issueRefund · refund/1042 · once" }] },
        promptLabel: "Copy · the refund workflow",
        prompt: "Read AGENT-SPEC.md, section Refund workflow, the Approvals guide in node_modules/chat/docs, and the Workflow SDK docs in node_modules/workflow/docs.\n\n1. Run npm i workflow and set it up for Next.js as the docs say (withWorkflow from workflow/next in next.config). Call registerSingleton() on the Chat instance in bot.ts.\n2. Create workflows/refund.ts with a \"use workflow\" function refundRequest({ orderNumber, email, amount, reason }). As \"use step\" functions: loadOrder (throw FatalError from workflow if the order isn't found, the email doesn't match the order, the amount is more than the total, or it's outside the return policy), openOwnerDM (bot.openDM with OWNER_SLACK_USER_ID), issueRefund (through lib/store.ts, idempotency key refund/<orderNumber>), and notifyCustomer (Resend email with an idempotency key).\n3. At the workflow level, call requestApproval from chat/workflow on the owner's DM thread: order, amount and reason as fields, approvers set to the owner only, timeout \"24h\", or 2 minutes when a test env flag is set. On deny, notify the customer politely. On timeout, hand off.\n4. Add a requestRefund tool. First it reads the verified orders that lookupOrder stored for this thread on the server. If the order number isn't there, it refuses and asks the shopper to look the order up with its email first. Otherwise it takes the email from that record, never from the model, starts the workflow with start from workflow/api, and tells the shopper the owner will decide within a day. The agent never refunds directly.\n5. Tell me to add RESEND_API_KEY to .env.local myself and wait until I tell you it's done. Then tell me to request a refund in the chat, approve it in Slack, click Approve twice, and watch the run in npx workflow web. Stop there.",
        promptPreview: "A durable refund workflow: steps that retry, requestApproval in the owner's Slack DM with a 24h timeout, then refund exactly once.",
        takeaway: "workflow-sdk.dev",
      },
      {
        title: "Deploy it",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "claude · ~/deskhand", lines: [{ who: "out", text: "✓ state · Redis (REDIS_URL)" }, { who: "out", text: "✓ npm run build · 0 errors" }, { who: "out", text: "✓ deployed · deskhand.vercel.app" }, { who: "claude", text: "Point Slack's request URLs here." }] },
        promptLabel: "Copy · deploy to Vercel",
        prompt: "Read AGENT-SPEC.md and the Workflow SDK deploy docs in node_modules/workflow/docs.\n\n1. Swap the memory state for createRedisState from @chat-adapter/state-redis, reading REDIS_URL. The approval click and the workflow must share the same state.\n2. In my own terminal and dashboard I'll run vercel link, add a Redis database to the project from the Vercel Marketplace, add SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, OWNER_SLACK_USER_ID, RESEND_API_KEY and COOKIE_SECRET under Environment Variables, make sure system environment variables are exposed as the Workflow SDK docs say, and run vercel env pull. On Vercel, AI Gateway authenticates with OIDC, so no gateway key is needed there. Wait until I tell you it's done.\n3. Run npm run build and fix any errors, then deploy with vercel --prod.\n4. Tell me to point both request_url fields in the Slack app at the project's production domain (deskhand.vercel.app, or our custom domain once it's added), not the per-deployment URL that vercel --prod prints: Standard Protection blocks that one, so Slack's requests would fail. Wait until I tell you it's done. Then show me where to find this deploy's logs, its workflow runs, and its AI Gateway requests in the Vercel dashboard. Stop there.",
        promptPreview: "Redis state, I set env vars and link the project, then build, deploy with vercel --prod, and find logs, runs and gateway requests.",
      },
      {
        title: "Guardrails",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "deskhand · logs", lines: [{ who: "out", text: "{ thread: \"a91f…\", tools: [\"lookupOrder\"], tokens: 1840 }" }, { who: "out", text: "429 · deskhand-chat · ip 7c2e…" }, { who: "claude", text: "No message text, emails or addresses logged." }] },
        promptLabel: "Copy · rate limits, cost caps, safe logs",
        prompt: "Read AGENT-SPEC.md, section Guardrails, and the Vercel rate limiting SDK docs at https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting-sdk.\n\n1. Rate limit: in the Vercel dashboard I'll create a Firewall rule with the @vercel/firewall condition and the rate limit ID deskhand-chat. Wait until I tell you it's done. Then npm i @vercel/firewall and call checkRateLimit(\"deskhand-chat\", { request }) at the top of /api/chat. Leave out rateLimitKey so the key stays the client IP: a shopper can clear the visitor cookie, but not their IP. When limited, return 429 with a friendly message.\n2. Cost: reject messages over 2,000 characters, keep stopWhen at 8 steps, and keep two daily token counts in Redis from the agent's totalUsage: one per client IP (ipAddress from @vercel/functions, stored hashed) and one per visitor id. Past either cap, offer handOff instead of calling the model. Give me the command to set a monthly AI Gateway project budget myself: vercel ai-gateway budgets set project deskhand --amount <limit> --refresh-period monthly.\n3. Logs: one JSON line per turn with a hashed thread id, tool names, token counts, latency and outcome. Never log message text, emails, names, addresses, raw IPs or order contents. Search the codebase for any log that could leak them and fix it.\n4. Deploy, then tell me to send messages quickly from one browser until I see the 429. Stop there.",
        promptPreview: "A per-IP Firewall rate limit, message and token caps plus an AI Gateway budget, and one JSON log line per turn with no PII.",
      },
      {
        title: "A small eval set",
        layout: "checklist",
        diagram: "demo",
        demo: { label: "npx tsx evals/run.ts", lines: [{ who: "out", text: "✓ wrong-email-1042 · nothing revealed" }, { who: "out", text: "✗ refund-pressure · refund tool skipped approval" }, { who: "claude", text: "Fixed the instructions. 13 of 13 pass." }] },
        promptLabel: "Copy · the eval set",
        prompt: "Read AGENT-SPEC.md, sections Evals and Done when.\n\n1. Write evals/cases.json: 13 short conversations, each with its expected outcome. 4 order questions (one with the wrong email), 3 policy questions, 2 refund requests (one outside the policy), 1 request for a human, 1 off-topic message, 1 shopper trying to talk the agent into a refund without approval, and 1 shopper who verifies their own order and then asks for a refund on a different order number.\n2. Write evals/run.ts. It runs locally: each case goes through the same agent and tools against data/orders.json, with memory state, and with issueRefund, Resend and the Slack calls stubbed. It checks which tools were called, that no refund ran without approval, that requestRefund refused any order not verified in that thread, and that no order details leaked on a wrong email. Use plain checks first. For tone, add a second model call with Output.object that returns pass or fail and a reason.\n3. Run it with npx tsx evals/run.ts and show me a pass/fail table. Fix the agent's instructions or tools, not the cases, until all 13 pass.\n4. Then check the other Done when items in AGENT-SPEC.md against the deployed app, tell me which pass, and stop.",
        promptPreview: "13 cases with expected outcomes, run locally with stubs, a runner that checks tools, approvals and leaks, then fix the agent until all pass.",
        takeaway: "More Ship AI talks at shipai.club/talks. Bring your agent's first real question to the Discord.",
      },
      takeHomeSlide("agent-product"),
      FOUNDER_WEEKEND_SLIDE,
      COMMUNITY_CLOSE_SLIDE,
    ],
  },
};
