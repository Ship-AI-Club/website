import SiteHeader from "../../components/site-header";
import SiteFooter from "../../components/site-footer";
import Scene from "../../components/scene";
import DepartureBoard from "../../components/departure-board";
import { JsonLd, faqSchema } from "../../components/article";
import { SOCRATIC as S } from "../../lib/socratic";
import { DISCORD } from "../../lib/hackathon";
import { ogImage } from "../../lib/og";
import "../talks/talks.css";

const URL = "https://www.shipai.club/socratic-night";

export const metadata = {
  title: "Socratic Night - Ship AI",
  description: `${S.summary} ${S.copy} Monthly at ${S.venue}, Phoenix. Free.`,
  alternates: { canonical: URL },
  openGraph: {
    title: "Socratic Night",
    description: S.summary,
    url: URL,
    siteName: "Ship AI",
    images: [ogImage({ kicker: "Every month", title: "Socratic Night", key: "Night", tagline: S.summary, meta: "Monthly · Free" })],
  },
};

const pad = (n) => String(n).padStart(2, "0");

export default function Page() {
  return <>
    <JsonLd data={faqSchema(S.faqs)} />
    <SiteHeader current="/talks" />
    <main className="talk-page">
      <section className="hero talk-hero" aria-labelledby="sn-title">
        <p className="eyebrow">Ship AI · Every month · Free</p>
        <h1 className="hero-h1" id="sn-title">Socratic <span className="key">Night.</span></h1>
        <p className="hero-lede">{S.summary} {S.copy}</p>
        <div className="cta-row home-pair">
          <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Get the next date</a>
          <a className="btn btn-ghost" href={S.topicHref} target="_blank" rel="noreferrer">Propose a topic</a>
        </div>
        <div className="talk-board">
          <DepartureBoard
            scene="harbor"
            label="Every month"
            status="Free · In person"
            date={{ big: S.cadence, small: S.when }}
            title={`${S.venue}, Phoenix`}
            meta={`${S.address.replace(/, Phoenix AZ \d+$/, "")} · ${S.parking}`}
            action={{ href: DISCORD, label: "Get notified" }}
          />
        </div>
      </section>

      <section className="section talk-section" aria-labelledby="sn-run-title">
        <div className="section-head">
          <h2 id="sn-run-title">How the night <span className="key">runs.</span></h2>
          <p className="section-lede">Same spine every month. The room decides what goes in the middle.</p>
        </div>
        <ol className="talk-steps">
          {S.steps.map((st, i) => <li key={st.title}><span>{pad(i + 1)}</span><h3>{st.title}</h3><p>{st.body}</p></li>)}
        </ol>
      </section>

      <section className="section talk-section" aria-labelledby="sn-cat-title">
        <div className="section-head">
          <h2 id="sn-cat-title">The <span className="key">categories.</span></h2>
          <p className="section-lede">Bring something for any of them, or just come and ask questions.</p>
        </div>
        <ul className="sn-cats">
          {S.categories.map((c, i) => <li key={c.name} className="card">
            <span>{pad(i + 1)}</span>
            <h3>{c.name}</h3>
            <p>{c.line}</p>
          </li>)}
        </ul>
        <p className="sn-propose">Have a topic? <a href={S.topicHref} target="_blank" rel="noreferrer">Propose it on GitHub</a> or drop it in the <a href={DISCORD} target="_blank" rel="noreferrer">Discord</a>.</p>
      </section>

      <section className="section talk-section" aria-labelledby="sn-faq-title">
        <div className="section-head">
          <h2 id="sn-faq-title">Good <span className="key">questions.</span></h2>
        </div>
        <div className="sn-faq">
          {S.faqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
        </div>
      </section>

      <section className="band" aria-labelledby="sn-final-title">
        <div className="final">
          <h2 id="sn-final-title">Bring a question. <span className="key">Bring receipts.</span></h2>
          <p className="lede">{S.when} at {S.venue}, Phoenix. Free, and dates go out in the Discord first.</p>
          <div className="cta-row home-pair">
            <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a>
            <a className="btn btn-ghost" href="/talks">See the talks</a>
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
