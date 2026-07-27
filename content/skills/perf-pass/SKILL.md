---
name: perf-pass
description: Run a Core Web Vitals pass on the marketing site and fix what actually moves the numbers. Use at session 05, Ship the Surface.
---

Optimise what matters, skip the theatre.

1. **Measure first.** Build, serve the production build, and get real LCP/CLS/INP numbers. Never optimise against dev-mode timings.
2. **LCP** is usually the hero image or a webfont. Check in that order: image format and size, priority hint, font loading strategy.
3. **CLS** is usually images without dimensions, or a font swap. Set explicit width/height; check the fallback metrics.
4. **INP** is rarely a problem on a marketing site. If it is, find the blocking script.
5. **Report before and after numbers.** If a change didn't move a number, revert it — unmeasured optimisation is just extra code.

Skip: micro-bundling, exotic image CDNs, and anything that adds a dependency to save 4kb.
