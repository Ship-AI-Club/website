import MobileNav from "../../../../components/mobile-nav";
import { notFound } from "next/navigation";
import { hasDb, sql } from "../../../../lib/db";
import WorkshopRecommendation from "../../../../components/workshop-recommendation";
import SiteFooter from "../../../../components/site-footer";
import "../../assessment.css";
import { Lockup } from "../../../../components/seal";
export const dynamic = "force-dynamic";
export const metadata = {title:"Workshop Recommendation | Ship AI",robots:{index:false,follow:false},referrer:"no-referrer"};
export default async function RecommendationPage({params}) {
  const {token} = await params;
  if (!/^[A-Za-z0-9_-]{32}$/.test(token) || !hasDb()) notFound();
  const [row] = await sql`select result from workshop_assessments where share_token=${token} and status='complete'`;
  if (!row?.result) notFound();
  return <><header className="nav"><Lockup /><a href="/workshops/assessment" className="btn btn-solid">Find my workshop</a><MobileNav /></header><main className="wa-page"><p className="wa-shared-label">A Shared Ship AI Recommendation</p><section className="wa-shell"><WorkshopRecommendation result={row.result} sharePath={`/workshops/recommendation/${token}`} /><a className="wa-reset" href="/workshops/assessment">Get your own recommendation →</a></section></main><SiteFooter/></>;
}
