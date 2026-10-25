import DeckControls from '../app/programs/[program]/[slug]/deck/deck-controls';
import WorkshopAIOrganization from './workshop-ai-organization';
import WorkshopCodingRoute from './workshop-coding-route';
import { DISCORD, EVENT, HACKATHON_CASH_TOTAL, HACKATHON_MAX_PRIZE_VALUE } from '../lib/hackathon';
import { RUBRIC, SCORE_MIN, SCORE_MAX } from '../lib/accounts';
import { BREAKOUTS, HACKATHON_PATH, OPENING_JUDGES, OPENING_PRIZES, SATURDAY_AGENDA, TEAM_REGISTRATION } from '../lib/hackathon-opening';

const slides = [
  { id: 'welcome', label: 'Saturday, October 17 · Phoenix', title: 'Welcome to\nZero to Launch.', lead: 'Thank you for coming. We’re building an AI organization for your business.' },
  { id: 'sponsors', label: 'Our sponsors', title: 'Thank you for your support.', lead: 'You make this weekend possible.' },
  { id: 'organization', label: 'What we’re building together', title: 'Your business. An AI organization.', lead: 'One shared brief connects product, engineering and marketing.' },
  { id: 'site-proof', label: 'A real workshop build', title: 'Built by the AI team.', lead: 'Product Manager → Product Designer → Frontend Engineer.' },
  { id: 'agenda', label: 'Saturday, October 17 · Arizona / MST', title: 'Learn a little. Build a lot.', lead: 'Four 45-minute breakouts, with time to work between them. Wrap up at 5 PM.' },
  { id: 'setup', label: 'Before we build', title: 'Get your team connected.', lead: 'Come solo or build with a team of up to four.' },
  { id: 'breakouts', label: 'Your workshop decks', title: 'Let the bots do the heavy lifting.', lead: 'Open your breakout. Copy the setup prompt. Your assistant guides the work.' },
  { id: 'coding-route', label: 'Another way to build', title: 'Build with a coding agent.', lead: 'Use the website and marketing workshop as your guide.' },
  { id: 'judging', label: 'What the judges look for', title: 'Design. Craft. Receipts.', lead: `Three criteria. Each scored ${SCORE_MIN}–${SCORE_MAX} and weighted equally.` },
  { id: 'prizes', label: 'The prize pool', title: `Up to $${HACKATHON_MAX_PRIZE_VALUE.toLocaleString('en-US')} in total prize value.`, lead: `$${HACKATHON_CASH_TOTAL} cash, plus up to 4 Workuity seats valued at $1,200 each.` },
  { id: 'judges', label: 'Meet your judges', title: 'A fresh set of eyes.', lead: 'Thank you to the people reviewing what you build.' },
  { id: 'sunday', label: 'Sunday, October 18 · Arizona / MST', title: 'Back at 9. Pitches at noon.', lead: 'Bring a working site and a clear story.' },
  { id: 'start', label: 'You belong in this room', title: 'Thanks for showing up.\nLet’s get building.', lead: 'Ask questions, help each other, and share what you learn.' },
];

function Link({ href, children, className = '' }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}<span aria-hidden="true">↗</span></a>;
}

function SponsorWall({ groups }) {
  return <div className="oc-sponsor-wall" aria-label="Hackathon sponsors">{groups.flatMap(({ tier, sponsors }) => sponsors.map((sponsor) => {
    const name = sponsor.org || sponsor.credit_name;
    const content = <><span className="oc-sponsor-tier">{tier.name}{tier.sub ? ` · ${tier.sub}` : ''}</span><span className="oc-sponsor-logo">{sponsor.logo_url && <img src={sponsor.logo_url} alt="" />}</span><strong>{name}</strong></>;
    const className = `oc-sponsor-card is-${tier.id}`;
    return sponsor.website ? <a key={`${tier.id}-${name}`} className={className} href={sponsor.website} target="_blank" rel="noopener noreferrer">{content}</a> : <div key={`${tier.id}-${name}`} className={className}>{content}</div>;
  }))}</div>;
}

