import "./intake.css";
import IntakeForm from "./intake-form";

/* Hidden page — not linked from the site, not in the sitemap, noindex.
   The URL gets sent directly to a sponsor, mentor or judge once they've
   said yes, so it opens straight into the form with no pitch attached. */

export const metadata = {
  title: "Intake — Ship AI",
  description: "Details and brand assets for Ship AI sponsors, mentors and judges.",
  robots: { index: false, follow: false, nocache: true },
};

export default function Page() {
  return (
    <>
      <header className="nav">
        <a href="/" className="brand">
          <img src="/logo-icon.png" alt="" width={26} height={26} />
          <span>Ship AI</span>
        </a>
        <p className="ik-nav-note">Sponsor · mentor · judge intake</p>
      </header>

      <main className="ik-page">
        <p className="kicker">Zero to Launch · Oct 16–18</p>
        <h1>Send us your details.</h1>
        <p className="article-lede">
          You said yes — this is the part where we get what we need to put you on the site,
          in the deck and on the run sheet, and then stop emailing you about it. Five minutes,
          once. Everything except your name, email and title is optional, and you can send it
          again later if something changes.
        </p>

        <IntakeForm />

        <p className="rule-line">receipts required</p>

        <p className="hk-note">
          Files go into private storage — nothing here is public until it&apos;s on the site.
          Questions:{" "}
          <a href="mailto:santos.d.hernandez@gmail.com?subject=Ship%20AI%20intake">
            santos.d.hernandez@gmail.com
          </a>
          .
        </p>
      </main>

      <footer className="footer">
        <div className="brand">
          <img src="/logo-icon.png" alt="" width={22} height={22} />
          <span>Ship AI</span>
        </div>
        <p>Phoenix &amp; Tempe, Arizona</p>
        <nav>
          <a href="/">Home</a>
          <a href="/hackathon">Hackathon</a>
        </nav>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}
