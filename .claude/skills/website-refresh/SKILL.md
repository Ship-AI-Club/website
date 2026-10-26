---
name: website-refresh
description: Refresh a marketing website to a polished, premium standard in as few passes as possible — a definition of done for graphics and illustrations, spacing and whitespace, card usage, type and line breaks, phone layout, interactions, navigation, conversion and trust elements, social images, and lead-magnet logic, plus the verification gates and audit scripts. Distilled from the many feedback rounds of the Oct 2026 Ship AI Studio refresh. Use for any site refresh, redesign, rebrand follow-up, or "polish pass", for Ship AI or anyone else. Brand-specific rules stay in the brand's own skill (for Ship AI: shipai-brand, shipai-voice).
---

# Website refresh

A rebrand once took a dozen feedback rounds to reach "done": two-line headlines, then hedging copy, then box diagrams, then interactions, then menus, then whitespace, then cards, each found by the owner on a phone. This skill front-loads all of it. **Apply every standard below in the first pass**, verify against the gates, and the owner's review becomes taste, not defect-hunting.

Brand rules (colors, type, voice, logos) come from the brand's own skill and pack; this skill is the craft layer that sits on top of any brand. Reference build: shipaistudio.com (`shipai/studio`), especially `components/marketing/vignette/` (illustration kit), `micro.css` (interactions), `header.css` (mega menu), the rhythm rules at the bottom of `app/globals.css`, and `blog-cards.css`.

## Definition of done

### 1. Copy confidence
- No hedging: no "Example" tags or captions, no "this is an example", no footer disclaimers about illustrative data or former employers. Fictional sample names already read as samples. Never claim a real client or result.
- Lead with the company and what it does differently (a promise strip under the hero: one positioning line plus three or four short facts; a comparison against the alternatives). The founder gets About and one supporting line.
- One CTA system everywhere: a primary action, a consistent secondary ("Contact us"), and the lead magnet as a card or text link, never a third button.
- Never claim something the product, report, or page doesn't actually do or measure.

### 2. Type and line breaks
- Hero headlines: two short lines, one emphasized key phrase on its own line, sized so no word sits alone on phones.
- `text-wrap: balance` on headings, `pretty` on paragraphs; key phrases `inline-block` on phones; join list separators with a non-breaking space so a line never starts with "·" or "|".
- Mono or label type only for small labels and data, never for sentences, buttons, or footnotes people must read.

### 3. Spacing and whitespace
- Premium rhythm from one token: about 176px between sections on desktop and 112px on phones; about 72px (48px phones) under section heads; 22px between a heading and its lede.
- Where a light section meets a dark band, split the gap (half each side) so it doesn't double.
- Floating hero windows never overlap the next section; blocks in one section share the container width or sit deliberately narrower and centered.
- Nothing touches an edge: text at least 10–12px from its box; hint text 12–14px below the control it explains.

### 4. Phone layout
- No horizontal scroll at 320 and 390 (`scrollWidth` equals the viewport). Grid and flex children that hold wide content get `min-width:0`.
- Two buttons sit side by side at equal width; three or more stack.
- Tables become stacked cards; flows with arrows become vertical lists; logo rows fit one line or are an intentional grid, never four plus one orphan.
- Floating elements drop below their parent, centered, never wider than it.
- The menu button has an icon (three lines that turn into an ×).

