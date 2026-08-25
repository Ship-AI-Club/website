import { Article, Faq, JsonLd, faqSchema, articleSchema, EventList } from "../../components/article";
import { getUpcomingEvents } from "../../lib/meetup";

const UPDATED = "July 2026";
const TITLE = "AI Meetup in Phoenix: Ship AI";
const DESCRIPTION =
  "Ship AI runs a recurring AI meetup in Phoenix, Arizona — workshops and builder presentations on Camelback Road, with an AI news briefing and 5-minute demos every session. RSVP free on Meetup.";

export const metadata = {
  title: `${TITLE} — Ship AI`,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.shipai.club/ai-meetup-phoenix" },
  openGraph: { title: TITLE, description: DESCRIPTION, images: [{ url: "/og-image.jpg", width: 1200, height: 630 }] },
};

const FAQS = [
  {
    q: "Where does the Ship AI Phoenix meetup happen?",
    a: "Workuity Biltmore, 2390 E Camelback Rd #130 in Phoenix, Arizona — the Camelback Corridor / Biltmore area. Workuity is our venue sponsor. Check the event listing on Meetup for the date and time.",
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
    a: "It's builder-focused, not intro-level — sessions assume you're building with AI or seriously trying to. If you're technical and curious you'll keep up; good questions count as much as expertise.",
  },
];

export default async function Page() {
  const events = await getUpcomingEvents(4);
  const phoenixEvents = events.filter((e) => /phoenix/i.test(e.place));

  return (
    <>
      <JsonLd data={articleSchema({ title: TITLE, description: DESCRIPTION, path: "/ai-meetup-phoenix", modified: "2026-07-16" })} />
      <JsonLd data={faqSchema(FAQS)} />
      <Article kicker="Phoenix, Arizona" title={TITLE} updated={UPDATED}>
        <p className="article-lede">
          <strong>Ship AI</strong> runs a recurring AI meetup in Phoenix, Arizona for
          technical founders and builders. Every session: a 20-minute AI news briefing, a{" "}
          <a href="/programs">workshop or builder presentation</a> built live on screen,
          then 5-minute demos of what members shipped. Demos over memos — no slideware, no
          hard selling.
        </p>

        <h2>What happens at a Phoenix session</h2>
        <p>
          Evening events built around working software. The briefing covers what matters
          for AI builders right now. Then the host builds on screen — follow along on a
          laptop or just watch — and members close with 5-minute demos. Questions welcome
          throughout, receipts required.
        </p>

        <h2>Where and when</h2>
        <p>
          Phoenix sessions meet at <strong>Workuity Biltmore, 2390 E Camelback Rd #130</strong> in
          the Camelback Corridor. Workuity is our venue sponsor. Dates and times are on the{" "}
          <a href="https://www.meetup.com/shipai/" target="_blank" rel="noreferrer">Meetup group</a>{" "}
          — the list below pulls live from Meetup.
        </p>

        {phoenixEvents.length > 0 && (
          <>
            <h2>Upcoming Phoenix events</h2>
            <EventList events={phoenixEvents} />
          </>
        )}

        <h2>Who it's for</h2>
        <p>
          Founders shipping AI products, engineers working with agents and LLMs, and
          builders who care about craft: the toolchain, the design decisions, the
          tradeoffs.
        </p>

        <Faq faqs={FAQS} />
      </Article>
    </>
  );
}
