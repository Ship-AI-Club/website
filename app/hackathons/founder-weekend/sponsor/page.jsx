import SiteFooter from "../../../../components/site-footer";
import SiteHeader from "../../../../components/site-header";
import { EventHero } from "../../../../components/event-page";
import { FormBoard } from "../../../../components/event-form";
import { FOUNDER_WEEKEND as FW, FW_SPONSOR_TIERS } from "../../../../lib/founder-weekend";
import { DISCORD } from "../../../../lib/hackathon";
import SponsorForm from "./sponsor-form";

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

/* The counter: the board under the headline is the inquiry form. Each
   package shows its price and placements on its own choice, once. */
export default async function Page({ searchParams }) {
  const params = await searchParams;
  const initial = FW_SPONSOR_TIERS.some((t) => t.id === params?.package) ? params.package : undefined;

  return (
    <>
      <SiteHeader />
      <main id="top">
        <EventHero
          crumb={{ href: FW.path, label: FW.name }}
          title="Back the builders."
          keyPhrase="Pick a package."
          lede="Tell us who you are and which package fits. We reply by email and confirm the price and every placement in writing before anything is final."
        />
        <FormBoard
          scene="slipway"
          alt="A boat on the slipway, still being built"
          label="Sponsor inquiry"
          bar={["Sponsor inquiry", FW.datesShort]}
        >
          <SponsorForm tiers={FW_SPONSOR_TIERS} initial={initial} />
        </FormBoard>
        <div className="ev-end" />
      </main>
      <SiteFooter />
    </>
  );
}
