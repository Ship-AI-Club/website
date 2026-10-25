import { createServer } from 'node:http';
import { createHash, randomBytes } from 'node:crypto';
export const FIXTURE_AUTH_SECRET = 'workshop-fixture-only-secret';
export const FIXTURE_DATABASE_URL = 'postgresql://fixture:fixture@127.0.0.1/fixture';
const bookingId = 'vibe-coding-gtm-2026-10-07';
const hash = token => createHash('sha256').update(`${FIXTURE_AUTH_SECRET}:${token}`).digest('hex');
function neonResult(rows) {
  const names = [...new Set(rows.flatMap(row => Object.keys(row)))];
  const types = names.map(name => name === 'roles' || name === 'facilitator_ids' ? 1009
    : name === 'is_admin' ? 16 : name === 'amount_paid' ? 23 : 25);
  return { command:'SELECT',rowCount:rows.length,
    fields:names.map((name,index)=>({name,dataTypeID:types[index]})),
    rows:rows.map(row=>names.map((name,index)=>{
      const value=row[name]; if(value == null) return null;
      if(types[index]===1009) return `{${value.join(',')}}`;
      if(types[index]===16) return value?'t':'f';
      return String(value);
    })) };
}
export async function startMaterialsNeonFixture({ slugs = [], previewOrigin = null } = {}) {
  if(previewOrigin && previewOrigin !== 'http://127.0.0.1:3120')throw new Error('Preview origin must be the fixed localhost preview');
  const names=['host','paid','unpaid','wrongWorkshop','wrongHost','refunded','cancelled','discounted','expiredSession','revokedSession','admin'];
  const users=Object.fromEntries(names.map((name,index)=>[name,{id:`00000000-0000-4000-8000-${String(index+1).padStart(12,'0')}`,
    name:`Fixture ${name}`,email:`${name}@example.invalid`,roles:name==='admin'?['admin']:name==='wrongHost'?['host']:[],is_admin:name==='admin'}]));
  const cookies={}; const sessions=new Map();
  for (const name of names) {
    const token=randomBytes(32).toString('base64url');cookies[name]=`shipai_session=${token}`;
    sessions.set(hash(token),{user:users[name],expired:name==='expiredSession',revoked:name==='revokedSession'});
  }
  const paid = (name,overrides={}) => ({workshop:bookingId,user_id:users[name].id,status:'paid',paid_at:'2026-10-01T00:00:00Z',
    refunded_at:null,amount_paid:49900,checkout_session_id:'cs_fixture_only',payment_intent_id:'pi_fixture_only',...overrides});
  const state={unavailable:false,hostAssignments:new Map(slugs.map(slug=>[slug,[users.host.id]])),bookings:new Map([
    [users.paid.id,paid('paid')], [users.wrongWorkshop.id,paid('wrongWorkshop',{workshop:'other-workshop'})],
    [users.refunded.id,paid('refunded',{status:'refunded',refunded_at:'2026-10-02T00:00:00Z'})],
    // Cancellation of an unpaid checkout is represented by expiry in this schema.
    [users.cancelled.id,paid('cancelled',{status:'expired',paid_at:null,amount_paid:null})],
    [users.discounted.id,paid('discounted',{amount_paid:0,payment_intent_id:null})],
  ])};
  const queries=[];const rejectedQueries=[];
  const execute = ({query,params=[]}) => {
    const normalized=query.replace(/\s+/g,' ').trim().toLowerCase();queries.push({query:normalized,params});
    if (!normalized.startsWith('select ')) throw new Error('Fixture permits reads only');
    if (normalized.includes('from sessions s') && normalized.includes('s.token_hash')) {
      if (!normalized.includes('s.revoked_at is null') || !normalized.includes('s.expires_at > now()')) throw new Error('Session query must enforce revocation and expiry');
      const session=sessions.get(params[0]);return neonResult(session&&!session.expired&&!session.revoked?[session.user]:[]);
    }
    if (normalized.includes('as to_score') && normalized.includes('as registered')) return neonResult([{to_score:0,requests:0,certificates:0,registered:0}]);
    if (normalized.startsWith('select * from registrations')) return neonResult([]);
    if (normalized.startsWith('select t.* from teams t') || normalized.startsWith('select c.* from certificates c') || normalized.startsWith('select * from role_requests') || normalized.startsWith('select * from sponsorships') || normalized.startsWith('select * from votes') || normalized.startsWith('select key, value from settings')) return neonResult([]);
    if (normalized.includes('from users where id = any') && normalized.includes('public_profile = true')) return neonResult([]);
    if (normalized.includes('from workshop_media') && normalized.includes('facilitator_ids')) {
      const ids=state.hostAssignments.get(params[0]);return neonResult(ids===undefined?[]:[{facilitator_ids:ids}]);
    }
    if (normalized.includes('from workshop_bookings')) {
      const booking=state.bookings.get(params[1]);return neonResult(booking&&booking.workshop===params[0]?[booking]:[]);
    }
    rejectedQueries.push(normalized);throw new Error(`Unsupported fixture read: ${normalized}`);
  };
  const server=createServer(async(request,response)=>{
    response.setHeader('Content-Type','application/json');
    const previewPersona = request.url?.match(/^\/preview\/(host|paid|admin|unpaid|refunded)$/)?.[1];
    if(previewOrigin && request.method==='GET' && previewPersona){
      response.setHeader('Cache-Control','no-store');
      response.setHeader('Set-Cookie',`${cookies[previewPersona]}; Path=/; HttpOnly; SameSite=Lax`);
      response.writeHead(302,{Location:`${previewOrigin}/workshops/vibe-coding-gtm/materials/deck`});response.end();return;
    }
    if(state.unavailable){response.writeHead(503);response.end(JSON.stringify({message:'Fixture unavailable'}));return;}
    try {
      if(request.method!=='POST') throw new Error('POST only');
      // Never accept a real Neon connection URL, even accidentally.
      if(request.headers['neon-connection-string']!==FIXTURE_DATABASE_URL) throw new Error('Unexpected fixture database URL');
      let body='';for await(const chunk of request){body+=chunk;if(body.length>65536)throw new Error('Request too large');}
      const input=JSON.parse(body);const result=input.queries?{results:input.queries.map(execute)}:execute(input);
      response.end(JSON.stringify(result));
    } catch(error) {response.writeHead(400);response.end(JSON.stringify({message:error.message}));}
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  return {url:`http://127.0.0.1:${server.address().port}/sql`,users,cookies,state,queries,rejectedQueries,
    close:()=>new Promise(resolve=>server.close(resolve))};
}
