import "server-only";

import { createHash, randomInt, randomBytes, timingSafeEqual } from "node:crypto";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { sql, one, hasDb } from "./db";
import { normalizeEmail, text, LIMITS } from "./accounts";
import { loginCodeEmail, mailConfigured, SITE } from "./email";

/* ------------------------------------------------------------------
   Email one-time-password auth.

   There are no passwords in this system, which removes the entire
   class of problems that come with storing them. What replaces them:

     · a 6-digit code, valid 10 minutes, single use, 5 attempts
     · a magic link carrying a 32-byte token, same row, same lifetime
     · an opaque 32-byte session token in an httpOnly cookie

   Nothing reversible is stored. The code, the link token and the
   session token are all kept as sha-256 hashes of (pepper + value),
   so a database dump doesn't hand anyone a live session — the same
   reason you'd hash a password, applied to the things that replaced it.

   Verification compares hashes with timingSafeEqual. That matters more
   here than it would for a password: a 6-digit code has 10^6 possible
   values, so any oracle that leaks progress is worth closing.
------------------------------------------------------------------ */

const CODE_TTL_MIN = 10;
const CODE_ATTEMPTS = 5;
const SESSION_DAYS = 30;

/* Throttles. Generous enough that a person mistyping their address
   twice is unaffected, tight enough that the inbox of someone whose
   address gets typed into the form by a bot doesn't fill up. */
const MAX_CODES_PER_EMAIL_HOUR = 5;
const MAX_CODES_PER_IP_HOUR = 20;

export const SESSION_COOKIE = "shipai_session";

/* ---------- hashing ---------- */

/* A pepper, not a salt: one server-side secret mixed into every hash
   so the stored values are useless without it. Codes are six digits —
   an attacker holding an unpeppered table could rainbow the entire
   keyspace in about a second. */
function pepper() {
  const secret = process.env.AUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is not set — refusing to hash login secrets without it.");
  }
  return "development-only-pepper-do-not-use-in-production";
}

function hash(value) {
  return createHash("sha256").update(`${pepper()}:${value}`).digest("hex");
}

function hashesMatch(a, b) {
  const left = Buffer.from(String(a ?? ""), "utf8");
  const right = Buffer.from(String(b ?? ""), "utf8");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/* ---------- request context ---------- */

async function requestIp() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim().slice(0, 60);
  return h.get("x-real-ip")?.slice(0, 60) || "";
}

async function requestAgent() {
  const h = await headers();
  return (h.get("user-agent") || "").slice(0, 300);
}

/* ---------- sending a code ---------- */

/**
 * Issues a login code for `email` and sends it.
 *
 * Returns { ok } on success and { error } on failure. The error
 * strings are safe to show — none of them reveal whether an account
 * exists, because this is registration and login at once: an unknown
 * address gets a code and becomes an account when the code is used.
 */
export async function requestLoginCode(rawEmail) {
  if (!hasDb()) return { error: "Accounts are offline right now. Try again shortly." };

  const email = normalizeEmail(rawEmail);
  const ip = await requestIp();

  const [byEmail] = await sql`
    select count(*)::int as n from login_codes
    where email = ${email} and created_at > now() - interval '1 hour'`;
  if (byEmail.n >= MAX_CODES_PER_EMAIL_HOUR) {
    return { error: "That's a lot of codes. Wait an hour, or ask in the Discord." };
  }

  if (ip) {
    const [byIp] = await sql`
      select count(*)::int as n from login_codes
      where ip = ${ip} and created_at > now() - interval '1 hour'`;
    if (byIp.n >= MAX_CODES_PER_IP_HOUR) {
      return { error: "Too many sign-in attempts from this network. Try again in an hour." };
    }
  }

  /* randomInt is rejection-sampled — Math.random() would bias the
     low digits and is not a CSPRNG in the first place. */
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const token = randomBytes(32).toString("base64url");

  /* Any older unused code for this address stops working the moment a
     new one is issued, so a forwarded email can't be replayed later. */
  await sql`
    update login_codes set consumed_at = now()
    where email = ${email} and consumed_at is null`;

  /* make_interval(), not interval '…' — an interpolated value in this
     template becomes a bound parameter, and a parameter cannot appear
     inside a string literal. */
  await sql`
    insert into login_codes (email, code_hash, token_hash, expires_at, ip)
    values (${email}, ${hash(code)}, ${hash(token)},
            now() + make_interval(mins => ${CODE_TTL_MIN}), ${ip})`;

  const link = `${SITE}/auth/verify?token=${encodeURIComponent(token)}`;
  const sent = await loginCodeEmail({ to: email, code, link, minutes: CODE_TTL_MIN });

  /* In production a code we couldn't deliver is a dead end, and
     "check your email" would be a lie. Locally the code is on the
     server console, which is the intended dev flow. */
  if (!sent.ok && mailConfigured()) {
    return { error: "We couldn't send that email. Try again, or ask in the Discord." };
  }
  if (sent.skipped && process.env.NODE_ENV === "production") {
    return { error: "Email isn't configured on this deployment yet." };
  }

  return { ok: true, devCode: sent.skipped ? code : undefined };
}

