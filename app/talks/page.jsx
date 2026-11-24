import SiteHeader from "../../components/site-header";
import SiteFooter from "../../components/site-footer";
import Scene from "../../components/scene";
import DepartureBoard from "../../components/departure-board";
import { TalkCard, TalkGroups, STANDALONE_GROUPS } from "../../components/talk-cards";
import { TALKS, SERIES_NAME, LUNCH_NAME, talkEnded, talkKind, talkScheduled } from "../../lib/talks";
import { DISCORD } from "../../lib/hackathon";
import { SOCRATIC } from "../../lib/socratic";
import { AI_EXCHANGE } from "../../lib/ai-exchange";
import { FOUNDER_WEEKEND } from "../../lib/founder-weekend";
import "./talks.css";

const FW_SERIES = "/hackathons/founder-weekend#series";
const OG = { url: "/og-talks.jpg", width: 1200, height: 630, alt: "Ship AI Talks: one night, one topic. Free talks in Phoenix at Workuity Biltmore, Tuesday and Wednesday nights and Thursday lunches." };

export const metadata = {
  title: "Talks - Ship AI",
  description: "Free Ship AI talks in Phoenix: Founders Nights on Tuesdays, AI Exchange Tech Talks for developers on Wednesdays, Lunch & Learns on Thursdays at noon, and the Founder Weekend hackathon, Feb 6-7. Pick the problem you have, watch it get solved on screen, and take the prompts, the deck and the file home.",
  alternates: { canonical: "https://www.shipai.club/talks" },
  openGraph: {
    title: "Talks - Ship AI",
    description: "One night, one topic. Free talks in Phoenix, with everything published free.",
    url: "https://www.shipai.club/talks",
    siteName: "Ship AI",
    images: [OG],
  },
  twitter: { card: "summary_large_image", title: "Talks - Ship AI", description: "One night, one topic. Free talks in Phoenix, with everything published free.", images: [OG.url] },
};

export const revalidate = 3600;

function daysUntil(iso) {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));
}

