import test from 'node:test';
import {reserveFxRun} from '../lib/fx-run-budget.js';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {FX_PROGRAM_SHOWCASES,FX_WORKSHOP_SHOWCASES,fxShowcaseDefinition,fxShowcaseConfig,FX_SHOWCASE_BRIEF} from '../lib/fx-showcase-registry.js';
import {skillSourceFiles,loadShowcaseSkill,showcaseAgentOptions,showcaseFixture} from '../lib/fx-showcase.js';
import {resolveFxShowcaseAccess} from '../lib/fx-showcase-access.js';

test('20 public decks and 18 private workshops map to genuine bundled skill files',async()=>{
 assert.equal(FX_PROGRAM_SHOWCASES.length,20);assert.equal(FX_WORKSHOP_SHOWCASES.length,18);
 for(const definition of [...FX_PROGRAM_SHOWCASES,...FX_WORKSHOP_SHOWCASES]) {
  assert.ok(definition.tasks.length,definition.id);
  for(const task of definition.tasks) {
   assert.ok((await stat(`${task.directory}/SKILL.md`)).isFile());
   const files=await skillSourceFiles(task);assert.ok(files.some(file=>file.name.startsWith('references/')),task.id);
   assert.match(files[0].text,/^---\nname:/);assert.ok(task.prompt.length<1600);
  }
 }
});
test('native skill adapter loads actual instructions and actual reference resources without a model',async()=>{
 const tasks=[...new Map([...FX_PROGRAM_SHOWCASES,...FX_WORKSHOP_SHOWCASES].flatMap(deck=>deck.tasks).map(task=>[task.directory,task])).values()];
 for(const task of tasks) {
  const skill=await loadShowcaseSkill(task);assert.ok(skill.instructions);assert.ok(skill.files.includes('SKILL.md'));assert.match(skill.instructions,/<resource uri=/);
  const options=showcaseAgentOptions(skill);assert.deepEqual(options.tools.map(tool=>tool.name),['read_brief']);
  assert.deepEqual(JSON.parse(await options.tools[0].execute()),showcaseFixture(skill));assert.match(options.instructions,/generation-only/);
 }
});
test('denied workshop access loads no registry definition or source bytes',async()=>{
 let loaded=false;let requested;
 const result=await resolveFxShowcaseAccess('workshop:your-first-agent',{readWorkshopAccess:async(slug,options)=>{requested={slug,options};return {allowed:false};},readDefinition:()=>{loaded=true;throw new Error('must not load');}});
 assert.equal(result,null);assert.equal(loaded,false);assert.deepEqual(requested,{slug:'your-first-agent',options:{audience:'attendee'}});
});
test('host budget identity is available only after verified attendee access returns isHost',async()=>{
 const definition=FX_WORKSHOP_SHOWCASES[0];
 for(const isHost of [false,true]) {
  const result=await resolveFxShowcaseAccess(definition.id,{readWorkshopAccess:async()=>({allowed:true,isHost,user:{id:'verified-user'}}),readDefinition:fxShowcaseDefinition});
  assert.equal(result.hostId,isHost?'verified-user':null);
 }
});
test('client config contains no paths, credentials, host notes or private fixtures',()=>{
 for(const definition of [...FX_PROGRAM_SHOWCASES,...FX_WORKSHOP_SHOWCASES]) {
  const config=fxShowcaseConfig(definition);assert.ok(config.tasks.length);
  assert.doesNotMatch(JSON.stringify(config),/directory|facilitator|hostNotes|API_KEY|content\/|faq|fictionalLeads/);
 }
 assert.equal(fxShowcaseDefinition('workshop:../../.env'),null);
});
test('private skill sources stay out of public assets and client imports',async()=>{
 const client=await readFile('components/fx-deck-showcase.jsx','utf8');
 assert.doesNotMatch(client,/from ['"].*(?:workshop-materials|workshop-skills|fx-workshop-map|fx-showcase-registry)/);
 for(const workshop of FX_WORKSHOP_SHOWCASES) {
  await assert.rejects(stat(`public/workshop-skills/${workshop.slug}/SKILL.md`),{code:'ENOENT'});
 }
 const route=await readFile('app/api/fx-showcase/route.js','utf8');
 assert.ok(route.indexOf('const auth=await authorize(input?.deck)')<route.indexOf('await loadShowcaseSkill(task)'));
 assert.match(route,/task\.prompt/);assert.doesNotMatch(route,/input\.prompt/);
});

test('old and new API runs share concurrency, cooldown and a bounded local allowance',()=>{
 const state={used:0,lastRun:0,active:false};
 const first=reserveFxRun(state,{now:100000});assert.ok(first);
 assert.equal(reserveFxRun(state,{now:120000}),null);
 first();first();assert.equal(state.active,false);
 assert.equal(reserveFxRun(state,{now:110000}),null);
 for(let index=1;index<12;index++){const release=reserveFxRun(state,{now:100000+index*15000});assert.ok(release);release();}
 assert.equal(reserveFxRun(state,{now:100000+12*15000}),null);
 assert.equal(state.used,12);
});

test('selected fixtures retain relevant evidence and exclude unrelated classroom tasks',()=>{
 const meeting=showcaseFixture({task:{id:'meeting-notes'}});assert.equal(meeting.meeting,FX_SHOWCASE_BRIEF.meeting);assert.equal(meeting.delivery,undefined);
 const engineering=showcaseFixture({task:{id:'engineering-review'}});assert.equal(engineering.feature,FX_SHOWCASE_BRIEF.feature);assert.equal(engineering.fictionalLeads,undefined);
 const growth=showcaseFixture({task:{id:'growth-experiment'}});assert.equal(growth.funnel,FX_SHOWCASE_BRIEF.funnel);assert.equal(growth.supportRequests,undefined);
 const knowledge=showcaseFixture({task:{id:'workshop-company-knowledge-engine'}});assert.equal(knowledge.faq,FX_SHOWCASE_BRIEF.faq);assert.equal(knowledge.meeting,undefined);
});
