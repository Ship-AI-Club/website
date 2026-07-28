import "../account.css";
import { AccountHeader, AccountFooter } from "../../components/account-chrome";
import { requireUser } from "../../lib/auth";
import { safeNext } from "../../lib/nav";
import { EVENT } from "../../lib/hackathon";
import OnboardingForm from "./onboarding-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Welcome — Ship AI",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const next = safeNext(params?.next);
  const user = await requireUser("/onboarding");

  const returning = Boolean(user.onboarded_at);

  return (
    <>
      <AccountHeader user={user} />

      <main className="ac-page is-wide">
        <p className="ac-kicker">{returning ? "Your details" : "Welcome to Ship AI"}</p>
        <h1>{returning ? "Update your details" : "Three questions, then you're in."}</h1>
        <p className="ac-lede">
          {returning
            ? "Change any of this whenever you like — it feeds your dashboard, your certificate and who we introduce you to."
            : `Enough to know who you are and what you're here for. ${EVENT.name} runs ${EVENT.dates} in ${EVENT.city}, and none of this commits you to anything.`}
        </p>

        <OnboardingForm user={user} next={next} />
      </main>

      <AccountFooter />
    </>
  );
}
