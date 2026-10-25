import { ArrowRight } from "lucide-react";
import { UPCOMING_WORKSHOPS } from "../lib/workshops";
import { WORKSHOP_PRESENTATION } from "../lib/workshop-presentation";
import { AI_ORGANIZATION_EVENT } from "../lib/ai-organization-event";
import { VIBE_GTM } from "../lib/vibe-gtm-workshop";
import { pathwayFor } from "../lib/workshop-pathways";
import { titleCase } from "../lib/title-case";

function summary(slug) {
  if (slug === "vibe-coding-gtm") return { title: VIBE_GTM.name, text: "Build Or Improve Your Website And Social Media Pages.", price: null };
  if (slug === AI_ORGANIZATION_EVENT.slug) return { title: AI_ORGANIZATION_EVENT.name, text: "Connect Six Functions Through Two Focused Build Labs.", price: AI_ORGANIZATION_EVENT.price };
  const workshop = UPCOMING_WORKSHOPS.find(item => item.slug === slug);
  const card = WORKSHOP_PRESENTATION[slug];
  return { title: card.title, text: card.text, price: workshop.price };
}

export default function WorkshopPathway({ slug }) {
  const path = pathwayFor(slug);
  if (!path) return null;
  return <section id="pathway" className="wd-pathway" aria-labelledby="pathway-title">
    <p className="kicker">Your Workshop Pathway</p><h2 id="pathway-title">{path.title}</h2><p className="wd-section-lede">{path.description}</p><p className="wp-note"><a href="/workshops/assessment">Find your starting point with the AI assessment →</a></p><p className="wp-note">A suggested route, not a required bundle. Choose the workshops that fit your experience and project; each ticket is separate.</p>
    <ol className="wp-steps">{path.slugs.map((step,index) => { const item = summary(step);return <li key={step} className={step === slug ? "wp-current" : ""}><a href={`/workshops/${step}`} aria-current={step === slug ? "page" : undefined}><span className="wp-stage">{step === slug ? "You Are Here" : `Step ${index + 1}`}</span><h3>{titleCase(item.title)}</h3><span className="wp-price">{item.price == null ? "View Current Price" : `$${item.price.toLocaleString("en-US")} USD`} <ArrowRight size={14} aria-hidden="true" /></span></a></li>; })}</ol>
    {(path.previous || path.next) && <div className="wp-neighbors">{path.previous && <p><span>Suggested Preparation</span><a href={`/workshops/${path.previous}`}>{titleCase(summary(path.previous).title)} <ArrowRight size={14} aria-hidden="true" /></a></p>}{path.next && <p><span>Your Next Step</span><a href={`/workshops/${path.next}`}>{titleCase(summary(path.next).title)} <ArrowRight size={14} aria-hidden="true" /></a></p>}</div>}
    <h3 className="wp-related-title">Related Workshops</h3><div className="wp-related-grid">{path.related.map(related => {const item=summary(related);return <a key={related} href={`/workshops/${related}`}><h4>{titleCase(item.title)}<ArrowRight size={16} aria-hidden="true" /></h4><p>{item.text}</p></a>;})}</div>
  </section>;
}
