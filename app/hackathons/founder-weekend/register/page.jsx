import "../../../account.css";
import "../founder-weekend.css";

import { Lockup } from "../../../../components/seal";
import MobileNav from "../../../../components/mobile-nav";
import { currentUser } from "../../../../lib/auth";
import { MAX_TEAM_SIZE } from "../../../../lib/accounts";
import { teamFor } from "../../../../lib/store";
import { DISCORD } from "../../../../lib/hackathon";
import { FOUNDER_WEEKEND as FW } from "../../../../lib/founder-weekend";
import { leaveFounderTeamAction } from "./actions";
import { CreateTeamForm, JoinTeamForm } from "./team-forms";

export const dynamic = "force-dynamic";

const RETURN = `${FW.path}/register`;

export const metadata = {
  title: `Register Your Team · ${FW.name} | Ship AI`,
  description: `Register a team of 1–4 for ${FW.name}, the free Arizona AI hackathon in Phoenix on ${FW.dates}.`,
  alternates: { canonical: `https://www.shipai.club${RETURN}` },
};

function SignedOut() {
  return (
    <div className="fw-register-grid">
      <section className="fw-register-card">
        <h2>1. Sign in</h2>
        <p className="section-lede">One email code. No password.</p>
      </section>
      <section className="fw-register-card">
        <h2>2. Start or join a team</h2>
        <p className="section-lede">Register a team of 1–{MAX_TEAM_SIZE}, or join one with an invite code.</p>
      </section>
      <div className="cta-row">
        <a className="btn btn-solid" href={`/login?next=${encodeURIComponent(RETURN)}`}>Sign in to register</a>
      </div>
    </div>
  );
}

function Onboard() {
  return (
    <div className="cta-row">
      <a className="btn btn-solid" href={`/onboarding?next=${encodeURIComponent(RETURN)}`}>Finish your profile</a>
    </div>
  );
}

function YourTeam({ team }) {
  const open = MAX_TEAM_SIZE - team.members.length;
  return (
    <section className="fw-register-card">
      <h2>{team.name}</h2>
      <p className="section-lede">You&apos;re registered for {FW.name}. Share this code so teammates can join.</p>
      <p className="ac-label">Invite code</p>
      <p className="fw-invite">{team.invite_code}</p>
      <ul className="fw-members">
        {team.members.map((member) => (
          <li key={member.id}>{member.name || "New member"}{member.is_owner ? " · captain" : ""}</li>
        ))}
      </ul>
      <p className="hk-note">
        {open > 0 ? `${open} open spot${open === 1 ? "" : "s"}.` : "Your team is full."} Questions? Ask in{" "}
        <a href={DISCORD} target="_blank" rel="noopener noreferrer">Discord</a>.
      </p>
      <div className="cta-row">
        <a className="btn btn-solid ac-btn-sm" href={`/dashboard/submission?team=${team.id}`}>Submit your project</a>
      </div>
      <p className="hk-note">Submissions close {FW.deadline}.</p>
      <form action={leaveFounderTeamAction}>
        <input type="hidden" name="team_id" value={team.id} />
        <button type="submit" className="btn btn-ghost ac-btn-sm">Leave team</button>
      </form>
    </section>
  );
}

export default async function Page() {
  const user = await currentUser();
  const team = user?.onboarded_at ? await teamFor(user.id, null, FW.id) : null;

  return (
    <>
      <header className="nav">
        <Lockup />
        <nav>
          <a href={FW.path}>{FW.name}</a>
          <a href={`${FW.path}#faq`}>FAQ</a>
        </nav>
        <a className="btn btn-ghost nav-cta" href={FW.path}>Back to the event</a>
        <MobileNav extraLinks={[{ href: FW.path, label: FW.name }]} />
      </header>

      <main className="hk-simple fw">
        <section className="hero hk-hero fw-register">
          <p className="eyebrow">{FW.name} · Phoenix · {FW.datesShort}</p>
          <h1 className="hero-h1">Register your team</h1>
          <p className="lede">Free. {FW.teams}. Solo is fine, and you can add teammates any time before the weekend.</p>
        </section>

        <section className="section">
          {!user && <SignedOut />}
          {user && !user.onboarded_at && <Onboard />}
          {user?.onboarded_at && team && <YourTeam team={team} />}
          {user?.onboarded_at && !team && (
            <div className="fw-register-grid">
              <section className="fw-register-card">
                <h2>Start a team</h2>
                <p className="section-lede">You&apos;ll get an invite code for up to {MAX_TEAM_SIZE - 1} teammates.</p>
                <CreateTeamForm />
              </section>
              <section className="fw-register-card">
                <h2>Join a team</h2>
                <p className="section-lede">Someone already registered? Use their code.</p>
                <JoinTeamForm />
              </section>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <Lockup compact />
        <nav>
          <a href={FW.path}>{FW.name}</a>
          <a href="/dashboard">Account</a>
        </nav>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}
