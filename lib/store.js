import "server-only";

import { sql, safeRead } from "./db";
import { RUBRIC, averageScore, weightedScore } from "./accounts";

/* ------------------------------------------------------------------
   Reads.

   Every query the dashboard, the judge area and the admin screens run
   lives here, so a page component never writes SQL and two surfaces
   asking the same question get the same answer. Writes stay in the
   server actions next to the form that triggers them — this file is
   read-only on purpose.
------------------------------------------------------------------ */

/* ---------- people ---------- */

export async function userById(id) {
  const rows = await sql`
    select u.*, coalesce(array_agg(r.role) filter (where r.role is not null), '{}') as roles
      from users u left join user_roles r on r.user_id = u.id
     where u.id = ${id} group by u.id`;
  return rows[0] ?? null;
}

export async function usersWithRole(role) {
  return sql`
    select u.id, u.name, u.email, u.company, u.title
      from users u join user_roles r on r.user_id = u.id
     where r.role = ${role}
     order by coalesce(nullif(u.name, ''), u.email)`;
}

/**
 * The admin user list. `q` matches name, email or company; `role`
 * narrows to a granted role. Both optional — the SQL is written as
 * one statement with null-guards rather than assembled from strings,
 * because a query builder here would be the only place in the
 * codebase where SQL isn't a static template.
 */
export async function listUsers({ q = "", role = "", limit = 500 } = {}) {
  const term = q.trim() ? `%${q.trim().toLowerCase()}%` : null;
  const want = role || null;
  return sql`
    select u.*,
           coalesce(array_agg(distinct r.role) filter (where r.role is not null), '{}') as roles,
           (reg.user_id is not null and reg.withdrawn_at is null) as registered,
           t.name as team_name,
           t.id   as team_id
      from users u
      left join user_roles   r   on r.user_id  = u.id
      left join registrations reg on reg.user_id = u.id
      left join team_members tm  on tm.user_id = u.id
      left join teams        t   on t.id       = tm.team_id
     where (${term}::text is null
            or lower(u.name)    like ${term}
            or lower(u.email)   like ${term}
            or lower(u.company) like ${term})
       and (${want}::text is null
            or exists (select 1 from user_roles x
                        where x.user_id = u.id and x.role = ${want}))
     group by u.id, reg.user_id, reg.withdrawn_at, t.name, t.id
     order by u.created_at desc
     limit ${limit}`;
}

/* ---------- role requests ---------- */

export async function requestsForUser(userId) {
  return sql`
    select * from role_requests where user_id = ${userId} order by created_at desc`;
}

export async function pendingRequests() {
  return sql`
    select q.*, u.name, u.email, u.company, u.title, u.website, u.discord, u.bio
      from role_requests q join users u on u.id = q.user_id
     where q.status = 'pending'
     order by q.created_at`;
}

export async function decidedRequests(limit = 100) {
  return sql`
    select q.*, u.name, u.email, u.company
      from role_requests q join users u on u.id = q.user_id
     where q.status <> 'pending'
     order by q.decided_at desc nulls last limit ${limit}`;
}

/* ---------- registration and teams ---------- */

export async function registrationFor(userId) {
  const rows = await sql`
    select * from registrations where user_id = ${userId} and withdrawn_at is null`;
  return rows[0] ?? null;
}

/** The user's team with every member attached, or null. */
export async function teamFor(userId) {
  const rows = await sql`
    select t.* from teams t
      join team_members m on m.team_id = t.id
     where m.user_id = ${userId} limit 1`;
  const team = rows[0];
  if (!team) return null;
  team.members = await teamMembers(team.id);
  return team;
}

export async function teamMembers(teamId) {
  return sql`
    select u.id, u.name, u.email, u.title, u.company, m.is_owner, m.joined_at
      from team_members m join users u on u.id = m.user_id
     where m.team_id = ${teamId}
     order by m.is_owner desc, m.joined_at`;
}

