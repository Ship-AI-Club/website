import "server-only";

import { isEmail } from "./accounts";
import { safeRead, sql } from "./db";

export const CHECKIN_DAYS = ["friday", "saturday", "sunday"];

export const BROADCAST_SEGMENTS = [
  { id: "registered", label: "Registered" },
  { id: "no_submission", label: "No submission" },
  { id: "judges", label: "Judges" },
  { id: "mentors", label: "Mentors" },
  { id: "sponsors", label: "Sponsors" },
  { id: "checked_in", label: "Checked in" },
  { id: "teamless", label: "Teamless" },
];

const EVENT_DATES = {
  friday: "2026-10-16",
  saturday: "2026-10-17",
  sunday: "2026-10-18",
};

const SHOW_DAYS = [
  {
    day: "Friday",
    date: "Oct 16",
    title: "Kickoff & launch plans",
    slots: [
      { time: "6:00 PM", name: "Doors, food, check-in", at: "2026-10-16T18:00:00-07:00" },
      {
        time: "6:30 PM",
        name: "Kickoff — ten weeks, two days left",
        copy: "Where the program has been and what the weekend demands. A condensed run of the framework for anyone joining fresh, plus the rules, the categories and the deadline.",
        deck: true,
        at: "2026-10-16T18:30:00-07:00",
      },
      {
        time: "7:00 PM",
        name: "Launch rehearsal",
        copy: "The full pre-flight, run as a room. Site live, analytics firing, tracking that survives a judge's question, assets exported, copy written. Then everyone's plan gets broken on purpose — better to hear it Friday than discover it Sunday.",
        at: "2026-10-16T19:00:00-07:00",
      },
      {
        time: "7:45 PM",
        name: "60-second pitches",
        copy: "Everyone delivers the elevator pitch they wrote in September. Newcomers get the crash version and pitch anyway. It's the dry run for Sunday.",
        at: "2026-10-16T19:45:00-07:00",
      },
      {
        time: "8:15 PM",
        name: "Team formation",
        copy: "Solo is fine. Teams up to four. If you've been building alone since August, this is where you pick up help.",
        at: "2026-10-16T20:15:00-07:00",
      },
      {
        time: "8:45 PM",
        name: "Launch plans locked",
        copy: "Every team writes it down: what goes live, on what channel, to which audience, at what hour. Posted in Discord so the room can hold you to it.",
        hard: true,
        at: "2026-10-16T20:45:00-07:00",
      },
      { time: "9:15 PM", name: "Building starts", at: "2026-10-16T21:15:00-07:00" },
    ],
  },
  {
    day: "Saturday",
    date: "Oct 17",
    title: "Launch day",
    slots: [
      { time: "9:00 AM", name: "Doors, coffee", at: "2026-10-17T09:00:00-07:00" },
      {
        time: "9:30 AM",
        name: "Launch clinic",
        copy: "The last mile, end to end: site live, analytics wired, tracking that will survive Sunday's questions, and the launch post itself. Forty-five minutes, then you go do it.",
        at: "2026-10-17T09:30:00-07:00",
      },
      {
        time: "10:15 AM",
        name: "Build & mentor hours",
        copy: "1:1 rotations running all day. Sites, performance, paid acquisition, B2B sales, content, design.",
        at: "2026-10-17T10:15:00-07:00",
      },
      { time: "12:00 PM", name: "Lunch", at: "2026-10-17T12:00:00-07:00" },
      {
        time: "1:00 PM",
        name: "Launches go live",
        copy: "Teams start pushing publicly, with the room as a war room. Copy review, channel help, and the first numbers coming in while there's still time to react to them.",
        hard: true,
        at: "2026-10-17T13:00:00-07:00",
      },
      {
        time: "3:00 PM →",
        name: "Iterate on what the channel tells you",
        copy: "The launch is data. Saturday evening is for acting on it rather than admiring it.",
        at: "2026-10-17T15:00:00-07:00",
      },
    ],
  },
  {
    day: "Sunday",
    date: "Oct 18",
    title: "Ship & pitch",
    slots: [
      { time: "9:00 AM", name: "Doors, final build block", at: "2026-10-18T09:00:00-07:00" },
      {
        time: "12:00 PM",
        name: "Submissions close",
        copy: "Hard deadline. Lunch while the judges read.",
        hard: true,
        at: "2026-10-18T12:00:00-07:00",
      },
      {
        time: "1:00 PM",
        name: "Pitches",
        copy: "Five minutes plus three of questions, live product on screen.",
        at: "2026-10-18T13:00:00-07:00",
      },
      { time: "3:30 PM", name: "Judging", at: "2026-10-18T15:30:00-07:00" },
      { time: "4:00 PM", name: "Awards & closing", at: "2026-10-18T16:00:00-07:00" },
    ],
  },
];

