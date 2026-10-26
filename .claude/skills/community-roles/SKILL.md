---
name: community-roles
description: Who the people around Ship AI are — participant, sponsor, mentor, judge, volunteer, admin — what each one is promised, what the site shows them, and how someone becomes one. Use when writing copy aimed at a particular group, adding a role or a volunteer job, changing onboarding or the dashboard, deciding what a given person should see, or answering "who is this page for".
---

# Ship AI — who the people are

Six kinds of person touch the accounts system. Getting these straight is
what stops a judge being asked which track they're competing in, or a
first-time visitor being shown a scorecard.

The distinction that matters most, and the one that is easiest to lose:

- **`users.interests`** — what someone *said* they were here for, picked
  at onboarding. Cheap, self-declared, changeable.
- **`user_roles`** — what someone *is*. Only an admin writes it.
- **`role_requests`** — the bridge between the two. One open request per
  person per role.

Interest is not permission. Somebody ticking "judging" during onboarding
has told us something useful and been granted nothing.

## The six

### Participant

Anyone who competes. **Self-serve** — registering grants the role
outright, because rule 03 says anyone can compete and a gate would
contradict the page.

Gets: registration, a team (1–4, one team per person), a submission, a
certificate afterwards, Crowd Favorite voting.

Promised, in the site's own words: positioning that holds up, a pitch
they've delivered, a live marketing site, a public launch, a growth
engine, receipts. Those six are the `BUILDER_GOALS` in
`site/lib/accounts.js` and they are quoted verbatim from the "What you
leave with" section of `/hackathon`. **If one changes, change both.**

### Sponsor

Funds part of the program. Requests, then an admin approves, which also
opens a pledged `sponsorships` row. Tier is derived from the amount via
`tierFor()` — never hand-assigned — so stacking two Bronze items makes
Silver by arithmetic rather than by opinion. See the `sponsor-management`
skill for the money.

### Mentor

Saturday's 1:1 rotations. Requested and approved. Assigned to teams by an
admin; sees `/dashboard/mentoring` with who they're paired with and what
those teams are building.

### Judge

Sunday's pitches. Requested and approved, assigned to submissions, scores
against the four published criteria at 40/30/20/10. **A judge on a team
cannot be assigned to that team's entry and cannot score it** — checked
at assignment, at auto-assign, and again at save.

### Volunteer

A few hours on the day. Requested and approved. Picks one or more jobs
from `VOLUNTEER_JOBS`; each job states its hours out loud, because
"volunteer" with no number attached is how people get surprised.

Current jobs: **photography**, **check-in booth**. Adding another is one
entry in that array — the `jobs text[]` column needs no migration.

### Admin

Santos. `ADMIN_EMAIL` gets the flag on first sign-in; the first account
ever created also does, so a fresh database is never locked out. An admin
cannot revoke their own admin role.

## Crew vs entrants

**Crew** = judge, mentor, sponsor, volunteer. They are in the room and
not competing, and the dashboard reflects that: no registration form, no
team, no submission in the nav. They get their role card, the two
practical questions (dietary, anything we should know), their scorecards
or teams, Crowd Favorite voting, and the next meetup.

The test is **what someone has done, not who they are** — a mentor who
also registered sees both halves. Never gate on role alone where a
registration exists.

Two consequences that are easy to get wrong:

- Dietary needs and access notes live on **`users`**, not
  `registrations`. Crew eat the same lunch and use the same door, and
  they will never have a registrations row.
- Anything counting people in the room — check-in, catering, headcount —
  must union registered participants **and** crew. Reading
  `registrations` alone silently omits every judge, mentor and sponsor.

## How someone becomes something

```
sign in  →  onboarding (interests)  →  request a role  →  admin decides
                     ↓
              register  →  participant, immediately
```

Requests are the gated contact form. They replaced "email Santos": one
per role, can't be filed twice, and the person can see where theirs
stands. Approving emails the decision; declining emails it too, with the
admin's note.

## Writing for each of them

Match the register to what the person is deciding.

| Person | What they're deciding | Lead with |
| --- | --- | --- |
| Participant | whether to enter | that the code is the part they already have |
| Sponsor | whether it's worth the money | the named credit and the figure |
| Mentor | whether it's worth an afternoon | the specific teams and problems |
| Judge | whether it's serious | published criteria, real products, no deck round |
| Volunteer | whether it's a big ask | the hours, said plainly |

House style is in the `shipai-voice` skill and applies to all of them:
terse, concrete, no marketing language, no exclamation marks, no emoji.
Santos's mantras — *"feel the fear and do it anyways"*, *"just ship it"* —
are for participants; they land wrong on a sponsor.

## Where this lives

| Thing | File |
| --- | --- |
| Interests, roles, goals, volunteer jobs, the rubric | `site/lib/accounts.js` |
| Tables and columns | `site/lib/schema.sql` |
| Who sees what | `site/app/dashboard/page.jsx`, `site/app/dashboard/layout.jsx` |
| Requesting a role | `site/app/dashboard/requests/` |
| Deciding one | `site/app/admin/requests/`, `site/app/admin/actions.js` |
| Running the day | `site/app/admin/ops/` |

Adding a role means: `ROLES`, `REQUESTABLE_ROLES` if it can be asked for,
`INTERESTS` if onboarding should offer it, a prompt in the request form,
and — if they'll be in the room — the crew list in the dashboard and the
attending predicate in `lib/ops.js`. Miss that last one and they vanish
from check-in and the catering count.
