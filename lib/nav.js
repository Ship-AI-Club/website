/* ------------------------------------------------------------------
   Where a redirect is allowed to send you.

   `?next=` is threaded through login, onboarding and every gate, so it
   is attacker-controlled by definition: a link to
   /login?next=https://evil.example lands a signed-in user on someone
   else's site wearing our nav. Everything that consumes `next` runs it
   through safeNext() first.

   The rule is narrow on purpose — one leading slash, no second slash,
   no backslash, no scheme. Anything else falls back to /dashboard.
------------------------------------------------------------------ */

export const DEFAULT_NEXT = "/dashboard";

export function safeNext(value, fallback = DEFAULT_NEXT) {
  const raw = String(value ?? "").trim();
  if (!raw) return fallback;
  if (!raw.startsWith("/")) return fallback;
  // "//evil.example" and "/\evil.example" are both protocol-relative
  if (raw.startsWith("//") || raw.startsWith("/\\")) return fallback;
  if (raw.includes("://")) return fallback;
  return raw.slice(0, 300);
}
