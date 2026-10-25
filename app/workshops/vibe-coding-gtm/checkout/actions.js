"use server";
import { redirect } from "next/navigation";
import { requireUser } from "../../../../lib/auth";
import { stripeConfigured } from "../../../../lib/stripe";
import { CHECKOUT_PATH, startWorkshopCheckout, cancelWorkshopCheckout } from "../../../../lib/workshop-bookings";
import { VIBE_GTM } from "../../../../lib/vibe-gtm-workshop";

export async function checkoutAction(_previous, formData) {
  const user = await requireUser(CHECKOUT_PATH);
  if (!stripeConfigured()) return {error:"Checkout is being configured. Please try again shortly."};
  if (Date.now() >= new Date(VIBE_GTM.start).getTime()) return {error:"Registration for this workshop has closed."};
  let result;
  try { result = await startWorkshopCheckout(user,formData?.get('code') || ''); }
  catch (error) {
    console.error("Workshop checkout failed", {type:error.type || error.name, code:error.code});
    return {error:"We couldn’t open checkout. Please try again. You have not been charged."};
  }
  if (result.url) redirect(result.url);
  if (result.paid) redirect(`${CHECKOUT_PATH}?registered=1`);
  return {error: result.soldOut ? "All 10 seats are currently booked or held at checkout. Please try again later or email hi@shipai.club." : "Your payment is being confirmed. Please refresh this page shortly."};
}

export async function cancelCheckoutAction() {
  const user = await requireUser(CHECKOUT_PATH);
  await cancelWorkshopCheckout(user);
  redirect(VIBE_GTM.path);
}
