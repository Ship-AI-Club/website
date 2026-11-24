import { SERIES_TALKS, LUNCH_TALKS, STANDALONE_TALKS } from "./talks/index.js";

export const SPEC_INTERVIEW_PROMPT = `Interview me about an app idea until we can write a one-page spec.

Ask one question at a time and wait for my answer. Cover:
- Who it's for, and the moment they'd open it
- The one job it does
- What it will not do in the first version
- What the screen shows
- What data it keeps, if any
- What done looks like: how we'll know it works

Push back when an answer is vague. When you have enough, write SPEC.md with these sections: Problem, User, The one job, Out of scope, Screen, Data, Done when. Keep it to one page.

Then stop and wait for my OK before writing any code.`;

export const EXAMPLE_SPEC = "# What's for Dinner\n\n## Problem\nAt 6pm people stare into the fridge, see ingredients instead of meals, and order takeout.\n\n## User\nSomeone at home in the early evening, on their phone, with a few ingredients and twenty minutes.\n\n## The one job\nTurn what's in my fridge into dinner tonight.\n\n## Out of scope\n- No meal planning, calendars or grocery lists\n- No recipe database or search\n- No sharing or social features\n- No nutrition tracking\n- No dark mode or settings\n\n## Screen\nPhone first:\n1. Sign in or sign up with email and password (Better Auth)\n2. One input: \"What's in your fridge?\" with ingredients as chips, and a \"Find dinners\" button\n3. Three dinner cards: name, minutes, the ingredients it uses, and five short steps\n4. \"Your dinners\" below: past results, newest first, only yours\n\n## Data\nBetter Auth's own tables for users and sessions, plus two tables: `dinners`: `id`, `user_id`, `ingredients` (text array), `recipes` (JSON, three items), `created_at`; and `ai_calls` (see Money).\n\n## Money\nThe pricing model and the free limit come from RESEARCH.md. No payments yet.\n- `ai_calls`: `id`, `user_id`, `model`, `input_tokens`, `output_tokens`, `cost` (from providerMetadata.gateway.cost, if present), `created_at`. Insert one row for every AI call, including failures.\n- Before each call, count this month's `ai_calls` for the user on the server. At the free limit (10 a month unless RESEARCH.md says otherwise), skip the call and show \"You've used your 10 free dinners this month. More soon.\" in place of an error.\n\n## AI\nOne server route calls Claude Sonnet through the AI SDK and Vercel AI Gateway with the ingredient list and returns exactly three recipes as structured output (name, minutes, ingredients used, five steps). Recipes only use what was given plus pantry basics (salt, oil, pepper). 15-second timeout; on failure, show \"Couldn't find dinners right now\" and save nothing.\n\n## Done when\n- [ ] On a phone-width screen, I can sign up, sign in and sign out\n- [ ] Typing four ingredients and tapping \"Find dinners\" shows three recipes in under 15 seconds\n- [ ] Every recipe only uses my ingredients plus salt, oil and pepper\n- [ ] \"Your dinners\" shows my past results after a refresh, and another account can't see them\n- [ ] Every \"Find dinners\" tap adds one ai_calls row with my user id and token counts, and the 11th request this month shows the free-limit message without calling the model\n- [ ] It's live on a Vercel URL\n\n## Bonus\n\"Snap your fridge\": upload a photo instead of typing. A vision-capable Claude model, through the AI SDK and AI Gateway, turns the photo into the ingredient chips, which the person can edit before tapping \"Find dinners\". Photos under 5 MB, never stored.\n";

