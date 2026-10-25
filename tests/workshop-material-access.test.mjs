import { test } from 'node:test';
import assert from 'node:assert/strict';
import { materialFileSpec, resolveWorkshopMaterialAccess, workshopMaterialDefinition,
  WORKSHOP_PRIVATE_HEADERS } from '../lib/workshop-material-access-policy.js';
import { VIBE_GTM } from '../lib/vibe-gtm-workshop.js';
import { USERS, PAID_BOOKING } from './fixtures/workshop-material-access.js';
const access = (overrides = {}) => resolveWorkshopMaterialAccess({
  slug: 'vibe-coding-gtm', audience: 'attendee', user: USERS.attendee,
  databaseAvailable: true, readHosts: async () => ({facilitator_ids: [USERS.host.id]}),
  readBooking: async () => ({...PAID_BOOKING}), ...overrides,
});
test('unauthenticated user cannot read materials or cause booking lookups', async () => {
  assert.equal((await access({user: null, readBooking: () => assert.fail('must not query')})).reason, 'unauthenticated');
});
test('only verified payment for this account and workshop grants attendee access', async () => {
  assert.equal((await access()).allowed, true);
  for (const booking of [null, {...PAID_BOOKING, workshop:'other-workshop'},
    {...PAID_BOOKING, user_id:USERS.wrongHost.id}, {...PAID_BOOKING, status:'pending'},
    {...PAID_BOOKING, status:'expired'}, {...PAID_BOOKING, status:'cancelled'},
    {...PAID_BOOKING, status:'refunded'}, {...PAID_BOOKING, refunded_at:'2026-10-02'},
    {...PAID_BOOKING, paid_at:null}, {...PAID_BOOKING, amount_paid:-1},
    {...PAID_BOOKING, amount_paid:null}, {...PAID_BOOKING, payment_intent_id:null},
    {...PAID_BOOKING, checkout_session_id:null}]) {
    assert.equal((await access({readBooking:async()=>booking})).allowed, false, JSON.stringify(booking));
  }
});
test('full refunds revoke access; partial refunds retaining a paid booking keep access', async () => {
  assert.equal((await access({readBooking:async()=>({...PAID_BOOKING,status:'refunded',refunded_at:'2026-10-02'})})).allowed,false);
  assert.equal((await access({readBooking:async()=>({...PAID_BOOKING,amount_paid:24950})})).allowed,true);
});
test('facilitator notes require the exact workshop host or scoped administrator', async () => {
  assert.equal((await access({audience:'host',user:USERS.host})).isHost,true);
  assert.equal((await access({audience:'host'})).allowed,false);
  assert.equal((await access({user:USERS.wrongHost,readBooking:async()=>null})).allowed,false);
  assert.equal((await access({audience:'host',user:USERS.wrongHost})).allowed,false);
  assert.equal((await access({audience:'host',user:USERS.host,readHosts:async()=>({facilitator_ids:[USERS.wrongHost.id]})})).allowed,false);
});
test('verified admins can access October 10 attendee and facilitator materials only', async () => {
  for (const audience of ['attendee','host']) {
    const result=await access({user:USERS.admin,audience,readHosts:()=>assert.fail('admin does not need host assignment'),readBooking:()=>assert.fail('admin does not need a booking')});
    assert.equal(result.allowed,true);
    assert.equal(result.isAdmin,true);
    assert.equal(result.isHost,false);
  }
  assert.equal((await access({slug:'your-first-agent',user:USERS.admin,readBooking:async()=>null})).allowed,false);
  assert.equal((await access({user:USERS.admin,databaseAvailable:false})).allowed,false);
});
test('VIBE configured fallback applies only to a successful lookup with no row', async () => {
  const user = {id:VIBE_GTM.instructorIds[0],roles:[]};
  assert.equal((await access({user,readHosts:async()=>null})).isHost,true);
  for (const readHosts of [async()=>({facilitator_ids:[]}),async()=>undefined,
    async()=>({facilitator_ids:null}),async()=>{throw new Error('offline');}]) {
    assert.equal((await access({user,readHosts,readBooking:async()=>null})).allowed,false);
  }
});
test('missing DB, unknown mapping, read failures and invalid audience fail closed', async () => {
  for (const overrides of [{databaseAvailable:false,user:USERS.host}, {slug:'unknown'},
    {slug:'__proto__'}, {slug:'vibe-coding-gtm-2026-10-10'}, {audience:'admin'},
    {readHosts:async()=>{throw new Error('DB failure');}},
    {readBooking:async()=>{throw new Error('DB failure');}}]) {
    assert.equal((await access(overrides)).allowed,false);
  }
  assert.equal(workshopMaterialDefinition('vibe-coding-gtm').bookingId,PAID_BOOKING.workshop);
  assert.equal(workshopMaterialDefinition('your-first-agent').bookingId,null);
  assert.equal((await access({slug:'your-first-agent'})).allowed,false);
  assert.equal((await access({slug:'your-first-agent',user:USERS.host})).isHost,true);
});
test('forged cookies, query fields, headers and roles are not policy inputs', async () => {
  const result = await access({user:null, cookie:'shipai_session=forged',
    headers:{'x-user-id':USERS.host.id,'x-role':'admin'}, token:'paid',
    query:{user_id:USERS.host.id,paid:true}, is_admin:true});
  assert.equal(result.allowed,false);
});
test('download allowlist rejects traversal, double encoding and prototype names', () => {
  for (const name of ['deck.json','guide.json','guide.md']) assert.equal(materialFileSpec(name).audience,'attendee');
  for (const name of ['facilitator-notes.json','facilitator-notes.md']) assert.equal(materialFileSpec(name).audience,'host');
  for (const name of ['../guide.md','%2e%2e%2fguide.md','%252e%252e%252fguide.md',
    '/guide.md','guide.md/','guide.md?download=1','GUIDE.md','guide.md\u0000',
    'facilitator-notes.md/../guide.md','constructor','__proto__','toString',null,['guide.md']]) {
    assert.equal(materialFileSpec(name),null,String(name));
  }
});
test('private material responses disable browser and CDN storage and indexing', () => {
  assert.match(WORKSHOP_PRIVATE_HEADERS['Cache-Control'],/private.*no-store/);
  assert.equal(WORKSHOP_PRIVATE_HEADERS['Vercel-CDN-Cache-Control'],'no-store');
  assert.equal(WORKSHOP_PRIVATE_HEADERS.Vary,'Cookie');
  assert.match(WORKSHOP_PRIVATE_HEADERS['X-Robots-Tag'],/noindex/);
});

test('completed fully discounted tickets qualify without a PaymentIntent', async () => {
  assert.equal((await access({readBooking:async()=>({...PAID_BOOKING,amount_paid:0,payment_intent_id:null})})).allowed,true);
  assert.equal((await access({readBooking:async()=>({...PAID_BOOKING,amount_paid:0,paid_at:null,payment_intent_id:null})})).allowed,false);
});
