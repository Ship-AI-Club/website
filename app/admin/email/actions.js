"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "../../../lib/auth";
import { sql, one } from "../../../lib/db";
import { LIMITS, isEmail, text } from "../../../lib/accounts";
import { replyToInbound } from "../../../lib/email";
import { backfillBodies } from "../../../lib/inbound";

/* Actions for /admin/email. Reading mail addressed to the club is an
   admin-only capability, so every one of these re-checks. */

async function audit(actorId, action, target, meta = {}) {
  try {
    await sql`
      insert into audit_log (actor_id, action, target, meta)
      values (${actorId}, ${action}, ${target}, ${JSON.stringify(meta)}::jsonb)`;
  } catch {
    // never blocks
  }
}

export async function replyAction(prev, formData) {
  const admin = await requireAdmin();

  const id = text(formData.get("inbound_id"), 120);
  const body = text(formData.get("body"), LIMITS.notes);
  if (!body) return { error: "Nothing to send — write something first." };

  const mail = one(await sql`select * from inbound_emails where id = ${id}`);
  if (!mail) return { error: "That message is gone." };

  /* The From line of an inbound email is display-formatted
     ("Name <a@b.c>"). Pull the address out, and refuse to send if
     what's left isn't one — a reply to a malformed sender should
     fail loudly here rather than at Resend. */
  const address = (mail.from_addr.match(/<([^>]+)>/)?.[1] ?? mail.from_addr).trim();
  if (!isEmail(address)) return { error: `Can't reply — "${mail.from_addr}" isn't an address.` };

  const sent = await replyToInbound({
    to: address,
    subject: mail.subject || "(no subject)",
    body,
    messageId: mail.message_id,
    /* Reply from whichever of ours they wrote to, so the thread
       stays on the address they chose. */
    from: mail.to_addrs?.[0],
  });

  if (!sent.ok) return { error: "Resend wouldn't take it. Try again in a moment." };

  await sql`update inbound_emails set replied_at = now(), read_at = coalesce(read_at, now()) where id = ${id}`;
  await audit(admin.id, "reply-inbound", id, { to: address });

  revalidatePath("/admin/email");
  return { ok: `Replied to ${address}.` };
}

export async function markReadAction(prev, formData) {
  await requireAdmin();
  const id = text(formData.get("inbound_id"), 120);
  const unread = String(formData.get("unread")) === "true";

  await sql`
    update inbound_emails set read_at = ${unread ? null : new Date().toISOString()}
     where id = ${id}`;

  revalidatePath("/admin/email");
  return { ok: unread ? "Marked unread." : "Marked read." };
}

export async function archiveAction(prev, formData) {
  const admin = await requireAdmin();
  const id = text(formData.get("inbound_id"), 120);

  await sql`update inbound_emails set archived_at = now() where id = ${id}`;
  await audit(admin.id, "archive-inbound", id);

  revalidatePath("/admin/email");
  return { ok: "Archived." };
}

/** Retries the body fetch for messages whose first attempt failed. */
export async function backfillAction() {
  await requireAdmin();
  const filled = await backfillBodies();
  revalidatePath("/admin/email");
  return { ok: filled ? `Fetched ${filled} message bodies.` : "Nothing waiting on a body." };
}
