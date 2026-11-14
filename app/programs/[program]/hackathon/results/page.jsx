import { notFound } from "next/navigation";
import { BadgeCheck, CalendarClock, Trophy, Users } from "lucide-react";
import Scene from "../../../../../components/scene";
import SiteFooter from "../../../../../components/site-footer";
import SiteHeader from "../../../../../components/site-header";
import { EventBoard, EventHero, EventSection } from "../../../../../components/event-page";
import ShareActions from "./share-actions";
import { JsonLd } from "../../../../../components/article";
import { FOUNDER_WEEKEND as FW } from "../../../../../lib/founder-weekend";
import { DISCORD, EVENT, HACKATHON_PRIZES, MEETUP } from "../../../../../lib/hackathon";
import { publicTeamPath, publicTeams } from "../../../../../lib/public-teams";
import { SHIPPED, eventState } from "../../../../../lib/shipped";
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
import "./results.css";

/* The published page is the results board: the podium on one board, as
   on the hackathon page, then everyone else as ruled rows. A project's
   name opens its team page, where the pitch, the site and the
   certificate already sit; site and certificate stay as small links.

   Results are published by flipping a switch in /admin on the Sunday,
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
const HACKATHON = "/programs/zero-to-launch/hackathon";
const same = (a, b) => Boolean(a && b) && a.trim().toLowerCase() === b.trim().toLowerCase();

/* Team and people, said once where a team and its one member share a name. */
function byline(e) {
  const people = (e.members ?? []).filter(Boolean);
  const solo = people.length === 1 && same(people[0], e.team);
  const names = solo ? "" : people.join(", ");
  if (e.project && !same(e.project, e.team)) return names ? `${e.team} · ${names}` : e.team;
  return names;
}

function prizeLine(name) {
  const prize = HACKATHON_PRIZES.find((p) => p.name === name);
  if (!prize) return "";
  const extra = prize.extra ? prize.extra.split(" · ")[0] : "";
  return [`$${prize.cash} cash`, extra && extra[0].toLowerCase() + extra.slice(1)].filter(Boolean).join(" · ");
}

/* The one-line description the hackathon page and the homepage use. */
function shortLine(e) {
  const known = SHIPPED.podium.find((entry) => same(entry.project, e.project) || same(entry.project, e.team));
  return known?.line || e.blurb;
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

  /* Where a project's name leads: its team page, else its own site,
     else its certificate. */
  const teams = published ? await publicTeams() : [];
  const home = (e) => {
    const team = teams.find((t) => same(t.name, e.team) || same(t.registered_name, e.team) || same(t.project, e.project));
    if (team) return { href: publicTeamPath(team), team: true };
    if (e.url) return { href: e.url, external: true };
    return { href: certPath(e) };
  };
  const podium = [...won.filter((w) => !w.category.voted), ...won.filter((w) => w.category.voted)];
  const fwAhead = eventState(FW.startISO, FW.endISO) !== "after";

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

      <SiteHeader current="/programs" />

      {published ? (
        <main id="top">
          <EventHero
            crumb={{ href: HACKATHON, label: EDITION.event }}
            title="Meet the"
            keyPhrase="winners."
            lede={`${entrants.length} teams launched at ${EDITION.venue} in ${EDITION.city}, ${EDITION.held}.${won.length > 0 ? " These are the ones the judges placed first, second and third." : ""}`}
          />

          <EventBoard
            scene="launch"
            alt="Dithered night scene: a finished boat sliding down the ways into the water."
            label="Results"
            bar={[`Results · held ${EVENT.datesShort}`, `${entrants.length} teams launched`]}
            foot={<><span>{EDITION.venue}, Phoenix</span><ShareActions quiet url={RESULTS_URL} text={`The winners of the ${EDITION.name} are in.`} /></>}
          >
            {podium.length > 0 && (
              <ol className="ev-podium">
                {podium.map(({ category, entrant }) => {
                  const to = home(entrant);
                  return (
                    <li key={category.name}>
                      <a href={to.href} target={to.external ? "_blank" : undefined} rel={to.external ? "noreferrer" : undefined}>
                        <span className="ev-label">{[category.name, prizeLine(category.name)].filter(Boolean).join(" · ")}</span>
                        <b>{entrant.project || entrant.team}</b>
                        <span className="ev-line">{shortLine(entrant)}</span>
                        <span className="ev-go">{to.team ? "Open the team page" : to.external ? "See the project" : "View certificate"} <i aria-hidden="true">→</i></span>
                      </a>
                    </li>
                  );
                })}
              </ol>
            )}
          </EventBoard>

          {rest.length > 0 && (
            <EventSection
              id="all"
              title={won.length ? "Everyone else who" : "Every team that"}
              keyPhrase="shipped"
              lede="Placing is one measure. Every team below put a live project in front of people, and each has a certificate that stays up."
            >
              <ul className="rsl-rows">
                {rest.map((e) => {
                  const to = home(e);
                  return (
                    <li key={e.id}>
                      <div>
                        <a className="rsl-name" href={to.href} target={to.external ? "_blank" : undefined} rel={to.external ? "noreferrer" : undefined}>{e.project || e.team}</a>
                        {byline(e) && <span className="rsl-people">{byline(e)}</span>}
                      </div>
                      <span className="rsl-links">
                        {e.url && <a href={e.url} target="_blank" rel="noreferrer" aria-label={`Open the site for ${e.project || e.team}`}>Site</a>}
                        <a href={certPath(e)} aria-label={`View the certificate for ${e.project || e.team}`}>Certificate</a>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </EventSection>
          )}

          <div className="ev-end" />

          <section className="band" aria-labelledby="rs-final-title">
            <Scene scene="stars" mode="ascii" band className="band-bg" />
            <div className="final">
              <h2 id="rs-final-title">Just <span className="key">ship</span> it.</h2>
              <div className="cta-row">
                <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a>
                {fwAhead && <a className="btn btn-ghost" href={FW.path}>{FW.name}, {FW.datesShort.replace(/, \d{4}$/, "")}</a>}
              </div>
            </div>
            <div className="final-stage">
              <Scene scene="harbor" band alt="Dithered harbor at dusk: many small boats at their moorings with their lights on. Every team is in." />
              <p>Harbor at dusk · Phoenix, Arizona</p>
            </div>
          </section>
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

      <SiteFooter />
    </>
  );
}
