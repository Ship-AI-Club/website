import { test } from 'node:test';
import assert from 'node:assert/strict';
import { workshopCheckoutSettled } from '../lib/workshop-checkout-status.js';

test('Stripe paid and zero-cost completed sessions fulfill a seat', () => {
  assert.equal(workshopCheckoutSettled({status:'complete',payment_status:'paid',amount_total:49900}),true);
  assert.equal(workshopCheckoutSettled({status:'complete',payment_status:'no_payment_required',amount_total:0}),true);
});
test('pending, unpaid, and malformed free sessions cannot fulfill a seat', () => {
  for (const session of [null,
    {status:'open',payment_status:'no_payment_required',amount_total:0},
    {status:'complete',payment_status:'unpaid',amount_total:0},
    {status:'complete',payment_status:'no_payment_required',amount_total:49900},
    {status:'complete',payment_status:'no_payment_required'},
  ]) assert.equal(workshopCheckoutSettled(session),false);
});
