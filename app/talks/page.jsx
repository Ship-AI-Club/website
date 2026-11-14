import SiteHeader from "../../components/site-header";
import SiteFooter from "../../components/site-footer";
import Scene from "../../components/scene";
import DepartureBoard from "../../components/departure-board";
import { TALKS, talkEnded, talkScheduled } from "../../lib/talks";
import { DISCORD } from "../../lib/hackathon";
import { ogImage } from "../../lib/og";
import { SOCRATIC } from "../../lib/socratic";
import "./talks.css";

export const metadata = {
  title: "Talks - Ship AI",
  description: "Twelve free Ship AI talks in Phoenix. One founder app, built on screen from forming the company to running it, with the prompts, the tools and the deck published free.",
  alternates: { canonical: "https://www.shipai.club/talks" },
  openGraph: {
    title: "Talks - Ship AI",
    description: "Twelve nights, one founder app. Everything published free.",
    url: "https://www.shipai.club/talks",
    siteName: "Ship AI",
    images: [ogImage({ kicker: "Talks", title: "Twelve nights, one founder app.", key: "one founder app.", tagline: "The prompts, the tools and the deck, published free." })],
  },
};

export const revalidate = 3600;

const LEGS = [
  { name: "Start", line: "Form it, test the idea, build it.", parts: [1, 2, 3] },
  { name: "Grow", line: "Add to it and put it in front of people.", parts: [4, 5, 6, 7] },
  { name: "Harden", line: "Make it durable, safe and watched.", parts: [8, 9, 10] },
  { name: "Run", line: "Operate it every day, with help.", parts: [11, 12] },
];

const pad = (n) => String(n).padStart(2, "0");

function daysUntil(iso) {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));
}

function shortDate(talk) {
  if (!talkScheduled(talk)) return "Date TBA";
  return new Date(talk.startISO).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "America/Phoenix" });
}

function Title({ talk }) {
  const [lead, ...rest] = talk.eventTitle.split(talk.key);
  return <>{lead}<span className="key">{talk.key}</span>{rest.join(talk.key)}</>;
}

function TalkCard({ talk, next, h = "h3" }) {
  const H = h;
  const ended = talkEnded(talk);
  return <li className={`card tk-card${next ? " is-next" : ""}`}>
    <p className="tk-card-top">
      <span>{talk.series ? `Part ${pad(talk.series)}` : "Talk"}</span>
      <span className={next ? "tk-pill tk-pill-live" : "tk-pill"}>{ended ? "Slides up" : shortDate(talk)}</span>
    </p>
    <H className="tk-card-title"><a className="tk-card-link" href={`/talks/${talk.slug}`}><Title talk={talk} /></a></H>
    <p className="tk-card-sum">{talk.summary}</p>
    <p className="tk-card-foot">
      {talk.example?.file ? <span className="tk-file">{talk.example.file}</span> : <span />}
      <a className="tk-slides" href={`/talks/${talk.slug}/deck`}>Slides <span aria-hidden="true">→</span></a>
    </p>
  </li>;
}

