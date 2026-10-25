import {readFileSync,writeFileSync} from 'node:fs';
const rows=JSON.parse(readFileSync(new URL('./input.json',import.meta.url)));
const seen=new Set(),valid=[],excluded=[];
for(const r of rows){const reason=seen.has(r.week)?'duplicate week':!Number.isFinite(r.received)||!Number.isFinite(r.reviewed)?'missing/non-numeric count':r.received<0||r.reviewed<0||r.reviewed>r.received?'invalid cohort counts':null;seen.add(r.week);if(reason){excluded.push({row:r,reason});continue;}valid.push({...r,review_rate:r.received===0?null:r.reviewed/r.received});}
const total=valid.reduce((a,r)=>({received:a.received+r.received,reviewed:a.reviewed+r.reviewed}),{received:0,reviewed:0});
writeFileSync(new URL('./output.json',import.meta.url),JSON.stringify({synthetic:true,definition:'reviewed / received for same weekly cohort; zero received = not applicable',valid,excluded,total,pooled_rate:total.received?total.reviewed/total.received:null,decision_status:'analyst_review_required'},null,2));console.log('Saved output.json. Verify source rows before interpreting.');
