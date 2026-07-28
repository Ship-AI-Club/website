---
name: funnel-metrics
description: Choose the one metric per funnel stage that will actually get measured. Use after the funnel exists, before wiring anything.
---

Decide what each funnel stage is measured by. This skill picks the numbers; `/analytics-wire` wires them. Do not instrument anything here.

**Input:** the funnel in `01-roadmap/gtm-map.md`. If it does not exist, stop and run `/gtm-map` — you cannot pick metrics for stages nobody has named.

1. **One primary metric per stage.** Not three. The one you would quote if someone asked how that stage is doing.
2. **Say where each number comes from.** A table, a dashboard, a query. If the answer is "we'd have to build that", mark the stage **not yet measurable** and move on — that is a finding, not a failure.
3. **Refuse vanity metrics.** Impressions, followers and pageviews are not stage metrics unless something downstream moves with them. If nobody would change a decision based on the number, cut it.
4. **Name the baseline.** Today's value for each metric, with today's date. Without it there is nothing to compare October to.
5. **Hand off.** Give the list to `/analytics-wire`, which owns wiring and verification.

Write to `02-b2c/funnel-metrics.md` or `03-b2b/funnel-metrics.md`, matching the fork called in `01-roadmap/gtm-map.md`.
