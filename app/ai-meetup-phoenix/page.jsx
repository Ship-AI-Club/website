import { JsonLd, faqSchema, articleSchema } from "../../components/article";
import { EventHero, EventSection } from "../../components/event-page";
import Scene from "../../components/scene";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import { FOUNDER_WEEKEND as FW } from "../../lib/founder-weekend";
import { DISCORD, MEETUP } from "../../lib/hackathon";
import { getUpcomingEvents } from "../../lib/meetup";
import { ogImage } from "../../lib/og";
import { eventState } from "../../lib/shipped";
import "./meetup.css";

/* The meetup page, and what "Events" in the header opens: the two rooms.
   Ship AI meets in two places, so the page answers "in person or online?"
   first. One card per kind of event: what happens, the next date, one
   button. The nearer date gets the solid button. Every date follows as a
   plain list, each marked "In the room" or "Online".

   Dates come from Meetup. Founder Weekend comes from the site's own event
   data, so it shows however many Thursdays come before it. */

const PATH = "/ai-meetup-phoenix";
const TITLE = "AI Meetup in Phoenix: Ship AI";
const DESCRIPTION =
  "Ship AI runs a recurring AI meetup in Phoenix, Arizona: evening sessions on Camelback Road with an AI news briefing and 5-minute demos, and Design Office Hours online every other Thursday. RSVP free on Meetup.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `https://www.shipai.club${PATH}` },
  openGraph: { title: TITLE, description: DESCRIPTION, images: [ogImage({ kicker: "Ship AI meetup", title: "AI meetup in Phoenix", key: "in Phoenix", tagline: "Workshops, an AI news briefing and five-minute demos. RSVP free." })] },
};

export const revalidate = 3600;

const EVENING = [
  ["20 min", "AI news briefing"],
  ["Then", "Workshop or builder presentation"],
  ["To close", "5-minute demos"],
  ["Where", "2390 E Camelback Rd #130, in the Camelback Corridor. Workuity is our venue sponsor."],
];

/* The wording of the Design Office Hours listing on Meetup. */
const OFFICE_HOURS = [
  "Live design critiques",
  "UI, UX, and visual polish",
  "Questions and ideas from the community",
  "Free and open to builders. Bring something to share or just listen.",
];

const FAQS = [
  {
    q: "Where does the Ship AI Phoenix meetup happen?",
    a: "Workuity Biltmore, 2390 E Camelback Rd #130 in Phoenix, Arizona, in the Camelback Corridor / Biltmore area. Workuity is our venue sponsor. Check the event listing on Meetup for the date and time.",
  },
  {
    q: "Who attends the Phoenix Ship AI meetup?",
    a: "Technical founders, engineers, and builders shipping with LLMs, agents, and modern AI tooling. It's a discussion-and-demo format, not a networking mixer or pitch night.",
  },
  {
    q: "How do I RSVP for a Ship AI event in Phoenix?",
    a: "RSVP on Meetup (meetup.com/shipai). Join the Discord to catch announcements between events.",
  },
  {
    q: "Is the Phoenix meetup beginner-friendly?",
    a: "It's builder-focused, not intro-level. Sessions assume you're building with AI or seriously trying to. If you're technical and curious you'll keep up; good questions count as much as expertise.",
  },
];

const DAY = 86400000;

/* Meetup's dates and Founder Weekend as one list, soonest first. Meetup
   lists the weekend too ("Arizona AI Hackathon"); that row is dropped so
   the weekend appears once, under its own name and with its own page. */
function allDates(events, now) {
  const fwStart = Date.parse(FW.startISO);
  const fwEnd = Date.parse(FW.endISO);
  const dates = events
    .filter((e) => e.online || e.ts < fwStart - DAY || e.ts > fwEnd)
    .map((e) => {
      const [weekday, day] = e.date.split(", ");
      return { ts: e.ts, startISO: e.startISO, day: day || e.date, when: `${weekday} · ${e.time}`, title: e.title, url: e.url, online: e.online, place: e.place, external: true };
    });
  if (eventState(FW.startISO, FW.endISO, now) !== "after") {
    dates.push({ ts: fwStart, startISO: FW.startISO, endISO: FW.endISO, day: FW.datesShort.replace(/, \d{4}$/, ""), when: "Sat and Sun · 9:00 AM", title: FW.name, url: FW.path, online: false, place: FW.venue, weekend: true });
  }
  return dates.sort((a, b) => a.ts - b.ts);
}

function countdown(ts, now) {
  const days = Math.ceil((ts - now) / DAY);
  if (days <= 0) return "Now";
  return days === 1 ? "1 day to go" : `${days} days to go`;
}

function eventsSchema(dates) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: dates.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: d.title,
        startDate: d.startISO,
        ...(d.endISO ? { endDate: d.endISO } : {}),
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: d.online ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
        location: d.online
          ? { "@type": "VirtualLocation", url: d.url }
          : { "@type": "Place", name: d.place, address: d.weekend ? FW.address : d.place },
        organizer: { "@type": "Organization", name: "Ship AI", url: "https://www.shipai.club" },
        url: d.external ? d.url : `https://www.shipai.club${d.url}`,
      },
    })),
  };
}

