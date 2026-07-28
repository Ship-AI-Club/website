/* Why: keep the account index focused on scanning; profile context and role changes live on the detail page. */

import { requireAdmin } from "../../../lib/auth";
import { ROLE_IDS, roleLabel } from "../../../lib/accounts";
import { adminStats, listUsers } from "../../../lib/store";

export const metadata = {
  title: "Users — Ship AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function normalize(value) {
  return typeof value === "string" ? value.trim() : "";
}

function rolesFor(user) {
  const roles = Array.isArray(user?.roles) ? user.roles : [];
  return Array.from(new Set([...roles, ...(user?.is_admin ? ["admin"] : [])]));
}

function uniqueUsers(rows) {
  const users = new Map();
  for (const user of rows) {
    if (user?.id && !users.has(user.id)) users.set(user.id, user);
  }
  return [...users.values()];
}

function summaryStats(overview, users) {
  return [
    ["Total", overview.users],
    ["Onboarded", overview.onboarded],
    ["Registered", overview.registered],
    ...ROLE_IDS.map((role) => [
      roleLabel(role),
      users.filter((user) => rolesFor(user).includes(role)).length,
    ]),
  ];
}

export default async function Page({ searchParams }) {
  const admin = await requireAdmin();
  void admin;

  const params = (await searchParams) || {};
  const q = normalize(params.q);
  const rawRole = normalize(params.role);
  const role = ROLE_IDS.includes(rawRole) ? rawRole : "";
  const overview = await adminStats();
  const [allRows, filteredRows] = await Promise.all([
    listUsers({ limit: overview.users }),
    listUsers({ q, role }),
  ]);
  const allUsers = uniqueUsers(allRows);
  const users = uniqueUsers(filteredRows);
  const hasFilters = Boolean(q || role);

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">Admin · people</p>
        <h1>Users</h1>
        <p>Search accounts, inspect registration status and open a profile for access changes.</p>
      </div>

      <div className="ac-stats">
        {summaryStats(overview, allUsers).map(([label, count]) => (
          <div className="ac-stat" key={label}>
            <b>{count}</b>
            <span>{label}</span>
          </div>
        ))}
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
                  <th>Roles</th>
                  <th>Registered / Team</th>
                  <th>Profile</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const roles = rolesFor(user);
                  return (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.name || "Unnamed user"}</strong>
                        <span className="ac-sub">{user.email || "No email"}</span>
                      </td>
                      <td>
                        <div className="ac-actions">
                          {roles.length > 0 ? (
                            roles.map((heldRole) => (
                              <span className="ac-pill" key={heldRole}>
                                {roleLabel(heldRole)}
                              </span>
                            ))
                          ) : (
                            <span className="ac-fine">No roles</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`ac-pill ${user.registered ? "is-ok" : "is-off"}`}>
                          {user.registered ? "Registered" : "Not registered"}
                        </span>
                        <span className="ac-sub">{user.team_name || "No team"}</span>
                      </td>
                      <td>
                        <a href={`/admin/users/${user.id}`} className="ac-btn-link">
                          Open
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="ac-empty">
            <strong>{hasFilters ? "No users match these filters" : "Nobody has registered yet"}</strong>
            {hasFilters
              ? "Clear the search or choose All roles to see more accounts."
              : "Names appear here as people sign up."}
          </div>
        )}
      </section>
    </>
  );
}
