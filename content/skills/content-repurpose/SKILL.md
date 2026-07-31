---
name: content-repurpose
description: Cut one published article into an X thread, a LinkedIn post and a newsletter blurb that each read as native. Use once something is actually published.
---

One piece of work, several cuts. Pasting the same three paragraphs into three places is how one good article becomes three mediocre posts, and the reader who follows you twice sees both.

**Input:** something published, with a live URL. If the piece is still a draft, finish it — a cut of an unfinished argument inherits the hole. Published is not verified: a number that went out unchecked is still unchecked, and cutting it puts it in front of an audience that hasn't seen it yet.

1. **Find the one idea worth taking.** Not a summary of the article: the single claim, number or reversal the piece turned on. If you can't say it in a sentence, the article has two pieces in it and this skill is the wrong tool.
2. **The thread.** Five to seven posts. The first one has to survive being read alone by someone who will never see the second. No "a thread 🧵", no numbering theatre, no cliffhanger that withholds the thing you already published. Link at the end — and rather than assuming the platform punishes links, check your own last few link posts against your last few text-only posts, and say which ones you compared.
3. **The LinkedIn post.** Three to five short paragraphs, the situation before the result, one idea. It reads as a person recounting something at work — not as the article's intro with the line breaks doubled. If `/social-post` already ran on this artifact there is a LinkedIn post already: skip this cut, or say plainly which of the two ships. Two versions of the same post from the same person in the same week is the tell.
4. **The newsletter blurb.** Eighty to a hundred and twenty words to people who already said yes. Lead with what they get from clicking, not with the fact that you published something. The subject line is part of the deliverable.
5. **Nothing new gets claimed, and nothing unverified gets carried.** Every number and every claim in a cut has to appear in the source. Re-run the claim-marking pass over the source before you cut anything, and drop whatever comes back unverified — every claim has to be verified, not merely published. A cut that adds a claim is a claim nobody edited, and it's the one that gets quoted.
6. **Cut what doesn't survive the format.** Some arguments need eight hundred words. Shipping a bad thread because the template had a thread slot in it is worse than shipping two cuts and skipping the third — say which one you dropped and why.

Write all cuts into one file beside the source — `06-growth/social/<slug>-cuts.md`, or `02-routines/social/` in Day Zero — so the transform is visible in one place. Build it by hand once before automating: `/social-automation` is this transform on a schedule — `/scheduled-workflow` in Day Zero — and either one can only queue output you already know the shape of.
