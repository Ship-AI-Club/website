import { notFound } from "next/navigation";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { JsonLd } from "../../../../../components/article";
import { PROGRAMS, programBySlug } from "../../../../../lib/programs";

const DISCORD = "https://discord.gg/kZSJMNveYM";
const DEADLINE = "12:00 PM MST, Sunday October 18, 2026";

/* Submissions used to be public GitHub issues. They're filed from a
   Ship AI account now — the same nine fields, but attached to a team,
   editable until the deadline, and readable by the judges assigned to
   it. This page stays public and indexed because the requirements are
   worth reading in September; the form itself is behind sign-in. */
const SUBMIT_URL = "/dashboard/submission";

const TITLE = "Submit your project — Zero to Launch";
const DESCRIPTION =
  "Submission requirements and deadline for Zero to Launch, the Ship AI hackathon. One submission per team, due 12:00 PM MST Sunday October 18, 2026.";

export const metadata = {
  title: `${TITLE} — Ship AI`,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.shipai.club/programs/zero-to-launch/hackathon/submit" },
  openGraph: { title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

const FIELDS = [
  {
    name: "Project name",
    copy: "What it's called.",
  },
  {
    name: "Team",
    copy: "One to four people, one team per person. Made once from your account — whoever starts it gets an invite code to send round, and every member can edit the entry.",
  },
  {
    name: "Track and category",
    copy: "B2C or B2B, and which of the four categories you're entering. One category per team — if you win one you're out of the running for the others.",
  },
  {
    name: "Live URL",
    required: true,
    copy: "Publicly reachable, working, and not behind a login. This is the one field with no substitute: an entry without a live URL cannot place.",
  },
  {
    name: "What it does",
    copy: "Two or three sentences. What it is and who it's for.",
  },
  {
    name: "What you launched this weekend",
    copy: "The launch itself — where, to whom, when. Link the post, the listing, the email, the thread. Whatever the launch actually was.",
  },
  {
    name: "Receipts",
    required: true,
    copy: "Numbers with evidence you can put on screen Sunday: visitors, signups, revenue, replies, conversion. Screenshots are fine. Small and true beats big and vague — and zero is a real answer if you can say what you learned from it.",
  },
  {
    name: "Growth engine",
    copy: "The one channel you'd run again next month. How it works, what it produced this weekend, and why it repeats without a hero effort.",
  },
  {
    name: "Repo",
    copy: "Optional. Open source is welcome but not required — you keep 100% of your IP.",
  },
];

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
          <img src="/logo-icon.png" alt="" width={26} height={26} />
          <span>Ship AI</span>
        </a>
        <nav>
          <a href="/programs">Programs</a>
          <a href="/programs/zero-to-launch/hackathon">Hackathon</a>
          <a href="/programs/zero-to-launch/hackathon#rules">Rules</a>
          <a href="/programs/zero-to-launch/hackathon#prizes">Prizes</a>
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
        <p className="kicker">Zero to Launch</p>
        <h1>Submit your project</h1>

        <p className="hk-deadline">
          <AlertTriangle size={16} strokeWidth={1.75} aria-hidden="true" />
          Deadline: <strong>{DEADLINE}</strong>. No late submissions.
        </p>

        <p className="article-lede">
          One submission per team, filed from your Ship AI account. It takes about ten minutes
          if you have your numbers ready, so read this Friday rather than at 11:50 on Sunday.
        </p>

        <div className="cta-row hk-submit-cta">
          <a className="btn btn-solid" href={SUBMIT_URL}>
            Open your submission
          </a>
          <a className="btn btn-ghost" href="/programs/zero-to-launch/hackathon/results">
            Past results
          </a>
        </div>
        <p className="hk-note">
          You&apos;ll need an account — an email address and a six-digit code, no password to
          make. Start the entry as a draft whenever you like and keep editing it right up to
          the deadline; any member of your team can. Stuck? Post in{" "}
          <a href={DISCORD} target="_blank" rel="noreferrer">the Discord</a> before the
          deadline, not after.
        </p>

        <h2 className="hk-subhead">What the form asks for</h2>
        <ol className="hk-fields">
          {FIELDS.map((f) => (
            <li key={f.name}>
              <p className="hk-field-name">
                {f.name}
                {f.required && <span className="hk-field-req">required</span>}
              </p>
              <p>{f.copy}</p>
            </li>
          ))}
        </ol>

        <h2 className="hk-subhead">Before you hit submit</h2>
        <ul className="hk-check">
          <li>
            <CheckCircle2 size={16} strokeWidth={1.75} aria-hidden="true" />
            Open your live URL in a private window. If it doesn&apos;t load for a stranger, it
            doesn&apos;t count.
          </li>
          <li>
            <CheckCircle2 size={16} strokeWidth={1.75} aria-hidden="true" />
            Have your analytics or dashboard open in a tab for the pitch. Judges will ask.
          </li>
          <li>
            <CheckCircle2 size={16} strokeWidth={1.75} aria-hidden="true" />
            Pick one category. Entering everything reads as not knowing what you built.
          </li>
          <li>
            <CheckCircle2 size={16} strokeWidth={1.75} aria-hidden="true" />
            Five minutes plus three of questions, live product on screen. Time it once.
          </li>
        </ul>

        <p className="rule-line">receipts required</p>

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
          <img src="/logo-icon.png" alt="" width={22} height={22} />
          <span>Ship AI</span>
        </div>
        <p>Phoenix &amp; Tempe, Arizona</p>
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
