import { siDiscord } from "simple-icons";
import MobileNav from "./mobile-nav";
import { Lockup } from "./seal";
import { DISCORD } from "../lib/hackathon";

export const NAV_LINKS = [
  { href: "/talks", label: "Talks" },
  { href: "/workshops", label: "Workshops" },
  { href: "/programs", label: "Programs" },
  { href: "/about", label: "About" },
];

export default function SiteHeader({ current, account }) {
  return (
    <header className="nav">
      <Lockup />
      <nav aria-label="Main">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} aria-current={current === link.href ? "page" : undefined}>
            {link.label}
          </a>
        ))}
      </nav>
      <div className="nav-ctas">
        {account ?? <a className="btn btn-ghost btn-sm" href="/dashboard">Account</a>}
        <a className="btn btn-solid btn-sm" href={DISCORD} target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden="true" focusable="false"><path d={siDiscord.path} /></svg>
          Discord
        </a>
      </div>
      <MobileNav account={account} />
    </header>
  );
}
