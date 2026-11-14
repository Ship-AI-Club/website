import SiteHeader from "../../components/site-header";
import SiteFooter from "../../components/site-footer";
import { TALKS, talkEnded } from "../../lib/talks";
import { ogImage } from "../../lib/og";
import "./talks.css";

export const metadata = {
  title: "Talks - Ship AI",
  description: "One-night Ship AI talks in Phoenix. A live build on screen, with the prompts, the tools and the deck published free.",
  alternates: { canonical: "https://www.shipai.club/talks" },
  openGraph: {
    title: "Talks - Ship AI",
    description: "One night, one live build, everything published free.",
    url: "https://www.shipai.club/talks",
    siteName: "Ship AI",
    images: [ogImage({ kicker: "Talks", title: "One night, one live build.", key: "one live build.", tagline: "The prompts, the tools and the deck, published free." })],
  },
};

export const revalidate = 3600;

function TalkRow({ talk }) {
  return <li className="row">
    <div>
      <p className="row-title"><a href={`/talks/${talk.slug}`}>{talk.eventTitle}</a></p>
      <p className="meta">{talk.dateLabel} · {talk.timeLabel} · {talk.venue}</p>
      <p>{talk.summary}</p>
    </div>
    <div className="row-side">
      <a className="btn btn-ghost btn-sm" href={`/talks/${talk.slug}/deck`}>Slides</a>
    </div>
  </li>;
}

export default function Page() {
  const sorted = [...TALKS].sort((a, b) => a.startISO.localeCompare(b.startISO));
  const upcoming = sorted.filter((t) => !talkEnded(t));
  const past = sorted.filter((t) => talkEnded(t)).reverse();
  return <>
    <SiteHeader current="/talks" />
    <main className="talks-page">
      <section className="hero" aria-labelledby="talks-title">
        <p className="eyebrow">Ship AI · Talks</p>
        <h1 className="hero-h1" id="talks-title">One night, <span className="key">one live build.</span></h1>
        <p className="hero-lede">Standalone nights, no series to keep up with. Watch it get built on screen, then take the prompts, the tools and the deck home.</p>
      </section>
      {upcoming.length > 0 && <section className="section" aria-labelledby="upcoming-title">
        <div className="section-head"><h2 id="upcoming-title">Coming up.</h2></div>
        <ol className="rows talks-list">{upcoming.map((talk) => <TalkRow key={talk.slug} talk={talk} />)}</ol>
      </section>}
      {past.length > 0 && <section className="section" aria-labelledby="past-title">
        <div className="section-head"><h2 id="past-title">Past talks.</h2><p className="section-lede">The slides and prompts stay up.</p></div>
        <ol className="rows talks-list">{past.map((talk) => <TalkRow key={talk.slug} talk={talk} />)}</ol>
      </section>}
    </main>
    <SiteFooter />
  </>;
}
