/* ------------------------------------------------------------------
   Ship AI accounts — schema.

   Applied by `npm run migrate` (scripts/migrate.mjs) against
   DATABASE_URL. Every statement is idempotent, so the script is safe
   to re-run after every change: add columns and tables here, never a
   numbered migration folder. Nothing in here drops anything.

   Conventions:
     · uuid primary keys, gen_random_uuid() (pgcrypto is built in on
       Postgres 13+, which Neon is)
     · text columns are NOT NULL DEFAULT '' rather than nullable, so
       reads never have to null-check a string
     · timestamps are timestamptz; nullable ones are the state flags
       (submitted_at, revoked_at, decided_at)
     · secrets are stored as sha-256 hashes, never in the clear
------------------------------------------------------------------ */

/* ---------- people ---------- */

create table if not exists users (
  id           uuid primary key default gen_random_uuid(),
  /* always lowercased by the app before it gets here — the unique
     index is what makes "log in with your email" a stable identity */
  email        text not null unique,
  name         text not null default '',
  /* The short public identifier — what a roster entry and a team
     member line show, and what a profile URL would use. Unique, so
     it's claimed once; nullable, because it's assigned during
     onboarding rather than at account creation. */
  handle       text unique,
  title        text not null default '',
  company      text not null default '',
  phone        text not null default '',
  discord      text not null default '',
  github       text not null default '',
  x_handle     text not null default '',
  linkedin     text not null default '',
  website      text not null default '',
  bio          text not null default '',
  /* Blob pathname and its URL. The path is what the upload route
     scopes and what a delete would target; the URL is what renders. */
  avatar_path  text not null default '',
  avatar_url   text not null default '',
  /* The company's mark, same two-column shape as the avatar and
     written by the same upload route. Asked for at onboarding from
     anyone who says they're sponsoring, so a logo arrives with the
     interest rather than chased down by email a month later. */
  company_logo      text not null default '',
  company_logo_path text not null default '',
  /* Practical facts about a person being in the room. These sit on
     the account rather than on `registrations` because registration
     means "competing", and a judge, mentor or sponsor eats the same
     lunch and uses the same door. */
  dietary      text not null default '',
  access_note  text not null default '',
  /* "Show me on the public attendee list." Opt-in, defaulting on:
     most people come to an event to be seen, and the toggle sits in
     onboarding where it's read rather than buried in settings. */
  public_profile boolean not null default true,
  /* onboarding: what they're here for, and what they want out of it.
     Values are ids from lib/accounts.js, validated app-side. */
  interests    text[] not null default '{}',
  goals        text[] not null default '{}',
  goal_note    text not null default '',
  /* sponsors only: the tier they said they were interested in */
  sponsor_tier text,
  is_admin     boolean not null default false,
  onboarded_at timestamptz,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz
);

/* Granted roles. Distinct from `interests` (what you said you wanted)
   and from `role_requests` (what you asked for) — this is what you
   actually are, and only an admin writes it. */
create table if not exists user_roles (
  user_id    uuid not null references users(id) on delete cascade,
  role       text not null,
  granted_at timestamptz not null default now(),
  granted_by uuid references users(id) on delete set null,
  primary key (user_id, role)
);

/* ---------- auth ---------- */

/* One row per "email me a code". Holds both the 6-digit code and the
   magic-link token so either path consumes the same row — clicking the
   link after typing the code can't log you in twice. */
create table if not exists login_codes (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  code_hash   text not null,
  token_hash  text not null,
  expires_at  timestamptz not null,
  consumed_at timestamptz,
  attempts    smallint not null default 0,
  ip          text not null default '',
  created_at  timestamptz not null default now()
);
create index if not exists login_codes_email_idx on login_codes (email, created_at desc);
create index if not exists login_codes_token_idx on login_codes (token_hash);
create index if not exists login_codes_ip_idx on login_codes (ip, created_at desc);

create table if not exists sessions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references users(id) on delete cascade,
  token_hash   text not null unique,
  user_agent   text not null default '',
  created_at   timestamptz not null default now(),
  expires_at   timestamptz not null,
  last_seen_at timestamptz not null default now(),
  revoked_at   timestamptz
);
create index if not exists sessions_user_idx on sessions (user_id, created_at desc);

