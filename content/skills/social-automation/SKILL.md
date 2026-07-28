---
name: social-automation
description: Build a pipeline that drafts and queues social posts from the content map. Use when posting depends on remembering to.
---

Automate distribution, because the cadence that depends on you remembering is the one that stops the first busy week.

1. **Start from the content map.** Read `05-site/content-map.md`. If it does not exist, stop and run `/content-map`. Social is repurposing, not a separate content strategy — if there's no map, the automation just publishes noise faster.
2. **One source, many cuts.** Each article or shipped feature becomes several posts across channels. Build the transform once; run it per piece.
3. **Keep the voice.** Feed the agent real examples of how the user actually writes, not an adjective list. Then have them read three generated drafts and say which sound wrong — tune on that, not on your own judgement of the voice.
4. **Queue, don't post.** Generate into a queue the user reviews. Fully autonomous posting to a real brand account is a bad trade: the failure mode is public and permanent, and review costs minutes a week.
5. **Set a cadence you'll sustain in month four**, not the one that looks impressive in week one. Under-promise the schedule.
6. **Never auto-post claims.** Anything with a number, a customer name or a comparison goes to a human first. Flag those explicitly in the queue.

Write the setup to `06-growth/social-automation.md` and the queued drafts to `06-growth/social-queue.md`.

Name the scheduling mechanism explicitly — a cron job, a scheduled task, or a queue the user already pays for. If there is no scheduler available, say so: a queue nobody publishes is a drafts folder, and the description of this skill promises posting, not drafting.
