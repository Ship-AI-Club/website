"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { STUDIO_WORKSHOPS } from "../lib/studio-workshops";

const DISCORD = "https://discord.gg/kZSJMNveYM";

const links = [
  { href: "/talks", label: "Talks", detail: "One Night, One Live Build" },
  { href: STUDIO_WORKSHOPS, label: "Workshops", detail: "Build Something Useful" },
  { href: "/programs", label: "Programs", detail: "Learn Together. Ship Together." },
  { href: "/hackathons", label: "Hackathons", detail: "Ship It by Sunday" },
  { href: "/about", label: "About", detail: "Meet Ship AI" },
];

export default function MobileNav({ account }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef(null);
  const toggle = useRef(null);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const dismiss = event => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    const key = event => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    const media = window.matchMedia("(min-width: 861px)");
    const resize = () => { if (media.matches) setOpen(false); };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", key);
    media.addEventListener("change", resize);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", key);
      media.removeEventListener("change", resize);
    };
  }, [open]);

  return <div className="mobile-nav" ref={root} onBlur={event => {
    if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <button className="mobile-nav-toggle" type="button" ref={toggle} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
      <span className="mobile-nav-icon" aria-hidden="true"><i /><i /><i /></span>
    </button>
    {open && <div className="mobile-nav-panel" id={id}>
      <nav aria-label="Mobile navigation" onClick={event => { if (event.target.closest("a")) setOpen(false); }}>
        {links.map(link => <a key={link.href} href={link.href} aria-current={pathname === link.href || pathname.startsWith(`${link.href}/`) ? "page" : undefined}>
          <span><strong>{link.label}</strong><small>{link.detail}</small></span><ArrowUpRight size={18} aria-hidden="true" />
        </a>)}
        <div className="mobile-nav-account">{account ?? <a href="/dashboard" className="btn btn-ghost">Account</a>}<a href={DISCORD} className="btn btn-solid" target="_blank" rel="noreferrer">Discord <ArrowUpRight size={16} aria-hidden="true" /></a></div>
      </nav>
    </div>}
  </div>;
}
