import "server-only";
import { allocateWorkshopSeat } from "./workshop-allocation.js";
import { db, sql, one } from "./db.js";
import { stripe } from "./stripe.js";
import { VIBE_GTM, workshopPrice } from "./vibe-gtm-workshop.js";
import { workshopPromotion } from './workshop-promotion.js';
import { workshopCheckoutSettled } from './workshop-checkout-status.js';
export const WORKSHOP_ID = "vibe-coding-gtm-2026-10-07";
export const CHECKOUT_PATH = `${VIBE_GTM.path}/checkout`;
const SITE = "https://www.shipai.club";

export async function bookingFor(userId) {
  return one(await sql`select * from workshop_bookings where workshop=${WORKSHOP_ID}
    and user_id=${userId} order by created_at desc limit 1`);
}

// Safe to replay: only the stored booking and account can receive a paid seat.
export async function recordCheckout(session) {
  if (session.metadata?.workshop !== WORKSHOP_ID) return;
  const id = session.metadata?.booking_id;
  if (!id || !session.client_reference_id) throw new Error("Missing booking identity");
  if (workshopCheckoutSettled(session)) {
    const rows = await sql`update workshop_bookings set status='paid',
      checkout_session_id=${session.id}, payment_intent_id=${(typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id) || null},
      amount_paid=${session.amount_total}, paid_at=coalesce(paid_at,now())
      where id=${id}::uuid and user_id=${session.client_reference_id}::uuid
        and workshop=${WORKSHOP_ID} and status in ('pending','paid')
        and (checkout_session_id is null or checkout_session_id=${session.id}) returning user_id`;
    if (!rows.length) {
      const existing = one(await sql`select status from workshop_bookings where id=${id}::uuid and checkout_session_id=${session.id}`);
      if (existing?.status !== 'refunded') throw new Error("Booking could not be fulfilled");
    }
    const name = session.custom_fields?.find(f => f.key === 'attendee_name')?.text?.value?.trim().slice(0,100);
    if (name && rows.length) await sql`update users set name=${name} where id=${rows[0].user_id} and name=''`;
  } else if (session.status === "expired") {
    await sql`update workshop_bookings set status='expired' where id=${id}::uuid
      and user_id=${session.client_reference_id}::uuid and status='pending'
      and (checkout_session_id is null or checkout_session_id=${session.id})`;
  }
}

export function sessionParams(booking, user, promotion = null) {
  return {
    mode: "payment", allowed_payment_method_types: ["card"],
    client_reference_id: user.id, customer_email: user.email,
    metadata: { workshop: WORKSHOP_ID, booking_id: booking.id },
    payment_intent_data: { metadata: { workshop: WORKSHOP_ID, booking_id: booking.id } },
    line_items: [{ quantity: 1, price_data: { product: VIBE_GTM.stripeProductId, currency: "usd", unit_amount: booking.amount } }],
    ...(promotion ? { discounts: [{ promotion_code: promotion.id }] } : { allow_promotion_codes: true }),
    custom_fields: [{ key: "attendee_name", label: {type:"custom",custom:"Attendee name"}, type:"text", text:{minimum_length:2,maximum_length:100} }],
    custom_text: { submit: { message: "October 10, 9 AM–1 PM MST · Workuity Biltmore Executive Room. Coffee, breakfast, and lunch included. Refundable until the day of the event. Full refund if cancelled." } },
    expires_at: Math.floor(new Date(booking.expires_at).getTime()/1000),
    success_url: `${SITE}${CHECKOUT_PATH}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE}${CHECKOUT_PATH}?cancelled=1`,
  };
}

// Fixed idempotency key makes concurrent clicks and network retries one session.
async function sessionFor(booking, user, promotion) {
  if (booking.checkout_session_id) return stripe().checkout.sessions.retrieve(booking.checkout_session_id);
  let session;
  try {
    session = await stripe().checkout.sessions.create(sessionParams(booking,user,promotion), { idempotencyKey: `workshop-${booking.id}` });
  } catch (error) {
    // A rejected request creates no session. Transport failures are ambiguous,
    // so retain that hold for a retry with the same idempotency key.
    if (error.type === "StripeInvalidRequestError") await sql`
      update workshop_bookings set status='expired' where id=${booking.id}
      and status='pending' and checkout_session_id is null`;
    throw error;
  }
  await sql`update workshop_bookings set checkout_session_id=${session.id}, checkout_url=${session.url},
    expires_at=to_timestamp(${session.expires_at}) where id=${booking.id} and status='pending'`;
  return session;
}

export async function startWorkshopCheckout(user, code = '') {
  const promotion = workshopPromotion(code);
  // Never recycle a seat solely by a local clock: Stripe must confirm expiry.
  const stale = await sql`select * from workshop_bookings where workshop=${WORKSHOP_ID}
    and status='pending' and expires_at < now() and checkout_session_id is not null`;
  for (const booking of stale) await recordCheckout(await stripe().checkout.sessions.retrieve(booking.checkout_session_id));
  let booking = await bookingFor(user.id);
  if (booking?.status === 'paid') return { paid:true };
  // Switching to the private offer must first release the previous Stripe hold.
  if (promotion && booking?.status === 'pending') {
    let matches = booking.amount === promotion.amount;
    if (booking.checkout_session_id) {
      const existing = await stripe().checkout.sessions.retrieve(booking.checkout_session_id);
      await recordCheckout(existing);
      if (workshopCheckoutSettled(existing)) return { paid: true };
      matches = matches && existing.discounts?.some(d => (typeof d.promotion_code === 'string' ? d.promotion_code : d.promotion_code?.id) === promotion.id);
      if (!matches) await cancelWorkshopCheckout(user);
    } else if (!matches) {
      await sql`update workshop_bookings set status='expired' where id=${booking.id} and status='pending' and checkout_session_id is null`;
    }
    booking = await bookingFor(user.id);
  }
  if (booking?.status !== 'pending') {
    const amount = promotion?.amount || workshopPrice().amount * 100;
    booking = await allocateWorkshopSeat(db(), WORKSHOP_ID, user.id, amount) || await bookingFor(user.id);
    if (!booking || !['pending','paid'].includes(booking.status)) return { soldOut:true };
    if (booking.status === 'paid') return { paid:true };
  }
  const session = await sessionFor(booking,user,promotion);
  await recordCheckout(session);
  if (workshopCheckoutSettled(session)) return { paid:true };
  if (session.status === 'expired') return startWorkshopCheckout(user,code);
  if (!session.url || session.status !== 'open') return { processing:true };
  return { url:session.url };
}

export async function cancelWorkshopCheckout(user) {
  const booking = await bookingFor(user.id);
  if (booking?.status !== 'pending' || !booking.checkout_session_id) return;
  let session = await stripe().checkout.sessions.retrieve(booking.checkout_session_id);
  if (session.status === 'open') {
    try { session = await stripe().checkout.sessions.expire(session.id); }
    catch { session = await stripe().checkout.sessions.retrieve(session.id); }
  }
  await recordCheckout(session);
}

export async function recordRefund(charge) {
  // Partial refunds keep the attendee's seat. Only a full refund releases it.
  if (charge.refunded && charge.payment_intent) await sql`
    update workshop_bookings set status='refunded',refunded_at=coalesce(refunded_at,now())
    where payment_intent_id=${typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent.id} and status='paid'`;
}
