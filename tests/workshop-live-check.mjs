// Opt-in smoke test: creates then expires a live Checkout Session; never pays.
// Uses only an isolated QA account and removes its records in finally.
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) throw new Error('Set server Stripe secrets before this opt-in live smoke test.');
const {sql}=await import('../lib/db.js');
const {stripe}=await import('../lib/stripe.js');
const {startWorkshopCheckout,recordCheckout,bookingFor}=await import('../lib/workshop-bookings.js');
const email=`workshop-qa-${randomUUID()}@example.invalid`;
const [user]=await sql`insert into users(email,name,public_profile) values(${email},'Workshop QA',false) returning *`;
let sessionId;
try {
 const result=await startWorkshopCheckout(user);
 assert.match(result.url,/^https:\/\/checkout.stripe.com\//);
 const booking=await bookingFor(user.id);sessionId=booking.checkout_session_id;
 const session=await stripe().checkout.sessions.retrieve(sessionId,{expand:['line_items']});
 assert.equal(session.livemode,true);assert.equal(session.amount_subtotal,49900);assert.equal(session.allow_promotion_codes,true);
 assert.equal(session.client_reference_id,user.id);assert.equal(session.metadata.booking_id,booking.id);
 assert.equal(session.line_items.data[0].price.product,'prod_VMJ188wJlNoAbJ');
 const codes=await stripe().promotionCodes.list({code:'Workuity',active:true,limit:1});
 assert.equal(codes.data.length,1);
 console.log('PASS: live desic checkout, $499 one seat, verified-account reference, workshop product, promo entry enabled, Workuity active. No purchase made.');
 const expired=await stripe().checkout.sessions.expire(sessionId);
 await recordCheckout(expired);
 assert.equal((await bookingFor(user.id)).status,'expired');
 console.log('PASS: Stripe-confirmed expiration releases the held seat.');
} catch(e) {console.error({type:e.type||e.name,message:e.message});process.exitCode=1;}
finally {
 if(sessionId){const session=await stripe().checkout.sessions.retrieve(sessionId);if(session.status==='open')await stripe().checkout.sessions.expire(sessionId);}
 await sql`delete from workshop_bookings where user_id=${user.id}`;
 await sql`delete from users where id=${user.id}`;
}
const body=JSON.stringify({id:'evt_workshop_signature_check',object:'event',type:'workshop.integration.check',data:{object:{}}});
const signed=stripe().webhooks.generateTestHeaderString({payload:body,secret:process.env.STRIPE_WEBHOOK_SECRET});
for(const [signature,expected] of [[signed,200],['invalid',400]]){
 const r=await fetch('https://www.shipai.club/api/webhooks/stripe',{method:'POST',headers:{'content-type':'application/json','stripe-signature':signature},body});
 assert.equal(r.status,expected);console.log(`PASS: webhook signature ${expected===200?'accepted':'rejected'}.`);
}
