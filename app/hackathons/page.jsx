import SiteHeader from "../../components/site-header";
import SiteFooter from "../../components/site-footer";
import { ContentsGroup, ContentsRow } from "../../components/contents-list";
import "../hub.css";
import { JsonLd } from "../../components/article";
import { EVENT, HACKATHON_PRIZE_SUMMARY } from "../../lib/hackathon";
import { FOUNDER_WEEKEND as FW } from "../../lib/founder-weekend";
import { ogImage } from "../../lib/og";

const SITE = "https://www.shipai.club";
const ZTL = "/programs/zero-to-launch/hackathon";

const ALL = [
  {
    id: FW.id,
    name: FW.name,
    line: FW.tagline,
    href: FW.path,
    startISO: FW.startISO,
    endISO: FW.endISO,
    datesShort: FW.datesShort,
    facts: [["Where", `${FW.venue}, ${FW.city}`], ["Teams", FW.teams], ["Cost", FW.cost], ["Judged on", "Craftsmanship, opportunity, market fit, scalability, the pitch and go-to-market"]],
    actions: { upcoming: [[`${FW.path}/register`, "Register free", "solid"], [`${FW.path}/sponsor`, "Sponsor", "ghost"]], past: [[FW.path, "See the weekend", "solid"]] },
  },
  {
    id: EVENT.id,
    name: "Zero to Launch Hackathon",
    line: "Build and launch the best marketing site in one weekend.",
    href: ZTL,
    startISO: EVENT.startISO,
    endISO: EVENT.endISO,
    datesShort: EVENT.datesShort,
    facts: [["Where", `${EVENT.venue}, ${EVENT.city}`], ["Teams", EVENT.teams], ["Cost", EVENT.cost], ["Prizes", HACKATHON_PRIZE_SUMMARY]],
    actions: { upcoming: [[ZTL, "See the weekend", "solid"]], past: [[`${ZTL}/results`, "See the results", "solid"], [ZTL, "Event page", "ghost"]] },
  },
];

export const metadata = {
  title: "Hackathons — Ship AI",
  description: "Every Ship AI hackathon in Phoenix: free weekends where teams build and ship an AI product, then pitch it to judges.",
  alternates: { canonical: `${SITE}/hackathons` },
  openGraph: {
    title: "Hackathons — Ship AI",
    description: "Free weekends in Phoenix where teams build and ship an AI product.",
    url: `${SITE}/hackathons`,
    siteName: "Ship AI",
    images: [ogImage({ kicker: "Hackathons", title: "Build it. Ship it by Sunday.", key: "by Sunday.", tagline: "Free AI hackathons in Phoenix." })],
  },
};

export const revalidate = 3600;

export default function Page() {
  const now = Date.now();
  const upcoming = ALL.filter((h) => new Date(h.endISO).getTime() > now).sort((a, b) => a.startISO.localeCompare(b.startISO));
  const past = ALL.filter((h) => new Date(h.endISO).getTime() <= now).sort((a, b) => b.startISO.localeCompare(a.startISO));
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ship AI hackathons",
    itemListElement: [...upcoming, ...past].map((h, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "Event", name: h.name, url: `${SITE}${h.href}`, startDate: h.startISO, endDate: h.endISO, isAccessibleForFree: true, location: { "@type": "Place", name: "Workuity Biltmore", address: "2390 E Camelback Rd, Suite 130, Phoenix, AZ 85016" } },
    })),
  };

  const row = (h, isPast) => {
    const days = Math.max(0, Math.ceil((new Date(h.startISO).getTime() - now) / 864e5));
    return (
      <ContentsRow
        key={h.id}
        title={h.name}
        line={h.line}
        figure={h.datesShort.replace(/, \d{4}$/, "")}
        sub={isPast ? `Ran ${new Date(h.startISO).getFullYear()}` : days === 0 ? "Happening now" : `${days} ${days === 1 ? "day" : "days"} away`}
        facts={h.facts}
        link={{ href: h.href, label: "Open the hackathon page" }}
        open={!isPast && h === upcoming[0]}
      >
        <div className="cta-row">
          {h.actions[isPast ? "past" : "upcoming"].map(([href, label, kind]) => <a key={href} className={`btn btn-${kind} btn-sm`} href={href}>{label}</a>)}
        </div>
      </ContentsRow>
    );
  };

  return (
    <>
      <JsonLd data={schema} />
      <SiteHeader current="/hackathons" />
      <main>
        <section className="hero" aria-labelledby="hackathons-title">
          <h1 className="hero-h1" id="hackathons-title">Build it. <span className="key">Ship it by Sunday.</span></h1>
          <p className="hero-lede">Free weekend hackathons in Phoenix. Teams of one to four build a real AI product, then pitch it to judges.</p>
          {upcoming[0] && <div className="cta-row hub-pair"><a className="btn btn-solid" href={upcoming[0].actions.upcoming[0][0]}>{upcoming[0].actions.upcoming[0][1]}</a><a className="btn btn-ghost" href="#all-hackathons">See every hackathon</a></div>}
        </section>

        <section className="section hub-list" id="all-hackathons" aria-label="Hackathons">
          <div className="toc">
            {upcoming.length > 0 && <ContentsGroup title="Coming up" aside="In person in Phoenix">{upcoming.map((h) => row(h, false))}</ContentsGroup>}
            {past.length > 0 && <ContentsGroup title="Past hackathons" aside="Results and projects">{past.map((h) => row(h, true))}</ContentsGroup>}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
