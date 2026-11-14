import { notFound } from "next/navigation";
import SiteFooter from "../../../../../../components/site-footer";
import SiteHeader from "../../../../../../components/site-header";
import { EventHero, PeopleRow } from "../../../../../../components/event-page";
import { RecordRow } from "../../../../../../components/event-form";
import { publicTeam, publicTeamPath, publicTeams, HACKATHON_PATH } from "../../../../../../lib/public-teams";
import { DISCORD, EVENT, HACKATHON_PRIZES } from "../../../../../../lib/hackathon";
import { safeUrl } from "../../../../../../lib/accounts";
import { PITCH_FIELDS, customPitchDeckUrl, submissionPitchMode } from "../../../../../../lib/submissions";
import { certPath, fromCertificate } from "../../../../../../lib/results";
import { SHIPPED, SHIPPED_RESULTS } from "../../../../../../lib/shipped";
import { publishedCertificates } from "../../../../../../lib/store";
import "../../../../../../components/team-page.css";

export const dynamic = "force-dynamic";

const same = (a, b) => Boolean(a && b) && a.trim().toLowerCase() === b.trim().toLowerCase();
const projectOf = (team) => (team.submitted && team.project) || team.name;

export async function generateMetadata({ params }) {
  const { program, team: slug } = await params;
  const team = program === "zero-to-launch" ? await publicTeam(slug) : null;
  if (!team) return { title: "Team not found — Ship AI", robots: { index: false, follow: false } };
  const project = projectOf(team);
  return {
    title: `${same(project, team.name) ? project : `${project} by ${team.name}`} — ${EVENT.name}`,
    description: team.summary?.slice(0, 160) || `Meet ${team.name} at ${EVENT.name}. View their team and project.`,
    alternates: { canonical: `https://www.shipai.club${publicTeamPath(team)}` },
  };
}

/* A team's own words can hold web addresses. Make them links without
   touching anything else: http(s) addresses and bare names on common
   endings, with trailing punctuation left outside the link. */
const ADDRESS = /(https?:\/\/[^\s<>()]+|\b(?:[a-z0-9-]+\.)+(?:com|net|org|dev|app|io|ai|co|club)\b(?:\/[^\s<>()]*)?)/gi;

