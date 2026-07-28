"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

/* The side nav for every signed-in surface. A client component only
   because it needs the current path to mark the active item — the
   sections themselves are built on the server, from the roles the
   viewer actually holds, so an unauthorized link is never rendered in
   the first place. */

export default function AccountNav({ sections }) {
  const pathname = usePathname();

  /* Longest match wins. A plain prefix test lights up "/admin" on
     every page under it, so on /admin/ops both "Overview" and "Run of
     show" would read as current — and the one that's wrong is the one
     you'd click. Comparing against every href in the nav means the
     most specific one is the only one marked. */
  const hrefs = sections.flatMap((s) => s.items.map((i) => i.href));

  const matches = (href) => pathname === href || pathname.startsWith(`${href}/`);

  const active = (href) => {
    if (!matches(href)) return false;
    return !hrefs.some((other) => other !== href && other.length > href.length && matches(other));
  };

  return (
    <nav className="ac-menu" aria-label="Account">
      {sections.map((section) => (
        <div key={section.title ?? "main"} style={{ display: "contents" }}>
          {section.title && <p className="ac-menu-group">{section.title}</p>}
          {section.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={active(item.href) ? "is-on" : undefined}
              aria-current={active(item.href) ? "page" : undefined}
            >
              {item.label}
              {item.count ? <span className="ac-count">{item.count}</span> : null}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
