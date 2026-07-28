import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Handshake,
  Rocket,
  Users,
} from "lucide-react";

import { requireOnboarded, hasRole } from "../../lib/auth";
import { sql } from "../../lib/db";
import { EVENT, WORKSHOPS, DISCORD } from "../../lib/hackathon";
import { allSettings } from "../../lib/settings";
import { EDITION } from "../../lib/results";
import { goalLabel, roleLabel, interestToRole, INTERESTS } from "../../lib/accounts";
import {
  certificatesFor,
  registrationFor,
  requestsForUser,
  sponsorshipsFor,
  submissionForTeam,
  teamFor,
  voteFor,
} from "../../lib/store";
import { getUpcomingEvents } from "../../lib/meetup";
import { withdrawRegistrationAction } from "./actions";
import AttendanceForm from "./attendance-form";
import RegisterForm from "./register-form";
import VoteForm from "./vote-form";

export const metadata = {
  title: "Dashboard — Ship AI",
  robots: { index: false, follow: false },
};

function nextWorkshop(now = new Date()) {
  return WORKSHOPS.find((w) => new Date(`${w.iso}T18:00:00-07:00`) >= now) ?? null;
}

function daysUntil(date, now = new Date()) {
  return Math.max(0, Math.ceil((date.getTime() - now.getTime()) / 86_400_000));
}

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const user = await requireOnboarded("/dashboard");

  const [registration, team, certificates, requests, settings, sponsorships, vote] =
    await Promise.all([
      registrationFor(user.id),
      teamFor(user.id),
      certificatesFor(user.id),
      requestsForUser(user.id),
      allSettings(),
      sponsorshipsFor(user.id),
      voteFor(user.id),
    ]);

  const submission = team ? await submissionForTeam(team.id) : null;

  /* Crew — judges, mentors, sponsors — are in the room but not
     entering, so the whole competing half of this page is noise to
     them. They still eat, still vote, and still want to know when the
     next meetup is. Someone who holds a crew role *and* registered
     sees both; the test is what they've actually done, not who they
     are. */
  const crew = ["judge", "mentor", "sponsor"].filter((r) => hasRole(user, r));
  const competing = Boolean(registration);
  const showsCompeting = competing || crew.length === 0;

  const events = crew.length > 0 || !competing ? await getUpcomingEvents(2) : [];

  /* Onboarding captured intent; this turns the ones that still need a
     human into a nudge. Sponsor/mentor/judge each need a request
     filed — the interest on its own does nothing. */
  const unfiled = (user.interests || [])
    .map(interestToRole)
    .filter(
      (role) =>
        role &&
        role !== "participant" &&
        !hasRole(user, role) &&
        !requests.some((r) => r.role === role && r.status === "pending"),
    );

  const votable = settings.voting_open
    ? await sql`
        select s.id, s.project, t.name as team_name
          from submissions s join teams t on t.id = s.team_id
         where s.status = 'submitted'
           and not exists (select 1 from team_members m
                            where m.team_id = s.team_id and m.user_id = ${user.id})
         order by t.name`
    : [];

  const upcoming = nextWorkshop();
  const daysToEvent = daysUntil(new Date(EVENT.startISO));

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">{EVENT.datesShort} · {EVENT.city}</p>
        <h1>
          {user.name ? `Hey, ${user.name.split(" ")[0]}.` : "Your dashboard."}
        </h1>
        <p>
          {daysToEvent > 0
            ? `${daysToEvent} days until the weekend. Everything you need for the program lives here.`
            : "Everything you need for the program lives here."}
        </p>
      </div>

      {params?.denied && (
        <p className="ac-error" role="alert">
          You don&apos;t have {roleLabel(String(params.denied)).toLowerCase()} access. If that
          seems wrong, ask in <a href={DISCORD}>the Discord</a>.
        </p>
      )}

      {/* ---------- crew: your role, and what we need from you ---------- */}

      {crew.length > 0 && (
        <section className="ac-card is-accent">
          <div className="ac-card-head">
            <Handshake size={18} strokeWidth={1.75} aria-hidden="true" />
            <h2>
              You&apos;re {crew.length === 1 ? "a" : ""}{" "}
              {crew.map((r) => roleLabel(r).toLowerCase()).join(" and ")}
            </h2>
          </div>
          <p>
            {EVENT.name}, {EVENT.dates} at {EVENT.venue}. You don&apos;t need to register or
            form a team — this is everything we need from you.
          </p>

          <AttendanceForm user={user} />

          <div className="ac-actions">
            {hasRole(user, "judge") && (
              <a className="btn btn-ghost ac-btn-sm" href="/judge">
                Your scorecards
              </a>
            )}
            {hasRole(user, "mentor") && (
              <a className="btn btn-ghost ac-btn-sm" href="/dashboard/mentoring">
                Teams you mentor
              </a>
            )}
            <a className="btn btn-ghost ac-btn-sm" href="/hackathon#rules">
              How it&apos;s scored
            </a>
          </div>

          {!competing && (
            <p className="ac-fine">
              Wanted to enter as well? Nothing stops you —{" "}
              <a href="/dashboard?compete=1#compete">register as a participant</a>. You
              can&apos;t judge your own team, and the panel is assigned around that.
            </p>
          )}
        </section>
      )}

      {/* ---------- registration ---------- */}

      {(showsCompeting || params?.compete) && (
      <section className="ac-card" id="compete">
        <div className="ac-card-head">
          <Rocket size={18} strokeWidth={1.75} aria-hidden="true" />
          <h2>The hackathon</h2>
          <span className={`ac-pill ${registration ? "is-ok" : "is-off"}`}>
            {registration ? "Registered" : "Not registered"}
          </span>
        </div>

        {registration ? (
          <>
            <p>
              You&apos;re in for {EVENT.name}, {EVENT.dates} at {EVENT.venue}. Registering
              costs nothing and commits you to nothing — but it tells us how much food to
              order, so tell us if that changes.
            </p>
            <dl className="ac-dl">
              <div>
                <dt>Track</dt>
                <dd>{registration.track === "undecided" ? "Not decided yet" : registration.track.toUpperCase()}</dd>
              </div>
              {registration.product && (
                <div>
                  <dt>What you&apos;re bringing</dt>
                  <dd>{registration.product}</dd>
                </div>
              )}
            </dl>
            <div className="ac-actions">
              <a className="btn btn-ghost ac-btn-sm" href="/dashboard/team">
                {team ? "Your team" : "Form a team"}
              </a>
              <a className="btn btn-ghost ac-btn-sm" href="/dashboard/submission">
                {submission ? "Your submission" : "Start a submission"}
              </a>
              <form action={withdrawRegistrationAction} className="ac-inline-form">
                <button type="submit" className="ac-btn-link ac-btn-danger">
                  Withdraw
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <p>
              Free, in person, teams of 1–4. You don&apos;t have to attend a single workshop
              and you don&apos;t need a finished product — bring something you&apos;ve already
              built, or start when the build window opens {EVENT.buildOpens}.
            </p>
            <RegisterForm registration={null} user={user} />
          </>
        )}
      </section>
      )}

      {/* ---------- team and submission, side by side ---------- */}

      {showsCompeting && (
      <div className="ac-cards">
        <section className="ac-card">
          <div className="ac-card-head">
            <Users size={18} strokeWidth={1.75} aria-hidden="true" />
            <h3>Your team</h3>
          </div>
          {team ? (
            <>
              <p>
                <strong style={{ color: "var(--ink)" }}>{team.name}</strong> —{" "}
                {team.members.length} of 4.
              </p>
              <p className="ac-fine">
                {team.members.map((m) => m.name || m.email).join(", ")}
              </p>
              <a className="btn btn-ghost ac-btn-sm" href="/dashboard/team">
                Manage team
              </a>
            </>
          ) : (
            <>
              <p>
                One team per person, up to four people. Solo is fine and competes on the same
                footing — Friday night has a team formation block if you&apos;d rather not.
              </p>
              <a className="btn btn-ghost ac-btn-sm" href="/dashboard/team">
                Create or join a team
              </a>
            </>
          )}
        </section>

        <section className="ac-card">
          <div className="ac-card-head">
            <CalendarDays size={18} strokeWidth={1.75} aria-hidden="true" />
            <h3>Your submission</h3>
            {submission && (
              <span className={`ac-pill ${submission.status === "submitted" ? "is-ok" : "is-warn"}`}>
                {submission.status === "submitted" ? "Submitted" : "Draft"}
              </span>
            )}
          </div>
          {submission ? (
            <>
              <p>
                <strong style={{ color: "var(--ink)" }}>
                  {submission.project || "Untitled"}
                </strong>
                {submission.category ? ` — ${submission.category}` : ""}
              </p>
              <p className="ac-fine">
                {settings.submissions_open
                  ? `Editable until ${EVENT.deadline}.`
                  : "Submissions are closed."}
              </p>
              <a className="btn btn-ghost ac-btn-sm" href="/dashboard/submission">
                {settings.submissions_open ? "Edit submission" : "View submission"}
              </a>
            </>
          ) : (
            <>
              <p>
                Due {EVENT.deadline}. A live URL and receipts are the two fields with no
                substitute. Start it early — you can keep editing right up to the deadline.
              </p>
              <a className="btn btn-ghost ac-btn-sm" href="/dashboard/submission">
                Start your submission
              </a>
            </>
          )}
        </section>
      </div>
      )}

      {/* ---------- unfinished role requests ---------- */}

      {unfiled.length > 0 && (
        <section className="ac-card is-accent">
          <div className="ac-card-head">
            <Handshake size={18} strokeWidth={1.75} aria-hidden="true" />
            <h2>
              Finish your {unfiled.map((r) => roleLabel(r).toLowerCase()).join(" and ")}{" "}
              {unfiled.length === 1 ? "request" : "requests"}
            </h2>
          </div>
          <p>
            You said you were interested in{" "}
            {unfiled
              .map((r) => INTERESTS.find((i) => interestToRole(i.id) === r)?.label.toLowerCase())
              .filter(Boolean)
              .join(" and ")}
            . One short form each and it lands with Santos — he answers every one himself.
          </p>
          <div className="ac-actions">
            <a className="btn btn-solid ac-btn-sm" href="/dashboard/requests">
              Send the {unfiled.length === 1 ? "request" : "requests"}
              <ArrowRight
                size={14}
                strokeWidth={1.75}
                aria-hidden="true"
                style={{ marginLeft: ".4rem", verticalAlign: "-2px" }}
              />
            </a>
          </div>
        </section>
      )}

      {/* ---------- what you're here for ---------- */}

      {(user.goals?.length > 0 || sponsorships.length > 0) && (
        <div className="ac-cards">
          {user.goals?.length > 0 && (
            <section className="ac-card">
              <h3>What you said you wanted</h3>
              <ul className="ac-list">
                {user.goals.map((g) => (
                  <li key={g}>
                    <strong>{goalLabel(g)}</strong>
                  </li>
                ))}
              </ul>
              <a className="ac-btn-link" href="/dashboard/profile">
                Change this
              </a>
            </section>
          )}

          {sponsorships.length > 0 && (
            <section className="ac-card">
              <h3>Your sponsorship</h3>
              <ul className="ac-list">
                {sponsorships.map((s) => (
                  <li key={s.id}>
                    <strong>{s.org || s.credit_name || "Sponsorship"}</strong>
                    <span className="ac-list-end">
                      {s.amount > 0 && <span className="ac-mono">${s.amount.toLocaleString()}</span>}
                      <span className="ac-pill">{s.status}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="ac-fine">
                Questions about an invoice or your logo lockup? Ask in{" "}
                <a href={DISCORD}>the Discord</a>.
              </p>
            </section>
          )}
        </div>
      )}

      {/* ---------- certificates ---------- */}

      <section className="ac-card">
        <div className="ac-card-head">
          <BadgeCheck size={18} strokeWidth={1.75} aria-hidden="true" />
          <h2>Certificates</h2>
          {certificates.length > 0 && <span className="ac-pill is-ok">{certificates.length}</span>}
        </div>
        {certificates.length > 0 ? (
          <>
            <p>
              Every team that submits gets one, at a permanent public URL you can link from
              LinkedIn or a job application.
            </p>
            <a className="btn btn-ghost ac-btn-sm" href="/dashboard/certificates">
              View your certificates
            </a>
          </>
        ) : (
          <p>
            Nothing issued yet. Every team that submits a project gets a certification at the
            closing ceremony on {EDITION.issued} — winners get theirs named for the category.
          </p>
        )}
      </section>

      {/* ---------- crowd favorite ---------- */}

      {settings.voting_open && (
        <section className="ac-card is-accent">
          <h2>Crowd Favorite</h2>
          <p>
            Voted by the room, not the judges — the build everyone wanted to try. One vote
            each, and you can change it until the pitches finish.
          </p>
          <VoteForm entries={votable} current={vote?.submission_id} />
        </section>
      )}

      {/* ---------- what's next ---------- */}

      {events.length > 0 && (
        <section className="ac-card">
          <div className="ac-card-head">
            <CalendarDays size={18} strokeWidth={1.75} aria-hidden="true" />
            <h2>Next meetup</h2>
          </div>
          <p>
            Ship AI runs free, public events in Phoenix and Tempe year round — the program
            is one season of them. Pulled live from the Meetup calendar.
          </p>
          <ul className="ac-list">
            {events.map((e) => (
              <li key={e.url}>
                <strong>{e.title}</strong>
                <span>
                  {e.date} · {e.time} · {e.place}
                </span>
                <span className="ac-list-end">
                  <a className="ac-btn-link" href={e.url} target="_blank" rel="noreferrer">
                    RSVP
                  </a>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {upcoming && (
        <section className="ac-card">
          <h2>Next up</h2>
          <p>
            <strong style={{ color: "var(--ink)" }}>
              {upcoming.date} — {upcoming.eventTitle}
            </strong>
            <br />
            {upcoming.title}
          </p>
          <p>{upcoming.copy}</p>
          <div className="ac-actions">
            <a
              className="btn btn-ghost ac-btn-sm"
              href={`/hackathon/workshops/${upcoming.slug}`}
            >
              Session details
            </a>
            <a className="btn btn-ghost ac-btn-sm" href="/hackathon/workshops">
              All six sessions
            </a>
          </div>
        </section>
      )}
    </>
  );
}
