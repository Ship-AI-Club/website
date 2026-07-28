import { ArrowRight, ArrowUpRight, BadgeCheck, CalendarClock, Trophy, Users } from "lucide-react";
import { JsonLd } from "../../../components/article";
import { DISCORD, EVENT, MEETUP } from "../../../lib/hackathon";
import {
  CATEGORIES,
  EDITION,
  certPath,
  fromCertificate,
  isWinner,
  placementOf,
  previewEntrants,
  sortedEntrants,
  winners,
} from "../../../lib/results";
import { publishedCertificates } from "../../../lib/store";
import { getSetting } from "../../../lib/settings";
import "../awards.css";

/* Results are published by flipping a switch in /admin on the Sunday,
   not by a deploy — see lib/settings.js. Until then this page renders
   the pending state, which is what it has said since July.

   Revalidated rather than dynamic: the moment after the awards is the
   busiest this page will ever be, and a minute of staleness costs
   nothing next to a database read per visitor. */
export const revalidate = 60;

const TITLE = `Results — ${EDITION.name}`;
const DESCRIPTION = `Every team that shipped at ${EDITION.event}, ${EDITION.held} at ${EDITION.venue}, ${EDITION.city}. Category winners, live projects and the certification for each entrant.`;

export const metadata = {
  title: `${TITLE} — Ship AI`,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.shipai.club/hackathon/results" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.shipai.club/hackathon/results",
    siteName: "Ship AI",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

const WILL_LIST = [
  {
    strong: "Every team that submitted.",
    copy: "Not a top three. If you shipped and filed a submission, you get a row — team, members, project and the live URL you shipped.",
  },
  {
    strong: "What each team placed.",
    copy: "Category winners at the top, in award order, and Crowd Favorite alongside them. Everyone else reads as Launched, which is the bar the weekend was built around.",
  },
  {
    strong: "A certification per team.",
    copy: "Its own public URL, naming the project and the placement, ready to link from LinkedIn or a job application.",
  },
];

export default async function Page() {
  const preview = previewEntrants();
  const rows = await publishedCertificates();
  const all = [...rows.map(fromCertificate), ...preview];

  /* Both conditions have to hold for real results: certificates exist,
     and an admin has said they're public. Issuing them is a
     Sunday-evening job that can start before the ceremony finishes,
     so the switch is what makes them visible, not their existence.
     SHIPAI_PREVIEW bypasses it — see previewEntrants(). */
  const published =
    preview.length > 0 || (all.length > 0 && (await getSetting("results_published")));

  const entrants = published ? sortedEntrants(all) : [];
  const won = published ? winners(entrants) : [];

  /* .hk-cats draws its 1px grid from a background, so an odd number of
     narrow cards leaves the empty cell showing as a pale block. The
     count is only known at render — a category with no eligible winner
     is filtered out — so the last narrow card spans instead. */
  const narrowTotal = won.filter((w) => !w.category.wide).length;
  let narrowSeen = 0;
  const wonCards = won.map((w) => {
    const narrow = !w.category.wide;
    if (narrow) narrowSeen += 1;
    return {
      ...w,
      wide: w.category.wide || (narrow && narrowTotal % 2 === 1 && narrowSeen === narrowTotal),
    };
  });

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: TITLE,
          description: DESCRIPTION,
          url: "https://www.shipai.club/hackathon/results",
          isPartOf: { "@type": "WebPage", url: "https://www.shipai.club/hackathon" },
        }}
      />

      <header className="nav">
        <a href="/" className="brand">
          <img src="/logo-icon.png" alt="" width={26} height={26} />
          <span>Ship AI</span>
        </a>
        <nav>
          <a href="/hackathon">Hackathon</a>
          <a href="/hackathon#benefits">Benefits</a>
          <a href="/hackathon#prizes">Prizes</a>
        </nav>
        <div className="nav-ctas">
          <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">
            Discord
          </a>
          <a className="btn btn-solid" href="/dashboard">
            Register
          </a>
        </div>
      </header>

      <main className="rs-page">
        <p className="kicker">{EDITION.name}</p>
        <h1>Results</h1>

        {published ? (
          <p className="rs-lede">
            Everyone who shipped at {EDITION.event}, {EDITION.held} at {EDITION.venue},{" "}
            {EDITION.city}. Winners first, then every other team that got it out the door —
            the listing stays up, and so do the links.
          </p>
        ) : (
          <>
            <p className="rs-lede">
              The hackathon runs {EDITION.held} at {EDITION.venue}, {EDITION.city}. This page
              is where every team that ships ends up, permanently.
            </p>
            <div className="rs-pending">
              <p className="rs-pending-head">
                <CalendarClock size={16} strokeWidth={1.75} aria-hidden="true" />
                Results go up {EDITION.resultsDay}, straight after the awards.
              </p>
              <p>
                If you want a row on it, the entry route is a live URL and a{" "}
                <a href="/hackathon/submit">submission</a> by {EVENT.deadline}.
              </p>
            </div>
            <h2 className="rs-subhead">What lands here</h2>
            <ul className="rs-will">
              {WILL_LIST.map((w) => (
                <li key={w.strong}>
                  <BadgeCheck size={17} strokeWidth={1.75} aria-hidden="true" />
                  <span>
                    <strong>{w.strong}</strong> {w.copy}
                  </span>
                </li>
              ))}
            </ul>
            <h2 className="rs-subhead">The categories being judged</h2>
            <div className="hk-cats">
              {CATEGORIES.map((c) => (
                <div key={c.name} className={c.wide ? "hk-cat hk-cat-wide" : "hk-cat"}>
                  {c.voted ? (
                    <Users className="icon" size={18} strokeWidth={1.75} aria-hidden="true" />
                  ) : (
                    <Trophy className="icon" size={18} strokeWidth={1.75} aria-hidden="true" />
                  )}
                  <h3>
                    {c.name}
                    {c.voted && <span className="hk-cat-tag">room-voted</span>}
                  </h3>
                  <p>{c.copy}</p>
                </div>
              ))}
            </div>
            <div className="cta-row rs-cta">
              <a className="btn btn-solid" href={MEETUP} target="_blank" rel="noreferrer">
                RSVP on Meetup
              </a>
              <a className="btn btn-ghost" href="/hackathon/submit">
                Submission requirements
              </a>
              <a className="btn btn-ghost" href="/hackathon">
                Back to the hackathon
              </a>
            </div>
          </>
        )}

        {published && (
          <>
            {won.length > 0 && (
              <>
                <h2 className="rs-subhead">Winners</h2>
                <div className="hk-cats">
                  {wonCards.map(({ category, entrant, wide }) => (
                    <div key={category.name} className={wide ? "hk-cat hk-cat-wide" : "hk-cat"}>
                      {category.voted ? (
                        <Users className="icon" size={18} strokeWidth={1.75} aria-hidden="true" />
                      ) : (
                        <Trophy className="icon" size={18} strokeWidth={1.75} aria-hidden="true" />
                      )}
                      <h3>
                        {category.name}
                        {category.voted && <span className="hk-cat-tag">room-voted</span>}
                      </h3>
                      <p>
                        <strong className="rs-winner">{entrant.team}</strong>
                        {entrant.blurb ? ` — ${entrant.blurb}` : ""}
                      </p>
                      <a className="rs-project" href={certPath(entrant)}>
                        Certification
                        <ArrowRight size={13} strokeWidth={1.75} aria-hidden="true" />
                      </a>
                    </div>
                  ))}
                </div>
              </>
            )}

            <h2 className="rs-subhead">Every team that shipped</h2>
            <table className="rs-table">
              <thead>
                <tr>
                  <th scope="col">Team &amp; project</th>
                  <th scope="col">Placement</th>
                  <th scope="col">Certification</th>
                </tr>
              </thead>
              <tbody>
                {entrants.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <p className="rs-team">{e.team}</p>
                      {e.members?.length > 0 && (
                        <p className="rs-members">{e.members.join(", ")}</p>
                      )}
                      {e.url ? (
                        <a className="rs-project" href={e.url} target="_blank" rel="noreferrer">
                          {e.project}
                          <ArrowUpRight size={13} strokeWidth={1.75} aria-hidden="true" />
                        </a>
                      ) : (
                        <p className="rs-project-plain">{e.project}</p>
                      )}
                    </td>
                    <td className={isWinner(e) ? "rs-place rs-place-win" : "rs-place"}>
                      {placementOf(e)}
                    </td>
                    <td>
                      <a
                        className="rs-cert"
                        href={certPath(e)}
                        aria-label={`View the certification for ${e.team}`}
                      >
                        <BadgeCheck size={14} strokeWidth={1.75} aria-hidden="true" />
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="rule-line">just ship it</p>

            <div className="cta-row">
              <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">
                Join the Discord
              </a>
              <a className="btn btn-ghost" href="/hackathon">
                Back to the hackathon
                <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
              </a>
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        <div className="brand">
          <img src="/logo-icon.png" alt="" width={22} height={22} />
          <span>Ship AI</span>
        </div>
        <p>Phoenix &amp; Tempe, Arizona</p>
        <nav>
          <a href="/">Home</a>
          <a href="/hackathon">Hackathon</a>
          <a href="/hackathon/workshops">Workshops</a>
        </nav>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}
