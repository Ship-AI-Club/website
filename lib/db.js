import { neon, neonConfig } from "@neondatabase/serverless";

/* ------------------------------------------------------------------
   The database handle.

   One Neon connection over HTTP — no pool to manage, which is what
   you want on serverless. `sql` is a tagged template and the only way
   queries are written in this codebase; interpolated values are always
   sent as bound parameters, so there is no string-concatenated SQL
   anywhere and no place for injection to start.

     const rows = await sql`select * from users where email = ${email}`

   DATABASE_URL is deliberately allowed to be missing. The marketing
   site is the part of shipai.club that matters most, and a bad or
   absent database env must not take it down or break `next build` —
   so `hasDb()` is false, the account pages render an "accounts are
   offline" state, and every public page carries on unaffected.
------------------------------------------------------------------ */

/* Local development against a Postgres in Docker instead of a cloud
   branch. The driver speaks HTTP to Neon's SQL endpoint, so a plain
   Postgres needs a proxy in front of it; setting NEON_LOCAL_PROXY
   points the driver at that proxy. Opt-in by env var and unset in
   production, so the deployed site can't accidentally take this path
   — and the queries under test are the same queries either way. */
if (process.env.NEON_LOCAL_PROXY) {
  neonConfig.fetchEndpoint = process.env.NEON_LOCAL_PROXY;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

let handle = null;

export function hasDb() {
  return Boolean(process.env.DATABASE_URL);
}

/** Throws if called without DATABASE_URL — guard with hasDb() first. */
export function db() {
  if (handle) return handle;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Accounts, judging and certificates need it; " +
        "run `vercel env pull .env.local`, or see the README.",
    );
  }
  handle = neon(url);
  return handle;
}

/**
 * `sql` without the db() call at every site. Same tagged-template API.
 *
 *   import { sql } from "./db";
 *   await sql`select 1`;
 */
export const sql = (strings, ...values) => db()(strings, ...values);

/** First row or null — the shape almost every lookup in here wants. */
export function one(rows) {
  return rows && rows.length ? rows[0] : null;
}

/**
 * Runs a read and returns `fallback` if the database is unreachable.
 * Used by the public pages (results, certificates) so a Neon outage
 * degrades them to "not published yet" instead of a 500.
 */
export async function safeRead(fn, fallback) {
  if (!hasDb()) return fallback;
  try {
    return await fn();
  } catch (error) {
    console.error("db: read failed", error);
    return fallback;
  }
}