const BUILD_NIGHT_DECK = {
  title: "Build the MVP",
  includeRoiSlide: false,
  includeShowcaseSlide: false,
  visual: true,
  slides: [
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "launch", dark: true, logo: true, kicker: "CLAUDE CODE BUILD NIGHT · PART 2 · TUE DEC 8", lines: ["Build the"], em: "MVP", body: "Bring an idea. Leave with a live app." },
    },
    {
      title: "Who's hosting",
      lead: "How you do anything is how you do everything.",
      layout: "checklist",
      diagram: "about",
      about: {
        photo: "/brand/santos-headshot-ship-ai.jpg",
        name: "Santos Hernandez",
        role: "Founder, Ship AI",
        proofs: [
          { v: "$25k+/mo", l: "ggbucks, built with agents", lit: true },
          { v: "$0 to $12M", l: "ARR at ZBD" },
          { v: "EU first", l: "MiCAR approval" },
        ],
        orgs: [
          { kicker: "THE COMMUNITY", name: "Ship AI", body: "Free workshops and talks in Phoenix.", link: "shipai.club", href: "https://www.shipai.club" },
          { kicker: "THE STUDIO", name: "Ship AI Studio", body: "AI built into your business, in two weeks.", link: "shipaistudio.com", href: "https://www.shipaistudio.com" },
        ],
      },
    },
    {
      title: "Join the room",
      layout: "checklist",
      diagram: "qr",
      qr: "discord",
      qrKicker: "SHIP AI DISCORD",
      qrTitle: "Scan it now.",
      qrEm: "Prompts later.",
      qrCta: "Open the Discord invite",
    },
    {
      title: "Our partner",
      layout: "checklist",
      diagram: "partner",
      partnerLine: "Building Phoenix's AI community, together. Workuity hosts tonight, and we present Founder Weekend side by side.",
      items: [],
    },
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "slipway", dark: true, kicker: "THE IDEA", lines: ["The bottleneck was code."], em: "Now it's clarity." },
    },
    {
      title: "Start with the spec",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "PROMPT AND HOPE", title: "\"Build me an app.\"" },
      after: { kicker: "SPEC FIRST", title: "One user. One job.", em: "The spec is the prompt." },
      items: [],
    },
    {
      title: "Tonight",
      layout: "checklist",
      diagram: "result",
      items: [{ title: "Idea" }, { title: "Spec" }, { title: "Build" }, { title: "Ship" }],
    },
    {
      title: "Tonight's example",
      layout: "checklist",
      diagram: "phone",
      phone: {
        app: "What's for Dinner",
        avatar: "M",
        question: "What's in your fridge?",
        chips: ["eggs", "spinach", "feta", "onion"],
        button: "Find dinners",
        sub: "3 dinners from what you have",
        cards: [
          { name: "Spinach and feta omelette", meta: "15 min · easy", badge: "4 of 4", icon: "egg" },
          { name: "Shakshuka", meta: "25 min · one pan", badge: "4 of 4", icon: "pan", active: true },
          { name: "Greek frittata", meta: "20 min · oven", badge: "4 of 4", icon: "bowl" },
        ],
        detail: {
          meta: "SHAKSHUKA · 25 MIN",
          title: "Five steps, one pan",
          steps: ["Soften the onion in oil", "Wilt in the spinach", "Make four wells", "Crack in the eggs, cover", "Crumble feta, serve"],
        },
        pitch: "Type what's in your fridge. Get three dinners you can make tonight.",
        tags: ["One feature", "Better Auth", "AI SDK"],
      },
    },
    {
      title: "Let Claude Code interview you",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude \u00b7 ~/build-night", lines: [{ who: "claude", text: "Who is it for, and when do they open it?" }, { who: "you", text: "Anyone staring into the fridge at 6pm." }, { who: "claude", text: "What's the one job?" }, { who: "you", text: "Turn what I have into dinner tonight." }, { who: "out", text: "\u2713 Wrote SPEC.md" }] },
      promptLabel: "Copy \u00b7 the spec interview",
      prompt: "Interview me about an app idea until we can write a one-page spec.\n\nAsk one question at a time and wait for my answer. Cover:\n- Who it's for, and the moment they'd open it\n- The one job it does\n- What it will not do in the first version\n- What the screen shows\n- What data it keeps, if any\n- What done looks like: how we'll know it works\n\nPush back when an answer is vague. When you have enough, write SPEC.md with these sections: Problem, User, The one job, Out of scope, Screen, Data, Done when. Keep it to one page.\n\nThen stop and wait for my OK before writing any code.",
      promptPreview: "Interview me about an app idea until we can write a one-page spec. Ask one question at a time. Push back when an answer is vague. Write SPEC.md, then wait for my OK before writing any code.",
    },
    {
      title: "The spec",
      layout: "checklist",
      diagram: "doc",
      doc: {
        file: "SPEC.md",
        sections: [
          { h: "User", lines: ["Home at 6pm, on their phone, twenty minutes."] },
          { h: "The one job", lit: true, lines: ["Turn what's in my fridge into dinner tonight."] },
          { h: "Out of scope", lines: ["No meal plans, grocery lists or recipe search."] },
          { h: "Done when", lines: ["[ ] Three recipes in under 15 seconds", "[ ] Only my ingredients, plus salt, oil and pepper", "[ ] My history stays mine after a refresh"] },
        ],
      },
    },
    {
      title: "Planning skills from Matt Pocock",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude \u00b7 ~/build-night", lines: [{ who: "you", text: "/grill-me" }, { who: "claude", text: "What if they only have three ingredients?" }, { who: "you", text: "Still three dinners, just simpler." }, { who: "you", text: "/to-spec" }, { who: "out", text: "\u2713 Spec saved to the repo" }] },
      promptLabel: "Copy \u00b7 the commands, in order",
      prompt: "Type these one at a time. They are commands, not a prompt to paste.\n\n1. In your terminal:\n   claude plugin install mattpocock-skills@claude-plugins-official\n2. In Claude Code:\n   /reload-plugins\n3. /setup-matt-pocock-skills\n   Choose local markdown files as the issue tracker.\n4. /grill-me\n   Then describe your app idea and answer its questions.\n5. /to-spec\n   Run it once the plan holds up.\n6. Then paste this prompt:\n   Copy the spec you just wrote to SPEC.md at the repo root. Trim it to one page with these sections: Problem, User, The one job, Out of scope, Screen, Data, Done when.",
      promptPreview: "Install the plugin, /reload-plugins, /setup-matt-pocock-skills, then /grill-me on your idea and /to-spec. Finish by copying the spec to SPEC.md.",
      promptDestination: "your terminal and Claude Code, one step at a time",
      takeaway: "github.com/mattpocock/skills",
    },
    {
      title: "Set up the stack",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude \u00b7 ~/build-night", lines: [{ who: "out", text: "\u2713 Next.js app created" }, { who: "out", text: "\u2713 SPEC.md moved into build-night" }, { who: "claude", text: "Run neon init, then restart me in build-night." }] },
      promptLabel: "Copy \u00b7 set up the stack",
      prompt: "Read SPEC.md. Set up the project for it one step at a time, and stop after each step.\n\n1. Create a Next.js app with TypeScript, Tailwind CSS and the App Router:\nnpx create-next-app@latest build-night --ts --tailwind --app --eslint --use-npm --yes\n2. Move SPEC.md into build-night.\n3. Stop and tell me to do three things myself, then wait until I'm back:\n   - cd build-night\n   - run npx neon@latest init, which signs me in and sets up Neon's MCP server and agent skills for this folder\n   - start Claude Code again inside build-night\n\nDo not build any features yet.",
      promptPreview: "Read SPEC.md, create the Next.js app, move SPEC.md into it, then stop so I can run neon init there and restart Claude Code.",
    },
    {
      title: "Build it slice by slice",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude \u00b7 ~/build-night", lines: [{ who: "out", text: "\u2713 Neon database ready" }, { who: "out", text: "\u2713 Better Auth: email and password" }, { who: "out", text: "\u2713 AI SDK through AI Gateway" }, { who: "claude", text: "Slice 1 of 4: sign-in. Open localhost:3000." }] },
      promptLabel: "Copy \u00b7 build from the spec",
      prompt: "Read SPEC.md.\n\nFirst, the foundations. Do these one at a time and stop after each:\n1. Database: if .env.local has no DATABASE_URL, use the Neon tools to create a database for this project and save its connection string to .env.local. Never print secrets.\n2. Auth: add Better Auth with email and password, following its current docs for Next.js and Postgres. Generate BETTER_AUTH_SECRET into .env.local and create its tables.\n3. AI: install the AI SDK with npm install ai. Ask me to create an AI Gateway API key in the Vercel dashboard and add it to .env.local as AI_GATEWAY_API_KEY myself. Wait until I tell you it's done.\n\nThen create only the table SPEC.md needs. Restate the spec in five lines and list the smallest slices that get us to every check under Done when, in order. Wait for my OK.\n\nBuild one slice at a time. After each slice, run it, tell me what to open in the browser, and wait for me before starting the next one. If something in SPEC.md is unclear, ask me instead of guessing. Do not add anything listed under Out of scope.",
      promptPreview: "Read SPEC.md. Set up Neon, Better Auth and the AI SDK one at a time, then list the slices and wait for my OK. Build one slice at a time.",
    },
    {
      title: "Steering is the skill",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "WHAT IT BUILT", title: "A weekly meal planner." },
      after: { kicker: "WHAT YOU SAY", title: "\"The spec says dinner tonight.\"", em: "It fixes itself." },
      items: [],
      promptLabel: "Copy \u00b7 steer it back",
      prompt: "That isn't what SPEC.md says. Here is what I saw: [describe what happened on screen]. The spec says: [quote the line]. Explain in one sentence why they differ, fix it, and tell me what to check. Don't change anything else.",
      promptPreview: "Point at the line in SPEC.md, say what you saw, and let it fix only that.",
    },
    {
      title: "Polish skills from Emil Kowalski",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude \u00b7 ~/build-night", lines: [{ who: "you", text: "/break-ui" }, { who: "claude", text: "Ten ingredients overflow the chip row." }, { who: "out", text: "\u2713 They wrap cleanly now" }] },
      promptLabel: "Copy \u00b7 break it, then polish",
      prompt: "Install Emil Kowalski's skills for this project. In my terminal I will run:\nnpx skills@latest add emilkowalski/skills\n\nWait until I tell you it's installed. If you can't see the skills yet, tell me to restart Claude Code.\n\nThen run /break-ui on the main screen. Try worst-case data: long names, an empty list, a huge count. Fix what breaks, one issue at a time, and show me each fix at phone width.",
      promptPreview: "Install emilkowalski/skills, run /break-ui on the main screen with worst-case data, and fix what breaks one issue at a time.",
      takeaway: "github.com/emilkowalski/skills",
    },
    {
      title: "Ship it",
      layout: "checklist",
      diagram: "demo",
      demo: { label: "claude \u00b7 ~/build-night", lines: [{ who: "out", text: "\u2713 5 of 5 checks under Done when" }, { who: "out", text: "\u2713 Pushed to GitHub, deployed on Vercel" }, { who: "claude", text: "Live at whats-for-dinner.vercel.app" }] },
      promptLabel: "Copy \u00b7 ship it",
      prompt: "Run every check under Done when in SPEC.md and tell me which pass. Fix any that fail.\n\nThen get this live. Create a GitHub repo and push to it, connect it to Vercel, and add DATABASE_URL to the Vercel project's environment variables. Ask me before any step that needs my login. When the deploy finishes, give me the live URL.",
      promptPreview: "Run every check under Done when, fix what fails, then push to GitHub, deploy on Vercel with DATABASE_URL set, and give me the live URL.",
      takeaway: "Next: The Front Door, Tue Jan 5.",
    },
    {
      title: "",
      layout: "checklist",
      tone: "bonus",
      diagram: "stage",
      stage: { scene: "voyage", dark: true, kicker: "BONUS ROUND", lines: ["Time on the clock?"], em: "Snap your fridge." },
    },
    {
      title: "Teach it to see",
      layout: "checklist",
      tone: "bonus",
      diagram: "demo",
      demo: { label: "whats-for-dinner \u00b7 Snap your fridge", lines: [{ who: "you", text: "[ photo of the fridge ]" }, { who: "claude", text: "Eggs, spinach, feta, half an onion." }, { who: "out", text: "\u2192 Omelette \u00b7 Shakshuka \u00b7 Frittata" }] },
      promptLabel: "Copy \u00b7 the bonus feature",
      prompt: "Bonus round: add \"Snap your fridge\". Stop after each step.\n\n1. Add a section called Bonus to SPEC.md: a \"Snap your fridge\" button next to the ingredients box. The person uploads a photo (under 5 MB, never stored). A vision-capable Claude model turns it into ingredient chips the person can edit before tapping \"Find dinners\". If the photo has no food in it, say so instead of guessing.\n2. Use the AI SDK through Vercel AI Gateway with a \"provider/model\" string. Check the AI Gateway model list for the current vision-capable Claude Sonnet model ID instead of guessing.\n3. Add one server route that sends the image and returns a plain list of ingredients, with a 15-second timeout. On failure, keep the ingredients box as it was and show \"Couldn't read that photo.\"\n4. Show me the button at phone width with a real photo, then redeploy. Don't commit any keys.",
      promptPreview: "Add a Snap your fridge button: a vision-capable Claude model reads the photo through AI Gateway and fills the ingredient chips. Handle failures, then redeploy.",
    },
    {
      title: "Take it home",
      layout: "checklist",
      diagram: "qr",
      qr: "talk-claude-code-build-night",
      qrKicker: "THE TALK PAGE",
      qrTitle: "Every prompt,",
      qrEm: "and this deck.",
      qrCta: "Open the talk page",
    },
    {
      title: "Founder Weekend",
      layout: "checklist",
      diagram: "qr",
      qr: "founder-weekend",
      qrKicker: "FEB 6‑7, 2027 · FREE",
      qrTitle: "One session down.",
      qrEm: "Take a weekend.",
      qrBody: "An Arizona AI hackathon. Teams of 1-4.",
      qrCta: "See the hackathon",
    },
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "harbor", dark: true, kicker: "SHIP AI DISCORD", lines: ["Free and open."], em: "Build with us.", qr: "discord", qrLabel: "Scan to join" },
    },
  ],
};

