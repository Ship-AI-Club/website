/* Why this exists: make sponsorship commitments traceable from account owner through public credit. */

import { Fragment } from "react";
import { CircleDollarSign, Handshake, Image as ImageIcon } from "lucide-react";

import { requireAdmin } from "../../../lib/auth";
import { allSponsorships, listUsers } from "../../../lib/store";
import { DeleteSponsorshipForm, SponsorshipForm } from "../sponsorship-form";

export const metadata = {
  title: "Sponsors — Ship AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/* The logo as uploaded by the account, small enough to scan a column
   of them and linked to the original because the original is what
   gets saved into public/sponsors/. */
function Logo({ url, alt }) {
  if (!url) return <span className="ac-fine">—</span>;
  return (
    <a href={url} target="_blank" rel="noreferrer" title="Open full size">
      <img
        src={url}
        alt={alt || ""}
        style={{
          height: "1.75rem",
          maxWidth: "6rem",
          objectFit: "contain",
          verticalAlign: "middle",
        }}
      />
    </a>
  );
}

export default async function Page() {
  const admin = await requireAdmin();
  void admin;

  const [sponsorships, users] = await Promise.all([allSponsorships(), listUsers({})]);

  /* Every account that says it's sponsoring, whether or not a
     sponsorship has been recorded yet. The summary above only knows
     about money already pledged; the logo arrives at onboarding, long
     before that, and this is where it can be collected. Uploads
     first, so the ones ready to save are at the top. */
  const brandOwners = users
    .filter(
      (u) => (u.roles || []).includes("sponsor") || (u.interests || []).includes("sponsoring"),
    )
    .sort((a, b) => Number(Boolean(b.company_logo)) - Number(Boolean(a.company_logo)));

  const withLogo = brandOwners.filter((u) => u.company_logo).length;

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
                  <th>Logo</th>
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
                      <td>
                        <Logo
                          url={sponsorship.company_logo}
                          alt={sponsorship.org || sponsorship.person || ""}
                        />
                      </td>
                      <td>{sponsorship.tier || "Automatic"}</td>
                      <td className="ac-num">${Number(sponsorship.amount || 0).toLocaleString()}</td>
                      <td><span className={`ac-pill ${sponsorship.status === "paid" ? "is-ok" : "is-live"}`}>{sponsorship.status || "pledged"}</span></td>
                      <td>{sponsorship.items || "—"}</td>
                      <td>{sponsorship.credit_name || "—"}</td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
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
          <ImageIcon size={18} strokeWidth={1.75} aria-hidden="true" />
          <h2>Brand assets</h2>
          <span className="ac-pill is-live">
            {withLogo}/{brandOwners.length}
          </span>
        </div>
        <p className="ac-note">
          Logos uploaded at onboarding by anyone holding the sponsor role or interested in
          sponsoring. Open one full size and save it into <code>public/sponsors/</code>.
        </p>
        {brandOwners.length ? (
          <div className="ac-table-wrap">
            <table className="ac-table">
              <thead>
                <tr>
                  <th>Logo</th>
                  <th>Person</th>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Tier interest</th>
                </tr>
              </thead>
              <tbody>
                {brandOwners.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <Logo url={u.company_logo} alt={u.company || u.name || ""} />
                    </td>
                    <td>
                      <a href={`/admin/users/${u.id}`}>
                        <strong>{u.name || "Unnamed"}</strong>
                      </a>
                    </td>
                    <td>{u.company || "—"}</td>
                    <td>{u.email}</td>
                    <td>{u.sponsor_tier || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="ac-empty">
            <strong>Nobody has said they&apos;re sponsoring yet</strong>
            Logos land here the moment an account ticks sponsoring at onboarding.
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
