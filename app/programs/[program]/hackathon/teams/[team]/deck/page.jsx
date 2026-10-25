import { notFound } from "next/navigation";
import { publicTeam, publicTeamPath } from "../../../../../../../lib/public-teams";
import { buildPitch } from "../../../../../../../lib/hackathon-pitch";
import { submissionPitchMode } from "../../../../../../../lib/submissions";
import HackathonPitchDeck from "../../../../../../../components/hackathon-pitch-deck";
import "../../../../../../deck.css";
import "../../../../../../hackathon-pitch.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Team pitch — Ship AI", robots: { index: false, follow: true } };

export default async function Page({ params }) {
  const { program, team: slug } = await params;
  if (program !== "zero-to-launch") notFound();
  const team = await publicTeam(slug);
  if (!team?.submitted || submissionPitchMode(team.pitch) !== "generated") notFound();
  return <HackathonPitchDeck deck={buildPitch(team, team)} backHref={publicTeamPath(team)} backLabel="Team page" />;
}
