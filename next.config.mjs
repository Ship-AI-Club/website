/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Two agents working the same checkout would otherwise both write
     .next and corrupt each other's build cache. Unset everywhere that
     matters, including Vercel, so the default stays ".next". */
  distDir: process.env.NEXT_DIST_DIR || ".next",

  async redirects() {
    return [
      // /socratic-night was an indexed SEO page for a format we retired in
      // favour of workshops and builder presentations. Permanent redirect so
      // existing inbound links and accumulated ranking land somewhere real.
      {
        source: "/socratic-night",
        destination: "/programs/zero-to-launch",
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
    ];
  },
};

export default nextConfig;
