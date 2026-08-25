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
  c: "Founder and Lead Product Engineer building agentic AI systems. Founding product hire at ZBD — the money layer for games — $0 to $12M ARR, the EU's first MiCAR approval, and money transmitter licenses in 26 states and D.C. He started Ship AI to give Phoenix builders a room where you show the work, not talk about it.",
  img: "/santos.jpg",
  imgAlt: "Santos Hernandez",
  color: true,
};
