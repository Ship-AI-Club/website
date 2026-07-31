---
name: scheduled-workflow
description: Ship one workflow that runs on a schedule and lands its output in a review queue. Use once a routine is worth taking out of the week.
---

Build one workflow. One. Using the Workflow DevKit setup already on the Day One template branch — one workflow that runs beats three that were designed.

**Pick a path:**

- **Article path.** `02-routines/calendar.md` says what's due; the workflow drafts it in the user's voice and puts it in a review queue. It never publishes. The human at the end of the queue is the entire point.
- **Report path.** The weekly report from `02-routines/weekly-report.md`, rebuilt to run itself and post where a person already reads.

Then:

1. **Write the steps out in English first.** The trigger, each step, what it reads, what it writes, and where a human touches it. If that list runs past six lines, the workflow is doing two jobs — cut one.
2. **Trigger it manually and read the whole log.** Every time, before any schedule exists. You are checking that the output is worth having, not that the code executed.
3. **Land the output in a queue, never in public.** A file, a draft, a channel someone approves. Auto-publishing is a failure mode with a permanent public record and no undo.
4. **Only then enable the schedule.** Weekly is usually right. Daily builds a backlog nobody reviews, which is the same as not running at all.
5. **Alert on failure.** A message somewhere they'll see it, every time a run throws. A job that quietly stopped six weeks ago is the worst outcome available: the work isn't happening and they think it is.
6. **Make one run fail on purpose.** Break a key, watch the alert arrive, put the key back. Untested alerting is a belief, not a safety net.
7. **Write down the cost per run** and what that is per month. Small numbers, but they're on a schedule now and nobody is watching them.

Write the workflow and its run notes to `04-agents/workflow/`.
