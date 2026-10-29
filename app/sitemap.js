import { DECKS_BY_PROGRAM } from "../lib/decks";
import { GUIDES_BY_PROGRAM } from "../lib/guides";
import { PROGRAMS } from "../lib/programs";
import { BREAKOUTS, OPENING_DECK } from "../lib/hackathon-opening";
import { AI_ORGANIZATION_EVENT } from "../lib/ai-organization-event";
import { UPCOMING_WORKSHOPS } from "../lib/workshops";
import registry from "../lib/skills.generated.json";
import { FOUNDER_WEEKEND } from "../lib/founder-weekend";

const BASE = "https://www.shipai.club";

export default function sitemap() {
  const lastModified = new Date();
  return [
    { url: `${BASE}/`, lastModified, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/about`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/programs`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: FOUNDER_WEEKEND.url, lastModified, changeFrequency: "daily", priority: 1 },
    { url: `${FOUNDER_WEEKEND.url}/register`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/workshops/assessment`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/workshops`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/workshops/vibe-coding-gtm`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/workshops/${AI_ORGANIZATION_EVENT.slug}`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    ...UPCOMING_WORKSHOPS.map((workshop) => ({ url: `${BASE}/workshops/${workshop.slug}`, lastModified, changeFrequency: "weekly", priority: 0.8 })),
    ...PROGRAMS.flatMap((program) => [
      { url: `${BASE}/programs/${program.slug}`, lastModified, changeFrequency: "weekly", priority: 0.9 },
      ...(program.hasHackathon
        ? [
            { url: `${BASE}${program.hackathonHref}`, lastModified, changeFrequency: "weekly", priority: 0.9 },
            { url: `${BASE}${program.hackathonHref}/sponsor`, lastModified, changeFrequency: "weekly", priority: 0.8 },
            { url: `${BASE}${program.hackathonHref}/submit`, lastModified, changeFrequency: "weekly", priority: 0.6 },
            { url: `${BASE}${program.hackathonHref}/results`, lastModified, changeFrequency: "weekly", priority: 0.6 },
            ...(program.slug === 'zero-to-launch' ? [
              { url: `${BASE}${OPENING_DECK}`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
              { url: `${BASE}${program.hackathonHref}/bots`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
              ...BREAKOUTS.map(item => ({ url: `${BASE}${item.href}`, lastModified, changeFrequency: 'weekly', priority: 0.7 })),
            ] : []),
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
  ];
}
