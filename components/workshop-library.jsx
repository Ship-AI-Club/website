"use client";

import { titleCase } from "../lib/title-case";
import { useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import WorkshopArt from "./workshop-art";
import WorkshopSort from "./workshop-sort";

export default function WorkshopLibrary({ workshops, presentations, groups }) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const normalized = query.trim().toLowerCase();
  const visible = workshops.filter(workshop => {
    const card = presentations[workshop.slug];
    const group = groups.find(item => item.slugs.includes(workshop.slug));
    return (category === "all" || group?.id === category) && (!normalized || [workshop.name, card.category, card.text, ...card.tags].join(" ").toLowerCase().includes(normalized));
  });
  if (sort === "price-low") visible.sort((a, b) => a.price - b.price);
  if (sort === "price-high") visible.sort((a, b) => b.price - a.price);
  if (sort === "name") visible.sort((a, b) => presentations[a.slug].title.localeCompare(presentations[b.slug].title));
  return <section className="wc-library" id="workshop-library" aria-labelledby="library-title">
    <div className="wc-library-heading"><div><p className="kicker">The Workshop Library</p><h2 id="library-title">What Do You Want To Build?</h2><p>Choose a focused project. Dates are coming next; join a free waitlist to hear first.</p></div><a href="#scheduled-events" className="wc-explore">See scheduled events <ArrowRight size={16} aria-hidden="true" /></a></div>
    <div className="wc-library-controls"><div className="wc-filter-list" role="group" aria-label="Filter workshops by topic"><button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")}>All Workshops <span>{workshops.length}</span></button>{groups.map(group => <button key={group.id} type="button" aria-pressed={category === group.id} onClick={() => setCategory(group.id)}>{titleCase(group.title)} <span>{group.slugs.length}</span></button>)}</div><div className="wc-discovery-tools"><div className="wc-search"><Search size={17} aria-hidden="true" /><label className="wc-sr-only" htmlFor="workshop-search">Search workshops</label><input id="workshop-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search workshops" />{query && <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X size={15} aria-hidden="true" /></button>}</div><WorkshopSort value={sort} onChange={setSort} /></div></div>
    <p className="wc-results" role="status" aria-live="polite">{visible.length} {visible.length === 1 ? "workshop" : "workshops"}{category !== "all" ? ` · ${groups.find(group => group.id === category).title}` : " · All topics"}{normalized ? ` matching “${query.trim()}”` : ""}</p>
    <div className="wc-library-grid">{visible.map(workshop => {
      const card = presentations[workshop.slug];
      const path = `/workshops/${workshop.slug}`;
      return <article className="wc-card" key={workshop.slug}>
        <a className="wc-art-link" href={path} aria-label={`Explore ${workshop.name}`}><WorkshopArt slug={workshop.slug} label={card.artLabel} /></a>
        <div className="wc-card-body"><p className="wc-category">{card.category}</p><h3><a href={path}>{titleCase(card.title)}</a></h3><p>{card.text}</p><ul className="wc-tags" aria-label="Workshop format"><li>{workshop.duration || "Hands-on workshop"}</li><li>Up to {workshop.capacity} attendees</li></ul><div className="wc-card-bottom"><div><p className="wc-price"><strong>${workshop.price.toLocaleString("en-US")}</strong></p><span>USD per attendee · Date TBD</span></div><a className="wc-explore" href={path} aria-label={`View ${workshop.name}`}>View lab <ArrowRight size={16} aria-hidden="true" /></a></div></div>
      </article>;
    })}</div>
    {visible.length === 0 && <div className="wc-empty"><h3>No Workshops Match Yet.</h3><p>Try a different skill or browse the full library.</p><button type="button" className="btn btn-solid" onClick={() => {setQuery(""); setCategory("all");}}>Show all workshops</button></div>}
  </section>;
}
