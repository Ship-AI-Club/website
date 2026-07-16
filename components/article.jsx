const DISCORD = "https://discord.gg/kZSJMNveYM";
const MEETUP = "https://www.meetup.com/shipai/";

export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleSchema({ title, description, path, modified }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `https://www.shipai.club${path}`,
    dateModified: modified,
    author: { "@type": "Organization", name: "Ship AI", url: "https://www.shipai.club" },
    publisher: { "@type": "Organization", name: "Ship AI", url: "https://www.shipai.club" },
  };
}

export function Article({ kicker, title, updated, children }) {
  return (
    <>
      <header className="nav">
        <a href="/" className="brand">
          <img src="/logo-icon.png" alt="" width={26} height={26} />
          <span>Ship AI</span>
        </a>
        <nav>
          <a href="/#format">Format</a>
          <a href="/#events">Events</a>
        </nav>
        <a className="btn btn-solid nav-cta" href={DISCORD} target="_blank" rel="noreferrer">
          Join the Discord
        </a>
      </header>
      <main className="article">
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
        <p className="article-updated">Last updated: {updated}</p>
        {children}
        <div className="cta-row article-cta">
          <a className="btn btn-solid" href={DISCORD} target="_blank" rel="noreferrer">
            Join the Discord
          </a>
          <a className="btn btn-ghost" href={MEETUP} target="_blank" rel="noreferrer">
            RSVP on Meetup
          </a>
        </div>
      </main>
      <footer className="footer">
        <div className="brand">
          <img src="/logo-icon.png" alt="" width={22} height={22} />
          <span>Ship AI</span>
        </div>
        <p>Phoenix &amp; Tempe, Arizona</p>
        <nav>
          <a href="/socratic-night">Socratic Night</a>
          <a href="/ai-meetup-phoenix">Phoenix</a>
          <a href="/ai-meetup-tempe">Tempe</a>
          <a href="/">Home</a>
        </nav>
        <p className="fine">© 2026 Ship AI</p>
      </footer>
    </>
  );
}

export function Faq({ faqs }) {
  return (
    <section className="article-faq">
      <h2>Frequently asked questions</h2>
      {faqs.map((f) => (
        <div key={f.q} className="faq-item">
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </div>
      ))}
    </section>
  );
}

export function EventList({ events }) {
  if (!events.length) return null;
  return (
    <div className="events">
      {events.map((e) => (
        <a key={e.url + e.title} className="event" href={e.url} target="_blank" rel="noreferrer">
          <div className="event-when">
            <span>{e.date}</span>
            <span>{e.time}</span>
          </div>
          <div className="event-body">
            <h3>{e.title}</h3>
            <p className="event-venue">{e.place}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
