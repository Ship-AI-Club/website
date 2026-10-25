# Native skill showcase inventory

Review-only implementation. No deployment or live database calls were made. Real bounded native generation is documented separately in fx-native-execution-audit.md.

All 20 program decks and 18 private workshop decks have ready-to-run fixed exercises. Registry: `lib/fx-showcase-registry.js`. Exact source files and terminal commands: `docs/fx-showcase-inventory.json`.

| Program deck | Actual skill files | Existing terminal commands |
|---|---|---|
| program:day-zero:first-threads | skill-writer, brand-voice, meeting-notes | cat SKILL.md; /skill-creator; /meeting-notes |
| program:day-zero:coworking-with-ai | content-calendar, weekly-report, icp-builder, outbound-sequence, social-post | /content-calendar; /weekly-report; /icp-builder  →  /outbound-sequence |
| program:day-zero:first-deploy | site-structure, landing-copy, site-scaffold, content-map, programmatic-pages, og-image, perf-pass | npm i -g @anthropic-ai/claude-code  &&  claude; /site-scaffold  →  /landing-copy  →  /og-image; /content-map  →  /programmatic-pages  →  deploy |
| program:day-zero:agentic-workflows | support-agent, scheduled-workflow, content-repurpose | git fetch  &&  git switch night-shift; /support-agent; /scheduled-workflow |
| program:the-first-build:vibe-coding-foundations | build-brief | Ask the agent: map this project before you edit it; git status  →  git diff  →  npm run build  →  git commit |
| program:the-first-build:full-stack-building-blocks | feature-contract | POST /api/ideas  { \"title\": \"Repair notes\" }; create  →  inspect row  →  update  →  delete; git push  →  checks  →  deploy  →  inspect logs |
| program:the-first-build:agentic-engineering | engineering-review | Create project instructions from this repository; typecheck  →  lint  →  test  →  build  →  browser; review diff  →  verify live path  →  commit |
| program:the-first-build:first-build-hackathon | demo-review | write brief  →  name risk  →  create checkpoint; slice 1  →  check  →  browser  →  commit; deploy freeze  →  final run  →  tag release |
| program:zero-to-launch:gtm-engineering | ask-santos, gtm-map, funnel-audit |  |
| program:zero-to-launch:b2c-ggbucks-case-study | channel-plan, paid-test, community-plan, analytics-wire, bi-agent, seo-audit, programmatic-seo | /seo-audit  →  /programmatic-seo; /channel-plan |
| program:zero-to-launch:b2b-pipeline-sales | icp-builder, outbound-sequence, funnel-metrics, bi-agent | /icp-builder; /outbound-sequence  →  /funnel-metrics |
| program:zero-to-launch:positioning-and-pitch | positioning-brief, pitch-doctor | /positioning-brief; /pitch-doctor |
| program:zero-to-launch:marketing-site | site-structure, landing-copy, site-scaffold, og-image, perf-pass, content-map, programmatic-pages, article-draft, social-audit, social-profile, copywriting, copy-editing, cro |  |
| program:zero-to-launch:growth-engineering | social-automation, social-post, content-repurpose, ship-announcement, paid-basics, paid-test, unit-economics, pricing-model, launch-checklist | /social-automation  →  /unit-economics  →  /paid-basics |
| program:growth-loops:measure-what-matters | measurement-contract | complete journey  →  inspect payload  →  find user; save taxonomy  →  validation log  →  scorecard |
| program:growth-loops:activation | activation-plan | compare first-7-day behaviors  →  week-4 return; baseline  →  ship change  →  replay events |
| program:growth-loops:engagement | engagement-plan | define active = eligible account + core action + window; retained cohort  vs  slipping cohort; ship next-value path  →  inspect eligible journey |
| program:growth-loops:retention | retention-plan | define  →  cohort  →  segment  →  triangulate |
| program:growth-loops:churn-and-reengagement | churn-review | classify last 20 losses by evidence; build risk cohort  →  trigger  →  holdout  →  verify exits |
| program:growth-loops:compound-the-loop | growth-experiment | model input  →  value  →  output  →  re-entry; launch  →  replay turn  →  inspect events  →  decide |

All workshop exercise SKILL.md files and references are first-party Ship AI authoring under `content/workshop-skills/<slug>/`; no third-party integration is implied. Program workflow gaps are explicitly authored under `content/program-skills/`. The existing skill-creator terminal is represented by the bundled local skill-writer; meeting-notes now has its own genuine first-party file. Shell/build/deploy terminal commands remain instructional context, not runtime tools.

Integration: server import `loadFxShowcaseConfig` from `lib/fx-showcase-config.js`; await it with `program:<program>:<session>` or `workshop:<slug>`, then pass the returned safe metadata to `<FxDeckShowcase config={config} />`. The helper and endpoint check private attendee access before loading skill sources. No private module enters client imports or public assets.

Runtime: libfx 0.0.12, native backend, openai/gpt-4.1-nano. One host tool: read_brief, supplying fixed fictional data. Real NDJSON text, guide context, tool-start/tool-end, done and error events; Stop aborts the request and model transport. Every source download rechecks workshop access. Download paths match a bundled file inventory; arbitrary paths are rejected.

Budget: existing and new APIs share 30 public/attendee runs per day and six per visitor; verified workshop hosts share 60 rehearsal/presentation runs per day with 20 per host, 15-second per-person cooldown, and a combined maximum of 90 runs. Each run has at most three model calls, 512 output tokens per call, 25-second transport timeout and 40-second overall timeout. Development shares a 12-run session budget and a concurrency lock. Limit counters may consume a visitor slot when the global bucket is exhausted, but never exceed caps. The old marketing API and its three presets are retained.

Validation: `node --test tests/fx-showcase.test.mjs` exercises genuine file mappings, native adapter loading without generation, denied-access ordering, verified-host identity, safe metadata and private source isolation. No live generation or DB writes in these tests.

The native adapter fixture test loads every unique mapped source, including upstream marketing references, and verifies the references appear in the instruction context. All 18 workshop exercise skills were written from the public fictional fixture and task descriptions; facilitator notes were not imported or read to generate them.
