import { notFound } from "next/navigation";
import { WorkshopDeck } from "../../../../components/workshop-materials.jsx";
import { TALKS, talkBySlug, talkFullTitle } from "../../../../lib/talks";
import { ogImage } from "../../../../lib/og";
import "../../talk-deck.css";

const SITE = "https://www.shipai.club";

export function generateStaticParams() {
  return TALKS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const talk = talkBySlug(slug);
  if (!talk) return {};
  const title = `${talkFullTitle(talk)} - Slides`;
  const url = `${SITE}/talks/${talk.slug}/deck`;
  return {
    title: `${title} - Ship AI`,
    description: `Slides and copyable Claude Code prompts. ${talk.copy}`.slice(0, 300),
    alternates: { canonical: url },
    openGraph: { title, description: talk.copy.slice(0, 200), url, siteName: "Ship AI", images: [ogImage({ kicker: "Talks · Slides", title: talk.eventTitle, key: talk.key, meta: `${talk.startISO ? talk.dateLabel : "Coming soon"} · Free` })] },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const talk = talkBySlug(slug);
  if (!talk) notFound();
  return <WorkshopDeck slug={talk.slug} material={talk.deck} isHost={false} back={{ href: `/talks/${talk.slug}`, label: `← ${talk.eventTitle}` }} all={{ href: "/talks", label: "Talks" }} chrome="Ship AI · Talks" className="wm-talk" />;
}
