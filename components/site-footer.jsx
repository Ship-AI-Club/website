import { siDiscord, siGithub, siMeetup, siX } from "simple-icons";

const socials = [
  { href: "https://discord.gg/kZSJMNveYM", label: "Discord", icon: siDiscord },
  { href: "https://www.meetup.com/shipai/", label: "Meetup", icon: siMeetup },
  { href: "https://x.com/shipaiclub", label: "X", icon: siX },
  { href: "https://github.com/Ship-AI-Club", label: "GitHub", icon: siGithub },
];

export default function SiteFooter() {
  return <footer className="footer">
    <div className="brand"><img src="/logo-mark.png" alt="" width={22} height={22} /><span>Ship AI</span></div>
    <nav><a href="/workshops">Workshops</a><a href="/programs">Programs</a><a href="/about">About</a></nav>
    <div className="socials">{socials.map(({ href, label, icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
      <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden="true"><path d={icon.path} /></svg>
    </a>)}</div>
    <p className="fine">© 2026 Ship AI</p>
  </footer>;
}
