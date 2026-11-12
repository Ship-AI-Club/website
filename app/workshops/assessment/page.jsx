import WorkshopAssessment from "../../../components/workshop-assessment";
import SiteFooter from "../../../components/site-footer";
import SiteHeader from "../../../components/site-header";

export const metadata = {
  title: "Find Your First AI Workshop | Ship AI",
  description: "Take a one-minute AI assessment to find your first Ship AI workshop based on experience, role, and business goals.",
  alternates: { canonical: "https://www.shipai.club/workshops/assessment" },
};

export default function AssessmentPage() {
  return (
    <>
      <SiteHeader current="/workshops" />
      <main id="top">
        <WorkshopAssessment />
        <div className="ev-end" />
      </main>
      <SiteFooter />
    </>
  );
}
