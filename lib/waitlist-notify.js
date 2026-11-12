import "server-only";

import { sql } from "./db";

/* ------------------------------------------------------------------
   Date announcements for a workshop's waitlist.

   People on a workshop's list were promised one email when a date is
   set. Workshop dates live in source (lib/workshops.js), so there is
   no row change to trigger on: an admin sends the announcement from
   /admin/waitlist once the date is real. `notified_at` records who has
   had it, so pressing send twice cannot email anyone twice.
------------------------------------------------------------------ */

/* Same lazy pattern as ensureWorkshopMedia(): the column is also in
   lib/schema.sql, and this makes the admin page work before the next
   migrate has run. */
export async function ensureWaitlistNotified() {
  await sql`alter table waitlist add column if not exists notified_at timestamptz`;
}

/** Who on this list has not had the date yet, oldest signup first. */
export async function pendingDateNotices(program, limit = 200) {
  return sql`
    select id, email
      from waitlist
     where program = ${program} and notified_at is null
     order by created_at
     limit ${limit}`;
}

/** Pending and already-notified counts per list, for the admin page. */
export async function dateNoticeCounts() {
  const rows = await sql`
    select program,
           count(*) filter (where notified_at is null)::int as pending,
           count(*) filter (where notified_at is not null)::int as notified
      from waitlist
     group by program`;
  return new Map(rows.map((row) => [row.program, { pending: row.pending, notified: row.notified }]));
}

export async function markDateNoticeSent(id) {
  await sql`update waitlist set notified_at = now() where id = ${id} and notified_at is null`;
}
