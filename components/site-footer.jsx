import { Lockup } from "./seal";
import ModeToggle from "./mode-toggle";

const DISCORD = "https://discord.gg/kZSJMNveYM";
const MEETUP = "https://www.meetup.com/shipai/";
const LUMA = "https://luma.com/shipai";
const GITHUB = "https://github.com/Ship-AI-Club";
const X_URL = "https://x.com/shipaiclub";

const COLUMNS = [
  {
    label: "Learn",
    links: [
      { href: "/workshops", label: "Workshops" },
      { href: "/programs", label: "Programs" },
      { href: "/programs/zero-to-launch/hackathon", label: "Hackathon" },
      { href: "/about", label: "About" },
    ],
  },
  {
    label: "Community",
    links: [
      { href: DISCORD, label: "Discord", external: true },
      { href: MEETUP, label: "Meetup", external: true },
      { href: LUMA, label: "Luma", external: true },
      { href: X_URL, label: "X", external: true },
      { href: GITHUB, label: "GitHub", external: true },
    ],
  },
  {
    label: "Account",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/workshops/materials", label: "Workshop materials" },
      { href: "/programs/zero-to-launch/hackathon/sponsor", label: "Sponsor" },
    ],
  },
];

export default function SiteFooter({ note }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Lockup compact href="/" />
          <p>Hands-on AI workshops and programs in Phoenix. Practical AI, Built Together.</p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.label}>
            <h3>{column.label}</h3>
            <ul>
              {column.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noreferrer" : undefined}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer-legal">
        <span>© 2026 Ship AI Club{note ? ` · ${note}` : ""}</span>
        <span>Need AI deployed inside your company? <a href="https://www.shipaistudio.com">Ship AI Studio</a>.</span>
        <ModeToggle />
      </div>
    </footer>
  );
}
