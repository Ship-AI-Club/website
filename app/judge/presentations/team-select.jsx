"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

export default function TeamSelect({ entries, selected }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const root = useRef(null);
  const trigger = useRef(null);
  const index = entries.findIndex(entry => entry.id === selected);
  const current = entries[index];
  const visible = entries.map((entry, index) => ({ ...entry, number: index + 1 }))
    .filter(entry => `${entry.number} ${entry.team} ${entry.project}`.toLowerCase().includes(search.trim().toLowerCase()));

  useEffect(() => {
    if (!open) return;
    function closeOutside(event) {
      if (!root.current?.contains(event.target)) setOpen(false);
    }
    function escape(event) {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    }
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div className="pr-picker" ref={root}>
      <span className="ac-label" id="presentation-picker-label">Jump to a team</span>
      <button ref={trigger} type="button" className="pr-picker-trigger" aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? "presentation-picker" : undefined} aria-labelledby="presentation-picker-label presentation-selected" onClick={() => { setSearch(""); setOpen(value => !value); }}>
        <span className="pr-picker-number">{String(index + 1).padStart(2, "0")}</span>
        <span className="pr-picker-copy" id="presentation-selected"><strong>{current.project || "Untitled project"}</strong><span>{current.team}</span></span>
        {current.scored && <Check size={16} className="pr-picker-check" aria-label="Scored" />}
        <ChevronDown size={18} aria-hidden="true" className={open ? "pr-chevron is-open" : "pr-chevron"} />
      </button>
      {open && (
        <div className="pr-picker-panel" id="presentation-picker" role="dialog" aria-label="Choose a team">
          <div className="pr-picker-search">
            <Search size={16} aria-hidden="true" />
            <input type="search" aria-label="Search teams or projects" placeholder="Search teams or projects…" value={search} onChange={event => setSearch(event.target.value)} autoFocus />
          </div>
          <ol className="pr-picker-list" aria-label="Teams in presentation order">
            {visible.map(entry => <li key={entry.id}>
              <Link href={`/judge/presentations?team=${entry.id}`} className="pr-picker-option" aria-current={entry.id === selected ? "page" : undefined} onClick={() => setOpen(false)}>
                <span className="pr-picker-number">{String(entry.number).padStart(2, "0")}</span>
                <span className="pr-picker-copy"><strong>{entry.project || "Untitled project"}</strong><span>{entry.team}</span></span>
                <span className={`pr-picker-status${entry.scored ? " is-scored" : ""}`}>{entry.conflict ? "Your team" : entry.scored ? <><Check size={13} aria-hidden="true" /> Scored</> : "To score"}</span>
              </Link>
            </li>)}
          </ol>
          {visible.length === 0 && <p className="pr-picker-empty" role="status">No teams match “{search}”.</p>}
        </div>
      )}
    </div>
  );
}
