import SiteHeader from "./site-header";
import { signOutAction } from "../app/login/actions";
import { DISCORD } from "../lib/hackathon";
import { Lockup } from "./seal";

/* ------------------------------------------------------------------
   The header and footer every account page wears.

   Same markup as the marketing pages (.nav / .footer from
   globals.css), with the right-hand slot swapped for who you are. Kept
   as server components so the sign-out form can post straight to the
   server action without shipping any JavaScript for it.
------------------------------------------------------------------ */

export function AccountHeader({ user }) {
  return <SiteHeader account={user ? <form action={signOutAction}><button type="submit" className="btn btn-ghost">Sign out</button></form> : <a className="btn btn-ghost" href="/login">Sign in</a>} />;
}

export function AccountFooter() {
  return (
    <footer className="footer">
      <Lockup compact />
      
      <nav>
        <a href="/">Home</a>
        <a href="/programs">Programs</a>
        <a href="/programs/zero-to-launch/hackathon">Hackathon</a>
        <a href="/dashboard">Dashboard</a>
        <a href={DISCORD} target="_blank" rel="noreferrer">
          Discord
        </a>
      </nav>
      <p className="fine">© 2026 Ship AI</p>
    </footer>
  );
}
