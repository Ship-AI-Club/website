---
name: funnel-metrics
description: Define the specific metrics per funnel stage that will actually be measured, and wire them up. Use at session 03, Outbound Agents.
---

Turn the funnel into instrumented numbers.

1. For each stage, one primary metric. Not three.
2. For each metric: where it comes from, how it's collected, and who looks at it weekly. A metric with no collection method is a wish.
3. Set a baseline today, even if the baseline is zero. Without it there's nothing to compare October to.
4. Wire the events. Verify they fire — open the dashboard and confirm, don't assume the snippet works.
5. Write to `03-b2b/README.md`.

Refuse vanity metrics. Pageviews and impressions do not belong on this list unless they feed a downstream number that's also here.
