/* ------------------------------------------------------------------
   Sponsorship — single source of truth.

   Tiers, the underwrite menu, the credits ladder and the hours track
   all live here. /programs/zero-to-launch/hackathon/sponsor renders the whole thing and the
   #sponsor section on /programs/zero-to-launch/hackathon renders TIERS alone, so a price
   changes in one place.

   Prices are what these actually cost us — the menu is published with
   the numbers on it deliberately. A sponsor should be able to pick
   what they want to fund and know the figure before they email.

   Tier is derived, never hand-written: an item's tier is the highest
   threshold its price clears (see tierFor). Stacking items adds up the
   same way, which is the whole mechanic — two Bronze items make Silver.
------------------------------------------------------------------ */

import { EVENT, DISCORD } from "./hackathon";

/* Where sponsor enquiries go. Deliberately the Discord and not a
   personal inbox — see the "Remove personal email from hackathon
   pages" commit. The emailed deck carries the address; the public
   page doesn't. */
export const SPONSOR_CONTACT = DISCORD;

export const TIERS = [
  {
    id: "platinum",
    name: "Platinum",
    sub: "Title",
    price: 10000,
    priceLabel: "$10,000",
    slots: "1 available",
    buys: 'The program carries your name: "Zero to Launch, presented by ___"',
    perks:
      'The title. "Zero to Launch, presented by ___" on the site, all seven event listings, the decks, the certifications and the trophies. Opening remarks Friday night and the Sunday awards stage, a 15-minute speaking segment at the session of your choice, a judging seat, a table at all seven events, co-byline on the press release, title card on the recap film, and first refusal on the next season at the same price.',
  },
  {
    id: "gold",
    name: "Gold",
    sub: "",
    price: 5000,
    priceLabel: "$5,000",
    slots: "4 available",
    buys: "Feed the weekend · the full video production · $5,000 in credits",
    perks:
      "Everything in Silver, plus: name a judged prize category and present that award on Sunday, a judging seat, a second mentor seat in Saturday's 1:1 rotations, logo and stage mention across all seven events, a table at any three sessions, and placement in the recap film.",
  },
  {
    id: "silver",
    name: "Silver",
    sub: "",
    price: 2500,
    priceLabel: "$2,500",
    slots: "8 available",
    buys: "Name a judged prize category · team stipends · the press release",
    perks:
      "Everything in Bronze, plus: stage credit at three sessions of your choosing, a table at the weekend, one mentor seat, and your name in the press release.",
  },
  {
    id: "bronze",
    name: "Bronze",
    sub: "",
    price: 1000,
    priceLabel: "$1,000",
    slots: "open",
    buys: "The Bell · the X account · every badge and sign",
    perks:
      "Logo and link on the site for the life of the pages, the named credit on whatever you funded, stage credit at the weekend and any two sessions, and a partner role in the Ship AI Discord.",
  },
];

/** Highest tier a dollar figure clears. Returns null below the floor. */
export function tierFor(amount) {
  return TIERS.find((t) => amount >= t.price) ?? null;
}

export function tierById(id) {
  return TIERS.find((t) => t.id === id) ?? null;
}

/* ------------------------------------------------------------------
   The menu.

   `price` is the number tierFor() reads. `priceLabel` is what renders,
   which is not always the same thing — items with several price points
   (food, video) show the range and take their tier from the entry
   point. `credit` is the named credit the money buys, and it's the
   reason this page isn't a wall of logos: every item says out loud
   what the sponsor's name ends up on.
------------------------------------------------------------------ */

