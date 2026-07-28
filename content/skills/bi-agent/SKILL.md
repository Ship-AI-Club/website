---
name: bi-agent
description: Build an agent that reads your analytics on a schedule and reports what moved in plain English. Use once events are verified.
---

Build the reporting agent. Analytics usually fails at attention, not collection — the data exists and nobody looks. Fix the half that is actually broken.

**Preconditions.** Open the verification table `/analytics-wire` wrote. If any event is not marked verified, stop and say which ones — an agent reporting on broken instrumentation is worse than no agent, because it looks authoritative. Checking that the skill *ran* is not the same as checking that it *passed*.

Below about twenty events in a window, report absolute counts only and say why — percentage changes on small numbers are noise dressed as signal.

**What to build**

1. **Access.** Read-only credentials for the analytics source. Never write, never delete, and keep keys out of the repo.
2. **The query layer.** One function per funnel stage returning a number for a date range. Keep it boring and testable — the agent's job is interpretation, not SQL gymnastics.
3. **The weekly summary.** Plain English, under 200 words: what each stage did, the change versus last week, and the single biggest mover. No charts, no jargon, no filler.
4. **Anomaly flags.** Anything moving more than a set threshold gets called out with a plausible cause and a suggested check. Say "probably" when it is a guess — a confident wrong diagnosis is worse than an uncertain right one.
5. **Delivery.** Scheduled, to somewhere already read daily — Discord, email, a phone notification. A report in a file nobody opens has the same value as the dashboard it replaced.

**Test it before you trust it.** Run against a week you already understand and check the summary matches what you know happened. Report that comparison.

**Be honest about small numbers.** With three signups a week, percentage changes are noise. Have the agent say so rather than reporting "+200% growth" off one extra user — that habit is exactly what makes a founder's numbers untrustworthy on stage.

Write the agent into `02-b2c/bi-agent/` or `03-b2b/bi-agent/`, matching the fork called in `01-roadmap/gtm-map.md`, with a sample report at `sample-report.md` beside it.
