---
name: launch-checklist
description: Verify everything that breaks a launch — site, metadata, analytics, links — by testing it. Use on launch day and hackathon weekend.
---

Pre-flight. Verify each item rather than asking whether it's done.

**Site**
- Live URL loads in a private window, on mobile, with no login.
- All CTAs work. Click every one.
- Metadata, canonical and OG present — check the emitted HTML, and preview a link somewhere real.
- No console errors, no 404s on internal links.

**Measurement**
- Analytics installed and *confirmed firing* — open the dashboard and watch your own visit land.
- Conversion events wired for the funnel stages from `02-b2c/` or `03-b2b/`.
- You can answer "how many people did X" within ten seconds. Judges will ask.

**The launch itself**
- Channel, audience, exact hour — written down, not decided in the moment.
- Copy written and read aloud once.
- Assets exported at the right sizes for the platform.
- Someone other than you has read the post.

**Contingency**
- What you do if it goes quiet in the first hour. Having an answer prevents the panic-rewrite.

Report a plain pass/fail list. Do not mark anything green you haven't actually verified. Where an item genuinely can't apply — an authenticated feature has no signed-out URL — mark it N/A and write what you checked instead. Lying is worse than skipping.

Write the result to `06-growth/launch-checklist.md` and report the summary inline. A checklist that only exists in a chat log is not something a teammate can open on Saturday.
