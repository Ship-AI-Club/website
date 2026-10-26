---
name: brand-iteration
description: Run a full brand iteration on a marketing site — apply a brand pack, then pass through copy and positioning, spacing and line breaks, illustrations, micro-interactions, navigation, conversion and trust elements, social images and media kit, and a per-page audit, each verified with screenshots, an automated audit, an adversarial review, and tests before shipping. Use when the user asks to apply a brand, rebrand, polish, or "do a pass" on a site (Ship AI Studio, shipai.club, or any similar Next.js marketing site).
---

# Brand iteration

How the Ship AI Studio rebrand ran in Oct 2026, distilled into phases you can repeat on any site. Each phase ends in a shipped, verified state; the owner reviews on their phone between phases and sends screenshots, so ship small and often.

Read first: the site's own CLAUDE.md, the brand pack, and for Ship AI the `shipai-brand`, `shipai-voice`, and site skills (`shipai-studio-site` / `shipai-club-site`).

## Working rules

- **Ship each phase.** Commit, deploy, and verify live before moving on. Batch the owner's mid-flight feedback into the current phase.
- **Verify with evidence**, not by reading code: screenshots at 390 and 1280 (light and dark), `scrollWidth` overflow checks, the bundled audit scripts, the e2e suite.
- **Use the right model.** Sonnet for well-specified bulk passes (a page-by-page spacing sweep, a list of review fixes, a sister site); opus or fable for design, copy, and every adversarial review. Run independent passes in parallel only when they own separate files; tell each agent exactly which files it may touch.
- **Review before shipping anything substantive.** A fresh opus agent reviews the diff adversarially against the spec; verify each finding before fixing. Reviews found real bugs every time (class-name collisions between unrelated components, focus rings clipped by notched corners, false report claims).

## Phases

### 1. Apply the brand pack
Tokens first (generated tokens file plus a bridge to the component library's names), then type, shape (radius, notches), depth (one shadow), dark mode, logos and favicons, social images. Retire everything the pack replaces (old art, parallax, extra libraries). Keep the firm's real name where the pack differs. Phase-split big work: shared primitives first, then page templates.

### 2. Copy and positioning
- Remove hedging: "Example" labels, "this is an example" captions, footer disclaimers. Fictional sample names already read as samples; never claim real clients or results.
- Lead with the firm and what it does differently (a promise strip under the hero; an "agency vs tool vs us" comparison), not the founder. The founder gets About and one supporting line.
- One CTA system: primary "Book a call", secondary "Contact us"; lead magnets as a card or link, not a third button.
- Headlines: two short lines, one italic key phrase; titles and OG images in the same words.

### 3. Spacing and line breaks
- One section rhythm token; section heads with consistent space below; split the gap where a light section meets a dark band.
- `text-wrap: balance` on headings, `pretty` on paragraphs; keep key phrases together on phones; non-breaking spaces around list separators; no single-word last lines in heroes.
- Phones: paired buttons side by side, columns that stack (flows, comparison tables, step lists), nothing wider than the viewport (`min-width:0` on grid/flex children holding wide content).
- Run `scripts/headlines.mjs` and `scripts/check.mjs`; send a fresh reviewer agent full-page strips to catch what scripts miss.

### 4. Illustrations
Replace box-and-chip diagrams with app screens on a branded backdrop (twenty.com style): a dither or brand-art stage, a crisp panel with an app bar, table rows, avatars, status pills, one floating toast for depth, and real tool logos (simple-icons and similar open-license sets). Restyle the shared window/frame component so every existing sample upgrades at once. Check them on phones: centered toasts, no clipping, no overflow.

### 5. Micro-interactions
Button press, link underline, card hover lift with a sliding arrow and a whole-card stretched link, FAQ toggle rotation, focus rings drawn inside clipped shapes, toasts and held states that animate in on reveal. Hover only on fine pointers; everything off under reduced motion. Verify computed transforms in a real browser (Playwright), not just in CSS.

### 6. Navigation
Full-width mega menu with icon tiles and one featured card per menu, height under ~70vh, keyboard support kept (Escape, arrows, focus return); an icon theme toggle; "Contact us" + primary CTA in the header; a phone menu button with an icon.

### 7. Conversion and trust
A lead-magnet section with what's inside, the form, and a realistic preview of the result; recognizable logos where they're true (AI assistants for visibility, tools a build runs on, the payment methods actually accepted). Ask the owner which payment methods they accept before showing any. Make the lead magnet's actual output match what the page promises, and test that logic against real inputs (an adversarial review plus scenario runs plus live sites).

### 8. Social images and media kit
OG images with a wide text column, the title in two lines, the description right under it. A media kit page: boilerplate in three lengths with copy buttons, quick facts, founder bio and headshot (check real pixel sizes), logos in light and dark (render lockups from live fonts), colors and type, do/don't rules, a zip.

### 9. Per-page audit
Sweep every page at 390, 1280, and 1440 with `scripts/check.mjs` (gaps, overflow) and `scripts/edge.mjs` (text touching edges), fix root causes in shared CSS, then screenshot the worst pages before and after. Sonnet does this well with a precise brief.

### 10. Document
Update the site's CLAUDE.md, the brand and site skills, and memory with decisions the owner made (they're the rules for next time).

## Scripts

Run from the site's project folder (they load Playwright from it) against a running server:

```bash
BASE_URL=http://127.0.0.1:3300 node <skill>/scripts/check.mjs /,/pricing,/about 390,1280
BASE_URL=http://127.0.0.1:3300 node <skill>/scripts/edge.mjs /pricing,/about 390,1280
BASE_URL=http://127.0.0.1:3300 node <skill>/scripts/headlines.mjs /pricing /about
```

- `check.mjs`: horizontal overflow and section/sibling gaps that are too small or too large (dither art can false-positive).
- `edge.mjs`: text closer than 10px to its box edge.
- `headlines.mjs`: headings whose last line is a short orphan, plus outsized section gaps, at phone and desktop.