function Content({ id, sponsors }) {
  const lunchIndex = SATURDAY_AGENDA.findIndex(item => item.lunch);
  const agendaColumns = [SATURDAY_AGENDA.slice(0, lunchIndex + 1), SATURDAY_AGENDA.slice(lunchIndex + 1)];
  switch (id) {
    case 'sponsors': return <SponsorWall groups={sponsors}/>;
    case 'organization': return <><WorkshopAIOrganization/><p className="oc-note">Start with Product Manager. Your assistant adds the other roles as needed. Every card opens its bot template.</p></>;
    case 'site-proof': return <figure className="oc-site-proof"><a href="/hackathon-opening/porchlight-marketing-site.png" target="_blank" rel="noopener noreferrer" aria-label="View the full Porchlight Plant Care marketing page screenshot"><img src="/hackathon-opening/porchlight-marketing-site.png" alt="Bot-built Porchlight Plant Care marketing page with a plant care hero, original plant artwork, visit details and a trip care planner" width="1440" height="4691" loading="lazy"/></a><figcaption><span>Porchlight Plant Care · Fictional workshop example</span><Link href="/hackathon-opening/porchlight-marketing-site.png">View the full page</Link></figcaption></figure>;
    case 'coding-route': return <WorkshopCodingRoute/>;
    case 'welcome': return <div className="oc-welcome"><div className="oc-brand-poster"><p>SHIP AI / ZERO TO LAUNCH</p><div className="oc-brand-emblem"><span className="oc-brand-orbit"/><span className="oc-brand-orbit is-wide"/><img src="/deck-brand/ship-ai-mark.svg" alt="Ship AI logo mark" width="320" height="320"/></div><div className="oc-brand-signature"><strong>Ship AI<span aria-hidden="true">↗</span></strong><span>Practical AI,<br/>Built Together.</span></div></div><small>{EVENT.venue}<br/>{EVENT.dates}</small></div>;
    case 'agenda': return <><div className="oc-agenda-columns">{agendaColumns.map((items,i)=><div key={i}><h3>{i===0?'Morning':'Afternoon'}</h3><ol className="oc-agenda">{items.map(item => <li key={item.time} className={item.lunch ? 'is-lunch' : item.work ? 'is-work' : undefined}><time>{item.time}</time>{item.href ? <Link href={item.href}>{item.title}</Link> : <strong>{item.title}</strong>}</li>)}</ol></div>)}</div><p className="oc-note">Sunday: start at 9 AM. Pitches begin at noon. All times are Arizona / MST.</p></>;
    case 'setup': return <div className="oc-setup-grid"><article><img src="/deck-qr/hackathon-register.svg" alt="QR code to register your team" width="144" height="144" /><div><h3>Register your team</h3><p>Sign in. Create or join a team.</p><Link href={TEAM_REGISTRATION}>shipai.club/dashboard</Link></div></article><article><img src="/deck-qr/hackathon-discord.svg" alt="QR code to join Ship AI Discord" width="144" height="144" /><div><h3>Join the Discord</h3><p>Post questions. Find teammates. Coordinate your work.</p><Link href={DISCORD}>discord.gg/kZSJMNveYM</Link></div></article></div>;
    case 'breakouts': return <div className="oc-breakouts">{BREAKOUTS.map(item => <Link className="oc-breakout" href={item.href} key={item.number}><span className="oc-breakout-number">{item.number}</span><div><time>{item.time} · 45 min</time><h3>{item.title}</h3><p>{item.outcome}</p><b>Open breakout deck</b></div></Link>)}</div>;
    case 'judging': return <><div className="oc-criteria">{RUBRIC.map(item => <article key={item.key}><span>{SCORE_MIN}–{SCORE_MAX}</span><h3>{item.name}</h3><p>{item.copy}</p></article>)}</div><p className="oc-note">Show live pages, working features, and before-and-after evidence. Growth metrics are not required.</p></>;
    case 'prizes': return <><div className="oc-prizes">{OPENING_PRIZES.map(item => <article key={item.name}><span>${item.cash}</span><h3>{item.name}</h3>{item.extra && <p className="oc-prize-extra">+ {item.extra}</p>}</article>)}</div><p className="oc-note">Every team that submits receives a project listing and certification. You keep your IP.</p></>;
    case 'judges': return <ul className="oc-judges">{OPENING_JUDGES.map(judge => <li key={judge.name}><img src={judge.photo} alt="" width="200" height="200"/><h3>{judge.name}</h3></li>)}</ul>;
    case 'sunday': return <><div className="oc-sunday"><article><time>9:00 AM</time><h3>Start together</h3><p>Finish your site, test the main action, and prepare your pitch.</p></article><article><time>Before noon</time><h3>Submit your site</h3><p>Live URL, team details, and evidence of what you shipped.</p><Link href={`${HACKATHON_PATH}/submit`}>Submission details</Link></article><article><time>12:00 PM</time><h3>Pitches begin</h3><p>Who is it for? What does it do? Show the working experience.</p></article></div><p className="oc-note">Submit before pitches begin. Awards are planned for 1:30 PM.</p></>;
    case 'start': return <div className="oc-start"><p>Thank you to our builders, judges, mentors, volunteers, and venue sponsor, Workuity.</p><div><Link href={TEAM_REGISTRATION}>Register your team</Link><Link href={DISCORD}>Join Discord</Link><Link href={BREAKOUTS[0].href}>Open breakout 1</Link></div></div>;
    default: return null;
  }
}

export default function HackathonOpeningDeck({ sponsors = [] }) {
  return <div className="dk-page oc-deck">
    <header className="dk-bar"><a href={HACKATHON_PATH}>← Hackathon</a><span>Zero to Launch · Opening ceremony</span><Link href={`${HACKATHON_PATH}/deck`}>Breakout decks</Link></header>
    <main className="dk-track" data-lenis-prevent tabIndex={-1}>{slides.map((slide, i) => <section className="dk-slide dk-marketing-slide" id={`slide-${i + 1}`} key={slide.id} aria-label={`Slide ${i + 1}: ${slide.title.replaceAll('\n', ' ')}`}><div className={`dk-frame oc-frame oc-kind-${slide.id}`}><div className="oc-body"><p className="oc-label">{slide.label}</p><header className="oc-heading">{i === 0 ? <h1>{slide.title}</h1> : <h2>{slide.title}</h2>}<p>{slide.lead}</p></header><Content id={slide.id} sponsors={sponsors}/></div><footer className="dk-chrome"><span className="oc-brand"><img src="/logo-mark.png" alt="" width="24" height="24" />Ship AI</span><span className="dk-chrome-mid">Practical AI, Built Together.</span><span>{i + 1} / {slides.length}</span></footer></div></section>)}</main>
    <DeckControls total={slides.length} />
  </div>;
}