export default function Page() {
  const series = TALKS.filter((t) => t.series);
  const upcoming = TALKS.filter((t) => talkScheduled(t) && !talkEnded(t)).sort((a, b) => a.startISO.localeCompare(b.startISO));
  const next = upcoming[0];
  const past = TALKS.filter((t) => talkEnded(t) && !t.series).reverse();
  const nextRsvp = next?.rsvp?.[0];
  const start = next ? new Date(next.startISO) : null;
  const days = next ? daysUntil(next.startISO) : 0;

  return <>
    <SiteHeader current="/talks" />
    <main className="talks-page">
      <section className="hero tk-hero" aria-labelledby="talks-title">
        <p className="eyebrow">Ship AI · Talks</p>
        <h1 className="hero-h1" id="talks-title">Twelve nights, <span className="key">one founder app.</span></h1>
        <p className="hero-lede">Twelve talks that each stand on their own, from forming the company to running it with a team of AI bots. Every night builds the same example app on screen. Come to the one you need, or all twelve.</p>
        <div className="cta-row home-pair">
          {nextRsvp
            ? <a className="btn btn-solid" href={nextRsvp.href} target="_blank" rel="noreferrer">Save your seat</a>
            : <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Get the dates</a>}
          <a className="btn btn-ghost" href="#series">See all twelve</a>
        </div>
        {next && <div className="talk-board">
          <DepartureBoard
            scene="launch"
            label={next.series ? `Next up · Part ${next.series}` : "Next up"}
            status="Free · In person"
            date={{ big: start.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Phoenix" }), small: `${start.toLocaleDateString("en-US", { weekday: "short", timeZone: "America/Phoenix" })} · ${next.timeLabel}` }}
            title={next.eventTitle}
            meta={`${next.venue}, Phoenix · ${next.summary}`}
            figure={days === 0 ? { big: "Tonight", small: "doors at 5:30" } : { big: String(days), small: days === 1 ? "day to go" : "days to go" }}
            action={{ href: `/talks/${next.slug}`, label: "See the night" }}
          />
        </div>}
      </section>

      <section className="section tk-series" id="series" aria-labelledby="series-title">
        <div className="section-head">
          <h2 id="series-title">All twelve, <span className="key">in order.</span></h2>
          <p className="section-lede">Every night uses the same example app, What's for Dinner, and stands on its own. Start with the one you need, and leave with a file to paste into your own project.</p>
        </div>
        <ol className="tk-legs">
          {LEGS.map((leg) => {
            const talks = leg.parts.map((n) => series.find((t) => t.series === n)).filter(Boolean);
            return <li key={leg.name} className="tk-leg">
              <div className="tk-leg-head">
                <span className="tk-leg-n">Parts {leg.parts[0]}-{leg.parts[leg.parts.length - 1]}</span>
                <h3>{leg.name}</h3>
                <p>{leg.line}</p>
              </div>
              <ol className="tk-cards">{talks.map((t) => <TalkCard key={t.slug} talk={t} next={next?.slug === t.slug} h="h4" />)}</ol>
            </li>;
          })}
        </ol>
      </section>

      <section className="section tk-recurring" aria-labelledby="rec-title">
        <div className="section-head">
          <h2 id="rec-title">Every <span className="key">month.</span></h2>
          <p className="section-lede">Between the talks, one night where the room sets the agenda.</p>
        </div>
        <a className="card tk-rec" href="/socratic-night" aria-labelledby="rec-card-title">
          <div className="tk-rec-body">
            <span>{SOCRATIC.when}</span>
            <h3 id="rec-card-title">Socratic <span className="key">Night</span></h3>
            <p>{SOCRATIC.copy}</p>
            <ul className="tk-rec-cats">{SOCRATIC.categories.map((c) => <li key={c.name}>{c.name}</li>)}</ul>
            <p className="tk-rec-go">See how it works <b aria-hidden="true">→</b></p>
          </div>
          <div className="tk-rec-art" aria-hidden="true"><Scene scene="harbor" /></div>
        </a>
      </section>

      <section className="section tk-take" aria-labelledby="take-title">
        <div className="section-head">
          <h2 id="take-title">Every night, <span className="key">take it home.</span></h2>
        </div>
        <ul className="tk-take-list">
          <li><span>01</span><h3>The deck</h3><p>Every slide, free to share.</p></li>
          <li><span>02</span><h3>The prompts</h3><p>Copy them into Claude Code, step by step.</p></li>
          <li><span>03</span><h3>The file</h3><p>The night's plan, ready for your repo.</p></li>
        </ul>
      </section>

      {past.length > 0 && <section className="section" aria-labelledby="past-title">
        <div className="section-head"><h2 id="past-title">Past talks.</h2><p className="section-lede">The slides and prompts stay up.</p></div>
        <ol className="tk-cards">{past.map((talk) => <TalkCard key={talk.slug} talk={talk} />)}</ol>
      </section>}

      <section className="band" aria-labelledby="talks-final-title">
        <div className="final">
          <h2 id="talks-final-title">Come to one. <span className="key">Or all twelve.</span></h2>
          <p className="lede">Free, Wednesday nights at Workuity Biltmore in Phoenix. Dates go out in the Discord first.</p>
          <div className="cta-row home-pair">
            <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a>
            {nextRsvp && <a className="btn btn-ghost" href={nextRsvp.href} target="_blank" rel="noreferrer">Save your seat</a>}
          </div>
        </div>
        <div className="final-stage">
          <Scene scene="harbor" band alt="Dithered harbor at dusk: many small boats at their moorings with their lights on. The community." />
          <p>Harbor at dusk · Phoenix, Arizona</p>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
