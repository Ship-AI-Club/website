import MobileNav from "../../components/mobile-nav";
import { titleCase } from "../../lib/title-case";
import { publicWorkshopMetadata, workshopCatalogueSchema } from "../../lib/workshop-seo";
import { JsonLd } from "../../components/article";
import { ArrowRight, CalendarDays, MapPin, Coffee, Layers, Video, Users } from "lucide-react";
import { AI_ORGANIZATION_EVENT as ORG } from "../../lib/ai-organization-event";
import { VIBE_GTM, workshopPrice } from "../../lib/vibe-gtm-workshop";
import "./vibe-coding-gtm/workshop.css";
import "./catalogue.css";
import "./assessment.css";
import WorkshopLibrary from "../../components/workshop-library";
import WorkshopArt from "../../components/workshop-art";
import { WORKSHOP_PRESENTATION, WORKSHOP_GROUPS } from "../../lib/workshop-presentation";
import { UPCOMING_WORKSHOPS } from "../../lib/workshops";
import SiteFooter from "../../components/site-footer";

export const dynamic = "force-dynamic";
export async function generateMetadata() { return publicWorkshopMetadata({ title: "Hands-on AI Workshops: Engineering & Business | Ship AI", description: "Explore Ship AI workshops in Phoenix and upcoming build labs for AI agents, software factories, sales, marketing, support, and business intelligence." }); }