export async function teamByInvite(code) {
  const rows = await sql`select * from teams where invite_code = ${code} limit 1`;
  return rows[0] ?? null;
}

export async function allTeams() {
  return sql`
    select t.*,
           count(m.user_id)::int as member_count,
           s.id as submission_id, s.project, s.status as submission_status
      from teams t
      left join team_members m on m.team_id = t.id
      left join submissions  s on s.team_id = t.id
     group by t.id, s.id, s.project, s.status
     order by t.created_at desc`;
}

/* ---------- submissions ---------- */

export async function submissionForTeam(teamId) {
  const rows = await sql`select * from submissions where team_id = ${teamId}`;
  return rows[0] ?? null;
}

export async function submissionById(id) {
  const rows = await sql`
    select s.*, t.name as team_name, t.slug as team_slug
      from submissions s join teams t on t.id = s.team_id
     where s.id = ${id}`;
  const submission = rows[0];
  if (!submission) return null;
  submission.members = await teamMembers(submission.team_id);
  return submission;
}

export async function allSubmissions({ status = "" } = {}) {
  const want = status || null;
  return sql`
    select s.*, t.name as team_name,
           count(distinct ja.judge_id)::int as judge_count,
           count(distinct sc.judge_id) filter (where sc.submitted_at is not null)::int as scored_count
      from submissions s
      join teams t on t.id = s.team_id
      left join judge_assignments ja on ja.submission_id = s.id
      left join scores sc            on sc.submission_id = s.id
     where (${want}::text is null or s.status = ${want})
     group by s.id, t.name
     order by s.submitted_at desc nulls last, s.created_at desc`;
}

/* ---------- judging ---------- */

/** What one judge sees: their assignments, each with their own card. */
export async function judgeQueue(judgeId) {
  const rows = await sql`
    select s.*, t.name as team_name,
           sc.shipped, sc.receipts as r_receipts, sc.growth, sc.craft,
           sc.notes, sc.submitted_at as scored_at,
           exists (select 1 from team_members tm
                    where tm.team_id = s.team_id and tm.user_id = ${judgeId}) as conflict
      from judge_assignments ja
      join submissions s on s.id = ja.submission_id
      join teams t on t.id = s.team_id
      left join scores sc on sc.submission_id = s.id and sc.judge_id = ${judgeId}
     where ja.judge_id = ${judgeId}
     order by t.name`;

  return rows.map((row) => ({
    ...row,
    /* `receipts` is both a submission field and a rubric axis. The
       query aliases the score one; put the card back together here so
       callers see a clean { shipped, receipts, growth, craft }. */
    card: {
      shipped: row.shipped,
      receipts: row.r_receipts,
      growth: row.growth,
      craft: row.craft,
    },
    total: weightedScore({
      shipped: row.shipped,
      receipts: row.r_receipts,
      growth: row.growth,
      craft: row.craft,
    }),
  }));
}

export async function scoreCard(submissionId, judgeId) {
  const rows = await sql`
    select * from scores where submission_id = ${submissionId} and judge_id = ${judgeId}`;
  return rows[0] ?? null;
}

export async function judgesFor(submissionId) {
  return sql`
    select u.id, u.name, u.email,
           sc.shipped, sc.receipts, sc.growth, sc.craft, sc.notes, sc.submitted_at
      from judge_assignments ja
      join users u on u.id = ja.judge_id
      left join scores sc on sc.submission_id = ja.submission_id and sc.judge_id = ja.judge_id
     where ja.submission_id = ${submissionId}
     order by coalesce(nullif(u.name, ''), u.email)`;
}

/**
 * The leaderboard. Every submitted entry with its judges' cards, the
 * mean weighted score and its crowd vote count, sorted the way the
 * awards are decided.
 */
