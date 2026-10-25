const SITE = 'https://www.shipai.club';

export function hackathonDeckMetadata(title, description, path) {
  const url = `${SITE}${path}`;
  const image = { url: '/ship-ai-social.jpg', width: 1280, height: 730, alt: title };
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', siteName: 'Ship AI', images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  };
}
