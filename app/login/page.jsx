import { redirect } from "next/navigation";

import "../account.css";
import { AccountHeader, AccountFooter } from "../../components/account-chrome";
import { currentUser } from "../../lib/auth";
import { hasDb } from "../../lib/db";
import { safeNext } from "../../lib/nav";
import LoginForm from "./login-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign in — Ship AI",
  description:
    "Sign in to your Ship AI account to register for Zero to Launch, submit a project, or pick up your certifications.",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const next = safeNext(params?.next);

  const user = await currentUser();
  if (user) redirect(user.onboarded_at ? next : `/onboarding?next=${encodeURIComponent(next)}`);

  return (
    <>
      <AccountHeader user={null} />

      <main className="ac-page">
        <p className="ac-kicker">Ship AI account</p>
        <h1>Sign in</h1>
        <p className="ac-lede">
          One account for the whole program — registering for the hackathon, forming a team,
          submitting your project, judging, and picking up your certification afterwards.
        </p>

        {/* An expired or reused magic link lands back here with a
            reason, rather than on a dead-end error page. */}
        {params?.error && (
          <p className="ac-error" role="alert" style={{ marginBottom: "1.5rem" }}>
            {String(params.error).slice(0, 200)}
          </p>
        )}

        {params?.invited && (
          <p className="ac-ok" style={{ marginBottom: "1.5rem" }}>
            You&apos;ve been invited. Sign in and your access is set up automatically.
          </p>
        )}

        {hasDb() ? (
          <LoginForm next={next} />
        ) : (
          <p className="ac-error">
            Accounts aren&apos;t available on this deployment yet. Everything else on the site
            works as normal.
          </p>
        )}

        <hr className="ac-divider" style={{ margin: "2.5rem 0 1.5rem" }} />

        <p className="ac-fine">
          New here? Entering your email makes the account — there&apos;s nothing else to sign
          up for. By signing in you agree we&apos;ll email you about the program and nothing
          else.
        </p>
      </main>

      <AccountFooter />
    </>
  );
}
