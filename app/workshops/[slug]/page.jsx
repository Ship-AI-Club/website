import WorkshopInstructors from "../../../components/workshop-instructors";
import WorkshopPathway from "../../../components/workshop-pathway";
import { workshopMetadata, workshopCourseSchema } from "../../../lib/workshop-seo";
import { notFound } from "next/navigation";
import { CalendarDays, Laptop, Users } from "lucide-react";
import { WORKSHOP_PRESENTATION } from "../../../lib/workshop-presentation";
import { UPCOMING_WORKSHOPS, workshopBySlug } from "../../../lib/workshops";
import { WorkshopNav, WorkshopHero, WorkshopOutcomes, WorkshopCurriculum, WorkshopAgenda, WorkshopPreparation, WorkshopIncludes, WorkshopFaq, WorkshopBooking } from "../../../components/workshop-detail";
import SiteFooter from "../../../components/site-footer";
import WaitlistForm from "../../programs/[program]/waitlist-form";
import { JsonLd } from "../../../components/article";
import "../vibe-coding-gtm/workshop.css";
import "../catalogue.css";
import "../detail.css";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return UPCOMING_WORKSHOPS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const workshop = workshopBySlug((await params).slug);
  if (!workshop) return {};
  return workshopMetadata(workshop);
}

export default async function Workshop({ params }) {
  const workshop = workshopBySlug((await params).slug);
  if (!workshop) notFound();
  const presentation = WORKSHOP_PRESENTATION[workshop.slug];
  const faqs = [
    ...(workshop.extraFaqs || []),
    { question: "When and where will it take place?", answer: `This is ${workshop.duration ? `a ${workshop.duration.toLowerCase()}` : "a hands-on workshop"} capped at ${workshop.capacity} attendees. The date, daily schedule, and venue will be announced before paid registration opens. Join the free waitlist to receive the details.` },
    { question: "Which tools and accounts do I need?", answer: workshop.toolAnswer },
    { question: "Are software subscriptions included?", answer: workshop.costAnswer || "AI tool subscriptions and other software costs are separate from your workshop ticket. Use your preferred supported tools; we’ll have sample-data exercises where a live connection is unavailable." },
    { question: "Does joining the waitlist reserve a seat?", answer: "No. Waitlist signup is free. We’ll email you when the schedule and paid registration are ready, so you can decide whether to book. No payment is collected now." },
    { question: "What is the refund policy?", answer: "Once paid registration opens, tickets will be refundable until the day of the event. If the event is cancelled, you will receive a full refund. Email hi@shipai.club with questions." },
  ];
  return <>
    <JsonLd data={workshopCourseSchema(workshop)} />
    <WorkshopNav />
    <main className="wd-page">
      <WorkshopHero slug={workshop.slug} heading={workshop.heading} titleClassName={workshop.titleClassName} category={workshop.level} promise={workshop.promise} description={workshop.description} chips={[workshop.duration || "Hands-on workshop", `Up to ${workshop.capacity} attendees`, "Date TBD"]} artLabel={presentation.artLabel} href="#waitlist" cta="Join the waitlist" price={workshop.price} />
      <div className="wd-layout">
        <div className="wd-content">
          <WorkshopOutcomes title={presentation.outcomeTitle} outcomes={workshop.outcomes} labels={presentation.labels} />
          {workshop.agenda ? <WorkshopAgenda agenda={workshop.agenda} /> : <WorkshopCurriculum topics={workshop.topics} />}
          {workshop.deliverables && <section className="wd-section wd-kit" aria-labelledby="brand-kit-title"><p className="kicker">Your Take-Home Kit</p><h2 id="brand-kit-title">Files You Can Put To Work.</h2><p className="wd-section-lede">{workshop.kitIntro || "Fill these blueprints with your own brand, then use them in a supported tool and review the results."}</p><dl>{workshop.deliverables.map(file => <div key={file.name}><dt>{file.name}</dt><dd>{file.text}</dd></div>)}</dl></section>}
          <WorkshopInstructors slug={workshop.slug} />
          <WorkshopPreparation audience={workshop.audience} prerequisite={workshop.prerequisite} />
          <WorkshopIncludes followup={!!workshop.duration && (workshop.days || 2) > 1} followupText={workshop.followupText} />
          {workshop.references && <section className="wd-section wd-references"><p className="kicker">The Build Stack</p><h2>Tools For Each Stage Of Delivery.</h2><p className="wd-section-lede">{workshop.stackExplanation || "Linear tracks the work; Sandbox provides an isolated execution environment; Workflow SDK coordinates durable steps; AI SDK connects model calls and tools. GitHub holds the code and draft PR. This is an independent Ship AI workshop."}</p><ul>{workshop.references.map(reference => <li key={reference.url}><a href={reference.url}>{reference.name} ↗</a></li>)}</ul></section>}
          <WorkshopFaq faqs={faqs} />
        </div>
        <WorkshopBooking price={workshop.price} href="#waitlist" cta="Join the waitlist">
          <ul className="wd-booking-facts"><li><CalendarDays size={17} aria-hidden="true" /><span><strong>Date TBD</strong>Schedule and location to be announced.</span></li><li><Users size={17} aria-hidden="true" /><span><strong>Up to {workshop.capacity} attendees</strong>{workshop.duration || "A focused hands-on workshop"} · Small groups for build guidance.</span></li><li><Laptop size={17} aria-hidden="true" /><span><strong>Build on your own laptop</strong>Expert guidance, blueprints, recordings, and materials included.</span></li></ul>
        </WorkshopBooking>
      </div>
      <WorkshopPathway slug={workshop.slug} />
      <section id="waitlist" className="wd-waitlist" aria-labelledby="waitlist-title">
        <div className="wd-waitlist-intro"><p className="kicker">Get The Dates First</p><h2 id="waitlist-title">Make This Your<br />Next Build.</h2><p>Tell us what you want to work on. We’ll email you when the schedule and registration details are confirmed.</p><p className="wd-waitlist-note">Free to join. No payment or seat reservation yet.</p></div>
        <WaitlistForm program={workshop.slug} programName={workshop.name} compact />
      </section>
    </main>
    <SiteFooter />
  </>;
}
