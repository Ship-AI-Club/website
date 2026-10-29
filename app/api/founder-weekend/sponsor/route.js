import { hasDb, sql } from "../../../../lib/db";
import { isEmail } from "../../../../lib/accounts";
import { adminNotice } from "../../../../lib/email";
import { FOUNDER_WEEKEND as FW, FW_SPONSOR_TIERS } from "../../../../lib/founder-weekend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMITS = { name: 120, email: 160, company: 160, site: 400, message: 800 };
const MAX_PER_IP_HOUR = 5;
const MAX_PER_HOUR = 60;
const UNSAFE = /[<>\r\n]/;

function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim().slice(0, 60);
  return request.headers.get("x-real-ip")?.slice(0, 60) || "";
}
const UNDECIDED = "undecided";

function fail(error, status = 400) {
  return Response.json({ error }, { status });
}

export async function POST(request) {
  if (!hasDb()) return fail("The sponsor form is offline for a moment. Try again shortly.", 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Malformed request.");
  }

  if (String(body.website ?? "").trim()) return Response.json({ ok: true });

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const company = String(body.company ?? "").trim();
  const site = String(body.site ?? "").trim();
  const message = String(body.message ?? "").trim();
  const packageId = String(body.package ?? "");
  const tier = FW_SPONSOR_TIERS.find((t) => t.id === packageId);

  if (!name || UNSAFE.test(name)) return fail("Add your name.");
  if (!isEmail(email) || UNSAFE.test(email) || /["',;]/.test(email)) return fail("That email doesn't look right.");
  if (!company) return fail("Add the company or brand you'd sponsor as.");
  if (!tier && packageId !== UNDECIDED) return fail("Pick a package, or choose not sure yet.");

  const overlong = Object.entries({ name, email, company, site, message }).find(([k, v]) => v.length > LIMITS[k]);
  if (overlong) return fail(`That ${overlong[0]} is too long. Keep it under ${LIMITS[overlong[0]]} characters.`);

  const contact = `Contact: ${name} <${email}>`;
  const items = tier ? `${FW.name}: ${tier.name} ($${tier.price.toLocaleString("en-US")})` : `${FW.name}: not sure yet`;

  const ip = clientIp(request);

  try {
    const [{ recent, fromIp }] = await sql`
      select count(*)::int as recent,
             count(*) filter (where meta->>'ip' = ${ip})::int as "fromIp"
        from audit_log
       where action = 'fw-sponsor-inquiry' and created_at > now() - interval '1 hour'`;
    if ((ip && fromIp >= MAX_PER_IP_HOUR) || recent >= MAX_PER_HOUR) {
      return fail("That's a lot of inquiries at once. Try again in an hour.", 429);
    }

    const [{ mine }] = await sql`
      select count(*)::int as mine from sponsorships
       where status = 'inquiry' and note like ${`${contact}%`} and created_at > now() - interval '1 hour'`;
    if (mine > 0) return Response.json({ ok: true });

    await sql`
      insert into audit_log (action, target, meta)
      values ('fw-sponsor-inquiry', ${company}, ${JSON.stringify({ ip, hackathon: FW.id })}::jsonb)`;

    await sql`
      insert into sponsorships (org, amount, items, status, credit_name, website, note, is_public)
      values (${company}, ${tier?.price ?? 0}, ${items}, 'inquiry', ${company}, ${site},
              ${message ? `${contact}\n${message}` : contact}, false)`;
  } catch {
    return fail("That didn't go through. Try again in a moment.", 500);
  }

  await adminNotice({
    subject: `Sponsor inquiry: ${company} (${tier ? tier.name : "not sure yet"})`,
    lines: [
      `${name} <${email}> wants to sponsor ${FW.name}.`,
      `Company: ${company}`,
      `Package: ${items}`,
      site ? `Website: ${site}` : "",
      message ? `Message: ${message}` : "",
    ].filter(Boolean),
    cta: { href: "https://www.shipai.club/admin/sponsors", label: "Open sponsors" },
    replyTo: email,
  }).catch(() => {});

  return Response.json({ ok: true });
}
