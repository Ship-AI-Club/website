import { readFileSync,writeFileSync } from 'node:fs';
const input=JSON.parse(readFileSync(new URL('./input.json',import.meta.url)));
const asset=`# Draft · ${input.campaign_id}

One intake view for your next office move

Explore your office-intake workflow in a discovery conversation.

CTA: Request a discovery conversation

Evidence supplied: ${input.evidence.join(', ')}. No customer-result claims supplied.

Channel draft: Managing requests across several offices? Start with a map of your intake workflow. Request a discovery conversation.

Human review required. Synthetic sample; do not publish.
`;
writeFileSync(new URL('./asset-draft.md',import.meta.url),asset);console.log('Saved asset-draft.md. Review against DESIGN.md and voice.md.');
