import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createMaterialDownloadHandler} from '../lib/workshop-material-http.js';
import {resolveWorkshopMaterialAccess} from '../lib/workshop-material-access-policy.js';
import {USERS,PAID_BOOKING} from './fixtures/workshop-material-access.js';
const secret='FIXTURE_HOST_ANSWER_KEY_NEVER_ATTENDEE';
const material={title:'Fixture workshop',durationLabel:'4 hours',timingNote:'Fixture timing',agenda:[],slides:[{type:'text',title:'Attendee slide'}],sources:['Fixture source'],
  guide:{intro:'Attendee introduction',preparation:['Laptop'],steps:[{title:'Build',minutes:10,instructions:['Run fixture'],prompt:'Fixture prompt',done:'Artifact saved',check:'Fixture check'}],deliverables:['Output'],troubleshooting:[{problem:'Missing output',fix:'Retry fixture'}]}};
const notes={preparation:[secret],runOfShow:[{title:'Host timing',minutes:10,notes:['Host instruction']}],answerKeys:[{exercise:'Build',expected:[secret],watchFor:['Review']}],adaptations:['Adapt']};
function handler({user=USERS.attendee,booking=PAID_BOOKING,db=true}={}){
  const calls=[];const GET=createMaterialDownloadHandler({
    authorize:(slug,{audience})=>resolveWorkshopMaterialAccess({slug,audience,user,databaseAvailable:db,
      readHosts:async()=>({facilitator_ids:[USERS.host.id]}),readBooking:async()=>booking}),
    loadAttendee:async slug=>{calls.push(['attendee',slug]);return material;},
    loadHost:async slug=>{calls.push(['host',slug]);return notes;},
    loadBlueprints:async slug=>{calls.push(['blueprints',slug]);return new Uint8Array([80,75,3,4]);},
    loadRoi:async()=>({assumption:'Fixture ROI'}),
    loadHandout:async(slug,file)=>{calls.push(['handout',slug,file]);return new TextEncoder().encode('Fixture attendee handout');},
  });return {calls,get:(slug,file)=>GET(new Request('http://fixture.invalid'),{params:Promise.resolve({slug,file})})};
}
function privateHeaders(response){assert.match(response.headers.get('cache-control'),/private.*no-store/);assert.equal(response.headers.get('vercel-cdn-cache-control'),'no-store');}

test('actual download handler checks every file audience before reading content',async()=>{
  for(const config of [{user:null},{booking:null},{booking:{...PAID_BOOKING,workshop:'other'}},{booking:{...PAID_BOOKING,status:'refunded'}},{booking:{...PAID_BOOKING,status:'cancelled'}},{user:USERS.wrongHost,booking:null},{db:false}]){
    for(const file of ['deck.json','guide.json','guide.md','facilitator-notes.json','facilitator-notes.md','blueprints.zip','workshop.pptx','prompts.md']){
      const h=handler(config);const response=await h.get('vibe-coding-gtm',file);privateHeaders(response);
      assert.ok([401,403,404].includes(response.status));assert.deepEqual(h.calls,[]);assert.ok(!(await response.text()).includes(secret));
    }
  }
});
test('attendee downloads authorize before reading bytes and reject another workshop',async()=>{
  for(const file of ['workshop.pptx','prompts.md']) {
    const h=handler();const response=await h.get('vibe-coding-gtm',file);
    assert.equal(response.status,200);privateHeaders(response);
    assert.ok(h.calls.some(([kind])=>kind==='handout'));
    assert.ok(!h.calls.some(([kind])=>kind==='host'));
    const wrong=handler({user:USERS.host});
    assert.equal((await wrong.get('your-first-agent',file)).status,404);
    assert.deepEqual(wrong.calls,[]);
  }
});
test('scoped administrator can download attendee files and separate host notes',async()=>{
  for(const file of ['workshop.pptx','prompts.md','facilitator-notes.md']) {
    const h=handler({user:USERS.admin});const response=await h.get('vibe-coding-gtm',file);
    assert.equal(response.status,200);privateHeaders(response);
  }
});
test('attendee JSON and markdown never load or expose host notes',async()=>{
  for(const file of ['deck.json','guide.json','guide.md']){
    const h=handler();const response=await h.get('vibe-coding-gtm',file);privateHeaders(response);assert.equal(response.status,200);
    assert.ok(!(await response.text()).includes(secret));assert.ok(!h.calls.some(([kind])=>kind==='host'));
    assert.match(response.headers.get('content-disposition'),/^attachment/);
  }
  for(const file of ['facilitator-notes.json','facilitator-notes.md']){
    const h=handler();assert.equal((await h.get('vibe-coding-gtm',file)).status,403);assert.deepEqual(h.calls,[]);
  }
});
test('scoped host can download facilitator notes separately',async()=>{
  for(const file of ['facilitator-notes.json','facilitator-notes.md']){
    const h=handler({user:USERS.host});const response=await h.get('your-first-agent',file);privateHeaders(response);
    assert.equal(response.status,200);assert.ok((await response.text()).includes(secret));assert.ok(h.calls.some(([kind])=>kind==='host'));
  }
});
test('completed fully discounted checkout passes actual HTTP handler',async()=>{
  const h=handler({booking:{...PAID_BOOKING,amount_paid:0,payment_intent_id:null}});
  assert.equal((await h.get('vibe-coding-gtm','deck.json')).status,200);
});
test('exact file allowlist rejects traversal before all authorization and content reads',async()=>{
  for(const file of ['../guide.md','%2e%2e%2fguide.md','%252e%252e%252fguide.md','constructor','__proto__','guide.md\u0000','unknown.md']){
    let authorizations=0;const GET=createMaterialDownloadHandler({authorize:()=>{authorizations++;throw new Error('must not authorize');}});
    const response=await GET(new Request('http://fixture.invalid'),{params:Promise.resolve({slug:'vibe-coding-gtm',file})});
    assert.equal(response.status,404);privateHeaders(response);assert.equal(authorizations,0);
  }
});
test('organization blueprint archive is scoped and requires authorization',async()=>{
  const h=handler({user:USERS.host});const response=await h.get('build-your-ai-organization','blueprints.zip');privateHeaders(response);
  assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'application/zip');
  const wrong=handler({user:USERS.host});assert.equal((await wrong.get('your-first-agent','blueprints.zip')).status,404);assert.deepEqual(wrong.calls,[]);
  const attendee=handler();assert.equal((await attendee.get('build-your-ai-organization','blueprints.zip')).status,403);assert.deepEqual(attendee.calls,[]);
});
