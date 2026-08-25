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
