import { DECKS_BY_PROGRAM } from "../lib/decks";
import { GUIDES_BY_PROGRAM } from "../lib/guides";
import { PROGRAMS } from "../lib/programs";
import registry from "../lib/skills.generated.json";

const BASE = "https://www.shipai.club";

export default function sitemap() {
  const lastModified = new Date();
  return [
    { url: `${BASE}/`, lastModified, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/programs`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    ...PROGRAMS.flatMap((program) => [
      { url: `${BASE}/programs/${program.slug}`, lastModified, changeFrequency: "weekly", priority: 0.9 },
      ...(program.hasHackathon
        ? [
            { url: `${BASE}${program.hackathonHref}`, lastModified, changeFrequency: "weekly", priority: 0.9 },
            { url: `${BASE}${program.hackathonHref}/sponsor`, lastModified, changeFrequency: "weekly", priority: 0.8 },
            { url: `${BASE}${program.hackathonHref}/submit`, lastModified, changeFrequency: "weekly", priority: 0.6 },
            { url: `${BASE}${program.hackathonHref}/results`, lastModified, changeFrequency: "weekly", priority: 0.6 },
          ]
        : []),
      ...(registry.manifest.programs?.[program.slug]
        ? [{ url: `${BASE}/programs/${program.slug}/skills`, lastModified, changeFrequency: "weekly", priority: 0.8 }]
        : []),
      ...program.sessions.flatMap((session) => [
        { url: `${BASE}/programs/${program.slug}/${session.slug}`, lastModified, changeFrequency: "weekly", priority: 0.7 },
        ...(GUIDES_BY_PROGRAM[program.slug]?.[session.slug]
          ? [{ url: `${BASE}/programs/${program.slug}/${session.slug}/guide`, lastModified, changeFrequency: "weekly", priority: 0.6 }]
          : []),
        ...(DECKS_BY_PROGRAM[program.slug]?.[session.slug]
          ? [{ url: `${BASE}/programs/${program.slug}/${session.slug}/deck`, lastModified, changeFrequency: "weekly", priority: 0.5 }]
          : []),
      ]),
    ]),
    { url: `${BASE}/ai-meetup-phoenix`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/ai-meetup-tempe`, lastModified, changeFrequency: "weekly", priority: 0.8 },
  ];
}
