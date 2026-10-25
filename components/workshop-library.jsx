"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import WorkshopCard from "./workshop-card";
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
  return <section className="wc-library section" id="workshop-library" aria-labelledby="library-title">
    <div className="section-head"><h2 id="library-title">What do you want <span className="key">to build?</span></h2><p className="section-lede">Choose a focused project. Dates are coming next; join a free waitlist to hear first.</p></div>
    <div className="wc-library-controls"><div className="wc-filter-list" role="group" aria-label="Filter workshops by topic"><button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")}>All workshops <span>{workshops.length}</span></button>{groups.map(group => <button key={group.id} type="button" aria-pressed={category === group.id} onClick={() => setCategory(group.id)}>{group.title} <span>{group.slugs.length}</span></button>)}</div><div className="wc-discovery-tools"><div className="wc-search"><Search size={16} strokeWidth={1.5} aria-hidden="true" /><label className="sr-only" htmlFor="workshop-search">Search workshops</label><input id="workshop-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search workshops" />{query && <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X size={15} aria-hidden="true" /></button>}</div><WorkshopSort value={sort} onChange={setSort} /></div></div>
    <p className="wc-results k" role="status" aria-live="polite">{visible.length} {visible.length === 1 ? "workshop" : "workshops"}{category !== "all" ? ` · ${groups.find(group => group.id === category).title}` : " · All topics"}{normalized ? ` matching “${query.trim()}”` : ""}</p>
    <div className="cards cards-three">{visible.map(workshop => {
      const card = presentations[workshop.slug];
      return <WorkshopCard key={workshop.slug} href={`/workshops/${workshop.slug}`} category={card.category} artLabel={card.artLabel} name={card.title} summary={card.text} meta={`${workshop.duration || "Hands-on workshop"} · Up to ${workshop.capacity} attendees`} price={workshop.price} unit="USD per attendee" tag="Dates TBD" tagClass="tag-tbd" />;
    })}</div>
    {visible.length === 0 && <div className="wc-empty"><h3>No workshops match yet.</h3><p>Try a different skill or browse the full library.</p><button type="button" className="btn btn-solid btn-sm" onClick={() => {setQuery(""); setCategory("all");}}>Show all workshops</button></div>}
  </section>;
}
