import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { allocateWorkshopSeat } from '../lib/workshop-allocation.js';
import { safeNext, afterSignIn } from '../lib/nav.js';
import { workshopPrice } from '../lib/vibe-gtm-workshop.js';

test('verified workshop accounts skip program onboarding and unsafe redirects stay local',()=>{
 assert.equal(afterSignIn({},'/workshops/vibe-coding-gtm/checkout'),'/workshops/vibe-coding-gtm/checkout');
 assert.equal(afterSignIn({},'/dashboard'),'/dashboard'); // Dashboard checks workshop access before onboarding.
 for (const path of ['/workshops/materials','/workshops/vibe-coding-gtm/materials/deck','/workshops/vibe-coding-gtm/materials/guide']) assert.equal(afterSignIn({},path),path);
 assert.match(afterSignIn({},'/dashboard/team'),/^\/onboarding\?/);
 for(const next of ['https://evil.example','//evil.example','/\\evil.example']) assert.equal(safeNext(next),'/dashboard');
 assert.equal(workshopPrice('2026-10-08T06:59:59Z').amount,499);
 assert.equal(workshopPrice('2026-10-08T07:00:00Z').amount,999);
});

test('concurrent reservations enforce ten seats and one active seat per account',{skip:!process.env.DATABASE_URL},async()=>{
 const sql=neon(process.env.DATABASE_URL);
 const schema='workshop_test_'+randomUUID().replaceAll('-','');
 // Isolated clones have the production constraints, but contain no real users or bookings.
 await sql.query(`create schema ${schema}`);
 try {
  await sql.query(`create table ${schema}.workshop_inventory (like public.workshop_inventory including all)`);
  await sql.query(`create table ${schema}.workshop_bookings (like public.workshop_bookings including all)`);
  const q=(...args)=>sql(...args);
  q.transaction=queries=>sql.transaction([sql`select set_config('search_path',${schema+',public'},true)`,...queries]).then(rows=>rows.slice(1));
  await sql.query(`insert into ${schema}.workshop_inventory (workshop) values ('capacity'),('same-account')`);
  const results=await Promise.all(Array.from({length:24},()=>allocateWorkshopSeat(q,'capacity',randomUUID(),49900)));
  assert.equal(results.filter(Boolean).length,10);
  assert.equal(new Set(results.filter(Boolean).map(x=>x.seat)).size,10);
  const userId=randomUUID();
  const same=await Promise.all(Array.from({length:12},()=>allocateWorkshopSeat(q,'same-account',userId,49900)));
  assert.equal(same.filter(Boolean).length,1);
  await sql.query(`update ${schema}.workshop_bookings set expires_at=now()-interval '1 hour' where workshop='capacity'`);
  assert.equal(await allocateWorkshopSeat(q,'capacity',randomUUID(),49900),null,'clock alone must not release a Stripe seat');
  await sql.query(`update ${schema}.workshop_bookings set status='expired' where workshop='capacity' and seat=1`);
  assert.equal((await allocateWorkshopSeat(q,'capacity',randomUUID(),49900)).seat,1);
 } finally {await sql.query(`drop schema ${schema} cascade`);}
});
