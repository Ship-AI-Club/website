import { stripe } from "../../../../lib/stripe";
import { recordCheckout, recordRefund } from "../../../../lib/workshop-bookings";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) return Response.json({error:"Webhook unavailable"},{status:503});
  let event;
  try {event=stripe().webhooks.constructEvent(await request.text(),request.headers.get('stripe-signature'),process.env.STRIPE_WEBHOOK_SECRET);}
  catch {return Response.json({error:"Invalid signature"},{status:400});}
  try {
    if (['checkout.session.completed','checkout.session.expired','checkout.session.async_payment_succeeded'].includes(event.type)) await recordCheckout(event.data.object);
    if (event.type==='charge.refunded') {
      // Delivery order is not guaranteed. Reconcile the paid checkout before the refund.
      const charge=event.data.object;
      if(charge.metadata?.workshop && charge.metadata?.booking_id){
        const sessions=await stripe().checkout.sessions.list({payment_intent:typeof charge.payment_intent==='string'?charge.payment_intent:charge.payment_intent?.id,limit:1});
        if(sessions.data[0]) await recordCheckout(sessions.data[0]);
      }
      await recordRefund(charge);
    }
    return Response.json({received:true});
  } catch(error) {
    console.error("Stripe workshop webhook failed",{eventId:event.id,type:event.type,error:error.name});
    return Response.json({error:"Processing failed"},{status:500});
  }
}
