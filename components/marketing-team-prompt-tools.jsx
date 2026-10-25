"use client";

import { useId, useRef, useState } from 'react';
import { MARKETING_TEAM_PROMPT } from '../lib/marketing-team-prompt';

export default function MarketingTeamPromptTools() {
  const dialog = useRef(null);
  const titleId = useId();
  const [copied, setCopied] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(MARKETING_TEAM_PROMPT); setCopied(true); }
    catch { if (!dialog.current?.open) dialog.current?.showModal(); dialog.current?.querySelector('textarea')?.select(); }
  }
  return <div className="ai-team-tools">
    <button onClick={copy}>{copied ? 'Copied ✓' : 'Copy full workflow ↗'}</button>
    <button className="ai-team-secondary" onClick={() => dialog.current?.showModal()}>View full prompt</button>
    <a href="/growth-engineering/build-your-ai-marketing-team.md" download>Download prompt ↓</a>
    <dialog ref={dialog} className="ge-dialog" aria-labelledby={titleId}>
      <div className="ge-dialog-head"><h2 id={titleId}>Build Your AI Marketing Team</h2><button onClick={() => dialog.current?.close()}>Close ×</button></div>
      <p>Set up the team → build the site → refine a static ad → research and refine the video → review and send to your Zernio connection.</p>
      <textarea aria-label="Full AI marketing team workflow prompt" readOnly value={MARKETING_TEAM_PROMPT} onFocus={e => e.target.select()}/>
      <button onClick={copy}>{copied ? 'Copied ✓' : 'Copy full workflow'}</button>
    </dialog>
  </div>;
}
