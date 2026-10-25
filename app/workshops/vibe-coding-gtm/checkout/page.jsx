import "../../../account.css";
import { AccountHeader, AccountFooter } from "../../../../components/account-chrome";
import { requireUser } from "../../../../lib/auth";
import { stripe, stripeConfigured } from "../../../../lib/stripe";
import { bookingFor, CHECKOUT_PATH, recordCheckout } from "../../../../lib/workshop-bookings";
import { VIBE_GTM, workshopPrice } from "../../../../lib/vibe-gtm-workshop";
import CheckoutForm from "./checkout-form";
import { cancelCheckoutAction } from "./actions";
import { workshopPromotion } from '../../../../lib/workshop-promotion';
export const dynamic="force-dynamic";
export const metadata={title:"Workshop registration — Ship AI",robots:{index:false,follow:false}};
export default async function Page({searchParams}) {
  const params=await searchParams;
  const promotion=workshopPromotion(params?.code);
  const user=await requireUser(promotion ? `${CHECKOUT_PATH}?code=GoToMarket` : CHECKOUT_PATH);
  let booking=await bookingFor(user.id);
  let confirming=false;
  if(params?.session_id && stripeConfigured()) {
    // Never trust a URL's paid flag or accept another attendee's session.
    if(booking?.checkout_session_id === params.session_id) {
      try {await recordCheckout(await stripe().checkout.sessions.retrieve(booking.checkout_session_id));booking=await bookingFor(user.id);}
      catch {confirming=true;}
    } else confirming=true;
  }
  const paid=booking?.status==='paid';
  const closed=Date.now()>=new Date(VIBE_GTM.start).getTime();
  return <><AccountHeader user={user} links={[{href:VIBE_GTM.path,label:"Workshop"}]}/>
    <main className="ac-page">
      <p className="ac-kicker">{VIBE_GTM.name} · Only 10 seats</p>
      <h1>{paid ? "Your seat is confirmed." : "Reserve your workshop seat."}</h1>
      <p className="ac-lede">October 10, 2026 · 9 AM–1 PM MST<br/>{VIBE_GTM.venue}<br/>{VIBE_GTM.address}</p>
      <p><strong>Coffee, breakfast, and lunch included.</strong></p>
      <p className="ac-fine">Ship AI account: {user.email}</p>
      {paid ? <><p className="ac-ok">Your paid registration is saved to your Ship AI account. We look forward to seeing you.</p><p>Bring your laptop, charger, and a business or project to work on.</p><p className="ac-fine">Booking reference: {booking.id}</p></> : booking?.status==='refunded' ? <p className="ac-ok">Your ticket has been refunded.</p> : closed ? <p>Registration has closed.</p> : confirming ? <p role="status">We’re confirming your payment. Refresh shortly, or email hi@shipai.club if you need help.</p> : !stripeConfigured() ? <p className="ac-error">Checkout is being configured. Please try again shortly or email hi@shipai.club.</p> : <>
        <p className="ac-lede">${promotion?.total || workshopPrice().amount} USD · one seat{promotion && ' · GoToMarket applied'}</p>
        {params?.cancelled && <p>Checkout was not completed. Continue your checkout or release your held seat below.</p>}
        <CheckoutForm automatic={!params?.cancelled} code={promotion?.code || ''}/>
        {booking?.status==='pending' && params?.cancelled && <form action={cancelCheckoutAction}><button className="btn btn-ghost" type="submit">Release my seat and return to workshop</button></form>}
      </>}
      <p className="ac-fine" style={{marginTop:"2rem"}}>Tickets are refundable until the day of the event. If the event is cancelled, you will receive a full refund. For refund requests, email <a href="mailto:hi@shipai.club">hi@shipai.club</a>.</p>
      <p><a href={VIBE_GTM.path}>View workshop details and FAQ</a></p>
    </main><AccountFooter/></>;
}
