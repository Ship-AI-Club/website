import "server-only";

import { sql } from "./db";

/* ------------------------------------------------------------------
   Mail sent to shipai.club.

   Receiving is catch-all — every address at the domain reaches the
   webhook — so santos@ and hi@ both arrive here and `to_addrs` is
   what tells them apart. Nothing needs configuring per alias, which
   also means a typo'd address still reaches us rather than bouncing.

   The webhook payload is metadata only: no body, no headers, no
   attachment contents. The body is a second call, and it needs a key
   with read permission — the sending key can't do it. That's why
   there are two:

     RESEND_API_KEY       send-only, used to send
     RESEND_READ_API_KEY  full access, used only here to read bodies

   With the read key unset, mail still lands and is still listed; the
   body just shows as unavailable. That degrades to "you can see who
   wrote and about what", which is worth having on its own.
------------------------------------------------------------------ */

const API = "https://api.resend.com";

export function inboundReadConfigured() {
  return Boolean(process.env.RESEND_READ_API_KEY);
}

/** Addresses we consider ours, for display and routing. */
export const INBOX_ADDRESSES = ["hi@shipai.club", "santos@shipai.club"];

function list(value) {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).map((v) => String(v).slice(0, 320));
}

/**
 * Fetches the body of a received email. Returns null when the read
 * key is missing or the call fails — the caller keeps the metadata
 * row either way and can retry later.
 */
export async function fetchInboundBody(emailId) {
  const key = process.env.RESEND_READ_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(`${API}/emails/received/${encodeURIComponent(emailId)}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) {
      console.error("inbound: could not read body", emailId, res.status);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("inbound: body fetch failed", error);
    return null;
  }
}

/**
 * Stores an `email.received` event. Idempotent on the Resend email
 * id, so a webhook retry updates rather than duplicates — and a
 * retry that arrives after the body was fetched doesn't wipe it.
 */
export async function storeInbound(data) {
  const id = String(data?.email_id || data?.id || "");
  if (!id) return null;

  const to = list(data.to);
  const body = await fetchInboundBody(id);

  await sql`
    insert into inbound_emails
      (id, message_id, from_addr, to_addrs, cc_addrs, received_for, subject,
       body_text, body_html, attachments, has_body, spam, received_at)
    values
      (${id}, ${String(data.message_id ?? "")}, ${String(data.from ?? "")},
       ${to}::text[], ${list(data.cc)}::text[], ${String(data.received_for ?? "")},
       ${String(data.subject ?? "").slice(0, 500)},
       ${String(body?.text ?? "")}, ${String(body?.html ?? "")},
       ${JSON.stringify(data.attachments ?? [])}::jsonb,
       ${Boolean(body)}, ${Boolean(data.spam)},
       ${data.created_at ? new Date(data.created_at).toISOString() : new Date().toISOString()})
    on conflict (id) do update set
      subject   = excluded.subject,
      from_addr = excluded.from_addr,
      to_addrs  = excluded.to_addrs,
      /* only overwrite a body we actually managed to fetch */
      body_text = case when excluded.has_body then excluded.body_text else inbound_emails.body_text end,
      body_html = case when excluded.has_body then excluded.body_html else inbound_emails.body_html end,
      has_body  = inbound_emails.has_body or excluded.has_body`;

  return id;
}

/** Backfills bodies for rows whose fetch failed the first time. */
export async function backfillBodies(limit = 20) {
  if (!inboundReadConfigured()) return 0;

  const rows = await sql`
    select id from inbound_emails where has_body = false order by received_at desc limit ${limit}`;

  let filled = 0;
  for (const row of rows) {
    const body = await fetchInboundBody(row.id);
    if (!body) continue;
    await sql`
      update inbound_emails
         set body_text = ${String(body.text ?? "")},
             body_html = ${String(body.html ?? "")},
             has_body = true
       where id = ${row.id}`;
    filled += 1;
  }
  return filled;
}
