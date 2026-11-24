import SiteHeader from "../../components/site-header";
import SiteFooter from "../../components/site-footer";
import Scene from "../../components/scene";
import { JsonLd } from "../../components/article";
import { EventSection, RuledGrid, ProofLedger } from "../../components/event-page";
import "../home.css";
import "../../components/departure-board.css";
import "../../components/event-page.css";
import "./hackathons.css";
import { DISCORD, EVENT } from "../../lib/hackathon";
import { FOUNDER_WEEKEND as FW } from "../../lib/founder-weekend";
import { SHIPPED, SHIPPED_RESULTS, daysUntil } from "../../lib/shipped";
import { ogImage } from "../../lib/og";

const SITE = "https://www.shipai.club";
const ZTL = "/programs/zero-to-launch/hackathon";
const ADDRESS = "2390 E Camelback Rd, Suite 130, Phoenix, AZ 85016";

const ALL = [
  {
    id: FW.id,
    name: FW.name,
    line: "Build an AI company in one weekend, then pitch it to judges, employers and investors.",
    board: "Founder Weekend: build an AI company by Sunday",
    href: FW.path,
    scene: "launch",
    alt: "Dithered night scene: a finished boat sliding down the ways into the water.",
    startISO: FW.startISO,
    endISO: FW.endISO,
    date: "Feb 6–7",
    year: "2027",
    facts: [FW.venue, FW.teams, FW.cost],
    venue: FW.venue,
    terms: [FW.cost, FW.teams, "No application"],
    sponsor: `${FW.path}/sponsor`,
    upcoming: { label: "Registration open", primary: [`${FW.path}/register`, "Register free"], secondary: [FW.path, "See the weekend"] },
    past: { label: "Weekend over", primary: [FW.path, "See the weekend"] },
  },
  {
    id: EVENT.id,
    name: "Zero to Launch Hackathon",
    line: `Build and launch the best marketing site in one weekend. ${SHIPPED.teams} teams shipped a live product.`,
    board: "Zero to Launch: launch a marketing site by Sunday",
    href: ZTL,
    scene: "fleet",
    alt: "Dithered fleet of small boats under sail together.",
    startISO: EVENT.startISO,
    endISO: EVENT.endISO,
    date: "Oct 17–18",
    year: "2026",
    facts: [EVENT.venue, `${SHIPPED.teams} teams launched`, `${SHIPPED.builders} builders`],
    venue: EVENT.venue,
    terms: [EVENT.cost, EVENT.teams],
    sponsor: `${ZTL}/sponsor`,
    upcoming: { label: "Registration open", primary: [ZTL, "See the weekend"] },
    past: { label: "Results in", primary: [SHIPPED_RESULTS, "See the results"], secondary: [ZTL, "Event page"] },
  },
];

const GIVES = [
  ["Free to enter", "No ticket, no application. Show up with an idea, or without one and join a team at kickoff."],
  ["Teams of 1–4", "Come solo or bring your crew. Designers, marketers and founders build alongside engineers."],
  ["A hard deadline", "Submissions close Sunday at noon. The clock is the point: you ship what works, not what you planned."],
  ["Judges who hire and invest", "Five-minute pitches in front of founders, employers and investors, scored on a published rubric."],
  ["Mentors on the floor", "Engineers, founders and marketers walk the room all weekend to get you unstuck."],
  ["Proof you can share", "A verifiable certificate for every team that submits, plus your pitch on its own team page."],
];

export const metadata = {
  title: "Hackathons — Ship AI",
  description: "Every Ship AI hackathon in Phoenix: free weekends where teams of 1–4 build and ship an AI product, then pitch it to judges.",
  alternates: { canonical: `${SITE}/hackathons` },
  openGraph: {
    title: "Hackathons — Ship AI",
    description: "Free weekends in Phoenix where teams build and ship an AI product by Sunday.",
    url: `${SITE}/hackathons`,
    siteName: "Ship AI",
    images: [ogImage({ kicker: "Hackathons", title: "Build it. Ship it by Sunday.", key: "by Sunday.", tagline: "Free AI hackathons in Phoenix." })],
  },
};

export const revalidate = 3600;

