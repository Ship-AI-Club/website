"use client";

import { useRef, useState } from 'react';

export default function WorkshopPrompt({ prompt, label = 'Example prompt', defaultOpen = false, inline = false, preview, destination }) {
  const [status, setStatus] = useState('');
  const fullPrompt = useRef(null);
  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setStatus(`Copied. Paste into ${destination || (inline ? 'Claude Code' : 'your coding tool')}.`);
    } catch {
      setStatus(preview ? 'Open the full prompt below and copy its text.' : 'Select the prompt text below and copy it manually.');
    }
  }
  if (inline) return <section className="wm-slide-prompt wm-prompt-inline" data-deck-input aria-label={label}>
    <div className="wm-prompt-actions"><strong>{label}</strong><button type="button" onClick={copy}>Copy prompt</button><span role="status">{status}</span></div>
    <pre tabIndex={0} aria-label={`${label} text`}>{preview || prompt}</pre>{preview && <><button className="wm-full-prompt-open" type="button" onClick={()=>fullPrompt.current.showModal()}>Read the full prompt</button><dialog ref={fullPrompt} className="wm-full-prompt-dialog" aria-label={`${label} · full prompt`}><div className="wm-full-prompt-header"><h2>Full prompt</h2><button type="button" onClick={copy}>Copy prompt</button><button type="button" onClick={()=>fullPrompt.current.close()}>Close</button></div><p className="wm-full-prompt-status" role="status">{status || `Copy this entire prompt into ${destination || 'Claude Code'}.`}</p><div className="wm-full-prompt-body" tabIndex={0} aria-label="Scrollable full prompt"><pre tabIndex={0} aria-label="Full prompt text">{prompt}</pre></div></dialog></>}
  </section>;
  return <details className="wm-slide-prompt" open={defaultOpen} data-deck-input>
    <summary>{label}</summary>
    <div className="wm-prompt-actions"><button type="button" onClick={copy}>Copy prompt</button><span role="status">{status}</span></div>
    <pre tabIndex={0}>{prompt}</pre>
  </details>;
}
