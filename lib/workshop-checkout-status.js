// Only a completed Stripe session can fulfill a seat. Free sessions have no
// PaymentIntent and are settled only when Stripe confirms a zero total.
export function workshopCheckoutSettled(session) {
  return session?.status === 'complete' && (session.payment_status === 'paid' ||
    (session.payment_status === 'no_payment_required' && session.amount_total === 0));
}