export default function Workshops() {
  const price = workshopPrice();
  const ended = Date.now() >= new Date(VIBE_GTM.end).getTime();
  return <>
    <JsonLd data={workshopCatalogueSchema([{slug:"vibe-coding-gtm",name:VIBE_GTM.name}, ORG, ...UPCOMING_WORKSHOPS])} />
    <header className="nav">
      <a href="/" className="brand"><img src="/logo-mark.png" alt="" width={26} height={26} /><span>Ship AI</span></a>
      <nav><a href="/workshops" aria-current="page">Workshops</a><a href="/programs">Programs</a><a href="/about">About</a></nav>
      <a className="btn btn-solid nav-cta" href="/dashboard">Account</a>
    <MobileNav /></header>
    <main className="wc-catalogue">
      <div className="wc-heading wc-library-hero"><div><p className="kicker">Ship AI · Guided Build Labs</p><h1>Build The Next<br /><span>Part Of Your Business.</span></h1><p>From your first agent to a company-wide AI system. Find a focused workshop, build with guidance, and take the blueprint home.</p><a className="btn btn-solid" href="#workshop-library">Find your workshop <ArrowRight size={16} aria-hidden="true" /></a></div><aside className="wc-pathfinder" aria-label="Workshop paths"><p className="kicker">Choose Your Next Move</p><a href="/workshops/your-first-agent"><span>Start With One Workflow</span><small>Agents · Brand · Engineering</small><ArrowRight size={17} aria-hidden="true" /></a><a href="/workshops/company-knowledge-engine"><span>Build A Business System</span><small>Revenue · Knowledge · Delivery</small><ArrowRight size={17} aria-hidden="true" /></a><a href={`/workshops/${ORG.slug}`}><span>Bring The Teams Together</span><small>Two-Day AI Business Event</small><ArrowRight size={17} aria-hidden="true" /></a></aside></div>
      <section className="wa-catalogue-invite" aria-labelledby="assessment-invite-title"><div><h2 id="assessment-invite-title">Not Sure Where To Start?</h2><p>Find your first workshop with a one-minute AI assessment.</p></div><a className="btn btn-solid" href="/workshops/assessment">Find my workshop <ArrowRight size={16} aria-hidden="true" /></a></section>
      <div className="wc-scheduled-heading" id="scheduled-events"><p className="kicker">On The Calendar</p><h2>Meet Us In The Build Room.</h2></div>
      <div className="wc-scheduled-grid">
      <section className="wc-feature-section" aria-labelledby="next-workshop-title">
        <div className="wc-section-heading"><h2 id="next-workshop-title">{titleCase(ended ? "Past workshop" : "Next in Phoenix")}</h2><span>Hands-on · In person</span></div>
        <article className="wc-card wc-feature">
          <a className="wc-art-link" href={VIBE_GTM.path} aria-label={`Explore ${VIBE_GTM.name}`}><WorkshopArt slug="vibe-coding-gtm" label="Design → Launch" /></a>
          <div className="wc-card-body">
            <div className="wc-status-row"><span className="wc-category">Design &amp; go to market</span>{!ended && <span className="wc-seat-badge">Only {VIBE_GTM.capacity} seats</span>}</div>
            <h3><a href={VIBE_GTM.path}>{VIBE_GTM.name}</a></h3>
            <p>{VIBE_GTM.description}</p>
            <ul className="wc-facts"><li><CalendarDays size={16} aria-hidden="true" />October 10, 2026 · 9 AM–1 PM MST</li><li><MapPin size={16} aria-hidden="true" />{VIBE_GTM.venue}</li><li><Coffee size={16} aria-hidden="true" />Coffee, breakfast &amp; lunch included</li></ul>
            <div className="wc-card-bottom"><div>{ended ? <strong>Workshop ended</strong> : <><p className="wc-price">{price.promotional && <del>$999</del>}<strong>${price.amount}</strong></p><span>{price.promotional ? "Offer ends October 7, 11:59 PM MST" : "Workshop admission"}</span></>}</div><a className="btn btn-solid" href={VIBE_GTM.path}>{ended ? "View workshop" : "Details & tickets"}<ArrowRight size={16} aria-hidden="true" /></a></div>
          </div>
        </article>
      </section>
      <section className="wc-feature-section" aria-labelledby="organization-event-title">
        <div className="wc-section-heading"><h2 id="organization-event-title">Build Across Your Organization</h2><span>Two-day executive build lab</span></div>
        <article className="wc-card wc-feature"><a className="wc-art-link" href={`/workshops/${ORG.slug}`} aria-label={`Explore ${ORG.name}`}><WorkshopArt slug={ORG.slug} label="Six teams. One organization." /></a><div className="wc-card-body"><div className="wc-status-row"><span className="wc-category">Strategy + guided build labs</span><span className="wc-seat-badge">{ORG.capacity} attendees total</span></div><h3><a href={`/workshops/${ORG.slug}`}>{ORG.name}</a></h3><p>{ORG.promise}</p><ul className="wc-facts"><li><CalendarDays size={16} aria-hidden="true" />{ORG.dateLabel} · 9 AM–5 PM each day</li><li><MapPin size={16} aria-hidden="true" />Phoenix time · Venue to be announced</li></ul><div className="wc-card-bottom"><div><p className="wc-price"><strong>From $2,499</strong></p><span>Per attendee · Both days included</span></div><a className="btn btn-solid" href={`/workshops/${ORG.slug}`}>Explore event<ArrowRight size={16} aria-hidden="true" /></a></div></div></article>
      </section>
      </div>
      <WorkshopLibrary workshops={UPCOMING_WORKSHOPS} presentations={WORKSHOP_PRESENTATION} groups={WORKSHOP_GROUPS} />
      <section className="wc-included" aria-labelledby="workshop-benefits-title"><div><p className="kicker">In Every Workshop</p><h2 id="workshop-benefits-title">A Head Start.<br />And A Way Forward.</h2></div><div className="wc-included-items"><div><Layers size={22} aria-hidden="true" /><h3>Preloaded Blueprints</h3><p>Codebases with skills and best practices, designed to eliminate 80% of the friction.</p></div><div><Users size={22} aria-hidden="true" /><h3>Expert Guidance</h3><p>Build your project with hands-on support and feedback.</p></div><div><Video size={22} aria-hidden="true" /><h3>Yours To Revisit</h3><p>Recordings and all workshop materials emailed afterward.</p></div></div></section>
      <p className="wc-program-note">Looking for a longer learning path? <a href="/programs">Explore our programs <ArrowRight size={14} aria-hidden="true" /></a></p>
    </main>
    <SiteFooter />
  </>;
}
