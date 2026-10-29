/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Two agents working the same checkout would otherwise both write
     .next and corrupt each other's build cache. Unset everywhere that
     matters, including Vercel, so the default stays ".next". */
  distDir: process.env.NEXT_DIST_DIR || ".next",

  experimental: { serverActions: { bodySizeLimit: "4mb" } },

  serverExternalPackages: ["libfx"],

  outputFileTracingIncludes: {
    "/api/workshops/*/materials/*": ["./workshop-kits/build-your-ai-organization/**/*", "./workshop-kits/vibe-coding-gtm/**/*"],
    "/api/workshops/*/og": ["./public/brand/seal-banknote.svg", "./public/workshop-art/website-marketing-instructors.png", "./public/fonts/*.ttf"],
    "/programs/[program]/hackathon/results/opengraph-image": ["./public/fonts/*.ttf"],
    "/api/fx-deck": ["./public/marketing-resources/library/copywriting/**/*.md", "./public/marketing-resources/library/copy-editing/**/*.md", "./public/marketing-resources/library/cro/**/*.md"],
    "/api/fx-showcase": ["./content/skills/**/*.md", "./content/program-skills/**/*.md", "./content/workshop-skills/**/*.md", "./public/marketing-resources/library/seo-audit/**/*.md", "./public/marketing-resources/library/programmatic-seo/**/*.md", "./public/marketing-resources/library/copywriting/**/*.md", "./public/marketing-resources/library/copy-editing/**/*.md", "./public/marketing-resources/library/cro/**/*.md"],
  },

  async headers() {
    return [
      {
        source: "/growth-engineering/desert-shine/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path*",
        headers: [
          // Keep our slide previews frameable by this origin only.
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      { source: "/growth-engineering/desert-shine", destination: "/growth-engineering/desert-shine/index.html" },
      { source: "/growth-engineering/desert-shine/quote", destination: "/growth-engineering/desert-shine/quote/index.html" },
    ];
  },

  async redirects() {
    return [
      ...["/az-ai-hackathon", "/ai-hackathon", "/phoenix-hackathon"].map((source) => ({
        source,
        destination: "/founder-weekend",
        permanent: false,
      })),
      // /socratic-night was an indexed SEO page for a format we retired in
      // favour of workshops and builder presentations. Permanent redirect so
      // existing inbound links and accumulated ranking land somewhere real.
      {
        source: "/socratic-night",
        destination: "/programs/zero-to-launch",
        permanent: true,
      },
      // Ship AI operates in Phoenix only now — Tempe was dropped as an
      // operating city, so its indexed meetup page redirects to Phoenix's.
      {
        source: "/ai-meetup-tempe",
        destination: "/ai-meetup-phoenix",
        permanent: true,
      },
      {
        source: "/hackathon/workshops/:path*",
        destination: "/programs/zero-to-launch/:path*",
        permanent: true,
      },
      {
        source: "/hackathon/skills",
        destination: "/programs/zero-to-launch/skills",
        permanent: true,
      },
      {
        source: "/hackathon/:path*",
        destination: "/programs/zero-to-launch/hackathon/:path*",
        permanent: true,
      },
      // The program shipped as "Day One" and was renamed to "Day Zero" the
      // same day. Short-lived URLs, but they were live and indexable, so the
      // old paths keep resolving. `:path*` matches zero segments too, which
      // covers the bare /programs/day-one.
      {
        source: "/programs/day-one/:path*",
        destination: "/programs/day-zero/:path*",
        permanent: true,
      },
      // Product Builder became The First Build before its first cohort.
      // Keep the original route working anywhere it was already shared.
      {
        source: "/programs/product-builder/product-builder-hackathon",
        destination: "/programs/the-first-build/first-build-hackathon",
        permanent: true,
      },
      {
        source: "/programs/product-builder/:path*",
        destination: "/programs/the-first-build/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
