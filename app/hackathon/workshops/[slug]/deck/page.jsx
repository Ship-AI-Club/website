import { notFound } from "next/navigation";
import { Slide } from "../../../../../components/deck";
import { deckFor } from "../../../../../lib/decks";
import { WORKSHOPS, workshopBySlug } from "../../../../../lib/hackathon";
import DeckControls from "./deck-controls";

export function generateStaticParams() {
  return WORKSHOPS.filter((w) => deckFor(w.slug)).map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const w = workshopBySlug(slug);
  if (!w) return {};
  const title = `${w.eventTitle} — slides`;
  return {
    title: `${title} — Ship AI`,
    description: `The Zero to Launch session ${w.n} presentation. ${w.copy}`.slice(0, 300),
    alternates: { canonical: `https://www.shipai.club/hackathon/workshops/${w.slug}/deck` },
    openGraph: {
      title,
      description: w.copy.slice(0, 200),
      url: `https://www.shipai.club/hackathon/workshops/${w.slug}/deck`,
      siteName: "Ship AI",
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const w = workshopBySlug(slug);
  const slides = w && deckFor(slug);
  if (!slides) notFound();

  return (
    <div className="dk-page">
      <header className="dk-bar">
        <a href={`/hackathon/workshops/${w.slug}`} className="dk-bar-back">
          ← {w.eventTitle}
        </a>
        <span className="dk-bar-hint">
          Arrows or space to advance · F for fullscreen · ⌘P to save as PDF
        </span>
        <a href="/hackathon/workshops" className="dk-bar-all">
          All sessions
        </a>
      </header>

      {/* data-lenis-prevent: the site's smooth-scroll driver owns the window,
          and would otherwise swallow wheel events inside this container */}
      <div className="dk-track" data-lenis-prevent tabIndex={-1}>
        {slides.map((s, i) => (
          <Slide key={i} slide={s} workshop={w} index={i} total={slides.length} />
        ))}
      </div>

      <DeckControls total={slides.length} />
    </div>
  );
}
