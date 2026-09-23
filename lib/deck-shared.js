/* ------------------------------------------------------------------
   Slides every live-night deck opens with, whatever the program.

   The same pair opens every session deck so a first-timer in week
   five gets the same footing as week one. Kept here rather than in
   decks.js so program deck files (dayzero-decks.js, …) can import
   them without a circular import through decks.js.
------------------------------------------------------------------ */

export const ABOUT_SLIDE = {
  kind: "statement",
  title: "What Ship AI is",
  text: "Builders showing each other the work.",
  tags: ["Builders & founders", "Phoenix", "Free, always"],
  note: "The best AI education isn't behind a paywall or on a stage — it's in the open, for free.",
};

export const HOST_SLIDE = {
  kind: "thanks",
  eyebrow: "Your host",
  title: "Santos Hernandez",
  tag: "Founder & Host",
  c: "Founder and Lead Product Engineer building agentic AI systems.",
  proofs: [
    { v: "$0→$12M", l: "ARR at ZBD" },
    { v: "EU #1", l: "MiCAR approval" },
    { v: "26 + D.C.", l: "money-transmitter licenses" },
  ],
  why: "Started Ship AI so Phoenix builders have a room to show the work.",
  img: "/santos.jpg",
  imgAlt: "Santos Hernandez",
  color: true,
};
