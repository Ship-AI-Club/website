---
name: unit-economics
description: Model CAC, LTV, churn and payback, and derive the CAC ceiling a channel has to hit. Use at session 06, Agentic Growth, or before any paid spend.
---

Do the arithmetic that decides whether the model survives customer acquisition cost.

1. **LTV** — ARPU × gross margin × expected lifetime. Derive lifetime from churn (1/monthly churn) if they have it; if not, use a labelled assumption and show how sensitive the answer is to it.
2. **CAC** — total acquisition spend ÷ customers acquired. Include time if they're doing founder-led sales; unpaid effort is not free.
3. **The ceiling.** LTV > 3× CAC is the line. Invert it: given their LTV, what is the maximum they can pay per customer? That number is the actual output of this exercise — it's what makes a channel viable or not.
4. **Payback period.** How many months to recover CAC. Under 12 is healthy for most; over 18 means they need financing, not a channel.
5. **State the assumptions in a list at the top.** Every number here rests on guesses; hiding them makes the model look more trustworthy than it is.

Write to `06-growth/README.md`. If the math says the plan doesn't work, say that directly and name which input would have to change.
