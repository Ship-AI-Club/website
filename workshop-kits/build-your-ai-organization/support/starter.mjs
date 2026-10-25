import { readFileSync,writeFileSync } from 'node:fs';
const input=JSON.parse(readFileSync(new URL('./input.json',import.meta.url)));
const result={id:input.id,status:'needs_review',category:'appointment-and-policy',source_refs:['KB-1'],response_draft:'I can route your appointment-change request to the account owner. I do not have a refund policy or payment record to confirm a refund.',unresolved_question:'Refund policy and payment context required',operator_owner:input.operator_owner,external_action_taken:false};
writeFileSync(new URL('./output.json',import.meta.url),JSON.stringify(result,null,2));console.log('Saved output.json. Operator review required; nothing sent.');
