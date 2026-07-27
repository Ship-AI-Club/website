import { timingSafeEqual } from "node:crypto";

/* The inbox and the file proxy are gated on one shared secret, passed as
   ?key=… . Set INTAKE_ADMIN_KEY in the Vercel project; with it unset both
   routes 404, which is the correct behaviour for a page that shouldn't
   exist as far as anyone else is concerned. */

export function isAuthorized(key) {
  const expected = process.env.INTAKE_ADMIN_KEY;
  if (!expected) return false;

  const given = Buffer.from(String(key ?? ""));
  const wanted = Buffer.from(expected);
  return given.length === wanted.length && timingSafeEqual(given, wanted);
}
