import { createFxAgent, getBackendInfo } from 'libfx';
import { createFxDeckTransport } from '../../../lib/fx-deck.js';
import { loadShowcaseSkill, skillSourceFiles, showcaseAgentOptions, fxShowcaseDefinition, fxShowcaseConfig } from '../../../lib/fx-showcase.js';
import { acquireFxRun, productionFxConfigured, takeFxCredit } from '../../../lib/fx-deck-limits.js';
import { resolveFxShowcaseAccess } from '../../../lib/fx-showcase-access.js';
import { workshopMaterialAccess, WORKSHOP_PRIVATE_HEADERS } from '../../../lib/workshop-material-access.js';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=45;
const headers={...WORKSHOP_PRIVATE_HEADERS};
function local(request) {
  if(process.env.NODE_ENV==='production') return false;
  const url=new URL(request.url), names=['localhost','127.0.0.1','[::1]'];
  if(!names.includes(url.hostname)) return false;
  const origin=request.headers.get('origin'); if(!origin) return true;
  try { const source=new URL(origin);return names.includes(source.hostname) && source.host===request.headers.get('host') && source.port===url.port; }
  catch {return false;}
}
function allowed(request) { const url=new URL(request.url);return local(request) || (process.env.NODE_ENV==='production' && ['shipai.club','www.shipai.club'].includes(url.hostname) && request.headers.get('origin')===url.origin); }
function configured() { return process.env.NODE_ENV==='production'?productionFxConfigured():process.env.FX_DECK_ENABLED==='1' && Boolean(process.env.AI_GATEWAY_API_KEY); }
async function authorize(id) {
  return resolveFxShowcaseAccess(id,{readWorkshopAccess:workshopMaterialAccess,readDefinition:fxShowcaseDefinition});
}

export async function GET(request) {
  const url=new URL(request.url);
  const auth=await authorize(url.searchParams.get('deck'));
  if(!auth) return Response.json({error:'These workshop materials are unavailable for this account.'},{status:403,headers});
  const taskId=url.searchParams.get('skill');const filename=url.searchParams.get('file');
  if(taskId || filename) {
    const task=auth.definition.tasks.find(task=>task.id===taskId);
    if(!task || !filename) return Response.json({error:'Unknown guide file.'},{status:404,headers});
    try { const file=(await skillSourceFiles(task)).find(file=>file.name===filename);if(!file) return Response.json({error:'Unknown guide file.'},{status:404,headers});
      return new Response(file.text,{headers:{...headers,'Content-Type':'text/plain; charset=utf-8','Content-Disposition':`inline; filename="${filename.split('/').pop()}"`}});
    } catch { return Response.json({error:'The guide could not be loaded.'},{status:503,headers}); }
  }
  try { const backend=await getBackendInfo({surface:'agent',backend:'native'});const ready=configured() && backend.backend==='native';
    return Response.json({ready,config:fxShowcaseConfig(auth.definition),message:ready?'Ready to work through the example.':'Live drafting is not enabled for this presentation.'},{headers});
  } catch { return Response.json({ready:false,message:'Live drafting could not start.'},{headers}); }
}
export async function POST(request) {
  if(!allowed(request)) return Response.json({error:'Open this exercise from the Ship AI presentation.'},{status:403,headers});
  let input;try {const raw=await request.text();if(raw.length>2400)throw new Error();input=JSON.parse(raw);}catch{return Response.json({error:'Choose a supplied exercise.'},{status:400,headers});}
  const auth=await authorize(input?.deck);if(!auth) return Response.json({error:'These workshop materials are unavailable for this account.'},{status:403,headers});
  const task=auth.definition.tasks.find(task=>task.id===input?.skill);
  if(!task) return Response.json({error:'Choose an exercise from this presentation.'},{status:400,headers});
  if(!configured()) return Response.json({error:'Live drafting is not enabled for this presentation.'},{status:503,headers});
  const release=acquireFxRun();if(!release)return Response.json({error:'Another exercise is running, or the session limit was reached. Wait before trying again.'},{status:429,headers});
  if(process.env.NODE_ENV==='production') {
    try {if(!await takeFxCredit(request,{hostId:auth.hostId})){release();return Response.json({error:'The shared daily exercise limit has been reached. Please try again later.'},{status:429,headers});}}
    catch {release();return Response.json({error:'Exercise availability could not be checked.'},{status:503,headers});}
  }
  const controller=new AbortController();const signal=AbortSignal.any([request.signal,controller.signal,AbortSignal.timeout(40000)]);let agent;
  try {
    const skill=await loadShowcaseSkill(task);
    agent=await createFxAgent({apiKey:process.env.AI_GATEWAY_API_KEY,model:'openai/gpt-4.1-nano',backend:'native',...showcaseAgentOptions(skill),fetch:createFxDeckTransport()});
    const encoder=new TextEncoder();
    const stream=new ReadableStream({async start(out) {
      const emit=event=>{if(!signal.aborted)out.enqueue(encoder.encode(JSON.stringify(event)+'\n'));};
      try {
        emit({type:'context',skill:task.label,files:skill.files});
        const turn=agent.prompt(task.prompt,{signal});
        for await(const event of turn) {if(event.type==='text_delta')emit({type:event.type,delta:event.delta});if(event.type==='tool_start'||event.type==='tool_end')emit({type:event.type,name:event.name});}
        const result=await turn.result;emit({type:'done',stopReason:result.stopReason});
      }catch {emit({type:'error',message:signal.aborted?'Run stopped.':'The example could not finish. Please try again.'});}
      finally {try{await agent.close();}finally{release();try{out.close();}catch{}}}
    },cancel(){controller.abort();}});
    return new Response(stream,{headers:{...headers,'Content-Type':'application/x-ndjson; charset=utf-8'}});
  }catch {try{await agent?.close();}finally{release();}return Response.json({error:'The exercise could not start. Please try again later.'},{status:502,headers});}
}