/* ---------- role requests (the gated contact form) ---------- */

/* Someone who wants to sponsor, mentor or judge files one of these
   instead of emailing. Santos decides, and approving it grants the
   matching row in user_roles. */
create table if not exists role_requests (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references users(id) on delete cascade,
  role         text not null,
  status       text not null default 'pending',
  message      text not null default '',
  expertise    text not null default '',
  /* Volunteers only: which jobs they're offering to cover. Values are
     ids from VOLUNTEER_JOBS in lib/accounts.js. A list rather than a
     role each, so adding "runs the bell" next season is one line
     there and no migration here. */
  jobs         text[] not null default '{}',
  sponsor_tier text,
  admin_note   text not null default '',
  created_at   timestamptz not null default now(),
  decided_at   timestamptz,
  decided_by   uuid references users(id) on delete set null
);
/* "submit a request if they haven't already" — at most one open
   request per person per role. Declined ones don't block a re-ask. */
create unique index if not exists role_requests_open_uniq
  on role_requests (user_id, role) where status = 'pending';
create index if not exists role_requests_status_idx on role_requests (status, created_at desc);

/* ---------- hackathon ---------- */

/* Registering means competing. Dietary needs and the "anything we
   should know" note used to live here and now live on `users`, since
   crew attend too and were never going to have a row in this table. */
create table if not exists registrations (
  user_id       uuid primary key references users(id) on delete cascade,
  track         text not null default 'undecided',
  product       text not null default '',
  registered_at timestamptz not null default now(),
  withdrawn_at  timestamptz
);

create table if not exists teams (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  invite_code text not null unique,
  tagline     text not null default '',
  logo_path   text not null default '',
  logo_url    text not null default '',
  created_by  uuid references users(id) on delete set null,
  created_at  timestamptz not null default now()
);

create table if not exists team_members (
  team_id   uuid not null references teams(id) on delete cascade,
  user_id   uuid not null references users(id) on delete cascade,
  is_owner  boolean not null default false,
  joined_at timestamptz not null default now(),
  primary key (team_id, user_id)
);
/* Rule 01: teams of 1–4, one team per person. The cap is enforced
   app-side (it's a count, not a constraint); the identity is enforced
   here, because two teams claiming the same builder breaks scoring. */
create unique index if not exists team_members_one_per_person on team_members (user_id);

