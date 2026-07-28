/* Why this exists: make sponsorship commitments traceable from account owner through public credit. */

import { Fragment } from "react";
import { CircleDollarSign, Handshake } from "lucide-react";

import { requireAdmin } from "../../../lib/auth";
import { allSponsorships, listUsers } from "../../../lib/store";
import { DeleteSponsorshipForm, SponsorshipForm } from "../sponsorship-form";

export const metadata = {
  title: "Sponsors — Ship AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const admin = await requireAdmin();
  void admin;

  const [sponsorships, users] = await Promise.all([allSponsorships(), listUsers({})]);

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">Admin / partners</p>
        <h1>Sponsors</h1>
        <p>Track the commitment, its status, and the exact name that should receive public credit.</p>
      </div>

      <section className="ac-card">
        <div className="ac-card-head">
          <CircleDollarSign size={18} strokeWidth={1.75} aria-hidden="true" />
          <h2>Sponsorship summary</h2>
          <span className="ac-pill is-live">{sponsorships.length}</span>
        </div>
        {sponsorships.length ? (
          <div className="ac-table-wrap">
            <table className="ac-table">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Email</th>
                  <th>Organization</th>
                  <th>Tier</th>
                  <th className="ac-num">Amount</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Credit</th>
                </tr>
              </thead>
              <tbody>
                {sponsorships.map((sponsorship) => (
                  <Fragment key={sponsorship.id}>
                    <tr>
                      <td><strong>{sponsorship.person || "—"}</strong></td>
                      <td>{sponsorship.email || "—"}</td>
                      <td>{sponsorship.org || "—"}</td>
                      <td>{sponsorship.tier || "Automatic"}</td>
                      <td className="ac-num">${Number(sponsorship.amount || 0).toLocaleString()}</td>
                      <td><span className={`ac-pill ${sponsorship.status === "paid" ? "is-ok" : "is-live"}`}>{sponsorship.status || "pledged"}</span></td>
                      <td>{sponsorship.items || "—"}</td>
                      <td>{sponsorship.credit_name || "—"}</td>
                    </tr>
                    <tr>
                      <td colSpan={8}>
                        <SponsorshipForm sponsorship={sponsorship} />
                        <DeleteSponsorshipForm sponsorshipId={sponsorship.id} />
                      </td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="ac-empty">
            <strong>No sponsorships recorded</strong>
            Create a sponsorship below when an account commits support.
          </div>
        )}
      </section>

      <section className="ac-card">
        <div className="ac-card-head">
          <Handshake size={18} strokeWidth={1.75} aria-hidden="true" />
          <h2>Create sponsorship</h2>
        </div>
        <p className="ac-note">Creating a sponsorship also grants the selected account the sponsor role.</p>
        <SponsorshipForm users={users} />
      </section>
    </>
  );
}
