import "server-only";
import { sql } from "./db";

let ready;
// Additive and safe for entries saved before pitch support shipped.
export function ensureSubmissionPitch() {
  if (!ready) ready = Promise.resolve(sql`alter table submissions add column if not exists pitch jsonb not null default '{}'::jsonb`)
    .catch(error => { ready = undefined; throw error; });
  return ready;
}
