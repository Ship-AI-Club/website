import { notFound } from "next/navigation";
import { requireRole } from "../../../../../lib/auth";
import { presentationSubmission } from "../../../../../lib/presentations";
import { buildPitch } from "../../../../../lib/hackathon-pitch";
import { submissionPitchMode } from "../../../../../lib/submissions";
import HackathonPitchDeck from "../../../../../components/hackathon-pitch-deck";
import "../../../../deck.css";
import "../../../../hackathon-pitch.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Team pitch — Ship AI", robots: { index: false, follow: false } };

export default async function Page({ params }) {
  await requireRole("judge", "/judge/presentations");
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const entry = await presentationSubmission(id);
  if (!entry || submissionPitchMode(entry.pitch) !== "generated") notFound();
  return <HackathonPitchDeck deck={buildPitch(entry, { name: entry.team_name })} backHref={`/judge/presentations?team=${id}`} backLabel="Presentation order" />;
}
