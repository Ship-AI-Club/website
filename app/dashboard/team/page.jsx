import { Users } from "lucide-react";
import { notFound } from "next/navigation";
import TeamPicker from "../../../components/team-picker";
import { getSetting } from "../../../lib/settings";

import { requireOnboarded } from "../../../lib/auth";
import { MAX_TEAM_SIZE } from "../../../lib/accounts";
import { mentorsForTeam, submissionForTeam, teamsFor } from "../../../lib/store";
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

function TeamOptions() {
  return (
    <div className="ac-cards">
      <section className="ac-card">
        <h2>Start a team</h2>
        <p>You&apos;ll get an invite code to send to up to three other people.</p>
        <CreateTeamForm />
      </section>
      <section className="ac-card">
        <h2>Join a team</h2>
        <p>Someone already made the team? Take their code.</p>
        <JoinTeamForm />
      </section>
    </div>
  );
}

export default async function Page({ searchParams }) {
  const user = await requireOnboarded("/dashboard/team");
  const params = await searchParams;
  const [teams, multipleAllowed] = await Promise.all([
    teamsFor(user.id), getSetting("multiple_teams_allowed"),
  ]);
  const team = params?.team ? teams.find((t) => t.id === params.team) : teams[0];
  if (params?.team && !team) notFound();

  if (!team) {
    return (
      <>
        <div className="ac-head">
          <p className="ac-kicker">Teams of 1–4</p>
          <h1>Your team</h1>
          <p>
            {multipleAllowed ? "You can be on multiple teams. " : "One team per person. "}
            Solo entries compete on exactly the same footing, so going
            alone costs you nothing — and Saturday morning has a 60-second pitch round and a team
            formation block if you&apos;d rather not.
          </p>
        </div>

        <TeamOptions />
      </>
    );
  }

  const [submission, mentors] = await Promise.all([
    submissionForTeam(team.id),
    mentorsForTeam(team.id),
  ]);

  const isOwner = team.members.some((m) => m.is_owner && m.id === user.id);
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

      <TeamPicker teams={teams} selectedId={team.id} href="/dashboard/team" />
      {multipleAllowed && <p className="ac-note">You can create or join additional teams below. Each team has its own submission.</p>}

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
                  <RemoveMemberForm key={`${team.id}-${m.id}`} teamId={team.id} memberId={m.id} label="Remove" />
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
                <input type="hidden" name="team_id" value={team.id} />
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
          <a className="btn btn-ghost ac-btn-sm" href={`/dashboard/submission?team=${team.id}`}>
            {submission ? "Open it" : "Start it"}
          </a>
        </section>

        {isOwner && (
          <section className="ac-card">
            <h3>Team details</h3>
            <TeamDetailsForm key={team.id} teamId={team.id} name={team.name} tagline={team.tagline} />
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
          key={team.id}
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
          This removes you from {team.name}. Your other memberships stay in place.
          If you&apos;re the last one out, the team and its submission are deleted.
        </p>
        <form action={leaveTeamAction}>
          <input type="hidden" name="team_id" value={team.id} />
          <button type="submit" className="btn btn-ghost ac-btn-sm">
            Leave {team.name}
          </button>
        </form>
      </section>
      {multipleAllowed && <TeamOptions />}
    </>
  );
}
