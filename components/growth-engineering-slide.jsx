"use client";

import { useId, useRef, useState } from 'react';
import { GROWTH_PROMPTS, GROWTH_SOURCES } from '../lib/growth-engineering-prompts';
import GrowthTemplateLibrary, { TemplateActions } from './growth-template-library';
import { GROWTH_BOT_TEMPLATES, GROWTH_TEMPLATES, GROWTH_TEMPLATE_KIT } from '../lib/growth-engineering-templates';
import MarketingTeamCards from './marketing-team-cards';

function PromptTools({ name }) {
  const dialog = useRef(null);
  const titleId = useId();
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const prompt = GROWTH_PROMPTS[name];
  async function copy() {
    try { await navigator.clipboard.writeText(prompt.text); setCopied(true); setFailed(false); }
    catch { setFailed(true); dialog.current?.showModal(); }
  }
  return <div className="ge-prompt-tools">
    <button onClick={copy}>{copied ? 'Copied ✓' : 'Copy prompt ↗'}</button>
    <button className="ge-secondary" onClick={() => dialog.current?.showModal()}>Full prompt</button>
    <a href="/growth-engineering/agency-demo-prompts.md" download>Download all prompts ↓</a>
    <dialog ref={dialog} className="ge-dialog" aria-labelledby={titleId}>
      <div className="ge-dialog-head"><h2 id={titleId}>{prompt.title}</h2><button onClick={() => dialog.current?.close()} aria-label="Close full prompt">Close ×</button></div>
      <p>Our agency · Desert Shine · fictional first client</p>
      {failed && <p role="status">Select and copy the prompt below.</p>}
      <textarea aria-label={`${prompt.title} prompt`} readOnly value={prompt.text} onFocus={e => e.target.select()}/>
      <button onClick={copy}>{copied ? 'Copied ✓' : 'Copy full prompt'}</button>
    </dialog>
  </div>;
}

function Steps({ items }) {
  return <div className="ge-steps">{items.map(([title, body], i) => <div key={title}><span>0{i + 1}</span><div><h4>{title}</h4><p>{body}</p></div></div>)}</div>;
}

function ApprovalDemo() {
  const [caption, setCaption] = useState('More time for your weekend. Explore Desert Shine’s cleaning services and request a quote.');
  const [stage, setStage] = useState('Draft');
  const [version, setVersion] = useState(1);
  return <div className="ge-approval">
    <div className="ge-review-copy"><span className="ge-label">CLIENT REVIEW / VERSION {version}</span><label htmlFor="desert-shine-caption">Campaign caption</label><textarea id="desert-shine-caption" value={caption} onChange={e => { setCaption(e.target.value); setVersion(v => v + 1); setStage('Draft'); }}/><p>1 graphic + 1 video · Desert Shine destinations</p><small>Illustrative bundle · edit the caption to reset approval.</small></div>
    <div className="ge-review-state"><span className="ge-label">TRY THE APPROVAL FLOW</span><strong role="status">{stage}</strong><p>{stage === 'Draft' ? 'Send the complete bundle for client review.' : stage === 'In review' ? 'Review the exact version before approving.' : stage === 'Approved' ? 'This version can move to the draft handoff.' : 'The rehearsal stops here. Nothing was sent.'}</p><button disabled={!caption.trim() || stage === 'Handoff simulated'} onClick={() => setStage(stage === 'Draft' ? 'In review' : stage === 'In review' ? 'Approved' : 'Handoff simulated')}>{stage === 'Draft' ? 'Request review' : stage === 'In review' ? 'Approve this version' : stage === 'Approved' ? 'Simulate draft handoff' : 'Simulation complete'}</button><small>Local simulation · no accounts or API calls</small></div>
  </div>;
}