export const RUN_OF_SHOW = SHOW_DAYS;

const RUN_OF_SHOW_SLOTS = SHOW_DAYS.flatMap(({ slots, ...day }) =>
  slots.map((slot) => ({ ...day, ...slot })),
);

function dateKeyInArizona(now) {
  const date = new Date(now);
  if (Number.isNaN(date.getTime())) return EVENT_DATES.friday;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Phoenix",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function eventDay(now = new Date()) {
  const date = dateKeyInArizona(now);
  if (date <= EVENT_DATES.friday) return "friday";
  if (date === EVENT_DATES.saturday) return "saturday";
  return "sunday";
}

export function runOfShowState(now = new Date()) {
  const timestamp = new Date(now).getTime();
  const safeTimestamp = Number.isNaN(timestamp) ? Date.now() : timestamp;
  let current = null;
  let next = null;

  for (const slot of RUN_OF_SHOW_SLOTS) {
    const slotTime = new Date(slot.at).getTime();
    if (slotTime <= safeTimestamp) current = slot;
    if (slotTime > safeTimestamp) {
      next = slot;
      break;
    }
  }

  return { current, next };
}

function selectedDay(day) {
  const value = String(day ?? "").trim().toLowerCase();
  return CHECKIN_DAYS.includes(value) ? value : eventDay();
}

function zeroCounters(day) {
  return {
    day,
    registered: 0,
    checkedIn: 0,
    teams: 0,
    submitted: 0,
    assignments: 0,
    scorecards: 0,
    votes: 0,
  };
}

export async function opsCounters(day = eventDay()) {
  const checkinDay = selectedDay(day);
  const rows = await safeRead(
    () => sql`
      select
        (select count(*)::int
           from registrations r
          where r.withdrawn_at is null) as registered,
        (select count(distinct r.user_id)::int
           from registrations r
           join event_checkins c on c.user_id = r.user_id and c.day = ${checkinDay}
          where r.withdrawn_at is null) as checked_in,
        (select count(*)::int from teams) as teams,
        (select count(*)::int
           from submissions s
          where s.status = 'submitted') as submitted,
        (select count(*)::int from judge_assignments) as assignments,
        (select count(*)::int from scores where submitted_at is not null) as scorecards,
        (select count(*)::int from votes) as votes`,
    [zeroCounters(checkinDay)],
  );
  const row = rows[0] ?? zeroCounters(checkinDay);
  return {
    day: checkinDay,
    registered: Number(row.registered) || 0,
    checkedIn: Number(row.checked_in) || 0,
    teams: Number(row.teams) || 0,
    submitted: Number(row.submitted) || 0,
    assignments: Number(row.assignments) || 0,
    scorecards: Number(row.scorecards) || 0,
    votes: Number(row.votes) || 0,
  };
}

