import {readFileSync,writeFileSync} from 'node:fs';
const input=JSON.parse(readFileSync(new URL('./input.json',import.meta.url)));
const seen=new Set(),tasks=[],exceptions=[];
for(const r of input.requests){if(seen.has(r.id)||r.duplicate_of){exceptions.push({id:r.id,reason:'duplicate',reference:r.duplicate_of||r.id});continue;}seen.add(r.id);if(!r.due_date)exceptions.push({id:r.id,reason:'missing due date'});tasks.push({id:r.id,owner:r.kind==='invoice'?'Finance':r.owner,due_date:r.due_date||null,status:'draft',approval_required:true});}
writeFileSync(new URL('./output.json',import.meta.url),JSON.stringify({report_date:input.report_date,tasks,exceptions,external_action_taken:false},null,2));console.log('Saved reviewable routing; no tasks created or invoices approved.');
