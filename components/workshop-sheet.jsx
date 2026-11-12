import Scene from "./scene";
import WorkshopNotify from "./workshop-notify";
import { titleCase } from "../lib/title-case";
import { UPCOMING_WORKSHOPS } from "../lib/workshops";
import { WORKSHOP_PRESENTATION } from "../lib/workshop-presentation";
import { AI_ORGANIZATION_EVENT } from "../lib/ai-organization-event";
import { VIBE_GTM } from "../lib/vibe-gtm-workshop";
import { pathwayFor } from "../lib/workshop-pathways";
import "./departure-board.css";
import "./workshop-sheet.css";

/* The catalogue workshop page, set as a build sheet: one column, the
   price and the email field on a board under the headline, then one
   ruled block per question a buyer asks. The two hand-built workshop
   pages keep the older components in workshop-detail.jsx. */

const money = (value) => "$" + value.toLocaleString("en-US");

export function SheetHero({ heading, promise, description }) {
  return (
    <section className="hero ws-hero" aria-labelledby="workshop-title">
      <p className="ws-crumb"><a href="/workshops">← All workshops</a></p>
      <h1 className="hero-h1" id="workshop-title">{titleCase(heading[0])} <span className="key">{titleCase(heading[1])}</span></h1>
      <p className="hero-lede"><strong>{promise}</strong> {description}</p>
    </section>
  );
}

/* The board: every fact once, and the one thing a visitor can do. */
export function SheetBoard({ slug, name, price, capacity, format, coverUrl }) {
  return (
    <div className="hub-board ws-board">
      <div className="stage dboard-stage ws-stage">
        {coverUrl ? <img className="ws-cover" src={coverUrl} alt="" /> : <Scene scene="slipway" />}
      </div>
      <aside id="seat" className="window dboard ws-dboard" aria-label="Price and date notification">
        <div className="window-bar"><b>Your seat</b><span>Date to be announced</span></div>
        <div className="dboard-row ws-row">
          <p className="dboard-date ws-price"><b>{money(price)}</b><span>USD&nbsp;· per attendee</span></p>
          <dl className="ws-facts">
            <div><dt>Seats</dt><dd>Up to {capacity}</dd></div>
            <div><dt>Format</dt><dd>{format}, in person in Phoenix</dd></div>
            <div><dt>Date</dt><dd>To be announced</dd></div>
          </dl>
          <div className="ws-signup">
            <WorkshopNotify slug={slug} name={name} startOpen askGoal />
            <p className="ws-fine">Free. No payment or seat reservation until registration opens.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

export function SheetSection({ id, title, lede, children }) {
  return (
    <section id={id} className="section ws-section" aria-labelledby={id + "-title"}>
      <div className="section-head"><h2 id={id + "-title"}>{title}</h2>{lede && <p className="section-lede">{lede}</p>}</div>
      <div className="ws-body">{children}</div>
    </section>
  );
}

export function SheetColumns({ items, className = "" }) {
  return (
    <ul className={("ws-cols " + className).trim()} style={{ "--ws-count": Math.min(items.length, 4) }}>
      {items.map(([title, text]) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}
    </ul>
  );
}

export function SheetAccordion({ items, openFirst = false }) {
  return (
    <div className="ws-acc">
      {items.map(([title, text], index) => (
        <details key={title} open={(openFirst && index === 0) || undefined}>
          <summary><h3>{title}</h3><span className="ws-mark" aria-hidden="true">+</span></summary>
          <p>{text}</p>
        </details>
      ))}
    </div>
  );
}

export function SheetAgenda({ agenda }) {
  return (
    <div className="ws-days">
      {agenda.map((day) => (
        <article key={day.day}>
          <p className="ws-day">{day.day}</p>
          <h3>{titleCase(day.theme)}</h3>
          <ol>{day.stages.map(([title, text]) => <li key={title}><h4>{titleCase(title)}</h4><p>{text}</p></li>)}</ol>
        </article>
      ))}
    </div>
  );
}

function summary(slug) {
  if (slug === "vibe-coding-gtm") return { title: VIBE_GTM.name, text: "Build or improve your website and social media pages.", price: null };
  if (slug === AI_ORGANIZATION_EVENT.slug) return { title: AI_ORGANIZATION_EVENT.name, text: "Connect six functions through two focused build labs.", price: AI_ORGANIZATION_EVENT.price };
  const workshop = UPCOMING_WORKSHOPS.find((item) => item.slug === slug);
  const card = WORKSHOP_PRESENTATION[slug];
  return { title: card.title, text: card.text, price: workshop.price };
}

/* The pathway as a route: the ship sits at this workshop's stop. */
export function SheetRoute({ slug }) {
  const path = pathwayFor(slug);
  if (!path) return null;
  const here = Math.max(0, path.slugs.indexOf(slug));
  const count = path.slugs.length;
  return (
    <SheetSection id="pathway" title={titleCase(path.title)} lede={path.description}>
      <div className="ws-route" aria-hidden="true" style={{ "--ws-stops": count, "--ws-here": here }}>
        <div className="ws-route-art"><Scene scene="swell" /></div>
        <span className="ws-ship" />
      </div>
      <ol className="ws-steps" style={{ "--ws-stops": count }}>
        {path.slugs.map((step) => {
          const item = summary(step);
          const current = step === slug;
          return (
            <li key={step} className={current ? "is-here" : undefined}>
              <a href={"/workshops/" + step} aria-current={current ? "page" : undefined}>
                <span>{current ? "You are here" : item.price == null ? "See the price" : money(item.price)}</span>
                <b>{titleCase(item.title)}</b>
              </a>
            </li>
          );
        })}
      </ol>
      {path.related.length > 0 && (
        <ul className="ws-related">
          {path.related.map((related) => {
            const item = summary(related);
            return (
              <li key={related}>
                <span>Related{item.price == null ? "" : " · " + money(item.price)}</span>
                <h3><a href={"/workshops/" + related}>{titleCase(item.title)}<span className="ws-arrow" aria-hidden="true">→</span></a></h3>
                <p>{item.text}</p>
              </li>
            );
          })}
        </ul>
      )}
      <p className="hub-note"><a className="link" href="/workshops/assessment">Not sure which one? Take the one-minute assessment</a></p>
    </SheetSection>
  );
}
