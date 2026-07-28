---
name: perf-pass
description: Measure Core Web Vitals and fix only what moves a number. Use when the site is deployed and feels slow.
---

Optimise what matters, skip the theatre.

1. **Measure first.** Build, `npx next start`, then `npx lighthouse http://localhost:3000 --only-categories=performance --chrome-flags="--headless=new"`. Read LCP, CLS and TBT off the report. Real INP needs field data — if the site has under a thousand visitors a day you will not have it, so use TBT as the proxy and say so. Never optimise against dev-mode timings.
2. **LCP** is usually the hero image or a webfont. Check in that order: image format and size, priority hint, font loading strategy.
3. **CLS** is usually images without dimensions, or a font swap. Set explicit width/height; check the fallback metrics.
4. **INP** is rarely a problem on a marketing site. If it is, find the blocking script.
5. **Report before and after numbers.** If a change didn't move a number, revert it — unmeasured optimisation is just extra code.

Skip: micro-bundling, exotic image CDNs, and anything that adds a dependency to save 4kb.

Write the before/after numbers to `05-site/perf.md`.

If the numbers are already good, stop and say so. Write them down and change nothing — a pass with no work to do is a valid result.
If the LCP element is a text node, the fix is server response time and blocking resources, not image work.
