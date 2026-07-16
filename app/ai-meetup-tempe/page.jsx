import { Article, Faq, JsonLd, faqSchema, articleSchema, EventList } from "../../components/article";
import { getUpcomingEvents } from "../../lib/meetup";

const UPDATED = "July 2026";
const TITLE = "AI Meetup in Tempe: Ship AI Builder Sessions";
const DESCRIPTION =
  "Ship AI runs AI builder events in Tempe, Arizona — hands-on Saturday sessions and Socratic Nights for technical founders and engineers shipping with LLMs, agents, and modern AI tooling. RSVP on Meetup.";

export const metadata = {
  title: `${TITLE} — Ship AI`,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.shipai.club/ai-meetup-tempe" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    q: "Where do Ship AI's Tempe events happen?",
    a: "Tempe sessions have met at the Event Center at 3910 S Rural Rd in Tempe, Arizona. Venues are confirmed per event, so always check the specific listing on Meetup or Luma before heading out.",
  },
  {
    q: "How are Tempe sessions different from the Phoenix ones?",
    a: "Tempe has hosted Ship AI's longer-form Saturday sessions — hands-on, workshop-style deep dives — while Phoenix hosts the evening Socratic Nights. Both follow the community's demos-over-memos ethos.",
  },
  {
    q: "Do I need to bring anything to a Tempe session?",
    a: "A laptop if you want to build along during hands-on sessions. Otherwise just come ready to ask questions and dig into topics — the format rewards curiosity and receipts, not credentials.",
  },
  {
    q: "How do I hear about the next Tempe event?",
    a: "RSVP on the Ship AI Meetup group (meetup.com/shipai), follow the Luma calendar (luma.com/shipai), or join the Discord where sessions are announced first.",
  },
];

export default async function Page() {
  const events = await getUpcomingEvents(4);
  const tempeEvents = events.filter((e) => /tempe/i.test(e.place));

  return (
    <>
      <JsonLd data={articleSchema({ title: TITLE, description: DESCRIPTION, path: "/ai-meetup-tempe", modified: "2026-07-16" })} />
      <JsonLd data={faqSchema(FAQS)} />
      <Article kicker="Tempe, Arizona" title={TITLE} updated={UPDATED}>
        <p className="article-lede">
          <strong>Ship AI</strong> runs AI builder events in Tempe, Arizona — part of the
          same community that hosts <a href="/socratic-night">Socratic Nights</a> in{" "}
          <a href="/ai-meetup-phoenix">Phoenix</a>. Tempe sessions lean hands-on: Saturday
          deep dives where builders work through agentic workflows, modern AI toolchains,
          and what it takes to get an AI product from prototype to production.
        </p>

        <h2>What happens at a Tempe session</h2>
        <p>
          Tempe has hosted Ship AI's longer-form sessions — Saturday events with room to go
          deep on a single theme: agentic engineering, the builder's stack, backend and
          production concerns, growth and monetization for AI products. The community rules
          apply everywhere: demos over memos, questions first, receipts required. Expect
          working software on screens, not slide decks.
        </p>

        <h2>Where and when</h2>
        <p>
          Tempe sessions have met at the <strong>Event Center, 3910 S Rural Rd, Tempe, AZ</strong>.
          Exact dates, times, and venues are confirmed per event on the{" "}
          <a href="https://www.meetup.com/shipai/" target="_blank" rel="noreferrer">Meetup group</a>{" "}
          and <a href="https://luma.com/shipai" target="_blank" rel="noreferrer">Luma calendar</a>.
          Any Tempe events currently scheduled appear below, pulled live from Meetup.
        </p>

        {tempeEvents.length > 0 && (
          <>
            <h2>Upcoming Tempe events</h2>
            <EventList events={tempeEvents} />
          </>
        )}

        <h2>One community, two cities</h2>
        <p>
          Phoenix and Tempe events share one member base, one Discord, and one agenda
          process — topics and demo requests are submitted on GitHub and voted on by the
          community. If you're near Arizona State University or the East Valley, Tempe is
          your closest session; the <a href="/ai-meetup-phoenix">Phoenix Socratic Nights</a>{" "}
          on Camelback Road are fifteen minutes away.
        </p>

        <Faq faqs={FAQS} />
      </Article>
    </>
  );
}
