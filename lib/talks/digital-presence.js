import { ABOUT_SLIDE, JOIN_ROOM_SLIDE, PARTNER_SLIDE, FOUNDER_WEEKEND_SLIDE, COMMUNITY_CLOSE_SLIDE, takeHomeSlide, WORKUITY } from "./shared.js";

const SITE_BRIEF = `# What's for Dinner: site brief

## Positioning
- For: someone at home at 6pm, on their phone, with a few ingredients and twenty minutes
- Today they: stare into the fridge, see ingredients instead of meals, and order takeout
- Promise: Type what's in your fridge. Get three dinners you can make tonight.
- Proof: three recipes in under 15 seconds, using only your ingredients plus salt, oil and pepper
- Not: a meal planner, a recipe database or a grocery app
- The word we own: tonight

## Page outline (/)
Signed-out visitors see this page. Signed-in visitors go straight to the app.
1. Hero: headline, subhead, one button to the app's sign-up screen, a phone screenshot of real results
2. How it works: three steps
3. A real result: the shakshuka card, with its five steps
4. Favorites: save the dinners you'd make again
5. Free guide: "10 fridge-clean-out dinners", email form
6. Questions: three short answers
7. Footer: links to the social profiles

## Copy
Headline: Dinner from what's already in your fridge.
Subhead: Type four ingredients. Get three dinners you can make tonight, in under 15 seconds.
Button: Find tonight's dinner

How it works:
1. Type what you have. Eggs, spinach, feta, half an onion.
2. Get three dinners. Each one uses only what you typed, plus salt, oil and pepper.
3. Cook it tonight. Five short steps. Save the ones you'd make again.

Free guide:
Heading: 10 fridge-clean-out dinners
Body: Ten dinners built from the odds and ends most fridges already have. No account needed.
Button: Get the guide
Note: We'll only email you about What's for Dinner. Unsubscribe any time.

Questions:
- Do I need to buy anything? No. Every recipe uses what you typed, plus salt, oil and pepper.
- Does it work on my phone? It was built for your phone first.
- Who can see my ingredients? Your account is private to you. We use your ingredients to make your dinners and never sell them.

## Search
- Title: What's for Dinner: dinner from what's in your fridge
- Description: Type what's in your fridge and get three dinners you can make tonight, using only your ingredients plus salt, oil and pepper.
- Sitemap: / and /guides/fridge-clean-out. App screens behind sign-in stay out.
- Structured data: WebApplication on /, with sameAs links to the social profiles
- Social image: 1200 by 630, the headline next to the shakshuka card

## Measure
- Visitors: Vercel Web Analytics, by utm_source
- Signups: new rows in the users table, with the utm_source they arrived with
- First dinners: users whose first Find dinners call succeeded
- Every Friday: the three numbers next to last week's

## Before launch
- [ ] AI Gateway monthly spend limit set: $[amount]
- [ ] The AI route is rate limited per user and per IP
- [ ] The free monthly limit is checked on the server before every model call

## Profile kit
Accounts: X, Instagram, TikTok, LinkedIn page. You create them; Claude Code drafts everything below.
- Handle: one handle on all four. Check it's free everywhere before you settle.
- Avatar: the app icon, the same file everywhere
- Link: the homepage, with ?utm_source=x, instagram, tiktok or linkedin
- Short bio (under 80 characters): Type what's in your fridge. Get three dinners tonight.
- Long bio (under 160 characters): Type what's in your fridge. Get three dinners you can make tonight, using only what you have plus salt, oil and pepper. Free guide below.
- LinkedIn tagline: Dinner from what's already in your fridge.

First post:
"Last night: eggs, spinach, feta, half an onion. Three dinners in 12 seconds. We made the shakshuka. What's in your fridge tonight?" Screen recording of the app, start to finish.

Image prompt for the avatar:
"A flat app icon of a small cast-iron pan seen from above, one egg in it, on a warm cream background, bold simple shapes, no text, readable at small sizes."
`;

const DEMO_LABEL = "claude · ~/whats-for-dinner";