const BUILD_NIGHT_TALKS = [
  {
    slug: "claude-code-build-night",
    series: 2,
    eventTitle: "Build the MVP",
    key: "MVP",
    summary: "Bring an idea. Leave with a live app.",
    copy: "Claude Code takes one idea from the room to a one-page spec, then to a working app you can open on your phone before you leave.",
    startISO: "2026-12-15T17:00:00-07:00",
    endISO: "2026-12-15T19:00:00-07:00",
    dateLabel: "Tue Dec 15, 2026",
    timeLabel: "5:00 - 7:00 PM MST",
    venue: "Workuity Biltmore",
    address: "2390 E Camelback Rd Ste 130, Phoenix AZ 85016",
    parking: "Park in the surface lot.",
    rsvp: [
      { label: "RSVP on Luma", href: "https://luma.com/u0d4mqdn" },
      { label: "RSVP on Meetup", href: "https://www.meetup.com/shipai/events/317432282/" },
    ],
    toolsLede: "Everything we build the app with on the night, one job each.",
    tools: [
      { name: "Matt Pocock's skills", job: "Planning: /grill-me, /to-spec, /to-tickets, /wayfinder", cmd: "claude plugin install mattpocock-skills@claude-plugins-official", href: "https://github.com/mattpocock/skills" },
      { name: "Emil Kowalski's skills", job: "Polish: /emil-design-eng, /animate, /break-ui, /learn-taste", cmd: "npx skills@latest add emilkowalski/skills", href: "https://github.com/emilkowalski/skills" },
      { name: "AI SDK + AI Gateway", job: "The app's one AI feature, every request logged", cmd: "npm install ai", href: "https://vercel.com/docs/ai-gateway" },
      { name: "Better Auth", job: "Email and password sign-in, in your own database", cmd: "npm install better-auth", href: "https://www.better-auth.com" },
      { name: "Neon", job: "Serverless Postgres, plus its MCP server and agent skills", cmd: "npx neon@latest init", href: "https://neon.com" },
      { name: "Next.js", job: "The app: one page, one API route", cmd: "npx create-next-app@latest", href: "https://nextjs.org" },
      { name: "Vercel", job: "A live URL on every push", cmd: "npx vercel", href: "https://vercel.com" },
    ],
    example: {
      file: "SPEC.md",
      name: "What's for Dinner",
      pitch: "Type what's in your fridge. Get three dinners you can make tonight.",
      job: "Turn what's in my fridge into dinner tonight.",
      stack: ["Next.js", "Better Auth", "Neon", "AI SDK", "Vercel"],
      done: [
        "Sign up, sign in and sign out on a phone",
        "Three recipes in under 15 seconds",
        "Only my ingredients, plus salt, oil and pepper",
        "My history stays mine after a refresh",
        "Live on a Vercel URL",
      ],
      spec: EXAMPLE_SPEC,
    },
    steps: [
      { title: "Idea", body: "One idea, one screen, one job." },
      { title: "Spec", body: "Claude Code interviews us and writes one page." },
      { title: "Build", body: "Slice by slice, checked against the spec." },
      { title: "Ship", body: "Live on Vercel, open on your phone." },
    ],
    deck: BUILD_NIGHT_DECK,
  },
];

