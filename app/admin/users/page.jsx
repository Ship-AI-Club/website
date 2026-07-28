/* Why: make account search, role state and direct grants visible in one admin table. */

import { requireAdmin } from "../../../lib/auth";
import { ROLE_IDS, roleLabel } from "../../../lib/accounts";
import { listUsers } from "../../../lib/store";
import { GrantRoleForm, RevokeRoleForm } from "../role-form";

export const metadata = {
  title: "Users — Ship AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function normalize(value) {
  return typeof value === "string" ? value.trim() : "";
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Phoenix",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function Page({ searchParams }) {
  const admin = await requireAdmin();
  void admin;
  const params = (await searchParams) || {};
  const q = normalize(params.q);
  const rawRole = normalize(params.role);
  const role = ROLE_IDS.includes(rawRole) ? rawRole : "";
  const users = await listUsers({ q, role });

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">Admin · people</p>
        <h1>Users</h1>
        <p>Search accounts, inspect access and change a person&apos;s granted roles.</p>
      </div>

      <section className="ac-card">
        <form method="get" className="ac-form is-tight">
          <div className="ac-row">
            <div className="ac-field">
              <label className="ac-label" htmlFor="user-search">
                Search users
              </label>
              <p className="ac-hint">Matches name, email or company.</p>
              <input id="user-search" name="q" type="text" defaultValue={q} />
            </div>

            <div className="ac-field">
              <label className="ac-label" htmlFor="user-role">
                Role
              </label>
              <select id="user-role" name="role" defaultValue={role}>
                <option value="">All roles</option>
                {ROLE_IDS.map((id) => (
                  <option key={id} value={id}>
                    {roleLabel(id)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="ac-actions">
            <button type="submit" className="btn btn-solid">
              Search
            </button>
          </div>
        </form>
      </section>

      <section className="ac-card">
        <div className="ac-card-head">
          <h2>Accounts</h2>
          <span className="ac-pill">{users.length}</span>
        </div>

        {users.length > 0 ? (
          <div className="ac-table-wrap">
            <table className="ac-table">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Company / title</th>
                  <th>Roles</th>
                  <th>Registered</th>
                  <th>Team</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const roles = Array.isArray(user.roles) ? user.roles : [];
                  return (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.name || "Unnamed user"}</strong>
                        <span className="ac-sub">{user.email || "No email"}</span>
                      </td>
                      <td>
                        <strong>{user.company || "No company"}</strong>
                        <span className="ac-sub">{user.title || "No title"}</span>
                      </td>
                      <td>
                        {roles.length > 0 ? (
                          <div className="ac-actions">
                            {roles.map((heldRole) => (
                              <span className="ac-pill" key={heldRole}>
                                {roleLabel(heldRole)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="ac-fine">No roles</span>
                        )}
                      </td>
                      <td>
                        <span className={`ac-pill ${user.registered ? "is-ok" : "is-off"}`}>
                          {user.registered ? "Registered" : "Not registered"}
                        </span>
                      </td>
                      <td>
                        {user.team_name ? (
                          <strong>{user.team_name}</strong>
                        ) : (
                          <span className="ac-fine">No team</span>
                        )}
                      </td>
                      <td>{formatDate(user.created_at)}</td>
                      <td>
                        <div className="ac-actions">
                          <GrantRoleForm userId={user.id} />
                          {roles.map((heldRole) => (
                            <RevokeRoleForm key={`${user.id}-${heldRole}`} userId={user.id} role={heldRole} />
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="ac-empty">
            <strong>No users match these filters</strong>
            Clear the search or choose All roles to see more accounts.
          </div>
        )}
      </section>
    </>
  );
}
