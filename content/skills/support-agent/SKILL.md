---
name: support-agent
description: Put a chat agent on the site that answers from your own content and knows when to hand off to a human. Use on the prepared template branch.
---

Build the support agent on the site that already exists.

**Precondition.** This runs on the prepared branch of the Day Zero site template — the one with the chat route already wired. In the session-03 repo, run `git switch night-shift`, then confirm `app/api/chat/route.ts` exists and the app builds before writing anything. If that file isn't there, the branch didn't land: stop and say so. If there is no repo and no branch, stop — do not scaffold one. Standing up a chat stack from scratch is not a one-evening job, and this skill assumes the plumbing is already there.

1. **Guardrails file first, before any deploy.** Write `04-agents/guardrails.md`: what the agent may never do. Promise a date, negotiate or discount a price, send email, speak about an account it can't see, invent a policy. The version written after an embarrassing screenshot is written too late.
2. **Ground it in the site's own content.** The page copy in `app/` plus the article in `01-voice/`; `03-site/content-map.md` says what exists. The system prompt says answer from these; if the answer isn't in them, don't answer. Model memory is where confident and wrong comes from.
3. **Three outcomes, and only three.**
   - **Answer** — it's in the content, and the reply points at the page it came from.
   - **Escalate** — pricing, refunds, anything account-specific, anyone upset. Collect an email, say a human is coming, stop talking. Escalate on the record, not on the possessive: "my dog" is not account-specific, "my booking" is, and an agent that escalates every sentence with "my" in it is a contact form with extra steps. Append every escalation to `04-agents/support-agent/escalations.md` and post it to the Discord webhook in `.env.local` — an escalation nobody receives is a lie told politely.
   - **Refuse** — anything the guardrails forbid, plus anything outside the product. Politely, once, without arguing.
4. **Make "I don't know" a good answer.** Write it into the prompt explicitly. An agent with no legal way to fail will invent one.
5. **Test with ten real questions before deploy** — the ones customers actually send, not ten polite ones. Two of them must be questions that have to escalate, and at least one that has to be refused. Log each question, the outcome, and the page it cited in a simple table in the test log. Any wrong outcome is a prompt fix, then run all ten again.
6. **Log every conversation**, then read a week of them — as homework, not tonight. There isn't an hour in this session for it, and there won't be a week of logs until there's been a week. Those logs are the most honest content map the site will ever get: every escalation is a page that doesn't exist yet.
7. **Then deploy**, and be the first person to try it on the live URL.

Write the prompt and the test log to `04-agents/support-agent/`. The guardrails stay where step 1 put them, at `04-agents/guardrails.md` — everything in this session reads that one file, so it does not move.
