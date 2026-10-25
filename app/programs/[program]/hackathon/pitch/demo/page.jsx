import { notFound } from "next/navigation";
import HackathonPitchDeck from "../../../../../../components/hackathon-pitch-deck";
import { buildPitch, DEMO_PITCH, DEMO_PITCH_TEAM, PITCH_PATH } from "../../../../../../lib/hackathon-pitch";
import "../../../../../deck.css";
import "../../../../../hackathon-pitch.css";

export const metadata = {
  title: "Porchlight Demo Pitch — Zero to Launch — Ship AI",
  description: "All four slides of a fictional team's five-minute pitch, using the Zero to Launch presentation design.",
  robots: { index: false, follow: false },
};

export default async function Page({ params, searchParams }) {
  if ((await params).program !== "zero-to-launch") notFound();
  return <HackathonPitchDeck demo initialOverview={(await searchParams)?.view === "all"}
    deck={buildPitch(DEMO_PITCH, DEMO_PITCH_TEAM)} backHref={PITCH_PATH}
    preview="/hackathon-opening/porchlight-marketing-site.png"/>;
}
