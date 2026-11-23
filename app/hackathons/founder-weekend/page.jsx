import { JsonLd, faqSchema } from "../../../components/article";
import Scene from "../../../components/scene";
import SiteFooter from "../../../components/site-footer";
import SiteHeader from "../../../components/site-header";
import {
  BoardDeparture,
  EventBoard,
  EventDays,
  EventHero,
  EventSection,
  PeopleRow,
  ProofLedger,
  RuledGrid,
  RuledRows,
} from "../../../components/event-page";
import {
  FOUNDER_WEEKEND as FW,
  FW_BENEFITS,
  FW_CRITERIA,
  FW_FAQS,
  FW_HOSTS,
  FW_MENTORS,
  FW_SPONSOR_TIERS,
  FW_WEEKEND,
} from "../../../lib/founder-weekend";
import { founderWeekendStats, founderWeekendTeams } from "../../../lib/founder-weekend-stats";
import { DISCORD } from "../../../lib/hackathon";
import { TalkGroups, SERIES_LEGS, LUNCH_GROUPS } from "../../../components/talk-cards";
import { TALKS, SERIES_NAME, LUNCH_NAME, talkEnded, talkScheduled } from "../../../lib/talks";
import { SHIPPED, SHIPPED_RESULTS, daysUntil, eventState } from "../../../lib/shipped";
import "../../home.css";

const REGISTER = `${FW.path}/register`;
const RSVP = FW.rsvpUrl || REGISTER;
const RSVP_LINK = FW.rsvpUrl ? { href: RSVP, target: "_blank", rel: "noopener noreferrer" } : { href: RSVP };
const RSVP_LABEL = FW.rsvpUrl ? "RSVP on Luma" : "Register your team";
const ROLE_REQUEST = "/login?next=/dashboard/requests";
const nextOf = (pick) => TALKS.filter((t) => pick(t) && talkScheduled(t) && !talkEnded(t)).sort((a, b) => a.startISO.localeCompare(b.startISO))[0]?.slug;
const PRIZE = FW.prizePool ? `$${FW.prizePool.toLocaleString("en-US")} in prizes` : "cash prizes";

const MISSING = [
  ["A deadline", "Submissions close Sunday at noon"],
  ["A team", "Up to four, or find one at kickoff"],
  ["A room", "Judges, employers and investors watching"],
];

const ROLES = [
  {
    label: "Mentor · both days",
    title: "Mentor a team",
    copy: "Spend a few hours on the floor with teams. Founders, engineers, designers, marketers and operators all have something a team needs by Saturday afternoon.",
    cta: "Apply to mentor",
  },
  {
    label: "Volunteer · both days",
    title: "Help run the weekend",
    copy: "Run check-in, shoot photos and video, or keep the pitch schedule on time. You get a front-row seat to every pitch.",
    cta: "Apply to volunteer",
  },
];

const EVENT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `${FW.name}: Arizona AI Hackathon`,
  description: FW.description,
  startDate: FW.startISO,
  endDate: FW.endISO,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: FW.venue,
    address: { "@type": "PostalAddress", streetAddress: FW.street, addressLocality: "Phoenix", addressRegion: "AZ", postalCode: "85016", addressCountry: "US" },
  },
  organizer: [
    { "@type": "Organization", name: "Ship AI", url: "https://www.shipai.club" },
    { "@type": "Organization", name: FW.partner.name, url: FW.partner.url },
  ],
  performer: FW_HOSTS.map((host) => ({ "@type": "Person", name: host.name })),
  url: FW.url,
  image: [`https://www.shipai.club${FW.ogImage}`],
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: FW.rsvpUrl || `https://www.shipai.club${REGISTER}`,
    validFrom: "2026-10-28T00:00:00-07:00",
  },
};

