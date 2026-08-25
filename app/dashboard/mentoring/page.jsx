import { requireRole } from "../../../lib/auth";
import { mentorAssignmentsFor, teamMembers } from "../../../lib/store";
import { EVENT, DISCORD } from "../../../lib/hackathon";

export const metadata = {
  title: "Teams You Mentor — Ship AI",
  robots: { index: false, follow: false },
};

/* Saturday's 1:1 rotations, from the mentor's side. What a mentor
   needs before the room is: who, what they're building, and what
   they're stuck on — so that's what this page is, and nothing else. */

export default async function Page() {
  const user = await requireRole("mentor", "/dashboard/mentoring");
  const assignments = await mentorAssignmentsFor(user.id);

  const withMembers = await Promise.all(
    assignments.map(async (a) => ({ ...a, members: await teamMembers(a.team_id) })),
  );

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">Saturday · {EVENT.venue}</p>
        <h1>Teams you mentor</h1>
        <p>
          Assigned by the organisers. Teams come to you with a specific problem — the useful
          version of this hour is one hard question answered properly, not a demo watched
          politely.
        </p>
      </div>

      {withMembers.length === 0 ? (
        <div className="ac-empty">
          <strong>No teams yet.</strong>
          Pairings go out closer to the weekend, once teams have formed and we know what
          they&apos;re building. You&apos;ll get an email when yours lands.
        </div>
      ) : (
        withMembers.map((a) => (
          <section key={a.team_id} className="ac-card">
            <div className="ac-card-head">
              <h2>{a.team_name}</h2>
              {a.slot && <span className="ac-pill is-live">{a.slot}</span>}
            </div>

            {a.project && (
              <p>
                <strong style={{ color: "var(--ink)" }}>{a.project}</strong>
                {a.track ? ` · ${a.track.toUpperCase()}` : ""}
              </p>
            )}
            {a.summary && <p>{a.summary}</p>}

            <dl className="ac-dl">
              <div>
                <dt>Who</dt>
                <dd>{a.members.map((m) => m.name || m.email).join(", ")}</dd>
              </div>
              {a.note && (
                <div>
                  <dt>Note from the organisers</dt>
                  <dd>{a.note}</dd>
                </div>
              )}
            </dl>
          </section>
        ))
      )}

      <p className="ac-fine">
        Can&apos;t make your slot? Say so in <a href={DISCORD}>the Discord</a> as early as you
        can — teams plan their Saturday around these.
      </p>
    </>
  );
}
