import { NextResponse } from "next/server";

import { verifyLoginToken } from "../../../lib/auth";
import { redeemPendingInvite } from "../../../lib/invites";

/* The magic-link half of sign-in. The email carries a 32-byte token;
   this exchanges it for a session and sends the browser on.

   A route handler rather than a page because it has to write the
   session cookie, and Next only allows that from an action or a
   handler — never during a render. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const token = new URL(request.url).searchParams.get("token");
  const result = await verifyLoginToken(token);

  if (result.error) {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", result.error);
    return NextResponse.redirect(url);
  }

  /* Same as the code path: an invite link followed by a magic
     link should still grant what it promised. */
  await redeemPendingInvite(result.user);

  const destination = result.user.onboarded_at ? "/dashboard" : "/onboarding";
  return NextResponse.redirect(new URL(destination, request.url));
}
