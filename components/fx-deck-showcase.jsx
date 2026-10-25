'use client';
import { useEffect, useId, useRef, useState } from 'react';

// Only attendee-safe metadata is passed from the server. No private module imports.
export default function FxDeckShowcase({config}) {
  const uid=useId();const [task,setTask]=useState(config?.tasks?.[0]);
  const [access,setAccess]=useState({ready:false,message:'Checking exercise availability…'});
  const [reply,setReply]=useState('');const [status,setStatus]=useState('Choose a task, then run the example.');
  const [events,setEvents]=useState([]);const [files,setFiles]=useState([]);const [busy,setBusy]=useState(false);const run=useRef(null);
  useEffect(()=>{
    setTask(config?.tasks?.[0]);setReply('');setEvents([]);setFiles([]);
    const controller=new AbortController();
    fetch(`/api/fx-showcase?deck=${encodeURIComponent(config.id)}`,{signal:controller.signal,cache:'no-store'}).then(async response=>{const body=await response.json();if(!response.ok)throw new Error(body.error);return body;}).then(setAccess).catch(error=>{if(error.name!=='AbortError')setAccess({ready:false,message:error.message || 'The exercise is unavailable.'});});
    return ()=>{controller.abort();run.current?.abort();};
  },[config.id]);
  function choose(next){setTask(next);setReply('');setEvents([]);setFiles([]);setStatus('Ready to run this example.');}
  async function submit(event){
    event.preventDefault();if(busy || !access.ready || !task)return;
    const controller=new AbortController();run.current=controller;setBusy(true);setReply('');setEvents([]);setFiles([]);setStatus('Preparing your example…');let reader;let completed=false;
    function apply(item){
      if(item.type==='context'){setFiles(item.files);setEvents(previous=>[...previous,`Using the ${item.skill.toLowerCase()} guide`]);}
      if(item.type==='text_delta')setReply(previous=>previous+item.delta);
      if(item.type==='tool_start')setEvents(previous=>[...previous,'Reading the classroom example']);
      if(item.type==='tool_end')setEvents(previous=>[...previous,'Example context ready']);
      if(item.type==='done'){completed=true;setStatus(item.stopReason==='end_turn'?'Ready to review. Check the draft against the example facts.':'The run stopped before normal completion. Review any partial output and try again.');}
      if(item.type==='error'){completed=true;setStatus(item.message);}
    }
    try{
      const response=await fetch('/api/fx-showcase',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({deck:config.id,skill:task.id}),signal:controller.signal,cache:'no-store'});
      if(!response.ok){const body=await response.json();throw new Error(body.error || 'The exercise could not start.');}
      reader=response.body.getReader();const decoder=new TextDecoder();let pending='';
      for(;;){const {done,value}=await reader.read();pending+=decoder.decode(value,{stream:!done});const lines=pending.split('\n');pending=lines.pop();for(const line of lines)if(line.trim())apply(JSON.parse(line));if(done){if(pending.trim())apply(JSON.parse(pending));break;}}
      if(!completed)setStatus('The run ended before completion. Try again.');
    }catch(error){setStatus(error.name==='AbortError'?'Run stopped.':error.message);}
    finally{reader?.releaseLock();run.current=null;setBusy(false);}
  }
  const link=file=>`/api/fx-showcase?deck=${encodeURIComponent(config.id)}&skill=${encodeURIComponent(task.id)}&file=${encodeURIComponent(file)}`;
  if(!task)return null;
  return <section className="fx-showcase" aria-label="Try a guided exercise">
    <div className="fx-showcase-meta"><span className={`fx-showcase-status ${access.ready?'is-ready':''}`}><span aria-hidden="true" />{access.ready?'Ready to run':access.message}</span><span>{config.example}</span></div>
    <div className="fx-showcase-grid">
      <form className="fx-showcase-form" onSubmit={submit}>
        <label className="fx-showcase-label" htmlFor={`${uid}-task`}><span>01</span> Choose a useful task</label>
        <select className="fx-showcase-select" id={`${uid}-task`} value={task.id} disabled={busy} onChange={event=>choose(config.tasks.find(item=>item.id===event.target.value))}>{config.tasks.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select>
        <p className="fx-showcase-label"><span>02</span> Start with a prepared example</p>
        <p className="fx-showcase-task" tabIndex={0}>{task.prompt}</p>
        <div className="fx-showcase-actions">
          <button className="fx-showcase-primary" type="submit" disabled={!access.ready || busy}>{busy?'Working…':'Run this example ↗'}</button>
          {busy && <button className="fx-showcase-cancel" type="button" onClick={()=>run.current?.abort()}>Stop</button>}
          <a href={link('SKILL.md')} target="_blank" rel="noreferrer">Read the instructions ↗</a>
        </div>
        <small className="fx-showcase-disclosure">This uses an actual reusable skill. {task.firstParty?'Authored by Ship AI. ':''}The result is a draft for you to review.</small>
      </form>
      <div className="fx-showcase-result">
        <strong className="fx-showcase-label">Your example output</strong>
        <div className="fx-showcase-output" tabIndex={0} aria-label="Generated example output" data-deck-input>{reply || 'Your output will appear here when you run the example.'}</div>
        <ul className="fx-showcase-events" aria-label="Exercise progress">{events.map((item,index)=><li key={index}>{item}</li>)}</ul>
        <p className="fx-showcase-feedback" role="status" aria-live="polite">{status}</p>
        {files.length>1 && <details className="fx-showcase-references"><summary>Reference files used</summary>{files.slice(1).map(file=><p key={file}><a href={link(file)} target="_blank" rel="noreferrer">{file.split('/').pop()} ↗</a></p>)}</details>}
      </div>
    </div>
  </section>;
}
