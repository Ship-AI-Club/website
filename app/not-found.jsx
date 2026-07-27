/* Every /hackathon/certificate/<id> that was never issued lands here,
   so this page is the verification failure path for a public
   credential — it should say the id isn't real, not show an unbranded
   framework error. */

export const metadata = {
  title: "Not found — Ship AI",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <header className="nav">
        <a href="/" className="brand">
          <img src="/logo-icon.png" alt="" width={26} height={26} />
          <span>Ship AI</span>
        </a>
        <nav>
          <a href="/hackathon">Hackathon</a>
          <a href="/hackathon/results">Results</a>
          <a href="/hackathon/workshops">Workshops</a>
        </nav>
      </header>

      <main className="hk-submit-page">
        <p className="kicker">404</p>
        <h1>Nothing here.</h1>
        <p className="article-lede">
          This page doesn&apos;t exist. If you followed a certificate link, that credential
          id was never issued — every real one is listed on the results page, and a
          certification that doesn&apos;t appear there isn&apos;t one of ours.
        </p>
        <div className="cta-row hk-submit-cta">
          <a className="btn btn-solid" href="/hackathon/results">
            Check the results
          </a>
          <a className="btn btn-ghost" href="/">
            Back to Ship AI
          </a>
        </div>
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
          <a href="/hackathon/results">Results</a>
        </nav>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}
