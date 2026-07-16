import { Article, Faq, JsonLd, faqSchema, articleSchema, EventList } from "../../components/article";
import { getUpcomingEvents } from "../../lib/meetup";

const UPDATED = "July 2026";
const TITLE = "AI Meetup in Phoenix: Ship AI Socratic Nights";
const DESCRIPTION =
  "Ship AI runs a recurring AI meetup in Phoenix, Arizona — Socratic Nights on Camelback Road with an AI news briefing, member-voted discussion topics, and 5-minute demos. RSVP free on Meetup.";

export const metadata = {
  title: `${TITLE} — Ship AI`,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.shipai.club/ai-meetup-phoenix" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    q: "Where does the Ship AI Phoenix meetup happen?",
    a: "Socratic Nights meet at 2390 E Camelback Rd #130 in Phoenix, Arizona (the Camelback Corridor / Biltmore area). Always check the specific event listing on Meetup or Luma — venues are confirmed per event.",
  },
  {
    q: "Who attends the Phoenix Ship AI meetup?",
    a: "Technical founders, engineers, and builders working with AI — people shipping products with LLMs, agents, and modern AI tooling. It's a discussion-and-demo format, not a networking mixer or pitch night.",
  },
  {
    q: "How do I RSVP for a Ship AI event in Phoenix?",
    a: "RSVP on the Ship AI Meetup group (meetup.com/shipai) or the Luma calendar (luma.com/shipai). Joining the Discord is the best way to follow announcements between events.",
  },
  {
    q: "Is the Phoenix meetup beginner-friendly?",
    a: "It's builder-focused rather than intro-level — sessions assume you're actively building with AI or seriously trying to. If you're technical and curious, you'll keep up; the format rewards good questions as much as expertise.",
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
          technical founders and builders. The format is the{" "}
          <a href="/socratic-night">Socratic Night</a>: an AI news briefing, group
          discussion of member-voted topics, and 5-minute demos of things members actually
          shipped. Demos over memos — no slideware, no hard selling.
        </p>

        <h2>What happens at a Phoenix session</h2>
        <p>
          Phoenix sessions are evening events built around discussion and working software.
          Every session opens with a 20-minute briefing on what matters for AI builders
          right now, moves into Socratic Rounds on topics the community submitted and voted
          on (questions first, hot takes welcome, receipts required), and closes with
          5-minute demos from members.
        </p>

        <h2>Where and when</h2>
        <p>
          Socratic Nights in Phoenix meet at <strong>2390 E Camelback Rd #130</strong> in
          the Camelback Corridor. Exact dates and times are on the{" "}
          <a href="https://www.meetup.com/shipai/" target="_blank" rel="noreferrer">Meetup group</a>{" "}
          and <a href="https://luma.com/shipai" target="_blank" rel="noreferrer">Luma calendar</a>{" "}
          — the list below is pulled live from Meetup, so it's always current.
        </p>

        {phoenixEvents.length > 0 && (
          <>
            <h2>Upcoming Phoenix events</h2>
            <EventList events={phoenixEvents} />
          </>
        )}

        <h2>Who it's for</h2>
        <p>
          Ship AI is a high-signal community for people pushing the bleeding edge of AI —
          founders shipping AI products, engineers working with agents and LLMs, and
          builders who care about craft: the toolchain, the design decisions, the
          tradeoffs. Ship AI also runs events in{" "}
          <a href="/ai-meetup-tempe">Tempe</a>, fifteen minutes down the road.
        </p>

        <Faq faqs={FAQS} />
      </Article>
    </>
  );
}
