import { requireOnboarded } from "../../../lib/auth";
import { roleLabel } from "../../../lib/accounts";
import { sql } from "../../../lib/db";
import { signOutEverywhereAction } from "../../login/actions";
import ProfileForm from "./profile-form";

export const metadata = {
  title: "Profile — Ship AI",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const user = await requireOnboarded("/dashboard/profile");

  const sessions = await sql`
    select id, user_agent, created_at, last_seen_at from sessions
     where user_id = ${user.id} and revoked_at is null and expires_at > now()
     order by created_at desc`;

  const roles = (user.roles || []).filter((r) => r !== "participant");

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">Your account</p>
        <h1>Profile</h1>
        <p>
          What we know about you and what you told us you&apos;re here for. The name is the
          one that goes on your certificate.
        </p>
      </div>

      <section className="ac-card">
        <ProfileForm user={user} />
      </section>

      <section className="ac-card">
        <h2>Sign-in</h2>
        <p>
          You sign in with <strong style={{ color: "var(--ink)" }}>{user.email}</strong> and a
          one-time code. There&apos;s no password on this account, which is the point — there
          isn&apos;t one to leak.
        </p>
        <p className="ac-fine">
          To change the address you sign in with, ask in the Discord. It moves your team,
          submission and certificates with it, so it isn&apos;t a self-serve button.
        </p>
      </section>

      {roles.length > 0 && (
        <section className="ac-card">
          <h2>Your roles</h2>
          <ul className="ac-list">
            {roles.map((r) => (
              <li key={r}>
                <strong>{roleLabel(r)}</strong>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="ac-card">
        <h2>Active sessions</h2>
        <p>
          {sessions.length === 1
            ? "One device is signed in — this one."
            : `${sessions.length} devices are signed in.`}
        </p>
        <ul className="ac-list">
          {sessions.map((s) => (
            <li key={s.id}>
              <strong>{(s.user_agent || "Unknown device").slice(0, 70)}</strong>
              <span className="ac-list-end ac-fine">
                last seen{" "}
                {new Date(s.last_seen_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </li>
          ))}
        </ul>
        <form action={signOutEverywhereAction}>
          <button type="submit" className="btn btn-ghost ac-btn-sm">
            Sign out everywhere
          </button>
        </form>
      </section>
    </>
  );
}
