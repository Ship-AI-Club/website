# shipai.club

<img src="https://www.shipai.club/og-image.jpg" alt="Ship AI" width="480" />

Marketing site for [Ship AI](https://www.shipai.club) — a community of AI craftspeople in Phoenix & Tempe. Demos over memos.

Next.js (app router), plain CSS, Geist. Upcoming events are pulled live from the Meetup iCal feed (`lib/meetup.js`, revalidated hourly).

```bash
npm install
npm run dev
```

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

Run `vercel env pull .env.local` to work on it locally.

Deployed on Vercel (`v0-ship-ai-landing-page` project → shipai.club).
