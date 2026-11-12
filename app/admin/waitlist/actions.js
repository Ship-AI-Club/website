"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "../../../lib/auth";
import { hasDb } from "../../../lib/db";
import { SITE, mailConfigured, workshopDateEmail } from "../../../lib/email";
import { workshopBySlug } from "../../../lib/workshops";
import { ensureWaitlistNotified, markDateNoticeSent, pendingDateNotices } from "../../../lib/waitlist-notify";

const LIMITS = { when: 120, where: 160 };

/* Sends the date to everyone on one workshop's list who hasn't had it.
   Each address is marked only after its own message is accepted, so a
   failure part-way through leaves the rest pending for the next press. */
export async function announceWorkshopDate(previous, form) {
  await requireAdmin("/admin/waitlist");

  const slug = String(form.get("slug") || "");
  const workshop = workshopBySlug(slug);
  if (!workshop) return { error: "Choose a workshop from the list." };

  const when = String(form.get("when") || "").trim();
  const where = String(form.get("where") || "").trim();
  if (!when) return { error: "Add the date and time people should see." };
  if (!where) return { error: "Add where it takes place." };
  if (when.length > LIMITS.when || where.length > LIMITS.where) return { error: "Keep the date and the place short. One line each." };
  if (form.get("confirm") !== "on") return { error: "Tick the box to confirm the date is final." };

  if (!hasDb()) return { error: "The database is unavailable, so nothing was sent." };
  /* send() reports success when no mail key is set, because local
     development prints the message instead. Marking people as told on
     the strength of that would be a lie. */
  if (!mailConfigured()) return { error: "Email isn't configured here, so nothing was sent." };

  try {
    await ensureWaitlistNotified();
    const people = await pendingDateNotices(slug);
    if (!people.length) return { ok: "Everyone on this list already has the date." };

    const link = `${SITE}/workshops/${slug}`;
    let sent = 0;
    let failed = 0;
    for (const person of people) {
      const result = await workshopDateEmail({ to: person.email, workshop: workshop.name, when, where, link });
      if (result.ok && !result.skipped) {
        await markDateNoticeSent(person.id);
        sent += 1;
      } else {
        failed += 1;
      }
    }

    revalidatePath("/admin/waitlist");
    if (failed) return { error: `Sent to ${sent}. ${failed} did not go through and are still pending. Press send again to retry them.` };
    return { ok: `Sent the date to ${sent} ${sent === 1 ? "person" : "people"}.` };
  } catch (error) {
    console.error("waitlist: date announcement failed", error?.message || error);
    return { error: "Something failed part-way. Anyone already emailed is marked, so it is safe to press send again." };
  }
}