export async function opsAttention() {
  const [teamlessPeople, teamsWithoutSubmission, underjudgedSubmissions, unfiledJudges, pendingRequests] =
    await Promise.all([
      safeRead(
        () => sql`
          select u.id, u.name, u.handle, u.email, u.avatar_url
            from registrations r
            join users u on u.id = r.user_id
            left join team_members tm on tm.user_id = r.user_id
           where r.withdrawn_at is null and tm.user_id is null
           order by coalesce(nullif(u.name, ''), u.email)`,
        [],
      ),
      safeRead(
        () => sql`
          select t.id, t.name, t.slug, count(distinct tm.user_id)::int as member_count
            from teams t
            join team_members tm on tm.team_id = t.id
            join registrations r on r.user_id = tm.user_id and r.withdrawn_at is null
            left join submissions s on s.team_id = t.id
           where s.id is null or s.status <> 'submitted'
           group by t.id
           order by t.name`,
        [],
      ),
      safeRead(
        () => sql`
          select s.id, s.project, t.name as team_name,
                 count(distinct ja.judge_id)::int as judge_count
            from submissions s
            join teams t on t.id = s.team_id
            left join judge_assignments ja on ja.submission_id = s.id
           where s.status = 'submitted'
           group by s.id, t.name
          having count(distinct ja.judge_id) < 3
           order by judge_count, t.name`,
        [],
      ),
      safeRead(
        () => sql`
          select u.id, u.name, u.email,
                 count(*)::int as unfiled_count
            from judge_assignments ja
           join submissions s on s.id = ja.submission_id
            join users u on u.id = ja.judge_id
            left join scores sc on sc.submission_id = ja.submission_id and sc.judge_id = ja.judge_id
           where sc.submission_id is null or sc.submitted_at is null
           group by u.id
           order by unfiled_count desc, coalesce(nullif(u.name, ''), u.email)`,
        [],
      ),
      safeRead(
        () => sql`
          select q.id, q.user_id, q.role, q.created_at,
                 u.name, u.email
            from role_requests q
            join users u on u.id = q.user_id
           where q.status = 'pending'
           order by q.created_at`,
        [],
      ),
    ]);

  return {
    teamlessPeople,
    teamsWithoutSubmission,
    underjudgedSubmissions,
    unfiledJudges,
    pendingRequests,
  };
}

function cleanRecipients(rows) {
  const seen = new Set();
  const recipients = [];
  for (const row of rows) {
    const email = String(row.email ?? "").trim().toLowerCase();
    if (!isEmail(email) || seen.has(email)) continue;
    seen.add(email);
    recipients.push({ id: row.id, name: row.name || email, email });
  }
  return recipients;
}

export async function broadcastRecipients(segment, day = eventDay()) {
  const checkinDay = selectedDay(day);
  let rows = [];
  if (segment === "registered") {
    rows = await safeRead(
      () => sql`
        select distinct on (lower(trim(u.email))) u.id,
               coalesce(nullif(u.name, ''), u.email) as name,
               lower(trim(u.email)) as email
          from users u join registrations r on r.user_id = u.id
         where r.withdrawn_at is null and trim(u.email) <> ''
         order by lower(trim(u.email)), u.id`,
      [],
    );
  } else if (segment === "no_submission") {
    rows = await safeRead(
      () => sql`
        select distinct on (lower(trim(u.email))) u.id,
               coalesce(nullif(u.name, ''), u.email) as name,
               lower(trim(u.email)) as email
          from users u
          join registrations r on r.user_id = u.id and r.withdrawn_at is null
          join team_members tm on tm.user_id = u.id
          left join submissions s on s.team_id = tm.team_id
         where (s.id is null or s.status <> 'submitted') and trim(u.email) <> ''
         order by lower(trim(u.email)), u.id`,
      [],
    );
  } else if (segment === "judges") {
    rows = await safeRead(
      () => sql`
        select distinct on (lower(trim(u.email))) u.id,
               coalesce(nullif(u.name, ''), u.email) as name,
               lower(trim(u.email)) as email
          from users u join user_roles r on r.user_id = u.id
         where r.role = 'judge' and trim(u.email) <> ''
         order by lower(trim(u.email)), u.id`,
      [],
    );
  } else if (segment === "mentors") {
    rows = await safeRead(
      () => sql`
        select distinct on (lower(trim(u.email))) u.id,
               coalesce(nullif(u.name, ''), u.email) as name,
               lower(trim(u.email)) as email
          from users u join user_roles r on r.user_id = u.id
         where r.role = 'mentor' and trim(u.email) <> ''
         order by lower(trim(u.email)), u.id`,
      [],
    );
  } else if (segment === "sponsors") {
    rows = await safeRead(
      () => sql`
        select distinct on (lower(trim(u.email))) u.id,
               coalesce(nullif(u.name, ''), u.email) as name,
               lower(trim(u.email)) as email
          from users u join user_roles r on r.user_id = u.id
         where r.role = 'sponsor' and trim(u.email) <> ''
         order by lower(trim(u.email)), u.id`,
      [],
    );
  } else if (segment === "checked_in") {
    rows = await safeRead(
      () => sql`
        select distinct on (lower(trim(u.email))) u.id,
               coalesce(nullif(u.name, ''), u.email) as name,
               lower(trim(u.email)) as email
          from users u
          join registrations r on r.user_id = u.id and r.withdrawn_at is null
          join event_checkins c on c.user_id = u.id and c.day = ${checkinDay}
         where trim(u.email) <> ''
         order by lower(trim(u.email)), u.id`,
      [],
    );
  } else if (segment === "teamless") {
    rows = await safeRead(
      () => sql`
        select distinct on (lower(trim(u.email))) u.id,
               coalesce(nullif(u.name, ''), u.email) as name,
               lower(trim(u.email)) as email
          from users u
          join registrations r on r.user_id = u.id and r.withdrawn_at is null
          left join team_members tm on tm.user_id = u.id
         where tm.user_id is null and trim(u.email) <> ''
         order by lower(trim(u.email)), u.id`,
      [],
    );
  }
  return cleanRecipients(rows);
}

