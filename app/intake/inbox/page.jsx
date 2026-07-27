import { notFound } from "next/navigation";
import { get, list } from "@vercel/blob";
import { Download, Paperclip } from "lucide-react";
import "../intake.css";
import { BLOB_PREFIX, INLINE_TYPES, RECORD_FILE, formatBytes } from "../../../lib/intake";
import { isAuthorized } from "../../../lib/intake-auth";

/* Private store, so there are no public URLs to hand out — every file is
   read back through /api/intake/file, gated on the same ?key= as this
   page. Reach it at /intake/inbox?key=<INTAKE_ADMIN_KEY>. */

export const metadata = {
  title: "Intake inbox — Ship AI",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

async function readRecords() {
  const { blobs } = await list({ prefix: BLOB_PREFIX, limit: 1000 });
  const records = blobs.filter((b) => b.pathname.endsWith(`/${RECORD_FILE}`));

  const parsed = await Promise.all(
    records.map(async (blob) => {
      try {
        const result = await get(blob.pathname, { access: "private" });
        if (!result || result.statusCode !== 200) return null;
        return await new Response(result.stream).json();
      } catch {
        return null;
      }
    }),
  );

  return parsed
    .filter(Boolean)
    .sort((a, b) => String(b.receivedAt).localeCompare(String(a.receivedAt)));
}

function Asset({ file, kind, keyParam }) {
  const href = `/api/intake/file?key=${encodeURIComponent(keyParam)}&path=${encodeURIComponent(file.pathname)}`;
  const previewable = INLINE_TYPES.includes(file.contentType);

  return (
    <a className="ik-asset" href={`${href}&dl=1`}>
      {previewable ? (
        <img src={href} alt="" />
      ) : (
        <Paperclip size={16} strokeWidth={1.75} aria-hidden="true" />
      )}
      <span>
        <span className="ik-asset-kind">{kind}</span>
        <br />
        {file.name} · {formatBytes(file.size)}
      </span>
      <Download size={14} strokeWidth={1.75} aria-hidden="true" />
    </a>
  );
}

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const key = params?.key;

  if (!isAuthorized(key)) notFound();

  const records = await readRecords();

  return (
    <main className="ik-inbox">
      <p className="kicker">Intake</p>
      <h1>Submissions</h1>
      <p className="ik-inbox-count">
        {records.length} {records.length === 1 ? "submission" : "submissions"} · newest first
      </p>

      {records.length === 0 && (
        <p className="ik-empty">
          Nothing yet. Send someone to /intake and it lands here.
        </p>
      )}

      {records.map((record) => (
        <article className="ik-sub" key={record.id}>
          <div className="ik-sub-head">
            <span className="ik-tag">{record.role}</span>
            <h2>{record.name}</h2>
            <span className="ik-sub-when">
              {new Date(record.receivedAt).toLocaleString("en-US", {
                timeZone: "America/Phoenix",
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>

          <p className="ik-sub-line">
            {record.title}
            {record.company ? ` · ${record.company}` : ""}
          </p>
          <p className="ik-sub-line">
            <a href={`mailto:${record.email}`}>{record.email}</a>
          </p>

          {record.note && <p className="ik-sub-note">{record.note}</p>}

          {(record.avatar || record.logo || record.assets.length > 0) && (
            <div className="ik-sub-files">
              {record.avatar && (
                <Asset file={record.avatar} kind="avatar" keyParam={key} />
              )}
              {record.logo && <Asset file={record.logo} kind="logo" keyParam={key} />}
              {record.assets.map((asset) => (
                <Asset key={asset.pathname} file={asset} kind="asset" keyParam={key} />
              ))}
            </div>
          )}
        </article>
      ))}
    </main>
  );
}
