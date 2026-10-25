"use client";

import { useId, useRef, useState } from 'react';

export function TemplatePreview({ template }) {
  const dialog = useRef(null);
  const headingId = useId();
  const [copied, setCopied] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(template.command); setCopied(true); }
    catch { dialog.current?.querySelector('textarea')?.select(); }
  }
  return <>
    <button className="ge-secondary" onClick={() => dialog.current?.showModal()}>View example ↗</button>
    <dialog ref={dialog} className="ge-dialog ge-template-dialog" aria-labelledby={headingId} onClose={() => dialog.current?.querySelector('video')?.pause()}>
      <div className="ge-dialog-head"><h2 id={headingId}>{template.name}</h2><button onClick={() => { dialog.current?.querySelector('video')?.pause(); dialog.current?.close(); }}>Close ×</button></div>
      <p>{template.bot} · Desert Shine example</p>
      <div className={`ge-template-media ge-template-media-${template.previewType}`}>
        {template.previewType === 'video' ? <video controls playsInline preload="metadata" src={template.previewHref} poster={template.posterHref}/>
          : template.previewType === 'html' ? <iframe src={template.previewHref} title={`${template.name} example`} sandbox=""/>
            : <img src={template.previewHref} alt={template.previewAlt || `${template.name} for Desert Shine`}/>}
      </div>
      <div className="ge-template-command"><span>Ask {template.bot}</span><textarea readOnly value={template.command} aria-label={`${template.name} rehearsal command`} onFocus={e => e.target.select()}/><button onClick={copy}>{copied ? 'Copied ✓' : 'Copy rehearsal command'}</button><a href={template.sourceHref} download>Download template ↓</a><a href={template.liveHref || template.previewHref} target="_blank" rel="noreferrer">{template.liveHref ? 'Open the client site ↗' : 'Open full example ↗'}</a></div>
    </dialog>
  </>;
}

export function TemplateActions({ template }) {
  return <div className="ge-template-actions"><a className="ge-template-download" href={template.sourceHref} download>Download {template.shortName.toLowerCase()} template ↓</a><TemplatePreview template={template}/></div>;
}

export default function GrowthTemplateLibrary({ templates, kitHref, bots }) {
  return <div className="ge-template-library">
    <div className="ge-template-list">{templates.map((template, i) => <div key={template.id}><span className="ge-label">0{i + 1} / {template.bot.toUpperCase()}</span><div><h4>{template.name}</h4><p>{template.summary}</p></div><div className="ge-template-links"><a href={template.sourceHref} download>Get template ↓</a><TemplatePreview template={template}/></div></div>)}</div>
    <div className="ge-template-kit"><div><strong>Use the bot team</strong><p>{bots?.length ? bots.map((bot, i) => <span key={bot.name}>{i > 0 && ' · '}<a href={bot.href} target="_blank" rel="noreferrer">{bot.name} ↗</a></span>) : 'Open the Ship AI group in Grok Bot.'}</p></div><a href={kitHref} download>Download the complete starter kit ↓</a></div>
  </div>;
}
