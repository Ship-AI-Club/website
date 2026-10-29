import { ogImage } from './og.js';

const SITE = 'https://www.shipai.club';

export function hackathonDeckMetadata(title, description, path) {
  const url = `${SITE}${path}`;
  const image = ogImage({ kicker: 'Zero to Launch hackathon', title: title.replace(/ \| Ship AI$/, ''), meta: 'Workshop deck', alt: title });
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', siteName: 'Ship AI', images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  };
}
