import "../../../account.css";
import "../../../programs/voyage.css";

import SiteFooter from "../../../../components/site-footer";
import SiteHeader from "../../../../components/site-header";
import { EventHero } from "../../../../components/event-page";
import { Passage, PassageStop } from "../../../../components/event-form";
import { currentUser } from "../../../../lib/auth";
import { MAX_TEAM_SIZE } from "../../../../lib/accounts";
import { teamFor } from "../../../../lib/store";
import { DISCORD } from "../../../../lib/hackathon";
import { FOUNDER_WEEKEND as FW } from "../../../../lib/founder-weekend";
import { leaveFounderTeamAction } from "./actions";
import { CreateTeamForm, InviteCode, JoinTeamForm } from "./team-forms";

export const dynamic = "force-dynamic";

const RETURN = `${FW.path}/register`;

export const metadata = {
  title: `Register Your Team · ${FW.name} | Ship AI`,
  description: `Register a team of 1–4 for ${FW.name}, the free Arizona AI hackathon in Phoenix on ${FW.dates}.`,
  alternates: { canonical: `https://www.shipai.club${RETURN}` },
};

/* Registration as a passage: sign in, start or join a team, submit on
   Sunday. Finished steps fold to a line and the ship sits at the step
   that holds the form, so the page shows one action per state:
   signed out, profile unfinished, no team yet, on a team. */
export default async function Page() {
  const user = await currentUser();
  const onboarded = Boolean(user?.onboarded_at);
  const team = onboarded ? await teamFor(user.id, null, FW.id) : null;
  const open = team ? MAX_TEAM_SIZE - team.members.length : 0;
  const submitLabel = `Closes ${FW.deadline}`;

  return (
    <>
      <SiteHeader />

      <main id="top">
        <EventHero
          crumb={{ href: FW.path, label: FW.name }}
          title="Register"
          keyPhrase="your team"
          lede={`Free. ${FW.teams}. Solo is fine, and you can add teammates any time before the weekend.`}
        />

        <Passage
          foot={FW.rsvpUrl && <>Not on the guest list yet? <a href={FW.rsvpUrl} target="_blank" rel="noopener noreferrer">RSVP on Luma</a></>}
        >
          {!user && (
            <PassageStop state="here" label="Step 1" title="Sign in">
              <div className="ef-step-body">
                <p>One email code. No password.</p>
                <a className="btn btn-solid" href={`/login?next=${encodeURIComponent(RETURN)}`}>Sign in to register</a>
              </div>
            </PassageStop>
          )}
          {user && !onboarded && (
            <PassageStop state="here" label="Step 1" title="Finish your profile">
              <div className="ef-step-body">
                <a className="btn btn-solid" href={`/onboarding?next=${encodeURIComponent(RETURN)}`}>Finish your profile</a>
              </div>
            </PassageStop>
          )}
          {onboarded && <PassageStop state="done" label="Step 1 · done" title="Signed in" />}

          {!onboarded && <PassageStop label="Step 2" title="Start or join a team" />}
          {onboarded && !team && (
            <PassageStop state="here" label="Step 2" title="Start or join a team">
              <div className="ef-halves">
                <div>
                  <h3>Start a team</h3>
                  <p>You&apos;ll get an invite code for up to {MAX_TEAM_SIZE - 1} teammates.</p>
                  <CreateTeamForm />
                </div>
                <div>
                  <h3>Join a team</h3>
                  <JoinTeamForm />
                </div>
              </div>
            </PassageStop>
          )}
          {team && (
            <PassageStop state="done" label="Step 2 · done" title={`${team.name} is registered`}>
              <div className="ef-step-body">
                <span className="vy-label">Invite code · share it so teammates can join</span>
                <InviteCode code={team.invite_code} />
                <ul className="ef-members">
                  {team.members.map((member) => (
                    <li key={member.id}>{member.name || "New member"}{member.is_owner ? " · captain" : ""}</li>
                  ))}
                </ul>
                <span className="vy-label">{open > 0 ? `${open} open spot${open === 1 ? "" : "s"}` : "Your team is full"}</span>
                <form action={leaveFounderTeamAction} className="ef-leave">
                  <input type="hidden" name="team_id" value={team.id} />
                  <button type="submit">Leave team</button>
                </form>
              </div>
            </PassageStop>
          )}

          {team ? (
            <PassageStop state="here" label={submitLabel} title="Submit your project">
              <div className="ef-step-body">
                <a className="btn btn-solid" href={`/dashboard/submission?team=${team.id}`}>Submit your project</a>
              </div>
            </PassageStop>
          ) : (
            <PassageStop label={submitLabel} title="Submit your project" />
          )}
        </Passage>

        <div className="ev-end" />
      </main>

      <SiteFooter />
    </>
  );
}
