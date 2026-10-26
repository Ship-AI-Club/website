---
name: brand-iteration
description: Iterate a freshly rebranded marketing site from "brand applied" to polished, in the rounds Ship AI Studio went through in Oct 2026 — line breaks and phone layout, de-hedged copy, app-screen illustrations with real logos, micro-interactions, navigation, firm-first positioning, lead magnet and trust elements, social images, premium whitespace, making the lead magnet's output match its promise, a per-page sweep, a media kit, and codifying it all. Use after a rebrand lands (or when the owner starts sending "this looks off" screenshots) on Ship AI Studio, shipai.club, or any similar marketing site.
---

# Brand iteration

The brand pack is applied and live. The site is on-brand but not yet good. This skill is the loop that took shipaistudio.com from that point to finished, in the order it happened. Re-run the rounds on any site that just rebranded; skip rounds that don't apply.

Read first: the site's CLAUDE.md, and for Ship AI the `shipai-brand`, `shipai-voice`, and site skills (`shipai-studio-site` / `shipai-club-site`).

## How the loop works

- **The owner reviews on their phone and sends screenshots with short notes.** Treat each note as a pattern, not a one-off: fix the instance, then find every other place the same problem appears and fix those too.
- **Ship every round.** Commit, deploy, verify live (curl + a phone-size screenshot). Fold new notes that arrive mid-round into the current round.
- **Evidence over assumption.** Screenshots at 390 and 1280, light and dark; `scrollWidth` overflow checks; the bundled audit scripts; the e2e suite; computed styles from a real browser for interactions.
- **Models.** Sonnet for well-specified sweeps (every page's spacing, a list of review fixes, the sister site); opus or fable for design, copy, and every review. Parallel agents only when they own separate files; name the files each may touch.
- **Review before calling anything done.** A fresh opus agent reviews the diff adversarially; verify each finding. Every review in this project found real defects.

## Reading terse feedback

| The owner says | What it meant | What fixed it |
|---|---|---|
| "should be two lines" / "padding top is off" | One element, but the pattern repeats | Fix it, then sweep every page for the same thing |
| "unnecessary" / "playing it way too safe" | Hedging copy | Remove "Example" labels, captions, footer disclaimers |
| "too noisy, not illustrative" / "little box diagrams" | Diagrams made of chips and arrows | App screens on a branded backdrop, real logos |
| "microinteractions are lacking" | Static UI | Press, hover lift, sliding arrows, toggles, reveal-triggered states |
| "too heavy on the founder" / "lost our identity" | Founder-led copy | Lead with what the firm does differently; founder in one line |
| "too tight" / "bleed together" | Cramped spacing or merged lines | More gap, separate lines, check phones |
| "more premium whitespace" | Global rhythm too small | Raise the section rhythm token, not one-off margins |
| "not centered" / "can't be seen well" | Phone-only layout bug | Check the phone layout of that component everywhere |
| "doesn't read well" (OG image) | Text column too narrow | Wider column, two-line title, description right under it |
| "logos where possible" / "would boost" | Trust signals wanted | Real logos only where true; ask before claiming (e.g. payment methods) |

## Rounds

### 1. Line breaks and phone layout
Two-line hero headline with the italic key phrase on its own line; `text-wrap: balance` on headings and `pretty` on paragraphs; key phrases kept together on phones; non-breaking spaces so lines never start with "·"; smaller phone hero type so no word sits alone; paired hero buttons side by side at equal width on phones; dark bands keep their top padding after a light section.

### 2. Cut hedging and noise
Delete "Example" tags, "this one is an example" captions, and footer disclaimers. Fictional sample names already read as samples; never claim real clients. Redraw the busiest diagram as a simple before/after (today vs after, two big numbers). Update CLAUDE.md and memory so hedging doesn't creep back.

### 3. Illustrations with real logos
Build a small kit: a branded stage (dither art), an app panel with an app bar and breadcrumb, table rows, square avatars, status pills, one floating toast, real tool logos from simple-icons and similar open-license sets. Replace product cards, hero windows, flows, and sample screens. Restyle the shared window component so every existing sample upgrades at once. On phones, toasts drop below the panel, centered, never wider than it.

### 4. Micro-interactions
Buttons press to `scale(.97)`; underlines tighten on hover; link cards lift 4px with a sliding arrow and a whole-card stretched link; FAQ "+" rotates to "×"; held rows, arrows, and toasts animate in when revealed. Hover only on fine pointers; everything off under reduced motion. Don't use scroll-driven `view()` timelines for content that must end fully visible (iOS Safari leaves it half-faded). Focus rings go inside notched shapes (`clip-path` hides outer outlines).

### 5. Navigation
Full-width mega menu with icon tiles and a featured card per menu, under ~70vh, keyboard behavior intact; an icon theme toggle; "Contact us" as the secondary CTA in the header and every hero; a phone menu button with an icon that turns into an ×. Watch for class-name collisions between header and page components.

### 6. Firm-first positioning
Replace the founder strip with a promise strip ("An AI deployment partner. Not an agency, not a tool…" plus four facts) and the founder section with an "agency vs tool vs us" comparison, keeping one founder line linking to About. The founder's career lives on About.

### 7. Phone-screenshot fixes
Work through the owner's screenshots one by one, then sweep: tight tables, footer forms, uncentered toasts, cards wider than the viewport (`min-width:0` on grid and flex children holding app screens).

### 8. Lead magnet and trust
A dedicated lead-magnet section (what's inside, the form, a realistic preview of the result) and a hero card that says why it's valuable. Recognizable logos where true: the AI assistants buyers ask (ChatGPT, Claude, Gemini, Perplexity, Grok), the payment methods actually accepted (ask first), the tools builds run on. Never employers as logos.

### 9. Social image and title
OG image with a wide text column, two-line title, description right under it, logo top, domain bottom; replace stale page titles.

### 10. Premium whitespace
Raise the global section rhythm (here 112 → 176px desktop, 76 → 112px phone) and the space under section heads, then fix the boundaries that double up (light section meeting a dark band gets half on each side).

### 11. Make the lead magnet deliver what it promises
Refocus the tool's actual output on the promise (here: SEO, AEO, GEO, and ASO when there's an app), then test it three ways: an adversarial review of the logic, scenario runs through the real functions (a throwaway script, deleted after), and live calls against varied real sites (blocking sites, sites with apps, profile pages). Fix what they find, retest, ship.

### 12. Per-page sweep
A sonnet agent walks every page at 390, 1280, and 1440 with the bundled scripts, fixes root causes in shared CSS, and screenshots before and after. Turn list rows into cards where the owner wants cards (blog index).

### 13. Media kit
Boilerplate in three lengths with copy buttons, quick facts, founder bio and headshot (check real pixel sizes), logos in light and dark rendered from live fonts, colors and type, do/don't rules, a zip, a footer link.

### 14. Codify
Update CLAUDE.md, the brand and site skills, and memory with every decision the owner made; copy the skills into each repo's `.claude/skills/`; run the same rounds on the sister site.

## Scripts

Run from the site's project folder (they load Playwright from it) against a running server:

```bash
BASE_URL=http://127.0.0.1:3300 node .claude/skills/brand-iteration/scripts/check.mjs /,/pricing,/about 390,1280
BASE_URL=http://127.0.0.1:3300 node .claude/skills/brand-iteration/scripts/edge.mjs /pricing,/about 390,1280
BASE_URL=http://127.0.0.1:3300 node .claude/skills/brand-iteration/scripts/headlines.mjs /pricing /about
```

- `check.mjs`: horizontal overflow and gaps between sections and siblings that are too small or too large (dither art can false-positive).
- `edge.mjs`: text closer than 10px to its box edge.
- `headlines.mjs`: headings with a short orphan last line, plus outsized gaps, at phone and desktop.
