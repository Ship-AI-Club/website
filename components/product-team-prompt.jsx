'use client';

import {useId, useRef, useState} from 'react';

export default function ProductTeamPrompt({label='Open prompt', title='Starter prompt', prompt, compact=false, description='Use this with the matching bot. Review its output before the next stage.', copiedMessage='Copied. Paste this into Grok Bot.', copyOnOpen=false}) {
  const dialog=useRef(null);
  const id=useId();
  const [status,setStatus]=useState('');
  async function copy(){
    try {await navigator.clipboard.writeText(prompt);setStatus(copiedMessage);}
    catch {setStatus('Select the prompt below and copy it with your keyboard.');}
  }
  return <>
    <button type="button" className={`pt-prompt-button${compact?' is-compact':''}`} onClick={()=>{setStatus('');dialog.current.showModal();if(copyOnOpen)copy();}}>{label}<span aria-hidden="true">↗</span></button>
    <dialog ref={dialog} className="pt-prompt-dialog" aria-labelledby={id}>
      <div className="pt-dialog-head"><h2 id={id}>{title}</h2><button type="button" onClick={()=>dialog.current.close()} aria-label="Close prompt">×</button></div>
      <p>{description}</p>
      <textarea readOnly aria-label={`${title} text`} value={prompt} spellCheck={false}/>
      <div className="pt-dialog-actions"><button type="button" onClick={copy}>Copy prompt</button><span role="status">{status}</span></div>
    </dialog>
  </>;
}
