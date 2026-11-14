import { ABOUT_SLIDE, JOIN_ROOM_SLIDE, PARTNER_SLIDE, FOUNDER_WEEKEND_SLIDE, COMMUNITY_CLOSE_SLIDE, takeHomeSlide, WORKUITY } from "./shared.js";

const FEATURE_SPEC = `## Feature: Favorites

### Feedback
"I made the shakshuka three times. Every time I had to scroll through my history to find it."
Three testers asked for some version of this, more than any other request. One asked for meal plans; that waits until Part 8.

### The one job
Keep the dinners I'd make again one tap away.

### Out of scope
- No folders, tags, ratings or notes
- No sharing favorites with anyone
- No editing a saved recipe
- Everything already under Out of scope in SPEC.md stays out

### Screen
1. A heart on every dinner card, in new results and in "Your dinners". Tap to save, tap again to remove.
2. A "Favorites" list above "Your dinners": saved dinners, newest saved first.
3. Empty state: "Tap the heart on a dinner you'd make again."

### Data
One new table, favorites: id, user_id, dinner_id, recipe_index (0, 1 or 2), created_at.
Unique on (user_id, dinner_id, recipe_index), so saving twice keeps one copy.

### Acceptance criteria
- [ ] Tapping the heart saves the dinner, and it shows at the top of Favorites without a reload
- [ ] Tapping the heart again removes it from Favorites
- [ ] Saving the same dinner twice keeps one copy
- [ ] Favorites are still there after a refresh, and after signing out and back in
- [ ] Another account can't see or change my favorites
- [ ] At phone width the heart is easy to tap and nothing overflows

### Test plan
Vitest (logic in lib/favorites.ts, no network or database):
- toggling adds a favorite when it's absent and removes it when it's present
- toggling the same dinner twice in a row leaves one or zero copies, never two
- the list sorts newest saved first
- a recipe_index outside 0-2 is rejected

Playwright (end to end, iPhone 13 device, against localhost):
- sign up, find dinners, heart one, see it in Favorites, reload, still there
- un-heart it and it's gone
- a second account sees the empty state

By hand:
- the Vercel preview on a real phone before merging

### Ship checklist
- [ ] Every new test failed before the code existed
- [ ] Every test passes
- [ ] A fresh subagent reviewed the diff against this section, and its findings are fixed or answered
- [ ] Pull request open, Vercel preview checked on a phone
- [ ] Tests run on the pull request in GitHub Actions; checks green, then merge
`;

const DEMO_LABEL = "claude · ~/whats-for-dinner";

