---
name: paid-test
description: Decide whether paid is worth trying yet and size the smallest honest test. Use before opening an ad account.
---

Decide whether paid is worth trying yet. This is the gate; `/paid-basics` is the execution. If the gate fails, there is nothing to execute.

1. **Is the funnel instrumented?** If you cannot attribute a signup to a click, paid buys you nothing but a bill. Stop and run `/analytics-wire`.
2. **Is there organic demand?** Somebody has to want this before you pay to show it to more people. Paid accelerates a working funnel and accelerates a broken one just as fast.
3. **What is the ceiling?** The most you can pay for a customer. Run `/unit-economics` if it exists; if you are early and it does not, compute a provisional ceiling here — ARPU x gross margin x assumed lifetime / 3 — label it provisional, and say it must be rechecked once churn is real.
4. **Can you afford a readable test?** State two numbers: what it costs to buy enough clicks to learn something, and what you can lose entirely without it mattering. **If those two numbers do not overlap, say so and stop.** A test too small to read is money spent on nothing.
5. **Set the kill number before spending.** Cost per signup, by a date. Decided in advance it is a threshold; decided afterwards it is an excuse.

If all five clear, hand off to `/paid-basics` for structure, creative and the daily loop.

Write to `02-b2c/paid-test.md` or `03-b2b/paid-test.md`, matching the fork called in `01-roadmap/gtm-map.md`.
