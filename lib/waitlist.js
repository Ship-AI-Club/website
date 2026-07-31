/* ------------------------------------------------------------------
   Program waitlist — shared contract.

   A program with no dates on it can't be RSVP'd to, so the only thing
   it can honestly offer is "tell me when". This is that: name, email
   and what they're trying to get built, posted to /api/waitlist and
   read back in /admin/waitlist.

   The browser form and the route handler both validate against the
   constants here, so the field caps and the email shape are defined
   once. No `server-only` — the client component imports this too.
------------------------------------------------------------------ */

export const FIELD_LIMITS = {
  name: 120,
  company: 160,
  email: 254, // the RFC 5321 cap on a whole address
  goal: 600,
  notes: 1000,
};

/* Same shape check the accounts flow uses. Deliberately loose: the
   only address that really counts as valid is one that receives mail,
   and everything past "has an @ and a dot" starts rejecting real
   people for the sake of a regex. */
export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}
