import "../account.css";

import { AccountHeader, AccountFooter } from "../../components/account-chrome";
import AccountNav from "../../components/account-nav";
import { requireRole, isAdmin } from "../../lib/auth";
import { sql } from "../../lib/db";

export const dynamic = "force-dynamic";

/* The judge shell. Gated on the granted role rather than on an
   interest — saying you'd like to judge and being on the panel are
   different facts, and only an admin turns one into the other. */

export default async function JudgeLayout({ children }) {
  const user = await requireRole("judge", "/judge");

  const [counts] = await sql`
    select
      count(*)::int                                          as assigned,
      count(*) filter (where sc.submitted_at is null)::int    as outstanding
      from judge_assignments ja
      left join scores sc
        on sc.submission_id = ja.submission_id and sc.judge_id = ja.judge_id
     where ja.judge_id = ${user.id}`;

  const sections = [
    {
      title: null,
      items: [{ href: "/judge", label: "Your queue", count: counts.outstanding }],
    },
    {
      title: "Elsewhere",
      items: [
        { href: "/dashboard", label: "Your dashboard" },
        ...(isAdmin(user) ? [{ href: "/admin", label: "Admin" }] : []),
      ],
    },
  ];

  return (
    <>
      <AccountHeader user={user} />

      <div className="ac-shell">
        <aside className="ac-side">
          <div className="ac-whoami">
            <strong>{user.name || "Judge"}</strong>
            <span>
              {counts.assigned} assigned · {counts.outstanding} to score
            </span>
          </div>
          <AccountNav sections={sections} />
        </aside>

        <main className="ac-main">{children}</main>
      </div>

      <AccountFooter />
    </>
  );
}
