import { Link2 } from "lucide-react";

import { requireAdmin } from "../../../lib/auth";
import { sql } from "../../../lib/db";
import { roleLabel } from "../../../lib/accounts";
import { INVITABLE_ROLES } from "../../../lib/invites";
import { SITE } from "../../../lib/email";
import { CreateInviteForm, RevokeInviteForm } from "./invite-forms";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Invites — Ship AI",
  robots: { index: false, follow: false },
};

/* ------------------------------------------------------------------
   /admin/invites

   The alternative to waiting for someone to file a request you were
   always going to approve. You decide the roles, hand over a link,
   and they arrive already being what you agreed — which is the only
   sane way to express a package that includes two roles at once.
------------------------------------------------------------------ */

function when(value) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusOf(invite) {
  if (invite.revoked_at) return { label: "revoked", className: "is-off" };
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return { label: "expired", className: "is-off" };
  }
  if (invite.uses >= invite.max_uses) return { label: "used up", className: "is-off" };
  return { label: "live", className: "is-ok" };
}

export default async function Page() {
  await requireAdmin("/admin/invites");

  const invites = await sql`
    select i.*,
           coalesce(nullif(u.name, ''), u.email) as created_by_name,
           (select count(*)::int from invite_redemptions r where r.invite_id = i.id) as redeemed
      from invites i
      left join users u on u.id = i.created_by
     order by i.created_at desc
     limit 100`;

  const live = invites.filter((i) => statusOf(i).label === "live").length;

  return (
    <>
      <div className="ac-head">
        <p className="ac-kicker">Admin · Access</p>
        <h1>Invites</h1>
        <p>
          Hand someone a link instead of waiting for a request you were always going to
          approve. They sign in and arrive already holding the roles you picked.
        </p>
      </div>

      <section className="ac-card">
        <div className="ac-card-head">
          <Link2 size={18} strokeWidth={1.75} aria-hidden="true" />
          <h2>New invite</h2>
          {live > 0 && <span className="ac-pill is-ok">{live} live</span>}
        </div>
        <CreateInviteForm roles={INVITABLE_ROLES} origin={SITE} />
      </section>

      <section className="ac-card">
        <h2>Issued</h2>

        {invites.length === 0 ? (
          <div className="ac-empty">
            <strong>None yet.</strong>
            Invites you create appear here with their link and how many times each has been
            used.
          </div>
        ) : (
          <div className="ac-table-wrap">
            <table className="ac-table">
              <thead>
                <tr>
                  <th>Link</th>
                  <th>Grants</th>
                  <th>For</th>
                  <th className="ac-num">Used</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {invites.map((invite) => {
                  const status = statusOf(invite);
                  return (
                    <tr key={invite.id}>
                      <td>
                        <strong className="ac-mono">{invite.code}</strong>
                        <span className="ac-sub">
                          {SITE}/invite/{invite.code}
                        </span>
                        {invite.label && <span className="ac-sub">{invite.label}</span>}
                      </td>
                      <td>
                        {(invite.roles || []).map((r) => (
                          <span key={r} className="ac-pill" style={{ marginRight: ".3rem" }}>
                            {roleLabel(r)}
                          </span>
                        ))}
                      </td>
                      <td>
                        {invite.email || "anyone with the link"}
                        {invite.expires_at && (
                          <span className="ac-sub">expires {when(invite.expires_at)}</span>
                        )}
                      </td>
                      <td className="ac-num">
                        {invite.uses} / {invite.max_uses}
                      </td>
                      <td>
                        <span className={`ac-pill ${status.className}`}>{status.label}</span>
                      </td>
                      <td className="ac-num">
                        {status.label === "live" && <RevokeInviteForm id={invite.id} />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="ac-fine">
          An invite can grant anything except admin. That one is deliberate: a link can be
          forwarded, and the ability to grant roles and read everyone&apos;s email shouldn&apos;t
          travel by accident.
        </p>
      </section>
    </>
  );
}