export const MENU = [
  {
    id: "room",
    name: "The room",
    note: "Workuity Biltmore is the venue for all six meetups and the hackathon weekend, with Workuity credited as the venue sponsor.",
    items: [
      {
        name: "Feed the room",
        price: 500,
        priceLabel: "$500 one Wednesday · $3,000 all six · $5,000 the weekend",
        copy: "Dinner for 40. People stay for the whole session when they're fed — and the weekend runs Friday dinner through Sunday lunch, seven services.",
        credit:
          '"Dinner tonight is on ___" from stage; series and weekend sponsors credited on every session page and at every meal.',
      },
      {
        name: "Late Night",
        price: 500,
        priceLabel: "$500",
        copy: "Saturday, midnight. Pizza and caffeine for the teams still going.",
        credit: "The most memorable $500 on this list. Announced at midnight, photographed, posted.",
      },
      {
        name: "The Kit",
        price: 1000,
        priceLabel: "$1,000",
        copy: "Badges, lanyards, signage, printed schedules, power strips.",
        credit: "Your mark on every badge and every sign, at all seven events.",
      },
      {
        name: "The Badge",
        price: 2500,
        priceLabel: "$2,500",
        copy: "The thing every person in the room wears for three days, and the only sponsor placement that ends up in everyone else's photographs. One badge sponsor.",
        credit:
          "Your logo on the badge itself, alongside the title sponsor's and nobody else's. Silver placement everywhere else it applies.",
      },
      {
        name: "The Bell",
        price: 1000,
        priceLabel: "$1,000",
        copy: "A real ship's bell, engraved with your name. Teams ring it the moment their product ships. It stays with Ship AI and comes to every event after this one.",
        credit: "Permanent engraving. This one outlives the program.",
      },
    ],
  },
  {
    id: "signal",
    name: "The signal",
    note: "",
    items: [
      {
        name: "The X account",
        price: 1000,
        priceLabel: "$1,000",
        copy: "@shipaiclub — verified organization status and boosted reach on program posts, through the season.",
        credit:
          '"Powered by ___" in the account bio for the term, and on the program announcement posts.',
      },
      {
        name: "The LinkedIn page",
        price: 1000,
        priceLabel: "$1,000",
        copy: "Premium page plus sponsored posts targeted at Phoenix and Tempe tech.",
        credit: "Named on the page and in every sponsored post that runs.",
      },
      {
        name: "The calendar",
        price: 1000,
        priceLabel: "$1,000",
        copy: "Meetup Pro and Luma Plus for twelve months — listings, RSVPs, the reminder emails that get people through the door.",
        credit: "Credited on every event listing on both platforms, for a year.",
      },
      {
        name: "Paid reach",
        price: 2500,
        priceLabel: "$2,500",
        copy: "Ten weeks of paid acquisition across Phoenix and Tempe — the difference between 20 builders and 50.",
        credit: "Named in the campaign creative and credited with the turnout in the recap.",
      },
      {
        name: "Press release",
        price: 2500,
        priceLabel: "$2,500",
        copy: "Distributed to Arizona tech and business press before the program, and again after with the results.",
        credit: "Co-bylined. Your quote in the release.",
      },
    ],
  },
  {
    id: "record",
    name: "The record",
    note: "If it isn't captured, it happened to forty people. If it is, it happens to forty thousand.",
    items: [
      {
        name: "Photography",
        price: 1500,
        priceLabel: "$1,500 the six Wednesdays · $1,500 the weekend",
        copy: "Every session and the whole weekend, shot properly.",
        credit: "Credited on the photo sets and the permanent gallery — used for a year.",
      },
      {
        name: "Video",
        price: 1500,
        priceLabel: "Livestream $1,500 · Content Partner $2,500 · Production Partner $5,000",
        copy: "Livestream: Sunday's pitches, streamed and archived. Content Partner: thirty-plus vertical clips from the seven events, handed to teams to post from their own channels. Production Partner: the full build — sessions multicam'd and published, the weekend filmed, a recap film.",
        credit:
          "Named on the stream overlay; end card on every clip; title card on the film and a production credit on every published session.",
      },
      {
        name: "The Launch Wall",
        price: 500,
        priceLabel: "$500",
        copy: "A physical wall where every team writes its live URL and day-one numbers as they land. Photographed Sunday, then published to the site permanently.",
        credit: "Your header on the wall, in every photo of it, and on the page it becomes.",
      },
    ],
  },
  {
    id: "build",
    name: "The build",
    note: "",
    items: [
      {
        name: "Hosting & tooling in-kind",
        price: 2500,
        priceLabel: "in-kind",
        copy: "Deploys, domains, databases, analytics, email, payments, design — whatever gets a product publicly reachable.",
        credit: "Named in the template repo README and in the session where teams put it to work.",
      },
      {
        name: "Team stipends",
        price: 2500,
        priceLabel: "$2,500",
        copy: "$250 per registered team, toward the domain, the ad test, the paid tier they'd otherwise skip.",
        credit: '"Unblocked by ___" in the confirmation to every team that takes one.',
      },
    ],
  },
  {
    id: "stage",
    name: "The stage",
    note: "",
    items: [
      {
        name: "Name an award",
        price: 1500,
        priceLabel: "Judged categories $2,500 each · Crowd Favorite $1,500",
        copy: "Best B2C Launch · Best B2B Launch · Best Marketing Site · Best Growth Engine — or Crowd Favorite, the one the room votes on.",
        credit:
          '"The ___ Award for Best B2C Launch" — said out loud Sunday, engraved, on the site permanently. You present it; Crowd Favorite\'s sponsor announces the vote.',
      },
      {
        name: "Trophies & certifications",
        price: 1500,
        priceLabel: "$1,500 + $500",
        copy: "Five physical engraved awards, plus a certification at a permanent public URL for every team that submits.",
        credit:
          "Your name on the back plate of all five; footer credit on every certification, forever.",
      },
      {
        name: "The internship",
        price: 5000,
        priceLabel: "in-kind",
        copy: "A paid seat at your company, awarded as a prize — and you watch the winner work for ten weeks before you decide.",
        credit: "Named as Career Partner across the program. The best hiring channel on this list.",
      },
      {
        name: "Post-launch fund",
        price: 2000,
        priceLabel: "$2,000",
        copy: "$500 to each of the four category winners, conditional on keeping the growth engine running for 30 days past the weekend.",
        credit: "Named in the 30-day follow-up recap, where the real numbers land.",
      },
    ],
  },
];

