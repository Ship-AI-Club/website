import "server-only";
import Stripe from "stripe";
let client;
export function stripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
}
export function stripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe is not configured");
  return client ||= new Stripe(process.env.STRIPE_SECRET_KEY, { maxNetworkRetries: 2 });
}
