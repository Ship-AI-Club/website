---
name: ask-santos
description: Find the right skill — Zero to Launch or Day Zero — for what you're actually trying to do. Use when someone describes a go-to-market problem in their own words, asks "where do I start", "what should I run", or doesn't know which skill applies.
---

Route the user to the right skill. Answer in three lines, not an essay.

**Don't ask them to fill in a form.** Read the repo first — README, site, `01-roadmap/` … `06-growth/` for Zero to Launch, `01-voice/` … `04-agents/` for Day Zero — and infer what stage they're at. Ask at most one question, and only if the answer changes which skill you'd name.

## The map

| If they're trying to… | Run | Session |
|---|---|---|
| Work out the plan at all | `/gtm-map` | 01 |
| Find where the funnel leaks | `/funnel-audit` | 01 |
| Pick a first acquisition channel | `/channel-plan` | 02 |
| Spend money on ads without wasting it | `/paid-test` | 02 |
| Turn users into people who bring users | `/community-plan` | 02 |
| Actually measure anything | `/analytics-wire` | 02 |
| Get told weekly what moved | `/bi-agent` | 02 · 03 |
| Sell to companies, not people | `/icp-builder` | 03 |
| Write outbound that gets replies | `/outbound-sequence` | 03 |
| Track a B2B pipeline | `/funnel-metrics` | 03 |
| Say why anyone should pick them | `/positioning-brief` | 04 |
| Say it out loud in 60 seconds | `/pitch-doctor` | 04 |
| Plan the site | `/site-structure` | 05 |
| Write the site | `/landing-copy` | 05 |
| Build the site | `/site-scaffold` | 05 |
| Make links preview properly | `/og-image` | 05 |
| Make the site fast | `/perf-pass` | 05 |
| Decide what pages to write | `/content-map` | 05 |
| Generate a lot of pages | `/programmatic-pages` | 05 |
| Write one good article | `/article-draft` | 05 |
| Find what their profiles say about them | `/social-audit` | 05 |
| Fix one profile | `/social-profile` | 05 |
| Write the post for something they shipped | `/social-post` | 06 |
| Get more than one post out of one article | `/content-repurpose` | 06 |
| Tell people the thing is live | `/ship-announcement` | 06 |
| Post without remembering to | `/social-automation` | 06 |
| Run ads properly | `/paid-basics` | 06 |
| Know the most they can pay per customer | `/unit-economics` | 06 |
| Decide what to charge | `/pricing-model` | 06 |
| Not break anything on launch day | `/launch-checklist` | weekend |

## The map, Day Zero

Earlier in the story: someone still working out how to get real work out of a chat window. Same skills library, different starting point.

| If they're trying to… | Run | Session |
|---|---|---|
| Stop re-explaining the same thing every thread | `/skill-writer` | Day Zero 01 |
| Sound like themselves and not like a model | `/brand-voice` | Day Zero 01 |
| Say who actually pays and who to turn away | `/icp-profile` | Day Zero 01 |
| Know what to post for the next four weeks | `/content-calendar` | Day Zero 02 |
| Get the numbers without opening a dashboard | `/weekly-report` | Day Zero 02 |
| Turn one shipped thing into posts | `/social-post` | Day Zero 02 |
| Cut one article into several posts | `/content-repurpose` | Day Zero 04 |
| Answer the same customer question at 2am | `/support-agent` | Day Zero 04 |
| Have work happen on a schedule, not a nudge | `/scheduled-workflow` | Day Zero 04 |

Day Zero reuses the rest: `/positioning-brief` and `/article-draft` in 01, `/icp-builder` and `/outbound-sequence` in 02, the whole site set (`/site-structure`, `/landing-copy`, `/site-scaffold`, `/content-map`, `/programmatic-pages`, `/og-image`, `/perf-pass`) in 03. Those skills name Zero to Launch folders in their output paths — tell them the Day Zero folder instead (`01-voice/`, `02-routines/`, `03-site/`, `04-agents/`) rather than editing the skill.

## Rules

1. **Name one skill.** If two apply, name the one that unblocks the other and say what comes after it. A list of six is the same as no answer.
2. **Check the input exists.** Most skills read something an earlier one wrote. If `/landing-copy` needs `04-positioning/README.md` and it isn't there, send them to `/positioning-brief` first and say why in one sentence.
3. **Order is load-bearing in exactly one place:** positioning before site. Everywhere else, let them start where their problem is. Nobody has to do this in sequence.
4. **If nothing fits, say so.** Not every problem is a skill. "That's a product decision, not a GTM one" is a valid answer and a better one than a bad match.

## Format

```
Run /positioning-brief.

You have a site and 41 signups but nothing written down about who it's for,
so every page is guessing. Then /landing-copy once that file exists.
```

That's it. Three lines: what to run, why it's that one, what follows.