create table if not exists submissions (
  id           uuid primary key default gen_random_uuid(),
  team_id      uuid not null unique references teams(id) on delete cascade,
  project      text not null default '',
  track        text not null default '',
  category     text not null default '',
  live_url     text not null default '',
  summary      text not null default '',
  launch       text not null default '',
  receipts     text not null default '',
  growth       text not null default '',
  repo_url     text not null default '',
  status       text not null default 'draft',
  /* Filled in on Sunday, by an admin, after the judges are done.
     `award` is a category name from lib/results.js CATEGORIES;
     `crowd` is the room-voted one, which stacks with a judged win. */
  award        text,
  crowd        boolean not null default false,
  submitted_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists submissions_status_idx on submissions (status, submitted_at desc);

/* ---------- judging ---------- */

create table if not exists judge_assignments (
  submission_id uuid not null references submissions(id) on delete cascade,
  judge_id      uuid not null references users(id) on delete cascade,
  assigned_at   timestamptz not null default now(),
  assigned_by   uuid references users(id) on delete set null,
  primary key (submission_id, judge_id)
);

/* One scorecard per judge per submission. Columns match the four
   published criteria in lib/accounts.js — 40/30/20/10 — and the
   weighting lives in code, not here, so the rubric stays readable in
   one place. Each axis is 0–10; a null axis means "not scored yet". */
create table if not exists scores (
  submission_id uuid not null references submissions(id) on delete cascade,
  judge_id      uuid not null references users(id) on delete cascade,
  shipped       smallint,
  receipts      smallint,
  growth        smallint,
  craft         smallint,
  notes         text not null default '',
  submitted_at  timestamptz,
  updated_at    timestamptz not null default now(),
  primary key (submission_id, judge_id),
  constraint scores_range check (
    (shipped  is null or shipped  between 0 and 10) and
    (receipts is null or receipts between 0 and 10) and
    (growth   is null or growth   between 0 and 10) and
    (craft    is null or craft    between 0 and 10)
  )
);

/* Crowd Favorite is voted by the room, not scored. One vote each,
   changeable until voting closes. */
create table if not exists votes (
  user_id       uuid primary key references users(id) on delete cascade,
  submission_id uuid not null references submissions(id) on delete cascade,
  cast_at       timestamptz not null default now()
);

/* ---------- mentors and sponsors ---------- */

create table if not exists mentor_assignments (
  team_id     uuid not null references teams(id) on delete cascade,
  mentor_id   uuid not null references users(id) on delete cascade,
  slot        text not null default '',
  note        text not null default '',
  assigned_at timestamptz not null default now(),
  assigned_by uuid references users(id) on delete set null,
  primary key (team_id, mentor_id)
);

/* A confirmed sponsorship, recorded by an admin against the account
   that asked. `tier` is derived from `amount` via tierFor() when it
   isn't set explicitly — see lib/sponsors.js. */
create table if not exists sponsorships (
  id          uuid primary key default gen_random_uuid(),
  /* Nullable: a venue partner or an org that agreed over coffee is a
     real sponsor with a logo to place and no reason to have made an
     account. Linking one is how a sponsor sees their own record on
     their dashboard, not a precondition for existing. */
  user_id     uuid references users(id) on delete set null,
  org         text not null default '',
  tier        text,
  amount      integer not null default 0,
  items       text not null default '',
  status      text not null default 'pledged',
  credit_name text not null default '',
  note        text not null default '',
  /* The public half — what goes on the sponsor wall. */
  logo_url    text not null default '',
  logo_path   text not null default '',
  website     text not null default '',
  is_public   boolean not null default true,
  /* The mark is an icon rather than a lockup, so pair it with the
     name — same convention the homepage strip uses for desic. */
  wordmark    boolean not null default false,
  sort        integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists sponsorships_user_idx on sponsorships (user_id);

/* ---------- certificates ---------- */

/* `id` is the public slug and the credential id at once — it's what
   goes on LinkedIn and in /programs/zero-to-launch/hackathon/certificate/<id>, so it is
   permanent and never reused. Text, not uuid, because a human picks
   it and it has to read well in a URL. */
create table if not exists certificates (
  id            text primary key,
  kind          text not null,
  submission_id uuid references submissions(id) on delete set null,
  team          text not null default '',
  project       text not null default '',
  members       text[] not null default '{}',
  award         text,
  crowd         boolean not null default false,
  url           text not null default '',
  blurb         text not null default '',
  issued_at     timestamptz not null default now(),
  revoked_at    timestamptz
);

/* A team's certificate belongs to every member of that team: one
   public URL, four dashboards it shows up in. */
create table if not exists certificate_holders (
  certificate_id text not null references certificates(id) on delete cascade,
  user_id        uuid not null references users(id) on delete cascade,
  primary key (certificate_id, user_id)
);
create index if not exists certificate_holders_user_idx on certificate_holders (user_id);

/* ---------- email ---------- */

/* What Resend tells us happened to the mail we sent. One row per
   webhook delivery, keyed on the Svix message id so a retry — and
   Resend retries — can't double-count a bounce.

   `payload` keeps the whole event because the shape varies by type
   and the useful field for a given type is often one we didn't think
   to extract. The columns above it are just the ones worth indexing. */
create table if not exists email_events (
  id          bigserial primary key,
  event_id    text not null unique,
  type        text not null,
  email_id    text not null default '',
  from_addr   text not null default '',
  to_addrs    text[] not null default '{}',
  subject     text not null default '',
  payload     jsonb not null default '{}',
  occurred_at timestamptz not null default now(),
  created_at  timestamptz not null default now()
);
create index if not exists email_events_email_idx on email_events (email_id, occurred_at desc);
create index if not exists email_events_type_idx on email_events (type, occurred_at desc);
create index if not exists email_events_created_idx on email_events (created_at desc);

/* Mail sent *to* shipai.club. Receiving is catch-all, so santos@ and
   hi@ both land here and `to_addrs` is what distinguishes them.

   The webhook carries metadata only — no body, no headers — so the
   body is fetched from Resend afterwards and cached here. `has_body`
   records whether that fetch succeeded, because a missing body is a
   thing to retry rather than an empty message. */
create table if not exists inbound_emails (
  id           text primary key,
  message_id   text not null default '',
  from_addr    text not null default '',
  to_addrs     text[] not null default '{}',
  cc_addrs     text[] not null default '{}',
  received_for text not null default '',
  subject      text not null default '',
  body_text    text not null default '',
  body_html    text not null default '',
  attachments  jsonb not null default '[]',
  has_body     boolean not null default false,
  spam         boolean not null default false,
  read_at      timestamptz,
  replied_at   timestamptz,
  archived_at  timestamptz,
  received_at  timestamptz not null default now(),
  created_at   timestamptz not null default now()
);
create index if not exists inbound_emails_received_idx on inbound_emails (received_at desc);
create index if not exists inbound_emails_unread_idx on inbound_emails (read_at) where read_at is null;

/* ---------- invites ---------- */

/* An admin hands someone a link instead of asking them to file a
   request that the admin then approves. The roles are decided up
   front, which is what makes a package — "you're mentoring and
   sponsoring" — one link rather than two round trips.

   `roles` is a list for exactly that reason. `email`, when set, locks
   the code to one address so a forwarded link grants nothing. */
create table if not exists invites (
  id         uuid primary key default gen_random_uuid(),
  code       text not null unique,
  roles      text[] not null default '{}',
  email      text not null default '',
  label      text not null default '',
  note       text not null default '',
  max_uses   integer not null default 1,
  uses       integer not null default 0,
  expires_at timestamptz,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);
create index if not exists invites_code_idx on invites (code);

/* Who used which, so a shared code can be reconciled afterwards and
   the same person can't consume two uses of it. */
create table if not exists invite_redemptions (
  invite_id   uuid not null references invites(id) on delete cascade,
  user_id     uuid not null references users(id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  primary key (invite_id, user_id)
);

/* ---------- ops ---------- */

/* Runtime switches an admin can flip without a deploy: whether
   results are public, whether crowd voting is open, whether
   submissions are still accepted. Read through lib/settings.js. */
create table if not exists settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

/* Every admin action that changes someone else's standing — a granted
   role, an assigned judge, an issued certificate. Append-only. */
create table if not exists audit_log (
  id         bigserial primary key,
  actor_id   uuid references users(id) on delete set null,
  action     text not null,
  target     text not null default '',
  meta       jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists audit_log_created_idx on audit_log (created_at desc);

create table if not exists event_checkins (
  user_id       uuid references users(id) on delete cascade,
  day           text not null,
  checked_in_at timestamptz not null default now(),
  by            uuid references users(id) on delete set null,
  primary key (user_id, day)
);
create index if not exists event_checkins_day_idx on event_checkins (day, checked_in_at desc);

create table if not exists broadcasts (
  id         uuid primary key default gen_random_uuid(),
  segment    text not null,
  subject    text not null,
  body       text not null,
  recipients int not null default 0,
  sent_by    uuid references users(id) on delete set null,
  sent_at    timestamptz not null default now()
);
create index if not exists broadcasts_sent_idx on broadcasts (sent_at desc);

/* ---------- waitlist ---------- */

/* People who want to hear when a program that has no dates yet gets
   them. Keyed by program slug rather than a foreign key: programs are
   defined in lib/programs.js, not in the database, so the next program
   to go up unscheduled gets this table for free.

   Deliberately not an account. Asking someone to create one before
   they can say "tell me when this runs" would lose most of them, so
   the email is the identity and there is no user_id. */
create table if not exists waitlist (
  id         uuid primary key default gen_random_uuid(),
  /* lib/programs.js slug — 'day-zero', and whatever comes next */
  program    text not null,
  name       text not null,
  company    text not null default '',
  /* lowercased by the route before it gets here, same as users.email */
  email      text not null,
  /* what they want out of the program, in their words */
  goal       text not null default '',
  notes      text not null default '',
  /* Rate-limit key only, same as login_codes.ip. Never displayed. */
  ip         text not null default '',
  created_at timestamptz not null default now()
);

/* One row per person per program. Signing up twice is somebody
   checking they're on the list, not a second signup — the route says
   so and writes nothing. As a separate index rather than a table
   constraint so it lands on an existing table too. */
create unique index if not exists waitlist_program_email_uniq on waitlist (program, email);
create index if not exists waitlist_program_idx on waitlist (program, created_at desc);
create index if not exists waitlist_ip_idx on waitlist (ip, created_at desc);

/* ------------------------------------------------------------------
   Catching up an existing database.

   `create table if not exists` does nothing to a table that already
   exists, so a column added to a definition above will never reach a
   database that was created before it. Any column added after the
   first deploy therefore goes in two places: the table definition, so
   a fresh database is right, and here, so an existing one catches up.

   Both are idempotent. Nothing below ever drops or retypes a column —
   if a change can't be expressed as an additive alter, it wants a
   hand-written migration and a moment's thought, not this file.
------------------------------------------------------------------ */

alter table users add column if not exists handle         text;
alter table users add column if not exists phone          text not null default '';
alter table users add column if not exists linkedin       text not null default '';
alter table users add column if not exists avatar_path    text not null default '';
alter table users add column if not exists avatar_url     text not null default '';
alter table users add column if not exists public_profile boolean not null default true;
create unique index if not exists users_handle_uniq on users (handle) where handle is not null;

alter table role_requests add column if not exists jobs text[] not null default '{}';

alter table sponsorships add column if not exists logo_url  text not null default '';
alter table sponsorships add column if not exists logo_path text not null default '';
alter table sponsorships add column if not exists website   text not null default '';
alter table sponsorships add column if not exists is_public boolean not null default true;
alter table sponsorships add column if not exists sort      integer not null default 0;
alter table sponsorships add column if not exists wordmark  boolean not null default false;

/* Confirmed sponsors predate accounts — Workuity has been hosting
   since before any of this existed. Requiring a user row to record
   one would mean inventing an account for an organisation. */
alter table sponsorships alter column user_id drop not null;

alter table teams add column if not exists tagline   text not null default '';
alter table teams add column if not exists logo_path text not null default '';
alter table teams add column if not exists logo_url  text not null default '';

/* The one drop this file will do. `pronouns` was asked for at
   onboarding and removed before the program opened; the column has a
   single row's worth of data and no reader left. Dropping it now is
   the difference between a schema that describes the database and one
   that carries a field nobody can explain in six months. It is
   deliberately the exception to the rule above, and any future
   removal deserves the same amount of thought rather than this line
   as a precedent. */
alter table users drop column if exists pronouns;

alter table users add column if not exists dietary     text not null default '';
alter table users add column if not exists access_note text not null default '';

/* The sponsor's logo, collected at onboarding. `company_logo` is the
   URL that renders; `company_logo_path` is the blob pathname the
   upload route scopes and a delete would target — the same pair the
   avatar keeps, for the same reasons. */
alter table users add column if not exists company_logo      text not null default '';
alter table users add column if not exists company_logo_path text not null default '';

/* Same reasoning as the pronouns drop, and safe for the same reason:
   these moved to `users` before anybody had filled them in, so there
   is nothing to carry across. Had there been rows, this would want a
   copy step and a separate deploy rather than a drop. */
alter table registrations drop column if exists dietary;
alter table registrations drop column if exists note;

alter table event_checkins add column if not exists user_id       uuid references users(id) on delete cascade;
alter table event_checkins add column if not exists day           text not null;
alter table event_checkins add column if not exists checked_in_at timestamptz not null default now();
alter table event_checkins add column if not exists by            uuid references users(id) on delete set null;

alter table broadcasts add column if not exists id         uuid default gen_random_uuid();
alter table broadcasts add column if not exists segment    text not null;
alter table broadcasts add column if not exists subject    text not null;
alter table broadcasts add column if not exists body       text not null;
alter table broadcasts add column if not exists recipients int not null default 0;
alter table broadcasts add column if not exists sent_by    uuid references users(id) on delete set null;
alter table broadcasts add column if not exists sent_at    timestamptz not null default now();
