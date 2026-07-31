/* Every /programs/zero-to-launch/hackathon/certificate/<id> that was never issued lands here,
   so this page is the verification failure path for a public
   credential — it should say the id isn't real, not show an unbranded
   framework error. */

export const metadata = {
  title: "Not found — Ship AI",
  description:
    "That page isn't here. Browse the Ship AI programs, or check a certificate id against the results page.",
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
          <a href="/programs">Programs</a>
          <a href="/programs/zero-to-launch/hackathon">Hackathon</a>
          <a href="/programs/zero-to-launch/hackathon/results">Results</a>
        </nav>
      </header>

      <main className="hk-submit-page">
        <p className="kicker">404</p>
        <h1>Nothing here.</h1>
        <p className="article-lede">
          This page doesn&apos;t exist — a stale link, a typo, or something we moved. The
          programs are the best place to pick the thread back up.
        </p>
        <p>
          If you followed a certificate link, that credential id was never issued — every
          real one is listed on the results page, and a certification that doesn&apos;t
          appear there isn&apos;t one of ours.
        </p>
        <div className="cta-row hk-submit-cta">
          <a className="btn btn-solid" href="/programs">
            Browse the programs
          </a>
          <a className="btn btn-ghost" href="/programs/zero-to-launch/hackathon/results">
            Check the results
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
          <a href="/programs">Programs</a>
          <a href="/programs/zero-to-launch/hackathon">Hackathon</a>
          <a href="/programs/zero-to-launch/hackathon/results">Results</a>
        </nav>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}