export const TALKS = [...[...BUILD_NIGHT_TALKS, ...SERIES_TALKS].sort((a, b) => a.series - b.series), ...LUNCH_TALKS, ...STANDALONE_TALKS];

export function talkBySlug(slug) {
  return TALKS.find((t) => t.slug === slug) ?? null;
}

export function talkPrompts(talk) {
  return (talk.deck?.slides || []).filter((s) => s.prompt).map((s) => ({ title: s.title, label: s.promptLabel || s.title, prompt: s.prompt }));
}

export function talkScheduled(talk) {
  return Boolean(talk.startISO);
}

export function talkEnded(talk, now = Date.now()) {
  return talkScheduled(talk) && now >= new Date(talk.endISO).getTime();
}

export const SERIES_NAME = "Claude Code Build Night";
export const LUNCH_NAME = "Lunch & Learn";

export function talkFullTitle(talk) {
  if (talk.series) return `${SERIES_NAME}: ${talk.eventTitle}`;
  if (talk.lunch) return `${LUNCH_NAME}: ${talk.eventTitle}`;
  return talk.eventTitle;
}

export function talkListingTitle(talk) {
  return `Phoenix | ${talkFullTitle(talk)}`;
}

export function talkKind(talk) {
  if (talk.series) return `${SERIES_NAME} · Part ${talk.series}`;
  if (talk.lunch) return LUNCH_NAME;
  return "Standalone talk";
}

export function talkWhen(talk) {
  return talkScheduled(talk) ? `${talk.dateLabel} · ${talk.timeLabel}` : "Date to be announced";
}
