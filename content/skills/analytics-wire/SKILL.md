---
name: analytics-wire
description: Instrument a funnel end to end and verify every event really fires. Use when "we didn't really track that" is the honest answer.
---

Wire measurement that will survive a judge asking "how many people did X?"

1. **Read the funnel first.** Open `01-roadmap/gtm-map.md`; if it does not exist, stop and run `/gtm-map`. Each stage needs exactly one *number* — usually an event, sometimes a pageview you already collect, sometimes a query over another stage's timestamps. Do not invent an event to satisfy the rule; say which stages are derived and from what. If the roadmap has stages you cannot instrument, say so — that is a roadmap problem, not a tooling problem.
2. **Pick the smallest tool that works.** A single analytics script plus one events table beats a warehouse nobody maintains. Do not recommend a stack that needs a data engineer.
3. **Name events consistently.** `noun_verb`, past tense, lowercase — `signup_completed`, `checkout_started`. Rename now rather than living with drift for ten weeks.
4. **Instrument.** Client events for interface actions, server events for anything involving money or truth. Never trust a client event for revenue.
5. **Verify each one fires.** This is the step everyone skips. Trigger the event yourself and watch it land in the dashboard. Report a per-event pass/fail list. Do not mark anything green you have not personally seen arrive.
6. **Take a baseline** and write it down with today's date, even if every number is zero. Without it there is nothing to compare October to.

Write to `02-b2c/analytics.md` or `03-b2b/analytics.md`, matching the fork called in `01-roadmap/gtm-map.md`. If a number cannot be collected before the launch weekend, say that plainly now rather than discovering it on the Sunday.

If you cannot verify because the environment is missing — no dev server, no keys, nothing deployed — still write the plan, mark every event NOT TESTED, and list the exact blockers. Never write PASS from reading code.
