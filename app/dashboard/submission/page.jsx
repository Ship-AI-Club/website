import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import TeamPicker from "../../../components/team-picker";

import { requireOnboarded } from "../../../lib/auth";
import { EVENT } from "../../../lib/hackathon";
import { SUBMISSION_CHECKS } from "../../../lib/submissions";
import { submissionsOpen } from "../../../lib/settings";
import { judgesFor, submissionForTeam, teamsFor } from "../../../lib/store";
import SubmissionForm from "./submission-form";

export const metadata = {
  title: "Your Submission — Ship AI",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }) {
  const user = await requireOnboarded("/dashboard/submission");
  const params = await searchParams;
  const teams = await teamsFor(user.id);
  const team = params?.team ? teams.find((t) => t.id === params.team) : teams[0];
  if (params?.team && !team) notFound();

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
          Add your live site and what you shipped. Save a draft, submit when ready,
          and prepare your five-minute pitch with your own deck or our optional generator.
        </p>
      </div>

      <TeamPicker teams={teams} selectedId={team.id} href="/dashboard/submission" />

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
          <h2>Your entry</h2>
          {submission && (
            <span className={`ac-pill ${submission.status === "submitted" ? "is-ok" : "is-warn"}`}>
              {submission.status === "submitted" ? "Submitted" : "Draft"}
            </span>
          )}
        </div>

        <SubmissionForm
          key={team.id}
          teamId={team.id}
          submission={submission}
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
          {SUBMISSION_CHECKS.map((c) => (
            <li key={c}>
              <CheckCircle2 size={15} strokeWidth={1.75} aria-hidden="true" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
        <p className="ac-fine">
          See the focus and event details on{" "}
          <a href="/programs/zero-to-launch/hackathon#focus">the hackathon page</a>.
        </p>
      </section>
    </>
  );
}
