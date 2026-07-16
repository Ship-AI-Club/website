// AI search/citation bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
// are deliberately allowed — being citable by AI assistants is a goal.
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://www.shipai.club/sitemap.xml",
  };
}
