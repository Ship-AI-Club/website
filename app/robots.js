// AI search/citation bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
// are deliberately allowed — being citable by AI assistants is a goal.
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        /* The signed-in surfaces. Every page under these is already
           noindex and behind a session, but a crawler shouldn't spend
           its budget finding that out one 302 at a time. */
        disallow: ["/dashboard", "/admin", "/judge", "/login", "/onboarding", "/auth/"],
      },
    ],
    sitemap: "https://www.shipai.club/sitemap.xml",
  };
}
