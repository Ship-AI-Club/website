# shipai.club

<img src="https://www.shipai.club/og-image.jpg" alt="Ship AI" width="480" />

Marketing site for [Ship AI](https://www.shipai.club) — a community of AI craftspeople in Phoenix & Tempe. Demos over memos.

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

## Sponsor / mentor / judge intake

`/intake` is a hidden page — noindex, absent from the sitemap, linked from nowhere. Send
the URL to someone once they've agreed to sponsor, mentor or judge, and it collects their
name, title, avatar, company, logo and any other brand assets in one pass. Same fields for
all three roles; the role selector only changes the blurb and where the files land.

| Piece | Route | What it does |
| --- | --- | --- |
| Form | `/intake` | `app/intake/intake-form.jsx` — client component |
| Token issuer | `/api/intake/upload` | Mints path-scoped blob tokens; the browser uploads direct |
| Record | `/api/intake` | Validates and writes `record.json` |
| Inbox | `/intake/inbox?key=…` | Reads submissions back, newest first |
| File proxy | `/api/intake/file?key=…&path=…` | Serves private blobs to the inbox |

Files go **straight from the browser to Vercel Blob**, so the 4.5 MB serverless request-body
limit never applies and a 64 MB brand kit uploads fine. The store (`shipai-intake`) is
**private**: uploads have no public URL, and the inbox is the only way to read them back
short of the Vercel dashboard.

Shared contract — roles, blob layout, size caps, allowed types — lives in `lib/intake.js`
and is imported by the client and both route handlers, so there's one place to change it.
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