export async function broadcastRecipientCounts(day = eventDay()) {
  const segments = await Promise.all(
    BROADCAST_SEGMENTS.map(async ({ id }) => [id, (await broadcastRecipients(id, day)).length]),
  );
  return Object.fromEntries(segments);
}

export async function checkinRoster(day = eventDay()) {
  const checkinDay = selectedDay(day);
  return safeRead(
    () => sql`
      /* Everyone who'll be at the door, not only the people entering:
         a judge, mentor or sponsor has no registrations row and still
         has to be checked in. Dietary comes off the users row for the
         same reason: it's a fact about the person, not their entry. */
      select u.id, u.name, u.handle, u.email, u.avatar_url, u.dietary,
             t.name as team_name, c.checked_in_at,
             (r.user_id is not null) as competing
        from users u
        left join registrations r
          on r.user_id = u.id and r.withdrawn_at is null
        left join team_members tm on tm.user_id = u.id
        left join teams t on t.id = tm.team_id
        left join event_checkins c on c.user_id = u.id and c.day = ${checkinDay}
       where r.user_id is not null
          or exists (select 1 from user_roles ur
                      where ur.user_id = u.id
                        and ur.role in ('judge', 'mentor', 'sponsor', 'volunteer'))
       order by c.checked_in_at nulls first, coalesce(nullif(u.name, ''), u.email)`,
    [],
  );
}

export async function broadcastHistory(limit = 40) {
  const boundedLimit = Math.min(200, Math.max(1, Number(limit) || 40));
  return safeRead(
    () => sql`
      select b.id, b.segment, b.subject, b.body, b.recipients,
             b.sent_at, b.sent_by,
             coalesce(nullif(u.name, ''), u.email, 'System') as sent_by_name
        from broadcasts b
        left join users u on u.id = b.sent_by
       order by b.sent_at desc
       limit ${boundedLimit}`,
    [],
  );
}

export async function cateringSummary() {
  const [registeredRows, checkinRows, dietaryRows] = await Promise.all([
    safeRead(
      /* Everyone expected in the room, not everyone competing. The
         page says "entrants and crew" and this is the number under
         it, so counting registrations alone was short by the whole
         panel — on the count that gets read to a caterer. */
      () => sql`
        select count(*)::int as registered
          from users u
          left join registrations r
            on r.user_id = u.id and r.withdrawn_at is null
         where r.user_id is not null
            or exists (select 1 from user_roles ur
                        where ur.user_id = u.id
                          and ur.role in ('judge', 'mentor', 'sponsor', 'volunteer'))`,
      [{ registered: 0 }],
    ),
    safeRead(
      () => sql`
        /* Anyone checked in counts as on site. Requiring a
           registration meant a judge could be scanned through the
           door and still not appear in the room. */
        select c.day, count(distinct c.user_id)::int as n
          from event_checkins c
         where c.day in ('friday', 'saturday', 'sunday')
         group by c.day`,
      [],
    ),
    safeRead(
      () => sql`
        /* Counts everyone being fed — crew included. A caterer needs
           the headcount for the room, not for the entry list. */
        select min(trim(u.dietary)) as dietary, count(*)::int as n
          from users u
          left join registrations r
            on r.user_id = u.id and r.withdrawn_at is null
         where trim(u.dietary) <> ''
           and (r.user_id is not null
                or exists (select 1 from user_roles ur
                            where ur.user_id = u.id
                              and ur.role in ('judge', 'mentor', 'sponsor', 'volunteer')))
         group by lower(trim(u.dietary))
         order by lower(trim(u.dietary))`,
      [],
    ),
  ]);

  const registered = Number(registeredRows[0]?.registered) || 0;
  const dayCounts = Object.fromEntries(
    CHECKIN_DAYS.map((day) => [day, Number(checkinRows.find((row) => row.day === day)?.n) || 0]),
  );
  const meals = [
    ["friday", "dinner"],
    ["saturday", "breakfast"],
    ["saturday", "lunch"],
    ["saturday", "dinner"],
    ["sunday", "breakfast"],
    ["sunday", "lunch"],
    ["sunday", "closing meal"],
  ].map(([day, meal]) => ({ day, meal, expected: registered, onSite: dayCounts[day] }));

  return {
    registered,
    dayCounts,
    meals,
    dietary: dietaryRows.map((row) => ({ dietary: row.dietary, count: Number(row.n) || 0 })),
  };
}

