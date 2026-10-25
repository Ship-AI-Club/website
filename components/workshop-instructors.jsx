import { workshopMedia } from "../lib/workshop-media";
import { VIBE_GTM } from "../lib/vibe-gtm-workshop";

function publicUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export default async function WorkshopInstructors({ compact = false, slug = "vibe-coding-gtm" }) {
  const { facilitators: people } = await workshopMedia(slug);
  if (!people.length) return compact ? null : <section className="wd-facilitators"><p className="kicker">Facilitators</p><h2>To Be Announced</h2><p>We’ll confirm the facilitators before paid registration opens.</p></section>;
  if (compact) return <p className="vg-instructor-byline"><strong>Instructors:</strong> {people.map(person => person.name).join(" & ")}</p>;
  return (
    <section className="vg-instructors" aria-labelledby="vg-instructors-title">
      <p className="kicker">Facilitators</p>
      <h2 id="vg-instructors-title">Meet Your Facilitators</h2>
      <div className="vg-instructor-grid">
        {people.map(person => {
          const website = publicUrl(person.website);
          const linkedin = publicUrl(person.linkedin);
          return <article className="vg-instructor" key={person.id}>
            <div className="vg-instructor-head">
              {person.avatar_url && <img src={person.avatar_url} alt={person.name} width={88} height={88} loading="lazy" />}
              <div><h3>{person.name}</h3>{person.title && <p className="vg-instructor-role">{person.title}</p>}{person.company && <p className="vg-instructor-company">{person.company}</p>}</div>
            </div>
            {person.bio && <p className="vg-instructor-bio">{person.bio}</p>}
            <div className="vg-instructor-links">
              {website && <a href={website} target="_blank" rel="noreferrer">Website</a>}
              {linkedin && <a href={linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
              {person.id === VIBE_GTM.instructorIds[0] && <a href="/about#host">About Santos</a>}
            </div>
          </article>;
        })}
      </div>
    </section>
  );
}
