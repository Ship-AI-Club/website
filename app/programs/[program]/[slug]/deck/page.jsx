import { notFound } from "next/navigation";
import { Slide } from "../../../../../components/deck";
import { deckFor } from "../../../../../lib/decks";
import { PROGRAMS, programBySlug, sessionBySlug } from "../../../../../lib/programs";
import DeckControls from "./deck-controls";

const SITE = "https://www.shipai.club";

export function generateStaticParams() {
  return PROGRAMS.flatMap((program) =>
    program.sessions
      .filter((session) => deckFor(program.slug, session.slug))
      .map((session) => ({ program: program.slug, slug: session.slug }))
  );
}

export async function generateMetadata({ params }) {
  const { program: programSlug, slug } = await params;
  const program = programBySlug(programSlug);
  const w = sessionBySlug(program, slug);
  if (!program || !w) return {};
  const title = `${w.eventTitle} — Slides`;
  const url = `${SITE}/programs/${program.slug}/${w.slug}/deck`;
  return {
    title: `${title} — Ship AI`,
    description: `The ${program.name} session ${w.n} presentation. ${w.copy}`.slice(0, 300),
    alternates: { canonical: url },
    openGraph: { title, description: w.copy.slice(0, 200), url, siteName: "Ship AI", images: [{ url: "/og-image.jpg", width: 1200, height: 630 }] },
  };
}

export default async function Page({ params }) {
  const { program: programSlug, slug } = await params;
  const program = programBySlug(programSlug);
  const w = sessionBySlug(program, slug);
  const slides = program && w && deckFor(program.slug, slug);
  if (!program || !w || !slides) notFound();
  const programHref = `/programs/${program.slug}`;

  return (
    <div className="dk-page">
      <header className="dk-bar">
        <a href={`${programHref}/${w.slug}`} className="dk-bar-back">← {w.eventTitle}</a>
        <span className="dk-bar-hint">Arrows or space to advance · F for fullscreen · ⌘P to save as PDF</span>
        <a href={programHref} className="dk-bar-all">Sessions</a>
      </header>
      <div className="dk-track" data-lenis-prevent tabIndex={-1}>
        {slides.map((s, i) => <Slide key={i} slide={s} workshop={w} program={program} index={i} total={slides.length} />)}
      </div>
      <DeckControls total={slides.length} />
    </div>
  );
}