const DECK = {
  title: "Ship a Feature",
  includeRoiSlide: false,
  includeShowcaseSlide: false,
  visual: true,
  slides: [
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "workbench", dark: true, logo: true, kicker: "SHIP AI TALKS · PART 4", lines: ["Ship a"], em: "Feature", body: "One feature, tested, reviewed and merged in a night." },
    },
    ABOUT_SLIDE,
    JOIN_ROOM_SLIDE,
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "slipway", dark: true, kicker: "THE IDEA", lines: ["Shipping once is easy."], em: "Shipping again is the job.", body: "Tonight we change it without breaking it." },
    },
    PARTNER_SLIDE,
    {
      title: "Write down done first",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "PROMPT AND HOPE", title: "\"Add favorites.\"" },
      after: { kicker: "TESTS FIRST", title: "Done, written as checks.", em: "Then prove it." },
      items: [],
    },
    {
      title: "Tonight",
      layout: "checklist",
      diagram: "result",
      items: [{ title: "Feedback" }, { title: "Spec" }, { title: "Tests" }, { title: "Ship" }],
    },
    {
      title: "Tonight's feature",
      layout: "checklist",
      diagram: "phone",
      phone: {
        app: "What's for Dinner",
        avatar: "M",
        question: "What's in your fridge?",
        chips: ["eggs", "spinach", "feta", "onion"],
        button: "Find dinners",
        sub: "Favorites · 3 saved",
        cards: [
          { name: "Shakshuka", meta: "25 min · one pan", badge: "Saved", icon: "pan", active: true },
          { name: "Spinach and feta omelette", meta: "15 min · easy", badge: "Saved", icon: "egg" },
          { name: "Greek frittata", meta: "20 min · oven", badge: "Saved", icon: "bowl" },
        ],
        detail: {
          meta: "SHAKSHUKA · SAVED TUE",
          title: "One tap, every time",
          steps: ["Soften the onion in oil", "Wilt in the spinach", "Make four wells", "Crack in the eggs, cover", "Crumble feta, serve"],
        },
        pitch: "Save the dinners you'd make again. Find them in one tap.",
        tags: ["One feature", "Vitest", "Playwright"],
      },
    },
    {
      title: "The feature spec",
      layout: "checklist",
      diagram: "doc",
      doc: {
        file: "SPEC.md · Feature: Favorites",
        sections: [
          { h: "Feedback", lines: ["\"I had to scroll my history to find it.\""] },
          { h: "The one job", lit: true, lines: ["Keep the dinners I'd make again one tap away."] },
          { h: "Acceptance criteria", lines: ["[ ] Saved dinner shows at the top of Favorites", "[ ] Saving twice keeps one copy", "[ ] Another account can't see mine"] },
          { h: "Test plan", lines: ["Vitest for the logic, Playwright for the flow."] },
        ],
      },
    },
    {
      title: "Let feedback pick the feature",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "you", text: "Here are eleven notes from testers." }, { who: "claude", text: "Three ask to save dinners. One asks for meal plans." }, { who: "claude", text: "Favorites fits the one job. Meal plans can wait." }, { who: "out", text: "✓ Pick: Favorites" }] },
      promptLabel: "Copy · pick the feature",
      prompt: "Read SPEC.md, then read FEEDBACK.md, where I pasted what testers told me, one note per line.\n\n1. Group the notes by what the person was trying to do, and count each group.\n2. For each group, say in one line whether it fits The one job in SPEC.md or something under Out of scope.\n3. Recommend one feature we can build and ship tonight: the biggest group that fits the one job. Say what you'd leave out.\n\nDon't write any code. Stop and wait for me to pick.",
      promptPreview: "Read SPEC.md and FEEDBACK.md, group the notes, check each group against the one job, and recommend one feature. No code yet.",
    },
    {
      title: "Write the feature spec",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "claude", text: "Should saving twice keep two copies?" }, { who: "you", text: "No. One copy." }, { who: "claude", text: "Can someone favorite from their history?" }, { who: "you", text: "Yes, every card gets a heart." }, { who: "out", text: "✓ Added Feature: Favorites to SPEC.md" }] },
      promptLabel: "Copy · the feature spec",
      prompt: "We're adding one feature: Favorites. Read SPEC.md first.\n\nInterview me about it one question at a time and wait for each answer. Cover what the person taps, what they see, what happens on a second tap, what data we keep, and who can see it.\n\nThen add a section to the end of SPEC.md called \"Feature: Favorites\" with: Feedback, The one job, Out of scope, Screen, Data, Acceptance criteria (checkboxes, each one something a test can check), Test plan (which checks are Vitest unit tests for logic, which are Playwright end-to-end tests at phone width, and which I check by hand), and a Ship checklist.\n\nDon't change the rest of SPEC.md. Stop and wait for my OK before writing any code.",
      promptPreview: "Interview me about Favorites, then add a Feature section to SPEC.md with acceptance criteria and a test plan. Wait for my OK.",
    },
    {
      title: "Set up the tests",
      layout: "checklist",
      diagram: "setup",
      terminal: { label: "~/whats-for-dinner", kicker: "ONE TIME", lines: ["$ npm install -D vitest", "✓ vitest.config.mts", "$ npm init playwright@latest", "✓ playwright.config.ts"], body: "Two runners, one for logic and one for the whole flow." },
      items: [
        { title: "Vitest", body: "Fast checks for the logic in lib/." },
        { title: "Playwright", body: "A real browser, sized like an iPhone." },
        { title: "A hook", body: "Tests run after every edit Claude makes." },
      ],
      promptLabel: "Copy · set up the tests",
      prompt: "Read SPEC.md, especially Feature: Favorites. Set up testing one step at a time and stop after each step.\n\n1. Install Vitest following the Next.js Vitest guide:\nnpm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths\nAdd vitest.config.mts and a \"test\" script that runs vitest.\n2. Tell me to run this in my own terminal, because it asks questions:\nnpm init playwright@latest\nWait until I tell you it's done.\n3. In playwright.config, add a project that uses the iPhone 13 device, and a webServer that starts npm run dev.\n4. Add a PostToolUse hook to .claude/settings.json with the matcher Edit|Write that runs npx vitest run. If the tests fail, it exits with code 2 and writes the failure summary to stderr so you see it. Follow code.claude.com/docs/en/hooks-guide. Tell me to restart Claude Code so the hook loads, and wait.\n\nDon't write any feature code yet.",
      promptPreview: "Install Vitest, have me run npm init playwright@latest, add an iPhone 13 project, then add a hook that runs the tests after every edit.",
      takeaway: "code.claude.com/docs/en/hooks-guide",
    },
    {
      title: "Red first, with Matt Pocock's /tdd",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "claude", text: "Seams: lib/favorites.ts and the Favorites screen. OK?" }, { who: "you", text: "OK." }, { who: "out", text: "✗ toggles a favorite on (not implemented)" }, { who: "claude", text: "Red. Ready to write the code?" }] },
      promptLabel: "Copy · failing tests first",
      prompt: "If you don't have Matt Pocock's skills yet, I'll install them in my terminal:\nclaude plugin install mattpocock-skills@claude-plugins-official\nWait until I tell you it's done, and tell me to restart Claude Code if you can't see the tdd skill.\n\nRead SPEC.md, especially Feature: Favorites. Use the tdd skill.\n\n1. Propose the seams under test: lib/favorites.ts for the logic, and the Favorites flow in the browser. Wait for my OK.\n2. Write the first Vitest test from the Test plan, run it, and show me it fails for the right reason.\n3. Write the Playwright test for the main flow (heart a dinner, see it in Favorites, reload, still there), run it, and show me it fails.\n\nDon't write any feature code yet. Stop when both are red.",
      promptPreview: "Install mattpocock-skills if needed, use the tdd skill, agree the seams with me, then write one failing Vitest test and one failing Playwright test.",
      takeaway: "github.com/mattpocock/skills",
    },
    {
      title: "Green, one slice at a time",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "out", text: "✓ favorites table created" }, { who: "out", text: "✓ toggles a favorite on and off" }, { who: "out", text: "✓ saving twice keeps one copy" }, { who: "claude", text: "Slice 2 of 4: the heart on each card." }] },
      promptLabel: "Copy · build it to green",
      prompt: "Read SPEC.md, especially Feature: Favorites. Keep using the tdd skill.\n\nFirst, create a git branch called feature/favorites. Then create the favorites table from the Data section.\n\nList the slices that get every acceptance criterion to pass, in order, and wait for my OK. For each slice:\n1. Write one failing test, run it, and show me it's red.\n2. Write only enough code to make it pass, then run all the tests.\n3. Tell me what to open at localhost:3000 and wait for me before the next slice.\n\nIf something in the spec is unclear, ask me instead of guessing. Don't add anything under Out of scope. Commit after each green slice.",
      promptPreview: "On a feature/favorites branch, list the slices, then build each one red to green, commit, and wait for me before the next.",
    },
    {
      title: "Green isn't done",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "WHAT THE TESTS SAY", title: "12 passed." },
      after: { kicker: "WHAT YOU SEE", title: "The heart sits under your thumb.", em: "Check it at phone width." },
      items: [],
      promptLabel: "Copy · verify at phone width",
      prompt: "Read the acceptance criteria under Feature: Favorites in SPEC.md.\n\n1. Run the full Playwright suite on the iPhone 13 project and save a screenshot of Favorites with three saved dinners and of the empty state.\n2. Go through every acceptance criterion and tell me which test covers it, or that it needs a check by hand.\n3. Give me a short list of things to try myself in the browser at phone width: long dinner names, ten favorites, a fast double tap on the heart.\n\nFix anything that fails, one issue at a time, and show me each fix.",
      promptPreview: "Run Playwright on iPhone 13, map every acceptance criterion to a test, then give me a short list to check by hand at phone width.",
    },
    {
      title: "A fresh pair of eyes",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "claude", text: "Starting a fresh subagent with only the spec and the diff." }, { who: "out", text: "! DELETE /api/favorites/[id] doesn't check the owner" }, { who: "out", text: "✓ Fixed, with a test for it" }] },
      promptLabel: "Copy · review the diff",
      prompt: "Review this feature before it ships.\n\nStart a fresh subagent that hasn't seen our conversation. Give it only SPEC.md and the output of git diff main...feature/favorites. Ask it to review the diff adversarially against Feature: Favorites: missed acceptance criteria, anything under Out of scope that crept in, another account reaching my favorites, and tests that would pass even if the code were wrong. Ask for findings only, with file and line.\n\nWhen it reports, check each finding against the code yourself. For each real one, write a failing test, then fix it. Tell me which findings you rejected and why. Don't push yet.",
      promptPreview: "Start a fresh subagent with only SPEC.md and the diff, review it against the feature, then verify and fix each real finding test first.",
      takeaway: "code.claude.com/docs/en/sub-agents · or type /code-review",
    },
    {
      title: "Preview, then merge",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "out", text: "✓ PR #4 Favorites opened" }, { who: "out", text: "✓ Vercel preview ready" }, { who: "claude", text: "Checks green. Open the preview on your phone, then say merge." }] },
      promptLabel: "Copy · open the PR",
      prompt: "Read SPEC.md. Get Feature: Favorites ready to merge, and stop after each step.\n\n1. Preview deployments use the Vercel project's Preview environment variables, not Production. Create a Neon branch called preview for the preview database, with the new favorites table. Then give me the steps to set these for Preview in the Vercel dashboard myself: DATABASE_URL (the preview branch) and BETTER_AUTH_SECRET (a new value, not the production one). Never print secrets in chat. Wait until I tell you it's done.\n2. Better Auth rejects sign-ins from origins it doesn't trust, and every preview has its own URL. Read better-auth.com/docs/reference/options and update the auth config: use the dynamic baseURL with allowedHosts for this project's preview hosts only (a pattern scoped to our project name on vercel.app, never all of *.vercel.app) plus production and localhost. The docs say allowedHosts entries are added to trustedOrigins automatically; use trustedOrigins directly if our version doesn't support that.\n3. Write .github/workflows/test.yml so every pull request runs the tests. Follow playwright.dev/docs/ci-intro: actions/checkout and actions/setup-node at the versions it shows, npm ci, npx vitest run, npx playwright install --with-deps, then npx playwright test. The Playwright tests sign up real accounts, so create a Neon branch called ci and tell me to add DATABASE_URL (the ci branch) and BETTER_AUTH_SECRET as GitHub Actions repository secrets myself. Wait until I tell you it's done.\n4. Push feature/favorites and open a pull request with gh pr create. In the description, paste the acceptance criteria with each one ticked, and the review findings you fixed.\n5. Wait for the Vercel preview deployment and give me its URL so I can sign in and check Favorites on my phone. Wait until I tell you it works.\n6. Run gh pr checks --watch. The checks must include the test workflow and the Vercel deployment. If anything fails, fix it and push again.\n7. When every check is green, ask me before you merge. After the merge, confirm the production deploy and tick the Ship checklist in SPEC.md.",
      promptPreview: "Set preview env vars and Better Auth origins, run Vitest and Playwright in GitHub Actions, open the PR, check the preview, ask before merging.",
      takeaway: "Next talk: Digital Presence, a public face for What's for Dinner.",
    },
    takeHomeSlide("ship-a-feature"),
    FOUNDER_WEEKEND_SLIDE,
    COMMUNITY_CLOSE_SLIDE,
  ],
};