export async function leaderboard() {
  const submissions = await sql`
    select s.*, t.name as team_name,
           (select count(*)::int from votes v where v.submission_id = s.id) as votes
      from submissions s join teams t on t.id = s.team_id
     where s.status = 'submitted'
     order by t.name`;

  const cards = await sql`
    select sc.*, coalesce(nullif(u.name, ''), u.email) as judge
      from scores sc join users u on u.id = sc.judge_id
     where sc.submitted_at is not null`;

  /* How many judges were asked, not just how many answered. An entry
     averaged from one card next to one averaged from three isn't
     comparable, and the mean alone won't tell you which is which. */
  const assigned = await sql`
    select submission_id, count(*)::int as n from judge_assignments group by submission_id`;
  const assignedBy = new Map(assigned.map((r) => [r.submission_id, r.n]));

  const byId = new Map(submissions.map((s) => [s.id, { ...s, cards: [] }]));
  for (const card of cards) byId.get(card.submission_id)?.cards.push(card);

  const rows = [...byId.values()].map((s) => {
    /* The per-judge totals behind the mean. Three judges at 7.0 and
       judges at 4, 7 and 10 both average 7.0, and they are not the
       same result — one is a consensus and the other is an argument
       nobody has had yet. */
    const totals = s.cards.map(weightedScore).filter((n) => n !== null);
    const low = totals.length ? Math.min(...totals) : null;
    const high = totals.length ? Math.max(...totals) : null;

    return {
      ...s,
      average: averageScore(s.cards),
      assigned: assignedBy.get(s.id) ?? 0,
      returned: totals.length,
      low,
      high,
      spread: low === null ? null : Math.round((high - low) * 10) / 10,
      perAxis: Object.fromEntries(
        RUBRIC.map((c) => {
          const values = s.cards
            .map((card) => card[c.key])
            .filter((v) => v !== null && v !== undefined);
          const mean = values.length
            ? values.reduce((a, b) => a + b, 0) / values.length
            : null;
          return [c.key, mean === null ? null : Math.round(mean * 10) / 10];
        }),
      ),
    };
  });

  return rows.sort((a, b) => {
    if (a.average === b.average) return b.votes - a.votes;
    if (a.average === null) return 1;
    if (b.average === null) return -1;
    return b.average - a.average;
  });
}

export async function voteFor(userId) {
  const rows = await sql`select * from votes where user_id = ${userId}`;
  return rows[0] ?? null;
}

/* ---------- mentors ---------- */

export async function mentorAssignmentsFor(mentorId) {
  return sql`
    select ma.*, t.name as team_name, t.id as team_id,
           s.project, s.summary, s.track
      from mentor_assignments ma
      join teams t on t.id = ma.team_id
      left join submissions s on s.team_id = t.id
     where ma.mentor_id = ${mentorId}
     order by t.name`;
}

export async function mentorsForTeam(teamId) {
  return sql`
    select u.id, u.name, u.email, u.title, u.company, ma.slot, ma.note
      from mentor_assignments ma join users u on u.id = ma.mentor_id
     where ma.team_id = ${teamId}
     order by coalesce(nullif(u.name, ''), u.email)`;
}

export async function allMentorAssignments() {
  return sql`
    select ma.team_id, ma.mentor_id, ma.slot,
           t.name as team_name,
           coalesce(nullif(u.name, ''), u.email) as mentor_name
      from mentor_assignments ma
      join teams t on t.id = ma.team_id
      join users u on u.id = ma.mentor_id
     order by t.name`;
}

/* ---------- sponsorships ---------- */

export async function sponsorshipsFor(userId) {
  return sql`select * from sponsorships where user_id = ${userId} order by created_at desc`;
}

export async function allSponsorships() {
  return sql`
    select sp.*, coalesce(nullif(u.name, ''), u.email) as person, u.email,
           u.company_logo
      from sponsorships sp join users u on u.id = sp.user_id
     order by sp.amount desc, sp.created_at desc`;
}

/* ---------- certificates ---------- */

