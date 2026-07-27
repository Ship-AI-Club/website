---
name: og-image
description: Generate Open Graph images for site routes so links preview properly. Use at session 05, Ship the Surface.
---

Set up OG images.

1. Prefer generated over hand-made — one template that reads the page title beats twelve hand-exported PNGs that go stale.
2. 1200×630. Test that the title is legible at the size a link preview actually renders.
3. Wire `openGraph.images` in each route's metadata, plus a site-wide default in the root layout.
4. Verify by building and checking the emitted HTML contains the tag — do not assume.
