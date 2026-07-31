---
name: social-post
description: Turn one thing you actually shipped into platform-native post drafts for X and LinkedIn, in your own voice. Use when there's a real artifact and no post yet.
---

Write the posts for one thing that actually happened — a feature that shipped, an article that went up, a demo that worked. One artifact per run. "Post something today" is not an input.

**Read the voice first.** The brand-voice skill in `01-voice/`. If it doesn't exist, stop and run `/brand-voice` — social is the one surface where a post assembled from adjectives is instantly recognisable as one, and it's attached to the user's name.

1. **Name the artifact and the proof.** The URL, the screenshot, the number, the commit. Something a reader can go and check. If there is nothing to point at, there is no post — that's a signal to go ship, not to write harder.
2. **Draft each platform separately, from the same artifact.** X: one idea, under 280 characters, the specific detail in the first line because that's all most people read. Count the characters — paste it into something that counts. A model's estimate of its own length is wrong often enough to be worthless. LinkedIn: 3–5 short paragraphs, more context allowed, the situation before the result. The same paragraphs pasted into both is how you sound like a brand account on one and a stranger on the other.
3. **Show the work, not the win.** What it does, what it cost, what broke on the way. The version with the failed first attempt in it outperforms the version without it, and it's also the true one.
4. **Verified claims only.** Mark every number and every claim verified or unverified, the same pass `/article-draft` runs. An unverified number in a post is public in a way a draft isn't, and the correction never travels as far.
5. **Cut the engagement bait.** "Thoughts?", "Agree?", "follow for more", the one-word-per-line ladder, the fake-modest "small announcement" on a big one. Also cut any authority you haven't earned — "most teams get this wrong" from someone with three customers reads exactly as it is.
6. **One ask, or none.** Read it, try it, reply if you've hit this. Two asks is zero asks.

**Drafts only. Nothing posts itself.** Write both versions to `06-growth/social/<date>-<slug>.md` — `02-routines/social/` in Day Zero — and the user posts by hand. When the cadence starts depending on remembering, `/social-automation` queues these — `/scheduled-workflow` in Day Zero — and neither one publishes them.
