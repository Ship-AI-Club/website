import "server-only";

import { randomInt } from "node:crypto";
import { cookies } from "next/headers";

import { sql, one } from "./db";
import { ROLE_IDS, normalizeEmail } from "./accounts";

/* ------------------------------------------------------------------
   Invites.

   An admin decides the roles up front and hands over a link. That is
   the whole point: a package — "you're mentoring and you're
   sponsoring" — becomes one link rather than the person filing two
   requests and the admin approving both.

   Redemption happens inside the sign-in action, not during a render:
   granting a role is a write, and a write in a render is a bug
   waiting for a double-invoke. The code is parked in a short-lived
   httpOnly cookie between clicking the link and finishing sign-in.
------------------------------------------------------------------ */

export const INVITE_COOKIE = "shipai_invite";

/* Long enough that guessing is hopeless — 32^10 is about 50 bits —
   and drawn from the alphabet that survives being read down a phone.
   No I/O/0/1. */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function newInviteCode(length = 10) {
  let out = "";
  for (let i = 0; i < length; i += 1) out += ALPHABET[randomInt(0, ALPHABET.length)];
  return out;
}

export function normalizeCode(value) {
  return String(value ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 32);
}

/* Admin is deliberately not invitable. Every other role is a job at
   an event; admin is the ability to grant roles, read everyone's
   email and issue credentials. A leaked or forwarded link must never
   be able to hand that over — an admin is made by an admin, in the
   admin area, deliberately. */
export const INVITABLE_ROLES = ROLE_IDS.filter((r) => r !== "admin");

export function invitableOnly(roles) {
  return (Array.isArray(roles) ? roles : []).filter((r) => INVITABLE_ROLES.includes(r));
}

/** The invite behind a code, if it can still be used. */
export async function usableInvite(rawCode) {
  const code = normalizeCode(rawCode);
  if (!code) return null;

  return one(await sql`
    select * from invites
     where code = ${code}
       and revoked_at is null
       and (expires_at is null or expires_at > now())
       and uses < max_uses
     limit 1`);
}

/* ---------- the cookie, between the link and the sign-in ---------- */

export async function rememberInvite(code) {
  const store = await cookies();
  store.set(INVITE_COOKIE, normalizeCode(code), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    /* An hour is plenty to read an email and type a code, and short
       enough that a stale invite doesn't attach itself to whoever
       next signs in on a shared machine. */
    maxAge: 60 * 60,
  });
}

export async function forgetInvite() {
  const store = await cookies();
  store.delete(INVITE_COOKIE);
}

/**
 * Grants the invite's roles to a freshly signed-in user.
 *
 * Called from the sign-in action once the session exists. Silent on
 * failure by design — a bad or spent code must not block somebody
 * signing in, it just doesn't grant anything.
 *
 * Returns the roles granted, or [].
 */
export async function redeemPendingInvite(user) {
  const store = await cookies();
  const code = store.get(INVITE_COOKIE)?.value;
  if (!code) return [];

  try {
    const invite = await usableInvite(code);
    if (!invite) return [];

    /* A code addressed to one person only works for that person, so
       forwarding the email hands over nothing. */
    if (invite.email && normalizeEmail(invite.email) !== user.email) return [];

    const roles = invitableOnly(invite.roles);
    if (!roles.length) return [];

    /* Claiming the redemption first is what makes this safe to run
       twice: the primary key rejects the second attempt, so a double
       submit can't consume two uses of a shared code. */
    const claimed = await sql`
      insert into invite_redemptions (invite_id, user_id)
      values (${invite.id}, ${user.id})
      on conflict do nothing
      returning invite_id`;
    if (!claimed.length) return [];

    for (const role of roles) {
      await sql`
        insert into user_roles (user_id, role, granted_by)
        values (${user.id}, ${role}, ${invite.created_by})
        on conflict do nothing`;
    }

    /* Guarded so two people redeeming the last use at once can't push
       it past the cap. */
    await sql`
      update invites set uses = uses + 1
       where id = ${invite.id} and uses < max_uses`;

    await sql`
      insert into audit_log (actor_id, action, target, meta)
      values (${user.id}, 'redeem-invite', ${invite.id},
              ${JSON.stringify({ roles, code: invite.code })}::jsonb)`;

    return roles;
  } catch (error) {
    console.error("invites: redemption failed", error);
    return [];
  } finally {
    await forgetInvite();
  }
}
