import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";
import Scene from "../components/scene";
import { getUpcomingEvents } from "../lib/meetup";
import { JsonLd } from "../components/article";
import { PROGRAMS, programVenueNames } from "../lib/programs";
import ProgramCard from "../components/program-card";
import { EVENT } from "../lib/hackathon";
import { VIBE_GTM, workshopPrice } from "../lib/vibe-gtm-workshop";
import { UPCOMING_WORKSHOPS } from "../lib/workshops";
import { WORKSHOP_PRESENTATION } from "../lib/workshop-presentation";
import WorkshopCard from "../components/workshop-card";
import "./workshops/catalogue.css";

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
    images: [{ url: "/og-community.png", width: 1200, height: 630 }],
  },
};

const DISCORD = "https://discord.gg/kZSJMNveYM";
const MEETUP = "https://www.meetup.com/shipai/";
const LUMA = "https://luma.com/shipai";
const GITHUB = "https://github.com/Ship-AI-Club";

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
  const vibeEnded = Date.now() >= new Date(VIBE_GTM.end).getTime();
  const featured = PROGRAMS.find((p) => p.status === "running" && p.hasHackathon) || PROGRAMS.find((p) => p.status === "running");

  return (
    <>
      <JsonLd data={ORG_SCHEMA} />
      {events.length > 0 && <JsonLd data={eventsSchema(events)} />}
      <SiteHeader current="/" cta={<a className="btn btn-solid btn-sm nav-cta" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a>} />

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          {featured && (
            <p className="eyebrow">
              <a href={featured.hackathonHref || `/programs/${featured.slug}`} className="link">
                Now running · {featured.hasHackathon ? `${EVENT.name} · ${EVENT.datesShort.replace(/, \d{4}$/, "").replace(/ /g, "\u00a0")}` : featured.name}
              </a>
            </p>
          )}
          <h1 className="hero-h1" id="hero-title">
            <span className="sr-only">Ship AI: </span>
            Practical AI, <span className="key">Built Together</span>
          </h1>
          <p className="hero-lede">
            Hands-on workshops in Phoenix for turning AI tools into real business results.
            Build your project with expert guidance, sharpen your taste, and leave with work you can use.
          </p>
          <div className="cta-row">
            <a className="btn btn-solid" href="/workshops">Explore workshops</a>
            <a className="btn btn-ghost" href="/programs">Explore programs</a>
          </div>

          <div className="stage">
            <Scene scene="slipway" alt="Dithered night scene: a hull on the slipway with scaffolding around it and two builders at work. We build together." />
            <aside id="events" className="window" aria-label="Next session">
              <div className="window-bar"><b>Next session</b><span>{nextEvent ? "RSVPs open" : "Calendar"}</span></div>
              <div className="hero-window-body">
                {nextEvent ? (
                  <>
                    <h2>{nextEvent.title}</h2>
                    <p className="meta">{[nextEvent.date, nextEvent.time, nextEvent.place || "Phoenix, AZ"].join("\u00a0· ")}</p>
                    {nextEvent.title === VIBE_GTM.name && <span className="tag">Only {VIBE_GTM.capacity} seats</span>}
                    <a className="btn btn-solid btn-sm" href={nextEvent.url} target="_blank" rel="noreferrer">Reserve a seat</a>
                  </>
                ) : (
                  <>
                    <h2>New sessions post every few weeks.</h2>
                    <a className="btn btn-solid btn-sm" href={MEETUP} target="_blank" rel="noreferrer">See the calendar</a>
                  </>
                )}
                <p className="hero-window-foot">
                  <span>See event details for tickets</span>
                  <a href={MEETUP} target="_blank" rel="noreferrer">Full calendar</a>
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section id="programs" className="section hero-after-stage" aria-labelledby="programs-title" style={{ borderTop: 0 }}>
          <div className="section-head">
            <h2 id="programs-title">Pick your <span className="key">on-ramp.</span></h2>
            <p className="section-lede">Free, multi-session programs that take a builder from first prompt to a shipped product.</p>
          </div>
          <ul className="pcards">
            {PROGRAMS.map((program) => (
              <ProgramCard
                key={program.slug}
                program={{ slug: program.slug, name: program.name, status: program.status, datesLabel: program.datesLabel, sessions: program.sessions.length, venues: programVenueNames(program) }}
              />
            ))}
          </ul>
        </section>

        <section id="workshops" className="section" aria-labelledby="workshops-title">
          <div className="section-head">
            <h2 id="workshops-title">Make progress <span className="key">in the room.</span></h2>
            <p className="section-lede">Focused, paid workshops with expert guidance and time to build. Bring your project and work through the decisions that move it forward. Blueprints come preloaded with skills and best practices; recordings and materials are emailed afterward.</p>
          </div>
          <div className="cards cards-three">
            {!vibeEnded && (
            <WorkshopCard
                href={VIBE_GTM.path}
                category="Design and go-to-market"
                name={VIBE_GTM.name}
                summary="Help customers understand what you sell and how to contact you."
                meta={`October 10, 2026 · 9 AM–1 PM MST · ${VIBE_GTM.venue}`}
                price={vibeEnded ? null : price.amount}
                anchor={!vibeEnded && price.promotional ? 999 : null}
                unit={vibeEnded ? "Workshop ended" : "USD · one-time workshop admission"}
                tag={vibeEnded ? null : `Only ${VIBE_GTM.capacity} seats`}
                tagClass=""
              />
            )}
            {UPCOMING_WORKSHOPS.slice(0, vibeEnded ? 3 : 2).map((workshop) => {
              const card = WORKSHOP_PRESENTATION[workshop.slug];
              return (
                <WorkshopCard
                  key={workshop.slug}
                  href={`/workshops/${workshop.slug}`}
                  category={card?.category}
                  name={workshop.name}
                  summary={workshop.promise}
                  meta={`${workshop.duration || "Hands-on workshop"} · Up to ${workshop.capacity} attendees · Phoenix`}
                  price={workshop.price}
                  unit="USD per attendee"
                  tag="Dates TBD"
                  tagClass="tag-tbd"
                />
              );
            })}
          </div>
          <p style={{ marginTop: 32 }}><a className="btn btn-ghost" href="/workshops">Explore all workshops</a></p>
        </section>

        <section className="partner-strip" aria-label="Community partners">
          <div className="partner-strip-inner">
            <span className="k">Hosted at <b>Workuity Biltmore</b> · Community partners</span>
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

        <section className="section" aria-labelledby="host-title">
          <div className="section-head">
            <h2 id="host-title">Builder to builder, <span className="key">in Phoenix.</span></h2>
            <p className="section-lede">Every session ends in five-minute demos. What you&apos;re stuck on is what the next one gets built around.</p>
          </div>
          <div className="host" style={{ margin: "0 auto" }}>
            <img src="/santos.jpg" alt="Santos Hernandez, founder and host of Ship AI" width={140} height={140} className="host-photo" />
            <div className="host-body">
              <h2>Santos Hernandez</h2>
              <p className="host-role">Founder and host · Lead product engineer · ZBD founding product hire</p>
              <p>Santos started Ship AI so Phoenix builders have a room where you show the work. Before this he was the founding product hire at ZBD, taking it from $0 to $12M ARR and helping secure the EU&apos;s first MiCAR approval.</p>
              <p className="host-links"><a href="/about#host" className="link">About the host</a></p>
            </div>
          </div>
        </section>

        <section className="band" aria-labelledby="final-title">
          <Scene scene="stars" mode="ascii" band className="band-bg" />
          <div className="final">
            <h2 id="final-title">Bring your project. <span className="key">Leave with it shipped.</span></h2>
            <p className="lede">Meetups are free and open to all. Workshops are small, paid and hands-on. Either way, you build in the room with people who are building too.</p>
            <div className="cta-row">
              <a className="btn btn-solid" href={MEETUP} target="_blank" rel="noreferrer">RSVP on Meetup</a>
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
