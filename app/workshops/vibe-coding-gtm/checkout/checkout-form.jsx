"use client";
import { useActionState, useEffect, useRef } from "react";
import { checkoutAction } from "./actions";
export default function CheckoutForm({automatic=false,code=''}) {
  const [state,action,pending] = useActionState(checkoutAction,null);
  const form=useRef(null);
  const started=useRef(false);
  useEffect(()=>{if(automatic && !started.current){started.current=true;form.current?.requestSubmit();}},[automatic]);
  return <form ref={form} action={action} className="ac-form">
    <input type="hidden" name="code" value={code}/>
    {state?.error && <p role="alert" className="ac-error">{state.error}</p>}
    <button type="submit" className="btn btn-solid" disabled={pending}>{pending ? "Opening Stripe Checkout…" : "Continue to Stripe Checkout"}</button>
  </form>;
}
