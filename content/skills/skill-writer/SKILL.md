---
name: skill-writer
description: Turn something you keep re-explaining into a skill file you run with one word. Use the second time you type the same instructions.
---

Write a skill for the thing the user keeps explaining twice.

1. **Find the repeat.** Ask them: what did you type twice this week? If they can't name one, stop — there is no skill here yet. The candidate is whatever they re-typed: the same context paragraph, the same format request, the same correction three threads running.
2. **Gather real examples before writing anything.** Two or three outputs they were happy with, and one they weren't. No past outputs? Use two things they wrote by hand for this task, and one that didn't work. A skill written from imagination encodes your guess at their standard. A skill written from examples encodes the standard.
3. **Frontmatter first.** `name` matching the folder exactly, and a one-line `description` saying what it does and when to use it. The description is how it gets found — "helps with content" gets found by nobody.
4. **The body is imperative steps, not background.** Tell the model what to do, in order, the way you'd tell a competent new hire. Cut every sentence explaining why the topic matters; it is already running, it doesn't need convincing.
5. **Name the input and the output file.** What it reads first, where it writes, and what to do when the input is missing — stop, and say which skill produces it. Give a concrete filename convention with a worked example, not a `<placeholder>` the next thread has to guess at.
6. **Say what it should refuse.** The good ones carry a line like "do not invent numbers" or "stop if the profile doesn't exist." A skill that never pushes back will produce confident nonsense on request.
7. **Test it in a fresh thread.** No context, no follow-up prompting, no help. If the output takes three corrections to be usable, the skill is missing three sentences. Running unattended? Write the fresh-thread test as a numbered checklist at the bottom of the produced skill and tell the user to run it — an untested skill shipped as tested is the one failure here that hides.
8. **Tune on what sounded wrong.** The corrections from that test are the edit list. Not your theory of what a good output looks like — the specific things you had to fix.

Keep it under a page. Skills that read like documentation get skimmed by a model the same way they get skimmed by a person.

Write to `.claude/skills/<name>/SKILL.md` — that is where the agent reads it from — and copy the same file to `01-voice/skills/<name>/SKILL.md` so it commits with the session's work instead of living only in a dotfolder.
