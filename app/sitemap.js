import { DECKS } from "../lib/decks";
import { GUIDES } from "../lib/guides";
import { WORKSHOPS } from "../lib/hackathon";

const BASE = "https://www.shipai.club";

export default function sitemap() {
  const lastModified = new Date();
  return [
    { url: `${BASE}/`, lastModified, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/hackathon`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/hackathon/workshops`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/hackathon/skills`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    ...WORKSHOPS.flatMap((w) => [
      {
        url: `${BASE}/hackathon/workshops/${w.slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.7,
      },
      ...(GUIDES[w.slug]
        ? [
            {
              url: `${BASE}/hackathon/workshops/${w.slug}/guide`,
              lastModified,
              changeFrequency: "weekly",
              priority: 0.6,
            },
          ]
        : []),
      ...(DECKS[w.slug]
        ? [
            {
              url: `${BASE}/hackathon/workshops/${w.slug}/deck`,
              lastModified,
              changeFrequency: "weekly",
              priority: 0.5,
            },
          ]
        : []),
    ]),
    { url: `${BASE}/hackathon/submit`, lastModified, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/ai-meetup-phoenix`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/ai-meetup-tempe`, lastModified, changeFrequency: "weekly", priority: 0.8 },
  ];
}
