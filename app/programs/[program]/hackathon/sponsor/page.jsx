import { notFound } from "next/navigation";
import SiteFooter from "../../../../../components/site-footer";
import SiteHeader from "../../../../../components/site-header";
import { EventHero, EventSection } from "../../../../../components/event-page";
import { BoardAction, FormBoard, RecordRow } from "../../../../../components/event-form";
import { EVENT, DISCORD } from "../../../../../lib/hackathon";
import { FOUNDER_WEEKEND as FW, FW_SPONSOR_TIERS } from "../../../../../lib/founder-weekend";
import { PROGRAMS, programBySlug } from "../../../../../lib/programs";
import { eventState } from "../../../../../lib/shipped";
import { publicSponsors } from "../../../../../lib/stats";
import {
  TIERS,
  MENU,
  CREDITS,
  HOURS,
  PROMISES,
  NOT_SOLD,
  VALUATION,
  YEAR_ROUND,
} from "../../../../../lib/sponsors";
import { ogImage } from "../../../../../lib/og";

const PATH = "/programs/zero-to-launch/hackathon";
const TITLE = `Sponsor ${EVENT.name}`;
const DESCRIPTION =
  "Seven events over ten weeks for 30–50 Phoenix builders. Four tiers, an itemized menu with the prices on it, and credits or donated hours count the same as cash.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `https://www.shipai.club${PATH}/sponsor` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `https://www.shipai.club${PATH}/sponsor`,
    siteName: "Ship AI",
    images: [ogImage({ kicker: "Sponsor", title: TITLE, tagline: "Four tiers with the prices published. Credits and hours count the same as cash." })],
  },
};

export const revalidate = 300;

export function generateStaticParams() {
  return PROGRAMS.filter((program) => program.hasHackathon).map((program) => ({
    program: program.slug,
  }));
}

/* The counter, closed. This season's sponsorship ended on
   EVENT.sponsorDeadline, so the board says so and points to the next
   thing a sponsor can back: Founder Weekend until it has run, then the
   year-round options. What the season offered stays below as a record,
   in rows that open in place, with the copy as it was written.

   When a new season opens for sponsors this page needs an open state:
   the board takes the request and the record rows become the menu. */
