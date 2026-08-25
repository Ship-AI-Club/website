import { Users } from "lucide-react";

import { requireOnboarded } from "../../../lib/auth";
import { MAX_TEAM_SIZE } from "../../../lib/accounts";
import { mentorsForTeam, submissionForTeam, teamFor } from "../../../lib/store";
import { leaveTeamAction, regenerateInviteAction } from "../actions";
import ImageUpload from "../../../components/image-upload";
import {
  CreateTeamForm,
  JoinTeamForm,
  RemoveMemberForm,
  TeamDetailsForm,
} from "./team-forms";

export const metadata = {
  title: "Your Team — Ship AI",
  robots: { index: false, follow: false },
};

/* Teams of 1–4, one team per person — rule 01. The whole page is
   either "you have one" or "make or join one"; there is no third
   state, because the unique index on team_members won't allow one. */

export default async function Page() {
  const user = await requireOnboarded("/dashboard/team");
  const team = await teamFor(user.id);

  if (!team) {
    return (
      <>
        <div className="ac-head">
          <p className="ac-kicker">Teams of 1–4</p>
          <h1>Your team</h1>
          <p>
            One team per person. Solo entries compete on exactly the same footing, so going
            alone costs you nothing — and Friday night has a 60-second pitch round and a team
            formation block if you&apos;d rather not.
          </p>
        </div>

        <div className="ac-cards">
          <section className="ac-card">
            <h2>Start a team</h2>
            <p>You&apos;ll get an invite code to send to up to three other people.</p>
            <CreateTeamForm />
          </section>

          <section className="ac-card">
            <h2>Join one</h2>
            <p>Someone already made the team? Take their code.</p>
            <JoinTeamForm />
          </section>
        </div>
      </>
    );
  }

  const [submission, mentors] = await Promise.all([
    submissionForTeam(team.id),
    mentorsForTeam(team.id),
  ]);

  const owner = team.members.find((m) => m.is_owner);
  const isOwner = owner?.id === user.id;
  const spaces = MAX_TEAM_SIZE - team.members.length;

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">
          {team.members.length} of {MAX_TEAM_SIZE}
        </p>
        <h1>{team.name}</h1>
        <p>
          {spaces > 0
            ? `Room for ${spaces} more. Send them the code below.`
            : "Full. Four is the cap."}
        </p>
      </div>

      <section className="ac-card">
        <div className="ac-card-head">
          <Users size={18} strokeWidth={1.75} aria-hidden="true" />
          <h2>Who&apos;s on it</h2>
        </div>
        <ul className="ac-list">
          {team.members.map((m) => (
            <li key={m.id}>
              <strong>{m.name || m.email}</strong>
              {m.title ? <span>· {m.title}</span> : null}
              <span className="ac-list-end">
                {m.is_owner && <span className="ac-pill">owner</span>}
                {isOwner && m.id !== user.id && (
                  <RemoveMemberForm memberId={m.id} label="Remove" />
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {spaces > 0 && (
        <section className="ac-card">
          <h2>Invite code</h2>
          <p>
            Anyone with this code can join until the team is full. Regenerate it if it ends up
            somewhere it shouldn&apos;t.
          </p>
          <div className="ac-copy-field">
            <code>{team.invite_code}</code>
            {isOwner && (
              <form action={regenerateInviteAction} className="ac-inline-form">
                <button type="submit" className="ac-btn-link">
                  Regenerate
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {mentors.length > 0 && (
        <section className="ac-card is-accent">
          <h2>Your mentors</h2>
          <p>Saturday&apos;s 1:1 rotations. Come with a specific question, not a demo.</p>
          <ul className="ac-list">
            {mentors.map((m) => (
              <li key={m.id}>
                <strong>{m.name || m.email}</strong>
                <span>
                  {[m.title, m.company].filter(Boolean).join(", ")}
                </span>
                {m.slot && <span className="ac-list-end ac-mono">{m.slot}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="ac-cards">
        <section className="ac-card">
          <h3>Your submission</h3>
          <p>
            {submission
              ? `${submission.project || "Untitled"} — ${submission.status === "submitted" ? "submitted" : "still a draft"}.`
              : "Nothing started. One submission per team, and any member can edit it."}
          </p>
          <a className="btn btn-ghost ac-btn-sm" href="/dashboard/submission">
            {submission ? "Open it" : "Start it"}
          </a>
        </section>

        {isOwner && (
          <section className="ac-card">
            <h3>Team details</h3>
            <TeamDetailsForm name={team.name} tagline={team.tagline} />
          </section>
        )}
      </div>

      <section className="ac-card">
        <h3>Team logo</h3>
        <p>
          Shown next to your entry on the results page and on your certificate&apos;s listing.
          Any member can set it.
        </p>
        <ImageUpload
          kind="team-logo"
          ownerId={team.id}
          currentUrl={team.logo_url}
          name={team.name}
          label="Logo"
          hint="A square mark reads best — it sits at 64px on the results page."
        />
      </section>

      <section className="ac-card">
        <h3>Leave this team</h3>
        <p>
          You&apos;ll be free to join another or start your own. If you&apos;re the last one
          out, the team and its draft submission go with you.
        </p>
        <form action={leaveTeamAction}>
          <button type="submit" className="btn btn-ghost ac-btn-sm">
            Leave {team.name}
          </button>
        </form>
      </section>
    </>
  );
}