### 5. Graphics and illustrations
- No box-and-arrow chip diagrams. Show the product: a branded backdrop (the brand's art, dither, or texture) with a crisp, realistic app screen on top — an app bar with breadcrumb, table rows, avatars, status pills — plus one floating card for depth (twenty.com is the model).
- Use real logos wherever a real tool appears (open-license sets such as simple-icons). Logos say what something runs on, never imply partners or clients; never show former employers as logos.
- One shared window/frame component, so restyling it upgrades every sample at once.
- Before/after beats a dense diagram: "today" vs "after" columns and two big numbers.

### 6. Cards
- Any list of linkable items (articles, products, programs, case studies) is a card grid, not rows: 3 columns desktop, 2 tablet, 1 phone.
- Card anatomy: cover art (16:9), a small label, the title with a "→", a two-line clamped excerpt, a meta row. The whole card is one stretched link; no nested links.
- Every card in a row has the same structure and height; related-content blocks reuse the same card in a 2-column variant.

### 7. Interactions
- Buttons press to `scale(.97)`; link underlines tighten on hover; link cards lift ~4px with the arrow sliding 4px; accordions rotate "+" into "×"; key states animate in once when revealed.
- Hover effects only under `(hover:hover) and (pointer:fine)`; every animation off under `prefers-reduced-motion`.
- Visible focus everywhere. If a shape is clipped (`clip-path`, notches), draw the ring inside it.
- Don't use scroll-driven `animation-timeline: view()` for anything that must end fully visible (iOS Safari leaves it half-faded); trigger on reveal instead.

### 8. Navigation
- Full-width mega menu: columns of items with icon tiles, one featured card per menu, height under ~70vh, keyboard support (Escape returns focus, arrow keys move), outside click closes.
- Header tools: an icon theme toggle (not a text button), the secondary CTA, the primary CTA. Check the header fits from 1040px up.
- Never reuse a header class name for page components.

### 9. Conversion and trust
- A dedicated lead-magnet section: what's inside, the form, and a realistic preview of the result; plus a compact card in the hero that says why it's valuable in one sentence.
- Recognizable logos only where true: the platforms the offer is about (e.g. AI assistants for visibility), the payment methods actually accepted (ask the owner first), the tools a build runs on.
- The lead magnet's real output must match the promise. Test it three ways before launch: an adversarial review of the logic, scenario runs through the real functions, and live runs against varied real inputs (sites that block bots, edge cases, profile pages).

### 10. Social and press
- OG image: a wide text column, the title in two lines, the description directly under it, logo at the top, domain at the bottom, art on the other half; page titles match the current positioning.
- A media kit page: boilerplate in three lengths with copy buttons, quick facts, founder bio and headshot (check real pixel sizes), logos for light and dark (render lockups from live fonts), colors and type, do/don't rules, a zip, a footer link.

## Process

1. **Audit first.** Screenshot every page at 390 and 1280 (light and dark) and run the scripts below. List violations of the definition of done per page.
2. **Fix shared root causes before page hacks** (rhythm tokens, the window component, card component, header).
3. **Delegate sweeps.** A sonnet agent can take "every page meets sections 2–4" with a precise brief and file ownership; keep design, copy, and illustration work on a stronger model.
4. **Gates before shipping:** no overflow, scripts clean, screenshots reviewed, e2e green, an adversarial review by a fresh opus agent with each finding verified.
5. **Ship and verify live** (curl plus a phone-size screenshot), then hand the owner the phone view.
6. **Write down every new owner decision** in the brand skill, CLAUDE.md, or memory, so the next refresh starts from it.

## Reading terse feedback

| The owner says | It means | Do this, everywhere it applies |
|---|---|---|
| "should be two lines" / "padding is off" | One instance of a repeated pattern | Fix it, then sweep every page for the same thing |
| "unnecessary" / "playing it too safe" | Hedging copy | Section 1 |
| "too noisy" / "little box diagrams" | Chip diagrams | Section 5 |
| "should be more cards" | Rows where cards belong | Section 6 |
| "microinteractions are lacking" | Static UI | Section 7 |
| "too heavy on the founder" | Founder-led copy | Section 1 positioning |
| "too tight" / "bleeds together" | Cramped or merged | Sections 3 and 4 |
| "more premium whitespace" | Rhythm too small | Raise the rhythm token, not one-off margins |
| "not centered" / "can't be seen" on a phone | Phone-only layout bug | Section 4, then check the same component everywhere |
| "doesn't read well" (OG) | Text column too narrow | Section 10 |
| "logos would boost" | Trust signals wanted | Section 9, only where true |

## Scripts

Run from the site's project folder (they load Playwright from it) against a running server:

```bash
BASE_URL=http://127.0.0.1:3300 node .claude/skills/website-refresh/scripts/check.mjs /,/pricing,/about 390,1280
BASE_URL=http://127.0.0.1:3300 node .claude/skills/website-refresh/scripts/edge.mjs /pricing,/about 390,1280
BASE_URL=http://127.0.0.1:3300 node .claude/skills/website-refresh/scripts/headlines.mjs /pricing /about
```

- `check.mjs`: horizontal overflow and gaps between sections and siblings that are too small or too large (art bands can false-positive).
- `edge.mjs`: text closer than 10px to its box edge.
- `headlines.mjs`: headings with a short orphan last line, plus outsized gaps, at phone and desktop.
