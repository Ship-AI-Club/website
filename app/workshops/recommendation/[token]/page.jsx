import { notFound } from "next/navigation";
import { hasDb, sql } from "../../../../lib/db";
import { PREVIEW_TOKEN, previewRecommendation } from "../../../../lib/workshop-assessment";
import WorkshopRecommendation from "../../../../components/workshop-recommendation";
import SiteFooter from "../../../../components/site-footer";
import SiteHeader from "../../../../components/site-header";

export const dynamic = "force-dynamic";
export const metadata = { title: "Workshop Recommendation | Ship AI", robots: { index: false, follow: false }, referrer: "no-referrer" };

async function resultFor(token) {
  /* SHIPAI_PREVIEW=1 renders the template without a database. */
  if (token === PREVIEW_TOKEN) return previewRecommendation();
  if (!hasDb()) return null;
  const [row] = await sql`select result from workshop_assessments where share_token=${token} and status='complete'`;
  return row?.result ?? null;
}

/* A shared recommendation. The visitor did not take the assessment, so
   the one action is to get their own. */
export default async function RecommendationPage({ params }) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{32}$/.test(token)) notFound();
  const result = await resultFor(token);
  if (!result) notFound();
  return (
    <>
      <SiteHeader current="/workshops" />
      <main id="top">
        <WorkshopRecommendation result={result} sharePath={`/workshops/recommendation/${token}`} shared />
        <div className="ev-end" />
      </main>
      <SiteFooter />
    </>
  );
}
