import { notFound } from "next/navigation";
import { JsonLd } from "../../../../components/article";
import HackathonJudges from "../../../../components/hackathon-judges";
import HackathonRoster from "../../../../components/hackathon-roster";
import HackathonSponsors from "../../../../components/hackathon-sponsors";
import Scene from "../../../../components/scene";
import SiteFooter from "../../../../components/site-footer";
import SiteHeader from "../../../../components/site-header";
import { BoardPodium, EventBoard, EventDays, EventHero, EventSection } from "../../../../components/event-page";
import { PROGRAMS, programBySlug } from "../../../../lib/programs";
import { EVENT, DISCORD, HACKATHON_PRIZES } from "../../../../lib/hackathon";
import { BREAKOUTS, OPENING_DECK } from "../../../../lib/hackathon-opening";
import { publicTeams, publicTeamPath } from "../../../../lib/public-teams";
import { SHIPPED, SHIPPED_RESULTS } from "../../../../lib/shipped";
import { FOUNDER_WEEKEND as FW } from "../../../../lib/founder-weekend";
import "../../../../app/hackathon-opening.css";
import "../../program.css";
import { ogImage } from "../../../../lib/og";

const PATH = "/programs/zero-to-launch/hackathon";

/* How the weekend ran: the two days as they happened, and the decks. */
const RAN = [
  {
    label: "Day 1 · 9 AM–5 PM",
    title: "Saturday, Oct 17",
    rows: [["9:00 AM", "Welcome ceremony"], ...BREAKOUTS.map((item) => [item.time.split("–")[0] + " " + item.time.slice(-2), item.title])],
  },
  {
    label: "Day 2 · 9 AM–2 PM",
    title: "Sunday, Oct 18",
    rows: [["9:00 AM", "Start"], ["1:00 PM", "Submissions closed"], ["1:30 PM", "Awards"]],
  },
];

const DECKS = [
  { href: OPENING_DECK, label: "Opening ceremony" },
  ...BREAKOUTS.map((item) => ({ href: item.href, label: item.title })),
  { href: `${PATH}/bots`, label: "All bot templates" },
];

const EVENT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: EVENT.name,
  description: EVENT.description,
  startDate: EVENT.startISO,
  endDate: EVENT.endISO,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: { "@type": "Place", name: EVENT.venue, address: EVENT.address },
  organizer: { "@type": "Organization", name: "Ship AI", url: "https://www.shipai.club" },
  url: "https://www.shipai.club/programs/zero-to-launch/hackathon",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: EVENT.meetup,
  },
};

export const metadata = {
  title: EVENT.name,
  description: EVENT.description,
  alternates: { canonical: "https://www.shipai.club/programs/zero-to-launch/hackathon" },
  openGraph: {
    title: 'Zero to Launch Hackathon — Build Your AI Organization | Ship AI',
    description: 'Build your AI organization and launch a useful site in Phoenix. Four guided breakouts connect positioning, product design, engineering and marketing.',
    url: "https://www.shipai.club/programs/zero-to-launch/hackathon",
    siteName: "Ship AI",
    images: [ogImage({ kicker: "Zero to Launch hackathon", title: "Build your AI organization", key: "AI organization", tagline: "Four guided breakouts across positioning, product, engineering and marketing.", meta: EVENT.datesShort })],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zero to Launch Hackathon — Build Your AI Organization | Ship AI',
    description: 'Build your AI organization and launch a useful site in Phoenix. Four guided breakouts connect positioning, product design, engineering and marketing.',
    images: [ogImage({ kicker: "Zero to Launch hackathon", title: "Build your AI organization", key: "AI organization", tagline: "Four guided breakouts across positioning, product, engineering and marketing.", meta: EVENT.datesShort }).url],
  },
};

// Keep the public judge and sponsor lists current as accounts are updated.
export const revalidate = 30;

