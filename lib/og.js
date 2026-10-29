const VERSION = "1";

export function ogImage({ kicker = "Ship AI Community", title, key, tagline, meta = "Phoenix, Arizona", alt }) {
  const params = new URLSearchParams({ v: VERSION, k: kicker, t: title });
  if (key) params.set("i", key);
  if (tagline) params.set("d", tagline);
  if (meta) params.set("m", meta);
  return { url: `/og?${params.toString()}`, width: 1200, height: 630, alt: alt || title };
}

export const DEFAULT_OG = ogImage({
  title: "Practical AI, Built Together",
  key: "Built Together",
  tagline: "Hands-on AI workshops and programs for builders.",
  alt: "Ship AI Community: Practical AI, Built Together",
});
