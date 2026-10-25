import { requireAdmin } from "../../../lib/auth";
import { emailList, EMAIL_SOURCES } from "../../../lib/email-list";
import { ASSESSMENT_OPTIONS } from "../../../lib/workshop-assessment";
import { workshopBySlug } from "../../../lib/workshops";
import { programBySlug } from "../../../lib/programs";
import { Download, Mail } from "lucide-react";
export const dynamic="force-dynamic";
export const metadata={title:"Email List | Ship AI Admin",robots:{index:false,follow:false}};
const label=(field,id)=>ASSESSMENT_OPTIONS[field]?.find(([value])=>value===id)?.[1] || id;
export default async function EmailListPage({searchParams}) {
  await requireAdmin();
  const params=await searchParams;
  const query=String(params.q||"").trim().slice(0,120),source=Object.hasOwn(EMAIL_SOURCES,params.source) ? params.source : "all";
  const page=Math.max(1,Math.min(10000,Number.parseInt(params.page,10)||1));
  const rows=await emailList({query,source,offset:(page-1)*50});
  const total=rows[0]?.total || 0;
  const qs=new URLSearchParams({q:query,source});
  return <><div className="ac-head"><p className="ac-kicker">Admin / Contacts</p><h1>Email List</h1><p>One contact per email, combining accounts, waitlists, and AI workshop assessments. Assessment answers are saved before recommendations run.</p></div>
    <form method="get" className="el-filter"><label>Search<input name="q" defaultValue={query} placeholder="Email, name, or company" maxLength={120}/></label><label>Source<select name="source" defaultValue={source}>{Object.entries(EMAIL_SOURCES).map(([id,title])=><option key={id} value={id}>{title}</option>)}</select></label><button className="btn btn-solid" type="submit">Filter</button><a className="btn btn-outline" href={`/api/admin/email-list/export?${qs}`}><Download size={16} aria-hidden="true"/>Export CSV</a></form>
    <p className="ac-note">{total} matching contacts · Page {page} · Newsletter opt-in is not inferred from assessment, account, or waitlist activity.</p>
    <section className="ac-card"><div className="ac-card-head"><Mail size={18} aria-hidden="true"/><h2>Saved Contacts</h2></div><div className="ac-table-wrap"><table className="ac-table el-table"><thead><tr><th>Contact</th><th>Sources</th><th>Workshop Interests & Assessment</th><th>Latest Activity</th></tr></thead><tbody>{rows.map(row=><tr key={row.email}><td><strong>{row.name || "—"}</strong><a href={`mailto:${row.email}`}>{row.email}</a>{row.company && <span>{row.company}</span>}</td><td>{row.sources.map(s=><span key={s} className="ac-pill">{EMAIL_SOURCES[s]}</span>)}</td><td>{row.activity.map((item,i)=><div key={i} className="el-activity">{item.source==="assessment" ? <><strong>{item.recommendation?.first?.name || `Assessment: ${item.status}`}</strong><p>{label("experience",item.profile?.experience)} · {label("role",item.profile?.role)} · {label("focus",item.profile?.focus)}</p>{item.goal && <p>Goal: {item.goal}</p>}{item.recommendation?.next && <p>Next: {item.recommendation.next.name}</p>}<small>Recommendation use only · Email unverified</small></> : item.source==="waitlist" ? <><strong>{workshopBySlug(item.recommendation?.program)?.name || programBySlug(item.recommendation?.program)?.name || item.recommendation?.program}</strong>{item.goal && <p>{item.goal}</p>}<small>Requested schedule updates</small></> : <small>Verified account email</small>}</div>)}</td><td>{new Date(row.latest).toLocaleString("en-US",{timeZone:"America/Phoenix",dateStyle:"medium",timeStyle:"short"})}<small>MST</small></td></tr>)}</tbody></table>{!rows.length && <div className="ac-empty"><strong>No matching contacts</strong><p>Try another search or source.</p></div>}</div></section>
    <nav aria-label="Email list pages" className="el-pages">{page>1 && <a href={`?${qs}&page=${page-1}`}>← Previous</a>}{page*50<total && <a href={`?${qs}&page=${page+1}`}>Next →</a>}</nav>
  </>;
}
