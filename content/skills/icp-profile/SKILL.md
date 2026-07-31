---
name: icp-profile
description: Write down who pays, what makes it urgent, and who to turn away — as a skill every later draft reads first. Use before writing any copy.
---

Write the customer profile as a skill rather than a document, because everything downstream reads it.

**Three answers, none of them optional:**

1. **Who pays.** The person, not the market. Their job, the size of the thing they run, what a normal week looks like for them. "Small businesses" is not an answer. "The one person who does marketing at a twelve-person HVAC company" is.
2. **The trigger.** What happened this month that makes them go looking. A new hire, a bad review, a price rise, a deadline, a competitor. No trigger means no urgency, and copy written without one reads as optional.
3. **The disqualifier.** Who you would turn away, and why, named plainly. The fastest way to lose a quarter is being helpful to people who were never going to pay.

**Then check it:**

- **Where would you find ten of them this week?** Name the actual place — a directory, a subreddit, a supplier list, a trade group, the school pickup line. Mark each one **[verified]** if you or the user has actually opened it and seen the right people in it, and **[unchecked]** if it's a guess. An unchecked directory is a to-do, not a channel, and the difference matters the week someone builds a plan on top of it. If there's no place at all, the profile is a description of a mood.
- **What do they call the problem in their own words?** Their words go in the copy. Yours go in the notes.
- **Does anything here also describe someone who wouldn't buy?** If yes, it's still too broad. Cut until it stops being comfortable.

If there are existing customers, build this from them and say so. If there are none, mark the whole profile a hypothesis and date it — an unmarked guess turns into a fact in about two weeks.

For B2B, once this profile exists, run `/icp-builder` to turn it into twenty named accounts with the trigger you think applies to each. This skill is the profile; that one is the list.

**Write it as a skill, not a memo.** Frontmatter with `name: icp-profile` and a one-line description saying what it is and when to read it. Then the three answers and the checks above, in the customer's own words. Then a closing refuse block, in the file, in plain language: do not widen this profile to fit a draft that's struggling — a copy problem is not a licence to add a segment. Do not invent a client, a company name or a figure to make an example land; write a flagged placeholder and say what's missing.

Write to `.claude/skills/icp-profile/SKILL.md` — where the agent reads it — and copy the same file to `01-voice/skills/icp-profile/SKILL.md` so it commits with the session's work.
