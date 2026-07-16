const BASE = "https://www.shipai.club";

export default function sitemap() {
  const lastModified = new Date();
  return [
    { url: `${BASE}/`, lastModified, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/socratic-night`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/ai-meetup-phoenix`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/ai-meetup-tempe`, lastModified, changeFrequency: "weekly", priority: 0.8 },
  ];
}
