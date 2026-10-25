// Invented fixture identities and payment references; never use live accounts.
export const USERS = Object.freeze({
  attendee: { id: '00000000-0000-4000-8000-000000000001', roles: [] },
  wrongHost: { id: '00000000-0000-4000-8000-000000000002', roles: ['host'] },
  admin: { id: '00000000-0000-4000-8000-000000000004', roles: ['admin'], is_admin: true },
  host: { id: '00000000-0000-4000-8000-000000000003', roles: [] },
});
export const PAID_BOOKING = Object.freeze({
  workshop: 'vibe-coding-gtm-2026-10-07', user_id: USERS.attendee.id,
  status: 'paid', paid_at: '2026-10-01T12:00:00Z', refunded_at: null,
  amount_paid: 49900, checkout_session_id: 'cs_fixture_only', payment_intent_id: 'pi_fixture_only',
});