export default function Page() {
  const now = Date.now();
  const isPast = (h) => Date.parse(h.endISO) <= now;
  const upcoming = ALL.filter((h) => !isPast(h)).sort((a, b) => a.startISO.localeCompare(b.startISO));
  const past = ALL.filter(isPast).sort((a, b) => b.startISO.localeCompare(a.startISO));
  const next = upcoming[0];
  const days = next ? daysUntil(next.startISO, now) : 0;
  const live = next && Date.parse(next.startISO) <= now;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ship AI hackathons",
    itemListElement: [...upcoming, ...past].map((h, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "Event", name: h.name, url: `${SITE}${h.href}`, startDate: h.startISO, endDate: h.endISO, isAccessibleForFree: true, location: { "@type": "Place", name: "Workuity Biltmore", address: ADDRESS } },
    })),
  };

  const isLive = (h) => !isPast(h) && Date.parse(h.startISO) <= now;
  const action = (h) => isLive(h) ? [h.href, "Follow it live"] : h.upcoming.primary;
  const entry = (h) => {
    const done = isPast(h);
    const state = done ? h.past : isLive(h) ? { label: "Happening now", primary: [h.href, "Follow it live"] } : h.upcoming;
    return (
      <li key={h.id} className={done ? "hx-item is-past" : "hx-item"}>
        <div className="hx-art"><Scene scene={h.scene} alt={h.alt} /></div>
        <div className="hx-body">
          <p className="hx-when"><b>{h.date}</b><span>{h.year}</span><span className={done ? "hx-pill" : "hx-pill is-open"}>{state.label}</span></p>
          <h4><a href={h.href}>{h.name}</a></h4>
          <p className="hx-line">{h.line}</p>
          <p className="meta">{h.facts.join(" · ")}</p>
          <div className="hx-act">
            <a className={done ? "btn btn-ghost btn-sm" : "btn btn-solid btn-sm"} href={state.primary[0]}>{state.primary[1]}</a>
            {state.secondary && <a className="link" href={state.secondary[0]}>{state.secondary[1]}</a>}
          </div>
        </div>
      </li>
    );
  };

  return (
    <>
      <JsonLd data={schema} />
      <SiteHeader current="/hackathons" />

      <main id="top">
        <section className="hero home-hero hx-hero" aria-labelledby="hk-title">
          <h1 className="hero-h1" id="hk-title">
            <span className="sr-only">Ship AI hackathons: </span>
            One weekend. <span className="key">Ship it by Sunday.</span>
          </h1>
          <p className="hero-lede">Free hackathons in Phoenix. Teams of one to four build a real AI product in two days, then pitch it to judges, employers and investors.</p>
          <div className="cta-row home-pair">
            {next
              ? <a className="btn btn-solid" href={action(next)[0]}>{action(next)[1]}</a>
              : <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Hear about the next one</a>}
            <a className="btn btn-ghost" href="#every-hackathon">See every hackathon</a>
          </div>
          <p className="home-facts">Free to enter&nbsp;· Teams of 1–4&nbsp;· {SHIPPED.teams} teams launched at Zero to Launch&nbsp;· In person, in Phoenix</p>

          <div className="stage dboard-stage hx-stage">
            <Scene scene={next ? next.scene : "harbor"} alt={next ? next.alt : "Dithered harbor at dusk: many small boats at their moorings."} />
          </div>
          <aside className="window dboard" aria-label={next ? "Next hackathon" : "Next hackathon: date to be announced"}>
            <div className="window-bar"><b>{next ? `Next hackathon · ${next.name}` : "Between weekends"}</b><span>{next ? (live ? "Happening now" : next.upcoming.label) : "Announced on Discord first"}</span></div>
            {next ? (
              <div className="dboard-row">
                <p className="dboard-date"><b>{next.date}</b><span>{next.year}&nbsp;· {next.venue}</span></p>
                <div className="dboard-main">
                  <h2>{next.board}</h2>
                  <p className="meta">{next.terms.join(" · ")}</p>
                </div>
                {days > 0 && <p className="dboard-count"><b>{days}</b><span>{days === 1 ? "day to kickoff" : "days to kickoff"}</span></p>}
                <div className="dboard-act">
                  <a className="btn btn-solid" href={action(next)[0]}>{action(next)[1]}</a>
                  {action(next)[0] !== next.href && <a className="link" href={next.href}>See the weekend</a>}
                </div>
              </div>
            ) : (
              <div className="dboard-row dboard-row-quiet">
                <div className="dboard-main"><h2>The next weekend is being planned</h2><p className="meta">Join Discord to hear the date first</p></div>
                <div className="dboard-act"><a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a></div>
              </div>
            )}
            <p className="dboard-foot">
              <span>Submissions close Sunday at noon</span>
              <a href={next ? next.sponsor : `${FW.path}/sponsor`}>Sponsor a weekend</a>
            </p>
          </aside>
        </section>

        <EventSection
          id="every-hackathon"
          title="Every hackathon,"
          keyPhrase="start to ship."
          lede="Each weekend has its own page with the schedule, rules and rubric. Once it ends, the page keeps the teams, their pitches and the results."
        >
          {upcoming.length > 0 && <>
            <h3 className="hx-group"><span>Coming up</span><span className="meta">In person in Phoenix</span></h3>
            <ul className="hx-list">{upcoming.map(entry)}</ul>
          </>}
          {past.length > 0 && <>
            <h3 className="hx-group"><span>Past hackathons</span><span className="meta">Teams, pitches and results</span></h3>
            <ul className="hx-list">{past.map(entry)}</ul>
          </>}
        </EventSection>

        <section className="section ev-section hx-proof" aria-label="Last hackathon">
          <ProofLedger shipped={SHIPPED} results={SHIPPED_RESULTS}>
            <p className="hx-proof-link"><a className="link" href={SHIPPED_RESULTS}>See every team and score</a></p>
          </ProofLedger>
        </section>

        <EventSection id="every-weekend" title="What every weekend" keyPhrase="gives you.">
          <RuledGrid items={GIVES} />
        </EventSection>

        <div className="ev-end" />

        <section className="band" aria-labelledby="hk-final-title">
          <Scene scene="stars" mode="ascii" band className="band-bg" />
          <div className="final">
            <h2 id="hk-final-title">Feel the fear. <span className="key">Ship it anyway.</span></h2>
            {next ? (
              <>
                <p className="lede">Register a team for {next.name}, or come solo and find one at Saturday&apos;s kickoff.</p>
                <div className="cta-row"><a className="btn btn-solid" href={action(next)[0]}>{action(next)[1]}</a></div>
                <ul className="final-checks">
                  <li>Free to enter</li>
                  <li>{next.terms[1]}</li>
                  <li>Phoenix, {next.date}</li>
                </ul>
              </>
            ) : (
              <>
                <p className="lede">Join Discord to hear about the next weekend first.</p>
                <div className="cta-row"><a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a></div>
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
