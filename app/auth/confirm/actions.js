"use server";

import { redirect } from "next/navigation";
import { verifyLoginToken } from "../../../lib/auth";
import { redeemPendingInvite } from "../../../lib/invites";
import { safeNext, afterSignIn } from "../../../lib/nav";

export async function confirmSignInAction(formData) {
  const next = safeNext(formData.get("next"));
  const result = await verifyLoginToken(formData.get("token"));

  if (result.error) {
    const params = new URLSearchParams({ error: result.error, next });
    redirect(`/login?${params}`);
  }

  await redeemPendingInvite(result.user);
  redirect(afterSignIn(result.user, next));
}
