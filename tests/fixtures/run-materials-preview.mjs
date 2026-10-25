// Local preview only: no live account, DB, role, payment, or model credentials.
import {spawn} from 'node:child_process';
import {readdirSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {UPCOMING_WORKSHOPS} from '../../lib/workshops.js';
import {AI_ORGANIZATION_EVENT} from '../../lib/ai-organization-event.js';
import {startMaterialsNeonFixture,FIXTURE_AUTH_SECRET,FIXTURE_DATABASE_URL} from './materials-neon-server.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
if(readdirSync(root).some(name=>/^\.env(?:\.|$)/.test(name)))throw new Error('Preview requires a snapshot without env files');
const slugs=['vibe-coding-gtm',AI_ORGANIZATION_EVENT.slug,...UPCOMING_WORKSHOPS.map(w=>w.slug)];
const origin='http://127.0.0.1:3120';
const fixture=await startMaterialsNeonFixture({slugs,previewOrigin:origin});
const loginUrl=fixture.url.replace('/sql','/preview/host');
const sessionFile=fileURLToPath(new URL('../../../preview-session.json',import.meta.url));
writeFileSync(sessionFile,JSON.stringify({description:'Invented local preview host session only; expires when this runner stops.',
  origin,loginUrl,hostCookie:fixture.cookies.host,workshops:slugs,
  instructions:'Open loginUrl in the browser. The localhost fixture sets an HttpOnly invented session cookie and redirects to the actual Next workshop deck. Then use the same browser to open any workshop materials page on origin.'},null,2));
console.log(`Fixture host sign-in: ${loginUrl}\nPreview: ${origin}\nInvented session instructions: ${sessionFile}`);
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--hostname','127.0.0.1','--port','3120'],{
  cwd:root,env:{PATH:process.env.PATH,HOME:process.env.HOME,TMPDIR:process.env.TMPDIR,
    NODE_ENV:'development',NEXT_TELEMETRY_DISABLED:'1',NEXT_DIST_DIR:'.next-material-preview',
    AUTH_SECRET:FIXTURE_AUTH_SECRET,DATABASE_URL:FIXTURE_DATABASE_URL,NEON_LOCAL_PROXY:fixture.url},stdio:'inherit'});
let closing=false;
async function stop(){if(closing)return;closing=true;child.kill('SIGTERM');await fixture.close();process.exit();}
process.on('SIGINT',stop);process.on('SIGTERM',stop);
child.on('exit',async(code)=>{if(!closing){await fixture.close();process.exit(code||0);}});
