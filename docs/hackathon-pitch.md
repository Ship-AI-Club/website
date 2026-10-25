# Zero to Launch pitch and submission

The public reference lives at `/programs/zero-to-launch/hackathon/pitch`.
The complete fictional Porchlight example lives at the same path plus `/demo`.
Use `?view=all` to review all four slides together. Its frame, hierarchy, timing,
and footer follow the final Zero to Launch deck. Its colors, fonts, logo, and
illustration come from the original Porchlight workshop website.
It has four slides and five minutes of speaking time:

| Section | Time |
| --- | --- |
| Who you are and what your business does | 0:00–0:45 |
| Strategic positioning | 0:45–1:45 |
| Ideal customer | 1:45–2:45 |
| Marketing website, design decisions, and shipped work | 2:45–5:00 |

Decks are optional. Teams can use their own slides, generate a draft, or prepare
their pitch later. New entries default to preparing it later. The optional
custom deck URL is stored in `submissions.pitch.deck_url`, with the choice in
`submissions.pitch.mode`. Judges and admins can open a team's custom deck.
No deck URL or generated answer is required to submit. Existing pitch answers
and branding survive switching choices; older clients preserve the saved choice.

Teams save their business description and three optional pitch answers on
`/dashboard/submission?team=<id>`. The deck at
`/dashboard/submission/pitch?team=<id>` uses those saved answers and team member
names. Membership is checked on the server. Member emails never enter the deck.
Missing answers remain visible prompts. Assembly needs no AI service or credits.

Choosing the generator reveals the optional **Prefill from website** control. It reads the submitted public page,
up to four stylesheets, and checks the chosen logo, image, and font resources.
It proposes business answers plus a brand guide for review. The participant
selects which answers to apply, can adjust the three palette colors, and saves
normally. Existing answers are unchecked by default. The selected brand is
stored in `submissions.pitch.brand` and feeds the generated deck. **Use Ship AI
styling** clears it. Missing assets fall back to the common deck styling.

The reader permits only public HTTP/HTTPS sites on standard ports, validates
all DNS results and redirect targets, and pins each request to checked public
addresses. Content sizes, redirects, and time are bounded. It never runs page
scripts or sends account/session credentials to the website. Text, CSS labels,
and asset descriptions are untrusted AI input. The model can select colors
only from the supplied palette. Unsupported claims stay empty or clearly
suggested, and shipped work/receipts are never prefilled.

Prefill uses the existing AI Gateway configuration when available. Metadata and
brand extraction still work without AI. Atomic daily caps are six prefill
attempts per account and 100 across the site. The optional model override is
`PITCH_PREFILL_MODEL`. Website text is not stored. The selected public brand
asset and font URLs are stored with the entry and loaded by the browser.

Speaker notes include the walkthrough timing, shipped work, and receipts.
The outline download is editable Markdown. Print / PDF exports four slides.
Teams can still open their saved pitch after submissions close.

Entry requirements stay project name, live marketing site URL, and receipts.
Pitch prompts and the repository are optional. Partial drafts are allowed.
Final entries stay submitted when updated, including from a stale draft tab.
The first saved pitch adds the `submissions.pitch` JSONB column idempotently;
the same additive migration is included in `lib/schema.sql`.

Verification: `tests/hackathon-pitch.test.mjs`, `tests/submissions.test.mjs`, and
the submission cases in `tests/team-membership.test.mjs`. The latter uses an
isolated local PostgreSQL database, with all email delivery intercepted.
