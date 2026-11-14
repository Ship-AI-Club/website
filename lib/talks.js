
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

const EYEBROW = "Claude Code Build Night";

const BUILD_NIGHT_DECK = {
  title: "Claude Code Build Night",
  includeRoiSlide: false,
  includeShowcaseSlide: false,
  visual: true,
  slides: [
    {
      eyebrow: "Wed Dec 9 · Workuity Biltmore",
      title: "Claude Code Build Night",
      lead: "5:30 - 7:30 PM · Hosted by Santos Hernandez",
      layout: "checklist",
      diagram: "poster",
      poster: { kicker: "SHIP AI / TALKS", lines: ["Your idea.", "A one-page spec."], em: "A live app tonight.", body: "One idea from the room goes from spec to a working app you can open on your phone." },
      takeaway: "Follow along on your laptop or just watch.",
    },
    {
      eyebrow: EYEBROW,
      title: "Join the room",
      lead: "Every prompt from tonight lands in the Discord.",
      layout: "checklist",
      diagram: "qr",
      qr: "discord",
      qrKicker: "SHIP AI DISCORD",
      qrTitle: "Scan it now.",
      qrEm: "Copy prompts later.",
      qrBody: "The deck, the prompts and tonight's app, all in one channel.",
      qrCta: "Open the Discord invite",
      takeaway: "Workuity hosts the room. desic and AutomationInterns.com keep it free.",
    },
    {
      eyebrow: EYEBROW,
      title: "Start with the spec",
      lead: "The bottleneck used to be code. Now it's clarity.",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "BEFORE / PROMPT AND HOPE", title: "\"Build me an app.\"", body: "The agent guesses the user, the screens and the data." },
      after: { kicker: "AFTER / SPEC FIRST", title: "One user, one job.", em: "The spec is the prompt." },
      items: [
        { title: "Who", body: "One person, one moment." },
        { title: "One job", body: "A single verb." },
        { title: "Done when", body: "Checks we can run on a phone." },
      ],
      takeaway: "An agent builds exactly what you ask for. The hard part is knowing what to ask for.",
    },
    {
      eyebrow: EYEBROW,
      title: "Tonight in four steps",
      lead: "One idea from the room, picked by vote.",
      layout: "checklist",
      diagram: "result",
      items: [
        { title: "Idea", body: "One screen, no login, one job." },
        { title: "Spec", body: "Claude Code interviews us, then writes one page." },
        { title: "Build", body: "Slice by slice, checked against the spec." },
        { title: "Ship", body: "A live URL and a QR code on this screen." },
      ],
      takeaway: "Most demos jump from idea to build. The spec is what makes the build hold up.",
    },
    {
      eyebrow: EYEBROW,
      title: "Let Claude Code interview you",
      lead: "Answer questions instead of writing a prompt.",
      layout: "checklist",
      diagram: "result",
      items: [
        { title: "Who and when", body: "One person, the moment they open it." },
        { title: "Out of scope", body: "No accounts, no settings tonight." },
        { title: "SPEC.md", body: "One page, then it waits for your OK." },
      ],
      promptLabel: "Copy · the spec interview",
      prompt: SPEC_INTERVIEW_PROMPT,
      promptPreview: "Interview me about an app idea until we can write a one-page spec. Ask one question at a time. Push back when an answer is vague. Write SPEC.md, then wait for my OK before writing any code.",
      takeaway: "Works in Claude Code, Codex or any coding agent.",
    },
    {
      eyebrow: EYEBROW,
      title: "Planning skills from Matt Pocock",
      lead: "The same interview as commands you type, from Matt Pocock's engineering skills.",
      layout: "checklist",
      diagram: "skills",
      hub: "Plan first",
      hubCaption: "MATT POCOCK / SKILLS",
      hubNote: "You type these.\nThey don't run from a prompt.",
      items: [
        { title: "/grill-me", body: "Interviews you until the plan holds up." },
        { title: "/to-spec", body: "Turns the plan into a spec in your repo." },
        { title: "/wayfinder", body: "Maps work too big for one session." },
      ],
      promptLabel: "Copy · the commands, in order",
      prompt: "Type these one at a time. They are commands, not a prompt to paste.\n\n1. In your terminal:\n   claude plugin install mattpocock-skills@claude-plugins-official\n2. In Claude Code:\n   /reload-plugins\n3. /setup-matt-pocock-skills\n   Choose local markdown files as the issue tracker.\n4. /grill-me\n   Then describe your app idea and answer its questions.\n5. /to-spec\n   Run it once the plan holds up.\n6. Then paste this prompt:\n   Copy the spec you just wrote to SPEC.md at the repo root. Trim it to one page with these sections: Problem, User, The one job, Out of scope, Screen, Data, Done when.",
      promptPreview: "Install the plugin, /reload-plugins, /setup-matt-pocock-skills, then /grill-me on your idea and /to-spec. Finish by copying the spec to SPEC.md.",
      promptDestination: "your terminal and Claude Code, one step at a time",
      takeaway: "github.com/mattpocock/skills",
    },
    {
      eyebrow: EYEBROW,
      title: "Set up the stack",
      lead: "A small, proven stack, so the hour goes into the product.",
      layout: "checklist",
      diagram: "setup",
      terminal: { label: "localhost:3000", kicker: "CLAUDE CODE SETS IT UP", lines: ["Next.js + Neon.", "Ready to build."], body: "One page, one table, one API route." },
      items: [
        { title: "Next.js", body: "The app: one page, one API route." },
        { title: "Neon", body: "Serverless Postgres, plus its MCP server and agent skills." },
        { title: "Vercel", body: "A live URL on every push." },
      ],
      promptLabel: "Copy · set up the stack",
      prompt: "Read SPEC.md. Set up the project for it one step at a time, and stop after each step.\n\n1. Create a Next.js app with TypeScript, Tailwind CSS and the App Router:\nnpx create-next-app@latest build-night --ts --tailwind --app --eslint --use-npm --yes\n2. Move SPEC.md into build-night.\n3. Stop and tell me to do three things myself, then wait until I'm back:\n   - cd build-night\n   - run npx neon@latest init, which signs me in and sets up Neon's MCP server and agent skills for this folder\n   - start Claude Code again inside build-night\n\nDo not build any features yet.",
      promptPreview: "Read SPEC.md, create the Next.js app, move SPEC.md into it, then stop so I can run neon init there and restart Claude Code.",
      takeaway: "Swap any piece you like. The method works as long as the spec comes first.",
    },
    {
      eyebrow: EYEBROW,
      title: "Build it slice by slice",
      lead: "The spec becomes the prompt.",
      layout: "checklist",
      diagram: "result",
      items: [
        { title: "Plan", body: "Restate the spec, list the slices." },
        { title: "One slice", body: "The smallest thing that runs." },
        { title: "Check it", body: "Open it before the next slice." },
      ],
      promptLabel: "Copy · build from the spec",
      prompt: "Read SPEC.md.\n\nFirst, the database. If .env.local has no DATABASE_URL yet, use the Neon tools to create a database for this project and save its connection string to .env.local as DATABASE_URL. Never print the secret. Create only the table SPEC.md needs, using @neondatabase/serverless.\n\nThen restate the spec in five lines and list the smallest slices that get us to every check under Done when, in order. Wait for my OK.\n\nBuild one slice at a time. After each slice, run it, tell me what to open in the browser, and wait for me before starting the next one. If something in SPEC.md is unclear, ask me instead of guessing. Do not add anything listed under Out of scope.",
      promptPreview: "Read SPEC.md. Create the Neon database and the one table it needs, then restate the spec, list the slices and wait for my OK. Build one slice at a time.",
      takeaway: "Nothing gets stacked on top of something we haven't seen work.",
    },
    {
      eyebrow: EYEBROW,
      title: "Steering is the skill",
      lead: "You don't need to write the code. You need to notice when it's wrong.",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "WHAT IT BUILT", title: "Close, but wrong.", body: "It added a login. The spec says no accounts." },
      after: { kicker: "WHAT YOU SAY", title: "Point at the line.", em: "Let it fix itself." },
      items: [
        { title: "What you saw", body: "On screen, in plain words." },
        { title: "The spec line", body: "Quote it." },
        { title: "One fix", body: "Nothing else changes." },
      ],
      promptLabel: "Copy · steer it back",
      prompt: "That isn't what SPEC.md says. Here is what I saw: [describe what happened on screen]. The spec says: [quote the line]. Explain in one sentence why they differ, fix it, and tell me what to check. Don't change anything else.",
      takeaway: "At least once tonight it will build the wrong thing. That correction is the lesson.",
    },
    {
      eyebrow: EYEBROW,
      title: "Polish skills from Emil Kowalski",
      lead: "Break it before we ship it.",
      layout: "checklist",
      diagram: "skills",
      hub: "Then polish",
      hubCaption: "EMIL KOWALSKI / SKILLS",
      hubNote: "Design engineering.\nOne check at a time.",
      items: [
        { title: "/break-ui", body: "Long names, empty lists, huge counts." },
        { title: "/emil-design-eng", body: "Animation and design advice." },
        { title: "/learn-taste", body: "Saves your design fixes as rules in DESIGN.md." },
      ],
      promptLabel: "Copy · break it, then polish",
      prompt: "Install Emil Kowalski's skills for this project. In my terminal I will run:\nnpx skills@latest add emilkowalski/skills\n\nWait until I tell you it's installed. If you can't see the skills yet, tell me to restart Claude Code.\n\nThen run /break-ui on the main screen. Try worst-case data: long names, an empty list, a huge count. Fix what breaks, one issue at a time, and show me each fix at phone width.",
      promptPreview: "Install emilkowalski/skills, run /break-ui on the main screen with worst-case data, and fix what breaks one issue at a time.",
      takeaway: "github.com/emilkowalski/skills",
    },
    {
      eyebrow: EYEBROW,
      title: "Ship it",
      lead: "Open it on your phone.",
      layout: "checklist",
      diagram: "result",
      items: [
        { title: "Check", body: "Every item under Done when." },
        { title: "Deploy", body: "Push to GitHub, Vercel deploys." },
        { title: "Share", body: "A QR code on this screen." },
      ],
      promptLabel: "Copy · ship it",
      prompt: "Run every check under Done when in SPEC.md and tell me which pass. Fix any that fail.\n\nThen get this live. Create a GitHub repo and push to it, connect it to Vercel, and add DATABASE_URL to the Vercel project's environment variables. Ask me before any step that needs my login. When the deploy finishes, give me the live URL.",
      promptPreview: "Run every check under Done when, fix what fails, then push to GitHub, deploy on Vercel with DATABASE_URL set, and give me the live URL.",
      takeaway: "Just ship it.",
    },
    {
      eyebrow: "Bonus round",
      title: "Bonus round",
      lead: "Time on the clock? One more feature.",
      layout: "checklist",
      tone: "bonus",
      diagram: "poster",
      poster: { kicker: "SHIP AI / BONUS ROUND", lines: ["Same spec.", "One more line."], em: "Now it thinks.", body: "Add one AI feature with the AI SDK and Vercel AI Gateway." },
      takeaway: "Only once the main build is live. Shipping comes first.",
    },
    {
      eyebrow: "Bonus round",
      title: "Add an AI feature",
      lead: "The AI SDK in the app. AI Gateway in front of the models.",
      layout: "checklist",
      tone: "bonus",
      diagram: "result",
      items: [
        { title: "Spec it", body: "A Bonus section in SPEC.md, one feature." },
        { title: "AI SDK", body: "generateText with a provider/model string." },
        { title: "AI Gateway", body: "One key locally, OIDC on Vercel, logs and spend in one place." },
      ],
      promptLabel: "Copy · the bonus feature",
      prompt: "Bonus round: add one AI feature. Stop after each step.\n\n1. Add a section called Bonus to SPEC.md: a \"Polish my line\" button next to the description field. It rewrites the description into one clear sentence under 120 characters, keeps the person's facts and never invents claims. The person sees the suggestion and chooses whether to use it.\n2. Install the AI SDK: npm install ai\n3. Use Vercel AI Gateway through the AI SDK, passing the model as a \"provider/model\" string. Check the AI Gateway model list for the current Claude Sonnet model ID instead of guessing.\n4. Ask me to create an AI Gateway API key in the Vercel dashboard and add it to .env.local as AI_GATEWAY_API_KEY myself. Wait until I tell you it's done. Never print the key.\n5. Add one server route that calls generateText with a short instruction, a 10-second timeout and a small output limit. If the call fails, keep the person's text and show \"Couldn't polish it right now.\"\n6. Show me the button at phone width, then redeploy. On Vercel the deployment can authenticate to AI Gateway with OIDC, so don't commit the key.",
      promptPreview: "Add a Bonus section to SPEC.md for a \"Polish my line\" button, install the AI SDK, call Claude Sonnet through AI Gateway from one server route, handle failures, then redeploy.",
      takeaway: "Open AI Gateway's logs to see every request, its tokens and its cost.",
    },
    {
      eyebrow: EYEBROW,
      title: "Take it home",
      lead: "Every prompt from tonight, free, on one page.",
      layout: "checklist",
      diagram: "qr",
      qr: "talk-claude-code-build-night",
      qrKicker: "THE TALK PAGE",
      qrTitle: "Prompts, tools,",
      qrEm: "and this deck.",
      qrBody: "Paste them into Claude Code, Codex or any coding agent.",
      qrCta: "Open the talk page",
      takeaway: "Show us what you build. The next demo slot is yours.",
    },
  ],
};

