export const ABOUT_SLIDE = {
  "title": "Who's hosting",
  "lead": "How you do anything is how you do everything.",
  "layout": "checklist",
  "diagram": "about",
  "about": {
    "photo": "/brand/santos-headshot-ship-ai.jpg",
    "name": "Santos Hernandez",
    "role": "Founder, Ship AI",
    "proofs": [
      {
        "v": "$25k+/mo",
        "l": "ggbucks, built with agents",
        "lit": true
      },
      {
        "v": "$0 to $12M",
        "l": "ARR at ZBD"
      },
      {
        "v": "EU first",
        "l": "MiCAR approval"
      }
    ],
    "orgs": [
      {
        "kicker": "THE COMMUNITY",
        "name": "Ship AI",
        "body": "Free workshops and talks in Phoenix.",
        "link": "shipai.club",
        "href": "https://www.shipai.club"
      },
      {
        "kicker": "THE STUDIO",
        "name": "Ship AI Studio",
        "body": "AI built into your business, in two weeks.",
        "link": "shipaistudio.com",
        "href": "https://www.shipaistudio.com"
      }
    ]
  }
};

export const JOIN_ROOM_SLIDE = {
  "title": "Join the room",
  "layout": "checklist",
  "diagram": "qr",
  "qr": "discord",
  "qrKicker": "SHIP AI DISCORD",
  "qrTitle": "Scan it now.",
  "qrEm": "Prompts later.",
  "qrCta": "Open the Discord invite"
};

export const PARTNER_SLIDE = {
  "title": "Our partner",
  "layout": "checklist",
  "diagram": "partner",
  "partnerLine": "Building Phoenix's AI community, together. Workuity hosts tonight, and we present Founder Weekend side by side.",
  "items": []
};

export const FOUNDER_WEEKEND_SLIDE = {
  "title": "Founder Weekend",
  "layout": "checklist",
  "diagram": "qr",
  "qr": "founder-weekend",
  "qrKicker": "FEB 6‑7, 2027 · FREE",
  "qrTitle": "One session down.",
  "qrEm": "Take a weekend.",
  "qrBody": "An Arizona AI hackathon. Teams of 1-4.",
  "qrCta": "See the hackathon"
};

export const COMMUNITY_CLOSE_SLIDE = {
  "title": "",
  "layout": "checklist",
  "diagram": "stage",
  "stage": {
    "scene": "harbor",
    "dark": true,
    "kicker": "SHIP AI DISCORD",
    "lines": [
      "Free and open."
    ],
    "em": "Build with us.",
    "qr": "discord",
    "qrLabel": "Scan to join"
  }
};

export function takeHomeSlide(slug) {
  return {
    title: "Take it home",
    layout: "checklist",
    diagram: "qr",
    qr: `talk-${slug}`,
    qrKicker: "THE TALK PAGE",
    qrTitle: "Every prompt,",
    qrEm: "and this deck.",
    qrCta: "Open the talk page",
  };
}

export const SERIES = [
  { n: 1, slug: "market-research", title: "Find the Customer" },
  { n: 2, slug: "claude-code-build-night", title: "Build the MVP" },
  { n: 3, slug: "digital-presence", title: "The Front Door" },
  { n: 4, slug: "gtm-engineering", title: "First Users" },
  { n: 5, slug: "pitch-night", title: "Pitch Night" },
];

export const WORKUITY = {
  venue: "Workuity Biltmore",
  address: "2390 E Camelback Rd Ste 130, Phoenix AZ 85016",
  parking: "Park in the surface lot.",
};