/* ---------- consuming a code ---------- */

/** Finds or creates the account for a verified address. */
async function upsertUser(email) {
  const existing = one(await sql`select * from users where email = ${email}`);
  if (existing) {
    await sql`update users set last_seen_at = now() where id = ${existing.id}`;
    return existing;
  }

  const created = one(await sql`
    insert into users (email, last_seen_at) values (${email}, now())
    on conflict (email) do update set last_seen_at = now()
    returning *`);

  /* The first account to exist is the owner's. Seeding an admin any
     other way means a manual SQL step on a live database, which is
     worse. ADMIN_EMAIL, when set, also always gets the flag. */
  const [{ n }] = await sql`select count(*)::int as n from users`;
  const isOwner =
    n === 1 || normalizeEmail(process.env.ADMIN_EMAIL) === created.email;
  if (isOwner) {
    await sql`update users set is_admin = true where id = ${created.id}`;
    await sql`
      insert into user_roles (user_id, role) values (${created.id}, 'admin')
      on conflict do nothing`;
    created.is_admin = true;
  }

  return created;
}

/**
 * Exchanges a 6-digit code for a session. Returns { user } or
 * { error }. Attempts are counted on the row, so a wrong code burns
 * one of five tries rather than being free to guess again.
 */
export async function verifyLoginCode(rawEmail, rawCode) {
  if (!hasDb()) return { error: "Accounts are offline right now. Try again shortly." };

  const email = normalizeEmail(rawEmail);
  const code = text(rawCode, 12).replace(/\D/g, "");
  if (code.length !== 6) return { error: "Enter the six-digit code from the email." };

  const row = one(await sql`
    select * from login_codes
    where email = ${email} and consumed_at is null and expires_at > now()
    order by created_at desc limit 1`);

  if (!row) return { error: "That code has expired. Ask for a new one." };
  if (row.attempts >= CODE_ATTEMPTS) {
    await sql`update login_codes set consumed_at = now() where id = ${row.id}`;
    return { error: "Too many wrong codes. Ask for a new one." };
  }

  if (!hashesMatch(row.code_hash, hash(code))) {
    await sql`update login_codes set attempts = attempts + 1 where id = ${row.id}`;
    const left = CODE_ATTEMPTS - (row.attempts + 1);
    return {
      error: left > 0 ? `That code isn't right. ${left} attempt${left === 1 ? "" : "s"} left.` : "Too many wrong codes. Ask for a new one.",
    };
  }

  await sql`update login_codes set consumed_at = now() where id = ${row.id}`;
  const user = await upsertUser(email);
  await startSession(user.id);
  return { user };
}

/** The magic-link half. Same row, same single-use rule. */
export async function verifyLoginToken(rawToken) {
  if (!hasDb()) return { error: "Accounts are offline right now." };

  const token = text(rawToken, 200);
  if (!token) return { error: "That link is missing its token." };

  const row = one(await sql`
    select * from login_codes
    where token_hash = ${hash(token)} and consumed_at is null and expires_at > now()
    limit 1`);
  if (!row) return { error: "That link has expired or was already used. Ask for a new one." };

  await sql`update login_codes set consumed_at = now() where id = ${row.id}`;
  const user = await upsertUser(row.email);
  await startSession(user.id);
  return { user };
}

