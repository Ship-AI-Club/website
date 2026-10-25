import WorkshopPathway from "../../../components/workshop-pathway";
import { publicWorkshopMetadata, workshopBreadcrumbs } from "../../../lib/workshop-seo";
import { ArrowRight, CalendarDays, MapPin, Coffee } from "lucide-react";
import { JsonLd } from "../../../components/article";
import { VIBE_GTM, workshopPrice } from "../../../lib/vibe-gtm-workshop";
import "./workshop.css";
import WorkshopInstructors from "../../../components/workshop-instructors";
import { WorkshopNav, WorkshopHero, WorkshopOutcomes, WorkshopCurriculum, WorkshopPreparation, WorkshopIncludes, WorkshopFaq, WorkshopBooking } from "../../../components/workshop-detail";
import "../catalogue.css";
import "../detail.css";
import SiteFooter from "../../../components/site-footer";

export const dynamic = "force-dynamic";

const description = VIBE_GTM.description;
export async function generateMetadata() { return publicWorkshopMetadata({ slug: "vibe-coding-gtm", title: `${VIBE_GTM.name} | Ship AI`, description }); }

const topics = [
  { title: "Website Design", text: "Choose the layout, text size, and colors for your website. Use the same design across your pages." },
  { title: "Your Message", text: "Identify your customers. Explain the problem you solve. Write a clear description of your product or service." },
  { title: "Build Or Improve Your Website", text: "Use AI to build a new website or improve your current website. Make the text clear. Add contact links. Get help from the instructors." },
  { title: "Set Up Your Social Media Pages", text: "Set up your social media pages. Use the same message and design as your website. Add links to your website." },
];