const DECK = {
  title: "The Front Door",
  includeRoiSlide: false,
  includeShowcaseSlide: false,
  visual: true,
  slides: [
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "voyage", dark: true, logo: true, kicker: "CLAUDE CODE BUILD NIGHT · PART 3 · TUE DEC 15", lines: ["The Front"], em: "Door", body: "Give your app a front door and a name people can find." },
    },
    ABOUT_SLIDE,
    JOIN_ROOM_SLIDE,
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "swell", dark: true, kicker: "THE IDEA", lines: ["A live app nobody can find"], em: "is still a secret.", body: "Tonight the app gets a public face." },
    },
    PARTNER_SLIDE,
    {
      title: "From a URL to a front door",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "WHAT YOU HAVE", title: "whats-for-dinner.vercel.app" },
      after: { kicker: "WHAT YOU NEED", title: "One promise, one button.", em: "Findable by people and AI." },
      items: [],
    },
    {
      title: "Tonight",
      layout: "checklist",
      diagram: "result",
      items: [{ title: "Position" }, { title: "Page" }, { title: "Measure" }, { title: "Profiles" }],
    },
    {
      title: "The site brief",
      layout: "checklist",
      diagram: "doc",
      doc: {
        file: "SITE-BRIEF.md",
        sections: [
          { h: "Positioning", lit: true, lines: ["Type what's in your fridge. Get three dinners tonight."] },
          { h: "Page", lines: ["Hero, how it works, a real result, free guide."] },
          { h: "Measure", lines: ["Visitors, signups, first dinners."] },
          { h: "Before launch", lines: ["[ ] Spend limit", "[ ] Rate limit on the AI route"] },
          { h: "Profile kit", lines: ["[ ] One handle on all four", "[ ] Same avatar, same link", "[ ] First post drafted"] },
        ],
      },
    },
    {
      title: "The skills from our website workshop",
      layout: "checklist",
      diagram: "skills",
      hub: "Claude Code",
      hubCaption: "frontend-design\n+ marketingskills",
      hubNote: "Used at Ship AI's\nOct 10 website workshop",
      items: [
        { title: "frontend-design", body: "Anthropic's skill for a page that doesn't look like a template." },
        { title: "copywriting, lead-magnets, social", body: "Corey Haines' skills for the words." },
        { title: "seo-audit, schema, ai-seo", body: "Corey Haines' skills for search and AI answers." },
      ],
      promptLabel: "Copy · install the skills",
      prompt: "Run these in your own terminal, inside your app's folder. They are commands, not a prompt to paste.\n\n1. npx skills add anthropics/skills --skill frontend-design -a claude-code\n2. npx skills add coreyhaines31/marketingskills --skill copywriting lead-magnets social seo-audit schema ai-seo -a claude-code\n3. Restart Claude Code in the same folder.\n4. Then paste this prompt:\n   List the skills you can see from frontend-design and marketingskills, with one line on when you'd use each for What's for Dinner. Don't change any files.",
      promptPreview: "Install frontend-design and six of Corey Haines' marketing skills with npx skills, restart Claude Code, then check it can see them.",
      promptDestination: "your terminal, then Claude Code",
      takeaway: "github.com/anthropics/skills · github.com/coreyhaines31/marketingskills",
    },
    {
      title: "Positioning before pixels",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "claude", text: "What do they do today instead?" }, { who: "you", text: "Order takeout at 6:30." }, { who: "claude", text: "Then the word to own is tonight." }, { who: "out", text: "✓ Wrote SITE-BRIEF.md: Positioning, Copy" }] },
      promptLabel: "Copy · positioning and copy",
      prompt: "Read SPEC.md. Use the copywriting skill.\n\nInterview me one question at a time and wait for each answer. Cover who it's for and the moment they'd open it, what they do today instead, the proof we have, and what it is not.\n\nThen write SITE-BRIEF.md with two sections:\n- Positioning: for, today they, promise, proof, not, and one word we own\n- Copy: headline, subhead, one button, three how-it-works steps, three short questions and answers\n\nEvery claim must be something the app does today according to SPEC.md. No superlatives. Stop and wait for my OK before building anything.",
      promptPreview: "Use the copywriting skill to interview me, then write the Positioning and Copy sections of SITE-BRIEF.md. Only claims the app backs up.",
    },
    {
      title: "Build the front door",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "out", text: "✓ / shows the marketing page when signed out" }, { who: "out", text: "✓ Find tonight's dinner → sign-up screen" }, { who: "claude", text: "Open localhost:3000 at phone width." }] },
      promptLabel: "Copy · build the page",
      prompt: "Read SITE-BRIEF.md and SPEC.md. Use the frontend-design skill.\n\nAdd a page outline to SITE-BRIEF.md first: hero, how it works, a real result, Favorites, the free guide, questions, footer. Wait for my OK.\n\nThen build it at /, one section at a time:\n1. Signed-out visitors see the marketing page. Signed-in visitors go straight to the app, which keeps working as it does now.\n2. The main button goes to the app's existing Better Auth sign-up screen.\n3. Use the copy in SITE-BRIEF.md word for word. If a line doesn't fit, ask me instead of rewriting it.\n4. Phone first. Use a real screenshot of the app in the hero, not a drawing.\n\nAfter each section, tell me what to check at phone width and on desktop, and wait.",
      promptPreview: "Use frontend-design to build the marketing page at / for signed-out visitors, copy word for word from SITE-BRIEF.md, one section at a time.",
    },
    {
      title: "A guide worth an email",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "out", text: "✓ leads table in Neon" }, { who: "out", text: "✓ /guides/fridge-clean-out: 10 dinners" }, { who: "you", text: "Submitted the same email twice." }, { who: "claude", text: "One row. The guide opened both times." }] },
      promptLabel: "Copy · the free guide",
      prompt: "Read SITE-BRIEF.md. Use the lead-magnets skill.\n\n1. Write the guide \"10 fridge-clean-out dinners\": ten dinners from things most fridges have, each with its ingredients and five short steps, in the same voice as the app. Show me the list of ten and wait for my OK.\n2. Create a leads table in our Neon database: id, email (unique), source, created_at.\n3. Add the guide section to the marketing page: one email field and the button from SITE-BRIEF.md. On submit, validate the email, save it, and open /guides/fridge-clean-out right away. Don't send any emails yet.\n4. Submitting the same email twice keeps one row and still opens the guide.\n\nShow me it working at phone width, then add the guide page to SITE-BRIEF.md.",
      promptPreview: "Use lead-magnets to write 10 fridge-clean-out dinners, save emails to a Neon leads table, and open the guide right after signup.",
    },
    {
      title: "Search basics",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "out", text: "✓ title and description from SITE-BRIEF.md" }, { who: "out", text: "✓ app/sitemap.ts · app/robots.ts" }, { who: "out", text: "✓ WebApplication JSON-LD" }, { who: "claude", text: "seo-audit found 2 issues. Fixing the first." }] },
      promptLabel: "Copy · search basics",
      prompt: "Read the Search section of SITE-BRIEF.md. Use the schema and seo-audit skills. Stop after each step.\n\n1. Set the title, description and metadataBase with the Next.js Metadata API.\n2. Add app/sitemap.ts with only the public pages, and app/robots.ts that points to the sitemap and keeps the API routes out.\n3. Add WebApplication JSON-LD to / as a script tag, following nextjs.org/docs/app/guides/json-ld, including replacing < with \\u003c.\n4. Run the seo-audit skill on the marketing page and the guide. List what it finds, then fix one issue at a time.\n\nWhen it's deployed, tell me to paste the URL into validator.schema.org and Google Search Console myself, and wait until I tell you what they say.",
      promptPreview: "Add metadata, sitemap.ts, robots.ts and WebApplication JSON-LD, then run seo-audit and fix what it finds one issue at a time.",
      takeaway: "nextjs.org/docs/app/api-reference/file-conventions/metadata",
    },
    {
      title: "A card worth sharing",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "out", text: "✓ app/opengraph-image.tsx" }, { who: "out", text: "✓ app/twitter-image.tsx" }, { who: "claude", text: "Open /opengraph-image to see it." }] },
      promptLabel: "Copy · social images",
      prompt: "Read the Search section of SITE-BRIEF.md.\n\n1. Add app/opengraph-image.tsx using ImageResponse from next/og, 1200 by 630: the headline on the left and the shakshuka card on the right, in the app's own colors. Add alt text.\n2. Add app/twitter-image.tsx with the same image.\n3. Add the same image style to /guides/fridge-clean-out with the guide's title.\n4. Tell me to open /opengraph-image in the browser, and wait for my OK.\n\nAfter the next deploy, tell me to paste the live URL into a new post draft on X and LinkedIn to see the preview, without posting.",
      promptPreview: "Generate Open Graph and X images with next/og, one for the home page and one for the guide, and show me before deploying.",
    },
    {
      title: "Count every signup",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "out", text: "✓ Web Analytics on, utm_source kept through sign-up" }, { who: "out", text: "✓ users.utm_source saved" }, { who: "claude", text: "Today: 41 visitors, 6 signups, 4 first dinners." }] },
      promptLabel: "Copy · count signups",
      prompt: "Read SITE-BRIEF.md and SPEC.md. We want three numbers: visitors, signups and people who found their first dinner. Count them from our own tables where we can. Stop after each step.\n\n1. Add Vercel Web Analytics with the @vercel/analytics package and its <Analytics /> component in the root layout. Tell me to turn on Web Analytics for this project in the Vercel dashboard myself, and wait until I tell you it's done.\n2. Keep the utm_source from the landing URL through sign-up and save it on the user row with a migration, so we know which profile each signup came from.\n3. Write scripts/numbers.ts that prints, for today and the last 7 days: signups by utm_source, and first dinners (users whose first dinners row exists). No emails or ingredients in the output.\n4. Add a Measure section to SITE-BRIEF.md: the three numbers, where to see each, and what we compare every Friday.\n\nRun a test signup with ?utm_source=test and show me it counted.",
      promptPreview: "Turn on Web Analytics, keep utm_source through sign-up, and print signups and first dinners from our own tables.",
      takeaway: "vercel.com/docs/analytics",
    },
    {
      title: "Before strangers show up",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "out", text: "✓ AI Gateway spend limit set" }, { who: "out", text: "✓ Find dinners: 10 a minute per user" }, { who: "claude", text: "The 11th quick request got a 429." }] },
      promptLabel: "Copy · the launch check",
      prompt: "Before we share the link, two checks so a stranger can't run up our bill. Stop after each step.\n\n1. Tell me to set a monthly spend limit for this project in the Vercel AI Gateway dashboard myself, then add the amount to SITE-BRIEF.md under Before launch. Wait until I tell you it's done.\n2. Rate limit the route that calls the model: about 10 requests a minute per signed-in user and 20 per IP, returning a 429 the app shows as \"Slow down a moment\". Use Better Auth's rate limiter if it covers custom routes; otherwise propose the smallest option and wait for my OK.\n3. Confirm the free monthly limit from SPEC.md is checked on the server before every model call, and show me where.\n4. Send 11 quick requests and show me the 11th getting the 429.",
      promptPreview: "Set an AI spend limit, rate limit the AI route, confirm the free limit runs on the server, then prove it with 11 quick requests.",
      takeaway: "The full hardening: the Lock It Down Lunch & Learn.",
    },
    {
      title: "Profiles you set up, words Claude drafts",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "claude", text: "Five handles to check on all four." }, { who: "out", text: "✓ Bios, avatar prompt, first post" }, { who: "you", text: "Profiles are live." }, { who: "out", text: "✓ Footer links and sameAs added" }] },
      promptLabel: "Copy · the profile kit",
      prompt: "Read SITE-BRIEF.md. Use the social skill.\n\nAdd a Profile kit section to SITE-BRIEF.md for X, Instagram, TikTok and a LinkedIn page:\n1. Five handle ideas, so I can check one is free on all four\n2. A short bio under 80 characters and a long bio under 160, the same promise as the site\n3. A LinkedIn tagline and a three-sentence About\n4. An image prompt for the avatar: the app icon, readable at small sizes, no text\n5. The homepage link for each platform, with ?utm_source= set to the platform\n6. A first post for each platform: X, LinkedIn, an Instagram caption and a 20-second TikTok script. Show the app working, no superlatives.\n\nI'll create the accounts, upload the avatar and paste the bios myself. Don't sign up for anything or post anything. Wait until I tell you the profiles are live, then add their links to the footer and to sameAs in the JSON-LD.",
      promptPreview: "Use the social skill to draft handles, bios, an avatar prompt and a first post per platform. I set up the profiles, then you link them.",
      takeaway: "Next: First Users, Tue Jan 5.",
    },
    takeHomeSlide("digital-presence"),
    FOUNDER_WEEKEND_SLIDE,
    COMMUNITY_CLOSE_SLIDE,
  ],
};

