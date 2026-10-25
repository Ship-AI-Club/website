import { createFxAgent, getBackendInfo } from 'libfx';
import { loadFxDeckSkill, fxDeckOptions, createFxDeckTransport } from '../../../lib/fx-deck';
import { productionFxConfigured, takeFxCredit, acquireFxRun } from '../../../lib/fx-deck-limits';
import { FX_DECK_PRESETS } from '../../../lib/fx-deck-presets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 45;
const headers = { 'Cache-Control':'no-store' };
function local(request) {
  const url = new URL(request.url);
  const origin = request.headers.get('origin');
  return process.env.NODE_ENV !== 'production' && ['localhost','127.0.0.1','[::1]'].includes(url.hostname) && (!origin || origin === url.origin);
}
function allowed(request) {
  if (local(request)) return true;
  if (process.env.NODE_ENV !== 'production') return false;
  const url = new URL(request.url);
  return ['www.shipai.club','shipai.club'].includes(url.hostname) && request.headers.get('origin') === url.origin;
}
function configured() { if (process.env.NODE_ENV === 'production') return productionFxConfigured(); return process.env.FX_DECK_ENABLED === '1' && Boolean(process.env.AI_GATEWAY_API_KEY); }
export async function GET(request) {
  if (!local(request) && process.env.NODE_ENV !== 'production') return Response.json({ready:false,message:'The fx runtime is unavailable here.'},{headers});
  try {
    const backend = await getBackendInfo({surface:'agent',backend:'native'});
    const ready = configured() && backend.backend === 'native';
    return Response.json({ready,package:'libfx',version:'0.0.12',backend:backend.backend,message:ready?'Ready to run the selected skill with fx.':'fx is installed. The presenter has not enabled live model access.'},{headers});
  } catch { return Response.json({ready:false,message:'The fx runtime could not start on this server.'},{headers}); }
}
export async function POST(request) {
  if (!allowed(request)) return Response.json({error:'Open the marketing assistant from the Ship AI deck.'},{status:403,headers});
  if (!configured()) return Response.json({error:'The assistant is unavailable. Please try again later.'},{status:503,headers});
  let input;
  try { const raw=await request.text();if(raw.length>2400)throw new Error();input=JSON.parse(raw); } catch { return Response.json({error:'Choose a demo skill and keep the prompt under 1,600 characters.'},{status:400,headers}); }
  const preset = FX_DECK_PRESETS.find(p=>p.id===input?.skill);
  const prompt = typeof input?.prompt === 'string' ? input.prompt.trim() : '';
  if(!preset || !prompt || prompt.length>1600) return Response.json({error:'Choose a demo skill and enter a prompt of 1–1,600 characters.'},{status:400,headers});
  const release=acquireFxRun();
  if(!release) return Response.json({error:'The demo is busy or its request limit has been reached. Wait before the next run.'},{status:429,headers});
  if (process.env.NODE_ENV === 'production') {
    try { if (!await takeFxCredit(request)) { release(); return Response.json({error:'Demo limit reached: six runs per visitor and 30 total per day. Try again later.'},{status:429,headers}); } }
    catch { release(); return Response.json({error:'The demo limits service is unavailable. Please try again later.'},{status:503,headers}); }
  }
  let agent;
  
  const controller=new AbortController();
  const signal=AbortSignal.any([request.signal,controller.signal,AbortSignal.timeout(40000)]);
  try {
    const skill=await loadFxDeckSkill(preset.id);
    agent=await createFxAgent({apiKey:process.env.AI_GATEWAY_API_KEY,model:'openai/gpt-4.1-nano',backend:'native',...fxDeckOptions(skill),fetch:createFxDeckTransport()});
    const encoder=new TextEncoder();
    const stream=new ReadableStream({
      async start(out) {
        const emit=value=>{if(!signal.aborted)out.enqueue(encoder.encode(JSON.stringify(value)+'\n'));};
        try {
          emit({type:'context',skill:skill.name,files:skill.files});
          const turn=agent.prompt(prompt,{signal});
          for await(const event of turn) {
            if(event.type==='text_delta') emit({type:'text_delta',delta:event.delta});
            if(event.type==='tool_start' || event.type==='tool_end') emit({type:event.type,name:event.name});
          }
          const result=await turn.result;
          emit({type:'done',stopReason:result.stopReason});
        } catch { emit({type:'error',message:signal.aborted?'Run stopped.':'The assistant could not finish this draft. Please try again.'}); }
        finally { try { await agent.close(); } finally { release(); }try{out.close();}catch{} }
      },
      cancel() { controller.abort(); },
    });
    return new Response(stream,{headers:{...headers,'Content-Type':'application/x-ndjson; charset=utf-8'}});
  } catch { try { await agent?.close(); } finally { release(); }return Response.json({error:'The assistant could not start. Please try again later.'},{status:502,headers}); }
}
