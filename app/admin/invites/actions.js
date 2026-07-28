"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "../../../lib/auth";
import { sql, one } from "../../../lib/db";
import { LIMITS, isEmail, normalizeEmail, pickIds, text } from "../../../lib/accounts";
import { INVITABLE_ROLES, newInviteCode, normalizeCode } from "../../../lib/invites";

/* Invites are how a package becomes one link. Every action here is
   admin-only and audited: an invite is the ability to hand out roles,
   so who made one and who killed it are worth being able to answer. */

async function audit(actorId, action, target, meta = {}) {
  try {
    await sql`
      insert into audit_log (actor_id, action, target, meta)
      values (${actorId}, ${action}, ${target}, ${JSON.stringify(meta)}::jsonb)`;
  } catch {
    // never blocks
  }
}

export async function createInviteAction(prev, formData) {
  const admin = await requireAdmin("/admin/invites");

  /* invitableOnly is applied again at redemption — this is the first
     of two gates, not the only one. Admin is never in the list. */
  const roles = pickIds(formData.getAll("roles"), INVITABLE_ROLES);
  if (!roles.length) return { error: "Pick at least one role for this invite to grant." };

  const email = normalizeEmail(formData.get("email"));
  if (email && !isEmail(email)) {
    return { error: "That doesn't look like an email address. Leave it blank for an open link." };
  }

  const maxUses = Math.max(1, Math.min(200, Number(formData.get("max_uses")) || 1));
  const days = Math.max(0, Math.min(365, Number(formData.get("expires_days")) || 0));

  const code = newInviteCode();

  /* One static template with bound parameters — `sql` fragments don't
     nest, so the "no expiry" case is a CASE expression rather than a
     composed snippet. */
  await sql`
    insert into invites (code, roles, email, label, note, max_uses, expires_at, created_by)
    values (${code}, ${roles}::text[], ${email},
            ${text(formData.get("label"), 120)}, ${text(formData.get("note"), LIMITS.note)},
            ${maxUses},
            case when ${days}::int > 0
                 then now() + make_interval(days => ${days}::int)
                 else null end,
            ${admin.id})`;

  await audit(admin.id, "create-invite", code, { roles, maxUses, email });

  revalidatePath("/admin/invites");
  return { ok: `Invite created. Code ${code}.`, code };
}

export async function revokeInviteAction(prev, formData) {
  const admin = await requireAdmin("/admin/invites");
  const id = text(formData.get("invite_id"), 40);

  const row = one(await sql`
    update invites set revoked_at = now()
     where id = ${id} and revoked_at is null
    returning code`);

  await audit(admin.id, "revoke-invite", id, { code: row?.code });

  revalidatePath("/admin/invites");
  return { ok: row ? `${row.code} revoked. The link no longer grants anything.` : "Already revoked." };
}
