'use client';

import {useId,useRef,useState} from 'react';

const checks=[
  ['audience','Can a visitor tell who the site is for?','Clarify the audience in the opening headline.'],
  ['offer','Does the page explain a specific offer?','Say what the customer receives and why it helps.'],
  ['nextStep','Does the next step work on a phone?','Walk the main action on a phone and fix its friction.'],
];

export default function ProductExperienceLab(){
  const dialog=useRef(null), id=useId();
  const [answers,setAnswers]=useState({}), [result,setResult]=useState(null),[error,setError]=useState(''),[handoff,setHandoff]=useState(false);
  function submit(event){
    event.preventDefault();
    if(checks.some(([key])=>!answers[key])){setError('Answer all three questions to get a useful next step.');return;}
    const gaps=checks.filter(([key])=>answers[key]==='no');
    setResult({ready:3-gaps.length,actions:gaps.length?gaps.map(x=>x[2]):['Show the page to someone in your target market. Ask them to explain the offer and try the next step.']});
    setError('');setHandoff(false);
  }
  return <>
    <button type="button" className="pt-prompt-button" onClick={()=>dialog.current.showModal()}>Try a readiness assessment <span aria-hidden="true">↗</span></button>
    <dialog ref={dialog} className="pt-prompt-dialog pt-experience-dialog" aria-labelledby={id}>
      <div className="pt-dialog-head"><h2 id={id}>Is your marketing site ready to test?</h2><button type="button" onClick={()=>dialog.current.close()} aria-label="Close assessment">×</button></div>
      <p>Workshop example. Three answers produce a useful plan on this page. Nothing is sent or connected.</p>
      <form onSubmit={submit}>
        {checks.map(([key,label])=><fieldset key={key}><legend>{label}</legend>{[['yes','Yes'],['no','Not yet']].map(([value,name])=><label key={value}><input type="radio" name={key} value={value} checked={answers[key]===value} onChange={()=>{setAnswers(a=>({...a,[key]:value}));setResult(null);setHandoff(false);}}/>{name}</label>)}</fieldset>)}
        {error&&<p role="alert" className="pt-lab-error">{error}</p>}
        <button type="submit">Get my readiness plan</button>
      </form>
      {result&&<section className="pt-lab-result" aria-live="polite"><h3>{result.ready} of 3 basics ready</h3><p>Based only on your answers. This is a checklist, not a conversion forecast.</p><ul>{result.actions.map(action=><li key={action}>{action}</li>)}</ul><button type="button" onClick={()=>setHandoff(true)}>Preview the Grok Bot handoff</button></section>}
      {handoff&&<section className="pt-lab-handoff" aria-live="polite"><h3>A useful result, then a relevant next step</h3><ol><li><strong>Example notification:</strong> A visitor completed the readiness check and requested follow-up.</li><li><strong>First response:</strong> “Your readiness check has {result.ready} of 3 basics covered. Your next step: {result.actions[0]}”</li><li><strong>Optional Gmail:</strong> Prepare that approved response through the bot’s built-in connector, if relevant and connected.</li></ol><p>This is a dry-run preview with a simulated follow-up request. A live site needs server validation, the participant’s authenticated webhook, and an enabled response policy. No webhook or email was sent.</p></section>}
    </dialog>
  </>;
}
