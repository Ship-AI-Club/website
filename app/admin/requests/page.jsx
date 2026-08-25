/* Why: give admins one focused surface for reviewing and recording role requests. */

import { UserRound } from "lucide-react";

import { requireAdmin } from "../../../lib/auth";
import { roleLabel, volunteerJobLabel } from "../../../lib/accounts";
import { tierById } from "../../../lib/sponsors";
import { decidedRequests, pendingRequests } from "../../../lib/store";
import RequestForm from "../request-form";

export const metadata = {
  title: "Role Requests — Ship AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function display(value, fallback = "—") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function formatDate(value, withTime = false) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Phoenix",
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  }).format(date);
}

function statusClass(status) {
  if (status === "approved") return "is-ok";
  if (status === "declined") return "is-off";
  return "is-warn";
}

export default async function Page() {
  const admin = await requireAdmin();
  void admin;
  const [pending, decided] = await Promise.all([pendingRequests(), decidedRequests()]);

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">Admin · access</p>
        <h1>Role requests</h1>
        <p>Review the people asking to sponsor, mentor or judge, then record the decision they receive.</p>
      </div>

      {pending.length > 0 ? (
        <div className="ac-cards">
          {pending.map((request) => {
            const tier = tierById(request.sponsor_tier);
            const person = display(request.name, request.email || "Role request");

            return (
              <section className="ac-card" key={request.id}>
                <div className="ac-card-head">
                  <UserRound size={18} strokeWidth={1.75} aria-hidden="true" />
                  <h2>{person}</h2>
                  <span className="ac-pill is-warn">Pending</span>
                </div>

                <dl className="ac-dl">
                  <div>
                    <dt>Name</dt>
                    <dd>{display(request.name, "Not provided")}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{display(request.email, "Not provided")}</dd>
                  </div>
                  <div>
                    <dt>Company</dt>
                    <dd>{display(request.company, "Not provided")}</dd>
                  </div>
                  <div>
                    <dt>Title</dt>
                    <dd>{display(request.title, "Not provided")}</dd>
                  </div>
                  <div>
                    <dt>Role</dt>
                    <dd>{roleLabel(request.role)}</dd>
                  </div>
                  {request.sponsor_tier && (
                    <div>
                      <dt>Sponsor tier</dt>
                      <dd>{tier?.name || display(request.sponsor_tier)}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Message</dt>
                    <dd>{display(request.message, "No message provided.")}</dd>
                  </div>
                  <div>
                    <dt>Expertise</dt>
                    <dd>{display(request.expertise, "No expertise provided.")}</dd>
                  </div>
                  {request.jobs?.length > 0 && (
                    <div>
                      <dt>Can cover</dt>
                      <dd>{request.jobs.map(volunteerJobLabel).join(" · ")}</dd>
                    </div>
                  )}
                </dl>

                <RequestForm requestId={request.id} />
              </section>
            );
          })}
        </div>
      ) : (
        <section className="ac-card">
          <div className="ac-empty">
            <strong>No pending requests</strong>
            New role requests appear here after someone submits the access form.
          </div>
        </section>
      )}

      <section className="ac-card">
        <div className="ac-card-head">
          <h2>Decided requests</h2>
          <span className="ac-pill">{decided.length}</span>
        </div>

        {decided.length > 0 ? (
          <div className="ac-table-wrap">
            <table className="ac-table">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Decided</th>
                  <th>Admin note</th>
                </tr>
              </thead>
              <tbody>
                {decided.map((request) => {
                  const status = display(request.status, "unknown").toLowerCase();
                  return (
                    <tr key={request.id}>
                      <td>
                        <strong>{display(request.name, request.email || "Unnamed user")}</strong>
                        <span className="ac-sub">{display(request.email)}</span>
                      </td>
                      <td>{roleLabel(request.role)}</td>
                      <td>
                        <span className={`ac-pill ${statusClass(status)}`}>{status}</span>
                      </td>
                      <td>{formatDate(request.decided_at, true)}</td>
                      <td>{display(request.admin_note, "No note")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="ac-empty">
            <strong>No decided requests</strong>
            Decide a pending request to build the decision record here.
          </div>
        )}
      </section>
    </>
  );
}
