---
name: site-scaffold
description: Scaffold or extend the Next.js marketing site boilerplate — routes, metadata, sections. Use at session 05, Ship the Surface.
---

Work inside the Zero to Launch Next.js boilerplate.

- **Adding a page:** app router directory, `page.jsx`, exported `metadata` with title, description and canonical. Never ship a page without a canonical URL.
- **Adding a section:** keep it a plain component with its own CSS block; match the existing conventions in the file you're editing rather than importing a new styling approach.
- **Metadata:** every route needs title, description, canonical and OG. Run `/og-image` after.
- **Before finishing:** run `npm run build` and confirm the route prerenders. A page that only works in dev is not shipped.

Strip boilerplate the user doesn't need rather than leaving it configured-but-unused.
