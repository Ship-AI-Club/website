---
name: social-profile
description: Rewrite one social profile from the positioning brief — handle, bio, banner, pinned post, links. Use once per platform.
---

Set up a single profile, well. Run this once per platform rather than blasting the same text everywhere — each one reads differently and the differences matter.

**Inputs.** The positioning brief (`04-positioning/brief.md`) and the audit (`05-site/social-audit.md`). If the positioning is not settled, stop and run `/positioning-brief` — a fast pass over eight profiles with fuzzy positioning just spreads the fuzziness.

**Per profile, produce:**

1. **Bio**, written to the platform's actual character limit. State who it is for and what they get. The site hero line is the source, compressed — not a different claim in a different voice.
2. **Handle and display name** consistent across platforms where it is still available. Note where it is taken so the user can decide rather than discovering it later.
3. **Banner / header** — what it should say, at the right dimensions for that platform. One line of copy, not a feature list at 1500px wide.
4. **Pinned post** — the single thing a first-time visitor should see. Usually the launch, the demo, or the clearest proof point.
5. **Links** — where the platform allows one, where it allows several, and what order they go in.

**Platform differences to respect rather than flatten:** LinkedIn reads as a company doing business and tolerates specificity about outcomes; X rewards a short sharp claim and punishes corporate register; GitHub is read by people who will judge the README more than the bio.

**Rules.** Never write "AI-powered" as the differentiator. No adjective that would survive being swapped onto a competitor. If a claim has no proof behind it, cut it rather than softening it.

Write each profile's copy into `05-site/social-profiles.md` under a heading per platform, so the user can paste them one at a time.