function Linked({ text }) {
  return String(text).split(ADDRESS).map((part, index) => {
    if (index % 2 === 0) return part;
    const tail = part.match(/[.,;:!?'")\]]+$/)?.[0] ?? "";
    const address = tail ? part.slice(0, -tail.length) : part;
    const href = safeUrl(address);
    if (!href) return part;
    return <span key={index}><a href={href} target="_blank" rel="noreferrer nofollow ugc">{address}</a>{tail}</span>;
  });
}

/* The team page: the entry card. The project is the headline and the
   team its byline. Under it the recorded pitch sits beside a card of
   facts (how it placed, who built it, the one button), then one
   readable column: the summary, the team's other answers as rows that
   open in place, and the team. The page ends on the fleet: where this
   project sits among those that shipped, and the one before and after.

   It degrades in steps: a recording, else the preview image, else the
   card alone. A team that has not submitted gets the card and the team. */
export default async function Page({ params }) {
  const { program, team: slug } = await params;
  if (program !== "zero-to-launch") notFound();
  const team = await publicTeam(slug);
  if (!team) notFound();

  const [everyTeam, certificateRows] = await Promise.all([publicTeams(), publishedCertificates()]);
  const fleet = everyTeam.filter((entry) => entry.submitted);
  const at = fleet.findIndex((entry) => entry.slug === team.slug);
  const project = projectOf(team);

  const certificate = certificateRows.map(fromCertificate)
    .find((entry) => same(entry.team, team.name) || same(entry.team, team.registered_name) || same(entry.project, team.project));
  const podiumPlace = certificate?.award || SHIPPED.podium.find((entry) => entry.team === team.slug)?.place;
  const prize = HACKATHON_PRIZES.find((entry) => entry.name === podiumPlace);
  const placed = !team.submitted ? "Building" : podiumPlace ? [podiumPlace, prize && `$${prize.cash}`].filter(Boolean).join(" · ") : "Launched";
  const podiumSlugs = new Set(SHIPPED.podium.map((entry) => entry.team));

  const site = team.submitted && safeUrl(team.live_url);
  const deck = team.submitted && (customPitchDeckUrl(team.pitch) || (submissionPitchMode(team.pitch) === "generated" ? `${publicTeamPath(team)}/deck` : ""));
  const repo = team.submitted && safeUrl(team.repo_url);
  const links = [
    deck && { href: deck, label: "Pitch deck", external: true },
    repo && { href: repo, label: "Code", external: true },
    certificate && { href: certPath(certificate), label: "Certificate" },
  ].filter(Boolean);

  const video = team.pitch_video_url;
  const poster = team.pitch_video_poster_url;
  const answers = team.submitted
    ? [["What they shipped", team.launch], ["Receipts", team.receipts], ...PITCH_FIELDS.map((field) => [field.name, team.pitch?.[field.key]])].filter(([, value]) => value)
    : [];
  const summary = team.submitted && team.summary && !same(team.summary, team.tagline) ? team.summary : "";
  const people = team.members.map((member) => ({
    name: member.name,
    role: [member.title, member.company].filter(Boolean).join(" · "),
    photo: safeUrl(member.avatar_url) || null,
  }));
  const pitchedOn = new Date(EVENT.endISO).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Phoenix" });

  return (
    <>
      <SiteHeader current="/programs" />

      <main id="top">
        <EventHero
          crumb={{ href: `${HACKATHON_PATH}#teams`, label: `The ${fleet.length || SHIPPED.teams} that shipped` }}
          name={same(project, team.name) ? EVENT.name : `by ${team.name} · ${EVENT.name}`}
          title={project}
          lede={team.tagline || undefined}
        />

        <div className={video || poster ? "tp-entry" : "tp-entry is-solo"} id="team-pitch">
          {video && (
            <video className="tp-media" controls playsInline preload="metadata" poster={poster || undefined} aria-label={`${project}: the recorded pitch`}>
              <source src={video} type="video/mp4" />
              Your browser does not support embedded video.
            </video>
          )}
          {!video && poster && <img className="tp-media" src={poster} alt={`${project} project preview`} />}

          <aside className="tp-card" aria-label="Project facts">
            <dl>
              <div><dt>{team.submitted ? "Placed" : "Status"}</dt><dd><b>{placed}</b></dd></div>
              <div><dt>Team</dt><dd>{team.name}{team.member_count > 1 ? ` · ${team.member_count} members` : ""}</dd></div>
              <div><dt>{video ? "Pitched" : "Held"}</dt><dd>{video ? pitchedOn : EVENT.datesShort} · Phoenix</dd></div>
            </dl>
            <div className="tp-act">
              {site && <a className="btn btn-solid" href={site} target="_blank" rel="noreferrer">Open site</a>}
              {links.length > 0 && (
                <p className="tp-links">
                  {links.map((link) => <a key={link.label} href={link.href} {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}>{link.label}</a>)}
                </p>
              )}
              {!team.submitted && <p className="tp-quiet">This team has registered and is still preparing its submission.</p>}
            </div>
          </aside>
        </div>

        <div className="tp-col">
          {summary && <p className="tp-summary">{summary}</p>}

          {answers.length > 0 && (
            <div className="ef-records tp-answers">
              {answers.map(([label, value], index) => (
                <RecordRow key={label} title={label} open={!summary && index === 0}>
                  <p><Linked text={value} /></p>
                </RecordRow>
              ))}
            </div>
          )}

          <section aria-labelledby="tp-team-title">
            <h2 id="tp-team-title" className="tp-h">The team</h2>
            {people.length > 0 ? (
              <PeopleRow people={people} />
            ) : (
              <p className="tp-none">{team.member_count} member{team.member_count === 1 ? "" : "s"}. Team members have not shared public profiles.</p>
            )}
          </section>
        </div>

        {at >= 0 && fleet.length > 1 && (
          <nav className="tp-fleet" aria-label="Other projects that shipped">
            <p className="tp-fleet-bar">
              <span>{at + 1} of {fleet.length} that shipped</span>
              <a href={SHIPPED_RESULTS}>The results</a>
            </p>
            <div className="tp-rail" style={{ "--tp-n": fleet.length }} aria-hidden="true">
              {fleet.map((entry, index) => (
                <i key={entry.slug} className={index === at ? "is-here" : podiumSlugs.has(entry.slug) ? "is-placed" : undefined} />
              ))}
            </div>
            <div className="tp-around">
              {[[fleet[(at - 1 + fleet.length) % fleet.length], "← Before"], [fleet[(at + 1) % fleet.length], "Next →"]].map(([entry, label]) => (
                <a key={label} href={publicTeamPath(entry)}>
                  <span className="ev-label">{label}</span>
                  <b>{projectOf(entry)}</b>
                </a>
              ))}
            </div>
          </nav>
        )}

        <div className="ev-end" />
      </main>

      <SiteFooter />
    </>
  );
}