export async function certificatesFor(userId) {
  return sql`
    select c.* from certificates c
      join certificate_holders h on h.certificate_id = c.id
     where h.user_id = ${userId} and c.revoked_at is null
     order by c.issued_at desc`;
}

/** Public read — used by /programs/zero-to-launch/hackathon/certificate/<id>, so it degrades. */
export async function certificateById(id) {
  const rows = await safeRead(
    () => sql`
      select c.*, s.category as entered
        from certificates c
        left join submissions s on s.id = c.submission_id
       where c.id = ${id} and c.revoked_at is null`,
    [],
  );
  return rows[0] ?? null;
}

/** Public read — the entrant listing on /programs/zero-to-launch/hackathon/results. */
export async function publishedCertificates() {
  return safeRead(
    () => sql`
      select c.*, s.live_url, s.category as entered
        from certificates c
        left join submissions s on s.id = c.submission_id
       where c.revoked_at is null and c.kind in ('launch', 'winner', 'crowd')
       order by c.issued_at`,
    [],
  );
}

export async function allCertificates() {
  return sql`
    select c.*,
           coalesce(array_agg(coalesce(nullif(u.name, ''), u.email))
                    filter (where u.id is not null), '{}') as holder_names
      from certificates c
      left join certificate_holders h on h.certificate_id = c.id
      left join users u on u.id = h.user_id
     group by c.id
     order by c.issued_at desc`;
}

/* ---------- admin overview ---------- */

export async function adminStats() {
  const [row] = await sql`
    select
      (select count(*)::int from users)                                       as users,
      (select count(*)::int from users where onboarded_at is not null)        as onboarded,
      (select count(*)::int from registrations where withdrawn_at is null)    as registered,
      (select count(*)::int from teams)                                       as teams,
      (select count(*)::int from submissions where status = 'submitted')      as submitted,
      (select count(*)::int from submissions where status = 'draft')          as drafts,
      (select count(*)::int from role_requests where status = 'pending')      as pending_requests,
      (select count(*)::int from user_roles where role = 'judge')             as judges,
      (select count(*)::int from user_roles where role = 'mentor')            as mentors,
      (select count(*)::int from user_roles where role = 'sponsor')           as sponsors,
      (select count(*)::int from judge_assignments)                           as assignments,
      (select count(*)::int from scores where submitted_at is not null)       as cards,
      (select count(*)::int from votes)                                       as votes,
      (select count(*)::int from certificates where revoked_at is null)       as certificates`;
  return row;
}

/** What people said they came for — onboarding, aggregated. */
export async function interestBreakdown() {
  return sql`
    select interest, count(*)::int as n
      from users, unnest(users.interests) as interest
     group by interest order by n desc`;
}

export async function goalBreakdown() {
  return sql`
    select goal, count(*)::int as n
      from users, unnest(users.goals) as goal
     group by goal order by n desc`;
}

export async function recentAudit(limit = 60) {
  return sql`
    select a.*, coalesce(nullif(u.name, ''), u.email) as actor
      from audit_log a left join users u on u.id = a.actor_id
     order by a.created_at desc limit ${limit}`;
}

/* ---------- waitlist ---------- */

/**
 * Signups per program slug, newest first within each. The admin page
 * groups these itself rather than running one query per program —
 * a waitlist is small, and the whole point is reading it in one pass.
 */
export async function waitlistEntries(limit = 1000) {
  return sql`
    select id, program, name, company, email, goal, notes, created_at
      from waitlist
     order by created_at desc
     limit ${limit}`;
}

/** Row counts by program, for the header and the nav badge. */
export async function waitlistCounts() {
  return sql`
    select program, count(*)::int as n, max(created_at) as latest
      from waitlist
     group by program
     order by n desc`;
}

/** Total signups — the badge next to Waitlist in the admin nav. */
export async function waitlistCount() {
  const [row] = await sql`select count(*)::int as n from waitlist`;
  return row?.n ?? 0;
}
