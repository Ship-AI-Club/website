import { notFound } from "next/navigation";
import { siDiscord, siGithub } from "simple-icons";
import { JsonLd } from "../../../../../components/article";
import GuidePlan from "../../../../../components/guide-plan";
import Scene from "../../../../../components/scene";
import SiteFooter from "../../../../../components/site-footer";
import SiteHeader from "../../../../../components/site-header";
import { guideFor, setupFor } from "../../../../../lib/guides";
import { deckFor } from "../../../../../lib/decks";
import { PROGRAMS, programBySlug, sessionBySlug, sessionDateLabel, sessionState, sessionVenues } from "../../../../../lib/programs";
import { DISCORD, rsvpLinks } from "../../../../../lib/hackathon";
import registry from "../../../../../lib/skills.generated.json";
import { ogImage } from "../../../../../lib/og";
import "../../../program.css";
import "../../../voyage.css";
import "../../../guide.css";

const SITE = "https://www.shipai.club";

export function generateStaticParams() {
  return PROGRAMS.flatMap((program) =>
    program.sessions
      .filter((session) => guideFor(program.slug, session.slug))
      .map((session) => ({ program: program.slug, slug: session.slug }))
  );
}

export async function generateMetadata({ params }) {
  const { program: programSlug, slug } = await params;
  const program = programBySlug(programSlug);
  const w = sessionBySlug(program, slug);
  const g = guideFor(programSlug, slug);
  if (!program || !w || !g) return {};
  const title = `${w.eventTitle} — Follow-Along Guide`;
  const url = `${SITE}/programs/${program.slug}/${w.slug}/guide`;
  return {
    title: `${title} — Ship AI`,
    description: g.lede.slice(0, 300),
    alternates: { canonical: url },
    openGraph: { title, description: g.lede.slice(0, 200), url, siteName: "Ship AI", images: [ogImage({ kicker: `${program.name} · Session ${w.n} guide`, title: w.eventTitle, tagline: "A follow-along guide you can run at your own pace.", meta: "Guide · Free" })] },
  };
}

/* "01-roadmap/gtm-map.md — what goes in it": the path reads as code. */
function splitPath(text) {
  const dash = text.indexOf(" — ");
  return dash > 0 ? { path: text.slice(0, dash), rest: text.slice(dash) } : { path: "", rest: text };
}

/* A guide has two modes, chosen from the session's date (sessionState,
   the same test the session page uses).

   - Session still to come, or running: written for someone in the room
     with the guide on a second screen. The date, time and venue show;
     setup is open with its "before the session starts" note; the RSVP
     is among the links.
   - Session finished: written for someone working through it alone,
     later. No date or venue; setup is one closed row with no note; the
     recording is among the links when there is one.

   Write new guides for the room. The page switches by itself once the
   session has run. (Raj, Nov 12 2026.) */
export default async function Page({ params }) {
  const { program: programSlug, slug } = await params;
  const program = programBySlug(programSlug);
  const w = sessionBySlug(program, slug);
  const g = guideFor(programSlug, slug);
  if (!program || !w || !g) notFound();

  const manifest = registry.manifest.programs[program.slug];
  const kit = manifest?.sessions[slug];
  const programHref = `/programs/${program.slug}`;
  const sessionHref = `${programHref}/${w.slug}`;
  const index = program.sessions.findIndex((s) => s.slug === w.slug);
  const inRoom = sessionState(program, w) === "upcoming";
  const venueLabel = sessionVenues(w, program).map((item) => item.name).join(" & ");

  const baseSetup = setupFor(program);
  const setup = {
    title: baseSetup.title,
    note: inRoom ? baseSetup.note : null,
    steps: baseSetup.steps
      .map((s) => ({ t: s.t, c: s.c, run: s.run && kit?.file ? s.run.replace("{BUNDLE}", kit.file) : null })),
  };

  const files = [
    kit?.guide && { label: "Guide as markdown", href: `/guides/${kit.guide}`, download: true },
    kit?.file && { label: `${kit.count} skill${kit.count === 1 ? "" : "s"}`, href: `/skills/${kit.file}`, download: true },
    deckFor(program.slug, w.slug) && { label: "Slides", href: `${sessionHref}/deck` },
    inRoom && { label: "RSVP on Meetup", href: rsvpLinks(w).meetup, external: true },
    !inRoom && w.media?.recording && { label: "Recording", href: sessionHref },
  ].filter(Boolean);

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `${w.eventTitle} — ${program.name} follow-along guide`,
    description: g.lede,
    totalTime: `PT${parseInt(g.minutes, 10)}M`,
    url: `${SITE}${sessionHref}/guide`,
    step: g.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.t, text: s.c })),
  };

  return (
    <>
      <JsonLd data={schema} />
      <SiteHeader current="/programs" cta={<a className="btn btn-solid btn-sm nav-cta" href={DISCORD} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden="true" focusable="false"><path d={siDiscord.path} /></svg>Join the Discord</a>} />

      <main>
        <section className="hero vy-hero gx-hero" aria-labelledby="gx-title">
          <p className="vy-crumb"><a href={sessionHref}>← {w.eventTitle}</a></p>
          <h1 className="hero-h1" id="gx-title">
            <span className="vy-name">Follow-along guide</span>
            {w.eventTitle}
          </h1>
          <p className="hero-lede">{g.lede}</p>
        </section>

        <GuidePlan
          storageKey={`shipai-guide:${program.slug}/${w.slug}`}
          summary={`${g.minutes} · ${g.steps.length} steps`}
          context={inRoom ? `${sessionDateLabel(w)} · 6:00 PM · ${venueLabel}` : `${program.name}, session ${index + 1} of ${program.sessions.length}`}
          files={files}
          setup={setup}
          setupOpen={inRoom}
          steps={g.steps.map((s) => ({ t: s.t, run: s.run || null, c: s.c, good: s.good || null }))}
          output={splitPath(g.output)}
        />

        <div className="gx-col">
          <section className="gx-stuck" aria-labelledby="gx-stuck-title">
            <h2 id="gx-stuck-title">If you get stuck</h2>
            <p>{g.stuck}</p>
          </section>
        </div>

        <section className="band" aria-labelledby="gx-final-title">
          <Scene scene="stars" mode="ascii" band className="band-bg" />
          <div className="final">
            <h2 id="gx-final-title">Between sessions, it lives <span className="key">in Discord.</span></h2>
            <p className="lede">Recaps, archive links, questions and everyone&apos;s work in progress.</p>
            <div className="cta-row">
              <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a>
              <a className="btn btn-ghost" href={sessionHref}>Back to {w.eventTitle}</a>
            </div>
            {program.templateRepo && (
              <p className="pg-final-link">
                <a href={program.templateRepo} target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden="true"><path d={siGithub.path} /></svg>
                  Get the template repo
                </a>
              </p>
            )}
          </div>
          <div className="final-stage">
            <Scene scene="harbor" band alt="Dithered harbor at dusk: many small boats at their moorings with their lights on. The community." />
            <p>Harbor at dusk · Phoenix, Arizona</p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
