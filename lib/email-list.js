import "server-only";
import { sql } from "./db";
import { assessmentStorage } from "./assessment-store";
export const EMAIL_SOURCES = {all:"All Sources",assessment:"AI Assessment",waitlist:"Waitlist",account:"Account"};
export async function emailList({query="",source="all",offset=0,limit=50}={}) {
  await assessmentStorage();
  return sql`with entries as (
    select email,name,company,'account'::text as source,''::text as goal,
      null::jsonb as profile,null::jsonb as recommendation,'verified'::text as status,created_at from users
    union all
    select email,name,company,'waitlist',goal,null::jsonb,jsonb_build_object('program',program),'requested dates',created_at from waitlist
    union all
    select email,''::text,''::text,'assessment',answers->>'goal',answers,result,status,created_at from workshop_assessments
  ), contacts as (
    select email, max(name) as name,max(company) as company,array_agg(distinct source) as sources,
      max(created_at) as latest, jsonb_agg(jsonb_build_object('source',source,'goal',goal,'profile',profile,'recommendation',recommendation,'status',status,'createdAt',created_at) order by created_at desc) as activity
    from entries group by email
  ) select *,count(*) over()::int as total from contacts
    where (${source}='all' or ${source}=any(sources))
      and (${query}='' or position(lower(${query}) in lower(email || ' ' || name || ' ' || company))>0)
    order by latest desc,email limit ${limit} offset ${offset}`;
}
export function csvCell(value) {
  const text = String(value ?? "");
  const safe = /^[\s]*[=+@-]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"','""')}"`;
}