/* ------------------------------------------------------------------
   Credits — the in-kind track that matters most, so it gets its own
   ladder rather than a line on the menu.
------------------------------------------------------------------ */

export const CREDITS = {
  lede: "Credits aren't a donation to an event — they're ten weeks of real usage by fifty builders choosing a stack for products they intend to keep running, then demoing the result on stage.",
  math: "$100 of credits × 50 builders = $5,000 of tier value, 50 activated accounts, and a public teardown of your product every other Wednesday.",
  distribution: `Credits go out as a baseline grant to every participant when the build window opens ${EVENT.buildOpensShort}, plus a larger tranche awarded as prizes on Oct 18.`,
  ladder: [
    { amount: "$1,000+", tier: "Bronze", note: "" },
    { amount: "$2,500+", tier: "Silver", note: "" },
    { amount: "$5,000+", tier: "Gold", note: "named Provider Partner, two available" },
    { amount: "$10,000+", tier: "Platinum", note: "eligible" },
  ],
  provider:
    "Provider Partner gets written into the .claude/skills/ setup files every participant runs — your platform named as the default path. Fifty builders following your quickstart, in order, with a deadline. Plus site, template-repo, and stage credit at every session.",
  platforms: [
    { group: "Deploy", names: "Vercel, Cloudflare, Railway" },
    { group: "Model access", names: "Anthropic, OpenAI, OpenRouter" },
    { group: "Build environments", names: "Replit, Cursor, v0" },
    { group: "Data", names: "Supabase, Neon, Turso" },
    { group: "The launch stack", names: "Stripe, PostHog, Resend" },
  ],
  openDoor:
    "Not on the list is not a no — if a builder can use it to get a product live, we want it.",
  credit:
    'Every credit sponsor is credited at the moment of the grant: "Your build credits are provided by ___," in the email that hands them over.',
};

