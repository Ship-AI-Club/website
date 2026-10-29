import SiteFooter from "../../../../components/site-footer";
import SiteHeader from "../../../../components/site-header";
import { FOUNDER_WEEKEND as FW, FW_SPONSOR_TIERS } from "../../../../lib/founder-weekend";
import SponsorForm from "./sponsor-form";
import "../founder-weekend.css";

export const metadata = {
  title: `Sponsor ${FW.name} | Arizona AI Hackathon in Phoenix`,
  description: `Sponsor ${FW.name}, a free Arizona AI hackathon at ${FW.venue} in Phoenix, ${FW.datesShort}. Title sponsor $2,500 or sponsor $500, with published placements.`,
  alternates: { canonical: `${FW.url}/sponsor` },
  openGraph: {
    title: `Sponsor ${FW.name}`,
    description: `Title sponsor $2,500 or sponsor $500. A free Arizona AI hackathon in Phoenix, ${FW.datesShort}.`,
    url: `${FW.url}/sponsor`,
    siteName: "Ship AI",
    images: [{ url: FW.ogImage, width: 1200, height: 630 }],
  },
};

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const initial = FW_SPONSOR_TIERS.some((t) => t.id === params?.package) ? params.package : undefined;

  return (
    <>
      <SiteHeader
        links={[{ href: FW.path, label: FW.name }, { href: `${FW.path}#sponsor`, label: "Packages" }]}
        cta={<a className="btn btn-ghost btn-sm nav-cta" href={FW.path}>Back to the event</a>}
      />
      <main id="top" className="fw">
        <section className="section fw-sponsor-page" aria-labelledby="fw-sponsor-page-title">
          <div className="section-head">
            <p className="k">{FW.name}{" ·"} Sponsor</p>
            <h1 className="hero-h1" id="fw-sponsor-page-title">Back the builders. <span className="key">Pick a package.</span></h1>
            <p className="section-lede">
              Tell us who you are and which package fits. We reply by email and confirm the price and every placement in writing before anything is final.
            </p>
          </div>
          <div className="fw-sponsor-summary">
            {FW_SPONSOR_TIERS.map((tier) => (
              <div key={tier.id}>
                <p className="k">{tier.name}{" ·"} {tier.slots}</p>
                <p className="fw-sponsor-summary-price">${tier.price.toLocaleString("en-US")}</p>
                <ul className="checks">
                  {tier.perks.map((perk) => <li key={perk}>{perk}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="window fw-sponsor-window">
            <div className="window-bar"><b>Sponsor inquiry</b><span>{FW.datesShort}</span></div>
            <SponsorForm tiers={FW_SPONSOR_TIERS} initial={initial} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