export default function WorkshopPage() {
  const price = workshopPrice();
  const ended = Date.now() >= new Date(VIBE_GTM.end).getTime();
  const registrationUrl = VIBE_GTM.registrationUrl;
  const faqs = [
    { question: "Can I attend if I already have a website?", answer: "Yes. Bring your current website. Improve its text and design with help from the instructors. Make your product or service clear. Add links that help customers contact you. You can also build a new website." },
    { question: "What is the refund policy?", answer: "Tickets are refundable until the day of the event. If the event is cancelled, you will receive a full refund. For refund requests, email hi@shipai.club." },
    { question: "How do I reserve a seat?", answer: "Create or sign into your Ship AI account, then pay securely through Stripe Checkout using the Reserve your seat link. A Meetup RSVP or LinkedIn attendance alone does not reserve a workshop seat." },
    { question: "Are software, domains, and hosting included?", answer: "Your ticket covers the four-hour workshop, instructor guidance, meals, blueprints, recordings, and materials. AI tool subscriptions, domain registration, and hosting are separate." },
    { question: "Where do I go, and where should I park?", answer: `We’ll meet in person in the Executive Room at Workuity Biltmore, ${VIBE_GTM.address}. Please park in the surface lot. The workshop runs Saturday, October 10, 2026, from 9 AM to 1 PM Phoenix time (MST).` },
    { question: "How many seats are available?", answer: `The workshop is limited to ${VIBE_GTM.capacity} participants for hands-on expert guidance. Check the registration page for current availability.` },
    { question: "When does the promotional price end?", answer: price.promotional ? "Book by October 7 at 11:59 PM MST for $499, reduced from $999. The price increases to $999 at midnight on October 8." : "The promotional period has ended. Regular workshop admission is $999." },
  ];
  return <>
    <JsonLd data={{
      "@context": "https://schema.org", "@type": "EducationEvent", name: VIBE_GTM.name,
      image: ["https://www.shipai.club/api/workshops/vibe-coding-gtm/og"], description, startDate: VIBE_GTM.start, endDate: VIBE_GTM.end,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled", maximumAttendeeCapacity: VIBE_GTM.capacity,
      isAccessibleForFree: false, url: `https://www.shipai.club${VIBE_GTM.path}`,
      organizer: { "@type": "Organization", name: "Ship AI", url: "https://www.shipai.club" },
      location: { "@type": "Place", name: VIBE_GTM.venue, address: { "@type": "PostalAddress", streetAddress: "2390 E Camelback Rd, Suite 130", addressLocality: "Phoenix", addressRegion: "AZ", postalCode: "85016", addressCountry: "US" } },
      ...(registrationUrl && !ended ? { offers: { "@type": "Offer", price: price.amount, priceCurrency: "USD", url: `https://www.shipai.club${registrationUrl}`, ...(price.promotional ? { validThrough: VIBE_GTM.promotionEnds } : {}) } } : {}),
    }} />
    <JsonLd data={{ "@context": "https://schema.org", ...workshopBreadcrumbs(VIBE_GTM.name, "vibe-coding-gtm") }} />
    <WorkshopNav />
    <main className="wd-page">
      <WorkshopHero slug="vibe-coding-gtm" heading={["Build Your Website And", "Marketing Presence With AI"]} titleClassName="vg-marketing-title" materialsHref="#workshop-materials" category="Website & Social Media Workshop" promise="Help customers understand what you sell and how to contact you." description={VIBE_GTM.description} chips={["October 10, 2026 · 9 AM–1 PM MST", "In person · Phoenix", `${VIBE_GTM.capacity} seats only`]} artLabel="Design → Launch" href={!ended ? registrationUrl : null} cta="Reserve your seat" price={price.amount} />
      <section id="workshop-materials" className="vg-materials-entry" aria-labelledby="workshop-materials-title">
        <div><p className="kicker">Already registered?</p><h2 id="workshop-materials-title">Your workshop materials</h2><p>Open the slides, copy the prompts, and download the guide. Sign in with the account you used to register. Admins can access these too.</p></div>
        <div className="vg-materials-actions"><a className="btn btn-solid" href="/workshops/vibe-coding-gtm/materials/deck">Open slide deck <ArrowRight size={16} aria-hidden="true" /></a><a className="btn btn-ghost" href="/workshops/vibe-coding-gtm/materials/guide">Workshop materials <ArrowRight size={16} aria-hidden="true" /></a></div>
      </section>
      <div className="wd-layout">
        <div className="wd-content">
          <WorkshopOutcomes title="What You Will Complete" labels={["Your Message", "Your Design", "Your Website", "Your Social Media Pages"]} outcomes={["Write a clear description of your product or service for your customers.", "Choose the layout, text size, and colors for your website.", "Build a new website or improve your current website with help from the instructors.", "Set up social media pages with the same message and design as your website."]} />
          <WorkshopCurriculum topics={topics} />
          <WorkshopInstructors />
          <WorkshopPreparation audience="Founders, operators, and builders bringing a business or project to market. Bring an existing site to improve or start with a new idea." prerequisite="Some light vibe coding experience is ideal. Bring a laptop, charger, your existing site or a project idea, and access to your preferred AI building tools and social accounts. Existing copy, brand assets, and a description of your customers are useful starting points.">
            <div><h3>In The Room</h3><p>Coffee, breakfast, and lunch are provided. We’ll meet in the Executive Room at Workuity Biltmore, with space for just {VIBE_GTM.capacity} participants. Sponsored by Workuity.</p></div>
          </WorkshopPreparation>
          <WorkshopIncludes />
          <WorkshopFaq faqs={faqs} />
        </div>
        <WorkshopBooking price={price.amount} promotional={price.promotional} href={registrationUrl} cta="Reserve your seat" ended={ended} scheduled>
          {!ended && <p className="wd-seat">Only {VIBE_GTM.capacity} seats</p>}
          <p className="wd-value">$10K+ value</p>
          {price.promotional && <p className="wd-offer">Book by October 7, 11:59 PM MST.<br />Price increases to $999 on October 8.</p>}
          <ul className="wd-booking-facts"><li><CalendarDays size={17} aria-hidden="true" /><span><strong>Saturday, October 10, 2026</strong>9 AM–1 PM · Phoenix time (MST)</span></li><li><MapPin size={17} aria-hidden="true" /><span><strong>{VIBE_GTM.venue}</strong><small>{VIBE_GTM.address}</small></span></li><li><Coffee size={17} aria-hidden="true" /><span><strong>Coffee, breakfast & lunch</strong>Included with your ticket.</span></li></ul>
          <p className="wd-refund">Refundable until the day of the event. Full refund if cancelled. <a href="#faq">Details in the FAQ.</a></p>
        </WorkshopBooking>
      </div>
      <WorkshopPathway slug="vibe-coding-gtm" />
      {!ended && <div className="wd-end-cta"><p>Bring your website or your idea. Get help with your next step.</p><a className="btn btn-solid" href={registrationUrl}>Reserve your seat <ArrowRight size={16} aria-hidden="true" /></a></div>}
    </main>
    <SiteFooter />
  </>;
}
