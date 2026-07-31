---
name: weekly-report
description: Put a short weekly numbers report on a schedule so it arrives without being asked. Use once there are numbers you can actually obtain.
---

Set the weekly report up, then put it on a schedule. This is deliberately lighter than `/bi-agent` — no query layer, no anomaly detection, no analytics build. Three to five numbers, on time, in plain English.

1. **Pick numbers you can actually obtain.** Signups, orders, revenue, replies, visits. If getting one means a manual export every Monday, it isn't a number, it's a chore, and the chore is what ends the routine.
2. **Write down where each one comes from** — the dashboard, the screen, the filter, the date range. Future-you will not remember, and neither will the model.
3. **The format: the report itself comes in under 200 words.** That cap is on what lands in the inbox every week, not on the routine file you're writing now — that one can be as long as it needs to be to specify the thing. Each number, the change from last week, the single biggest mover, and one line on what you'd do about it. No charts. No preamble. No restating the numbers in a summary paragraph.
4. **Name the scheduling mechanism explicitly.** Scheduled tasks in ChatGPT, scheduled tasks in Claude, or a cron job the user owns. Pick one and say which in the file — both product schedulers currently sit behind a paid plan, and cron is the free path for anyone not paying. A report with no named scheduler is a prompt they'll run twice and forget.
5. **Deliver it somewhere already read daily.** Email, Discord, a phone notification. A file in a folder is the dashboard they already weren't opening.
6. **Be honest about small numbers, one number at a time.** The threshold applies per number, not per report: any number under roughly twenty events in the window gets an absolute count and no percentage, even when the others in the same report are big enough to carry one. A mixed report is normal — say in the report which numbers are counts and why. "+200%" off one extra signup is noise wearing a suit, and reporting it is how a founder's numbers stop being trusted.
7. **Run it manually once and read the output** before enabling the schedule. Check it against a week they already understand — if the report and their memory disagree, the report is wrong.

Write the format and the named schedule to `02-routines/weekly-report.md`, with the first real run saved beside it.
