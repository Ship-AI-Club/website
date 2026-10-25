import "../../account.css";

import { AccountHeader, AccountFooter } from "../../../components/account-chrome";
import { safeNext } from "../../../lib/nav";
import { confirmSignInAction } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Confirm Sign In — Ship AI",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const token = String(params?.token || "").slice(0, 200);
  const next = safeNext(params?.next);

  return (
    <>
      <AccountHeader user={null} />
      <main className="ac-page">
        <p className="ac-kicker">Ship AI account</p>
        <h1>Confirm your sign-in</h1>
        {token ? (
          <>
            <p className="ac-lede">Continue to sign in with the link from your email.</p>
            <form action={confirmSignInAction} className="ac-form is-tight">
              <input type="hidden" name="token" value={token} />
              <input type="hidden" name="next" value={next} />
              <button type="submit" className="btn btn-solid">Continue signing in</button>
            </form>
            <p className="ac-fine">
              You can also return to your original sign-in page and enter the six-digit code.
            </p>
          </>
        ) : (
          <>
            <p className="ac-error" role="alert">That link is missing its token. Ask for a new sign-in email.</p>
            <a href={`/login?next=${encodeURIComponent(next)}`} className="btn btn-solid">Request a new code</a>
          </>
        )}
      </main>
      <AccountFooter />
    </>
  );
}
