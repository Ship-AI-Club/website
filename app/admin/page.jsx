/* Keep the admin overview concrete: counts, switches, and audit. */

import { requireAdmin } from "../../lib/auth";
import { INTERESTS, goalLabel } from "../../lib/accounts";
import { allSettings, SETTINGS } from "../../lib/settings";
import {
  adminStats,
  goalBreakdown,
  interestBreakdown,
  recentAudit,
} from "../../lib/store";
import SettingsForm from "./settings-form";

export const metadata = {
  title: "Admin — Ship AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STAT_FIELDS = [
  ["users", "Users"],
  ["onboarded", "Onboarded"],
  ["registered", "Registered"],
  ["teams", "Teams"],
  ["submitted", "Submitted"],
  ["drafts", "Drafts"],
  ["pending_requests", "Pending requests"],
  ["judges", "Judges"],
  ["mentors", "Mentors"],
  ["sponsors", "Sponsors"],
  ["assignments", "Assignments"],
  ["cards", "Cards"],
  ["votes", "Votes"],
  ["certificates", "Certificates"],
];

function countValue(stats, key) {
  const value = Number(stats?.[key]);
  return Number.isFinite(value) ? value : 0;
}

function interestName(id) {
  return INTERESTS.find((interest) => interest.id === id)?.label ?? id ?? "Unknown";
}

function formatTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

function formatMeta(meta) {
  if (meta === null || meta === undefined) return "—";
  if (typeof meta === "string") return meta || "—";
  try {
    return JSON.stringify(meta) || "—";
  } catch {
    return "—";
  }
}

export default async function Page() {
  const admin = await requireAdmin();
  const [stats, interestRows, goalRows, auditRows, settings] = await Promise.all([
    adminStats(),
    interestBreakdown(),
    goalBreakdown(),
    recentAudit(),
    allSettings(),
  ]);

  const interests = Array.isArray(interestRows) ? interestRows : [];
  const goals = Array.isArray(goalRows) ? goalRows : [];
  const audit = Array.isArray(auditRows) ? auditRows : [];

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">Administration</p>
        <h1>Admin overview.</h1>
        <p>Signed in as {admin?.name || admin?.email || "admin"}. System state and recent activity.</p>
      </div>

      <div className="ac-stats">
        {STAT_FIELDS.map(([key, label]) => (
          <div className="ac-stat" key={key}>
            <b>{countValue(stats, key)}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <section className="ac-card">
        <div className="ac-card-head">
          <h2>Runtime settings</h2>
        </div>
        <ul className="ac-list">
          {SETTINGS.map((setting) => {
            const enabled = Boolean(settings?.[setting.key]);
            return (
              <li key={setting.key}>
                <div>
                  <strong>{setting.label}</strong>
                  <span className="ac-sub">{setting.copy}</span>
                </div>
                <div className="ac-list-end">
                  <span className={`ac-pill ${enabled ? "is-ok" : "is-off"}`}>
                    {enabled ? "On" : "Off"}
                  </span>
                  <SettingsForm settingKey={setting.key} value={enabled} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="ac-cards">
        <section className="ac-card">
          <div className="ac-card-head">
            <h2>Interests</h2>
          </div>
          {interests.length ? (
            <ul className="ac-list">
              {interests.map((row, index) => (
                <li key={`${row?.interest ?? "unknown"}-${index}`}>
                  <strong>{interestName(row?.interest)}</strong>
                  <span className="ac-list-end ac-mono">{countValue(row, "n")}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="ac-empty">
              <strong>No interest data</strong>
              <p>Onboarded accounts will populate this list.</p>
            </div>
          )}
        </section>

        <section className="ac-card">
          <div className="ac-card-head">
            <h2>Goals</h2>
          </div>
          {goals.length ? (
            <ul className="ac-list">
              {goals.map((row, index) => (
                <li key={`${row?.goal ?? "unknown"}-${index}`}>
                  <strong>{goalLabel(row?.goal ?? "Unknown")}</strong>
                  <span className="ac-list-end ac-mono">{countValue(row, "n")}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="ac-empty">
              <strong>No goal data</strong>
              <p>As users set goals, this list will populate.</p>
            </div>
          )}
        </section>
      </div>

      <section className="ac-card">
        <div className="ac-card-head">
          <h2>Recent audit</h2>
        </div>
        <div className="ac-table-wrap">
          <table className="ac-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Target</th>
                <th>Meta</th>
              </tr>
            </thead>
            <tbody>
              {audit.length ? (
                audit.map((row, index) => (
                  <tr key={row?.id ?? `audit-${index}`}>
                    <td>
                      <time dateTime={row?.created_at ?? undefined}>{formatTime(row?.created_at)}</time>
                    </td>
                    <td>{row?.actor || "System"}</td>
                    <td><strong>{row?.action || "—"}</strong></td>
                    <td><span className="ac-mono">{row?.target || "—"}</span></td>
                    <td><span className="ac-mono">{formatMeta(row?.meta)}</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="ac-empty">
                      <strong>No audit entries</strong>
                      <p>Admin actions will appear here as they occur.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
