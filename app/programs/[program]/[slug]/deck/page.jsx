import {loadFxShowcaseConfig} from "../../../../../lib/fx-showcase-config";
import { notFound } from "next/navigation";
import { Slide } from "../../../../../components/deck";
import { deckFor } from "../../../../../lib/decks";
import { growthDeckForTrack } from "../../../../../lib/growth-engineering-deck";
import { PROGRAMS, programBySlug, sessionBySlug } from "../../../../../lib/programs";
import DeckControls from "./deck-controls";
import { ogImage } from "../../../../../lib/og";

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
    openGraph: { title, description: w.copy.slice(0, 200), url, siteName: "Ship AI", images: [ogImage({ kicker: `${program.name} · Session ${w.n} slides`, title: w.eventTitle, meta: "Slides · Free" })] },
  };
}

export default async function Page({ params, searchParams }) {
  const { program: programSlug, slug } = await params;
  const program = programBySlug(programSlug);
  const w = sessionBySlug(program, slug);
  const original = program && w && deckFor(program.slug, slug);
  const isGrowth = programSlug === 'zero-to-launch' && slug === 'growth-engineering';
  const track = isGrowth ? (await searchParams)?.track : null;
  const selectedTrack = ['grok-bot','engineer'].includes(track) ? track : null;
  const slides = original ? isGrowth ? growthDeckForTrack(selectedTrack) : [...original] : null;
  if (!program || !w || !slides) notFound();
  if(!['marketing-site','growth-engineering'].includes(slug)) {
    const config=await loadFxShowcaseConfig(`program:${programSlug}:${slug}`);
    if(config){const first=slides.findIndex(s=>s.kind==='terminal');slides.splice(first>=0?first+1:Math.min(5,slides.length),0,{kind:'skill-showcase',config});}
  }
  const programHref = `/programs/${program.slug}`;

  return (
    <div className="dk-page" data-growth-track={isGrowth ? selectedTrack || 'portal' : undefined}>
      <header className="dk-bar">
        <a href={isGrowth && selectedTrack ? `${programHref}/${w.slug}/deck` : `${programHref}/${w.slug}`} className="dk-bar-back">← {isGrowth && selectedTrack ? 'Choose a path' : w.eventTitle}</a>
        <span className="dk-bar-hint">{isGrowth && !selectedTrack ? 'Choose a card to open its presentation' : `${isGrowth ? selectedTrack === 'grok-bot' ? 'Grok Bot · ' : 'Engineer · ' : ''}Arrows or space to advance · F for fullscreen · ⌘P to save as PDF`}</span>
        <a href={programHref} className="dk-bar-all">Sessions</a>
      </header>
      <div className="dk-track" tabIndex={-1}>
        {slides.map((s, i) => <Slide key={i} slide={s} workshop={w} program={program} index={i} total={slides.length} />)}
      </div>
      {slides.length > 1 && <DeckControls key={selectedTrack || 'default'} total={slides.length} />}
    </div>
  );
}
