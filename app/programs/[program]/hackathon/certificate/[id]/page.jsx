import { notFound } from "next/navigation";
import { JsonLd } from "../../../../../../components/article";
import SiteFooter from "../../../../../../components/site-footer";
import SiteHeader from "../../../../../../components/site-header";
import { Seal } from "../../../../../../components/seal";
import { DISCORD, EVENT } from "../../../../../../lib/hackathon";
import { PROGRAMS, programBySlug } from "../../../../../../lib/programs";
import { publicTeamPath, publicTeams } from "../../../../../../lib/public-teams";
import {
  EDITION,
  ISSUER,
  certFields,
  certUrl,
  credentialName,
  fromCertificate,
  isWinner,
  linkedinAddUrl,
  placementOf,
  previewEntrants,
} from "../../../../../../lib/results";
import { certificateById } from "../../../../../../lib/store";
import CertActions from "./cert-actions";
import "../../../../../../components/event-page.css";
import "../certificate.css";
import { ogImage } from "../../../../../../lib/og";

const RESULTS = "/programs/zero-to-launch/hackathon/results";
const same = (a, b) => Boolean(a && b) && a.trim().toLowerCase() === b.trim().toLowerCase();

/* Certificates are issued from /admin after the awards, so this page
   is rendered on demand rather than built ahead: the credential has to
   exist the moment it's issued, not at the next deploy. An id with no
   row behind it is a 404 — a certificate URL that resolved for anyone
   would be worth nothing.

   Cached for a minute so a credential doing the rounds on LinkedIn
   isn't a database read per visitor. */
export const revalidate = 60;

export function generateStaticParams() {
  return PROGRAMS.filter((program) => program.hasHackathon).map((program) => ({
    program: program.slug,
  }));
}

async function entrantFor(id) {
  const row = await certificateById(id);
  if (row) return fromCertificate(row);
  /* SHIPAI_PREVIEW=1 renders the template without a database. */
  return previewEntrants().find((e) => e.id === id) ?? null;
}

export async function generateMetadata({ params }) {
  const { program: programSlug, id } = await params;
  const program = programBySlug(programSlug);
  if (!program?.hasHackathon) notFound();
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
      images: [ogImage({ kicker: "Certificate", title: e.team, tagline: credentialName(e), meta: EDITION.event })],
    },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }) {
  const { program: programSlug, id } = await params;
  const program = programBySlug(programSlug);
  if (!program?.hasHackathon) notFound();
  const e = await entrantFor(id);
  if (!e) return notFound();

  const won = isWinner(e);
  /* The members line is dropped where it only repeats the team name. */
  const members = (e.members ?? []).filter(Boolean);
  if (members.length === 1 && same(members[0], e.team)) members.length = 0;

  /* The one action for someone checking the credential: the project's
     own page on this site, where the recorded pitch is. A certificate
     with no team page behind it falls back to the project's website. */
  const team = (await publicTeams()).find((t) => same(t.name, e.team) || same(t.registered_name, e.team) || same(t.project, e.project));
  const proof = team
    ? { href: `${publicTeamPath(team)}${team.pitch_video_url ? "#team-pitch" : ""}`, label: team.pitch_video_url ? `See ${team.project || e.project} and its pitch` : `See ${team.project || e.project}` }
    : e.url ? { href: e.url, label: "See the project", external: true } : null;
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
            url: "https://www.shipai.club/programs/zero-to-launch/hackathon",
          },
          recognizedBy: {
            "@type": "Organization",
            name: ISSUER,
            url: "https://www.shipai.club",
          },
        }}
      />

      <SiteHeader current="/programs" cta={<a className="btn btn-solid btn-sm nav-cta" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a>} />

      <main id="top" className="cx-page">
        {e.preview && (
          <p className="cx-preview">
            Development preview — placeholder entrant, never built into the deployed site.
          </p>
        )}

        <p className="ev-crumb cx-crumb"><a href={RESULTS}>← All {EDITION.name} results</a></p>

        <article className="cx-plate">
          <span className="cx-keyline" aria-hidden="true" />
          <Seal className="cx-seal" size={44} />

          <p className="cx-kind">{won ? "Certificate of achievement" : "Certificate of launch"}</p>

          <h1>{e.team}</h1>

          <p className="cx-body">
            This certifies that <strong>{e.team}</strong> shipped{" "}
            {e.project !== e.team && <><strong>{e.project}</strong>{" "}</>}publicly at <strong>{EDITION.event}</strong>, held{" "}
            {EDITION.held} at {EDITION.venue}, {EDITION.city}.
          </p>

          {members.length > 0 && <p className="cx-members">{members.join(" · ")}</p>}

          <p className={won ? "cx-award is-win" : "cx-award is-plain"}>{placement}</p>

          <div className="cx-sign">
            <div>
              <span className="cx-signature" role="img" aria-label="Signature of Santos Hernandez" />
              <p><strong>Santos Hernandez</strong>Founder, {ISSUER}</p>
            </div>
            <div>
              <span className="cx-id">{e.id}</span>
              <p><strong>Credential ID</strong>{e.entered || "—"}</p>
            </div>
            <div>
              <time className="cx-date" dateTime={EDITION.issuedISO}>{EDITION.issued}</time>
              <p><strong>Date issued</strong></p>
            </div>
          </div>

          <p className="cx-verify">
            Verify at shipai.club/programs/zero-to-launch/hackathon/certificate/{e.id}
          </p>
        </article>

        <div className="cx-under">
          <p className="cx-record">
            <b>Issued by {ISSUER}.</b> This page is the record: shipai.club/…/certificate/{e.id}
          </p>
          {proof && (
            <a className="btn btn-solid" href={proof.href} {...(proof.external ? { target: "_blank", rel: "noreferrer" } : {})}>
              {proof.label}
            </a>
          )}
        </div>

        <div className="cx-yours">
          <span>Is this yours?</span>
          <a className="cx-tool" href={linkedinAddUrl(e)} target="_blank" rel="noreferrer">Add to LinkedIn</a>
          <CertActions fields={certFields(e)} />
          <p>If LinkedIn opens its form empty, copy the details first and paste them in.</p>
        </div>

        <div className="ev-end" />
      </main>

      <SiteFooter />
    </>
  );
}
