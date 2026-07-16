import { Article, Faq, JsonLd, faqSchema, articleSchema } from "../../components/article";

const UPDATED = "July 2026";
const TITLE = "What is a Socratic Night?";
const DESCRIPTION =
  "A Socratic Night is Ship AI's community event format: an AI news briefing, group discussion of member-voted topics (questions first, receipts required), and 5-minute demos of things members actually shipped.";

export const metadata = {
  title: `${TITLE} — Ship AI`,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.shipai.club/socratic-night" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    q: "Do I need to present something to attend a Socratic Night?",
    a: "No. Demos are optional — most attendees come to discuss and learn. If you did build something, the 5-minute demo slot is the best way to share it: what it does and what you learned, no hard selling.",
  },
  {
    q: "How are Socratic Night topics chosen?",
    a: "Topics and demo requests are submitted by community members on GitHub and voted on. The most-wanted topics shape each session's Socratic Rounds — members set the agenda, not organizers.",
  },
  {
    q: "Who should come to a Socratic Night?",
    a: "Technical founders, engineers, and builders working with AI — anyone who wants substantive discussion about models, agents, and AI product craft rather than networking small talk or pitch events.",
  },
  {
    q: "Where do Socratic Nights happen?",
    a: "Ship AI runs Socratic Nights in Phoenix, Arizona, with events also held in Tempe. Check the Meetup or Luma calendar for the next session's exact venue and time.",
  },
];

export default function Page() {
  return (
    <>
      <JsonLd data={articleSchema({ title: TITLE, description: DESCRIPTION, path: "/socratic-night", modified: "2026-07-16" })} />
      <JsonLd data={faqSchema(FAQS)} />
      <Article kicker="The format" title={TITLE} updated={UPDATED}>
        <p className="article-lede">
          A <strong>Socratic Night</strong> is a community event format created by{" "}
          <a href="/">Ship AI</a>, an AI builders community in Phoenix and Tempe, Arizona. It
          combines a news briefing, structured group discussion of member-voted topics, and
          short demos of real shipped work — in that order, every session.
        </p>

        <h2>The three-part structure</h2>
        <p>Every Socratic Night runs the same spine:</p>
        <ol>
          <li>
            <strong>AI News Briefing (first 20 minutes).</strong> A tight rundown of what
            matters for builders right now — new models, capabilities, and tooling. Signal
            only, no recaps of things you already scrolled past.
          </li>
          <li>
            <strong>Socratic Rounds (main session).</strong> Community-submitted topics, dug
            into as a group. The rules: questions first, hot takes welcome, receipts required.
            If you make a claim, be ready to back it with something you've actually built,
            measured, or read.
          </li>
          <li>
            <strong>5-Minute Demos (closing).</strong> Members show what they shipped since
            the last session — what it does and what they learned building it. No slideware,
            no pitch decks, no hard selling.
          </li>
        </ol>

        <h2>Why "Socratic"?</h2>
        <p>
          The format borrows from the Socratic method: understanding is built by
          interrogating ideas together, not by listening to a presenter. Most tech meetups
          are lecture-shaped — one speaker, many chairs. A Socratic Night inverts that: the
          room is the speaker, and the agenda is whatever the community voted to dig into.
          The "receipts required" rule keeps it grounded — opinions are welcome, but evidence
          wins.
        </p>

        <h2>How it differs from a typical tech meetup</h2>
        <ul>
          <li><strong>Member-set agenda</strong> — topics are submitted and voted on, not programmed by organizers.</li>
          <li><strong>Demos over memos</strong> — the closing segment is working software, not slides about software.</li>
          <li><strong>Discussion over lecture</strong> — the main session is structured group inquiry, not a talk with Q&amp;A bolted on.</li>
          <li><strong>Builder-focused</strong> — the audience is technical founders and engineers pushing what current AI models can actually do.</li>
        </ul>

        <h2>How to join one</h2>
        <p>
          Socratic Nights are listed on the{" "}
          <a href="https://www.meetup.com/shipai/" target="_blank" rel="noreferrer">Ship AI Meetup group</a>{" "}
          and the <a href="https://luma.com/shipai" target="_blank" rel="noreferrer">Luma calendar</a>.
          Sessions run in <a href="/ai-meetup-phoenix">Phoenix</a> and{" "}
          <a href="/ai-meetup-tempe">Tempe</a>. To propose a topic, open an issue on the{" "}
          <a href="https://github.com/Ship-AI-Club/events/issues/new?title=Topic%3A%20" target="_blank" rel="noreferrer">
            Ship AI events repo
          </a>{" "}
          — the community votes it into a session.
        </p>

        <Faq faqs={FAQS} />
      </Article>
    </>
  );
}
