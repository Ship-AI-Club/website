export const HACKATHON_PATH = '/programs/zero-to-launch/hackathon';
export const OPENING_DECK = `${HACKATHON_PATH}/opening/deck`;
export const TEAM_REGISTRATION = 'https://www.shipai.club/dashboard';

export const BREAKOUTS = [
  { number: 1, slug: 'positioning', time: '10:30–11:15 AM', title: 'Positioning & research', outcome: 'Know your customer, offer and pricing direction.', shareTitle: 'Positioning & Research — Breakout 1 | Ship AI', description: 'Start your AI organization with a Product Manager and Research bot. Clarify your customer, offer and pricing in this Zero to Launch workshop.' },
  { number: 2, slug: 'productization', time: '1:00–1:45 PM', title: 'Productize your site', outcome: 'Plan one useful experience for your visitors.', shareTitle: 'Productize Your Site — Breakout 2 | Ship AI', description: 'Work with Product Manager and Product Designer to turn your positioning into a useful visitor experience, clear copy and a build plan.' },
  { number: 3, slug: 'design-and-build', time: '2:15–3:00 PM', title: 'Design & build', outcome: 'Build, try it, and improve it with your bots.', shareTitle: 'Design & Build — Breakout 3 | Ship AI', description: 'Bring Product Manager, Product Designer and your engineers together to build and test a working site. Backend joins only when needed.' },
  { number: 4, slug: 'marketing', time: '3:45–4:30 PM', title: 'Create your marketing', outcome: 'Turn your approved site into a campaign draft.', shareTitle: 'Create Your Marketing — Breakout 4 | Ship AI', description: 'Set up Social Media Manager, Performance Marketer and two content creators. Turn your approved site into static and video creative for review.' },
].map(item => ({ ...item, href: `${HACKATHON_PATH}/breakouts/${item.slug}/deck` }));

export const SATURDAY_AGENDA = [
  { time: '9:00–9:30 AM', title: 'Welcome ceremony' },
  { time: '9:30–10:30 AM', title: 'Set up your team & prepare', work: true },
  { ...BREAKOUTS[0], duration: '45 min' },
  { time: '11:15 AM–12:00 PM', title: 'Work on your positioning', work: true },
  { time: '12:00–1:00 PM', title: 'Lunch', lunch: true },
  { ...BREAKOUTS[1], duration: '45 min' },
  { time: '1:45–2:15 PM', title: 'Work on your plan', work: true },
  { ...BREAKOUTS[2], duration: '45 min' },
  { time: '3:00–3:45 PM', title: 'Build with your team', work: true },
  { ...BREAKOUTS[3], duration: '45 min' },
  { time: '4:30–4:45 PM', title: 'Create, test & get feedback', work: true },
  { time: '4:45–5:00 PM', title: 'Save your work & wrap up' },
];

// Names and photos for the last three are from the public, database-backed judge roster.
export const OPENING_JUDGES = [
  { name: 'Dan Kite', photo: '/hackathon-opening/dan-kite.png' },
  { name: 'Santos Hernandez', photo: 'https://nhns5q7vlweke0ar.public.blob.vercel-storage.com/avatars/a4f16ea4-1faa-48e2-8217-8d497c66e4be/santos-profile-87AfTV8OdwNzGq9veGx5hs9gDefawu.png' },
  { name: 'Jon Schack', photo: 'https://nhns5q7vlweke0ar.public.blob.vercel-storage.com/avatars/f8668c13-ae5f-4885-bd92-7532261c750f/646cd43b-7a7b-430f-9639-c224a48f4f37-1_all_872-2u8DAhWQoUam2JftlnisbiUd9LzP7z.jpg' },
  { name: 'Raj Shah', photo: 'https://nhns5q7vlweke0ar.public.blob.vercel-storage.com/avatars/5e64fe05-f818-4a96-a34c-4c25de77d48c/raj-SpfPyHo8z3IKmz6ms8LeeZyPsOW5tN.jpg' },
];

export { HACKATHON_PRIZES as OPENING_PRIZES } from './hackathon.js';
