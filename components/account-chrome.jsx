import { signOutAction } from "../app/login/actions";
import { DISCORD } from "../lib/hackathon";

/* ------------------------------------------------------------------
   The header and footer every account page wears.

   Same markup as the marketing pages (.nav / .footer from
   globals.css), with the right-hand slot swapped for who you are. Kept
   as server components so the sign-out form can post straight to the
   server action without shipping any JavaScript for it.
------------------------------------------------------------------ */

export function AccountHeader({ user, links = [] }) {
  return (
    <header className="nav">
      <a href="/" className="brand">
        <img src="/logo-icon.png" alt="" width={26} height={26} />
        <span>Ship AI</span>
      </a>
      <nav>
        <a href="/programs">Programs</a>
        <a href="/hackathon">Hackathon</a>
        {links.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
      {user ? (
        <form action={signOutAction}>
          <button type="submit" className="btn btn-ghost nav-cta">
            Sign out
          </button>
        </form>
      ) : (
        <a className="btn btn-solid nav-cta" href="/login">
          Sign in
        </a>
      )}
    </header>
  );
}

export function AccountFooter() {
  return (
    <footer className="footer">
      <div className="brand">
        <img src="/logo-icon.png" alt="" width={22} height={22} />
        <span>Ship AI</span>
      </div>
      <p>Phoenix &amp; Tempe, Arizona</p>
      <nav>
        <a href="/">Home</a>
        <a href="/programs">Programs</a>
        <a href="/hackathon">Hackathon</a>
        <a href="/dashboard">Dashboard</a>
        <a href={DISCORD} target="_blank" rel="noreferrer">
          Discord
        </a>
      </nav>
      <p className="fine">© 2026 Ship AI</p>
    </footer>
  );
}
