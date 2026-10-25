import SiteHeader from "../../components/site-header";
import { publicWorkshopMetadata, workshopCatalogueSchema } from "../../lib/workshop-seo";
import { JsonLd } from "../../components/article";
import { AI_ORGANIZATION_EVENT as ORG } from "../../lib/ai-organization-event";
import { VIBE_GTM, workshopPrice } from "../../lib/vibe-gtm-workshop";
import "./catalogue.css";
import "./assessment.css";
import WorkshopLibrary from "../../components/workshop-library";
import WorkshopCard from "../../components/workshop-card";
import { WORKSHOP_PRESENTATION, WORKSHOP_GROUPS } from "../../lib/workshop-presentation";
import { UPCOMING_WORKSHOPS } from "../../lib/workshops";
import SiteFooter from "../../components/site-footer";

export const dynamic = "force-dynamic";
export async function generateMetadata() { return publicWorkshopMetadata({ title: "Hands-on AI Workshops: Engineering & Business | Ship AI", description: "Explore Ship AI workshops in Phoenix and upcoming build labs for AI agents, software factories, sales, marketing, support, and business intelligence." }); }

const PATHS = [
  { href: "/workshops/your-first-agent", title: "Start with one workflow", meta: "Agents · Brand · Engineering" },
  { href: "/workshops/company-knowledge-engine", title: "Build a business system", meta: "Revenue · Knowledge · Delivery" },
  { href: `/workshops/${ORG.slug}`, title: "Bring the teams together", meta: "Two-day AI business event" },
];

export default function Workshops() {
  const price = workshopPrice();
  const ended = Date.now() >= new Date(VIBE_GTM.end).getTime();
  return <>
    <JsonLd data={workshopCatalogueSchema([{slug:"vibe-coding-gtm",name:VIBE_GTM.name}, ORG, ...UPCOMING_WORKSHOPS])} />
    <SiteHeader current="/workshops" />
    <main className="wc-catalogue">
      <section className="hero" aria-labelledby="workshops-title">
        <p className="eyebrow">Ship AI · Guided build labs</p>
        <h1 className="hero-h1" id="workshops-title">Build the next part <span className="key">of your business.</span></h1>
        <p className="hero-lede">From your first agent to a company-wide AI system. Find a focused workshop, build with guidance, and take the blueprint home.</p>
        <div className="cta-row"><a className="btn btn-solid" href="#workshop-library">Find your workshop</a><a className="btn btn-ghost" href="/workshops/assessment">Take the one-minute assessment</a></div>
      </section>

      <section className="section" aria-labelledby="paths-title">
        <div className="wc-paths">
          <div>
            <h2 id="paths-title">Choose your <span className="key">next move.</span></h2>
            <p className="section-lede">Three ways in, depending on where your business is.</p>
          </div>
          <ol className="rows">
            {PATHS.map(path => <li key={path.href} className="row"><div><p className="row-title"><a href={path.href}>{path.title}</a></p><p className="meta">{path.meta}</p></div><div className="row-side"><a className="btn btn-ghost btn-sm" href={path.href}>View the workshop</a></div></li>)}
          </ol>
        </div>
      </section>

      <section className="section" id="scheduled-events" aria-labelledby="scheduled-title">
        <div className="section-head"><h2 id="scheduled-title">On the calendar.</h2><p className="section-lede">Meet us in the build room.</p></div>
        <div className="cards cards-two">
          <WorkshopCard
            href={VIBE_GTM.path}
            category="Design and go-to-market"
            artLabel="Design → Launch"
            name={VIBE_GTM.name}
            summary={VIBE_GTM.description}
            meta={`October 10, 2026 · 9 AM–1 PM MST · ${VIBE_GTM.venue} · Coffee, breakfast and lunch included`}
            price={ended ? null : price.amount}
            anchor={!ended && price.promotional ? 999 : null}
            unit={ended ? "Workshop ended" : price.promotional ? "USD · offer ends October 7, 11:59 PM MST" : "USD · one-time workshop admission"}
            tag={ended ? "Workshop ended" : `Only ${VIBE_GTM.capacity} seats`}
            tagClass={ended ? "tag-tbd" : ""}
          />
          <WorkshopCard
            href={`/workshops/${ORG.slug}`}
            category="Strategy and guided build labs"
            artLabel="Six teams. One organization."
            name={ORG.name}
            summary={ORG.promise}
            meta={`${ORG.dateLabel} · 9 AM–5 PM each day · Phoenix time · Venue to be announced`}
            price={2499}
            unit="USD per attendee · both days included · from"
            tag={`${ORG.capacity} attendees total`}
            tagClass=""
          />
        </div>
      </section>

      <WorkshopLibrary workshops={UPCOMING_WORKSHOPS} presentations={WORKSHOP_PRESENTATION} groups={WORKSHOP_GROUPS} />

      <section className="section" aria-labelledby="workshop-benefits-title">
        <div className="wc-included">
          <div><h2 id="workshop-benefits-title">A head start. <span className="key">And a way forward.</span></h2><p className="section-lede">In every workshop.</p></div>
          <ol className="rows wc-included-items">
            <li className="row"><div><p className="row-title">Preloaded blueprints</p><p>Codebases with skills and best practices, designed to eliminate 80% of the friction.</p></div></li>
            <li className="row"><div><p className="row-title">Expert guidance</p><p>Build your project with hands-on support and feedback.</p></div></li>
            <li className="row"><div><p className="row-title">Yours to revisit</p><p>Recordings and all workshop materials emailed afterward.</p></div></li>
          </ol>
        </div>
        <p className="wc-program-note">Looking for a longer learning path? <a href="/programs" className="link">Explore our programs</a></p>
      </section>
    </main>
    <SiteFooter />
  </>;
}
