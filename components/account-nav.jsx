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

  const active = (href) =>
    href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

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
