/* Why: give admins one place to inspect the account before changing access. */

import { notFound } from "next/navigation";

import { requireAdmin } from "../../../../lib/auth";
import { roleLabel } from "../../../../lib/accounts";
import { registrationFor, teamFor, userById } from "../../../../lib/store";
import { GrantRoleForm, RevokeRoleForm } from "../../role-form";

export const metadata = {
  title: "User — Ship AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function display(value, fallback = "—") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function displayList(values, fallback = "—") {
  if (!Array.isArray(values) || values.length === 0) return fallback;
  return values.map((value) => display(value)).join(", ");
}

function formatDate(value) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Phoenix",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function rolesFor(user) {
  const roles = Array.isArray(user?.roles) ? user.roles : [];
  return Array.from(new Set([...roles, ...(user?.is_admin ? ["admin"] : [])]));
}

export default async function Page({ params }) {
  const admin = await requireAdmin();
  void admin;

  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const user = await userById(id);
  if (!user) notFound();

  const [registration, team] = await Promise.all([registrationFor(user.id), teamFor(user.id)]);
  const roles = rolesFor(user);
  const profile = [
    ["Account ID", user.id],
    ["Name", display(user.name, "Unnamed user")],
    ["Email", display(user.email, "No email")],
    ["Handle", display(user.handle, "Not set")],
    ["Phone", display(user.phone, "Not provided")],
    ["Company", display(user.company, "Not provided")],
    ["Title", display(user.title, "Not provided")],
    ["Bio", display(user.bio, "Not provided")],
    ["Discord", display(user.discord, "Not provided")],
    ["GitHub", display(user.github, "Not provided")],
    ["X", display(user.x_handle, "Not provided")],
    ["LinkedIn", display(user.linkedin, "Not provided")],
    ["Website", display(user.website, "Not provided")],
    ["Avatar URL", display(user.avatar_url, "Not set")],
    ["Interests", displayList(user.interests, "None selected")],
    ["Goals", displayList(user.goals, "None selected")],
    ["Goal note", display(user.goal_note, "Not provided")],
    ["Sponsor tier", display(user.sponsor_tier, "Not selected")],
    ["Public profile", user.public_profile === false ? "Hidden" : "Visible"],
    ["Onboarded", formatDate(user.onboarded_at)],
    ["Joined", formatDate(user.created_at)],
    ["Last seen", formatDate(user.last_seen_at)],
  ];

  return (
    <>
      <p>
        <a href="/admin/users" className="ac-btn-link">
          Back to users
        </a>
      </p>

      <div className="ac-head">
        <p className="ac-kicker">Admin · people</p>
        <h1>{user.name || user.email || "Unnamed user"}</h1>
        <p>{user.email || "No email"}</p>
      </div>

      <section className="ac-card">
        <div className="ac-card-head">
          <h2>Profile</h2>
          <span className={`ac-pill ${user.onboarded_at ? "is-ok" : "is-off"}`}>
            {user.onboarded_at ? "Onboarded" : "Not onboarded"}
          </span>
        </div>
        <dl className="ac-dl">
          {profile.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="ac-card">
        <div className="ac-card-head">
          <h2>Registration and team</h2>
          <span className={`ac-pill ${registration ? "is-ok" : "is-off"}`}>
            {registration ? "Registered" : "Not registered"}
          </span>
        </div>
        <dl className="ac-dl">
          <div>
            <dt>Track</dt>
            <dd>{registration ? display(registration.track, "Not selected") : "Not registered"}</dd>
          </div>
          <div>
            <dt>Product</dt>
            <dd>{registration ? display(registration.product, "Not provided") : "Not registered"}</dd>
          </div>
          <div>
            <dt>Team</dt>
            <dd>{team ? display(team.name, "Unnamed team") : "No team"}</dd>
          </div>
          <div>
            <dt>Team members</dt>
            <dd>
              {team
                ? team.members?.map((member) => member.name || member.email).filter(Boolean).join(", ") || "No members listed"
                : "No team"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="ac-card">
        <div className="ac-card-head">
          <h2>Granted roles</h2>
          <span className="ac-pill">{roles.length}</span>
        </div>

        {roles.length > 0 ? (
          <div className="ac-actions">
            {roles.map((role) => (
              <span className="ac-pill" key={role}>
                {roleLabel(role)}
              </span>
            ))}
          </div>
        ) : (
          <div className="ac-empty">
            <strong>No roles granted</strong>
            Grant a role below when this account needs access to an admin surface.
          </div>
        )}

        <GrantRoleForm userId={user.id} />

        <div className="ac-actions">
          {roles.map((role) => (
            <RevokeRoleForm key={`${user.id}-${role}`} userId={user.id} role={role} />
          ))}
        </div>
      </section>
    </>
  );
}
