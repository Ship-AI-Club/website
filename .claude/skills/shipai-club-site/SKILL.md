---
name: shipai-club-site
description: Work safely on the Ship AI community site (shipai/site, live at shipai.club) — repo rules, what must never be run, how to preview and ship. Use before changing or shipping anything on shipai.club.
---

# Ship AI community site (shipai.club)

Next.js 15, JavaScript/JSX, at `/Users/santos/shipai/site`. Voice: the `shipai-voice` skill (community register). Visuals: the `shipai-brand` skill and `studio/docs/brand-pack/02-shipai-club-crossover.md`. People and roles: `community-roles`.

## Never run

- `npm run build`, `npm run migrate`, or any prebuild/postbuild script — they write to the production database and Blob store.
- Anything that writes to a database or Blob storage. Do not edit `.env` files or copy secrets from other repos.

Instead build with `npx next build` and serve with `npx next start -p <port>` (pick a free port; kill it after).

## Content and data

- Programs, sessions, and dates: `site/lib/hackathon.js` and the program files under `site/lib/` are the source of truth (read `eventTitle` fields, not memory).
- Meetup events come from the live iCal feed; Discord, never Telegram.
- Ask before deleting routes, pages, or functional dependencies. Workshop cover images live in admin content, not the repo.

## Ship

Commit to `main` and push: the Vercel project "v0-ship-ai-landing-page" (desic team) auto-deploys on push. Verify the live site after the deploy finishes (check the CSS for the Star fix tokens: `F3EFE3`, `0D241E`, Besley, Franklin).
