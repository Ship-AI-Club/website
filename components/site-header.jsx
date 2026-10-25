import MobileNav from "./mobile-nav";
import { Lockup } from "./seal";

export const DEFAULT_LINKS = [
  { href: "/workshops", label: "Workshops" },
  { href: "/programs", label: "Programs" },
  { href: "/about", label: "About" },
  { href: "/dashboard", label: "Account" },
];

export default function SiteHeader({ links = DEFAULT_LINKS, current, cta, mobile, extraLinks }) {
  return (
    <header className="nav">
      <Lockup />
      <nav aria-label="Main">
        {links.map((link) => (
          <a key={link.href} href={link.href} aria-current={current === link.href ? "page" : undefined} target={link.external ? "_blank" : undefined} rel={link.external ? "noreferrer" : undefined}>
            {link.label}
          </a>
        ))}
      </nav>
      {cta ?? <a className="btn btn-solid btn-sm nav-cta" href="/dashboard">Account</a>}
      <MobileNav extraLinks={extraLinks ?? links.filter((l) => !l.external && l.href !== "/dashboard")}>{mobile}</MobileNav>
    </header>
  );
}
