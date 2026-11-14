import { notFound } from "next/navigation";
import SiteHeader from "../../../components/site-header";
import SiteFooter from "../../../components/site-footer";
import Scene from "../../../components/scene";
import DepartureBoard from "../../../components/departure-board";
import WorkshopPrompt from "../../../components/workshop-prompt.jsx";
import { JsonLd } from "../../../components/article";
import { TALKS, SERIES_NAME, talkBySlug, talkPrompts, talkEnded, talkScheduled, talkWhen, talkFullTitle } from "../../../lib/talks";
import { DISCORD } from "../../../lib/hackathon";
import { ogImage } from "../../../lib/og";
import "../talks.css";

const SITE = "https://www.shipai.club";
const LUMA = "https://luma.com/shipai";

export const revalidate = 3600;

export function generateStaticParams() {
  return TALKS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const talk = talkBySlug(slug);
  if (!talk) return {};
  const url = `${SITE}/talks/${talk.slug}`;
  return {
    title: `${talkFullTitle(talk)} - Ship AI`,
    description: `${talk.summary} ${talk.copy} ${talkWhen(talk)}, ${talk.venue}, Phoenix. Free.`.slice(0, 300),
    alternates: { canonical: url },
    openGraph: { title: talkFullTitle(talk), description: talk.summary, url, siteName: "Ship AI", images: [ogImage({ kicker: talk.series ? SERIES_NAME : "Talks", title: talk.eventTitle, key: talk.key, tagline: talk.summary, meta: `${talkScheduled(talk) ? talk.dateLabel : "Coming soon"} · Free` })] },
  };
}

function eventSchema(talk) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: talkFullTitle(talk),
    description: talk.copy,
    startDate: talk.startISO,
    endDate: talk.endISO,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    isAccessibleForFree: true,
    location: { "@type": "Place", name: talk.venue, address: talk.address },
    organizer: { "@type": "Organization", name: "Ship AI", url: SITE },
    url: `${SITE}/talks/${talk.slug}`,
  };
}

function daysUntil(iso) {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));
}

