import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BadgeCheck, Trophy } from "lucide-react";
import { JsonLd } from "../../../../components/article";
import { DISCORD, EVENT } from "../../../../lib/hackathon";
import {
  EDITION,
  ISSUER,
  LINKEDIN_ADD_URL,
  certFields,
  certUrl,
  credentialName,
  fromCertificate,
  isWinner,
  placementOf,
  previewEntrants,
} from "../../../../lib/results";
import { certificateById } from "../../../../lib/store";
import CertActions from "./cert-actions";
import "../../awards.css";

/* Certificates are issued from /admin after the awards, so this page
   is rendered on demand rather than built ahead: the credential has to
   exist the moment it's issued, not at the next deploy. An id with no
   row behind it is a 404 — a certificate URL that resolved for anyone
   would be worth nothing.

   Cached for a minute so a credential doing the rounds on LinkedIn
   isn't a database read per visitor. */
export const revalidate = 60;

async function entrantFor(id) {
  const row = await certificateById(id);
  if (row) return fromCertificate(row);
  /* SHIPAI_PREVIEW=1 renders the template without a database. */
  return previewEntrants().find((e) => e.id === id) ?? null;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const e = await entrantFor(id);
  if (!e) return {};
  const title = `${e.team} — ${credentialName(e)}`;
  const description = `${e.team} launched ${e.project} at ${EDITION.event}, ${EDITION.held} at ${EDITION.venue}, ${EDITION.city}. ${placementOf(e)}. Issued by ${ISSUER} on ${EDITION.issued}.`;
  return {
    title: `${title} — Ship AI`,
    description,
    alternates: { canonical: certUrl(e) },
    openGraph: {
      title,
      description,
      url: certUrl(e),
      siteName: "Ship AI",
      type: "article",
      /* a page-level openGraph replaces the root layout's wholesale,
         so the site card has to be restated or the credential shares
         as a text-only link */
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  const e = await entrantFor(id);
  if (!e) return notFound();

  const won = isWinner(e);
  const placement = placementOf(e);
  const credentialSummary = won
    ? `${e.team} launched ${e.project} publicly at ${EDITION.event} and took ${placement.replace(/^Winner — /, "")}.`
    : `${e.team} launched ${e.project} publicly at ${EDITION.event}.`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "EducationalOccupationalCredential",
          "@id": certUrl(e),
          name: credentialName(e),
          description: credentialSummary,
          url: certUrl(e),
          credentialCategory: "certificate",
          identifier: {
            "@type": "PropertyValue",
            propertyID: "Ship AI credential ID",
            value: e.id,
          },
          dateCreated: EDITION.issuedISO,
          datePublished: EDITION.issuedISO,
          about: {
            "@type": "Event",
            name: EDITION.event,
            startDate: EVENT.startISO,
            endDate: EVENT.endISO,
            url: "https://www.shipai.club/hackathon",
          },
          recognizedBy: {
            "@type": "Organization",
            name: ISSUER,
            url: "https://www.shipai.club",
          },
        }}
      />

      <header className="nav">
        <a href="/" className="brand">
          <img src="/logo-icon.png" alt="" width={26} height={26} />
          <span>Ship AI</span>
        </a>
        <nav>
          <a href="/hackathon">Hackathon</a>
          <a href="/hackathon/results">Results</a>
        </nav>
        <a className="btn btn-solid nav-cta" href={DISCORD} target="_blank" rel="noreferrer">
          Join the Discord
        </a>
      </header>

      <main className="cert-page">
        {e.preview && (
          <p className="cert-preview">
            Development preview — placeholder entrant, never built into the deployed site.
          </p>
        )}

        <div className="cert-plate">
          <span className="cert-keyline" aria-hidden="true" />

          <img className="cert-seal" src="/logo-icon.png" alt="" width={42} height={42} />

          <p className="cert-kind">
            {won ? "Certificate of achievement" : "Certificate of launch"}
          </p>

          <h1>{e.team}</h1>

          {/* the members line used to sit between the team name and the
              verb, which blurred the subject on a multi-person team —
              the certificate convention carries the sentence instead */}
          <p className="cert-body">
            This certifies that <strong>{e.team}</strong> shipped{" "}
            <strong>{e.project}</strong> publicly at <strong>{EDITION.event}</strong>, held{" "}
            {EDITION.held} at {EDITION.venue}, {EDITION.city} — a 48-hour hackathon judged on
            what shipped rather than what was demoed.
          </p>

          {e.members?.length > 0 && <p className="cert-members">{e.members.join(" · ")}</p>}

          <p className={won ? "cert-award" : "cert-award cert-award-plain"}>
            {won ? (
              <Trophy size={15} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <BadgeCheck size={15} strokeWidth={1.75} aria-hidden="true" />
            )}
            {placement}
          </p>

          <dl className="cert-meta">
            <div>
              <dt>Issued</dt>
              <dd>
                <time dateTime={EDITION.issuedISO}>{EDITION.issued}</time>
              </dd>
            </div>
            <div>
              <dt>Category entered</dt>
              <dd>{e.entered || "—"}</dd>
            </div>
            <div>
              <dt>Credential ID</dt>
              <dd>{e.id}</dd>
            </div>
          </dl>

          <p className="cert-issuer">
            Issued by <strong>{ISSUER}</strong> · {EDITION.city}
          </p>

          <p className="cert-verify">
            Verify at shipai.club/hackathon/certificate/{e.id}.
          </p>
        </div>

        <div className="cert-actions">
          <a className="btn btn-solid" href={LINKEDIN_ADD_URL} target="_blank" rel="noreferrer">
            Add to LinkedIn
            <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
          </a>
          {e.url && (
            <a className="btn btn-ghost" href={e.url} target="_blank" rel="noreferrer">
              See the project
              <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
            </a>
          )}
          <CertActions fields={certFields(e)} />
        </div>
        <p className="cert-note">
          LinkedIn opens an empty certification form — it stopped accepting prefilled
          links. Copy the details first and the five fields are one paste away.
        </p>

        <p className="cert-back">
          <a className="rs-cert" href="/hackathon/results">
            <ArrowLeft size={14} strokeWidth={1.75} aria-hidden="true" />
            All {EDITION.name} results
          </a>
        </p>
      </main>

      <footer className="footer">
        <div className="brand">
          <img src="/logo-icon.png" alt="" width={22} height={22} />
          <span>Ship AI</span>
        </div>
        <p>Phoenix &amp; Tempe, Arizona</p>
        <nav>
          <a href="/">Home</a>
          <a href="/hackathon">Hackathon</a>
          <a href="/hackathon/results">Results</a>
        </nav>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}