/* ------------------------------------------------------------------
   Hours. Placement without a budget line — the reason a solo operator
   and a company sending three engineers both end up on the page.
------------------------------------------------------------------ */

export const HOURS = {
  lede: "Mentors, judges and guest teachers get the same placement a cash sponsor gets. No budget line required — individuals get name and face on the page, companies get the logo.",
  rate: "Donated hours are valued at a flat $150/hour, capped at the tier the hours reach.",
  roles: [
    {
      name: "Judge",
      commitment: "Sunday, ~1:00–4:30 PM",
      tier: "Bronze",
      copy: "3–5 founders and operators who can tell a real number from a vanity one.",
      credit: "Named and pictured on the judges section and from stage.",
    },
    {
      name: "Mentor",
      commitment: "4+ hours",
      tier: "Bronze",
      copy: "Saturday 1:1 rotations, Wednesday drop-ins, or async in Discord. 12+ hours, or three people from one company, is Silver.",
      credit: "Named and pictured on the mentors page. Teams credit their mentors in the Sunday pitch.",
    },
    {
      name: "Guest teacher",
      commitment: "One 20–30 minute session segment",
      tier: "Silver",
      copy: "On something you've actually done. Teaching, not selling — the highest-trust slot available.",
      credit: "Full Silver package, plus your name on that session's page and announcement.",
    },
    {
      name: "Craft in-kind",
      commitment: "Matched to value",
      tier: "",
      copy: "Trophy design, participant-terms review, AV, photography — all of it counts, at what it would have cost us.",
      credit: "Named for what you did.",
    },
  ],
};

/* Four steps, because the question every sponsor asks second is
   "what do you need from me". Step 3 is an invite link into the
   account flow — deliberately not published here, it gets sent once
   someone says yes. */
export const PROCESS = [
  {
    title: "Tell us what you want your name on",
    copy: "A tier, or the line items from the menu. A message in the Discord is enough.",
  },
  {
    title: "We confirm the number and the placements in writing",
    copy: "Including how we valued anything non-cash.",
  },
  {
    title: "We send you a private invite link",
    copy: "One link, one pass: sign in and add the company, the logo, and the name and title of whoever's being credited. It's the only asset request you'll get from us.",
  },
  {
    title: "You're on the site",
    copy: "And on everything the menu said you'd be on.",
  },
];

export const PROMISES = [
  "Logo and link on this page and all six session pages, for the life of the pages.",
  "Named in every announcement across X, LinkedIn, Discord, Meetup and Luma — seven events' worth over ten weeks.",
  "Named from stage at every session you sponsor, with the specific credit for what you funded.",
  "A photo and video recap, and a results recap — what shipped and what the numbers were, because that's what your sponsorship actually bought.",
];

export const NOT_SOLD =
  "No lead lists, no attendee data, no hard-sell slot, no resume book. Builders can tell the difference, and so can we. If you want the room's attention, mentor a team, teach a segment, or take the internship slot — all three work far better than a pitch would.";

export const VALUATION =
  "Everything non-cash counts toward a tier at what a builder would actually pay for it, not list price — credits at street rate, venue time at the room's published hourly, donated hours at a flat $150/hour. We'll tell you the number we're using before you commit, and it goes in writing.";

export const YEAR_ROUND = [
  {
    name: "Meetup Partner",
    price: "$1,000/month",
    copy: "Logo, stage mention and table at every Ship AI event that month.",
  },
  {
    name: "The Standby screen",
    price: "$1,000/year",
    copy: "The ASCII screen projected at every meetup carries your mark, all year.",
  },
  {
    name: "Speaker travel fund",
    price: "$2,000/quarter",
    copy: "One out-of-town speaker per quarter, named as the reason they're here.",
  },
  {
    name: "Season Partner",
    price: "$12,000/year",
    copy: "Everything above, Platinum status year-round, title treatment on the next program.",
  },
];
