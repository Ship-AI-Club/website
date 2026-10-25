import 'server-only';
import { currentUser } from './auth.js';
import { hasDb, sql, one } from './db.js';
import { resolveWorkshopMaterialAccess } from './workshop-material-access-policy.js';
export { WORKSHOP_PRIVATE_HEADERS, materialFileSpec, workshopMaterialDefinition } from './workshop-material-access-policy.js';

// Deliberately neither React cache nor unstable_cache: every material request
// rechecks the workshop assignment and latest booking, including refund status.
export async function workshopMaterialAccess(slug, { audience = 'attendee' } = {}) {
  const databaseAvailable = hasDb();
  let user = null;
  if (databaseAvailable) {
    try { user = await currentUser(); }
    catch { return { allowed: false, user: null, isHost: false, reason: 'unavailable' }; }
  }
  return resolveWorkshopMaterialAccess({ slug, audience, user, databaseAvailable,
    readHosts: async workshopSlug => one(await sql`
      select facilitator_ids from workshop_media where slug=${workshopSlug}`),
    readBooking: async (bookingId, userId) => one(await sql`
      select workshop,user_id,status,paid_at,refunded_at,amount_paid,
        checkout_session_id,payment_intent_id
      from workshop_bookings where workshop=${bookingId} and user_id=${userId}::uuid
      order by created_at desc,id desc limit 1`),
  });
}
