import SiteHeader from "../components/site-header";
import { siDiscord } from "simple-icons";
import SiteFooter from "../components/site-footer";
import Scene from "../components/scene";
import { getUpcomingEvents } from "../lib/meetup";
import { JsonLd } from "../components/article";
import { PROGRAMS } from "../lib/programs";
import { FOUNDER_WEEKEND as FW } from "../lib/founder-weekend";
import { VIBE_GTM, workshopPrice } from "../lib/vibe-gtm-workshop";
import { UPCOMING_WORKSHOPS } from "../lib/workshops";
import { WORKSHOP_PRESENTATION } from "../lib/workshop-presentation";
import WorkshopCard from "../components/workshop-card";
import WorkshopNotify from "../components/workshop-notify";
import { EVENT as HACKATHON } from "../lib/hackathon";
import "./workshops/catalogue.css";
import "../components/departure-board.css";
import "./home.css";
import { DEFAULT_OG } from "../lib/og";

export const metadata = {
  title: "Ship AI — Hands-on AI Workshops in Phoenix",
  description:
    "Hands-on AI workshops and programs in Phoenix. Build real projects with expert guidance, thoughtful design, and a community of builders.",
  alternates: { canonical: "https://www.shipai.club" },
  openGraph: {
    title: "Practical AI, Built Together — Ship AI Phoenix",
    description:
      "Hands-on workshops, expert guidance, and real projects. In person, in Phoenix.",
    url: "https://www.shipai.club",
    siteName: "Ship AI",
    images: [DEFAULT_OG],
  },
};

const DISCORD = "https://discord.gg/kZSJMNveYM";
const MEETUP = "https://www.meetup.com/shipai/";
const LUMA = "https://luma.com/shipai";
const GITHUB = "https://github.com/Ship-AI-Club";

const RESULTS = "/programs/zero-to-launch/hackathon/results";

/* The October 2026 hackathon is finished, so its outcome is a fixed
   record: 17 teams launched and the judges placed these three. The
   full list lives on the results page. */
const SHIPPED = {
  teams: 17,
  podium: [
    { place: "First place", project: "Dropdone", line: "A desktop app that learns how you clean a messy export, then repeats it every week." },
    { place: "Second place", project: "Agent Task Lock", line: "A Mac app that shows what your AI agents are doing, step by step." },
    { place: "Third place", project: "Orbis", line: "Turns old photos into a 3D world you can walk through and share." },
  ],
};

const CARD_SCENES = ["workbench", "fleet", "voyage"];

const SPONSORS = [
  { href: "https://www.workuity.com/", name: "Workuity", img: "/sponsor-workuity.png" },
  { href: "https://www.ceigateway.com/", name: "CEI Gateway", img: "/sponsor-cei.png" },
  { href: "https://venturecafephoenix.org/", name: "Venture Café Phoenix", img: "/sponsor-venturecafe.png", wide: true },
  { href: "https://www.desic.xyz/", name: "desic", img: "/sponsor-desic.svg", wordmark: true },
  { href: "https://automationinterns.com/", name: "AutomationInterns.com", img: "/sponsor-automationinterns.png", wordmark: true },
];

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ship AI",
  url: "https://www.shipai.club",
  logo: "https://www.shipai.club/icon-512.png",
  description:
    "Hands-on AI education in Phoenix, Arizona. Paid workshops, practical programs, and a community where builders learn together and ship real work.",
  sameAs: [DISCORD, MEETUP, LUMA, GITHUB],
  areaServed: ["Phoenix, AZ"],
};

function eventsSchema(events) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: e.title,
        startDate: new Date(e.ts).toISOString(),
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: { "@type": "Place", name: e.place, address: e.place },
        organizer: { "@type": "Organization", name: "Ship AI", url: "https://www.shipai.club" },
        url: e.url,
      },
    })),
  };
}

