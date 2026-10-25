import { BookOpen } from 'lucide-react';
import { VIBE_GTM } from '../lib/vibe-gtm-workshop';

export default function WorkshopDashboardCard({ access }) {
  return <section className="ac-card is-accent ac-workshop-materials" aria-labelledby="your-workshop-title">
    <div className="ac-card-head">
      <BookOpen size={18} aria-hidden="true" />
      <h2 id="your-workshop-title">Your workshop materials</h2>
      <span className="ac-pill is-ok">{access.isAdmin ? 'Admin access' : access.isHost ? 'Host access' : 'Registered'}</span>
    </div>
    <h3>{VIBE_GTM.name}</h3>
    <p>October 10 · 9 AM–1 PM Phoenix time. Open the slides for the workshop, or use the guide to copy prompts and download your materials.</p>
    <div className="ac-actions">
      <a className="btn btn-solid" href={`${VIBE_GTM.path}/materials/deck`}>Open slide deck</a>
      <a className="btn btn-ghost" href={`${VIBE_GTM.path}/materials/guide`}>Workshop materials</a>
    </div>
    <p className="ac-fine"><a href={VIBE_GTM.path}>Workshop details</a> · <a href="/workshops/materials">All workshop materials</a></p>
  </section>;
}
