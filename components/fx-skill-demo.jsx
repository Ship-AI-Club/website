"use client";
import { useEffect, useId, useRef, useState } from 'react';
import { FX_DECK_PRESETS } from '../lib/fx-deck-presets';

export default function FxSkillDemo() {
  const promptId=useId();
  const [preset,setPreset]=useState(FX_DECK_PRESETS[0]);
  const [prompt,setPrompt]=useState(FX_DECK_PRESETS[0].prompt);
  const [access,setAccess]=useState({ready:false,message:'Checking availability…'});
  const [status,setStatus]=useState('Choose a task to get started.');
  const [reply,setReply]=useState('');
  const [events,setEvents]=useState([]);
  const [busy,setBusy]=useState(false);
  const run=useRef(null);
  const output=useRef(null);
  useEffect(()=>{
    const controller=new AbortController();
    fetch('/api/fx-deck',{signal:controller.signal}).then(r=>r.json()).then(setAccess).catch(e=>{if(e.name!=='AbortError')setAccess({ready:false,message:'The assistant is unavailable. Please try again later.'});});
    return ()=>{controller.abort();run.current?.abort();};
  },[]);
  useEffect(()=>{if(output.current)output.current.scrollTop=busy?output.current.scrollHeight:0;},[reply,busy]);
  const choose=p=>{setPreset(p);setPrompt(p.prompt);setReply('');setEvents([]);setStatus('Choose a task to get started.');};
  async function submit(e){
    e.preventDefault();if(busy || !access.ready)return;
    const controller=new AbortController();run.current=controller;
    setBusy(true);setReply('');setEvents([]);setStatus('Working on your draft…');
    let reader;
    let completed=false;
    const apply=event=>{
      if(event.type==='text_delta')setReply(previous=>previous+event.delta);
      if(event.type==='context')setEvents(previous=>[...previous,`Applied the ${event.skill} guide`]);
      if(event.type==='tool_start')setEvents(previous=>[...previous,'Reading the example business brief']);
      if(event.type==='tool_end')setEvents(previous=>[...previous,'Business context ready']);
      if(event.type==='done'){completed=true;}
      if(event.type==='done')setStatus(event.stopReason==='refused'?'Try a different marketing task.':'Ready to review. Check every claim before publishing.');
      if(event.type==='error'){completed=true;setStatus(event.message?.includes('stopped')?'Draft stopped.':'The assistant could not finish. Please try again.');}
    };
    try {
      const response=await fetch('/api/fx-deck',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({skill:preset.id,prompt}),signal:controller.signal});
      if(!response.ok){const body=await response.json();throw new Error(body.error || 'The assistant could not respond. Please try again.');}
      reader=response.body.getReader();const decoder=new TextDecoder();let pending='';
      for(;;){const {done,value}=await reader.read();pending+=decoder.decode(value,{stream:!done});const lines=pending.split('\n');pending=lines.pop();for(const line of lines)if(line.trim())apply(JSON.parse(line));if(done){if(pending.trim())apply(JSON.parse(pending));break;}
      }
      if(!completed)setStatus('The run ended before completion. Try again.');

    } catch(error){setStatus(error.name==='AbortError'?'Run stopped.':error.message);}
    finally{reader?.releaseLock();setBusy(false);run.current=null;}
  }
  return <div className="mk-fx-demo">
    <div className="mk-fx-info"><span className={`mk-assistant-status ${access.ready?'is-ready':''}`} role="status"><span aria-hidden="true" />{access.ready?'Ready to help':'Checking availability…'===access.message?'Checking availability…':'Currently unavailable'}</span><span>Example business: Clearpath · operations consulting</span></div>
    <div className="mk-columns">
      <form className="mk-panel mk-fx-form" onSubmit={submit}>
        <div className="mk-input-label" id={`${promptId}-skill`}>01 <span>Choose a task</span></div>
        <div className="mk-task-choices" role="group" aria-labelledby={`${promptId}-skill`}>{FX_DECK_PRESETS.map((p,i)=><button type="button" key={p.id} className="mk-task-choice" aria-pressed={preset.id===p.id} disabled={busy} onClick={()=>choose(p)}><strong>{['Write','Sharpen','Review'][i]}</strong><span>{['Headline + CTA','A rough draft','Page conversion'][i]}</span></button>)}</div>
        <label className="mk-input-label" htmlFor={promptId}>02 <span>Tell us what to improve</span></label>
        <textarea id={promptId} rows={3} maxLength={1600} required value={prompt} disabled={busy} onChange={e=>setPrompt(e.target.value)} />
        <div className="mk-demo-tools"><button className="mk-button" disabled={!access.ready || busy || !prompt.trim()}>{busy?'Creating your draft…':'Create my draft ↗'}</button>{busy&&<button className="mk-button mk-secondary" type="button" onClick={()=>run.current?.abort()}>Stop drafting</button>}<a href={`/marketing-resources/library/${preset.id}/SKILL.md`} target="_blank" rel="noreferrer">View the writing guide ↗</a></div>
      </form>
      <div className="mk-panel mk-fx-result"><span className="mk-label">Your next draft</span><div ref={output} className="mk-fx-output" tabIndex={0} aria-label="Generated marketing draft">{reply || 'Your draft will appear here. Pick a task, then choose “Create my draft.”'}</div><ul className="mk-fx-events" aria-label="Draft progress">{(events.length>3?[events[0],...events.slice(-2)]:events).map((event,i)=><li key={i}>{event}</li>)}</ul><p className="mk-feedback" role="status">{status}</p></div>
    </div>
  </div>;
}
