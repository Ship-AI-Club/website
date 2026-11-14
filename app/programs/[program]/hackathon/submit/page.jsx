import { notFound } from "next/navigation";
import { JsonLd } from "../../../../../components/article";
import SiteFooter from "../../../../../components/site-footer";
import SiteHeader from "../../../../../components/site-header";
import { EventHero, EventSection } from "../../../../../components/event-page";
import { BoardAction, FormBoard, TaggedRows } from "../../../../../components/event-form";
import { PROGRAMS, programBySlug } from "../../../../../lib/programs";
import { DISCORD, EVENT } from "../../../../../lib/hackathon";
import { SUBMISSION_CHECKS, SUBMISSION_FIELDS } from "../../../../../lib/submissions";
import { PITCH_PATH, PITCH_STEPS } from "../../../../../lib/hackathon-pitch";
import { SHIPPED, SHIPPED_RESULTS } from "../../../../../lib/shipped";
import { ogImage } from "../../../../../lib/og";

const PATH = "/programs/zero-to-launch/hackathon";
const SUBMIT_URL = "/dashboard/submission";

const TITLE = `Submit Your Marketing Site — ${EVENT.name}`;
const DESCRIPTION =
  `Submit your live marketing site to the ${EVENT.name}. Judged on design, craft, and receipts. One submission per team, due ${EVENT.deadline}.`;

export const metadata = {
  title: `${TITLE} — Ship AI`,
  description: DESCRIPTION,
  alternates: { canonical: `https://www.shipai.club${PATH}/submit` },
  openGraph: { title: TITLE, description: DESCRIPTION, images: [ogImage({ kicker: EVENT.name, title: "Submit your marketing site", key: "marketing site", tagline: "Judged on design, craft and receipts. One submission per team." })] },
  robots: { index: true, follow: true },
};

/* The board reads the deadline, so the page is rebuilt often enough to
   close on time. */
export const revalidate = 300;

export function generateStaticParams() {
  return PROGRAMS.filter((program) => program.hasHackathon).map((program) => ({
    program: program.slug,
  }));
}

/* The counter, with two states read from EVENT.deadlineISO.
   Open: the deadline and "Open your submission" on the board, then what
   the form asks for, the pitch and the checks.
   Closed: the board leads to the results, and the requirements stay
   below as a record of what teams were asked for. */
export default async function Page({ params }) {
  const { program: programSlug } = await params;
  const program = programBySlug(programSlug);
  if (!program?.hasHackathon) notFound();

  const open = Date.now() < Date.parse(EVENT.deadlineISO);
  const [deadlineTime, deadlineDay] = EVENT.deadline.split(", ");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: TITLE,
          description: DESCRIPTION,
          url: `https://www.shipai.club${PATH}/submit`,
          isPartOf: { "@type": "WebPage", url: `https://www.shipai.club${PATH}` },
        }}
      />

      <SiteHeader current="/programs" />

      <main id="top">
        <EventHero
          crumb={{ href: PATH, label: EVENT.name }}
          title="Submit your"
          keyPhrase="marketing site"
          lede="One submission per team, judged on design, craft, and receipts: the pages, features, and improvements you shipped. Each criterion is scored from 1 to 5 and weighted equally."
        />

        {open ? (
          <FormBoard
            scene="launch"
            alt="A boat sliding down the slipway into the water"
            label="Submission deadline"
            bar={["Submissions · open", "One per team"]}
            foot={
              <>
                <a href={PITCH_PATH}>Five-minute pitch reference</a>
                <span>Stuck? Post in <a href={DISCORD} target="_blank" rel="noreferrer">the Discord</a> before the deadline, not after.</span>
              </>
            }
          >
            <BoardAction
              date={[deadlineDay, deadlineTime]}
              title="No late submissions."
              line="Sign in with an email code. Any team member can edit the draft up to the deadline."
            >
              <a className="btn btn-solid" href={SUBMIT_URL}>Open your submission</a>
            </BoardAction>
          </FormBoard>
        ) : (
          <FormBoard
            scene="harbor"
            alt="Boats back in the harbor at night"
            label="Submissions closed"
            bar={[`Submissions · closed ${EVENT.deadline}`, `${SHIPPED.teams} of ${SHIPPED.registered} teams submitted`]}
            foot={
              <>
                <span>Signed in? Your entry is still in your account.</span>
                <a href={SUBMIT_URL}>Open your submission</a>
              </>
            }
          >
            <BoardAction
              title={`${SHIPPED.teams} teams submitted.`}
              line="The judges placed three. Every project and its recorded pitch is on the results page."
            >
              <a className="btn btn-solid" href={SHIPPED_RESULTS}>See the results</a>
            </BoardAction>
          </FormBoard>
        )}

        <EventSection id="fields" title={open ? "What the form asks for" : "What the form asked for"}>
          <TaggedRows items={SUBMISSION_FIELDS.map((f) => ({ name: f.name, tag: f.required ? "Required" : null, copy: f.copy }))} />
        </EventSection>

        <EventSection
          id="pitch"
          title="Your five-minute pitch"
          lede={open ? "Use your own deck or our optional four-slide generator. You can submit your project without a deck and prepare it later." : undefined}
        >
          <TaggedRows items={PITCH_STEPS.map((step) => ({ name: step.title, tag: step.window, quiet: true, copy: step.prompt }))} />
          <p className="ev-links">
            <a href={PITCH_PATH}>Open the pitch reference and speaker notes →</a>
            <a href={`${PITCH_PATH}/demo?view=all`}>Review all four slides of the demo pitch →</a>
          </p>
        </EventSection>

        {open && (
          <EventSection id="checks" title="Before you hit submit">
            <ul className="ef-checks">
              {SUBMISSION_CHECKS.map((check) => <li key={check}>{check}</li>)}
            </ul>
          </EventSection>
        )}

        <div className="ev-end" />
      </main>

      <SiteFooter />
    </>
  );
}
