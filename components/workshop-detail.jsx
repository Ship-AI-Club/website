import MobileNav from "./mobile-nav";
import { titleCase } from "../lib/title-case";
import { ArrowLeft, ArrowRight, Check, Plus, Layers, Users, Video } from "lucide-react";
import WorkshopArt from "./workshop-art";
import { workshopMedia, workshopOgPath } from "../lib/workshop-media";

export function WorkshopNav() {
  return <header className="nav"><a href="/" className="brand"><img src="/logo-mark.png" alt="" width={26} height={26} /><span>Ship AI</span></a><nav><a href="/workshops">Workshops</a><a href="/programs">Programs</a><a href="/about">About</a></nav><a className="btn btn-solid nav-cta" href="/dashboard">Account</a><MobileNav /></header>;
}

export async function WorkshopHero({ slug, heading, category, promise, description, chips, artLabel, href, cta, price, titleClassName, materialsHref }) {
  const media = await workshopMedia(slug);
  return <>
    <a className="wd-back" href="/workshops"><ArrowLeft size={14} aria-hidden="true" />All Workshops</a>
    <section className="wd-hero"><div><p className="kicker">{titleCase(category)}</p><h1 className={titleClassName}>{titleCase(heading[0])}<br /><span>{titleCase(heading[1])}</span></h1><p className="wd-promise">{promise}</p><p className="wd-description">{description}</p><ul className="wd-chips">{chips.map(chip => <li key={chip}>{chip}</li>)}</ul>{href && <div className="wd-hero-action"><a className="btn btn-solid" href={href}>{cta}<ArrowRight size={16} aria-hidden="true" /></a><span>${price.toLocaleString("en-US")} USD</span></div>}</div><img className="wd-managed-cover" src={media.coverUrl || workshopOgPath(slug, media.version)} alt={`${heading.join(" ")} workshop cover`} width={1200} height={630} /></section>
    <nav className="wd-section-nav" aria-label="Workshop sections">{materialsHref && <a href={materialsHref}>Workshop materials</a>}<a href="#outcomes">What You’ll Build</a><a href="#curriculum">Build Plan</a><a href="#prepare">Who It’s For</a><a href="#faq">FAQ</a><a href="#pathway">Your Pathway</a></nav>
  </>;
}

export function WorkshopOutcomes({ title, outcomes, labels }) {
  return <section id="outcomes" className="wd-section"><p className="kicker">What You’ll Build</p><h2>{titleCase(title)}</h2><div className="wd-outcome-grid">{outcomes.map((outcome, index) => <article className="wd-outcome" key={outcome}><span className="wd-check"><Check size={16} aria-hidden="true" /></span><h3>{titleCase(labels[index])}</h3><p>{outcome}</p></article>)}</div></section>;
}

export function WorkshopCurriculum({ topics }) {
  return <section id="curriculum" className="wd-section"><p className="kicker">Hands-On Curriculum</p><h2>Your Build Plan.</h2><p className="wd-section-lede">Work through each stage on your own project, with guidance as you go.</p><div className="wd-curriculum">{topics.map((topic,index) => <details key={topic.title} open={index === 0}><summary><span className="wd-step">{String(index+1).padStart(2,"0")}</span><span>{titleCase(topic.title)}</span><Plus size={18} aria-hidden="true" /></summary><p>{topic.text}</p></details>)}</div></section>;
}

export function WorkshopAgenda({ agenda }) {
  return <section id="curriculum" className="wd-section"><p className="kicker">Your Two-Day Build Plan</p><h2>Build The Pipeline.<br />Prove The Handoff.</h2><p className="wd-section-lede">A planned sequence of guided labs, with breaks and time for review. Dates, daily times, and venue will be confirmed before paid registration.</p><div className="wd-two-day-agenda">{agenda.map(day => <article key={day.day}><p className="kicker">{day.day}</p><h3>{titleCase(day.theme)}</h3><ol>{day.stages.map(([title,text]) => <li key={title}><h4>{titleCase(title)}</h4><p>{text}</p></li>)}</ol></article>)}</div></section>;
}

export function WorkshopPreparation({ audience, prerequisite, children }) {
  return <section id="prepare" className="wd-section wd-preparation"><p className="kicker">Come Ready To Build</p><h2>Is This Your Next Step?</h2><div><h3>A Good Fit For</h3><p>{audience}</p></div><div><h3>What To Bring</h3><p>{prerequisite}</p></div>{children}</section>;
}

export function WorkshopIncludes({ followup = false, followupText }) {
  const benefits = [
    { icon: Layers, title: "A blueprint to build from", text: "Codebases preloaded with skills and best practices, designed to eliminate 80% of the friction." },
    { icon: Users, title: "Help while you build", text: "Hands-on expert guidance and feedback on your own project." },
    { icon: Video, title: "Everything to revisit", text: "Recordings, blueprints, slides, templates, prompts, checklists, and code emailed after the workshop." },
  ];
  if (followup) benefits.push({ icon: Users, title: "A review after the lab", text: followupText || "One shared 60-minute implementation-review session within 30 days. Bring your test results and next-step questions." });
  return <section className="wd-section wd-includes"><p className="kicker">Included With Your Ticket</p><h2>Built With You. Yours To Keep.</h2><div>{benefits.map(({icon:Icon,title,text}) => <article key={title}><Icon size={22} aria-hidden="true" /><div><h3>{titleCase(title)}</h3><p>{text}</p></div></article>)}</div></section>;
}

export function WorkshopFaq({ faqs }) {
  return <section id="faq" className="wd-section wd-faq"><p className="kicker">FAQ</p><h2>A Few Things To Know.</h2><div>{faqs.map(faq => <details key={faq.question}><summary>{titleCase(faq.question)}<Plus size={17} aria-hidden="true" /></summary><p>{faq.answer}</p></details>)}</div><p className="wd-question">Something else on your mind? <a href="mailto:hi@shipai.club">Ask us.</a></p></section>;
}

export function WorkshopBooking({ price, promotional = false, children, href, cta, ended = false, scheduled = false }) {
  return <aside className="wd-booking" aria-label="Workshop pricing and registration" id="reserve"><p className="kicker">{scheduled ? "Your workshop seat" : "Your next build"}</p><div className="wd-ticket-price">{promotional && <del aria-label="Regular price 999 dollars">$999</del>}<strong>${price.toLocaleString("en-US")}</strong></div><p className="wd-ticket-unit">USD · one-time workshop admission</p>{children}{ended ? <p className="wd-booking-ended">This workshop has ended.</p> : <a className="btn btn-solid wd-booking-cta" href={href}>{cta}<ArrowRight size={17} aria-hidden="true" /></a>}<p className="wd-booking-foot">{scheduled ? "Create or sign into your Ship AI account, then pay securely with Stripe." : "Free to join the waitlist. No payment or seat reservation until registration opens."}</p></aside>;
}
