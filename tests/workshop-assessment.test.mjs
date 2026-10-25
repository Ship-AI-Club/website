import test from 'node:test';
import assert from 'node:assert/strict';
import { assessmentCatalogue, eligibleFirstWorkshops, validateAssessment, publicRecommendation } from '../lib/workshop-assessment.js';
const request={experience:'new',role:'founder',focus:'agents',goal:'One useful agent',requestId:'12345678-1234-1234-1234-123456789abc'};
test('rejects malformed profile and bounded free text before AI',()=>{
 assert.equal(validateAssessment(request),null);
 for(const field of ['experience','role','focus']) assert.ok(validateAssessment({...request,[field]:'fake'}));
 assert.ok(validateAssessment({...request,goal:'x'.repeat(241)}));
 assert.ok(validateAssessment({...request,requestId:'anything'}));
});
test('first workshop eligibility respects coding experience',()=>{
 const catalogue=assessmentCatalogue();
 assert.ok(!eligibleFirstWorkshops('new',catalogue).some(w=>w.slug==='build-your-ai-software-factory'));
 assert.ok(!eligibleFirstWorkshops('ai-user',catalogue).some(w=>w.slug==='build-your-first-agentic-workflow'));
 assert.ok(eligibleFirstWorkshops('vibe-coder',catalogue).some(w=>w.slug==='build-your-first-agentic-workflow'));
 assert.ok(!eligibleFirstWorkshops('vibe-coder',catalogue).some(w=>w.slug==='ai-prototype-to-production'));
 assert.ok(eligibleFirstWorkshops('developer',catalogue).some(w=>w.slug==='build-your-ai-software-factory'));
 assert.ok(!catalogue.some(w=>w.slug==='ai-ops-team'));
});
test('scheduled event disappears after event and prices use current promotion',()=>{
 assert.equal(assessmentCatalogue(Date.parse('2026-10-01')).find(w=>w.slug==='vibe-coding-gtm').price,499);
 assert.equal(assessmentCatalogue(Date.parse('2026-10-07T23:59:59-07:00')).find(w=>w.slug==='vibe-coding-gtm').price,499);
 assert.equal(assessmentCatalogue(Date.parse('2026-10-08T00:00:00-07:00')).find(w=>w.slug==='vibe-coding-gtm').price,999);
 assert.ok(!assessmentCatalogue(Date.parse('2026-10-11')).some(w=>w.slug==='vibe-coding-gtm'));
});
test('model output cannot invent workshops, pricing, or duplicate next step',()=>{
 const output={first:'your-first-agent',next:'build-your-first-agentic-workflow',reason:'Start with one useful agent.',prepare:'Bring a laptop.'};
 const result=publicRecommendation(output,assessmentCatalogue());
 assert.equal(result.first.price,299);
 assert.equal(result.first.path,'/workshops/your-first-agent');
 assert.throws(()=>publicRecommendation({...output,first:'fake'},assessmentCatalogue()));
 assert.throws(()=>publicRecommendation({...output,next:output.first},assessmentCatalogue()));
 assert.throws(()=>publicRecommendation({...output,reason:'x'.repeat(321)},assessmentCatalogue()));
});
