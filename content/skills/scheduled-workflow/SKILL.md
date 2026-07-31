---
name: scheduled-workflow
description: Ship one workflow that runs on a schedule and lands its output in a review queue. Use once a routine is worth taking out of the week.
---

Build one workflow. One. Using the Workflow SDK (`workflow` on npm) already set up on the Day Zero template branch — one workflow that runs beats three that were designed.

**Precondition.** In the session-03 repo, run `git switch night-shift`. Confirm `app/api/chat/route.ts` exists — that file is the marker that the branch actually landed. If it isn't there, stop and say so. If there is no repo and no branch, stop — do not scaffold one.

**Pick a path:**

- **Article path.** `02-routines/calendar.md` says what's due; the workflow drafts it in the user's voice and puts it in a review queue. It never publishes. The human at the end of the queue is the entire point.
- **Report path.** The weekly report from `02-routines/weekly-report.md`, rebuilt to run itself and post where a person already reads.

Then:

1. **Write the steps out in English first.** The trigger, each step, what it reads, what it writes, and where a human touches it. If that list runs past six lines, the workflow is doing two jobs — cut one.
2. **Trigger it manually and read the whole log.** Every time, before any schedule exists. You are checking that the output is worth having, not that the code executed.
3. **Land the output in a queue, never in public.** A file, a draft, a channel someone approves. Auto-publishing is a failure mode with a permanent public record and no undo.
4. **Only then put it on a clock.** Add the cron entry to `vercel.json` and redeploy. It runs in UTC and it invokes with GET — give the route a GET handler or it 405s silently and you will believe it is running. Weekly is usually right. Daily builds a backlog nobody reviews, which is the same as not running at all.
5. **Alert on failure, from inside the workflow body.** A message somewhere they'll see it, every time a run throws. The alert goes in the workflow itself, never in the trigger route: `start()` returns as soon as the run is queued, so a try/catch at the trigger never fires and the route reports a clean 200 on a run that died four steps later. A job that quietly stopped six weeks ago is the worst outcome available: the work isn't happening and they think it is.
6. **Make one run fail on purpose.** Break a key, watch the alert arrive, put the key back. Untested alerting is a belief, not a safety net.
7. **Write down the cost per run**, with the arithmetic beside it: read the token count off the run log, multiply by the provider's posted rate for that model, then multiply by 52 for the year. Small numbers, but they're on a schedule now and nobody is watching them.

Write the workflow and its run notes to `04-agents/workflow/`.