export const TALKS = [
  {
    slug: "claude-code-build-night",
    eventTitle: "Claude Code Build Night",
    key: "Build Night",
    summary: "Bring an idea. Leave with a live app.",
    copy: "Claude Code takes one idea from the room to a one-page spec, then to a working app you can open on your phone before you leave.",
    startISO: "2026-12-09T17:30:00-07:00",
    endISO: "2026-12-09T19:30:00-07:00",
    dateLabel: "Wed Dec 9, 2026",
    timeLabel: "5:30 - 7:30 PM MST",
    venue: "Workuity Biltmore",
    address: "2390 E Camelback Rd Ste 130, Phoenix AZ 85016",
    parking: "Park in the surface lot.",
    rsvp: [
      { label: "RSVP on Luma", href: "https://luma.com/u0d4mqdn" },
      { label: "RSVP on Meetup", href: "https://www.meetup.com/shipai/events/317432282/" },
    ],
    tools: [
      { name: "Matt Pocock's skills", job: "Planning: /grill-me, /to-spec, /to-tickets, /wayfinder", cmd: "claude plugin install mattpocock-skills@claude-plugins-official", href: "https://github.com/mattpocock/skills" },
      { name: "Emil Kowalski's skills", job: "Polish: /emil-design-eng, /animate, /break-ui, /learn-taste", cmd: "npx skills@latest add emilkowalski/skills", href: "https://github.com/emilkowalski/skills" },
      { name: "AI SDK + AI Gateway", job: "Bonus round: one AI feature, every request logged", cmd: "npm install ai", href: "https://vercel.com/docs/ai-gateway" },
      { name: "Neon", job: "Serverless Postgres, plus its MCP server and agent skills", cmd: "npx neon@latest init", href: "https://neon.com" },
      { name: "Next.js", job: "The app: one page, one API route", cmd: "npx create-next-app@latest", href: "https://nextjs.org" },
      { name: "Vercel", job: "A live URL on every push", cmd: "npx vercel", href: "https://vercel.com" },
    ],
    deck: BUILD_NIGHT_DECK,
  },
];

export function talkBySlug(slug) {
  return TALKS.find((t) => t.slug === slug) ?? null;
}

export function talkPrompts(talk) {
  return (talk.deck?.slides || []).filter((s) => s.prompt).map((s) => ({ title: s.title, label: s.promptLabel || s.title, prompt: s.prompt }));
}

export function talkEnded(talk, now = Date.now()) {
  return now >= new Date(talk.endISO).getTime();
}
