# shipai.club

<img src="https://www.shipai.club/og-image.jpg" alt="Ship AI" width="480" />

Marketing site for [Ship AI](https://www.shipai.club) — a community of AI craftspeople in Phoenix. Demos over memos.

Next.js (app router), plain CSS, Geist. Upcoming events are pulled live from the Meetup iCal feed (`lib/meetup.js`, revalidated hourly).

```bash
npm install
npm run dev
```

## Zero to Launch session kits

Each of the six workshops publishes a deck, a follow-along guide and its skill files:

| What | Source | Route |
| --- | --- | --- |
| Slides | `lib/decks.js` | `/programs/<program>/<slug>/deck` |
| Guide | `lib/guides.js` | `/programs/<program>/<slug>/guide` |
| Skills | `content/skills/<name>/SKILL.md` | `/programs/<program>/skills` |

`scripts/build-kits.mjs` runs as `prebuild` (and `predev`) and generates the downloads —
per-session and full-set zips into `public/skills/`, guide markdown into `public/guides/`,
and `lib/skills.generated.json`, which the pages render from. All three are gitignored;
they are rebuilt from source on every build, so a download can never drift from the
skill file the site describes.

The skills are vendored here from the planning repo. To pull in changes:

```bash
npm run sync-skills
```

## Accounts

One account carries a person through the whole program: registering, forming a team,
submitting a project, asking to sponsor/mentor/judge, scoring as a judge, and collecting the
certification afterwards. Sign-in is an emailed six-digit code — there are no passwords in
the system, so there are none to leak, reset or store.

| Surface | Route | Who |
| --- | --- | --- |
| Sign in | `/login`, `/auth/verify` | anyone |
| Onboarding | `/onboarding` | first sign-in |
| Dashboard | `/dashboard` | signed in |
| Team | `/dashboard/team` | signed in |
| Submission | `/dashboard/submission` | signed in |
| Certificates | `/dashboard/certificates` | signed in |
| Requests | `/dashboard/requests` | signed in |
| Teams you mentor | `/dashboard/mentoring` | mentors |
| Scorecards | `/judge`, `/judge/<id>` | judges |
| Administration | `/admin/*` | admins |

**Auth.** `lib/auth.js`. A code is six digits, good for ten minutes, single-use, five
attempts; the same row carries a magic-link token so either path consumes it. Codes, link
tokens and session tokens are all stored as sha-256 hashes of `AUTH_SECRET + value` — a
database dump hands over no live sessions. Sessions are opaque 32-byte tokens in an httpOnly
cookie, 30 days, revocable per device from `/dashboard/profile`. Requests are throttled per
address and per IP.

Email links open a confirmation form before signing in. Loading or scanning a link never
uses its code; the recipient must press **Continue signing in** to exchange the token for
a session. The token is claimed atomically so a double submission cannot reuse it.

**Roles.** What you say at onboarding (`users.interests`) and what you are (`user_roles`) are
different facts. Registering grants `participant` outright, because rule 03 says anyone can
compete. `sponsor`, `mentor` and `judge` are requested from `/dashboard/requests` — one open
request per role — and granted by an admin in `/admin/requests`, which emails the decision.
The first account to sign in becomes the admin; so does `ADMIN_EMAIL`, whenever it signs in.

**Judging.** The rubric lives in `RUBRIC` in `lib/accounts.js` — the same 40/30/20/10 the
`/hackathon` page publishes, in the same words. One scorecard per judge per entry, each axis
0–10; an incomplete card counts for nothing rather than dragging an average down. Judges on a
team can't be assigned to it or score it, checked in three places.

**Certificates** are rows in `certificates`, issued from `/admin/scores` after the awards, and
held by every member of the team. `lib/results.js` no longer holds entrant data — it decides
how a credential *reads* (edition, categories, placement wording, the LinkedIn field list) and
`fromCertificate()` adapts a row into the shape the templates always used. The public URL
`/hackathon/certificate/<id>` and `/hackathon/results` render from the database with a 60s
revalidate; results only go public when an admin flips the switch in `/admin`.

**Runtime switches** (`lib/settings.js`): submissions open, registration open, crowd voting,
results published. Each has a computed default, so submissions close on their own at the
published deadline whether or not anyone presses a button.

### Email

Everything goes through Resend on the verified `shipai.club` domain.

| Direction | Address | Notes |
| --- | --- | --- |
| Transactional out | `Ship AI <noreply@shipai.club>` | Login codes, decisions, receipts, certificates |
| Reply-To | `hi@shipai.club` | Every outbound message carries it, so a reply reaches a person |
| Admin notices | to `ADMIN_EMAIL` | Reply-To is the **requester**, so hitting reply answers them directly |
| Inbound | anything `@shipai.club` | Catch-all → `email.received` webhook → `/admin/email` |

**Webhook.** `POST /api/webhooks/resend` takes Resend's Svix-signed deliveries: ten event
types (sent, delivered, delivery_delayed, bounced, complained, failed, suppressed, opened,
clicked, received). `lib/webhook.js` verifies `HMAC-SHA256(secret, "<svix-id>.<svix-timestamp>.<rawBody>")`
over the **raw bytes**, before parsing, with a 5-minute replay window. It has no
skip-verification branch — with `RESEND_WEBHOOK_SECRET` unset the endpoint 503s rather than
accepting anything. Deliveries are deduped on the Svix message id, because Resend retries and
a double-counted bounce is a wrong answer.

**Inbound** is catch-all, so `santos@` and `hi@` both arrive and `to_addrs` distinguishes
them — nothing needs configuring per alias. The webhook carries metadata only, so the body is
fetched separately with `RESEND_READ_API_KEY` (the sending key is restricted and cannot read).
With that key unset you still get sender, recipient and subject; only the body is missing, and
the "retry missing bodies" button in `/admin/email` backfills it.

**Replying** from `/admin/email` sends via Resend with `In-Reply-To` and `References` set to
the original message id, so it threads correctly in the recipient's client rather than
arriving as an unrelated message.

`/admin/email` is also the answer to "I never got my code" — the delivery log says whether it
left, landed or bounced.

### Database

Neon Postgres, reached through `@neondatabase/serverless` over HTTP. `lib/schema.sql` is the
whole schema and every statement in it is idempotent:

```bash
npm run migrate
```

Run it after every schema edit and on every new environment. There is no migration history
table — the file is the desired state. Columns added after the first deploy go in two places:
the `create table` block, and the additive `alter table … add column if not exists` section at
the bottom.

`DATABASE_URL` may be missing. The marketing site is the part that matters most, so a bad or
absent database env must never take it down: `hasDb()` goes false, the account pages render an
"accounts are offline" state, `next build` still succeeds, and every public page is unaffected.

### Working on it locally

The driver speaks Neon's SQL-over-HTTP protocol, so a plain Postgres needs a proxy in front of
it. `docker-compose.dev.yml` runs both:

```bash
docker compose -f docker-compose.dev.yml up -d
npm run migrate
npm run dev
```

with `.env.development.local` holding the local-only values:

```
DATABASE_URL=postgres://postgres:postgres@localhost:4444/main
NEON_LOCAL_PROXY=http://localhost:4444/sql
SITE_URL=http://localhost:3000
AUTH_SECRET=anything-random
ADMIN_EMAIL=you@example.com
```

Next only loads `.env.development.local` in development and `vercel env pull` won't overwrite
it. With no `RESEND_API_KEY` set, login codes are printed to the server console and shown on
the sign-in page, so the whole flow works without a mail provider — production refuses to do
either.

## Sponsor / mentor / judge onboarding

The old hidden `/intake` form is gone — confirmed sponsors, mentors and judges come in
through the account flow instead. Create an invite at `/admin/invites` (pick the roles),
hand over the `/invite/<code>` link, and they sign in already holding the roles. The
onboarding wizard collects name, title, avatar and company, and anyone with the sponsor
role (or the sponsoring interest) also gets a **company logo upload** — stored via
`/api/uploads` in the public blob store (`company-logos/<user-id>/…`), recorded on
`users.company_logo`, and shown on `/admin/sponsors` for pulling down into
`public/sponsors/` when their placement ships.
`parseIntakePath()` is the security boundary: the token route refuses to sign anything it
rejects, so a caller can't write outside its own submission folder.

Environment (all set on the Vercel project, all three environments):

| Var | Required | Purpose |
| --- | --- | --- |
| `BLOB_READ_WRITE_TOKEN` | yes | Added automatically when the blob store was linked |
| `INTAKE_ADMIN_KEY` | yes | Gate for `/intake/inbox` and the file proxy — both 404 without it |
| `RESEND_API_KEY` + `INTAKE_NOTIFY_EMAIL` | no | Emails a summary on each submission; silently skipped when unset |

## Environment

| Var | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | for accounts | Neon Postgres. Without it the account pages go offline and the rest of the site is unaffected |
| `AUTH_SECRET` | for accounts | Peppers every login-code, magic-link and session hash. Long and random; rotating it signs everyone out |
| `RESEND_API_KEY` | for accounts | **Sending access** key. Without it, production refuses to claim it sent a code |
| `RESEND_WEBHOOK_SECRET` | for the log | `whsec_…` from the Resend webhook. Without it `/api/webhooks/resend` 503s |
| `RESEND_READ_API_KEY` | for inbound bodies | **Full access** key, used only to read received email bodies |
| `AUTH_EMAIL_FROM` | no | Sender, e.g. `Ship AI <noreply@shipai.club>`. Needs the domain verified in Resend |
| `REPLY_TO_EMAIL` | no | Reply-To on outbound mail. Defaults to `hi@shipai.club` |
| `ADMIN_EMAIL` | no | Gets the admin flag on sign-in, and receives role requests and submission notices |
| `SITE_URL` | no | Origin for links in emails. Defaults to `https://www.shipai.club` |
| `BLOB_READ_WRITE_TOKEN` | yes | Vercel Blob, for `/intake` |
| `INTAKE_ADMIN_KEY` | yes | Gate for `/intake/inbox` |
| `NEON_LOCAL_PROXY` | local only | Points the driver at the Docker proxy. Never set in production |

Run `vercel env pull .env.local` to work on it locally.

Deployed on Vercel (`v0-ship-ai-landing-page` project → shipai.club).

### Workshop Assessment And Email List

`/workshops/assessment` asks for experience, role, business focus, an optional short goal,
then email and consent to save the recommendation. `/api/workshop-assessment` validates
and captures the email/profile before calling AI SDK through AI Gateway. The email is
not included in the model prompt. Only public workshop slugs may be recommended;
prices and links come from the site catalogue, not model output.

Production uses `AI_GATEWAY_API_KEY` (shared from desic's exp-onboarding project).
`WORKSHOP_ASSESSMENT_MODEL` optionally overrides the verified default Gateway model.
The default model is `openai/gpt-6.1-sol`; each request has a 30-second model timeout,
650 output-token cap, and no automatic model retries. Database-backed atomic daily
caps are 2 new attempts per email, 8 per IP hash, and 100 across the site. Failed attempts
count toward these caps. Repeating a completed request ID returns the saved result
without spending more credits. These are request caps, not a dollar-denominated budget.

`workshop_assessments` stores email, profile, status and result. Its unguessable share
URLs expose only the recommendation, never the email or original answers, and are
noindex. The two isolated assessment tables are initialized idempotently on first use
and also included in `lib/schema.sql`. No assessment subscribes someone to a newsletter.

`/admin/email-list` requires admin access and groups existing accounts, waitlists and
assessment records into one contact per email. It supports search, source filters,
50-contact pagination and a protected CSV export (up to 10,000 matching contacts).
Assessment records are labeled unverified and purpose-limited. The export escapes
spreadsheet formula prefixes. Broadcast segments are unchanged.

Verification: `node --test tests/workshop-assessment.test.mjs`. The live assessment,
email gate, saved-result reuse, private share page and unauthenticated admin protection
were checked after deployment. The admin list/filter/export and atomic concurrent
quota behavior were exercised against the local test database.

### Workshop Covers And Facilitators

Admins can manage every public workshop at `/admin/workshops`. Select a workshop, upload a wide PNG/JPEG/WebP cover (under 3 MB), and choose confirmed facilitators from public Ship AI accounts. Save updates the detail page and link-preview metadata. The generated default cover uses the workshop title, schedule/capacity, and confirmed facilitator photos. Uploaded covers are used as supplied; choose the default branded cover to refresh names/photos automatically. Unassigned faculty are shown as to be announced.

Settings persist in `workshop_media`; its idempotent table definition is included in `lib/schema.sql`. The authenticated admin page initializes this additive table when first opened. Public pages fall back to branded images and the scheduled workshop's existing facilitator assignments if the database is unavailable. `/api/workshops/[slug]/og` serves each workshop's share image; versioned metadata URLs refresh when settings are saved. The site's original general Ship AI OG image remains unchanged.

## Program assessment

The programs directory includes a three-question assessment (`components/program-assessment.jsx`).
`POST /api/program-assessment` validates the profile, recommends only registered programs,
and requires a live product before recommending Growth Loops. It does not collect email or
store profile answers. AI sees the selected answers and optional goal.

AI uses `AI_GATEWAY_API_KEY` and the existing database-backed daily assessment caps
(8 per IP, 100 total for programs). Set `PROGRAM_ASSESSMENT_MODEL` to override the model;
otherwise it uses `WORKSHOP_ASSESSMENT_MODEL` or the existing default. Missing configuration,
spending limits, invalid model output, or service failures return a clearly labeled guided
recommendation. Limit storage has a four-second deadline and model requests a twenty-second
deadline, so the guided match remains available during outages.

Verify matching and output validation with `node --test tests/program-assessment.test.mjs`.

### Hackathon team membership

`/admin` → **Multiple teams per person** controls whether members can create or join
additional teams for the current hackathon. It is enabled by default for the October
2026 Ship AI AZ GTM Hackathon. Each team still has at most four members and one
submission. Disabling it preserves existing memberships and blocks additional teams.

The setting is stored as `hackathon:<EVENT.id>:multiple_teams_allowed`. Teams carry
`hackathon_id`; existing teams migrate to `zero-to-launch-2026`. Give future events
an explicit `EVENT.id` and set `EVENT.allowMultipleTeams` to their desired default
(omitting it means one team per person). Membership checks only count teams in the
same hackathon. Creation and joining use transactions that lock the user and, for
joining, the destination team before checking the policy and capacity.

The dashboard lists every team and entry. Team and submission pages accept `?team=<id>`;
every mutation checks the authenticated member or owner against that selected team.
Run `npm run migrate` before deploying this feature to remove the previous global
one-team index and add hackathon IDs. When production credentials are sensitive,
set the build-only `APPLY_TEAM_MEMBERSHIP_MIGRATION=1` on the initial Vercel deploy;
the prebuild migration runs inside Vercel, preserves existing teams, and explicitly
enables multiple memberships for the current event. Later builds omit the flag so
an admin's subsequent choice is preserved.

Verification: `node --experimental-vm-modules --test tests/auth.test.mjs tests/scoring.test.mjs tests/submissions.test.mjs`.
The eight PostgreSQL integration cases in `tests/team-membership.test.mjs` cover
migration preservation, multiple memberships, the toggle, event isolation,
concurrency limits, selected-team operations, authorization, and separate entries.
They require a dedicated local `TEAM_TEST_DATABASE_URL` plus the `pg` module
(`TEAM_TEST_PG_PATH` may point to an existing installation); see the test header.