export const metadata = {
  title: FW.seoTitle,
  description: FW.metaDescription,
  keywords: [
    "AI hackathon Arizona",
    "AZ AI hackathon",
    "Phoenix hackathon",
    "AI hackathon Phoenix",
    "startup weekend Phoenix",
    "Arizona startup hackathon",
    "build an AI company",
    "Arizona AI Hackathon",
    "Workuity AI Exchange",
    "free hackathon Phoenix 2027",
  ],
  alternates: { canonical: FW.url },
  openGraph: {
    title: `Arizona AI Hackathon | ${FW.name}`,
    description: `${FW.tagline} A free AI hackathon at ${FW.venue} in Phoenix, ${FW.datesShort}. Teams of 1–4.`,
    url: FW.url,
    siteName: "Ship AI",
    type: "website",
    images: [{ url: FW.ogImage, width: 1200, height: 630, alt: `Arizona AI Hackathon: ${FW.name}, ${FW.datesShort} at ${FW.venue}, Phoenix` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Arizona AI Hackathon | ${FW.name}`,
    description: `${FW.tagline} A free AI hackathon at ${FW.venue} in Phoenix, ${FW.datesShort}.`,
    images: [FW.ogImage],
  },
};

export const revalidate = 30;

export default async function Page() {
  const [stats, teams] = await Promise.all([founderWeekendStats(), founderWeekendTeams()]);
  const state = eventState(FW.startISO, FW.endISO);
  const before = state === "before";
  const over = state === "after";
  const hasTeams = stats.teams > 0;
  const counts = [
    ["Teams registered", stats.teams],
    ["Participants", stats.participants],
    ["Projects submitted", stats.projects],
  ];
  const rsvp = <a className="btn btn-solid" {...RSVP_LINK}>{RSVP_LABEL}</a>;
  const discord = <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a>;

  return (
    <>
      <JsonLd data={EVENT_SCHEMA} />
      <JsonLd data={faqSchema(FW_FAQS)} />
      <SiteHeader />

      <main id="top">
        <EventHero
          name={`${FW.name} · Arizona AI hackathon`}
          title="Build an AI company."
          keyPhrase="Ship it by Sunday."
          lede="One weekend in Phoenix to build an AI company, then pitch it to judges, employers and investors. Free for teams of 1–4."
        />

        {/* One board, and it reads the date: the RSVP before the weekend,
            the deadline during it, the tally once it is over. */}
        <EventBoard
          scene={over ? "harbor" : "launch"}
          alt={over ? "Dithered harbor at dusk: many small boats at their moorings with their lights on." : "Dithered night scene: a finished boat sliding down the ways into the water. You leave with something shipped."}
          label={over ? "Event tally" : "Date and RSVP"}
          bar={over
            ? [`${FW.name} · held ${FW.datesShort}`, `${FW.venue}, Phoenix`]
            : [`${FW.name} · ${before ? (FW.rsvpUrl ? "RSVPs open" : "Registration open") : "Happening now"}`, `Presented by Ship AI × ${FW.partner.name}`]}
          foot={over ? null : <><span>Submissions close Sunday, 12:00 PM</span><span>9 AM both days</span></>}
        >
          {over ? (
            <div className="dboard-row dboard-row-quiet">
              <dl className="ev-counts" style={{ justifyContent: "flex-start" }}>
                {counts.map(([label, value]) => <div key={label}><dt className="ev-label">{label}</dt><dd>{value.toLocaleString("en-US")}</dd></div>)}
              </dl>
              <div className="dboard-act">{discord}</div>
            </div>
          ) : (
            <BoardDeparture
              date="Feb 6–7"
              dateNote="Sat and Sun, 2027"
              place={`${FW.venue}, Phoenix`}
              placeNote={[FW.cost, FW.teams.toLowerCase(), PRIZE].join(" · ")}
              days={before ? daysUntil(FW.startISO) : 0}
              action={before ? rsvp : <a className="btn btn-solid" href={REGISTER}>Register your team</a>}
            />
          )}
        </EventBoard>

        <EventSection
          id="why"
          title="You've had the idea"
          keyPhrase="for months."
          lede="AI made building it cheap. What's missing is a deadline, a team and a room that expects you to ship. Founder Weekend gives you all three, and puts the people who hire and invest in the front row."
        >
          {FW.whyVideo
            ? <video className="ev-video" src={FW.whyVideo} poster={FW.whyPoster || undefined} controls playsInline preload="metadata" />
            : <RuledGrid items={MISSING} />}
        </EventSection>

        <EventSection id="benefits" title="More than a demo." keyPhrase="A company.">
          <RuledGrid items={FW_BENEFITS.map((benefit) => [benefit.name, benefit.copy])} />
        </EventSection>

        <EventSection
          id="judging"
          title="Six criteria."
          keyPhrase="Scored 1 to 10."
          lede="Judges score what your company is by Sunday, not what it could be. Pitches run five minutes, and going over costs points."
        >
          <RuledRows items={FW_CRITERIA.map((criterion) => [criterion.name, criterion.parts.join(" · ")])} />
        </EventSection>

        <EventSection id="weekend" title="Two days." keyPhrase="One company.">
          <EventDays days={FW_WEEKEND.map((day, index) => ({
            label: `Day ${index + 1} · ${day.hours}`,
            title: day.day,
            rows: day.beats.map((beat) => [beat.time, beat.what]),
          }))} />
          <p className="ev-note">Arizona time. Submissions close at {FW.deadline}.</p>
        </EventSection>

        <section className="section ev-section fw-series" id="series" aria-labelledby="series-title">
          <div className="section-head">
            <h2 id="series-title">Five nights <span className="key">in the room.</span></h2>
            <p className="section-lede">{SERIES_NAME}: the critical path from an idea to a pitch with real users behind it. Tuesdays, 5 to 7 PM at {FW.venue}, one founder app built on screen. Each night ends with the file the next one starts from.</p>
          </div>
          <TalkGroups groups={SERIES_LEGS} talks={TALKS.filter((t) => t.series)} nextSlug={nextOf((t) => t.series)} label={(g) => g.parts.length > 1 ? `Parts ${g.parts[0]}-${g.parts[g.parts.length - 1]}` : `Part ${g.parts[0]}`} />
        </section>

        <section className="section ev-section fw-series" id="lunch" aria-labelledby="lunch-title">
          <div className="section-head">
            <h2 id="lunch-title">Everything else, <span className="key">over lunch.</span></h2>
            <p className="section-lede">{LUNCH_NAME}s: Thursdays at noon. One hour each on what comes around the critical path, from forming the company to running it. Every deck and prompt is on its talk page, so skip what you don&apos;t need yet.</p>
          </div>
          <TalkGroups groups={LUNCH_GROUPS} talks={TALKS.filter((t) => t.lunch)} nextSlug={nextOf((t) => t.lunch)} label={(g, items) => items.length === 1 ? "1 session" : `${items.length} sessions`} />
        </section>

        {/* The roster once there are teams. Until then, proof from the
            last hackathon stands where three zeros used to. */}
        {hasTeams ? (
          <EventSection id="teams" title="The roster" keyPhrase="so far.">
            <dl className="ev-counts">
              {counts.map(([label, value]) => <div key={label}><dt className="ev-label">{label}</dt><dd>{value.toLocaleString("en-US")}</dd></div>)}
            </dl>
            <ul className="ev-teams">
              {teams.map((team) => <li key={team.slug}>{team.name}<span>{team.member_count} {team.member_count === 1 ? "member" : "members"}</span></li>)}
            </ul>
            {!over && <p className="ev-act"><a className="btn btn-ghost" href={REGISTER}>Register your team</a></p>}
          </EventSection>
        ) : (
          <section className="section ev-section" id="teams" aria-label="Proof from the last hackathon">
            <ProofLedger shipped={SHIPPED} results={SHIPPED_RESULTS}>
              {!over && <p><a className="btn btn-ghost" href={REGISTER}>Register your team</a></p>}
            </ProofLedger>
          </section>
        )}

        <EventSection id="hosts" title="Hosted by builders." keyPhrase="Judged by them too.">
          <PeopleRow people={[...FW_HOSTS, ...FW_MENTORS]} />
          {!over && (
            <div className="ev-two" id="help">
              {ROLES.map((role) => (
                <div key={role.title}>
                  <span className="ev-label">{role.label}</span>
                  <h3>{role.title}</h3>
                  <p>{role.copy}</p>
                  <a className="link" href={ROLE_REQUEST}>{role.cta}</a>
                </div>
              ))}
            </div>
          )}
        </EventSection>

        {!over && (
          <EventSection
            id="sponsor"
            title="Back the builders."
            keyPhrase="Two ways in."
            lede="Prices are published so you can decide before you message us. We never sell lead lists or attendee data."
          >
            <div className="ev-two">
              {FW_SPONSOR_TIERS.map((tier) => (
                <div key={tier.name}>
                  <span className="ev-label">{tier.name} · {tier.slots}</span>
                  <span className="ev-price">${tier.price.toLocaleString("en-US")}</span>
                  <h3>{tier.headline}</h3>
                  <ul>{tier.perks.map((perk) => <li key={perk}>{perk}</li>)}</ul>
                  <a className="btn btn-ghost btn-sm" href={`${FW.path}/sponsor?package=${tier.id}`}>Choose {tier.name.toLowerCase()}</a>
                </div>
              ))}
            </div>
          </EventSection>
        )}

        <EventSection id="faq" title="Questions," keyPhrase="answered.">
          <div className="faq ev-faq">
            {FW_FAQS.map((faq) => (
              <details key={faq.q}>
                <summary><span>{faq.q}</span></summary>
                <p className="faq-a">{faq.a}</p>
              </details>
            ))}
          </div>
        </EventSection>

        <div className="ev-end" />

        <section className="band" aria-labelledby="fw-final-title">
          <Scene scene="stars" mode="ascii" band className="band-bg" />
          <div className="final">
            <h2 id="fw-final-title">Feel the fear. <span className="key">Ship it anyway.</span></h2>
            {over ? (
              <>
                <p className="lede">The weekend is over. Join Discord to hear about the next one.</p>
                <div className="cta-row">{discord}</div>
              </>
            ) : (
              <>
                <p className="lede">{FW.rsvpUrl ? "RSVP, then register a team" : "Register a team now"}, or come solo and find one at Saturday&apos;s kickoff.</p>
                <div className="cta-row">{rsvp}</div>
                <ul className="final-checks">
                  <li>Free to enter</li>
                  <li>{FW.teams}</li>
                  <li>Phoenix, {FW.datesShort}</li>
                </ul>
              </>
            )}
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
