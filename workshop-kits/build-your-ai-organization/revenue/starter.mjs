import { readFileSync, writeFileSync } from 'node:fs';
const input=JSON.parse(readFileSync(new URL('./input.json',import.meta.url)));
const result={opportunity_id:input.id,status:'draft',source_refs:input.source_refs,knowns:input.notes,gaps:['Budget unknown','Purchasing authority unknown'],follow_up_draft:'Thanks for discussing the three-office intake workflow. Who will review a discovery-session proposal?',next_action:{owner:input.owner,due_date:null,action:'Review brief and confirm one qualification question'},external_action_taken:false};
writeFileSync(new URL('./output.json',import.meta.url),JSON.stringify(result,null,2));
console.log('Saved draft output.json; account owner must review.');