export default async function Page({ params }) {
  const { program: programSlug } = await params;
  const program = programBySlug(programSlug);
  if (!program?.hasHackathon) notFound();

  const next = eventState(FW.startISO, FW.endISO) !== "after";
  const backers = (await publicSponsors()).flatMap((group) => group.sponsors.map((s) => s.org || s.credit_name));
  const prices = FW_SPONSOR_TIERS.map((t) => `${t.name} $${t.price.toLocaleString("en-US")}`).join(" · ");
  const lineItems = MENU.reduce((n, group) => n + group.items.length, 0);

  return (
    <>
      <SiteHeader current="/programs" />

      <main id="top">
        <EventHero
          crumb={{ href: PATH, label: EVENT.name }}
          title="Put your name on the part"
          keyPhrase="you actually paid for."
          lede="Seven events over ten weeks for 30–50 Phoenix builders. All free. Sponsorship is what keeps it that way."
        />

        <FormBoard
          scene="harbor"
          alt="Boats back in the harbor at night"
          label="Sponsorship status"
          bar={[`Sponsorship · closed ${EVENT.sponsorDeadline}`, `${program.name} season`]}
          foot={backers.length > 0 && <span>Backed by {backers.join(" · ")}</span>}
        >
          {next ? (
            <BoardAction title={`${FW.name} is open to sponsors.`} line={`${FW.datesShort} · ${FW.venue}, Phoenix · ${prices}`}>
              <a className="btn btn-solid" href={`${FW.path}/sponsor`}>Sponsor {FW.name}</a>
            </BoardAction>
          ) : (
            <BoardAction title="Back the room, year-round." line="Ship AI runs free, public events in Phoenix year-round.">
              <a className="btn btn-solid" href="/dashboard/requests">Talk to us</a>
            </BoardAction>
          )}
        </FormBoard>

        <EventSection
          id="year-round"
          title="Year-round"
          lede="Ship AI runs free, public events in Phoenix year-round. Some sponsors would rather back the room than the program."
        >
          <ul className="ev-rows ef-priced">
            {YEAR_ROUND.map((y) => <li key={y.name}><h3>{y.name}</h3><p>{y.copy}</p><b>{y.price}</b></li>)}
          </ul>
          {next && <p className="ev-act"><a className="btn btn-ghost" href="/dashboard/requests">Talk to us</a></p>}
        </EventSection>

        <EventSection id="record" title="What this season offered">
          <div className="ef-records">
            <RecordRow title="Four tiers" tag={`${TIERS[TIERS.length - 1].priceLabel} to ${TIERS[0].priceLabel}`}>
              <p>
                <strong>Cash, platform credits and donated hours all count toward the same ladder</strong>
                {": "}the total you underwrite sets your tier. Two Bronze items make a Silver.
              </p>
              <ul className="ev-rows">
                {TIERS.map((t) => (
                  <li key={t.id}>
                    <div>
                      <h3>{t.name}{t.sub ? ` · ${t.sub}` : ""}</h3>
                      <span className="ev-label">{t.priceLabel} · {t.slots}</span>
                    </div>
                    <p>{t.buys}<span className="ef-credit">{t.perks}</span></p>
                  </li>
                ))}
              </ul>
            </RecordRow>

            <RecordRow title="The menu" tag={`${lineItems} line items`}>
              <p>Everything it takes to run seven events for fifty builders, priced at what it costs us.</p>
              {MENU.map((group) => (
                <div key={group.id}>
                  <h4>{group.name}</h4>
                  {group.note && <p>{group.note}</p>}
                  <ul className="ev-rows">
                    {group.items.map((item) => (
                      <li key={item.name}>
                        <div>
                          <h3>{item.name}</h3>
                          <span className="ev-label">{item.priceLabel}</span>
                        </div>
                        <p>{item.copy}<span className="ef-credit">{item.credit}</span></p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </RecordRow>

            <RecordRow title="Credits" tag={CREDITS.ladder[0].amount}>
              <p>{CREDITS.lede}</p>
              <p>{CREDITS.math}</p>
              <p>{CREDITS.distribution}</p>
              <ul className="ev-rows">
                {CREDITS.ladder.map((rung) => (
                  <li key={rung.amount}><h3>{rung.amount}</h3><p>{[rung.tier, rung.note].filter(Boolean).join(" · ")}</p></li>
                ))}
              </ul>
              <p>{CREDITS.provider}</p>
              <h4>Platforms we&apos;d take credits on today</h4>
              <ul className="ev-rows">
                {CREDITS.platforms.map((p) => <li key={p.group}><h3>{p.group}</h3><p>{p.names}</p></li>)}
              </ul>
              <p>{CREDITS.openDoor}</p>
              <p>{CREDITS.credit}</p>
            </RecordRow>

            <RecordRow title="Sponsor with hours" tag={`${HOURS.roles.length} roles`}>
              <p>{HOURS.lede}</p>
              <ul className="ev-rows">
                {HOURS.roles.map((r) => (
                  <li key={r.name}>
                    <div>
                      <h3>{r.name}</h3>
                      <span className="ev-label">{[r.commitment, r.tier].filter(Boolean).join(" · ")}</span>
                    </div>
                    <p>{r.copy}<span className="ef-credit">{r.credit}</span></p>
                  </li>
                ))}
              </ul>
            </RecordRow>

            <RecordRow title="What we promise, and what we don't sell">
              <ul className="ef-checks">
                {PROMISES.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <h4>What we don&apos;t sell</h4>
              <p>{NOT_SOLD}</p>
              <h4>How in-kind is valued</h4>
              <p>{VALUATION}</p>
            </RecordRow>
          </div>
        </EventSection>

        <div className="ev-end" />
      </main>

      <SiteFooter />
    </>
  );
}
