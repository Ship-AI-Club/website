import "../account.css";
import { AccountHeader, AccountFooter } from "../../components/account-chrome";
import { requireUser } from "../../lib/auth";
import { safeNext } from "../../lib/nav";
import OnboardingWizard from "./onboarding-wizard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Welcome — Ship AI",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const next = safeNext(params?.next);
  const user = await requireUser("/onboarding");

  return (
    <>
      <AccountHeader user={user} />

      <main className="ac-page is-wide">
        <OnboardingWizard user={user} next={next} />
      </main>

      <AccountFooter />
    </>
  );
}
