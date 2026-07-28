import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

/* ------------------------------------------------------------------
   Resend webhook signatures.

   Resend signs with Svix, which is a documented, boring scheme:

     signedContent = `${svix-id}.${svix-timestamp}.${rawBody}`
     signature     = base64(HMAC-SHA256(secretBytes, signedContent))

   The secret arrives as `whsec_<base64>`; the bytes that key the HMAC
   are the base64 decoded *after* stripping that prefix. Getting this
   wrong fails open in the worst way — the endpoint is public, and
   anything that reaches it gets written to the database — so this
   file has no "skip verification" branch. Without a configured
   secret, verify() returns false and the route 503s.

   Two details that matter:

     · the raw body must be verified byte-for-byte, before any JSON
       parsing, because re-serializing changes key order and
       whitespace and the signature is over the bytes Resend sent
     · the header carries a space-separated list of `v1,<sig>` pairs
       (Svix rotates secrets by sending several), so any one match is
       a pass, and each comparison is timing-safe
------------------------------------------------------------------ */

/* Svix's own tolerance. Rejecting old timestamps is what stops a
   captured-and-replayed delivery from being accepted forever. */
const TOLERANCE_SECONDS = 5 * 60;

export function webhookConfigured() {
  return Boolean(process.env.RESEND_WEBHOOK_SECRET);
}

function secretBytes() {
  const raw = String(process.env.RESEND_WEBHOOK_SECRET || "");
  const encoded = raw.startsWith("whsec_") ? raw.slice("whsec_".length) : raw;
  return Buffer.from(encoded, "base64");
}

function matches(a, b) {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  return left.length === right.length && timingSafeEqual(left, right);
}

/**
 * @param {string} rawBody exactly the bytes received, unparsed
 * @param {Headers} headers
 * @returns {{ ok: true } | { ok: false, reason: string }}
 */
export function verifyResendSignature(rawBody, headers) {
  if (!webhookConfigured()) return { ok: false, reason: "no secret configured" };

  const id = headers.get("svix-id");
  const timestamp = headers.get("svix-timestamp");
  const signature = headers.get("svix-signature");
  if (!id || !timestamp || !signature) return { ok: false, reason: "missing svix headers" };

  const sent = Number(timestamp);
  if (!Number.isFinite(sent)) return { ok: false, reason: "bad timestamp" };
  const drift = Math.abs(Date.now() / 1000 - sent);
  if (drift > TOLERANCE_SECONDS) return { ok: false, reason: "timestamp outside tolerance" };

  const expected = createHmac("sha256", secretBytes())
    .update(`${id}.${timestamp}.${rawBody}`)
    .digest("base64");

  const offered = signature
    .split(" ")
    .map((part) => part.split(",", 2))
    .filter(([version]) => version === "v1")
    .map(([, value]) => value);

  if (!offered.length) return { ok: false, reason: "no v1 signature" };
  if (!offered.some((candidate) => matches(candidate, expected))) {
    return { ok: false, reason: "signature mismatch" };
  }

  return { ok: true, eventId: id };
}
