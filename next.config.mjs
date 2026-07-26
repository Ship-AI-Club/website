/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // /socratic-night was an indexed SEO page for a format we retired in
      // favour of workshops and builder presentations. Permanent redirect so
      // existing inbound links and accumulated ranking land somewhere real.
      {
        source: "/socratic-night",
        destination: "/hackathon/workshops",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
