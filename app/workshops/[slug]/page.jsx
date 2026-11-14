import SiteHeader from "../../../components/site-header";
import SiteFooter from "../../../components/site-footer";
import WorkshopInstructors from "../../../components/workshop-instructors";
import WorkshopBar from "../../../components/workshop-bar";
import { SheetHero, SheetBoard, SheetSection, SheetColumns, SheetAccordion, SheetAgenda, SheetRoute } from "../../../components/workshop-sheet";
import { workshopMetadata, workshopCourseSchema } from "../../../lib/workshop-seo";
import { workshopMedia } from "../../../lib/workshop-media";
import { notFound } from "next/navigation";
import { siDiscord } from "simple-icons";
import { WORKSHOP_PRESENTATION } from "../../../lib/workshop-presentation";
import { UPCOMING_WORKSHOPS, workshopBySlug } from "../../../lib/workshops";
import { titleCase } from "../../../lib/title-case";
import { JsonLd } from "../../../components/article";
import "../vibe-coding-gtm/workshop.css";
import "../../hub.css";

export const dynamic = "force-dynamic";

const DISCORD = "https://discord.gg/kZSJMNveYM";

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
  const media = await workshopMedia(workshop.slug);
  const format = workshop.duration || "Hands-on workshop";
  const multiDay = !!workshop.duration && (workshop.days || 2) > 1;

  const fit = [
    ["A good fit for", workshop.audience],
    ["What to bring", workshop.prerequisite],
    ["Included", "A blueprint to build from, expert guidance while you build, and recordings and materials emailed afterward."],
  ];
  if (multiDay) fit.push(["A review after the lab", workshop.followupText || "One shared 60-minute implementation-review session within 30 days. Bring your test results and next-step questions."]);

  const faqs = [
    ...(workshop.extraFaqs || []).map((faq) => [faq.question, faq.answer]),
    ["Which tools and accounts do I need?", workshop.toolAnswer],
    ["Are software subscriptions included?", workshop.costAnswer || "AI tool subscriptions and other software costs are separate from your workshop ticket. Use your preferred supported tools; we’ll have sample-data exercises where a live connection is unavailable."],
    ["When and where will it take place?", `This is ${workshop.duration ? `a ${workshop.duration.toLowerCase()}` : "a hands-on workshop"} capped at ${workshop.capacity} attendees. The date, daily schedule, and venue will be announced before paid registration opens.`],
    ["What is the refund policy?", "Once paid registration opens, tickets will be refundable until the day of the event. If the event is cancelled, you will receive a full refund. Email hi@shipai.club with questions."],
  ].map(([question, answer]) => [titleCase(question), answer]);

  return <>
    <JsonLd data={workshopCourseSchema(workshop)} />
    <SiteHeader current="/workshops" />
    <main className="ws-page">
      <SheetHero heading={workshop.heading} promise={workshop.promise} description={workshop.description} />
      <SheetBoard slug={workshop.slug} name={workshop.name} price={workshop.price} capacity={workshop.capacity} format={format} coverUrl={media.coverUrl} />

      <SheetSection id="outcomes" title={titleCase(presentation.outcomeTitle)}>
        <SheetColumns items={workshop.outcomes.map((outcome, index) => [titleCase(presentation.labels[index]), outcome])} />
      </SheetSection>

      {workshop.agenda ? (
        <SheetSection id="curriculum" title={<>Build The Pipeline. <span className="key">Prove The Handoff.</span></>}>
          <SheetAgenda agenda={workshop.agenda} />
        </SheetSection>
      ) : (
        <SheetSection id="curriculum" title={<>Your Build <span className="key">Plan.</span></>}>
          <SheetAccordion items={workshop.topics.map((topic) => [titleCase(topic.title), topic.text])} openFirst />
        </SheetSection>
      )}

      {workshop.deliverables && (
        <SheetSection id="kit" title={<>Files You Can <span className="key">Put To Work.</span></>} lede={workshop.kitIntro || "Fill these blueprints with your own brand, then use them in a supported tool and review the results."}>
          <SheetColumns className="ws-kit" items={workshop.deliverables.map((file) => [file.name, file.text])} />
        </SheetSection>
      )}

      {media.facilitators.length > 0 && (
        <section className="section ws-section"><WorkshopInstructors slug={workshop.slug} /></section>
      )}

      <SheetSection id="prepare" title={<>Is This Your <span className="key">Next Step?</span></>}>
        <SheetColumns items={fit} />
      </SheetSection>

      {workshop.references && (
        <SheetSection id="stack" title={<>Tools For Each Stage <span className="key">Of Delivery.</span></>} lede={workshop.stackExplanation || "Linear tracks the work; Sandbox provides an isolated execution environment; Workflow SDK coordinates durable steps; AI SDK connects model calls and tools. GitHub holds the code and draft PR. This is an independent Ship AI workshop."}>
          <ul className="ws-links">{workshop.references.map((reference) => <li key={reference.url}><a className="link" href={reference.url}>{reference.name} ↗</a></li>)}</ul>
        </SheetSection>
      )}

      <SheetSection id="faq" title={<>A Few Things <span className="key">To Know.</span></>}>
        <SheetAccordion items={faqs} />
        <p className="hub-note">Something else on your mind? <a className="link" href="mailto:hi@shipai.club">Ask us.</a></p>
      </SheetSection>

      <SheetRoute slug={workshop.slug} />
    </main>
    <WorkshopBar title={titleCase(presentation.title || workshop.name)} meta={["$" + workshop.price.toLocaleString("en-US"), `Up to ${workshop.capacity} seats`, "Date to be announced"].join(" · ")} />
    <SiteFooter />
  </>;
}