function action(date, solid) {
  const cls = `btn ${solid ? "btn-solid" : "btn-ghost"}`;
  return date.weekend
    ? <a className={cls} href={date.url}>See the weekend</a>
    : <a className={cls} href={date.url} target="_blank" rel="noreferrer">RSVP on Meetup</a>;
}

function Room({ scene, alt, label, title, lines, nextLabel, next, solid, now }) {
  return (
    <article className={`mt-room${solid && next ? " mt-lead" : ""}`}>
      <div className="mt-art"><Scene scene={scene} cell={[5, 3]} alt={alt} /></div>
      <div className="mt-body">
        <span className="ev-label">{label}</span>
        <h2>{title}</h2>
        <ol className="mt-lines">
          {lines.map((line) => Array.isArray(line)
            ? <li key={line[0]}><span className="ev-label">{line[0]}</span><span>{line[1]}</span></li>
            : <li key={line} className="mt-one">{line}</li>)}
        </ol>
        <div className="mt-next">
          <p>
            <span className="ev-label">{nextLabel}</span>
            <b>{next ? next.day : "To be announced"}</b>
            {next
              ? <span className="ev-label">{[next.weekend && next.title, next.when, countdown(next.ts, now)].filter(Boolean).join(" · ")}</span>
              : <span className="ev-label"><a href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a> to hear first</span>}
          </p>
          {next && action(next, solid)}
        </div>
      </div>
    </article>
  );
}

export default async function Page() {
  const now = Date.now();
  const dates = allDates(await getUpcomingEvents(10), now);
  const nextRoom = dates.find((d) => !d.online);
  const nextOnline = dates.find((d) => d.online);
  const roomFirst = Boolean(nextRoom) && (!nextOnline || nextRoom.ts < nextOnline.ts);
  const next = dates[0];
  const discord = (solid) => <a className={`btn ${solid ? "btn-solid" : "btn-ghost"}`} href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a>;

  return (
    <>
      <JsonLd data={articleSchema({ title: TITLE, description: DESCRIPTION, path: PATH, modified: "2026-11-12" })} />
      <JsonLd data={faqSchema(FAQS)} />
      {dates.length > 0 && <JsonLd data={eventsSchema(dates)} />}
      <SiteHeader current={PATH} />

      <main id="top">
        <EventHero
          title="AI Meetup in Phoenix:"
          keyPhrase="Ship AI"
          lede="Ship AI runs a recurring AI meetup in Phoenix, Arizona for technical founders and builders."
        />

        <div className="mt-rooms">
          <Room
            scene="harbor"
            alt="Dithered harbor at dusk: many small boats at their moorings with their lights on."
            label="In the room · Workuity Biltmore"
            title="Evening sessions"
            lines={EVENING}
            nextLabel="Next in the room"
            next={nextRoom}
            solid={roomFirst}
            now={now}
          />
          <Room
            scene="fleet"
            alt="Dithered open water: three boats under way."
            label="Online, on Discord · every other Thursday"
            title="Design Office Hours"
            lines={OFFICE_HOURS}
            nextLabel="Next online"
            next={nextOnline}
            solid={!roomFirst}
            now={now}
          />
        </div>

        {dates.length > 0 && (
          <EventSection id="dates" title="Every" keyPhrase="date">
            <ul className="ev-teams mt-dates">
              {dates.map((d) => (
                <li key={d.url + d.ts}>
                  <a href={d.url} target={d.external ? "_blank" : undefined} rel={d.external ? "noreferrer" : undefined}>{d.day} · {d.title}</a>
                  <span>{d.online ? "Online" : "In the room"}</span>
                </li>
              ))}
            </ul>
            <p className="ev-note"><a href={MEETUP} target="_blank" rel="noreferrer">All dates on Meetup</a></p>
          </EventSection>
        )}

        <EventSection id="faq" title="Frequently asked" keyPhrase="questions">
          <div className="faq ev-faq">
            {FAQS.map((faq) => (
              <details key={faq.q}>
                <summary><span>{faq.q}</span></summary>
                <p className="faq-a">{faq.a}</p>
              </details>
            ))}
          </div>
        </EventSection>

        <div className="ev-end" />

        <section className="band" aria-labelledby="mt-final-title">
          <Scene scene="stars" mode="ascii" band className="band-bg" />
          <div className="final">
            <h2 id="mt-final-title">Demos <span className="key">over memos.</span></h2>
            {next ? (
              <>
                <p className="lede">{[next.day, `${next.title}, ${next.online ? "on Discord" : next.place}`, "Free"].join(" · ")}</p>
                <div className="cta-row">{action(next, true)}{discord(false)}</div>
              </>
            ) : (
              <>
                <p className="lede">Join the Discord to catch announcements between events.</p>
                <div className="cta-row">{discord(true)}</div>
              </>
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
