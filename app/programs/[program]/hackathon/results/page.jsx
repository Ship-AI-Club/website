import MobileNav from "../../../../../components/mobile-nav";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, BadgeCheck, CalendarClock, Trophy, Users } from "lucide-react";
import Scene from "../../../../../components/scene";
import ShareActions from "./share-actions";
import { JsonLd } from "../../../../../components/article";
import { DISCORD, EVENT, HACKATHON_PRIZES, MEETUP } from "../../../../../lib/hackathon";
import { PROGRAMS, programBySlug } from "../../../../../lib/programs";
import {
  CATEGORIES,
  EDITION,
  SITE,
  certPath,
  fromCertificate,
  isWinner,
  placementOf,
  previewEntrants,
  sortedEntrants,
  winners,
} from "../../../../../lib/results";
import { publishedCertificates } from "../../../../../lib/store";
import { getSetting } from "../../../../../lib/settings";
import "../awards.css";
import { Lockup } from "../../../../../components/seal";

/* Results are published by flipping a switch in /admin on the Sunday,
   not by a deploy — see lib/settings.js. Until then this page renders
   the pending state, which is what it has said since July.

   Revalidated rather than dynamic: the moment after the awards is the
   busiest this page will ever be, and a minute of staleness costs
   nothing next to a database read per visitor. */
export const revalidate = 60;

const TITLE = `Results — ${EDITION.name}`;
const DESCRIPTION = `Every team that shipped at ${EDITION.event}, ${EDITION.held} at ${EDITION.venue}, ${EDITION.city}. Category winners, live projects and the certification for each entrant.`;

