---
name: support-agent
description: Put a chat agent on the site that answers from your own content and knows when to hand off to a human. Use on the prepared template branch.
---

Build the support agent on the site that already exists.

**Precondition.** This runs on the prepared branch of the Day One site template — the one with the chat route already wired. Check it out and confirm the app builds before writing anything. If the user is on a different codebase, say so and stop: this skill assumes that branch, and standing up a chat stack from scratch is not a one-evening job.

1. **Guardrails file first, before any deploy.** Write `04-agents/guardrails.md`: what the agent may never do. Promise a date, negotiate or discount a price, send email, speak about an account it can't see, invent a policy. The version written after an embarrassing screenshot is written too late.
2. **Ground it in the site's own content.** The pages and articles shipped in `03-site/`. The system prompt says answer from these; if the answer isn't in them, don't answer. Model memory is where confident and wrong comes from.
3. **Three outcomes, and only three.**
   - **Answer** — it's in the content, and the reply points at the page it came from.
   - **Escalate** — pricing, refunds, anything account-specific, anyone upset. Collect an email, say a human is coming, stop talking.
   - **Refuse** — anything the guardrails forbid, plus anything outside the product. Politely, once, without arguing.
4. **Make "I don't know" a good answer.** Write it into the prompt explicitly. An agent with no legal way to fail will invent one.
5. **Test with ten real questions before deploy** — the ones customers actually send, not ten polite ones. Two of them must be questions that have to escalate, and at least one that has to be refused. Log the answer and the outcome for each. Any wrong outcome is a prompt fix, then run all ten again.
6. **Log every conversation** and read a week of them. Those logs are the most honest content map the site will ever get: every escalation is a page that doesn't exist yet.
7. **Then deploy**, and be the first person to try it on the live URL.

Write the prompt, the guardrails and the test log to `04-agents/support-agent/`.
