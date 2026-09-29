import { notFound } from "next/navigation";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { JsonLd } from "../../../../../components/article";
import { PROGRAMS, programBySlug } from "../../../../../lib/programs";

import { DISCORD, EVENT } from "../../../../../lib/hackathon";
import { SUBMISSION_CHECKS, SUBMISSION_FIELDS } from "../../../../../lib/submissions";

const SUBMIT_URL = "/dashboard/submission";

const TITLE = `Submit Your Marketing Site — ${EVENT.name}`;
const DESCRIPTION =
  `Submit your live marketing site to the ${EVENT.name}. Judged on design, craft, and receipts. One submission per team, due ${EVENT.deadline}.`;

export const metadata = {
  title: `${TITLE} — Ship AI`,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.shipai.club/programs/zero-to-launch/hackathon/submit" },
  openGraph: { title: TITLE, description: DESCRIPTION, images: [{ url: "/og-image.jpg", width: 1200, height: 630 }] },
  robots: { index: true, follow: true },
};

export function generateStaticParams() {
  return PROGRAMS.filter((program) => program.hasHackathon).map((program) => ({
    program: program.slug,
  }));
}

export default async function Page({ params }) {
  const { program: programSlug } = await params;
  const program = programBySlug(programSlug);
  if (!program?.hasHackathon) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: TITLE,
          description: DESCRIPTION,
          url: "https://www.shipai.club/programs/zero-to-launch/hackathon/submit",
          isPartOf: { "@type": "WebPage", url: "https://www.shipai.club/programs/zero-to-launch/hackathon" },
        }}
      />

      <header className="nav">
        <a href="/" className="brand">
          <img src="/logo-mark.png" alt="" width={26} height={26} />
          <span>Ship AI</span>
        </a>
        <nav>
          <a href="/programs">Programs</a>
          <a href="/programs/zero-to-launch/hackathon">Hackathon</a>
          <a href="/programs/zero-to-launch/hackathon#focus">What to build</a>
          <a href="/programs/zero-to-launch/hackathon#judges">Judges</a>
        </nav>
        <div className="nav-ctas">
          <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">
            Discord
          </a>
          <a className="btn btn-solid" href="/dashboard">
            Register
          </a>
        </div>
      </header>

      <main className="hk-submit-page">
        <p className="kicker">{EVENT.name}</p>
        <h1>Submit your marketing site</h1>

        <p className="hk-deadline">
          <AlertTriangle size={16} strokeWidth={1.75} aria-hidden="true" />
          <span>Deadline: <strong>{EVENT.deadline}</strong>. No late submissions.</span>
        </p>

        <p className="article-lede">
          Build and ship the best marketing site. One submission per team, judged on design,
          craft, and receipts: the pages, features, and improvements you shipped.
          Each criterion is scored from 0 to 10 and weighted equally.
        </p>

        <div className="cta-row hk-submit-cta">
          <a className="btn btn-solid" href={SUBMIT_URL}>
            Open your submission
          </a>
          <a className="btn btn-ghost" href="/programs/zero-to-launch/hackathon/results">
            Results
          </a>
        </div>
        <p className="hk-note">
          You&apos;ll need an account — an email address and a six-digit code, no password.
          Create or join a team of one to four people. Save a draft whenever you like; any team member can edit it up to the deadline.
          Stuck? Post in{" "}
          <a href={DISCORD} target="_blank" rel="noreferrer">the Discord</a> before the
          deadline, not after.
        </p>

        <h2 className="hk-subhead">What the form asks for</h2>
        <ol className="hk-fields">
          {SUBMISSION_FIELDS.map((f) => (
            <li key={f.name}>
              <p className="hk-field-name">
                {f.name}
                {f.required && <span className="hk-field-req">Required</span>}
              </p>
              <p>{f.copy}</p>
            </li>
          ))}
        </ol>

        <h2 className="hk-subhead">Before you hit submit</h2>
        <ul className="hk-check">
          {SUBMISSION_CHECKS.map((check) => (
            <li key={check}>
              <CheckCircle2 size={16} strokeWidth={1.75} aria-hidden="true" />
              {check}
            </li>
          ))}
        </ul>

        <div className="cta-row hk-submit-cta">
          <a className="btn btn-solid" href={SUBMIT_URL}>
            Open your submission
          </a>
          <a className="btn btn-ghost" href="/programs/zero-to-launch/hackathon">
            Back to the hackathon
            <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
          </a>
        </div>
      </main>

      <footer className="footer">
        <div className="brand">
          <img src="/logo-mark.png" alt="" width={22} height={22} />
          <span>Ship AI</span>
        </div>
        <nav>
          <a href="/">Home</a>
          <a href="/programs/zero-to-launch/hackathon">Hackathon</a>
          <a href="/programs">Programs</a>
          <a href="/programs/zero-to-launch">Sessions</a>
        </nav>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}