export default async function Page({ params }) {
  const { slug } = await params;
  const talk = talkBySlug(slug);
  if (!talk) notFound();
  const [lead, ...rest] = talk.eventTitle.split(talk.key);
  const scheduled = talkScheduled(talk);
  const ended = talkEnded(talk);
  const rsvp = ended || !scheduled ? [] : talk.rsvp?.length ? talk.rsvp : [{ label: "RSVP on Luma", href: LUMA }];
  const prompts = talkPrompts(talk);
  const deckHref = `/talks/${talk.slug}/deck`;
  const days = scheduled ? daysUntil(talk.startISO) : 0;
  const start = scheduled ? new Date(talk.startISO) : null;
  const dateBig = start ? start.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Phoenix" }) : "TBA";
  const weekday = start ? start.toLocaleDateString("en-US", { weekday: "short", timeZone: "America/Phoenix" }) : "";

  return <>
    {scheduled && <JsonLd data={eventSchema(talk)} />}
    <SiteHeader current="/talks" />
    <main className="talk-page">
      <section className="hero talk-hero" aria-labelledby="talk-title">
        <p className="eyebrow">{talk.series ? `${SERIES_NAME} · Part ${talk.series}` : "Ship AI · Talks"} · {ended ? "Past talk" : scheduled ? "Free" : "Coming soon"}</p>
        <h1 className="hero-h1" id="talk-title">{lead}<span className="key">{talk.key}</span>{rest.join(talk.key)}</h1>
        <p className="hero-lede">{talk.summary}</p>
        <div className="cta-row home-pair">
          {rsvp.length > 0
            ? rsvp.map((r, i) => <a key={r.href} className={`btn ${i === 0 ? "btn-solid" : "btn-ghost"}`} href={r.href} target="_blank" rel="noreferrer">{r.label}</a>)
            : <><a className="btn btn-solid" href={scheduled ? deckHref : DISCORD} target={scheduled ? undefined : "_blank"} rel={scheduled ? undefined : "noreferrer"}>{scheduled ? "Open the deck" : "Get the date in Discord"}</a>{!scheduled && <a className="btn btn-ghost" href={deckHref}>Preview the deck</a>}</>}
        </div>
        <div className="talk-board">
          <DepartureBoard
            scene="launch"
            label={ended ? "This talk has ended" : scheduled ? "The night" : "Coming soon"}
            status={ended ? "Slides and prompts below" : scheduled ? "Free · In person" : "Date to be announced"}
            date={{ big: dateBig, small: scheduled ? `${weekday} · ${talk.timeLabel}` : "Wednesday nights · 5:30 PM" }}
            title={`${talk.venue}, Phoenix`}
            meta={`${talk.address.replace(/, Phoenix AZ \d+$/, "")} · ${talk.parking}`}
            figure={ended || !scheduled ? null : { big: String(days), small: days === 1 ? "day to go" : "days to go" }}
            action={ended ? { href: deckHref, label: "Open the deck" } : scheduled ? { href: rsvp[0].href, label: "Save your seat" } : { href: DISCORD, label: "Get notified" }}
          />
        </div>
      </section>

      <section className="section talk-section" aria-labelledby="night-title">
        <div className="section-head">
          <h2 id="night-title">How the night <span className="key">runs.</span></h2>
          <p className="section-lede">{talk.stepsLede ?? "Twenty minutes of AI news, one live build, then five-minute demos from the room."}</p>
        </div>
        <ol className="talk-steps">
          {(talk.steps || []).map((st, i) => <li key={st.title}><span>{String(i + 1).padStart(2, "0")}</span><h3>{st.title}</h3><p>{st.body}</p></li>)}
        </ol>
      </section>

      <section className="section talk-section" aria-labelledby="deck-title">
        <div className="section-head">
          <h2 id="deck-title">The <span className="key">deck.</span></h2>
          <p className="section-lede">Every slide from the night, free to share. Open it full size to step through.</p>
        </div>
        <div className="kit-deck talk-deck">
          <div className="kit-deck-head"><span>{talk.eventTitle} · slides</span><a href={deckHref}>Open full size →</a></div>
          <a className="kit-deck-frame talk-deck-link" href={deckHref} aria-label={`Open the ${talk.eventTitle} deck`}><iframe src={deckHref} title={`${talk.eventTitle} slides`} loading="lazy" tabIndex={-1} aria-hidden="true" /></a>
        </div>
      </section>

      {talk.example && <section className="section talk-section" aria-labelledby="example-title">
        <div className="section-head">
          <h2 id="example-title">{talk.example.heading?.[0] ?? "Tonight's"} <span className="key">{talk.example.heading?.[1] ?? "example."}</span></h2>
          <p className="section-lede">{talk.example.lede ?? "The app we build on the night, from a one-page spec. Start from it, or write your own with the interview prompt."}</p>
        </div>
        <div className="window talk-example">
          <div className="window-bar"><b>{talk.example.file ?? "SPEC.md"}</b><span>{talk.example.name}</span></div>
          <div className="talk-example-body">
            <div className="talk-example-main">
              <h3>{talk.example.name}</h3>
              <p className="talk-example-pitch">{talk.example.pitch}</p>
              <p className="talk-example-job"><span>{talk.example.jobLabel ?? "The one job"}</span>{talk.example.job}</p>
              <ul className="talk-example-stack">{talk.example.stack.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
            <div className="talk-example-done">
              <span>{talk.example.doneLabel ?? "Done when"}</span>
              <ul>{talk.example.done.map((d) => <li key={d}>{d}</li>)}</ul>
            </div>
          </div>
          <div className="talk-example-copy">
            {talk.example.spec && <WorkshopPrompt prompt={talk.example.spec} label={talk.example.specLabel ?? "The full spec"} destination={talk.example.specDestination ?? "a SPEC.md file"} />}
          </div>
        </div>
      </section>}

      {prompts.length > 0 && <section className="section talk-section" aria-labelledby="prompt-title">
        <div className="section-head">
          <h2 id="prompt-title">The <span className="key">prompts.</span></h2>
          <p className="section-lede">Every prompt from the deck, in order. Open one, copy it, paste it into Claude Code, Codex or any coding agent.</p>
        </div>
        <ol className="talk-prompts">
          {prompts.map((p, i) => <li key={p.label}>
            <span className="talk-prompt-n">{String(i + 1).padStart(2, "0")}</span>
            <WorkshopPrompt prompt={p.prompt} label={p.title} destination="Claude Code" />
          </li>)}
        </ol>
      </section>}

      {talk.tools?.length > 0 && <section className="section talk-section" aria-labelledby="tools-title">
        <div className="section-head">
          <h2 id="tools-title">The <span className="key">toolkit.</span></h2>
          <p className="section-lede">{talk.toolsLede ?? "Everything we use on the night, one job each."}</p>
        </div>
        <ul className="talk-tools">
          {talk.tools.map((tool) => <li key={tool.name}>
            <h3><a href={tool.href} target="_blank" rel="noreferrer">{tool.name} <span aria-hidden="true">↗</span></a></h3>
            <p>{tool.job}</p>
            <code>{tool.cmd}</code>
          </li>)}
        </ul>
      </section>}

      <section className="band" aria-labelledby="talk-final-title">
        <div className="final">
          <h2 id="talk-final-title">{talk.closing?.[0] ?? "Bring an idea."} <span className="key">{talk.closing?.[1] ?? "Leave with a live app."}</span></h2>
          <p className="lede">{ended ? "This one has happened. The slides and prompts stay up, and the next talk is posted in the Discord." : scheduled ? `${talk.dateLabel} · ${talk.timeLabel} · ${talk.venue}. Free, and open to anyone building with AI.` : "Date to be announced. Dates go out in the Discord first."}</p>
          <div className="cta-row home-pair">
            {rsvp[0] && <a className="btn btn-solid" href={rsvp[0].href} target="_blank" rel="noreferrer">{rsvp[0].label}</a>}
            <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a>
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
