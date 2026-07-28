"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "../../../lib/auth";
import { LIMITS, isEmail, text } from "../../../lib/accounts";
import { sql } from "../../../lib/db";
import { send } from "../../../lib/email";
import { BROADCAST_SEGMENTS, CHECKIN_DAYS, broadcastRecipients } from "../../../lib/ops";
import { SETTINGS, setSetting } from "../../../lib/settings";

async function audit(actorId, action, target, meta = {}) {
  try {
    await sql`
      insert into audit_log (actor_id, action, target, meta)
      values (${actorId}, ${action}, ${target}, ${JSON.stringify(meta)}::jsonb)`;
  } catch {
    // Audit is best effort and never blocks the operation it describes.
  }
}

function refreshOps() {
  revalidatePath("/admin/ops");
  revalidatePath("/admin/ops/checkin");
  revalidatePath("/admin/ops/broadcast");
  revalidatePath("/admin/ops/catering");
  revalidatePath("/admin", "layout");
}

export async function setOpsSettingAction(prevState, formData) {
  const admin = await requireAdmin();

  const key = text(formData.get("key"), 50);
  const value = String(formData.get("value")) === "true";
  const setting = SETTINGS.find((item) => item.key === key);
  if (!setting) return { error: "Unknown setting." };
  if (!["true", "false"].includes(String(formData.get("value")))) {
    return { error: "Setting value must be true or false." };
  }

  await setSetting(key, value);
  refreshOps();
  await audit(admin.id, "set-ops-setting", key, { value });
  return { ok: `${setting.label}: ${value ? "on" : "off"}.` };
}

export async function toggleCheckinAction(prevState, formData) {
  const admin = await requireAdmin();

  const userId = text(formData.get("user_id"), 80);
  const day = text(formData.get("day"), 20).toLowerCase();
  const mode = text(formData.get("mode"), 20);
  if (!userId || !CHECKIN_DAYS.includes(day)) return { error: "Choose a valid attendee and event day." };
  if (mode !== "checkin" && mode !== "undo") return { error: "Unknown check-in action." };

  const active = await sql`
    select u.id from users u
     join registrations r on r.user_id = u.id
    where u.id = ${userId} and r.withdrawn_at is null`;
  if (!active.length) return { error: "That registration is not active." };

  if (mode === "checkin") {
    await sql`
      insert into event_checkins (user_id, day, by)
      values (${userId}, ${day}, ${admin.id})
      on conflict (user_id, day) do update
        set checked_in_at = now(), by = excluded.by`;
  } else {
    await sql`
      delete from event_checkins where user_id = ${userId} and day = ${day}`;
  }

  refreshOps();
  await audit(admin.id, mode === "checkin" ? "check-in" : "undo-check-in", userId, { day });
  return { ok: mode === "checkin" ? "Checked in." : "Check-in undone." };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendBounded(recipients, message, concurrency = 10) {
  let cursor = 0;
  let successful = 0;
  const workerCount = Math.min(concurrency, recipients.length);

  async function worker() {
    while (cursor < recipients.length) {
      const index = cursor;
      cursor += 1;
      const recipient = recipients[index];
      try {
        const result = await send({
          to: recipient.email,
          subject: message.subject,
          text: message.text,
          heading: message.heading,
          body: message.body,
        });
        if (result?.ok) successful += 1;
      } catch {
        // Keep the other recipients moving; the attempt is recorded below.
      }
    }
  }

  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return successful;
}

export async function sendBroadcastAction(prevState, formData) {
  const admin = await requireAdmin();

  const segment = text(formData.get("segment"), 40);
  const subject = text(formData.get("subject"), 200);
  const body = text(formData.get("body"), LIMITS.message);
  const day = text(formData.get("day"), 20).toLowerCase();
  const confirm = String(formData.get("confirm"));
  if (!BROADCAST_SEGMENTS.some((item) => item.id === segment)) return { error: "Choose a valid recipient segment." };
  if (!CHECKIN_DAYS.includes(day)) return { error: "Choose a valid event day." };
  if (!subject) return { error: "Add a subject." };
  if (!body) return { error: "Write a message first." };
  if (confirm !== "send") return { error: "Confirm the send explicitly." };

  const recipients = (await broadcastRecipients(segment, day)).filter((recipient) => isEmail(recipient.email));
  if (!recipients.length) return { error: "That segment has no valid recipients." };
  if (recipients.length > 500) return { error: "That segment is over the 500-recipient limit." };

  const successful = await sendBounded(recipients, {
    subject,
    text: body,
    heading: escapeHtml(subject),
    body: escapeHtml(body).replace(/\r?\n/g, "<br />"),
  });

  await sql`
    insert into broadcasts (segment, subject, body, recipients, sent_by)
    values (${segment}, ${subject}, ${body}, ${successful}, ${admin.id})`;

  refreshOps();
  await audit(admin.id, "send-broadcast", segment, {
    day,
    attempted: recipients.length,
    successful,
    subject,
  });

  if (successful === recipients.length) return { ok: `Sent to ${successful} recipient${successful === 1 ? "" : "s"}.` };
  return { ok: `Attempted ${recipients.length}; sent ${successful}.` };
}
