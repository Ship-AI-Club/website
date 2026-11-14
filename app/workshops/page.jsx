import SiteHeader from "../../components/site-header";
import { publicWorkshopMetadata, workshopCatalogueSchema } from "../../lib/workshop-seo";
import { JsonLd } from "../../components/article";
import { AI_ORGANIZATION_EVENT as ORG } from "../../lib/ai-organization-event";
import { VIBE_GTM } from "../../lib/vibe-gtm-workshop";
import "./catalogue.css";
import "./assessment.css";
import "../hub.css";
import { siDiscord } from "simple-icons";
import WorkshopContents from "../../components/workshop-contents";
import DepartureBoard from "../../components/departure-board";
import { WORKSHOP_PRESENTATION, WORKSHOP_GROUPS } from "../../lib/workshop-presentation";
import { UPCOMING_WORKSHOPS } from "../../lib/workshops";
import SiteFooter from "../../components/site-footer";

export const dynamic = "force-dynamic";
export async function generateMetadata() { return publicWorkshopMetadata({ title: "Hands-on AI Workshops: Engineering & Business | Ship AI", description: "Explore Ship AI workshops in Phoenix and upcoming build labs for AI agents, software factories, sales, marketing, support, and business intelligence." }); }

const DISCORD = "https://discord.gg/kZSJMNveYM";

export default function Workshops() {
  const now = Date.now();
  const ended = now >= new Date(VIBE_GTM.end).getTime();
  const orgOpen = now < new Date(ORG.end).getTime();

  /* Cheapest first inside each topic, so the list reads as a ladder. */
  const groups = WORKSHOP_GROUPS.map((group) => ({
    id: group.id,
    title: group.title,
    items: UPCOMING_WORKSHOPS.filter((workshop) => group.slugs.includes(workshop.slug))
      .sort((a, b) => a.price - b.price)
      .map((workshop) => ({
        slug: workshop.slug,
        title: WORKSHOP_PRESENTATION[workshop.slug]?.title || workshop.name,
        text: WORKSHOP_PRESENTATION[workshop.slug]?.text || workshop.promise,
        price: workshop.price,
        capacity: workshop.capacity,
        format: workshop.duration || "Hands-on workshop",
      })),
  })).filter((group) => group.items.length > 0);
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);

  return <>
    <JsonLd data={workshopCatalogueSchema([...(ended ? [] : [{slug:"vibe-coding-gtm",name:VIBE_GTM.name}]), ORG, ...UPCOMING_WORKSHOPS])} />
    <SiteHeader current="/workshops" />
    <main className="wc-catalogue">
      <section className="hero" aria-labelledby="workshops-title">
        <h1 className="hero-h1" id="workshops-title">Build the next part <span className="key">of your business.</span></h1>
        <p className="hero-lede">From your first agent to a company-wide AI system. Find a focused workshop, build with guidance, and take the blueprint home.</p>
        <div className="cta-row hub-pair"><a className="btn btn-solid" href="#workshop-library">Find your workshop</a><a className="btn btn-ghost" href="/workshops/assessment">Take the one-minute assessment</a></div>
      </section>

      {orgOpen && (
        <DepartureBoard
          id="scheduled-events"
          scene="fleet"
          label="On the calendar"
          status="Waitlist open"
          date={{ big: "Feb 19–20", small: "2027 · Phoenix" }}
          title={ORG.name}
          meta={["Two days", "9 AM–5 PM", "50 seats"].join(" · ")}
          figure={{ big: "$" + ORG.price.toLocaleString("en-US"), small: "per attendee" }}
          action={{ href: "/workshops/" + ORG.slug, label: "See the event" }}
        />
      )}

      <section className="section hub-list" id="workshop-library" aria-labelledby="library-title">
        <div className="section-head"><h2 id="library-title">What do you want <span className="key">to build?</span></h2><p className="section-lede">No dates yet. Leave an email on any workshop and we&apos;ll send its date. Prices are in USD, per attendee.</p></div>
        <WorkshopContents total={total} groups={groups} />
      </section>

      <section className="section" aria-labelledby="workshop-benefits-title">
        <div className="section-head"><h2 id="workshop-benefits-title">A head start. <span className="key">And a way forward.</span></h2><p className="section-lede">In every workshop.</p></div>
        <ul className="hub-three">
          <li><h3>Preloaded blueprints</h3><p>Codebases with skills and best practices, designed to eliminate 80% of the friction.</p></li>
          <li><h3>Expert guidance</h3><p>Build your project with hands-on support and feedback.</p></li>
          <li><h3>Yours to revisit</h3><p>Recordings and all workshop materials emailed afterward.</p></li>
        </ul>
        <p className="hub-note">Looking for a longer learning path? <a href="/programs" className="link">Explore our programs</a></p>
      </section>
    </main>
    <SiteFooter />
  </>;
}
