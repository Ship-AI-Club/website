---
name: brand-voice
description: Extract a voice skill from real writing samples so every draft sounds like the user instead of a model. Use before generating any copy.
---

Build a voice skill from evidence, not from adjectives.

**Input:** three to five things the user actually wrote and sent — emails, posts, a README, a message to a customer. Unedited. If they hand you an adjective list instead, stop and ask for the samples: "friendly, professional and approachable" describes their closest competitor equally well, and produces identical copy for both.

1. **Read the samples for patterns, not vibes.** Sentence length. Contractions or not. "I" or "we". Where they hedge and where they don't. What they call the customer. Whether they use questions, lists, jokes, numbers, profanity.
2. **Write do/don't pairs, each carrying a real quote.** "Uses the number: *'went from four support emails a day to one'* — not 'significantly reduced support volume.'" A rule with no quote behind it is your taste wearing their name.
3. **Capture the words they own and the words they never use.** The avoided ones are usually the stronger signal — most people have two or three industry terms they refuse on principle.
4. **Note the register shifts.** Almost everyone writes differently to a customer than to a peer. Label which sample is which and say when each applies.
5. **The tell-check.** List the constructions that mark a draft as machine-written for this user specifically: the em-dash habit, "in today's fast-paced world", "it's not just X, it's Y", tidy rule-of-three lists, a closing paragraph that summarises what was just said. Instruct the skill to strike them on sight.
6. **Test it.** Generate three short drafts and have the user mark the sentences that sound wrong. Those marks are the edit list. Tune on them, not on your own read of the output.

Do not smooth the voice out. If they write in fragments, the skill says write in fragments. The target is a draft their own customers wouldn't clock as written by something else.

Write to `01-voice/skills/brand-voice/SKILL.md`, and keep the samples beside it in `01-voice/samples/`.
