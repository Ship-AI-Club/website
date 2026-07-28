---
name: og-image
description: Generate Open Graph images so shared links preview properly. Use once routes exist, before anyone shares one.
---

Set up OG images.

1. Prefer generated over hand-made — one template that reads the page title beats twelve hand-exported PNGs that go stale.
2. 1200×630. Render it, downscale to about 360px wide — the width Slack and X actually show — and look at it. If the title needs squinting, shorten the title or raise the font size.
3. **Set `metadataBase` in the root layout first.** Without it Next resolves image URLs against `localhost` and every production preview breaks while the build output still looks right. Then wire `openGraph.images` per route plus a site-wide default, and set `twitter:card: summary_large_image` — without it X renders a small square and the 1200x630 work is wasted.
4. Verify by building and checking the emitted HTML contains the tag — do not assume.

Record the template and the routes wired in `05-site/scaffold.md`.
