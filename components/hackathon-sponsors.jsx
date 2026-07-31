import { publicSponsors } from "../lib/stats";

/* ------------------------------------------------------------------
   The sponsor wall.

   Driven by the `sponsorships` table rather than a constant, so a
   sponsor who confirms the week of the event is a row and not a
   deploy — which is the week it is most likely to happen.

   Logos scale with tier, deliberately. The whole sponsorship page is
   built on the idea that the ladder is real and the prices are
   published; a wall that renders every mark at the same size quietly
   contradicts it, and the first person to notice is the one who paid
   for Platinum.

   Renders nothing until there's a confirmed sponsor, so the page
   reads as it always has rather than showing an empty shelf.
------------------------------------------------------------------ */

export default async function HackathonSponsors() {
  const groups = await publicSponsors();
  if (!groups.length) return null;

  return (
    <section className="section hk-sponsors" aria-labelledby="sponsors-title">
      <p className="kicker">Backed by</p>
      <h2 id="sponsors-title">Who&apos;s behind it.</h2>
      <p className="section-lede">
        Ship AI is free and stays free because of them — and most of them give more than
        money. The rooms we meet in, the food, the prize pool, platform credits, mentors in
        Saturday&apos;s rotations, judges on Sunday&apos;s panel, and introductions that
        outlast the weekend. All of it is{" "}
        <a href="/programs/zero-to-launch/hackathon/sponsor">priced in the open</a>.
      </p>

      {groups.map(({ tier, sponsors }) => (
        <div key={tier.id} className={`hk-sponsor-tier is-${tier.id}`}>
          <p className="hk-sponsor-tier-name">
            {tier.name}
            {tier.sub ? ` · ${tier.sub}` : ""}
          </p>

          <ul className="hk-sponsor-row">
            {sponsors.map((s) => {
              const name = s.org || s.credit_name;
              const mark = s.logo_url ? (
                /* An icon-only mark carries no name, so it gets one
                   set beside it — otherwise desic's square sits on
                   the wall as an unattributed shape. */
                <span className={s.wordmark ? "hk-sponsor-lockup" : undefined}>
                  <img src={s.logo_url} alt={s.wordmark ? "" : name} loading="lazy" />
                  {s.wordmark && <span className="hk-sponsor-wordmark">{name}</span>}
                </span>
              ) : (
                /* No logo yet is a normal state between "they said
                   yes" and "they sent the file" — the name still
                   belongs on the wall. */
                <span className="hk-sponsor-wordmark">{name}</span>
              );

              return (
                <li key={`${tier.id}-${name}`} className="hk-sponsor">
                  {s.website ? (
                    <a href={s.website} target="_blank" rel="noreferrer" title={name}>
                      {mark}
                    </a>
                  ) : (
                    mark
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}