export const TALK = {
  slug: "ship-a-feature",
  series: 4,
  eventTitle: "Ship a Feature",
  key: "Feature",
  summary: "Add one feature to a live app, with tests that prove it works.",
  copy: "Tonight Claude Code adds one feature from real feedback: spec, failing tests, code, review, preview and merge.",
  ...WORKUITY,
  rsvp: [],
  steps: [
    { title: "Feedback", body: "Let what testers said pick one feature." },
    { title: "Spec", body: "Acceptance criteria and a test plan in SPEC.md." },
    { title: "Tests", body: "Failing tests first, then code until they pass." },
    { title: "Ship", body: "Review, preview on a phone, merge when green." },
  ],
  stepsLede: "We add Favorites to What's for Dinner on screen, one prompt at a time. Follow along on your own app or just watch.",
  closing: ["Bring your app.", "Leave with a tested feature."],
  example: {
    name: "What's for Dinner",
    heading: ["Tonight's", "example."],
    lede: "Testers kept scrolling their history for the same dinner. So tonight it gets Favorites.",
    file: "SPEC.md",
    pitch: "Save the dinners you'd make again. Find them in one tap.",
    jobLabel: "The one job",
    job: "Keep the dinners I'd make again one tap away.",
    stack: ["Vitest", "Playwright", "Claude Code subagents", "GitHub", "Vercel previews", "Neon branches"],
    doneLabel: "Done when",
    done: [
      "Every new test failed before the code existed",
      "Saving twice keeps one copy",
      "Another account can't see my favorites",
      "Checked on a phone through the Vercel preview",
      "Merged with every check green",
    ],
    spec: FEATURE_SPEC,
    specLabel: "Copy the feature section",
    specDestination: "the end of your SPEC.md",
  },
  toolsLede: "Everything that turns one feature into a merged, tested change, one job each.",
  tools: [
    { name: "Matt Pocock's skills", job: "The tdd skill: agree the seams, then red to green one slice at a time", cmd: "claude plugin install mattpocock-skills@claude-plugins-official", href: "https://github.com/mattpocock/skills" },
    { name: "Vitest", job: "Unit tests for the feature's logic", cmd: "npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths", href: "https://nextjs.org/docs/app/guides/testing/vitest" },
    { name: "Playwright", job: "End-to-end tests in a real browser, sized like an iPhone", cmd: "npm init playwright@latest", href: "https://playwright.dev" },
    { name: "Claude Code hooks", job: "Run the tests after every edit, automatically", cmd: "/hooks", href: "https://code.claude.com/docs/en/hooks-guide" },
    { name: "Claude Code review", job: "Fresh subagents and the built-in diff review", cmd: "/code-review", href: "https://code.claude.com/docs/en/sub-agents" },
    { name: "GitHub Actions", job: "Runs Vitest and Playwright on every pull request", cmd: ".github/workflows/test.yml", href: "https://playwright.dev/docs/ci-intro" },
    { name: "GitHub CLI", job: "Open the pull request and watch its checks", cmd: "gh pr checks --watch", href: "https://cli.github.com" },
    { name: "Neon branches", job: "A separate database for preview deployments", cmd: "neon branches create --name preview", href: "https://neon.com/docs/reference/cli-branches" },
    { name: "Vercel", job: "A preview URL on every pull request", cmd: "npx vercel", href: "https://vercel.com/docs/deployments/environments" },
  ],
  deck: DECK,
};
