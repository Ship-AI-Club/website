import { Handshake } from "lucide-react";

import { requireOnboarded, hasRole } from "../../../lib/auth";
import { REQUESTABLE_ROLES, roleLabel, sponsorChoiceLabel } from "../../../lib/accounts";
import { requestsForUser } from "../../../lib/store";
import { DISCORD, EVENT } from "../../../lib/hackathon";
import { RequestForm, WithdrawForm } from "./request-form";

export const metadata = {
  title: "Requests — Ship AI",
  robots: { index: false, follow: false },
};

const STATUS = {
  pending: { label: "With Santos", className: "is-warn" },
  approved: { label: "Confirmed", className: "is-ok" },
  declined: { label: "Not this round", className: "is-off" },
  withdrawn: { label: "Withdrawn", className: "is-off" },
};

function when(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function Page() {
  const user = await requireOnboarded("/dashboard/requests");
  const requests = await requestsForUser(user.id);

  /* One open request per role, and none for a role you already hold. */
  const available = REQUESTABLE_ROLES.filter(
    (role) =>
      !hasRole(user, role) && !requests.some((r) => r.role === role && r.status === "pending"),
  );

  const held = REQUESTABLE_ROLES.filter((role) => hasRole(user, role));

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">Sponsor · mentor · judge</p>
        <h1>Get involved</h1>
        <p>
          Three ways in beyond competing. Each one is a short request that lands with Santos
          directly — no form-to-nowhere, and you can see where it stands from here.
        </p>
      </div>

      {held.length > 0 && (
        <section className="ac-card is-accent">
          <div className="ac-card-head">
            <Handshake size={18} strokeWidth={1.75} aria-hidden="true" />
            <h2>
              You&apos;re confirmed as {held.map((r) => roleLabel(r).toLowerCase()).join(" and ")}
            </h2>
          </div>
          <p>
            Everything you need is in the nav — {hasRole(user, "judge") && "your scorecards, "}
            {hasRole(user, "mentor") && "the teams you're paired with, "}
            and the weekend runs {EVENT.dates} at {EVENT.venue}.
          </p>
        </section>
      )}

      {requests.length > 0 && (
        <section className="ac-card">
          <h2>Your requests</h2>
          <ul className="ac-list">
            {requests.map((r) => {
              const status = STATUS[r.status] ?? STATUS.pending;
              return (
                <li key={r.id}>
                  <strong>{roleLabel(r.role)}</strong>
                  <span>
                    sent {when(r.created_at)}
                    {r.sponsor_tier ? ` · ${sponsorChoiceLabel(r.sponsor_tier)}` : ""}
                  </span>
                  <span className="ac-list-end">
                    <span className={`ac-pill ${status.className}`}>{status.label}</span>
                    {r.status === "pending" && <WithdrawForm id={r.id} />}
                  </span>
                </li>
              );
            })}
          </ul>
          {requests.some((r) => r.admin_note) && (
            <>
              <hr className="ac-divider" />
              <dl className="ac-dl">
                {requests
                  .filter((r) => r.admin_note)
                  .map((r) => (
                    <div key={`note-${r.id}`}>
                      <dt>{roleLabel(r.role)} — reply</dt>
                      <dd>{r.admin_note}</dd>
                    </div>
                  ))}
              </dl>
            </>
          )}
        </section>
      )}

      {available.length > 0 ? (
        <section className="ac-card">
          <h2>{requests.length > 0 ? "Send another" : "Send a request"}</h2>
          <RequestForm available={available} sponsorTier={user.sponsor_tier} />
        </section>
      ) : (
        <div className="ac-empty">
          <strong>Nothing left to ask for.</strong>
          You&apos;ve either got the role or the request is in. Anything else, say so in{" "}
          <a href={DISCORD} target="_blank" rel="noreferrer">
            the Discord
          </a>
          .
        </div>
      )}
    </>
  );
}
