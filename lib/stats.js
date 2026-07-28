import "server-only";

import { sql, safeRead } from "./db";

const EMPTY_STATS = {
  participants: 0,
  teams: 0,
  submitted: 0,
  mentors: 0,
  judges: 0,
  sponsors: 0,
};

/* Public reads must fail soft: the marketing page should still render when
   account storage is unavailable, and callers need one stable data shape. */
export async function programStats() {
  return safeRead(
    async () => {
      const [row] = await sql`
        select
          (select count(*)::int from registrations where withdrawn_at is null) as participants,
          (select count(*)::int from teams) as teams,
          (select count(*)::int from submissions where status = 'submitted') as submitted,
          (select count(*)::int from user_roles where role = 'mentor') as mentors,
          (select count(*)::int from user_roles where role = 'judge') as judges,
          (select count(*)::int from user_roles where role = 'sponsor') as sponsors`;

      return row
        ? {
            participants: Number(row.participants ?? 0),
            teams: Number(row.teams ?? 0),
            submitted: Number(row.submitted ?? 0),
            mentors: Number(row.mentors ?? 0),
            judges: Number(row.judges ?? 0),
            sponsors: Number(row.sponsors ?? 0),
          }
        : EMPTY_STATS;
    },
    EMPTY_STATS,
  );
}

export async function publicRoster(limit = 60) {
  return safeRead(
    () => sql`
      select u.name, u.handle, u.avatar_url, u.company, u.title
        from users u
        join registrations r on r.user_id = u.id and r.withdrawn_at is null
       where u.public_profile = true
         and u.onboarded_at is not null
         and u.name <> ''
       order by r.registered_at desc
       limit ${limit}`,
    [],
  );
}