function Body({ slide }) {
  switch (slide.mode) {
    case 'portal': return <div className="ge-portal"><div className="ge-portal-brand"><img src="/deck-brand/ship-ai-mark.svg" alt="Ship AI"/><p>Practical AI, Built Together.</p></div><div className="ge-portal-cards"><a className="ge-portal-card ge-portal-primary" href="?track=grok-bot"><span className="ge-label">PRESENTATION PATH</span><h4>Vibe Builder</h4><strong>Build with Grok Bot</strong><p>Direct your marketing team. Build the site, make the creative, and review one client campaign.</p><span className="ge-portal-cta">Start the Grok Bot demo <b aria-hidden="true">↗</b></span></a><a className="ge-portal-card" href="?track=engineer"><span className="ge-label">EXPLORE THE CODE</span><h4>Engineer</h4><strong>Build your own app</strong><p>Use the same client example with Next.js, reusable source templates, and your own workflow.</p><span className="ge-portal-cta">Open the engineering track <b aria-hidden="true">↗</b></span></a></div></div>;
    case 'opening': return <div className="ge-opening"><div className="ge-brand"><img src="/deck-brand/ship-ai-mark.svg" alt="Ship AI logo mark"/><strong>Practical AI, Built Together.</strong></div><div><span className="ge-label">OUR AGENCY’S FIRST CLIENT</span><h4>Desert Shine</h4><p>A website people understand.<br/>Creative they recognize.<br/>A workflow we can repeat.</p><a href="/programs/zero-to-launch/marketing-site/deck">Previous session: the marketing site ↗</a></div></div>;
    case 'brief': return <div className="ge-brief"><div><span className="ge-label">CLIENT BRIEF / DEMO ASSUMPTIONS</span><h4>Less cleaning.<br/>More weekend.</h4><p>Housecleaning for busy Phoenix households.</p><span className="ge-cta">Request a cleaning quote ↗</span></div><dl>{[['The client','Desert Shine'],['The services','Regular · Deep · Move-out cleaning'],['Our agency delivers','Website, graphics, video, and campaign workflow'],['Client supplies','Approved service facts, photos, and final review']].map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl></div>;
    case 'journey': return <div className="ge-journey">{[['Website','The approved source'],['Creative','Graphics + video'],['Client review','Approve this version'],['Zernio','Drafts for delivery']].map(([title, description], i) => <div key={title}><span>0{i + 1}</span><h4>{title}</h4><p>{description}</p>{i < 3 && <b aria-hidden="true">→</b>}</div>)}</div>;
    case 'paths': return <div className="ge-paths"><div><span className="ge-label">VIBE BUILDER / BUSINESS USER</span><h4>Direct the work</h4><p>Give the bots a brief. Review what they make. Save the workflow for the next campaign.</p><strong>Our live demo → Grok Bot</strong></div><div><span className="ge-label">ENGINEER / TECHNICAL BUILDER</span><h4>Build the system</h4><p>Connect the same steps in Next.js. Own the review screen, job history, and integrations.</p><strong>Your stack → Your app</strong></div></div>;
    case 'team': return <MarketingTeamCards/>;
    case 'templates': return <GrowthTemplateLibrary templates={GROWTH_TEMPLATES} kitHref={GROWTH_TEMPLATE_KIT} bots={GROWTH_BOT_TEMPLATES}/>;
    case 'prompt': return <div className="ge-task"><Steps items={slide.steps}/><div className="ge-task-note"><span className="ge-label">REUSABLE AGENCY TEMPLATE</span><h4>{GROWTH_PROMPTS[slide.prompt].title}</h4><p>{slide.prompt === 'site' ? 'The structure stays useful. The client message becomes specific.' : slide.prompt === 'static' ? 'Shared content in. Branded images out.' : slide.prompt === 'video' ? 'One message, adapted for motion.' : slide.prompt === 'workflow' ? 'A complete client campaign, ready for a decision.' : 'The handoff ends with a saved draft and a returned ID.'}</p></div></div>;
    case 'approval': return <ApprovalDemo/>;
    case 'stack': return <div className="ge-stack">{GROWTH_SOURCES.map(([name, url, job]) => <a href={url} target="_blank" rel="noreferrer" key={name}><strong>{name}<span aria-hidden="true"> ↗</span></strong><span>{job}</span></a>)}</div>;
    case 'app': return <div className="ge-app"><div className="ge-app-header"><span>Agency Studio / Desert Shine</span><span>Screen concept</span></div><div className="ge-app-body"><div><span className="ge-label">THIS CAMPAIGN</span><h4>Weekend cleaning</h4><p>Approved brief → 1 graphic + 1 video</p><div className="ge-app-row"><span>Creative previews</span><strong>Review assets</strong></div><div className="ge-app-row"><span>Copy + destinations</span><strong>Check the bundle</strong></div><div className="ge-app-row"><span>Current version</span><strong>Awaiting client review</strong></div></div><aside><span className="ge-label">THE AGENCY CONTROLS</span><p>Create draft<br/>Request client review<br/>Approve this version<br/>Send approved draft</p><small>Job history and failures stay visible.</small></aside></div></div>;
    case 'scale': return <Steps items={[[ 'Add a client record','Keep each client’s brief, assets, accounts, and approvals separate.'],['Reuse the templates','Change the approved input instead of rebuilding the campaign.'],['Run durable jobs','Store progress, bound retries, and move heavy renders to a render worker.']]}/>;
    case 'measure': return <div className="ge-measure"><div><span className="ge-label">FOLLOW THE CUSTOMER</span><h4>Post → Quote →<br/>Booked clean</h4><p>Use tagged links and record the source of each inquiry.</p></div><div><span className="ge-label">BEFORE A PAID TEST</span><h4>Know your limit</h4><p>Customer acquisition cost = acquisition costs ÷ new customers.</p><p>Compare it with the expected gross profit from a customer and how soon you need payback.</p><small>Use Desert Shine’s actual costs and retention before setting a number.</small></div></div>;
    case 'rehearsal': return <div className="ge-rehearsal"><Steps items={[[ 'Site Builder','Build Desert Shine’s page and approve the shared brief.'],['Performance + Creators','Research ads. Refine one PNG and one short MP4.'],['Social Media Manager','Review captions and destination. Demonstrate how edits reset approval.']]}/><div className="ge-rehearsal-links"><h4>Take the templates</h4><a href="/growth-engineering/templates/examples/review/approval-review.html" target="_blank" rel="noreferrer">Open Desert Shine’s approval bundle ↗</a><a href={GROWTH_TEMPLATE_KIT} download>Download the complete starter kit ↓</a><a href="/growth-engineering/agency-demo-prompts.md" download>Download the prompt kit ↓</a><a href="https://docs.x.ai/grok-bot/overview" target="_blank" rel="noreferrer">Grok Bot: getting started ↗</a><p>Import all five bots from the team slide. Ask each to use the Desert Shine template.</p></div></div>;
    default: return null;
  }
}

export default function GrowthEngineeringSlide({ slide }) {
  const baseTemplate = GROWTH_TEMPLATES.find(t => t.id === (slide.template || slide.prompt));
  const template = baseTemplate && slide.track === 'engineer' ? { ...baseTemplate, bot:'your coding agent', command:`Read the ${baseTemplate.name} source template and its README from the Ship AI agency starter kit. Use the shared Desert Shine client JSON, run the documented build or render command, and inspect the output. Keep the campaign in dry run.` } : baseTemplate;
  return <div className={`mk-slide ge-slide ge-mode-${slide.mode}`}>
    <header><p className="mk-label">{slide.eyebrow}</p><h3>{slide.title}</h3><p className="mk-lead">{slide.lead}</p></header>
    <div className="mk-content"><Body slide={slide}/>{template && <TemplateActions template={template}/ >}{slide.prompt && slide.mode !== 'team' && <PromptTools name={slide.prompt}/ >}{slide.sources && <div className="ge-sources">{slide.sources.map(([name, href]) => <a key={name} href={href} target="_blank" rel="noreferrer">{name} ↗</a>)}</div>}</div>
    <p className="mk-takeaway">{slide.takeaway}</p>
  </div>;
}
