---
name: shipai-brand
description: The Ship AI "Star fix" visual brand for both sites (Ship AI Studio at shipaistudio.com and the community at shipai.club) — tokens, type, shape, dither scenes, the app-screen illustration kit, logos, CTAs, social images, and the media kit. Use when designing or reviewing any page, component, illustration, social image, or brand asset for Ship AI.
---

# Ship AI brand: Star fix

The source of truth is the brand pack in `studio/docs/brand-pack/` (`SHIP-AI-PARTNERS-BRAND-SYSTEM.md`, then `01-ship-ai-studio-implementation.md`; `02-shipai-club-crossover.md` for the community site). The pack was drawn for "Ship AI Partners": the firm is **Ship AI Studio**, and the pack's Partners lockups, `og-partners` image, and LinkedIn banner ("AI deployments you can underwrite") are never used.

## Names

- Firm: **Ship AI Studio**. Community: **Ship AI** at shipai.club. Wordmark: always "Ship AI" (never ShipAI, SHIP AI, Ship.AI).
- Lockup: the seal + "Ship AI" in Besley 500 as live text + a hairline + "Studio" in Fragment Mono.

## Tokens and type

- Only `--sap-*` tokens (`app/ship-ai-tokens.css`; the bridge maps them to shadcn names). Never hard-code a color, font, or duration that has a token. Override a token at the end of `app/globals.css`, not in the generated tokens file.
- Paper `#F3EFE3`, sheet `#FBF9F3`, banknote ink `#0D241E`, dither green `#1C5544`, bone `#ECE6D3`, night water `#0A1C1F`. **Brass `#8C6A2A` only means "the fix" or "held for you".**
- Besley 400 headlines with exactly one italic key phrase (`.font-key`). Libre Franklin for body and buttons. Fragment Mono only for small labels, data, and metadata — never buttons or sentences. Sentence case, no eyebrows-as-decoration, no all caps.
- Dark mode is real: tokens follow `prefers-color-scheme`, `<html data-mode>` overrides. The dark canvas is banknote green, never black. Night bands (`.sap-night`: FAQ, community line, final CTA) are the only dark field in light mode.

## Shape, depth, motion

- Radius 0 everywhere. Buttons and cards lose one corner at 45° (`.notch`, `.notch-card`). Note: `clip-path` notches clip outlines, so draw focus rings inside (`outline-offset:-3px` on a stretched-link `::after`).
- Flat: only the window shadow and the printed offset. No gradients, glows, or blur (except the sticky header).
- Motion: lock-on and release is the signature; one reveal (12px rise + fade, 600ms, once); scenes ~12fps, paused offscreen, still under reduced motion. Micro-interactions: buttons press to `scale(.97)`, link underlines tighten on hover, card hover lifts the screen 4px and slides a "→" 4px, FAQ "+" rotates to "×". Hover effects only under `(hover:hover) and (pointer:fine)`. Every animation has a `prefers-reduced-motion` off switch. Avoid scroll-driven `animation-timeline: view()` for content that must end fully visible (iOS Safari leaves it half-faded); trigger on reveal instead.

## Illustrations: the app-screen kit

No box-and-arrow chip diagrams. Show the product the way twenty.com does: a branded dither backdrop with a crisp, realistic app screen on top.

- Kit: `studio/components/marketing/vignette/` — `Stage` (dither `Scene` backdrop), `Frame`, `Panel` (app bar with the seal mark and a breadcrumb), `Rows`/`Row`/`Cell`, `Pill` (done / held / wait / live), square `Avatar`, `Btn`, `Toast` (a floating card overlapping the panel), `Pipe`, `Logo`.
- Use **real tool logos** wherever a tool appears (Gmail, Drive, Salesforce, HubSpot, QuickBooks, Slack, Stripe, Zendesk…). Paths come from the `simple-icons` package (CC0) generated into `logo-paths.ts`; Grok from `@lobehub/icons-static-svg` (MIT), USDC from `cryptocurrency-icons` (CC0). Tool logos show what a build runs on — never partners or clients. **Employers stay text, never logos.**
- Every `Window` gets the app bar and soft in-window pills automatically.
- Toasts: on phones they drop below the panel and must be centered (`align-self:center`), never wider than the frame.

## Trust and conversion elements

- CTAs: primary **Book a call / Schedule a call**; secondary always **Contact us**; the free report is a card or text link, not a third button.
- AI assistant logos (ChatGPT, Claude, Gemini, Perplexity, Grok) appear where we talk about being found in AI answers, framed as places a buyer asks, never as partners.
- Footer shows the payment methods actually accepted: Visa, Mastercard, Amex, Discover, Apple Pay, Google Pay, PayPal, Zelle, Stripe, Bitcoin, USDC, ACH, Wire (no ETH).

## Layout rhythm

- Sections: `--sap-section-y` 176px desktop / 112px phone; section heads 72px / 48px below. A bone section meeting a night band splits the gap (half each side).
- Headlines `text-wrap: balance`; paragraphs `text-wrap: pretty`; key phrases `inline-block` on phones; join list separators with a non-breaking space so lines never start with "·".
- Two buttons on phones sit side by side at equal width (`.sap-ctas--pair`).
- Grid and flex children that hold app screens need `min-width:0`, or they push the page wider than the phone.

## Social images and media kit

- OG images: `lib/og-brand.tsx` — paper text column (logo top, title and its line together in the middle, domain bottom) with the dither art on the right half. Titles must fit in two lines.
- Media kit: `shipaistudio.com/media-kit` with assets in `studio/public/media-kit/` (lockups in ink and bone, seal SVGs, avatar, icon, social card, Studio LinkedIn banner, headshot, a zip). Regenerate lockup PNGs by rendering live fonts with Playwright, not by tracing.
