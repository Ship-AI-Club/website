import MobileNav from "../../../components/mobile-nav";
import WorkshopAssessment from "../../../components/workshop-assessment";
import SiteFooter from "../../../components/site-footer";
import { ArrowLeft } from "lucide-react";
import "../assessment.css";
export const metadata = {title:"Find Your First AI Workshop | Ship AI",description:"Take a one-minute AI assessment to find your first Ship AI workshop based on experience, role, and business goals.",alternates:{canonical:"https://www.shipai.club/workshops/assessment"}};
export default function AssessmentPage() {
  return <><header className="nav"><a className="brand" href="/"><img src="/logo-mark.png" alt="" width={26} height={26}/><span>Ship AI</span></a><nav><a href="/workshops">Workshops</a><a href="/programs">Programs</a><a href="/about">About</a></nav><a href="/dashboard" className="btn btn-solid nav-cta">Account</a><MobileNav /></header><main className="wa-page"><a href="/workshops" className="wa-library-back"><ArrowLeft size={15} aria-hidden="true"/>All Workshops</a><WorkshopAssessment/></main><SiteFooter/></>;
}
