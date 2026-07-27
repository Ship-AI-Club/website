---
name: analytics-wire
description: Instrument a funnel end to end and verify every event actually fires. Use at session 02, Zero to $3,000, or any time "we didn't really track that" is the honest answer.
---

Wire measurement that will survive a judge asking "how many people did X?"

1. **Read the funnel first.** Open `01-roadmap/README.md`. Each stage there needs exactly one event. If the roadmap has stages you cannot instrument, say so — that is a roadmap problem, not a tooling problem.
2. **Pick the smallest tool that works.** A single analytics script plus one events table beats a warehouse nobody maintains. Do not recommend a stack that needs a data engineer.
3. **Name events consistently.** `noun_verb`, past tense, lowercase — `signup_completed`, `checkout_started`. Rename now rather than living with drift for ten weeks.
4. **Instrument.** Client events for interface actions, server events for anything involving money or truth. Never trust a client event for revenue.
5. **Verify each one fires.** This is the step everyone skips. Trigger the event yourself and watch it land in the dashboard. Report a per-event pass/fail list. Do not mark anything green you have not personally seen arrive.
6. **Take a baseline** and write it down with today's date, even if every number is zero. Without it there is nothing to compare October to.

Write to `02-b2c/README.md`. If a number cannot be collected before the launch weekend, say that plainly now rather than discovering it on the Sunday.