export default function Page() {
  const upcoming = TALKS.filter((t) => talkScheduled(t) && !talkEnded(t)).sort((a, b) => a.startISO.localeCompare(b.startISO));
  const next = upcoming[0];
  const standalone = TALKS.filter((t) => t.standalone && !talkEnded(t));
  const past = TALKS.filter((t) => t.standalone && talkEnded(t)).reverse();
  const nextRsvp = next?.rsvp?.[0];
  const start = next ? new Date(next.startISO) : null;
  const days = next ? daysUntil(next.startISO) : 0;
  const now = Date.now();
  const exchange = AI_EXCHANGE.talks.filter((t) => new Date(t.endISO).getTime() > now);
  const calendar = [
    ...upcoming.map((t) => ({ key: t.slug, startISO: t.startISO, timeLabel: t.timeLabel, kind: talkKind(t), title: t.eventTitle, href: `/talks/${t.slug}`, summary: `${t.summary} · ${t.venue}`, rsvp: t.rsvp?.[0]?.href })),
    ...exchange.map((t) => ({ key: t.slug, startISO: t.startISO, timeLabel: AI_EXCHANGE.timeLabel, kind: "AI Exchange Tech Talk", title: t.title, href: t.luma, external: true, summary: `${t.summary} · ${AI_EXCHANGE.venue}`, rsvp: t.luma })),
    ...(new Date(FOUNDER_WEEKEND.endISO).getTime() > now ? [{ key: FOUNDER_WEEKEND.id, startISO: FOUNDER_WEEKEND.startISO, timeLabel: "Feb 6–7", kind: "Hackathon", title: FOUNDER_WEEKEND.name, href: FOUNDER_WEEKEND.path, summary: `${FOUNDER_WEEKEND.tagline} Free, teams of 1–4 · ${FOUNDER_WEEKEND.venue}`, rsvp: FOUNDER_WEEKEND.rsvpUrl }] : []),
  ].sort((a, b) => a.startISO.localeCompare(b.startISO));

  return <>
    <SiteHeader current="/talks" />
    <main className="talks-page">
      <section className="hero tk-hero" aria-labelledby="talks-title">
        <p className="eyebrow">Ship AI · Talks</p>
        <h1 className="hero-h1" id="talks-title">One night, <span className="key">one topic.</span></h1>
        <p className="hero-lede">Free talks in Phoenix. Pick the problem you have, watch it get solved on screen, and take the prompts, the deck and the file home.</p>
        <div className="cta-row home-pair">
          {nextRsvp
            ? <a className="btn btn-solid" href={nextRsvp.href} target="_blank" rel="noreferrer">Save your seat</a>
            : <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Get the dates</a>}
          <a className="btn btn-ghost" href={calendar.length ? "#upcoming" : "#standalone"}>See what's coming up</a>
        </div>
        {next && <div className="talk-board">
          <DepartureBoard
            scene="launch"
            label={next.series ? `Next up · ${SERIES_NAME}` : next.lunch ? `Next up · ${LUNCH_NAME}` : "Next up"}
            status="Free · In person"
            date={{ big: start.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Phoenix" }), small: `${start.toLocaleDateString("en-US", { weekday: "short", timeZone: "America/Phoenix" })} · ${next.timeLabel}` }}
            title={next.eventTitle}
            meta={`${next.venue}, Phoenix · ${next.summary}`}
            figure={days === 0 ? { big: next.lunch ? "Today" : "Tonight", small: `starts ${next.timeLabel.split(" - ")[0]} PM` } : { big: String(days), small: days === 1 ? "day to go" : "days to go" }}
            action={{ href: `/talks/${next.slug}`, label: next.lunch ? "See the session" : "See the night" }}
          />
        </div>}
      </section>

      {calendar.length > 0 && <section className="section tk-upcoming" id="upcoming" aria-labelledby="upcoming-title">
        <div className="section-head">
          <h2 id="upcoming-title">Coming <span className="key">up.</span></h2>
          <p className="section-lede">Every date, in order: Founders Nights on Tuesdays at 5 PM, AI Exchange Tech Talks on Wednesdays at 5 PM, Lunch & Learns on Thursdays at noon, then Founder Weekend. More dates go out in the Discord first.</p>
        </div>
        <ol className="tk-cal">
          {calendar.map((t) => {
            const d = new Date(t.startISO);
            const ext = t.external ? { target: "_blank", rel: "noreferrer" } : {};
            return <li key={t.key} className="tk-cal-row">
              <p className="tk-cal-date"><b>{d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Phoenix" })}</b><span>{d.toLocaleDateString("en-US", { weekday: "short", timeZone: "America/Phoenix" })} · {t.timeLabel}</span></p>
              <div className="tk-cal-main">
                <span className="tk-cal-kind">{t.kind}</span>
                <h3><a href={t.href} {...ext}>{t.title}</a></h3>
                <p>{t.summary}</p>
              </div>
              <div className="tk-cal-act">
                {t.rsvp && <a className="btn btn-solid btn-sm" href={t.rsvp} target="_blank" rel="noreferrer">RSVP</a>}
                {!t.external && <a className="btn btn-ghost btn-sm" href={t.href}>Details</a>}
              </div>
            </li>;
          })}
        </ol>
      </section>}

      {standalone.length > 0 && <section className="section tk-standalone" id="standalone" aria-labelledby="standalone-title">
        <div className="section-head">
          <h2 id="standalone-title">One night, <span className="key">your business.</span></h2>
          <p className="section-lede">Talks built around your own work. Pick the problem you have, bring the business, and leave with the file that fixes it.</p>
        </div>
        <TalkGroups groups={STANDALONE_GROUPS} talks={standalone} nextSlug={next?.slug} label={(g, items) => `${items.length} talks`} />
      </section>}

      {exchange.length > 0 && <section className="section tk-exchange" id="ai-exchange" aria-labelledby="exchange-title">
        <div className="section-head">
          <h2 id="exchange-title">Wednesdays, <span className="key">for developers.</span></h2>
          <p className="section-lede">{AI_EXCHANGE.copy} In partnership with the <a href={AI_EXCHANGE.partner.url} target="_blank" rel="noreferrer">{AI_EXCHANGE.partner.name}</a>.</p>
        </div>
        <ol className="tk-cards tk-cards-3">
          {exchange.map((t) => {
            const d = new Date(t.startISO);
            return <li key={t.slug} className="card tk-card">
              <p className="tk-card-top"><span>{d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "America/Phoenix" })} · 5 PM</span><span className="tk-pill">Tech Talk</span></p>
              <h3 className="tk-card-title"><a className="tk-card-link" href={t.luma} target="_blank" rel="noreferrer">{t.title}</a></h3>
              <p className="tk-card-sum">{t.summary}</p>
              <p className="tk-card-foot"><span className="tk-file">Workuity Biltmore</span><span className="tk-slides">RSVP <span aria-hidden="true">→</span></span></p>
            </li>;
          })}
        </ol>
      </section>}

      <section className="section tk-recurring" aria-labelledby="rec-title">
        <div className="section-head">
          <h2 id="rec-title">Every <span className="key">month.</span></h2>
          <p className="section-lede">One night where the room sets the agenda.</p>
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

      <section className="section tk-recurring tk-hackathon" id="hackathon" aria-labelledby="hack-title">
        <div className="section-head">
          <h2 id="hack-title">Then ship it <span className="key">in a weekend.</span></h2>
          <p className="section-lede">Every track leads into Founder Weekend, the free Arizona AI hackathon.</p>
        </div>
        <a className="card tk-rec" href={FOUNDER_WEEKEND.path} aria-labelledby="hack-card-title">
          <div className="tk-rec-body">
            <span>{FOUNDER_WEEKEND.datesShort} · {FOUNDER_WEEKEND.venue}, Phoenix</span>
            <h3 id="hack-card-title">Founder <span className="key">Weekend</span></h3>
            <p>{FOUNDER_WEEKEND.tagline} Teams of 1–4 build for two days, then pitch for five minutes to judges, employers and investors. The five Tuesday Founders Nights are the runway.</p>
            <ul className="tk-rec-cats"><li>Free</li><li>{FOUNDER_WEEKEND.teams}</li><li>No coding required</li><li>With {FOUNDER_WEEKEND.partner.name}</li></ul>
            <p className="tk-rec-go">See the hackathon <b aria-hidden="true">→</b></p>
          </div>
          <div className="tk-rec-art" aria-hidden="true"><Scene scene="launch" /></div>
        </a>
        <p className="tk-hack-more"><a href={FW_SERIES}>See the five Tuesday nights</a> · <a href={FOUNDER_WEEKEND.rsvpUrl} target="_blank" rel="noreferrer">RSVP on Luma</a></p>
      </section>

      <section className="section tk-take" aria-labelledby="take-title">
        <div className="section-head">
          <h2 id="take-title">Every night, <span className="key">take it home.</span></h2>
        </div>
        <ul className="tk-take-list">
          <li><span>01</span><h3>The deck</h3><p>Every slide, free to share.</p></li>
          <li><span>02</span><h3>The prompts</h3><p>Copy them into Claude Code, step by step.</p></li>
          <li><span>03</span><h3>The file</h3><p>The night's plan, ready for your own work.</p></li>
        </ul>
      </section>

      {past.length > 0 && <section className="section" aria-labelledby="past-title">
        <div className="section-head"><h2 id="past-title">Past talks.</h2><p className="section-lede">The slides and prompts stay up.</p></div>
        <ol className="tk-cards tk-cards-3">{past.map((talk) => <TalkCard key={talk.slug} talk={talk} />)}</ol>
      </section>}

      <section className="band" aria-labelledby="talks-final-title">
        <div className="final">
          <h2 id="talks-final-title">Pick a night. <span className="key">Bring your work.</span></h2>
          <p className="lede">Free at Workuity Biltmore in Phoenix: Tuesday and Wednesday nights at 5, Thursday lunches at noon, and Founder Weekend on Feb 6–7. Dates go out in the Discord first.</p>
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
