import { createHash } from 'node:crypto';
import { hasDb, sql } from './db.js';
import { reserveFxRun } from './fx-run-budget.js';
let initialized;
function storage() {
  if (!initialized) initialized = sql`create table if not exists fx_deck_limits (
    bucket text not null, day date not null default current_date,
    requests integer not null default 0, last_run timestamptz not null default now(),
    primary key (bucket, day)
  )`.catch(error => { initialized = null; throw error; });
  return initialized;
}
export function productionFxConfigured() {
  return Boolean(process.env.AI_GATEWAY_API_KEY && process.env.AUTH_SECRET && hasDb());
}
export async function takeFxCredit(request, { hostId = null } = {}) {
  await storage();
  // Vercel sets this trusted header; never accept a client-supplied IP header.
  const address = request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim();
  if (!hostId && !address) return false;
  const bucket = (hostId ? 'host:' : 'visitor:') + createHash('sha256').update(process.env.AUTH_SECRET + ':' + (hostId || address)).digest('hex');
  const perPerson = hostId ? 20 : 6;
  const globalBucket = hostId ? 'global-host' : 'global';
  const globalLimit = hostId ? 60 : 30;
  const visitor = await sql`insert into fx_deck_limits (bucket, requests) values (${bucket}, 1)
    on conflict (bucket, day) do update set requests = fx_deck_limits.requests + 1, last_run = now()
    where fx_deck_limits.requests < ${perPerson} and fx_deck_limits.last_run < now() - interval '15 seconds'
    returning requests`;
  if (!visitor.length) return false;
  const global = await sql`insert into fx_deck_limits (bucket, requests) values (${globalBucket}, 1)
    on conflict (bucket, day) do update set requests = fx_deck_limits.requests + 1, last_run = now()
    where fx_deck_limits.requests < ${globalLimit} returning requests`;
  return global.length > 0;
}

// Symbol.for keeps the local allowance shared across separately bundled routes.
const stateKey=Symbol.for('shipai.fx.shared-run-budget');
const runState=globalThis[stateKey] ||= {used:0,lastRun:0,active:false};
export function acquireFxRun({ production = process.env.NODE_ENV === 'production' } = {}) {
  return reserveFxRun(runState,{production});
}
