export const VIBE_GTM = {
  name: "Build Your Website And Marketing Presence With AI",
  description: "Use AI to build a high-performing website and a stronger marketing presence. Learn how clear messaging, good design and SEO turn visitors into leads, and how to make your website and social pages say the same thing. Start fresh, improve what you have, or just come to learn, with hands-on help from Santos Hernandez and Raj Shah.",
  path: "/workshops/vibe-coding-gtm",
  start: "2026-10-10T09:00:00-07:00",
  end: "2026-10-10T13:00:00-07:00",
  promotionEnds: "2026-10-08T00:00:00-07:00",
  capacity: 10,
  instructorIds: [
    "a4f16ea4-1faa-48e2-8217-8d497c66e4be",
    "5e64fe05-f818-4a96-a34c-4c25de77d48c",
  ],
  venue: "Workuity Biltmore · Executive Room",
  address: "2390 E Camelback Rd, Suite 130, Phoenix, AZ 85016",
  registrationUrl: "/workshops/vibe-coding-gtm/checkout",
  stripeProductId: "prod_VMJ188wJlNoAbJ",
};

export function workshopPrice(now = new Date()) {
  const promotional = new Date(now).getTime() < new Date(VIBE_GTM.promotionEnds).getTime();
  return { promotional, amount: promotional ? 499 : 999, workuityAmount: promotional ? 249.5 : 499.5 };
}
