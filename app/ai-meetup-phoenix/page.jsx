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
    a: "Ship AI meets at 2390 E Camelback Rd #130 in Phoenix, Arizona (the Camelback Corridor / Biltmore area), with some sessions at CEI Gateway on N Gateway Dr. Always check the specific event listing on Meetup or Luma — venues are confirmed per event.",
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
          <a href="/programs">workshop or builder presentation</a>: a 20-minute AI news briefing, the main
          session built live on screen, then 5-minute demos of things members actually
          shipped. Demos over memos — no slideware, no hard selling.
        </p>

        <h2>What happens at a Phoenix session</h2>
        <p>
          Phoenix sessions are evening events built around discussion and working software.
          Every session opens with a 20-minute briefing on what matters for AI builders
          right now, moves into the workshop — the host presents and builds on screen while
          you follow along on a laptop or just watch — and closes with 5-minute demos from
          members. Questions welcome throughout, receipts required.
        </p>

        <h2>Where and when</h2>
        <p>
          Ship AI sessions in Phoenix meet at <strong>2390 E Camelback Rd #130</strong> in
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
