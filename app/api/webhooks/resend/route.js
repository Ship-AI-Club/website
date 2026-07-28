import { sql, hasDb } from "../../../../lib/db";
import { verifyResendSignature, webhookConfigured } from "../../../../lib/webhook";
import { storeInbound } from "../../../../lib/inbound";

/* ------------------------------------------------------------------
   Resend → us.

   Two jobs in one endpoint, because that's what Resend delivers to:

     · delivery events for mail we sent (sent, delivered, bounced,
       complained, delayed, failed, suppressed, opened, clicked) —
       this is what makes "I never got my code" answerable
     · email.received, which is inbound mail to shipai.club

   The endpoint is public, so the signature is the only thing standing
   between it and the database. It is verified over the raw bytes
   before anything is parsed, and a failure is a 401 with nothing
   written.

   Always returns 2xx once a delivery is verified and stored, even if
   we couldn't make sense of the payload: Resend retries non-2xx, and
   retrying a message we will never understand just fills the log.
------------------------------------------------------------------ */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function list(value) {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).map((v) => String(v).slice(0, 320));
}

export async function POST(request) {
  if (!webhookConfigured()) {
    console.error("resend webhook: RESEND_WEBHOOK_SECRET is not set — refusing the delivery");
    return new Response("Webhook not configured", { status: 503 });
  }
  if (!hasDb()) {
    /* 503 rather than 200: the event is real and Resend should retry
       once the database is reachable again. */
    return new Response("Database unavailable", { status: 503 });
  }

  const raw = await request.text();
  const verified = verifyResendSignature(raw, request.headers);
  if (!verified.ok) {
    console.warn("resend webhook: rejected —", verified.reason);
    return new Response("Invalid signature", { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response("Malformed body", { status: 400 });
  }

  const type = String(event?.type || "");
  const data = event?.data ?? {};

  try {
    /* The Svix message id is the idempotency key. Resend retries on
       any non-2xx and occasionally duplicates on its own, and a
       double-counted bounce is a wrong answer, not a cosmetic one. */
    const stored = await sql`
      insert into email_events
        (event_id, type, email_id, from_addr, to_addrs, subject, payload, occurred_at)
      values
        (${verified.eventId}, ${type}, ${String(data.email_id ?? data.id ?? "")},
         ${String(data.from ?? "")}, ${list(data.to)}::text[],
         ${String(data.subject ?? "").slice(0, 500)},
         ${JSON.stringify(event)}::jsonb,
         ${event.created_at ? new Date(event.created_at).toISOString() : new Date().toISOString()})
      on conflict (event_id) do nothing
      returning id`;

    // already processed — acknowledge and stop
    if (!stored.length) return Response.json({ ok: true, duplicate: true });

    if (type === "email.received") {
      await storeInbound(data);
    }
  } catch (error) {
    /* A storage failure is ours, not Resend's, so let it retry. */
    console.error("resend webhook: could not store event", error);
    return new Response("Storage failed", { status: 500 });
  }

  return Response.json({ ok: true });
}

/* A GET is how you check the endpoint exists without sending an
   event. It reports configuration, never data. */
export async function GET() {
  return Response.json({
    ok: true,
    endpoint: "resend",
    configured: webhookConfigured(),
    database: hasDb(),
  });
}
