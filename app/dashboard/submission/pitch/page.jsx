import { notFound } from "next/navigation";
import { requireOnboarded } from "../../../../lib/auth";
import { teamFor, submissionForTeam } from "../../../../lib/store";
import { buildPitch } from "../../../../lib/hackathon-pitch";
import HackathonPitchDeck from "../../../../components/hackathon-pitch-deck";
import "../../../deck.css";
import "../../../hackathon-pitch.css";

export const metadata = { title: "Your Pitch Draft — Ship AI", robots: { index: false, follow: false } };

export default async function Page({ searchParams }) {
  const user = await requireOnboarded("/dashboard/submission");
  const query = await searchParams;
  const team = await teamFor(user.id, query?.team || undefined);
  if (!team) notFound();
  const submission = await submissionForTeam(team.id);
  return <HackathonPitchDeck deck={buildPitch(submission || {}, team)} backHref={`/dashboard/submission?team=${team.id}`}/>;
}
