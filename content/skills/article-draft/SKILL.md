---
name: article-draft
description: Draft one article from the content map worth publishing under your own name. Use when the map names an unwritten page.
---

Draft one article worth publishing under the user's own name.

**Input:** the content map at `05-site/content-map.md`. If it does not exist, stop and run `/content-map` — an article with no place in the map is a blog post, which is the thing the map exists to prevent.

1. **Take the highest-priority unwritten entry.** Not the most interesting one to you. If the map ranks by winnability, respect the ranking.
2. **Answer the question in the first paragraph.** Someone arriving from a search has the question already; making them scroll for the answer is how you lose them and the ranking.
3. **Write from something real.** A thing that actually happened, a number you actually have, a bug you actually hit. If the piece could have been written by someone who had never used the product, it will read that way.
4. **Every claim gets checked.** List each factual claim — error strings, version numbers, benchmark figures, "most people" statements — and mark it verified or unverified. Fabricated error strings are especially dangerous because they are exactly what people search for.
5. **Link to the pages the map says this one should feed**, and set a canonical.
6. **Length is whatever the question needs.** Padding to hit a word count is visible and it is the main reason this kind of writing reads as content marketing.

Before publishing, ask the one question that matters: would the user put their name on this? If any claim is unverified, the honest answer is no yet.

Write to `05-site/articles/<slug>.md`.
