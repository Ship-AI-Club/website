import { notFound } from "next/navigation";
import HackathonPitchDeck from "../../../../../components/hackathon-pitch-deck";
import { buildPitch, PITCH_PATH } from "../../../../../lib/hackathon-pitch";
import "../../../../deck.css";
import "../../../../hackathon-pitch.css";

export const metadata = {
  title: "Five-minute Pitch Reference — Zero to Launch — Ship AI",
  description: "Four slides for your Zero to Launch pitch: your business, strategic positioning, ideal customer, and a live website walkthrough. Includes timings and speaker notes.",
  alternates: { canonical: `https://www.shipai.club${PITCH_PATH}` },
};

export default async function Page({ params }) {
  if ((await params).program !== "zero-to-launch") notFound();
  return <HackathonPitchDeck reference deck={buildPitch()} backHref="/programs/zero-to-launch/hackathon"/>;
}
