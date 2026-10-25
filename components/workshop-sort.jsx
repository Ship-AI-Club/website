"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowDownWideNarrow, Check, ChevronDown } from "lucide-react";

const OPTIONS = [
  { value: "featured", label: "Featured", short: "Featured" },
  { value: "price-low", label: "Price: Low To High", short: "Lowest Price" },
  { value: "price-high", label: "Price: High To Low", short: "Highest Price" },
  { value: "name", label: "Name: A To Z", short: "Name A–Z" },
];

export default function WorkshopSort({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null), trigger = useRef(null), items = useRef([]);
  const id = useId();
  const selected = OPTIONS.findIndex(option => option.value === value);

  useEffect(() => {
    if (!open) return;
    function outside(event) {
      if (!root.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  function reveal(index = selected) {
    setOpen(true);
    requestAnimationFrame(() => items.current[index]?.focus({ preventScroll: true }));
  }
  function dismiss() {
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }
  function menuKey(event, index) {
    let next;
    if (event.key === "ArrowDown") next = (index + 1) % OPTIONS.length;
    if (event.key === "ArrowUp") next = (index + OPTIONS.length - 1) % OPTIONS.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = OPTIONS.length - 1;
    if (next !== undefined) { event.preventDefault(); items.current[next]?.focus(); }
    if (event.key === "Escape") { event.preventDefault(); dismiss(); }
    if (event.key === "Tab") setOpen(false);
  }

  return <div className="wc-sort" ref={root} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <button className="wc-sort-trigger" id={`${id}-trigger`} ref={trigger} type="button"
      aria-label={`Sort workshops: ${OPTIONS[selected].label}`} aria-haspopup="menu"
      aria-expanded={open} aria-controls={open ? `${id}-menu` : undefined}
      onClick={() => open ? dismiss() : reveal()}
      onKeyDown={event => {
        if (["ArrowDown", "ArrowUp"].includes(event.key)) {
          event.preventDefault(); reveal(event.key === "ArrowUp" ? OPTIONS.length - 1 : selected);
        }
      }}>
      <ArrowDownWideNarrow size={16} aria-hidden="true" /><span>{OPTIONS[selected].short}</span>
      <ChevronDown className="wc-sort-chevron" size={14} aria-hidden="true" />
    </button>
    {open && <div className="wc-sort-popover"><p>Sort By</p><div id={`${id}-menu`} role="menu" aria-labelledby={`${id}-trigger`}>
      {OPTIONS.map((option, index) => <button key={option.value} type="button" role="menuitemradio"
        aria-checked={value === option.value} tabIndex={-1} ref={element => { items.current[index] = element; }}
        onKeyDown={event => menuKey(event, index)} onClick={() => { onChange(option.value); dismiss(); }}>
        <span>{option.label}</span><Check size={16} aria-hidden="true" className={value === option.value ? "" : "wc-sort-unchecked"} />
      </button>)}
    </div></div>}
  </div>;
}
