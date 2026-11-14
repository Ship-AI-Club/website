import { notFound } from "next/navigation";
import SiteHeader from "../../../components/site-header";
import SiteFooter from "../../../components/site-footer";
import { JsonLd } from "../../../components/article";
import WorkshopPrompt from "../../../components/workshop-prompt.jsx";
import { TALKS, talkBySlug, talkPrompts, talkEnded } from "../../../lib/talks";
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
    title: `${talk.eventTitle} - Ship AI`,
    description: `${talk.summary} ${talk.copy} ${talk.dateLabel}, ${talk.venue}, Phoenix. Free.`.slice(0, 300),
    alternates: { canonical: url },
    openGraph: { title: talk.eventTitle, description: talk.summary, url, siteName: "Ship AI", images: [ogImage({ kicker: "Talks", title: talk.eventTitle, key: talk.key, tagline: talk.summary, meta: `${talk.dateLabel} · Free` })] },
  };
}

function eventSchema(talk) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: talk.eventTitle,
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

export default async function Page({ params }) {
  const { slug } = await params;
  const talk = talkBySlug(slug);
  if (!talk) notFound();
  const [lead, ...rest] = talk.eventTitle.split(talk.key);
  const ended = talkEnded(talk);
  const rsvp = ended ? [] : talk.rsvp.length ? talk.rsvp : [{ label: "RSVP on Luma", href: LUMA }];
  const prompts = talkPrompts(talk);
  const deckHref = `/talks/${talk.slug}/deck`;

  return <>
    <JsonLd data={eventSchema(talk)} />
    <SiteHeader current="/talks" />
    <main className="talks-page">
      <section className="hero" aria-labelledby="talk-title">
        <p className="eyebrow">Ship AI · Talks</p>
        <h1 className="hero-h1" id="talk-title">{lead}<span className="key">{talk.key}</span>{rest.join(talk.key)}</h1>
        <p className="hero-lede">{talk.summary} {talk.copy}</p>
        <div className="cta-row">
          {rsvp.map((r, i) => <a key={r.href} className={`btn ${i === 0 ? "btn-solid" : "btn-ghost"}`} href={r.href} target="_blank" rel="noreferrer">{r.label}</a>)}
          <a className={`btn ${rsvp.length ? "btn-ghost" : "btn-solid"}`} href={deckHref}>Open the deck</a>
        </div>
        <p className="talk-meta">
          <span>{talk.dateLabel}</span>
          <span>{talk.timeLabel}</span>
          <span>{talk.venue} - {talk.address}</span>
          <span>{talk.parking}</span>
          <span>{ended ? "This talk has ended" : "Free"}</span>
        </p>
      </section>

      {prompts.length > 0 && <section className="section" aria-labelledby="prompt-title">
        <div className="section-head">
          <h2 id="prompt-title">The <span className="key">prompts.</span></h2>
          <p className="section-lede">Every prompt from the deck, in order. Copy each one into Claude Code, Codex or any coding agent.</p>
        </div>
        <div className="talk-prompts">
          {prompts.map((p, i) => <WorkshopPrompt key={p.label} prompt={p.prompt} label={`${String(i + 1).padStart(2, "0")} · ${p.title}`} destination="Claude Code" defaultOpen={i === 0} />)}
        </div>
      </section>}

      {talk.tools?.length > 0 && <section className="section" aria-labelledby="tools-title">
        <div className="section-head">
          <h2 id="tools-title">The <span className="key">toolkit.</span></h2>
          <p className="section-lede">Everything we use on the night, one job each.</p>
        </div>
        <ol className="rows">
          {talk.tools.map((tool) => <li key={tool.name} className="row">
            <div>
              <p className="row-title"><a href={tool.href} target="_blank" rel="noreferrer">{tool.name}</a></p>
              <p className="meta">{tool.job}</p>
              <code className="talk-cmd">{tool.cmd}</code>
            </div>
          </li>)}
        </ol>
      </section>}

      <section className="section" aria-labelledby="deck-title">
        <div className="section-head">
          <h2 id="deck-title">The <span className="key">deck.</span></h2>
          <p className="section-lede">The slides from the night, free to share.</p>
        </div>
        <div className="kit-deck">
          <div className="kit-deck-head"><span>Preview</span><a href={deckHref}>Open full size →</a></div>
          <div className="kit-deck-frame"><iframe src={deckHref} title={`${talk.eventTitle} slides`} loading="lazy" /></div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