export const metadata = {
  title: `${TITLE} — Ship AI`,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.shipai.club/programs/zero-to-launch/hackathon/results" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.shipai.club/programs/zero-to-launch/hackathon/results",
    siteName: "Ship AI",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

const WILL_LIST = [
  {
    strong: "Every team that submitted.",
    copy: "Not a top three. Ship and file a submission and you get a row — team, members, project and live URL.",
  },
  {
    strong: "What each team placed.",
    copy: "Category winners at the top in award order, Crowd Favorite alongside them. Everyone else reads as Launched — the bar the weekend was built around.",
  },
  {
    strong: "A certification per team.",
    copy: "Its own public URL, naming the project and the placement, ready to link from LinkedIn or a job application.",
  },
];


const RESULTS_URL = `${SITE}/programs/zero-to-launch/hackathon/results`;
const PLACE_NUMBER = { "First place": "1", "Second place": "2", "Third place": "3" };

function byline(e) {
  const people = (e.members ?? []).join(", ");
  if (e.project && e.project !== e.team) return people ? `${e.team} · ${people}` : e.team;
  return people;
}

function prizeLine(name) {
  const prize = HACKATHON_PRIZES.find((p) => p.name === name);
  if (!prize) return "";
  return [`$${prize.cash} cash`, prize.extra].filter(Boolean).join(" · ");
}

function WinnerCard({ category, entrant, lead }) {
  const number = PLACE_NUMBER[category.name];
  const people = byline(entrant);
  const prize = prizeLine(category.name);
  return (
    <article className={lead ? "rs-win rs-win-lead" : "rs-win"}>
      {number && (
        <span className="rs-win-num" aria-hidden="true">
          {number}
        </span>
      )}
      <p className="rs-win-place">
        {category.voted ? (
          <Users size={15} strokeWidth={1.75} aria-hidden="true" />
        ) : (
          <Trophy size={15} strokeWidth={1.75} aria-hidden="true" />
        )}
        {category.name}
        {category.voted && <span className="hk-cat-tag">Room-voted</span>}
      </p>
      <h3 className="rs-win-name">{entrant.project || entrant.team}</h3>
      {people && <p className="rs-win-people">{people}</p>}
      {entrant.blurb && <p className="rs-win-blurb">{entrant.blurb}</p>}
      {prize && <p className="rs-win-prize">{prize}</p>}
      <div className="rs-win-actions">
        <a className="btn btn-solid" href={certPath(entrant)}>
          View certificate
        </a>
        {entrant.url && (
          <a className="btn btn-ghost" href={entrant.url} target="_blank" rel="noreferrer">
            See the project
            <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}

export function generateStaticParams() {
  return PROGRAMS.filter((program) => program.hasHackathon).map((program) => ({
    program: program.slug,
  }));
}

export default async function Page({ params }) {
  const { program: programSlug } = await params;
  const program = programBySlug(programSlug);
  if (!program?.hasHackathon) notFound();

  const preview = previewEntrants();
  const rows = await publishedCertificates();
  const all = [...rows.map(fromCertificate), ...preview];

  /* Both conditions have to hold for real results: certificates exist,
     and an admin has said they're public. Issuing them is a
     Sunday-evening job that can start before the ceremony finishes,
     so the switch is what makes them visible, not their existence.
     SHIPAI_PREVIEW bypasses it — see previewEntrants(). */
  const published =
    preview.length > 0 || (all.length > 0 && (await getSetting("results_published")));

  const entrants = published ? sortedEntrants(all) : [];
  const won = published ? winners(entrants) : [];
  const rest = won.length ? entrants.filter((e) => !isWinner(e)) : entrants;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: TITLE,
          description: DESCRIPTION,
          url: "https://www.shipai.club/programs/zero-to-launch/hackathon/results",
          isPartOf: { "@type": "WebPage", url: "https://www.shipai.club/programs/zero-to-launch/hackathon" },
        }}
      />

      <header className="nav">
        <Lockup />
        <nav>
          <a href="/programs">Programs</a>
          <a href="/programs/zero-to-launch/hackathon">Hackathon</a>
          <a href="/programs/zero-to-launch/hackathon#benefits">Benefits</a>
          <a href="/programs/zero-to-launch/hackathon#prizes">Prizes</a>
        </nav>
        <div className="nav-ctas">
          <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">
            Discord
          </a>
          <a className="btn btn-solid" href="/dashboard">
            Register
          </a>
        </div>
      <MobileNav /></header>

      {published ? (
        <main>
          <section className="band rs-hero" aria-labelledby="rs-hero-title">
            <Scene scene="launch" band className="band-bg" />
            <div className="rs-hero-inner">
              <p className="kicker">{EDITION.name}</p>
              <h1 id="rs-hero-title" className="reveal">
                Meet the <span className="key">winners.</span>
              </h1>
              <p className="rs-hero-lede reveal" style={{ "--d": "120ms" }}>
                {entrants.length} teams launched at {EDITION.venue} in {EDITION.city}, {EDITION.held}.
                {won.length > 0 && " These are the ones the judges placed first, second and third."}
              </p>
              <div className="reveal" style={{ "--d": "240ms" }}>
                <ShareActions
                  url={RESULTS_URL}
                  text={`The winners of the ${EDITION.name} are in.`}
                />
              </div>
            </div>
          </section>

          <div className="rs-page rs-page-wide">
            {won.length > 0 && (
              <section aria-labelledby="rs-winners-title">
                <h2 id="rs-winners-title" className="rs-section-title">
                  The <span className="key">podium</span>
                </h2>
                <div className="rs-podium-grid">
                  {won
                    .filter((w) => !w.category.voted)
                    .map((w, index) => (
                      <WinnerCard key={w.category.name} {...w} lead={index === 0} />
                    ))}
                  {won
                    .filter((w) => w.category.voted)
                    .map((w) => (
                      <WinnerCard key={w.category.name} {...w} lead={false} />
                    ))}
                </div>
              </section>
            )}

            {rest.length > 0 && (
              <section aria-labelledby="rs-all-title">
                <h2 id="rs-all-title" className="rs-section-title">
                  {won.length ? (
                    <>
                      Everyone else who <span className="key">shipped</span>
                    </>
                  ) : (
                    <>
                      Every team that <span className="key">shipped</span>
                    </>
                  )}
                </h2>
                <p className="rs-lede">
                  Placing is one measure. Every team below put a live project in front of people,
                  and each has a certificate that stays up.
                </p>
                <ul className="rs-grid">
                  {rest.map((e) => (
                    <li key={e.id} className="rs-card">
                      <p className="rs-card-place">{placementOf(e)}</p>
                      <h3>{e.project || e.team}</h3>
                      {byline(e) && <p className="rs-card-people">{byline(e)}</p>}
                      <div className="rs-card-links">
                        {e.url && (
                          <a href={e.url} target="_blank" rel="noreferrer">
                            Project
                            <ArrowUpRight size={13} strokeWidth={1.75} aria-hidden="true" />
                          </a>
                        )}
                        <a href={certPath(e)} aria-label={`View the certificate for ${e.project || e.team}`}>
                          <BadgeCheck size={13} strokeWidth={1.75} aria-hidden="true" />
                          Certificate
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="rs-close" aria-label="Keep going">
              <p className="rs-close-line">
                Just <span className="key">ship</span> it.
              </p>
              <div className="rs-close-ctas">
                <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">
                  Join the Discord
                </a>
                <a className="btn btn-ghost" href="/programs/zero-to-launch/hackathon">
                  Back to the hackathon
                  <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
                </a>
              </div>
            </section>
          </div>
        </main>
      ) : (
        <main className="rs-page">
          <p className="kicker">{EDITION.name}</p>
          <h1>Results</h1>
          <>
            <p className="rs-lede">
              The hackathon runs {EDITION.held} at {EDITION.venue}, {EDITION.city}. Every team
              that ships ends up here, permanently.
            </p>
            <div className="rs-pending">
              <p className="rs-pending-head">
                <CalendarClock size={16} strokeWidth={1.75} aria-hidden="true" />
                Results go up {EDITION.resultsDay}, straight after the awards.
              </p>
              <p>
                Want a row? It takes a live URL and a{" "}
                <a href="/programs/zero-to-launch/hackathon/submit">submission</a> by {EVENT.deadline}.
              </p>
            </div>
            <h2 className="rs-subhead">What lands here</h2>
            <ul className="rs-will">
              {WILL_LIST.map((w) => (
                <li key={w.strong}>
                  <BadgeCheck size={17} strokeWidth={1.75} aria-hidden="true" />
                  <span>
                    <strong>{w.strong}</strong> {w.copy}
                  </span>
                </li>
              ))}
            </ul>
            <h2 className="rs-subhead">Awards</h2>
            <div className="hk-cats">
              {CATEGORIES.map((c) => (
                <div key={c.name} className={c.wide ? "hk-cat hk-cat-wide" : "hk-cat"}>
                  {c.voted ? (
                    <Users className="icon" size={18} strokeWidth={1.75} aria-hidden="true" />
                  ) : (
                    <Trophy className="icon" size={18} strokeWidth={1.75} aria-hidden="true" />
                  )}
                  <h3>
                    {c.name}
                    {c.voted && <span className="hk-cat-tag">Room-voted</span>}
                  </h3>
                  <p>{c.copy}</p>
                </div>
              ))}
            </div>
            <div className="cta-row rs-cta">
              <a className="btn btn-solid" href={MEETUP} target="_blank" rel="noreferrer">
                RSVP on Meetup
              </a>
              <a className="btn btn-ghost" href="/programs/zero-to-launch/hackathon/submit">
                Submission requirements
              </a>
              <a className="btn btn-ghost" href="/programs/zero-to-launch/hackathon">
                Back to the hackathon
              </a>
            </div>
          </>
        </main>
      )}

      <footer className="footer">
        <Lockup compact />
        <nav>
          <a href="/">Home</a>
          <a href="/programs/zero-to-launch/hackathon">Hackathon</a>
          <a href="/programs">Programs</a>
          <a href="/programs/zero-to-launch">Sessions</a>
        </nav>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}
