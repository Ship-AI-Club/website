# Workshop material authorization review

This policy applies to new workshop materials only. Existing public program decks,
guides, and skill kits keep their existing access rules.

Every HTML/RSC page, JSON/API endpoint, and download calls
`workshopMaterialAccess(slug, { audience })` before loading or returning material
bytes. `attendee` permits that workshop's verified hosts and eligible paid
attendees. `host` permits only that workshop's verified hosts; facilitator notes
must never be placed inside an attendee deck, guide, JSON, or client prop.

The authenticated identity comes exclusively from `currentUser()` (hashed,
unexpired, unrevoked server session). User IDs, role claims, tokens, cookies other
than a verified session, query strings, and request headers do not confer access.
As explicitly requested for the October 10 workshop, a verified administrator can access both attendee materials and facilitator notes for `vibe-coding-gtm`. Administrator access uses only the authenticated server identity. Other workshops retain their scoped host and booking requirements. Generic host roles do not bypass assignment.

`workshop_media.facilitator_ids` is the scoped host assignment. A successful
lookup with no row uses `VIBE_GTM.instructorIds` only for `vibe-coding-gtm`.
An existing empty row means no hosts. Missing DB configuration, malformed results,
and failed DB reads deny access rather than invoking the public media helper's
fallback behavior.

The immutable booking key for `vibe-coding-gtm` is
`vibe-coding-gtm-2026-10-07`; the displayed event date changed to October 10.
Do not infer booking identities from dates or rename this payment key.
No paid booking mappings exist for the upcoming catalog or organization event.
Their assigned hosts can prepare materials; attendee access stays denied until a
real scoped booking mapping is implemented and reviewed.

An eligible attendee booking must match both account and exact workshop, have
status `paid`, a payment timestamp, nonnegative integer paid amount, a checkout reference, and
a payment intent reference for nonzero payments, and no refund timestamp. Read the latest booking
without cross-request caching. Checkout cancellation/expiry does not grant access.
The current schema has no `cancelled` booking status; any non-`paid` status is
rejected. Completed fully discounted zero-value checkouts qualify; their payment intent may be absent.

The existing signed Stripe `charge.refunded` webhook updates full refunds to
`refunded` and sets `refunded_at`. Partial refunds intentionally retain paid seats.
No checkout, refund, webhook, role, or live database mutation is introduced here.
Revocation follows persisted webhook processing; delayed or failed delivery can
leave a stale paid row until existing webhook reconciliation succeeds. This gate
does not make live Stripe calls. Event-wide cancellation has no dedicated DB flag;
revocation currently relies on the existing full-refund processing per booking.

Routes must be dynamic (`dynamic = 'force-dynamic'`, `revalidate = 0`) and apply
`WORKSHOP_PRIVATE_HEADERS` to success, denial, and redirect responses, including
RSC/prefetch paths. Do not call `generateStaticParams`, `unstable_cache`, or build
private outputs into `public`, public blobs, sitemaps, or public manifests.
React's existing `currentUser` cache is request-scoped; this gate deliberately
rechecks assignment and booking for each request. Next's browser navigation cache
and already received copies cannot be remotely erased, so no-store plus fresh
server checks are essential; previously downloaded material cannot be revoked.

Downloads use `materialFileSpec(filename)` and exact allowlisted file names, never
caller-selected filesystem paths. Authorize the resolved file audience before
opening a file. Keep private material data and generated files server-only.

Verification: `node --test tests/workshop-material-access.test.mjs` runs nine safe
fixture tests covering missing auth, wrong account/workshop, unpaid/refunded/
cancelled/expired status, correct and wrong hosts, scoped administrator access, DB
failures, fallback revocation, forged request claims, path traversal, and cache
headers. These tests do not verify a live DB, live session cookie, Stripe delivery,
or deployed CDN; route/integration checks must be performed separately.
