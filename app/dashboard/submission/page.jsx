import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { requireOnboarded } from "../../../lib/auth";
import { EVENT } from "../../../lib/hackathon";
import { CATEGORIES } from "../../../lib/results";
import { submissionsOpen } from "../../../lib/settings";
import { judgesFor, submissionForTeam, teamFor } from "../../../lib/store";
import SubmissionForm from "./submission-form";

export const metadata = {
  title: "Your Submission — Ship AI",
  robots: { index: false, follow: false },
};

const CHECKS = [
  "Open your live URL in a private window. If it doesn't load for a stranger, it doesn't count.",
  "Have your analytics or dashboard open in a tab for the pitch. Judges will ask.",
  "Pick one category. Entering everything reads as not knowing what you built.",
  "Five minutes plus three of questions, live product on screen. Time it once.",
];

export default async function Page() {
  const user = await requireOnboarded("/dashboard/submission");
  const team = await teamFor(user.id);

  if (!team) {
    return (
      <>
        <div className="ac-head">
          <p className="ac-kicker">Zero to Launch</p>
          <h1>Your submission</h1>
        </div>
        <div className="ac-empty">
          <strong>One submission per team.</strong>
          Make a team first — a team of one is a team. Any member can edit the entry
          afterwards.
          <p style={{ marginTop: "1.25rem" }}>
            <a className="btn btn-solid ac-btn-sm" href="/dashboard/team">
              Create or join a team
            </a>
          </p>
        </div>
      </>
    );
  }

  const [submission, open] = await Promise.all([
    submissionForTeam(team.id),
    submissionsOpen(),
  ]);

  /* Judges are shown, scores are not. Knowing who's reading it is
     fair; seeing your card before the awards is not. */
  const judges = submission ? await judgesFor(submission.id) : [];

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">{team.name}</p>
        <h1>Your submission</h1>
        <p>
          One entry per team, filed here. It takes about ten minutes if you have your numbers
          ready — so read this Friday rather than at 11:50 on Sunday.
        </p>
      </div>

      <p className={open ? "ac-note" : "ac-error"}>
        <AlertTriangle
          size={15}
          strokeWidth={1.75}
          aria-hidden="true"
          style={{ verticalAlign: "-2px", marginRight: ".5rem" }}
        />
        Deadline: <strong>{EVENT.deadline}</strong>. No late submissions.
        {open && submission?.status === "submitted" && " You can keep editing until then."}
      </p>

      <section className="ac-card">
        <div className="ac-card-head">
          <h2>The entry</h2>
          {submission && (
            <span className={`ac-pill ${submission.status === "submitted" ? "is-ok" : "is-warn"}`}>
              {submission.status === "submitted" ? "Submitted" : "Draft"}
            </span>
          )}
        </div>

        <SubmissionForm
          submission={submission}
          categories={CATEGORIES.filter((c) => !c.voted)}
          deadline={EVENT.deadline}
          open={open}
        />
      </section>

      {judges.length > 0 && (
        <section className="ac-card">
          <h3>Who&apos;s judging it</h3>
          <p>
            Assigned by the organisers. Scores stay sealed until the awards — you&apos;ll see
            the panel, not the card.
          </p>
          <ul className="ac-list">
            {judges.map((j) => (
              <li key={j.id}>
                <strong>{j.name || j.email}</strong>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="ac-card">
        <h3>Before you file</h3>
        <ul className="ac-list">
          {CHECKS.map((c) => (
            <li key={c}>
              <CheckCircle2 size={15} strokeWidth={1.75} aria-hidden="true" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
        <p className="ac-fine">
          The full rules and the scoring rubric are on{" "}
          <a href="/programs/zero-to-launch/hackathon#rules">the hackathon page</a>.
        </p>
      </section>
    </>
  );
}
