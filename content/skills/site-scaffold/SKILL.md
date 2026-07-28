---
name: site-scaffold
description: Scaffold or extend a Next.js marketing site — routes, metadata, sections. Use when the copy needs somewhere to live.
---

Get the marketing site running on a real URL.

1. **Check what exists.** If there is no `app/` directory, scaffold one: `app/layout.jsx`, `app/page.jsx`, `app/globals.css`. If the project is not Next at all, say so and stop rather than converting it mid-session.
2. **Set `metadataBase` in the root layout.** Without it every canonical and Open Graph URL resolves against `localhost` — the build looks correct and every shared link is broken in production. This is the single most common silent failure on a launched site.
3. **Per route, export `metadata`** with title, description and canonical.
4. **Global styles before component styles.** `app/globals.css` sets `color-scheme`, background and foreground. Component-scoped styles alone leave nowhere to put a reset, and a page with no declared background renders dark text on a dark background for anyone in dark mode. Check it in both.
5. **Match the file's existing conventions** for everything else. Do not import a new styling approach into a project that already has one.
6. **Delete what the new routes supersede**, and list the deletions in your summary. Dead components that still contain the old copy are how the old copy gets shipped.
7. **Verify:** the build passes, the page renders at 375px as well as on a desktop, and every link in the nav resolves.

Note the routes you created and their metadata in `05-site/scaffold.md`, then run `/og-image`.
