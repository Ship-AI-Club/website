// Explicit, build-only assignment approved by Santos on 2026-10-02 UTC.
// No role grants, accounts, credentials, bookings or payments are created.
import { neon } from '@neondatabase/serverless';
import { UPCOMING_WORKSHOPS } from '../lib/workshops.js';
import { AI_ORGANIZATION_EVENT } from '../lib/ai-organization-event.js';
import { resolveWorkshopMaterialAccess } from '../lib/workshop-material-access-policy.js';
const approval='santos-all-18-raj-oct10-20261002';
if(process.env.SHIPAI_APPROVED_HOST_ASSIGNMENT!==approval){console.log('Host assignments unchanged: no explicit build approval.');process.exit(0);}
if(process.env.VERCEL!=='1'||process.env.VERCEL_ENV!=='production'||!process.env.DATABASE_URL||process.env.NEON_LOCAL_PROXY)throw Error('Approved assignment requires the existing Vercel production database.');
const sql=neon(process.env.DATABASE_URL);
const santos='a4f16ea4-1faa-48e2-8217-8d497c66e4be',raj='5e64fe05-f818-4a96-a34c-4c25de77d48c';
const slugs=['vibe-coding-gtm',...UPCOMING_WORKSHOPS.map(w=>w.slug),AI_ORGANIZATION_EVENT.slug];
if(slugs.length!==18||new Set(slugs).size!==18)throw Error('Expected exactly the approved 18 workshops.');
const people=await sql`select id,name,public_profile,email from users where id=any(${[santos,raj]}::uuid[])`;
if(people.length!==2||!people.find(p=>p.id===santos&&p.name==='Santos Hernandez'&&p.public_profile)||!people.find(p=>p.id===raj&&p.name==='Raj Shah'&&p.public_profile))throw Error('Approved host identity/public profile did not match; no assignment made.');
const before=await sql`select slug,facilitator_ids from workshop_media where slug=any(${slugs}::text[]) order by slug`;
const bookingSummary=await sql`select workshop,status,count(*)::int as count,count(*) filter(where amount_paid=0)::int as zero_amount_count from workshop_bookings group by workshop,status order by workshop,status`;
console.log('Verified production host identities:',people.map(p=>({id:p.id,name:p.name})));
console.log('Santos verified account sign-in address:',people.find(p=>p.id===santos).email);
console.log('Santos existing sign-in email matches connected profile:',people.find(p=>p.id===santos).email==='santos@desic.xyz');
console.log('Production booking aggregates (read-only):',bookingSummary);
console.log('Previous approved workshop host rows:',before);
// Single atomic statement, guarded again by exact public-profile identities.
// Add approved IDs while preserving existing covers and any existing cohosts.
const assigned=await sql`with approved as (
 select count(*)=2 as valid from users where public_profile=true and
 ((id=${santos}::uuid and name='Santos Hernandez') or (id=${raj}::uuid and name='Raj Shah'))
), requested as (select unnest(${slugs}::text[]) as slug)
insert into workshop_media(slug,cover_url,facilitator_ids)
select slug,case when slug='vibe-coding-gtm' then '/workshop-art/website-marketing-instructors.png' else '' end,
 case when slug='vibe-coding-gtm' then ${[santos,raj]}::uuid[] else ${[santos]}::uuid[] end
from requested,approved where approved.valid
on conflict(slug) do update set facilitator_ids=(select array_agg(distinct person order by person) from unnest(coalesce(workshop_media.facilitator_ids,'{}'::uuid[])||excluded.facilitator_ids) as person),updated_at=now()
returning slug,facilitator_ids`;
if(assigned.length!==18||assigned.some(a=>!a.facilitator_ids.includes(santos))||!assigned.find(a=>a.slug==='vibe-coding-gtm').facilitator_ids.includes(raj))throw Error('Assignment verification failed.');
const readHosts=async slug=>(await sql`select facilitator_ids from workshop_media where slug=${slug}`)[0]||null;
const readBooking=async(bookingId,userId)=>(await sql`select workshop,user_id,status,paid_at,refunded_at,amount_paid,checkout_session_id,payment_intent_id from workshop_bookings where workshop=${bookingId} and user_id=${userId}::uuid order by created_at desc,id desc limit 1`)[0]||null;
for(const slug of slugs){
 const access=await resolveWorkshopMaterialAccess({slug,audience:'host',user:people.find(p=>p.id===santos),databaseAvailable:true,readHosts,readBooking});
 if(!access.allowed||!access.isHost)throw Error('Santos host entitlement failed: '+slug);
}
const rajAccess=await resolveWorkshopMaterialAccess({slug:'vibe-coding-gtm',audience:'host',user:people.find(p=>p.id===raj),databaseAvailable:true,readHosts,readBooking});
if(!rajAccess.allowed||!rajAccess.isHost)throw Error('Raj October10 host entitlement failed.');
// Real paid/refunded records are checked without emitting attendee identities.
const bookings=await sql`select workshop,user_id,status,paid_at,refunded_at,amount_paid,checkout_session_id,payment_intent_id from workshop_bookings where workshop='vibe-coding-gtm-2026-10-07' and status=any(${['paid','refunded']}::text[])`;
let paidChecked=0,zeroChecked=0,refundChecked=0;
for(const b of bookings){
 const user={id:b.user_id};const hosts=await readHosts('vibe-coding-gtm');
 if(hosts?.facilitator_ids.includes(user.id))continue;
 const result=await resolveWorkshopMaterialAccess({slug:'vibe-coding-gtm',user,databaseAvailable:true,readHosts:async()=>hosts,readBooking:async()=>b});
 if(b.status==='refunded'){if(result.allowed)throw Error('Existing refunded booking unexpectedly allowed.');refundChecked++;}
 else {if(!result.allowed)throw Error('Existing paid booking did not satisfy verified entitlement.');paidChecked++;if(b.amount_paid===0)zeroChecked++;}
}
console.log(JSON.stringify({approvedAssignments:18,santosHostEntitlements:18,rajOctober10Host:true,realPaidBookingPoliciesChecked:paidChecked,realZeroAmountBookingPoliciesChecked:zeroChecked,realRefundedBookingPoliciesChecked:refundChecked,otherAttendeeMappings:'remain closed',verification:'Production database rows + server policy; HTTP session checks separate'}));
