import "../account.css";

import { AccountHeader, AccountFooter } from "../../components/account-chrome";
import AccountNav from "../../components/account-nav";
import { requireUser, isAdmin, hasRole } from "../../lib/auth";
import { sql } from "../../lib/db";

export const dynamic = "force-dynamic";

/* The signed-in shell. The nav is assembled from granted roles, so a
   participant never sees a judging link and a judge only sees the
   admin one if they're also an admin. Every gated page re-checks on
   its own — a hidden link is presentation, not security. */

async function badgeCounts(user) {
  /* One round trip for all three badges. The admin branch is a bound
     boolean rather than a composed fragment — `sql` templates don't
     nest, and every query in this codebase stays a single static
     string with parameters. */
  const admin = isAdmin(user);
  const [row] = await sql`
    select
      (select count(*)::int from judge_assignments ja
        left join scores sc
          on sc.submission_id = ja.submission_id and sc.judge_id = ja.judge_id
       where ja.judge_id = ${user.id} and sc.submitted_at is null)          as to_score,
      (select count(*)::int from role_requests
        where status = 'pending'
          and (${admin}::boolean or user_id = ${user.id}))                  as requests,
      (select count(*)::int from certificate_holders
        where user_id = ${user.id})                                         as certificates,
      (select count(*)::int from registrations
        where user_id = ${user.id} and withdrawn_at is null)                as registered`;
  return row;
}

export default async function DashboardLayout({ children }) {
  const user = await requireUser("/dashboard");
  const counts = await badgeCounts(user);

  /* Crew are in the room but not entering, so a team and a submission
     are two links that lead nowhere useful for them. Someone who
     holds a crew role and registered anyway sees both — the test is
     what they've done, not who they are. */
  const crew = hasRole(user, "judge") || hasRole(user, "mentor") || hasRole(user, "sponsor");
  const showsCompeting = counts.registered > 0 || !crew;

  const sections = [
    {
      title: null,
      items: [
        { href: "/dashboard", label: "Overview" },
        ...(showsCompeting
          ? [
              { href: "/dashboard/team", label: "Your team" },
              { href: "/dashboard/submission", label: "Submission" },
            ]
          : []),
        {
          href: "/dashboard/certificates",
          label: "Certificates",
          count: counts.certificates,
        },
      ],
    },
    {
      title: "Get involved",
      items: [
        { href: "/dashboard/requests", label: "Requests" },
        ...(hasRole(user, "mentor")
          ? [{ href: "/dashboard/mentoring", label: "Teams you mentor" }]
          : []),
      ],
    },
    {
      title: "Account",
      items: [{ href: "/dashboard/profile", label: "Profile" }],
    },
  ];

  const staff = [
    ...(hasRole(user, "judge")
      ? [{ href: "/judge", label: "Judging", count: counts.to_score }]
      : []),
    ...(isAdmin(user) ? [{ href: "/admin", label: "Admin", count: counts.requests }] : []),
  ];
  if (staff.length) sections.push({ title: "Crew", items: staff });

  return (
    <>
      <AccountHeader user={user} />

      <div className="ac-shell">
        <aside className="ac-side">
          <div className="ac-whoami">
            <strong>{user.name || "Your account"}</strong>
            <span>{user.email}</span>
          </div>
          <AccountNav sections={sections} />
        </aside>

        <main className="ac-main">{children}</main>
      </div>

      <AccountFooter />
    </>
  );
}
