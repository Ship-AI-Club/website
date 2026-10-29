import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import TeamPicker from "../../../components/team-picker";

import { requireOnboarded } from "../../../lib/auth";
import { EVENT } from "../../../lib/hackathon";
import { SUBMISSION_CHECKS } from "../../../lib/submissions";
import { submissionsOpen } from "../../../lib/settings";
import { judgesFor, submissionForTeam, teamsFor } from "../../../lib/store";
import SubmissionForm from "./submission-form";
import FounderSubmissionForm from "./founder-submission-form";
import { FOUNDER_WEEKEND as FW } from "../../../lib/founder-weekend";
import { FW_SUBMISSION_CHECKS } from "../../../lib/founder-weekend-submissions";
import { hackathonById } from "../../../lib/hackathons";
import { hackathonSubmissionsOpen } from "../../../lib/settings";

export const metadata = {
  title: "Your Submission — Ship AI",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }) {
  const user = await requireOnboarded("/dashboard/submission");
  const params = await searchParams;
  const [founderTeams, launchTeams] = await Promise.all([teamsFor(user.id, FW.id), teamsFor(user.id)]);
  const both = founderTeams.length > 0 && launchTeams.length > 0;
  const teams = [
    ...founderTeams.map((t) => (both ? { ...t, name: `${t.name} · ${FW.name}` } : t)),
    ...launchTeams.map((t) => (both ? { ...t, name: `${t.name} · ${EVENT.name}` } : t)),
  ];
  const team = params?.team ? teams.find((t) => t.id === params.team) : teams[0];
  if (params?.team && !team) notFound();

  if (team?.hackathon_id === FW.id) {
    return <FounderSubmission team={founderTeams.find((t) => t.id === team.id)} teams={teams} />;
  }

  if (!team) {
    return (
      <>
        <div className="ac-head">
          <p className="ac-kicker">{FW.name}</p>
          <h1>Your submission</h1>
        </div>
        <div className="ac-empty">
          <strong>One submission per team.</strong>
          Register a team first. A team of one is a team, and any member can edit the entry
          afterwards.
          <p style={{ marginTop: "1.25rem" }}>
            <a className="btn btn-solid ac-btn-sm" href={`${FW.path}/register`}>
              Register a team
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

async function FounderSubmission({ team, teams }) {
  const [submission, open] = await Promise.all([
    submissionForTeam(team.id),
    hackathonSubmissionsOpen(hackathonById(FW.id)),
  ]);

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">{FW.name} · {team.name}</p>
        <h1>Your submission</h1>
        <p>
          Your company, your live product and your pitch. Save a draft any time, submit when
          it&apos;s ready, and keep editing until the deadline.
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
        Deadline: <strong>{FW.deadline}</strong>. No late submissions.
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
        <FounderSubmissionForm key={team.id} teamId={team.id} submission={submission} deadline={FW.deadline} open={open} />
      </section>

      <section className="ac-card">
        <h3>Before you submit</h3>
        <ul className="ac-list">
          {FW_SUBMISSION_CHECKS.map((c) => (
            <li key={c}>
              <CheckCircle2 size={15} strokeWidth={1.75} aria-hidden="true" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
        <p className="ac-fine">
          Judges score six criteria from 1 to 10. See them on{" "}
          <a href={`${FW.path}#judging`}>the {FW.name} page</a>.
        </p>
      </section>
    </>
  );
}
