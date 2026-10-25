import { safeNext } from "../../../lib/nav";
import { NextResponse } from "next/server";

/* Email security scanners follow links before the recipient opens them.
   GET (and Next's automatic HEAD) must never consume a login code.
   Keep existing email links working by sending them to a confirmation
   form; only its server action exchanges the token for a session. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const url = new URL("/auth/confirm", request.url);
  url.searchParams.set("token", (params.get("token") || "").slice(0, 200));
  url.searchParams.set("next", safeNext(params.get("next")));
  const response = NextResponse.redirect(url);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
