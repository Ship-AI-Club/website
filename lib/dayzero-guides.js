/* ------------------------------------------------------------------
   Day Zero — follow-along guides.

   One per session, same shape and same job as the Zero to Launch guides
   in lib/guides.js: the page you keep open on the second monitor while
   Santos builds on screen, not a course. Every step names the skill that
   does the mechanical half and what "done" looks like, so you can tell
   whether to move on.

   The five-minute setup is shared — SETUP lives in lib/guides.js and is
   rendered above these steps. Sessions 03 and 04 need more than that
   (Node, GitHub, Vercel, an API key, the prepared branch), so those
   guides carry it as their own first step rather than forking SETUP.

   The reused skills hard-code Zero to Launch output paths in their own
   SKILL.md files. Where that happens, the step below names the Day Zero
   folder instead — 01-skills/, 02-routines/, 03-site/, 04-agents/.

   Rendered on the session's guide page, and written out as markdown
   downloads by scripts/build-kits.mjs from this same data.
------------------------------------------------------------------ */

export const DAY_ZERO_GUIDES = {
  "first-threads": {
    "minutes": "45 min",
    "lede": "Turn one task you keep explaining into a reusable skill. Test it in a fresh thread, inspect what went wrong, and edit it once. Meeting notes are tonight's worked example.",
    "steps": [
        {
            "t": "Choose a repeated task",
            "c": "Bring rough meeting notes or another task you explained twice this week. Name the input, useful output, and one failure to avoid.",
            "good": "A short task brief with an actual input sample."
        },
        {
            "t": "Start a useful thread",
            "c": "Supply context, task, output format, and the sample. For meeting notes, request decisions, owners, dates, and unresolved questions. Mark missing facts instead of inventing them.",
            "good": "A draft you can compare to the source notes."
        },
        {
            "t": "Write the skill",
            "run": "/skill-writer",
            "c": "Save the instructions in SKILL.md with a name and a description of when to use it. Use the demonstrated skills folder in a compatible tool; in a plain chat, attach or paste the file explicitly.",
            "good": "A reusable file with input, steps, output, and a stop rule when notes are absent."
        },
        {
            "t": "Test in a fresh thread",
            "c": "Invoke the skill in the demonstrated tool, or provide its file to a new chat. Use a second input. Check that every owner and deadline is supported by the notes.",
            "good": "A fresh run follows the file without the original conversation."
        },
        {
            "t": "Edit one failure and keep the evidence",
            "c": "Change the instruction that caused the weakest output, then rerun the same sample. Save the skill, input, output, and what improved in 01-skills/.",
            "good": "One visible before/after change and a saved skill. Watching the Grok Bot demo is optional."
        }
    ],
    "output": "01-skills/ — your SKILL.md, a test input, the output, and a sentence explaining the first failure and the edit that fixed it.",
    "stuck": "Use the meeting-notes example. If your account has no skill loader, paste or attach the file to a fresh chat; the reusable instructions are the artifact."
},

  "coworking-with-ai": {
    minutes: "45 min",
    lede:
      "Three routines with saved artifacts and review checkpoints: a live content calendar, a weekly report that has already landed once, outbound drafted into a folder, and a written checkpoint for each. Nothing here sends anything.",
    steps: [
      {
        t: "Build the four-week calendar",
        run: "/content-calendar",
        c: "Start with 02-routines/audience.md: who you help, one problem, and three questions from real people. Bring it or run /icp-builder now. The calendar works from the questions your buyers actually ask — the ones they type into a search box and the ones they ask you on calls. Eight slots across four weeks, two left empty on purpose, six entries dated in one file.",
        good: "Every row traces back to a question a real person asked, not a topic that sounds like marketing.",
      },
      {
        t: "Make it live before you close the tab",
        c: "Three edits, made by you, right now — add one entry, move one, delete one you'd never write. The skill hands you the file and stops there on purpose. That edit is what turns generated output into a file you own, and from here on it gets updated, never regenerated.",
        good: "The file has at least one line in it the model didn't write.",
      },
      {
        t: "Draft this week's posts, not the whole month",
        run: "/social-post",
        c: "Take one row off the calendar — something you actually did this week — and let it write the X version and the LinkedIn version separately, using writing samples you bring or collect now. Same artifact, different lengths, different openings. If there's nothing real to point at yet, skip the row rather than invent one.",
        good: "Two drafts in 02-routines/social/, each pointing at a link or a number, every claim in them marked verified or unverified, and nothing posted.",
      },
      {
        t: "Schedule the weekly report and watch one land",
        run: "/weekly-report",
        c: "Three to five numbers you can genuinely obtain, in a report under two hundred words, in plain English. Pick your mechanism — check scheduler and connector access in your account; the cron path is demonstrated too — then run it once by hand.",
        good: "One report has actually arrived and you read it. Counts, not percentages, on anything small — fourteen customers can't carry a percentage. If it hasn't run once, it isn't set up.",
      },
      {
        t: "Turn the ICP into twenty named accounts",
        run: "/icp-builder",
        c: "The audience note made tonight becomes a list of real companies and real people. The skill drafts it; you read every row. A list you haven't read is a list you won't send to.",
        good: "Twenty rows, each with a one-line reason that account is on the list. You cut at least a few.",
      },
      {
        t: "Draft the sequence into a folder",
        run: "/outbound-sequence",
        c: "First touch, two follow-ups, and a break-up that doesn't grovel — short enough to read on a phone. It writes to 02-routines/outbound/ and stops there. Nothing in this program has your outbox.",
        good: "You'd reply to it if it landed in your inbox cold, and the send count is still zero.",
      },
      {
        t: "Write a checkpoint line for every routine",
        c: "One sentence each: who reads the output, when, and what they do about it. If the honest answer is \"nobody, ever\", either delete the checkpoint or delete the routine — a rubber stamp is worse than no review, because it looks like one.",
        good: "Every routine in the folder has a named checkpoint you'd actually honour on a busy week.",
      },
    ],
    output:
      "02-routines/ — calendar.md with a hand-added entry, social/ with two drafts nobody has posted, weekly-report.md with its first real run beside it, accounts.md with twenty named accounts, outbound/ with drafts and nothing sent, and a checkpoint line per routine.",
    stuck:
      "Schedule not firing, or the product you use doesn't have one? Run it manually once and move on. The schedule is the wrapper; the skill is the value, and you can bolt a clock to it any evening this week.",
  },

  "first-deploy": {
    minutes: "60 min",
    lede:
      "A real site on a real URL by the end of the session, with a positioning one-pager you bring or create tonight as the hero and five sample pages generated from real data. The setup is the slow part and we do it as a room.",
    steps: [
      {
        t: "Install the agent and clone the template",
        c: "Node, then Claude Code or Codex, then log in, then clone the Day Zero template. This session needs a paid plan or an API key — worth saying plainly. The instructions went out in Discord beforehand; if you did them at home, you're ahead.",
        good: "The agent starts inside the template folder and can list the files in it.",
      },
      {
        t: "Plan the structure before you write a line",
        run: "/site-structure",
        c: "Sections, the order they go in, and the job each one has to do before it earns a scroll. Anything without a job gets cut, however nice it looks.",
        good: "You can say what every section is for, and the primary call to action is clear.",
      },
      {
        t: "Make the hero your one-pager",
        run: "/landing-copy",
        c: "Write or bring 03-site/positioning.md: audience, problem, outcome, proof, and next action. Use your session-two audience note, or create one now. Proof over adjectives everywhere below it — a number with a method behind it, the product doing the hard case, one sentence a real person said.",
        good: "What it is and who it's for, above the fold, without scrolling. No line describes your architecture.",
      },
      {
        t: "Scaffold and deploy",
        run: "/site-scaffold",
        c: "Routing, metadata, sections, then push. Deploy early and deploy ugly — an empty page on a real URL beats a perfect page on your laptop, and everything after this is an edit rather than an event.",
        good: "A URL you can paste into Discord and watch someone open.",
      },
      {
        t: "Work backwards to the content plan",
        run: "/content-map",
        c: "From what your ICP types into a search box to the pages that answer them, one query per page. If you have an article draft, it gets a home in the same pass; otherwise use the session-two calendar to draft one.",
        good: "Every page title is something a real person would actually type, not a phrase you'd like to rank for.",
      },
      {
        t: "Generate five pages, not five hundred",
        run: "/programmatic-pages",
        c: "One table of real data, one template, five rows. Then read one of them out loud: if it's a keyword with a header on it, that's a doorway page and it belongs in the bin, not on the site.",
        good: "Five live pages, and you'd be glad to land on any of them from a search.",
      },
      {
        t: "Make it presentable, then check it's fast",
        run: "/og-image  →  /perf-pass",
        c: "Links that preview properly are ten minutes you spend once and get back on every share for the next year. Then the Core Web Vitals fixes that actually move the number, and only those.",
        good: "The URL previews deliberately in a chat app, and you know your LCP and aren't embarrassed by it.",
      },
    ],
    output:
      "03-site/ — structure.md, copy applied to the real page, a deployed URL in scaffold.md, content-map.md, five sample programmatic pages live, og images and perf.md.",
    stuck:
      "Something in the terminal breaks — it will. Paste the whole error back to the agent, not a summary of it. That is the workflow, not a workaround. If the deploy from the command line won't cooperate, import the repo in the Vercel dashboard and move on; you're here for the site, not the CLI.",
  },

  "agentic-workflows": {
    minutes: "60 min",
    lede:
      "Two things that stop waiting for you: a support agent live on the site you shipped in session 03, and one workflow on a schedule. Guardrails get written before either goes live, and you break a run on purpose before you trust it.",
    steps: [
      {
        t: "Pull the prepared branch and set your keys",
        c: "Same repo as session 03: git switch night-shift, which already has the chat route and the workflow wired up. You're writing what goes in them, not the plumbing. Keys go in .env.local and nowhere near a commit.",
        good: "The site runs locally on the branch and app/api/chat/route.ts is there — a wired route with nothing behind it yet.",
      },
      {
        t: "Decide the rules before any prompt",
        c: "Never promise, never negotiate price, never send email, and \"I don't know, here's a human\" is always allowed. Decide them now and hand them to the skill in the next step — it writes 04-agents/guardrails.md as its first move, so anything you type into that file by hand gets overwritten. Deciding them after the first bad screenshot is how everyone learns them the expensive way.",
        good: "You can say all four rules out loud, and every one is a sentence you'd be happy for a customer to read.",
      },
      {
        t: "Build the agent on your own content",
        run: "/support-agent",
        c: "The prompt gets built from the pages you shipped last session, so it answers with your content and cites the page it came from. Three outcomes only: answer, escalate, refuse.",
        good: "Every answer points at a page on your site. If it's talking about your industry in general, it's reaching for model memory.",
      },
      {
        t: "Ask it ten real questions, two of which it must escalate",
        c: "Seven things a customer would genuinely ask, two it must escalate, and one it must refuse — a discount request and a delivery promise are the classics. Log the question, the outcome and the page it cited, and log what it said rather than what you hoped.",
        good: "It escalated both of the two. If it answered either one, fix the prompt and run the ten again.",
      },
      {
        t: "Deploy it",
        c: "Onto the live URL from session 03. A chat agent that only works on localhost is a demo of a demo — and the first real question from a stranger teaches you more than the next hour of tuning.",
        good: "You can open the site on your phone and ask it something.",
      },
      {
        t: "Run one workflow by hand",
        run: "/scheduled-workflow",
        c: "Pick one: weekly article drafts from your session-02 calendar into a review queue, or the numbers report. Trigger it manually, then read the logs line by line. Never auto-publish — the queue is the checkpoint.",
        good: "One complete run, and you can say what each step did without guessing.",
      },
      {
        t: "Turn the schedule on, then break it on purpose",
        c: "Add the cron entry, then make a run fail — pull a key, point it at a file that isn't there — and confirm you actually hear about it. The alert has to live inside the workflow, not at the trigger: the trigger returns the moment the run is queued, so a catch there reports success on a run that died. A cron job that fails silently is worse than no cron job, because you'll trust it for a month.",
        good: "The failure alert reached you somewhere you'll see it. Then you put the key back and watched a clean run land.",
      },
    ],
    output:
      "04-agents/ — guardrails.md, the chat route live on your deployed site, a test log of ten questions with two escalations, and one workflow that has run manually, on a schedule, and failed loudly. Plus the optional /content-repurpose cut of your article in 02-routines/social/, if you took it.",
    stuck:
      "If the agent is confident and wrong, it's reaching for model memory instead of your pages. Tighten the prompt to answer only from retrieved content, and make \"I don't know — here's a human\" an explicitly valid answer. An agent allowed to say no is worth more than one that always has something to say.",
  },
};
