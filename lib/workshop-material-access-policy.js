import { UPCOMING_WORKSHOPS } from './workshops.js';
import { VIBE_GTM } from './vibe-gtm-workshop.js';
import { AI_ORGANIZATION_EVENT } from './ai-organization-event.js';

// Booking identifiers are immutable payment identities, not dates inferred from
// marketing copy. The October 10 event retains its original October 7 DB key.
export const WORKSHOP_MATERIAL_BOOKING_IDS = Object.freeze({
  'vibe-coding-gtm': 'vibe-coding-gtm-2026-10-07',
});
const knownSlugs = new Set(['vibe-coding-gtm', AI_ORGANIZATION_EVENT.slug,
  ...UPCOMING_WORKSHOPS.map(workshop => workshop.slug)]);
export function workshopMaterialDefinition(slug) {
  if (typeof slug !== 'string' || !knownSlugs.has(slug)) return null;
  return { slug, bookingId: WORKSHOP_MATERIAL_BOOKING_IDS[slug] || null,
    allowAdmin: slug === 'vibe-coding-gtm',
    defaultHostIds: slug === 'vibe-coding-gtm' ? [...VIBE_GTM.instructorIds] : [] };
}

// Use these on success AND denial responses. Never share material bytes or
// session-dependent decisions through a browser, CDN, or Next data cache.
export const WORKSHOP_PRIVATE_HEADERS = Object.freeze({
  'Cache-Control': 'private, no-store, max-age=0, must-revalidate',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
  Vary: 'Cookie',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'X-Content-Type-Options': 'nosniff',
});
const fileSpecs = Object.freeze({
  'workshop.pptx': { audience:'attendee', contentType:'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
  'prompts.md': { audience:'attendee', contentType:'text/markdown; charset=utf-8' },
  'blueprints.zip': { audience:'attendee', contentType:'application/zip' },
  'deck.json': { audience: 'attendee', contentType: 'application/json; charset=utf-8' },
  'guide.json': { audience: 'attendee', contentType: 'application/json; charset=utf-8' },
  'guide.md': { audience: 'attendee', contentType: 'text/markdown; charset=utf-8' },
  'facilitator-notes.json': { audience: 'host', contentType: 'application/json; charset=utf-8' },
  'facilitator-notes.md': { audience: 'host', contentType: 'text/markdown; charset=utf-8' },
});
// Exact keys only: never decode, normalize, join, or accept a caller's path.
export function materialFileSpec(filename) {
  return typeof filename === 'string' && Object.hasOwn(fileSpecs, filename)
    ? { ...fileSpecs[filename] } : null;
}

export function paidWorkshopBooking(booking, definition, user) {
  return Boolean(definition?.bookingId && user?.id && booking &&
    booking.workshop === definition.bookingId && booking.user_id === user.id &&
    booking.status === 'paid' && booking.paid_at && !booking.refunded_at &&
    Number.isSafeInteger(booking.amount_paid) && booking.amount_paid >= 0 &&
    booking.checkout_session_id && (booking.amount_paid === 0 || booking.payment_intent_id));
}

// Inject only trusted server reads; this allows security tests without accounts,
// credentials, Stripe calls, or a live database. Admin access is explicitly
// enabled only for the October 10 workshop, using the verified server identity.
export async function resolveWorkshopMaterialAccess({ slug, audience = 'attendee',
  user, databaseAvailable, readHosts, readBooking }) {
  const deny = reason => ({ allowed: false, user: user || null, isHost: false, reason });
  const definition = workshopMaterialDefinition(slug);
  if (!definition) return deny('unknown-workshop');
  if (!['attendee', 'host'].includes(audience)) return deny('unknown-audience');
  if (!databaseAvailable) return deny('unavailable');
  if (!user?.id) return deny('unauthenticated');
  if (definition.allowAdmin && (user.is_admin === true || user.roles?.includes('admin'))) {
    return { allowed:true, user, isHost:false, isAdmin:true, reason:'admin' };
  }
  try {
    const media = await readHosts(slug);
    // null means a successful lookup with no row. An empty assignment overrides
    // defaults; malformed data or query failures must never activate a fallback.
    if (media !== null && (!media || !Array.isArray(media.facilitator_ids))) return deny('unavailable');
    const ids = media === null ? definition.defaultHostIds : media.facilitator_ids;
    if (ids.includes(user.id)) return { allowed: true, user, isHost: true, reason: 'host' };
    if (audience === 'host') return deny('host-only');
    if (!definition.bookingId) return deny('payment-required');
    const booking = await readBooking(definition.bookingId, user.id);
    return paidWorkshopBooking(booking, definition, user)
      ? { allowed: true, user, isHost: false, reason: 'paid-attendee' }
      : deny('payment-required');
  } catch {
    return deny('unavailable');
  }
}