export async function exportRows(type) {
  if (type === "attendees") {
    return safeRead(
      () => sql`
        select u.id, u.name, u.handle, u.email, r.track, u.dietary, r.registered_at
          from registrations r join users u on u.id = r.user_id
         where r.withdrawn_at is null
         order by coalesce(nullif(u.name, ''), u.email)`,
      [],
    );
  }
  if (type === "teams") {
    return safeRead(
      () => sql`
        select t.id, t.name, t.slug,
               count(distinct tm.user_id) filter (where r.withdrawn_at is null)::int as member_count,
               string_agg(distinct coalesce(nullif(u.name, ''), u.email), '; ')
                 filter (where r.withdrawn_at is null) as members,
               s.id as submission_id, s.project, s.status as submission_status,
               s.submitted_at
          from teams t
          left join team_members tm on tm.team_id = t.id
          left join registrations r on r.user_id = tm.user_id
          left join users u on u.id = tm.user_id
          left join submissions s on s.team_id = t.id
         group by t.id, s.id
         order by t.name`,
      [],
    );
  }
  if (type === "submissions") {
    return safeRead(
      () => sql`
        select s.id, s.team_id, t.name as team_name, s.project, s.track,
               s.category, s.status, s.live_url, s.repo_url, s.submitted_at,
               s.updated_at
          from submissions s join teams t on t.id = s.team_id
         order by s.submitted_at desc nulls last, t.name`,
      [],
    );
  }
  if (type === "scores") {
    return safeRead(
      () => sql`
        select sc.submission_id, s.project, t.name as team_name,
               sc.judge_id, coalesce(nullif(u.name, ''), u.email) as judge,
               sc.shipped, sc.receipts, sc.growth, sc.craft,
               sc.submitted_at, sc.updated_at
          from scores sc
          join submissions s on s.id = sc.submission_id
          join teams t on t.id = s.team_id
          join users u on u.id = sc.judge_id
         order by s.project, judge`,
      [],
    );
  }
  if (type === "dietary") {
    return safeRead(
      () => sql`
        /* Crew included — this is the list that goes to the caterer,
           and they're eating too. */
        select u.id, u.name, u.handle, u.email, u.dietary, r.registered_at
          from users u
          left join registrations r
            on r.user_id = u.id and r.withdrawn_at is null
         where trim(u.dietary) <> ''
           and (r.user_id is not null
                or exists (select 1 from user_roles ur
                            where ur.user_id = u.id
                              and ur.role in ('judge', 'mentor', 'sponsor', 'volunteer')))
         order by lower(trim(u.dietary)), coalesce(nullif(u.name, ''), u.email)`,
      [],
    );
  }
  if (type === "checkins") {
    return safeRead(
      () => sql`
        select c.user_id, u.name, u.handle, u.email, c.day, c.checked_in_at,
               c.by as checked_in_by,
               coalesce(nullif(a.name, ''), a.email) as checked_in_by_name
          from event_checkins c join users u on u.id = c.user_id
          left join users a on a.id = c.by
         order by c.day, c.checked_in_at, coalesce(nullif(u.name, ''), u.email)`,
      [],
    );
  }
  return [];
}
