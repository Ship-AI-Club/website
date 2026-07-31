import { hasDb, sql } from "../../../lib/db";
import { FIELD_LIMITS, isEmail, normalizeEmail } from "../../../lib/waitlist";
import { PROGRAMS } from "../../../lib/programs";

/* Public POST — no account, no session. The only thing standing
   between this and a bot is the honeypot and the per-IP hourly cap,
   which is the same pair the rest of the site relies on.

   Nothing here logs an address. A waitlist is a list of people who
   have not agreed to anything yet, and server logs are the easiest
   place for one to leak out of. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Generous for a household or an office on one NAT, tight enough that
   a script doesn't get to fill the table. Mirrors lib/auth.js. */
const MAX_PER_IP_HOUR = 12;

/* Only programs that are actually waiting on dates take signups —
   otherwise the endpoint is an open write keyed by any string. */
const OPEN_SLUGS = PROGRAMS.filter((p) => !p.startISO).map((p) => p.slug);

function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim().slice(0, 60);
  return request.headers.get("x-real-ip")?.slice(0, 60) || "";
}

function fail(error, status = 400) {
  return Response.json({ error }, { status });
}

export async function POST(request) {
  if (!hasDb()) {
    return fail("The waitlist is offline for a moment. Try again shortly, or join the Discord.", 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Malformed request.");
  }

  // honeypot: a real person never fills a field they can't see
  if (String(body.website ?? "").trim()) {
    return Response.json({ ok: true, status: "added" });
  }

  const program = String(body.program || "");
  if (!OPEN_SLUGS.includes(program)) {
    return fail("That program isn't taking waitlist signups.");
  }

  const name = String(body.name ?? "").trim();
  const company = String(body.company ?? "").trim();
  const email = normalizeEmail(body.email);
  const goal = String(body.goal ?? "").trim();
  const notes = String(body.notes ?? "").trim();

  if (!name) return fail("A name — whatever you go by is fine.");
  if (!isEmail(email)) return fail("That email doesn't look right. We only use it for dates.");
  if (!goal) return fail("Tell us what you want to walk out with. One line is plenty.");

  /* Rejected rather than truncated. Silently cutting somebody's
     sentence in half and storing the stump is worse than saying so. */
  const overlong = Object.entries({ name, company, email, goal, notes }).find(
    ([field, value]) => value.length > FIELD_LIMITS[field],
  );
  if (overlong) {
    return fail(`That ${overlong[0]} is longer than we can store — keep it under ${FIELD_LIMITS[overlong[0]]} characters.`);
  }

  const ip = clientIp(request);

  try {
    if (ip) {
      const [{ n }] = await sql`
        select count(*)::int as n from waitlist
         where ip = ${ip} and created_at > now() - interval '1 hour'`;
      if (n >= MAX_PER_IP_HOUR) {
        return fail("That's a lot of signups from one network. Try again in an hour, or ask in the Discord.", 429);
      }
    }

    /* do nothing, not do update: a second submission is the same
       person checking, and it must not let anyone who knows an
       address overwrite what that person wrote. */
    const rows = await sql`
      insert into waitlist (program, name, company, email, goal, notes, ip)
      values (${program}, ${name}, ${company}, ${email}, ${goal}, ${notes}, ${ip})
      on conflict (program, email) do nothing
      returning id`;

    if (!rows.length) {
      return Response.json({ ok: true, status: "already" });
    }

    return Response.json({ ok: true, status: "added" });
  } catch (error) {
    console.error("waitlist: could not record signup", error?.message || error);
    return fail("We couldn't save that. Try again, or tell us in the Discord.", 500);
  }
}
