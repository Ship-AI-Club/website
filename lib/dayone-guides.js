/* ------------------------------------------------------------------
   Day One — follow-along guides.

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
   SKILL.md files. Where that happens, the step below names the Day One
   folder instead — 01-voice/, 02-routines/, 03-site/, 04-agents/.

   Rendered on the session's guide page, and written out as markdown
   downloads by scripts/build-kits.mjs from this same data.
------------------------------------------------------------------ */

export const DAY_ONE_GUIDES = {
  "first-threads": {
    minutes: "40 min",
    lede:
      "You leave with a business named, two skills built from your own material, a one-pager you'd defend to a stranger, and a first article drafted. Four files, all of which the next three sessions read.",
    steps: [
      {
        t: "Name the business",
        c: "One, and it's the one you carry through all four sessions. Something you'd actually like customers for beats a demo project — the work only compounds if the thing is real. An idea with no code yet counts.",
        good: "One sentence: what it is and who it's for. Written down, not held in your head.",
      },
      {
        t: "Build the voice skill from real writing",
        run: "/skill-writer",
        c: "Feed it three things you actually wrote — emails, a post, a page. Not adjectives. The skill comes back with do/don't pairs quoted from your own sentences, plus the tells that give you away.",
        good: "A fresh thread, given nothing but the skill, writes something that sounds like you rather than like a brand.",
      },
      {
        t: "Write down who pays",
        run: "/icp-profile",
        c: "Who pays, the trigger that makes this urgent now instead of someday, and the disqualifier. The disqualifier is the one everybody skips, and it's the one that makes every later draft specific.",
        good: "You can name a real company that fits and a real company that obviously doesn't.",
      },
      {
        t: "Compress it to one page",
        run: "/positioning-brief",
        c: "It reads the voice skill and the ICP first, then writes the one-liner: for [who] who [problem], [product] is a [category] that [outcome]. Then the swap test — put a competitor's name in it.",
        good: "It fails the swap test. If a competitor's name reads true in your one-liner, it's a description, not positioning.",
      },
      {
        t: "Draft the first article",
        run: "/article-draft",
        c: "One piece, in your voice, from the one-pager. Go through it and mark every claim and number as verified or unverified. That pass is the whole difference between a draft and something you can publish.",
        good: "Every claim is marked, and you know which two you have to go and check tomorrow.",
      },
      {
        t: "File all of it in 01-voice/",
        c: "Four files in one folder, committed. Session 02 reads the ICP to build the calendar, session 03 turns the one-pager into the hero of your site, session 04 hands the voice skill to the drafting workflow. A chat you closed can't do any of that.",
        good: "It's on disk and pushed. If it only exists in a scrollback, you'll rebuild it next week.",
      },
    ],
    output:
      "01-voice/ — brand-voice skill built from real samples, icp.md, positioning.md with the one-liner, and article-01.md with every claim marked.",
    stuck:
      "If the voice skill sounds generic, you fed it adjectives instead of writing. Go get three real emails you've sent and run it again — it can only sound like you if it's read you.",
  },

  "coworking-with-ai": {
    minutes: "45 min",
    lede:
      "Four routines that run whether or not you remember them: a live content calendar, a weekly report that has already landed once, outbound drafted into a folder, and a written checkpoint for each. Nothing here sends anything.",
    steps: [
      {
        t: "Build the four-week calendar",
        run: "/content-calendar",
        c: "It reads 01-voice/icp.md and works from the questions your buyers actually ask — the ones they type into a search box and the ones they ask you on calls. Twelve pieces, dated, in one file.",
        good: "Every row traces back to a question a real person asked, not a topic that sounds like marketing.",
      },
      {
        t: "Make it live before you close the tab",
        c: "Add one entry by hand, right now, and delete one you'd never write. That edit is what turns generated output into a file you own — and from here on it gets updated, never regenerated.",
        good: "The file has at least one line in it the model didn't write.",
      },
      {
        t: "Schedule the weekly report and watch one land",
        run: "/weekly-report",
        c: "Three to five numbers you can genuinely obtain, under two hundred words, in plain English. Pick your mechanism — tasks in ChatGPT, scheduled tasks in Claude, or cron if you'd rather own it — then run it once by hand.",
        good: "One report has actually arrived and you read it. If it hasn't run once, it isn't set up.",
      },
      {
        t: "Turn the ICP into twenty named accounts",
        run: "/icp-builder",
        c: "The profile from session 01 becomes a list of real companies and real people. The skill drafts it; you read every row. A list you haven't read is a list you won't send to.",
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
      "02-routines/ — calendar.md with a hand-added entry, weekly-report/ that has reported once, outbound/ with drafts and nothing sent, and a checkpoint line per routine.",
    stuck:
      "Schedule not firing, or the product you use doesn't have one? Run it manually once and move on. The schedule is the wrapper; the skill is the value, and you can bolt a clock to it any evening this week.",
  },

  "first-deploy": {
    minutes: "60 min",
    lede:
      "A real site on a real URL by the end of the session, with your session-01 one-pager as the hero and five sample pages generated from real data. The setup is the slow part and we do it as a room.",
    steps: [
      {
        t: "Install the agent and clone the template",
        c: "Node, then Claude Code or Codex, then log in, then clone the Day One template. This session needs a paid plan or an API key — worth saying plainly. The instructions went out in Discord beforehand; if you did them at home, you're ahead.",
        good: "The agent starts inside the template folder and can list the files in it.",
      },
      {
        t: "Plan the structure before you write a line",
        run: "/site-structure",
        c: "Sections, the order they go in, and the job each one has to do before it earns a scroll. Anything without a job gets cut, however nice it looks.",
        good: "You can say what every section is for, and there is exactly one call to action.",
      },
      {
        t: "Make the hero your one-pager",
        run: "/landing-copy",
        c: "Straight from 01-voice/positioning.md, in the voice skill you built the same night. Proof over adjectives everywhere below it — a number with a method behind it, the product doing the hard case, one sentence a real person said.",
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
        c: "From what your ICP types into a search box to the pages that answer them, one query per page. The articles you drafted in session 01 get a home in the same pass.",
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
        c: "Same repo as session 03, on a branch that already has the chat route and the workflow wired up. You're writing what goes in them, not the plumbing. Keys go in .env.local and nowhere near a commit.",
        good: "The site runs locally on the branch, and the chat box appears — answering nothing useful yet.",
      },
      {
        t: "Write the guardrails file first",
        c: "Before a line of prompt. Never promise, never negotiate price, never send email, and \"I don't know, here's a human\" is always allowed. Writing these after the first bad screenshot is how everyone learns them the expensive way.",
        good: "04-agents/guardrails.md exists, and every rule in it is a sentence you'd be happy for a customer to read.",
      },
      {
        t: "Build the agent on your own content",
        run: "/support-agent",
        c: "The prompt gets built from the pages you shipped last session, so it answers with your content and cites the page it came from. Three outcomes only: answer, escalate, refuse.",
        good: "Every answer points at a page on your site. If it's talking about your industry in general, it's reaching for model memory.",
      },
      {
        t: "Ask it ten real questions, two of which it must refuse",
        c: "Eight things a customer would genuinely ask, plus two it has no business answering — a discount request and a delivery promise are the classics. Log what it said, not what you hoped.",
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
        c: "Enable the schedule, then make a run fail — pull a key, point it at a file that isn't there — and confirm you actually hear about it. A cron job that fails silently is worse than no cron job, because you'll trust it for a month.",
        good: "The failure alert reached you somewhere you'll see it. Then you put the key back and watched a clean run land.",
      },
    ],
    output:
      "04-agents/ — guardrails.md, the chat route live on your deployed site, a test log of ten questions with two escalations, and one workflow that has run manually, on a schedule, and failed loudly.",
    stuck:
      "If the agent is confident and wrong, it's reaching for model memory instead of your pages. Tighten the prompt to answer only from retrieved content, and make \"I don't know — here's a human\" an explicitly valid answer. An agent allowed to say no is worth more than one that always has something to say.",
  },
};
