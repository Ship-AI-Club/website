import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { UPCOMING_WORKSHOPS } from '../lib/workshops.js';
import { FX_WORKSHOP_SHOWCASES } from '../lib/fx-showcase-registry.js';
import { AI_ORGANIZATION_EVENT } from '../lib/ai-organization-event.js';
import { FIXTURE_AUTH_SECRET,FIXTURE_DATABASE_URL,startMaterialsNeonFixture } from './fixtures/materials-neon-server.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const slugs=['vibe-coding-gtm',AI_ORGANIZATION_EVENT.slug,...UPCOMING_WORKSHOPS.map(w=>w.slug)];
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function freePort(){const server=createServer();await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});const port=server.address().port;await new Promise(resolve=>server.close(resolve));return port;}
function privateHeaders(response){assert.match(response.headers.get('cache-control')||'',/no-store/,`private cache header missing for ${response.url}`);assert.match(response.headers.get('x-robots-tag')||'',/noindex/);}
async function parallel(items,fn){for(let offset=0;offset<items.length;offset+=4)await Promise.all(items.slice(offset,offset+4).map(fn));}

test('actual Next workshop pages, RSC, API, downloads and showcase verify scoped sessions', {timeout:240000}, async()=>{
  assert.equal(readdirSync(root).filter(name=>/^\.env(?:\.|$)/.test(name)).length,0,'Fixture launch requires a snapshot without env files');
  assert.equal(slugs.length,18,'Audit the fixture scope if the workshop catalog changes');
  const fixture=await startMaterialsNeonFixture({slugs});const port=await freePort();let logs='';
  const child=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--hostname','127.0.0.1','--port',String(port)],{
    cwd:root,env:{PATH:process.env.PATH,HOME:process.env.HOME,TMPDIR:process.env.TMPDIR,
      NODE_ENV:'development',NEXT_TELEMETRY_DISABLED:'1',NEXT_DIST_DIR:'.next-material-fixture',
      AUTH_SECRET:FIXTURE_AUTH_SECRET,DATABASE_URL:FIXTURE_DATABASE_URL,NEON_LOCAL_PROXY:fixture.url},stdio:['ignore','pipe','pipe']});
  child.stdout.on('data',chunk=>{logs=(logs+chunk).slice(-18000);});child.stderr.on('data',chunk=>{logs=(logs+chunk).slice(-18000);});
  const base=`http://127.0.0.1:${port}`;
  const request=async(path,persona,extra={})=>fetch(`${base}${path}`,{redirect:'manual',headers:{...(persona?{Cookie:fixture.cookies[persona]}:{}),...extra}});
  const api=(slug,file)=>`/api/workshops/${slug}/materials/${file}`;
  const page=(slug,kind)=>`/workshops/${slug}/materials/${kind}`;
  const files=['deck.json','guide.json','guide.md','facilitator-notes.json','facilitator-notes.md'];
  const denied=async(path,persona,headers={})=>{
    const response=await request(path,persona,headers);privateHeaders(response);
    if(response.status===200 && path.startsWith('/workshops/')){
      const body=await response.clone().text();
      if(headers['Next-Router-Prefetch']!=='1')assert.match(body,/Workshop access is required\.|NEXT_REDIRECT/,'Page must render only denial or a login redirect');
      for(const marker of ['Your hands-on workshop guide','Host only · facilitator notes','wm-lesson','wm-exercise'])assert.ok(!body.includes(marker),`Denied page exposed material marker ${marker}`);
    } else assert.ok([307,308,401,403,404,503].includes(response.status),`${persona||'anonymous'} unexpectedly got ${response.status} at ${path}`);
    return response;
  };
  const allowed=async(path,persona,headers={})=>{
    const response=await request(path,persona,headers);privateHeaders(response);
    assert.equal(response.status,200,`${persona} denied ${path}: ${await response.clone().text()}`);
    assert.ok((await response.text()).length>20,'Expected material content');
  };
  try {
    let ready=false;for(let attempt=0;attempt<120;attempt++){
      if(child.exitCode!==null)throw new Error(`Next fixture exited: ${logs}`);
      try{await request('/api/fx-showcase');ready=true;break;}catch{await pause(250);}
    }assert.ok(ready,`Next fixture did not start: ${logs}`);
    // Workshop-only accounts can find their materials without hackathon onboarding.
    for (const persona of ['paid','discounted','admin','host']) {
      const response=await request('/dashboard',persona);
      assert.equal(response.status,200,`${persona} dashboard should not require program onboarding`);
      const html=await response.text();
      assert.match(html,/Open slide deck/);
      assert.match(html,/href="\/workshops\/vibe-coding-gtm\/materials\/deck"/);
      assert.match(html,/href="\/workshops\/vibe-coding-gtm\/materials\/guide"/);
    }
    for (const persona of ['unpaid','refunded','wrongWorkshop']) {
      const response=await request('/dashboard',persona);
      assert.ok([307,308].includes(response.status));
      assert.match(response.headers.get('location'),/^\/onboarding\?/);
    }
    const signedOutDeck=await request(page('vibe-coding-gtm','deck'));
    assert.match(signedOutDeck.headers.get('location'),/next=%2Fworkshops%2Fvibe-coding-gtm%2Fmaterials%2Fdeck/);
    const publicWorkshop=await request('/workshops/vibe-coding-gtm');
    assert.equal(publicWorkshop.status,200);
    const publicHtml=await publicWorkshop.text();
    assert.match(publicHtml,/href="\/workshops\/vibe-coding-gtm\/materials\/deck"/);
    assert.match(publicHtml,/href="\/workshops\/vibe-coding-gtm\/materials\/guide"/);
    // Every workshop's assigned host can read every private surface.
    await parallel(slugs,async slug=>{
      for(const kind of ['deck','guide','facilitator'])await allowed(page(slug,kind),'host');
      for(const file of files)await allowed(api(slug,file),'host');
      await denied(page(slug,'deck'));
      await denied(api(slug,'guide.md'),'unpaid');
      await denied(api(slug,'facilitator-notes.md'),'wrongHost');
    });
    // Verified admins may read only this workshop without a paid booking.
    for(const kind of ['deck','guide','facilitator'])await allowed(page('vibe-coding-gtm',kind),'admin');
    for(const file of [...files,'prompts.md','workshop.pptx'])await allowed(api('vibe-coding-gtm',file),'admin');
    await denied(api('your-first-agent','deck.json'),'admin');
    await allowed(api('build-your-ai-organization','blueprints.zip'),'host');
    await denied(api('build-your-ai-organization','blueprints.zip'),'paid');
    // Direct links and RSC/prefetch are independently checked, never trusted
    // merely because an authorized browser previously rendered a page.
    for(const persona of [undefined,'unpaid','wrongWorkshop','wrongHost','refunded','cancelled','expiredSession','revokedSession']){
      for(const file of [...files,'prompts.md','workshop.pptx'])await denied(api('vibe-coding-gtm',file),persona);
      for(const kind of ['deck','guide','facilitator']){
        await denied(page('vibe-coding-gtm',kind),persona,{RSC:'1'});
        await denied(page('vibe-coding-gtm',kind),persona,{RSC:'1','Next-Router-Prefetch':'1'});
      }
    }
    for(const persona of ['paid','discounted']){
      for(const kind of ['deck','guide'])await allowed(page('vibe-coding-gtm',kind),persona);
      for(const file of ['deck.json','guide.json','guide.md','prompts.md','workshop.pptx'])await allowed(api('vibe-coding-gtm',file),persona);
      await denied(page('vibe-coding-gtm','facilitator'),persona);
      await denied(api('vibe-coding-gtm','facilitator-notes.json'),persona);
      await parallel(slugs.filter(slug=>slug!=='vibe-coding-gtm'),slug=>denied(api(slug,'deck.json'),persona));
    }
    // Update the same fixture booking after a successful response: no cached
    // paid result may survive a persisted full refund or host reassignment.
    fixture.state.bookings.get(fixture.users.paid.id).status='refunded';
    fixture.state.bookings.get(fixture.users.paid.id).refunded_at='2026-10-02T00:00:00Z';
    await denied(api('vibe-coding-gtm','guide.md'),'paid');
    await denied(page('vibe-coding-gtm','deck'),'paid',{RSC:'1'});
    fixture.state.hostAssignments.set('vibe-coding-gtm',[]);
    await denied(api('vibe-coding-gtm','facilitator-notes.md'),'host');
    await denied(api('vibe-coding-gtm','guide.md'),undefined,{'Cookie':'shipai_session=forged','x-user-id':fixture.users.host.id,'x-role':'admin'});
    for(const file of ['unknown.md','constructor','%252e%252e%252fguide.md'])await denied(api('vibe-coding-gtm',file),'host');
    const showcase=await request('/api/fx-showcase');assert.equal(showcase.status,403);privateHeaders(showcase);
    await parallel(FX_WORKSHOP_SHOWCASES,async definition=>{
      const source=`/api/fx-showcase?deck=${encodeURIComponent(definition.id)}&skill=${encodeURIComponent(definition.tasks[0].id)}&file=SKILL.md`;
      await denied(source);
      await denied(source,'wrongHost');
      // VIBE's assignment was revoked above; the remaining host assignments
      // still authorize exact allowlisted source files without a model call.
      if(definition.slug!=='vibe-coding-gtm')await allowed(source,'host');
    });
    for(const persona of [undefined,'wrongWorkshop','refunded','wrongHost']){
      const response=await fetch(`${base}/api/fx-showcase`,{method:'POST',headers:{'Content-Type':'application/json',...(persona?{Cookie:fixture.cookies[persona]}:{})},
        body:JSON.stringify({deck:'workshop:vibe-coding-gtm',skill:'workshop-vibe-coding-gtm'})});
      assert.equal(response.status,403);privateHeaders(response);
    }
    fixture.state.unavailable=true;await denied(api('your-first-agent','guide.md'),'host');
    assert.deepEqual(fixture.rejectedQueries,[],'Fixture must model every auth/material read');
    assert.ok(fixture.queries.some(item=>item.query.includes('from sessions s')),'Actual hashed-session lookup was exercised');
  } catch(error){error.message+=`\nNext fixture logs:\n${logs}`;throw error;}
  finally {child.kill('SIGTERM');await Promise.race([new Promise(resolve=>child.once('exit',resolve)),pause(3000)]);if(child.exitCode===null)child.kill('SIGKILL');await fixture.close();}
});
