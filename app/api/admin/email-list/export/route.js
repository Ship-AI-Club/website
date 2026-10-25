import { requireAdmin } from "../../../../../lib/auth";
import { emailList, EMAIL_SOURCES, csvCell } from "../../../../../lib/email-list";
export const dynamic="force-dynamic";
export async function GET(request) {
  await requireAdmin();
  const params=new URL(request.url).searchParams;
  const source=Object.hasOwn(EMAIL_SOURCES,params.get("source")) ? params.get("source") : "all";
  const rows=await emailList({query:(params.get("q")||"").trim().slice(0,120),source,limit:10000});
  const csv=[["Email","Name","Company","Sources","Experience","Role","Focus","Goal","Recommended Workshop","Next Workshop","Latest Activity","Permission"],...rows.map(row=>{
    const assessment=row.activity.find(item=>item.source==="assessment");
    return [row.email,row.name,row.company,row.sources.join("; "),assessment?.profile?.experience,assessment?.profile?.role,assessment?.profile?.focus,assessment?.goal,assessment?.recommendation?.first?.name,assessment?.recommendation?.next?.name,row.latest,"Purpose-limited contact; no newsletter opt-in recorded"];
  })].map(row=>row.map(csvCell).join(",")).join("\r\n");
  return new Response(`\uFEFF${csv}`,{headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":"attachment; filename=ship-ai-email-list.csv","Cache-Control":"private, no-store"}});
}