/* ---------- sessions ---------- */

/**
 * Mints a session and sets the cookie. Only callable from a server
 * action or route handler — Next forbids writing cookies during a
 * render, which is why login is an action and not a page effect.
 */
export async function startSession(userId) {
  const token = randomBytes(32).toString("base64url");
  const agent = await requestAgent();

  await sql`
    insert into sessions (user_id, token_hash, user_agent, expires_at)
    values (${userId}, ${hash(token)}, ${agent},
            now() + make_interval(days => ${SESSION_DAYS}))`;

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });

  return token;
}

/** Revokes the current session and clears the cookie. */
export async function endSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token && hasDb()) {
    await sql`update sessions set revoked_at = now() where token_hash = ${hash(token)}`;
  }
  store.delete(SESSION_COOKIE);
}

/** Revokes every session for a user — "sign out everywhere". */
export async function endAllSessions(userId) {
  await sql`
    update sessions set revoked_at = now()
    where user_id = ${userId} and revoked_at is null`;
}

/* ---------- reading the current user ---------- */

/**
 * The signed-in user, or null. Includes `roles` (granted) — check
 * `user.roles.includes("judge")`, never a bare `is_admin` in a page.
 *
 * Wrapped in React's `cache` so the layout, the page and any server
 * action in the same request share one lookup instead of hitting Neon
 * three times per navigation.
 */
export const currentUser = cache(async function currentUser() {
  if (!hasDb()) return null;

  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  let user = null;
  try {
    user = one(await sql`
      select u.*,
             coalesce(
               array_agg(r.role) filter (where r.role is not null),
               '{}'
             ) as roles
        from sessions s
        join users u on u.id = s.user_id
        left join user_roles r on r.user_id = u.id
       where s.token_hash = ${hash(token)}
         and s.revoked_at is null
         and s.expires_at > now()
       group by u.id`);
  } catch (error) {
    console.error("auth: session lookup failed", error);
    user = null;
  }

  if (user) {
    /* is_admin on the row and the 'admin' role are kept in step, but
       a page should only ever have to look at one of them. */
    user.roles = Array.from(new Set([...(user.roles || []), ...(user.is_admin ? ["admin"] : [])]));
  }

  return user;
});

/** currentUser(), or a redirect to /login with a return path. */
export async function requireUser(returnTo = "/dashboard") {
  const user = await currentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  return user;
}

/** requireUser(), plus a bounce to onboarding until it's done. */
export async function requireOnboarded(returnTo = "/dashboard") {
  const user = await requireUser(returnTo);
  if (!user.onboarded_at) redirect(`/onboarding?next=${encodeURIComponent(returnTo)}`);
  return user;
}

export function hasRole(user, role) {
  return Boolean(user?.roles?.includes(role));
}

export function isAdmin(user) {
  return Boolean(user?.is_admin) || hasRole(user, "admin");
}

/** Gate for /judge and /admin. 404s rather than 403s — a page you're
    not allowed into shouldn't confirm it exists. */
export async function requireRole(role, returnTo = "/dashboard") {
  const user = await requireUser(returnTo);
  if (isAdmin(user)) return user;
  if (!hasRole(user, role)) redirect("/dashboard?denied=" + encodeURIComponent(role));
  return user;
}

export async function requireAdmin(returnTo = "/admin") {
  const user = await requireUser(returnTo);
  if (!isAdmin(user)) redirect("/dashboard?denied=admin");
  return user;
}

/* ---------- housekeeping ---------- */

/**
 * Deletes spent codes and dead sessions. Called opportunistically
 * from the login action rather than on a cron — the volume here is a
 * few thousand rows a season, and a table scan on a schedule is more
 * moving parts than the problem deserves.
 */
export async function pruneExpired() {
  try {
    await sql`delete from login_codes where created_at < now() - interval '2 days'`;
    await sql`delete from sessions where expires_at < now() - interval '7 days'`;
  } catch {
    // best effort; never blocks a login
  }
}

export const AUTH_LIMITS = { CODE_TTL_MIN, CODE_ATTEMPTS, SESSION_DAYS, LIMITS };