export function generateStaticParams() {
  return PROGRAMS.filter((program) => program.hasHackathon).map((program) => ({
    program: program.slug,
  }));
}

export default async function Page({ params }) {
  const { program: programSlug } = await params;
  const program = programBySlug(programSlug);
  if (!program?.hasHackathon) notFound();

  /* The weekend is over, so this page is the record: the podium on the
     board, then every project that shipped. Teams that registered but
     did not submit stay on their own team pages. */
  const teams = (await publicTeams()).filter((team) => team.submitted);
  const placed = new Map(SHIPPED.podium.map((entry) => [entry.team, entry.place]));
  const shippedCount = teams.length || SHIPPED.teams;

  return (
    <>
      <JsonLd data={EVENT_SCHEMA} />
      <SiteHeader current="/programs" />

      <main id="top">
        <EventHero
          crumb={{ href: `/programs/${program.slug}`, label: program.name }}
          title="Ship AI AZ"
          keyPhrase="GTM Hackathon"
          lede="Teams built and shipped the best marketing sites they could in one weekend. Thank you to everyone who shipped."
        />

        <EventBoard
          scene="harbor"
          alt="Dithered harbor at dusk: many small boats at their moorings with their lights on. Every team is in."
          label="Results"
          bar={[`Results · held ${EVENT.datesShort}`, `${SHIPPED.registered} teams · ${SHIPPED.teams} shipped · ${SHIPPED.builders} builders`]}
          foot={<><span>{EVENT.venue}, Phoenix</span><a href={SHIPPED_RESULTS}>All {SHIPPED.teams} projects and results</a></>}
        >
          <BoardPodium podium={SHIPPED.podium} prizes={HACKATHON_PRIZES.map((prize) => `$${prize.cash}`)} />
        </EventBoard>

        <EventSection id="teams" title={`The ${shippedCount} that shipped`}>
          {teams.length > 0 ? (
            <ul className="ev-teams" style={{ marginTop: 0 }}>
              {teams.map((team) => (
                <li key={team.slug}>
                  <a href={`${publicTeamPath(team)}${team.pitch_video_url || team.pitch_video_poster_url ? "#team-pitch" : ""}`}>
                    {team.project || team.name}
                    <span>{placed.get(team.slug) || (team.pitch_video_url ? "Pitch →" : "Project →")}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="ev-note"><a href={SHIPPED_RESULTS}>See every project on the results page</a></p>
          )}
        </EventSection>

        <EventSection id="schedule" title="How the weekend ran">
          <EventDays days={RAN} />
          <p className="ev-links">
            {DECKS.map((deck) => <a key={deck.href} href={deck.href}>{deck.label} →</a>)}
          </p>
        </EventSection>

        <div className="ev-legacy">
          <HackathonJudges />
          <HackathonRoster />
          <HackathonSponsors compact />
        </div>

        <div className="ev-end" />

        <section className="band" aria-labelledby="hk-final-title">
          <Scene scene="stars" mode="ascii" band className="band-bg" />
          <div className="final">
            <h2 id="hk-final-title">Every team left <span className="key">with a live site.</span></h2>
            <p className="lede">The hackathon is over. See who shipped what, and join Discord to hear about the next one.</p>
            <div className="cta-row">
              <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a>
              <a className="btn btn-ghost" href={FW.path}>{FW.name}, {FW.datesShort.replace(", 2027", "")}</a>
            </div>
            <p className="pg-final-link">
              <a href={`${PATH}/submit`}>Submission details</a>
              {" · "}<a href={`${PATH}/pitch`}>Five-minute pitch reference</a>
              {" · "}<a href={`${PATH}/sponsor`}>Sponsor the event</a>
            </p>
          </div>
          <div className="final-stage">
            <Scene scene="harbor" band alt="Dithered harbor at dusk: many small boats at their moorings with their lights on. The community." />
            <p>Harbor at dusk · Phoenix, Arizona</p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
