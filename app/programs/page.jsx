import SiteHeader from "../../components/site-header";
import SiteFooter from "../../components/site-footer";
import { siDiscord } from "simple-icons";
import ProgramAssessment from "../../components/program-assessment";
import DepartureBoard from "../../components/departure-board";
import { ContentsGroup, ContentsRow } from "../../components/contents-list";
import WorkshopNotify from "../../components/workshop-notify";
import { PROGRAM_DETAILS } from "../../components/program-details";
import "./programs.css";
import "../hub.css";
import { JsonLd } from "../../components/article";
import { PROGRAMS } from "../../lib/programs";
import { DISCORD } from "../../lib/hackathon";
import { FOUNDER_WEEKEND as FW } from "../../lib/founder-weekend";
import { ogImage } from "../../lib/og";

const SITE = "https://www.shipai.club";

const LIST_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Ship AI programs",
  itemListElement: PROGRAMS.map((program, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "EducationalOccupationalProgram",
      name: program.name,
      description: program.description,
      url: `${SITE}/programs/${program.slug}`,
      numberOfCredits: program.sessions.length,
      provider: { "@type": "Organization", name: "Ship AI", url: SITE },
      ...(program.status === "running" ? { isAccessibleForFree: true } : {}),
      ...(program.startISO ? { startDate: program.startISO } : {}),
      ...(program.endISO ? { endDate: program.endISO } : {}),
    },
  })),
};

export const metadata = {
  title: "Programs — Ship AI",
  description: "Multi-session Ship AI programs for builders in Phoenix. Learn the tools, build real projects, and develop practical AI skills.",
  alternates: { canonical: "https://www.shipai.club/programs" },
  openGraph: {
    title: "Programs — Ship AI",
    description: "Multi-session Ship AI programs for builders in Phoenix. Learn by building.",
    url: "https://www.shipai.club/programs",
    siteName: "Ship AI",
    images: [ogImage({ kicker: "Programs", title: "From first prompt to real progress.", key: "real progress.", tagline: "Free, multi-session programs for builders in Phoenix." })],
  },
};

/* The Founder Weekend countdown is rendered on the server. */
export const revalidate = 3600;

const sentence = (text) => text.replace(/^For /, "").replace(/^./, (c) => c.toUpperCase());

export default function Page() {
  const now = Date.now();
  const fwOpen = now < new Date(FW.endISO).getTime();
  const fwDays = Math.max(0, Math.ceil((new Date(FW.startISO).getTime() - now) / 864e5));
  const firstUndated = PROGRAMS.find((program) => program.status !== "past" && !program.startISO)?.slug;

  return (
    <>
      <JsonLd data={LIST_SCHEMA} />
      <SiteHeader current="/programs" cta={<a className="btn btn-solid btn-sm nav-cta" href={DISCORD} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden="true" focusable="false"><path d={siDiscord.path} /></svg>Join the Discord</a>} />

      <main>
        <section className="hero" aria-labelledby="programs-title">
          <h1 className="hero-h1" id="programs-title">From first prompt <span className="key">to real progress.</span></h1>
          <p className="hero-lede">Learn in public. Ship something real. Hands-on programs that help you use AI, build a product, and take it further.</p>
          <div className="cta-row hub-pair"><a className="btn btn-solid" href="#explore-programs">Join the next cohort</a><a className="btn btn-ghost" href="#program-assessment">Take the assessment</a></div>
        </section>

        {fwOpen && (
          <DepartureBoard
            scene="launch"
            label="Where the programs lead"
            status="Registration open"
            date={{ big: FW.datesShort.replace(/, \d{4}$/, ""), small: new Date(FW.startISO).getFullYear() + " · " + FW.venue }}
            title={FW.name + ": build an AI company by Sunday"}
            meta={[FW.cost, FW.teams, "No application"].join(" · ")}
            figure={{ big: fwDays, small: fwDays === 1 ? "day to kickoff" : "days to kickoff" }}
            action={{ href: FW.path + "/register", label: "Register free" }}
          />
        )}

        <section className="section hub-list" id="explore-programs" aria-label="Programs">
          <div className="toc">
            <ContentsGroup title="The four programs, in order" aside="In person in Phoenix">
              {PROGRAMS.map((program) => {
                const detail = PROGRAM_DETAILS[program.slug];
                const past = program.status === "past";
                return (
                  <ContentsRow
                    key={program.slug}
                    title={program.name}
                    line={detail.description}
                    figure={program.sessions.length + " sessions"}
                    sub={past ? "Ran " + program.datesLabel : "Dates to be announced"}
                    facts={[["For", sentence(detail.audience)], ["You leave with", detail.outcome], ["Cost", past ? "Free" : "Announced with registration"]]}
                    link={{ href: "/programs/" + program.slug, label: "See the full program" }}
                    open={program.slug === firstUndated}
                  >
                    {past
                      ? <a className="btn btn-solid btn-sm" href={"/programs/" + program.slug}>Open the free materials</a>
                      : <WorkshopNotify slug={program.slug} name={program.name} prompt="Email me when the next cohort has dates" startOpen />}
                  </ContentsRow>
                );
              })}
            </ContentsGroup>
          </div>
        </section>

        <div className="programs-page hub-assess">
          <ProgramAssessment programs={PROGRAMS.map(program => ({
            slug: program.slug, name: program.name, sessions: program.sessions.length, datesLabel: program.datesLabel,
          }))} />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