export const TALK = {
  slug: "digital-presence",
  series: 3,
  eventTitle: "The Front Door",
  key: "Front Door",
  summary: "A page people can find, signups you can count, and a bill strangers can't run up.",
  copy: "Tonight Claude Code gives What's for Dinner a public face: one promise, a page with a free guide, search basics, signups counted by where they came from, a spend limit on the AI, and a profile kit for four platforms.",
  ...WORKUITY,
  startISO: "2026-12-15T17:00:00-07:00",
  endISO: "2026-12-15T19:00:00-07:00",
  dateLabel: "Tue Dec 15, 2026",
  timeLabel: "5:00 - 7:00 PM MST",
  rsvp: [],
  steps: [
    { title: "Position", body: "One promise, backed by what the app does today." },
    { title: "Page", body: "A front door, a free guide and an email list in Neon." },
    { title: "Measure", body: "Visitors, signups and first dinners, by where they came from." },
    { title: "Profiles", body: "Bios, avatar and a first post, drafted for you, after a spend limit and a rate limit." },
  ],
  stepsLede: "We give What's for Dinner its public face on screen, one prompt at a time. Follow along on your own app or just watch.",
  closing: ["Bring your app.", "Leave with a front door."],
  example: {
    name: "What's for Dinner",
    heading: ["Tonight's", "example."],
    lede: "The app works and lives on a Vercel URL. Tonight it gets a page, a free guide and a name on four platforms.",
    file: "SITE-BRIEF.md",
    pitch: "Dinner from what's already in your fridge.",
    jobLabel: "The promise",
    job: "Type what's in your fridge. Get three dinners you can make tonight.",
    stack: ["frontend-design", "marketingskills", "Next.js metadata", "Neon", "Web Analytics", "AI Gateway", "X", "Instagram", "TikTok", "LinkedIn"],
    doneLabel: "Done when",
    done: [
      "Signed-out visitors see the page, signed-in visitors see the app",
      "The free guide saves one row per email in Neon",
      "Title, description, sitemap and structured data pass a check",
      "Signups and first dinners counted by utm_source",
      "The AI route has a spend limit and a rate limit",
      "Sharing the link shows the social image",
      "Four profiles with the same handle, avatar, bio and link",
    ],
    spec: SITE_BRIEF,
    specLabel: "Copy the site brief",
    specDestination: "SITE-BRIEF.md at your repo root",
  },
  toolsLede: "The skills and services behind the page, the guide and the listings, one job each.",
  tools: [
    { name: "frontend-design", job: "Anthropic's skill for a page that doesn't look like a template", cmd: "npx skills add anthropics/skills --skill frontend-design -a claude-code", href: "https://github.com/anthropics/skills" },
    { name: "Corey Haines' marketing skills", job: "copywriting, lead-magnets, social, seo-audit, schema, ai-seo", cmd: "npx skills add coreyhaines31/marketingskills --skill copywriting lead-magnets social seo-audit schema ai-seo -a claude-code", href: "https://github.com/coreyhaines31/marketingskills" },
    { name: "Neon", job: "The leads table for the free guide", cmd: "npx neon@latest init", href: "https://neon.com" },
    { name: "Schema Markup Validator", job: "Check the structured data", cmd: "validator.schema.org", href: "https://validator.schema.org" },
    { name: "Google Search Console", job: "Submit the sitemap and see what Google indexed", cmd: "search.google.com/search-console", href: "https://search.google.com/search-console" },
    { name: "Vercel Web Analytics", job: "Visitors by page and by utm_source", cmd: "npm install @vercel/analytics", href: "https://vercel.com/docs/analytics" },
    { name: "AI Gateway", job: "A monthly spend limit on the AI", cmd: "vercel.com/ai-gateway", href: "https://vercel.com/docs/ai-gateway" },
    { name: "LinkedIn page", job: "The company page, set up by you", cmd: "linkedin.com/company/setup/new", href: "https://www.linkedin.com/company/setup/new" },
  ],
  deck: DECK,
};
