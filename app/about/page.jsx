import { EventHero, EventSection, RuledRows } from "../../components/event-page";
import Scene from "../../components/scene";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import { ogImage } from "../../lib/og";
import "./about.css";

/* The About page: the articles. The eight values are ruled rows, the
   name on the left and its sentence on the right. The host follows in
   one panel, and the page ends on its one action: see what is next. */

const TITLE = "About — Ship AI";
const DESCRIPTION =
  "Ship AI runs hands-on AI workshops and programs in Phoenix. Expert guidance, practical projects, and a community of builders. Our values and host.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.shipai.club/about" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.shipai.club/about",
    siteName: "Ship AI",
    images: [ogImage({ kicker: "About Ship AI", title: "What we're about.", key: "about.", tagline: "Practical AI education for Phoenix builders. Our values and our host." })],
  },
};

const DISCORD = "https://discord.gg/kZSJMNveYM";
const EVENTS = "/ai-meetup-phoenix";

const values = [
  {
    title: "Learn by Building",
    copy: "Focused workshops pair expert guidance with time to work on your own project. Bring a question, build something useful, and share what you learn.",
  },
  {
    title: "Demos Over Memos",
    copy: "Show the build, the workflow, the call you'd make differently — founders too: demo the product, skip the hard sell.",
  },
  {
    title: "Craft Over Hype",
    copy: "The toolchain, the tradeoffs, the parts that hurt — what separates shipped from great.",
  },
  {
    title: "Taste",
    copy: "We hold opinions about design, architecture, and what's worth shipping at all — curated over cranked out.",
  },
  {
    title: "Living on the Bleeding Edge",
    copy: "We push models past the defaults and the docs, then ship what we find as products nobody's built yet.",
  },
  {
    title: "Honest Starting Points",
    copy: "Say where you actually are — half-built, no users, revenue flat, six months in with nothing shipped — because nothing solid gets built on an inflated baseline.",
  },
  {
    title: "Proof of Work",
    copy: "Screenshots, commits, the number that didn't go up — a small real result beats a big vague claim.",
  },
  {
    title: "Community-Driven",
    copy: "Every session ends in 5-minute demos, and what you're stuck on is what the next one gets built around.",
  },
];

export default function Page() {
  return (
    <>
      <SiteHeader
        current="/about"
        cta={<a className="btn btn-solid btn-sm nav-cta" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a>}
      />

      <main id="top">
        <EventHero
          title="What we&apos;re"
          keyPhrase="about."
          lede="Ship AI brings Phoenix builders together for practical AI education. Our paid workshops give you focused time, expert guidance, and feedback on your project. Learn the tools, develop your judgment, and ship work you can use."
        />

        <section className="section ev-section ab-values" aria-label="What we value">
          <RuledRows items={values.map((value) => [value.title, value.copy])} />
        </section>

        <EventSection id="host" title="Your" keyPhrase="host">
          <div className="host ab-host">
            <img
              src="/santos.jpg"
              alt="Santos Hernandez, founder and host of Ship AI"
              width={140}
              height={140}
              className="host-photo"
            />
            <div className="host-body">
              <h3>Santos Hernandez</h3>
              <p className="host-role">Founder &amp; host</p>
              <p>
                Santos is a founder and Lead Product Engineer building agentic AI systems.
                Before this he was the founding product hire at ZBD, taking it from $0 to
                $12M ARR and helping secure the EU&apos;s first MiCAR approval plus money
                transmitter licenses across 26 states and D.C. He started Ship AI so
                Phoenix builders have a room where you show the work.
              </p>
              <p className="host-links">
                <a href="https://santos.lol" target="_blank" rel="noreferrer">santos.lol</a>
                <a href="https://x.com/5antoshernandez" target="_blank" rel="noreferrer">X</a>
                <a href="https://github.com/5antoshernandez" target="_blank" rel="noreferrer">GitHub</a>
              </p>
            </div>
          </div>
        </EventSection>

        <div className="ev-end" />

        <section className="band" aria-labelledby="ab-final-title">
          <Scene scene="stars" mode="ascii" band className="band-bg" />
          <div className="final">
            <h2 id="ab-final-title">Practical AI, <span className="key">built together.</span></h2>
            <div className="cta-row">
              <a className="btn btn-solid" href={EVENTS}>See what&apos;s next</a>
              <a className="btn btn-ghost" href={DISCORD} target="_blank" rel="noreferrer">Join the Discord</a>
            </div>
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