export default async function Page() {
  const events = await getUpcomingEvents(1);
  const nextEvent = events[0];
  const price = workshopPrice();
  const now = Date.now();
  const vibeEnded = now >= new Date(VIBE_GTM.end).getTime();
  const fwOpen = now < new Date(FW.endISO).getTime();
  const fwDays = Math.max(0, Math.ceil((new Date(FW.startISO).getTime() - now) / 864e5));
  const fwRegister = `${FW.path}/register`;
  const sessionCount = PROGRAMS.reduce((sum, program) => sum + program.sessions.length, 0);
  const seats = UPCOMING_WORKSHOPS.map((workshop) => workshop.capacity).filter(Boolean);
  const lowestPrice = Math.min(...UPCOMING_WORKSHOPS.map((workshop) => workshop.price).filter(Boolean));
  const primary = fwOpen
    ? { href: fwRegister, label: `Register for ${FW.name}` }
    : { href: MEETUP, label: "RSVP on Meetup", external: true };

  return (
    <>
      <JsonLd data={ORG_SCHEMA} />
      {events.length > 0 && <JsonLd data={eventsSchema(events)} />}
      <SiteHeader current="/" cta={<a className="btn btn-solid btn-sm nav-cta" href={DISCORD} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden="true" focusable="false"><path d={siDiscord.path} /></svg>Join the Discord</a>} />

      <main id="top">
        <section className="hero home-hero" aria-labelledby="hero-title">
          <h1 className="hero-h1" id="hero-title">
            <span className="sr-only">Ship AI: </span>
            Practical AI, <span className="key">Built Together</span>
          </h1>
          <p className="hero-lede">
            Hands-on workshops in Phoenix for turning AI tools into real business results.
            Build your project with expert guidance, sharpen your taste, and leave with work you can use.
          </p>
          <div className="cta-row home-pair">
            <a className="btn btn-solid" href={primary.href} target={primary.external ? "_blank" : undefined} rel={primary.external ? "noreferrer" : undefined}>{primary.label}</a>
            <a className="btn btn-ghost" href="/workshops">Explore workshops</a>
          </div>
          <p className="home-facts">Free events&nbsp;· Free programs&nbsp;· Paid workshops from ${lowestPrice.toLocaleString("en-US")}&nbsp;· In person, in Phoenix</p>

          <div className="stage dboard-stage">
            <Scene scene="slipway" alt="Dithered night scene: a hull on the slipway with scaffolding around it and two builders at work. We build together." />
          </div>
          <aside id="events" className="window dboard" aria-label="Next event">
            <div className="window-bar"><b>Next event</b><span>{fwOpen ? "Registration open" : "On Meetup"}</span></div>
            {fwOpen ? (
              <div className="dboard-row">
                <p className="dboard-date"><b>{FW.datesShort.replace(/, \d{4}$/, "")}</b><span>{new Date(FW.startISO).getFullYear()}&nbsp;· {FW.venue}</span></p>
                <div className="dboard-main">
                  <h2>{FW.name}: build an AI company by Sunday</h2>
                  <p className="meta">{[FW.cost, FW.teams, "No application"].join("\u00a0· ")}</p>
                </div>
                <p className="dboard-count"><b>{fwDays}</b><span>{fwDays === 1 ? "day to kickoff" : "days to kickoff"}</span></p>
                <div className="dboard-act">
                  <a className="btn btn-solid" href={fwRegister}>Register free</a>
                  <a className="link" href={FW.path}>See the weekend</a>
                </div>
              </div>
            ) : (
              <div className="dboard-row dboard-row-quiet">
                <div className="dboard-main">
                  <h2>{nextEvent ? nextEvent.title : "New sessions post every few weeks"}</h2>
                  <p className="meta">{nextEvent ? nextEvent.place : "Free and open to all, in Phoenix"}</p>
                </div>
                <div className="dboard-act">
                  <a className="btn btn-solid" href={nextEvent ? nextEvent.url : MEETUP} target="_blank" rel="noreferrer">RSVP on Meetup</a>
                </div>
              </div>
            )}
            <p className="dboard-foot">
              {fwOpen && nextEvent ? (
                <span>Also coming up: <a href={nextEvent.url} target="_blank" rel="noreferrer">{nextEvent.title}</a></span>
              ) : (
                <span>New sessions post every few weeks</span>
              )}
              <a href={MEETUP} target="_blank" rel="noreferrer">Full calendar</a>
            </p>
          </aside>
        </section>

        <section id="ways" className="section home-first" aria-labelledby="ways-title">
          <div className="section-head">
            <h2 id="ways-title">Three ways <span className="key">into the room.</span></h2>
            <p className="section-lede">Start free. Go deeper when you have a project that needs it.</p>
          </div>
          <ul className="home-ways">
            <li className="home-way">
              <span className="tag home-tag-free">Free</span>
              <h3><a href={fwOpen ? fwRegister : MEETUP}>Events</a></h3>
              <p>Hackathons and meetups. Show up, build with a team, and demo what you made.</p>
              <p className="home-way-now"><b>{fwOpen ? FW.name : "Meetups every few weeks"}</b><span>{fwOpen ? `${FW.datesShort}\u00a0· ${FW.venue}` : "Free and open to all"}</span></p>
              <span className="home-way-go">{fwOpen ? "Register free" : "RSVP on Meetup"}<span className="home-arrow" aria-hidden="true">→</span></span>
            </li>
            <li className="home-way">
              <span className="tag home-tag-free">Free</span>
              <h3><a href="/programs">Programs</a></h3>
              <p>Multi-session series, each built around one thing to ship. You finish with a working output: an agent, a build, a live site.</p>
              <p className="home-way-now"><b>{PROGRAMS.length} programs, {sessionCount} sessions</b><span>Decks and guides are published free</span></p>
              <span className="home-way-go">Explore programs<span className="home-arrow" aria-hidden="true">→</span></span>
            </li>
            <li className="home-way">
              <span className="tag">Paid&nbsp;· from ${lowestPrice.toLocaleString("en-US")}</span>
              <h3><a href="/workshops">Workshops</a></h3>
              <p>Small rooms with expert guidance on your own project. This is where a build becomes a finished product, ready to take to market.</p>
              <p className="home-way-now"><b>{UPCOMING_WORKSHOPS.length} workshops, {Math.min(...seats)} to {Math.max(...seats)} seats each</b><span>Not sure which one? Take the assessment</span></p>
              <span className="home-way-go">Find your workshop<span className="home-arrow" aria-hidden="true">→</span></span>
            </li>
          </ul>
          <p className="home-programs">
            <span>The programs</span>
            {PROGRAMS.map((program) => <a key={program.slug} href={`/programs/${program.slug}`}>{program.name}</a>)}
          </p>
        </section>

        <section id="shipped" className="section" aria-labelledby="shipped-title">
          <div className="home-ledger">
            <div className="home-figure">
              <b aria-hidden="true">{SHIPPED.teams}</b>
              <h2 id="shipped-title"><span className="sr-only">{SHIPPED.teams} </span>teams launched a live product <span className="key">in one weekend.</span></h2>
              <p className="meta">{[HACKATHON.name, HACKATHON.datesShort, "Workuity Biltmore"].join("\u00a0· ")}</p>
              <p><a className="link" href={RESULTS}>See all {SHIPPED.teams} projects</a></p>
            </div>
            <ol className="home-podium">
              {SHIPPED.podium.map((entry) => (
                <li key={entry.project} className="home-pod">
                  <span className="meta">{entry.place}</span>
                  <div>
                    <h3><a href={RESULTS}>{entry.project}</a></h3>
                    <p>{entry.line}</p>
                  </div>
                  <span className="home-arrow" aria-hidden="true">→</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="workshops" className="section" aria-labelledby="workshops-title">
          <div className="section-head">
            <h2 id="workshops-title">Make progress <span className="key">in the room.</span></h2>
            <p className="section-lede">Focused, paid workshops with expert guidance and time to build. Bring your project and leave with it ready for customers.</p>
          </div>
          <div className="cards cards-three home-cards">
            {!vibeEnded && (
            <WorkshopCard
                href={VIBE_GTM.path}
                category="Design and go-to-market"
                name={VIBE_GTM.name}
                summary="Help customers understand what you sell and how to contact you."
                meta={`October 10, 2026 · 9 AM–1 PM MST · ${VIBE_GTM.venue}`}
                price={price.amount}
                anchor={price.promotional ? 999 : null}
                unit="USD · one-time workshop admission"
                tag={`Only ${VIBE_GTM.capacity} seats`}
                scene={CARD_SCENES[2]}
              />
            )}
            {UPCOMING_WORKSHOPS.slice(0, vibeEnded ? 3 : 2).map((workshop, index) => {
              const card = WORKSHOP_PRESENTATION[workshop.slug];
              return (
                <WorkshopCard
                  key={workshop.slug}
                  href={`/workshops/${workshop.slug}`}
                  category={card?.category}
                  name={workshop.name}
                  summary={workshop.promise}
                  meta={`Up to ${workshop.capacity} seats\u00a0· Phoenix`}
                  price={workshop.price}
                  unit="USD per attendee"
                  tag="Dates TBD"
                  tagClass="tag-tbd"
                  scene={CARD_SCENES[index % CARD_SCENES.length]}
                  action={<WorkshopNotify slug={workshop.slug} name={workshop.name} />}
                />
              );
            })}
          </div>
          <div className="cta-row home-center">
            <a className="btn btn-ghost" href="/workshops">Explore all workshops</a>
            <a className="link" href="/workshops/assessment">Not sure which one? Take the assessment</a>
          </div>
        </section>

        <section className="section" aria-labelledby="host-title">
          <div className="section-head">
            <h2 id="host-title">Builder to builder, <span className="key">in Phoenix.</span></h2>
            <p className="section-lede">Run by a builder, hosted at Workuity Biltmore, backed by partners who want Phoenix builders to ship.</p>
          </div>
          <div className="host home-host">
            <img src="/santos.jpg" alt="Santos Hernandez, founder and host of Ship AI" width={140} height={140} className="host-photo" />
            <div className="host-body">
              <h3>Santos Hernandez</h3>
              <p className="host-role">Founder and host</p>
              <p>Santos started Ship AI so Phoenix builders have a room where you show the work. Before this he was the founding product hire at ZBD, taking it from $0 to $12M ARR and helping secure the EU&apos;s first MiCAR approval.</p>
              <p className="host-links"><a href="/about#host" className="link">About the host</a></p>
            </div>
          </div>
          <div className="home-partners" aria-label="Community partners">
            <div className="partner-row">
              {SPONSORS.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className={`partner${s.wide ? " partner-wide" : ""}`} title={s.name}>
                  <img src={s.img} alt={s.wordmark ? "" : s.name} />
                  {s.wordmark && <span>{s.name}</span>}
                </a>
              ))}
            </div>
            <p className="partner-note">
              Workuity is our venue sponsor. Partner with us to support practical AI education and builder programs.{" "}
              <a href="/programs/zero-to-launch/hackathon/sponsor">See what&apos;s fundable</a>
            </p>
          </div>
        </section>

        <section className="band" aria-labelledby="final-title">
          <Scene scene="stars" mode="ascii" band className="band-bg" />
          <div className="final">
            <h2 id="final-title">Bring your project. <span className="key">Leave with it shipped.</span></h2>
            <p className="lede">Meetups are free and open to all. Workshops are small, paid and hands-on. Either way, you build in the room with people who are building too.</p>
            <div className="cta-row home-pair">
              <a className="btn btn-solid" href={primary.href} target={primary.external ? "_blank" : undefined} rel={primary.external ? "noreferrer" : undefined}>{primary.label}</a>
              <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a>
            </div>
            <ul className="final-checks"><li>In person, in Phoenix</li><li>Demos over memos</li><li>Craft over hype</li></ul>
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
