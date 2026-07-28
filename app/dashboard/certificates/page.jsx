import { BadgeCheck, ExternalLink } from "lucide-react";

import { requireOnboarded } from "../../../lib/auth";
import { certificatesFor } from "../../../lib/store";
import { EVENT } from "../../../lib/hackathon";
import {
  EDITION,
  ISSUER,
  LINKEDIN_ADD_URL,
  certFields,
  certPath,
  credentialName,
} from "../../../lib/results";

export const metadata = {
  title: "Your certificates — Ship AI",
  robots: { index: false, follow: false },
};

/* Every team that submits gets one — that's a promise on /hackathon,
   and this is where it gets collected. The public page at
   /hackathon/certificate/<id> is the credential itself; this page is
   the index of the ones that are yours, plus the exact fields
   LinkedIn's certification form asks for. */

export default async function Page() {
  const user = await requireOnboarded("/dashboard/certificates");
  const certificates = await certificatesFor(user.id);

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">{EDITION.name}</p>
        <h1>Your certificates</h1>
        <p>
          Each one lives at a permanent public URL. Link it from LinkedIn, a CV or a job
          application — it stays up, and it verifies itself.
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="ac-empty">
          <strong>Nothing issued yet.</strong>
          Every team that submits a project gets a certification, issued at the closing
          ceremony on {EDITION.resultsDay}. Winners get theirs named for the category they
          took.
          <p style={{ marginTop: "1.25rem" }}>
            <a className="btn btn-ghost ac-btn-sm" href="/dashboard/submission">
              Your submission
            </a>
          </p>
        </div>
      ) : (
        certificates.map((cert) => {
          const fields = certFields(cert);
          return (
            <section key={cert.id} className="ac-card">
              <div className="ac-card-head">
                <BadgeCheck size={18} strokeWidth={1.75} aria-hidden="true" />
                <h2>{cert.project || cert.team}</h2>
                {(cert.award || cert.crowd) && <span className="ac-pill is-ok">Winner</span>}
              </div>

              <p>{credentialName(cert)}</p>

              <div className="ac-actions">
                <a className="btn btn-solid ac-btn-sm" href={certPath(cert)}>
                  View the certificate
                </a>
                <a
                  className="btn btn-ghost ac-btn-sm"
                  href={LINKEDIN_ADD_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Add to LinkedIn
                  <ExternalLink
                    size={13}
                    strokeWidth={1.75}
                    aria-hidden="true"
                    style={{ marginLeft: ".4rem", verticalAlign: "-1px" }}
                  />
                </a>
              </div>

              <hr className="ac-divider" />

              <h3 style={{ fontSize: "1rem" }}>What LinkedIn asks for</h3>
              <p className="ac-fine">
                LinkedIn stopped honouring prefilled certification links, so the button opens
                an empty form. These are the five fields it wants, in order — copy them
                across.
              </p>
              <dl className="ac-dl">
                {fields.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          );
        })
      )}

      <p className="ac-fine">
        Issued by {ISSUER} for {EVENT.name}, {EDITION.held}. Every credential is also listed
        on the public <a href="/hackathon/results">results page</a>.
      </p>
    </>
  );
}
