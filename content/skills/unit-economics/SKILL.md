---
name: unit-economics
description: Model CAC, LTV, churn and payback, and derive the most you can pay for a customer. Use before any paid spend.
---

Do the arithmetic that decides whether the model survives customer acquisition cost.

1. **LTV** — ARPU × gross margin × expected lifetime. Derive lifetime from churn (1/monthly churn) if they have it; if not, use a labelled assumption and show how sensitive the answer is to it.
2. **CAC** — total acquisition spend ÷ customers acquired. Include unpaid effort spent on acquisition: founder-led sales, but also writing, launching and answering signups. If cash spend is zero, say so and price the hours — a CAC of $0 is not a finding, it is a missing input.
3. **The ceiling.** LTV > 3× CAC is the line. Invert it: given their LTV, what is the maximum they can pay per customer? That number is the actual output of this exercise — it's what makes a channel viable or not.
4. **Payback period = CAC / (ARPU x gross margin).** Use the same margin-adjusted contribution as step 1, not raw ARPU — the two answers straddle the healthy/unhealthy line. Under 12 is healthy for most; over 18 means they need financing, not a channel.
5. **State the assumptions in a list at the top.** Every number here rests on guesses; hiding them makes the model look more trustworthy than it is.

Write to `06-growth/unit-economics.md`. If the math says the plan doesn't work, say that directly and name which input would have to change.

If the ceiling from step 3 and the payback rule from step 4 disagree, the binding constraint is the lower CAC. State both numbers and say which one you are using — paying exactly the ceiling always implies a payback of lifetime / 3, so any product with churn under about 2.8% will trip this.

Cross-check the inputs against each other before trusting the output. If stated MRR does not reconcile with customers x price, say so — that discrepancy is the first thing a judge will find.
