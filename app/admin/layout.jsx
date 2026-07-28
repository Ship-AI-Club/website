/* Keep admin pages inside the same signed-in shell as the dashboard. */

import "../account.css";

import { AccountHeader, AccountFooter } from "../../components/account-chrome";
import AccountNav from "../../components/account-nav";
import { requireAdmin } from "../../lib/auth";
import { pendingRequests } from "../../lib/store";
import { sql } from "../../lib/db";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  const admin = await requireAdmin();
  const requests = await pendingRequests();

  /* Unread mail to the club, badged next to Email — inbound arrives
     as a webhook, so this nav item is the only thing that tells you
     somebody wrote in. */
  const [{ unread }] = await sql`
    select count(*)::int as unread from inbound_emails
     where read_at is null and archived_at is null`;

  const sections = [
    /* Ops first, and on its own. Everything below it is records you
       maintain over months; this group is what's open on a laptop at
       the venue while the weekend is actually happening. */
    {
      title: "On the day",
      items: [
        { href: "/admin/ops", label: "Run of show" },
        { href: "/admin/ops/checkin", label: "Check-in" },
        { href: "/admin/ops/broadcast", label: "Broadcast" },
        { href: "/admin/ops/catering", label: "Catering" },
      ],
    },
    {
      title: "Records",
      items: [
        { href: "/admin", label: "Overview" },
        { href: "/admin/requests", label: "Requests", count: requests.length },
        { href: "/admin/users", label: "Users" },
        { href: "/admin/invites", label: "Invites" },
        { href: "/admin/assignments", label: "Assignments" },
        { href: "/admin/submissions", label: "Submissions" },
        { href: "/admin/scores", label: "Leaderboard" },
        { href: "/admin/sponsors", label: "Sponsors" },
        { href: "/admin/email", label: "Email", count: unread },
      ],
    },
    {
      title: "Account",
      items: [{ href: "/dashboard", label: "Back to dashboard" }],
    },
  ];

  return (
    <>
      <AccountHeader user={admin} />

      <div className="ac-shell">
        <aside className="ac-side">
          <div className="ac-whoami">
            <strong>{admin.name || "Admin account"}</strong>
            <span>{admin.email}</span>
          </div>
          <AccountNav sections={sections} />
        </aside>

        <main className="ac-main">{children}</main>
      </div>

      <AccountFooter />
    </>
  );
}
