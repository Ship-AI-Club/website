import { text, safeUrl, LIMITS } from "./accounts.js";
import { normalizePitchBrand } from "./pitch-brand.js";

export const PITCH_PATH = "/programs/zero-to-launch/hackathon/pitch";
export const DEMO_PITCH = {
  project: "Porchlight Plant Care",
  summary: "We care for houseplants while Phoenix owners travel, with one-time visits that keep their plants healthy until they get home.",
  live_url: "",
  pitch: {
    brand: {accent:"#255C3B",background:"#F7F2E6",ink:"#17261C",headingFont:"Bricolage Grotesque",bodyFont:"Atkinson Hyperlegible Next",
      headingFontUrl:"/hackathon-pitch-demo/BricolageGrotesque-var.woff2",bodyFontUrl:"/hackathon-pitch-demo/AtkinsonHyperlegibleNext-var.woff2",
      logoUrl:"/hackathon-pitch-demo/porchlight-logo.svg",imageUrl:"/hackathon-pitch-demo/porchlight-hero.svg",imageAlt:"Indoor plants on a sunny window ledge from the Porchlight website",
      sourceUrl:"https://www.shipai.club/hackathon-opening/porchlight-marketing-site.png"},
    positioning: "Alternative: Ask a friend to water the plants, or arrange an ongoing service.\nDifference: A local plant specialist visits only when you need help.\nValue: Your plants get dependable care without an ongoing subscription.",
    icp: "Customer: Phoenix houseplant owners taking trips of a week or longer.\nProblem: Their plants need more attention than a last-minute favor can reliably provide.\nTrigger: A trip is booked, and they need a care plan before departure.",
    design: "Clarity: The opening message explains plant care during a trip.\nTrust: Visit details help owners understand what happens in their home.\nAction: A focused care planner gives visitors a clear next step.",
  },
  launch: "A marketing homepage, visit details, and a trip care planner.",
  receipts: "The website screenshot shows the fictional Porchlight workshop build. Replace this example with your team's working pages and evidence.",
};
export const DEMO_PITCH_TEAM = { name: "Porchlight team", members: [{ name: "Taylor Builder" }] };

export function pitchAnswerParts(answer) {
  return String(answer || "").split(/\n+/).map(part => part.trim()).filter(Boolean).map(part => {
    const match = part.match(/^(Alternative|Difference|Value|Customer|Problem|Trigger|Clarity|Trust|Action|Mobile|Visuals):\s*(.+)$/i);
    return match ? { label: match[1], body: match[2] } : { label: "", body: part };
  });
}
export const PITCH_STEPS = [
  { id: "business", title: "Who you are and what you do", seconds: 45, window: "0:00–0:45",
    prompt: "Introduce yourself and your team. Explain what your business does and the result you help customers achieve.",
    cue: "Keep the introduction to one or two sentences. Give the audience enough context to understand the rest of the pitch." },
  { id: "positioning", title: "Your strategic positioning", seconds: 60, window: "0:45–1:45",
    prompt: "Explain the alternative customers use today, what makes your offer different, and why that difference matters.",
    cue: "Name a real alternative, including doing it themselves. Connect your difference to a benefit the customer cares about." },
  { id: "icp", title: "Your ideal customer", seconds: 60, window: "1:45–2:45",
    prompt: "Describe one specific customer, their problem, and the moment they become ready to buy or sign up.",
    cue: "ICP means ideal customer profile. Pick the first customer you want to win. Explain how your message speaks to their situation." },
  { id: "website", title: "Your website and design choices", seconds: 135, window: "2:45–5:00",
    prompt: "Open your live site. Walk through the main visitor action and explain the design choices that support it.",
    cue: "Spend about 75 seconds on the live walkthrough, 30 on design decisions, and 30 on what you shipped and your closing sentence. Show the mobile layout if it helps. Use working pages or before-and-after evidence. Growth metrics are optional." },
];

// Only team-provided answers. Missing answers stay as prompts.
export function buildPitch(submission = {}, team = {}) {
  const pitch = submission?.pitch && typeof submission.pitch === "object" ? submission.pitch : {};
  const name = text(submission?.project, LIMITS.project) || "Your business name";
  const members = (team.members || []).map(member => text(member.name, LIMITS.name)).filter(Boolean);
  const answers = [submission?.summary, pitch.positioning, pitch.icp, pitch.design];
  return {
    name,
    team: members.join(", ") || text(team.name, LIMITS.team) || "Your name and team",
    liveUrl: safeUrl(submission?.live_url),
    brand: normalizePitchBrand(pitch.brand),
    slides: PITCH_STEPS.map((step, index) => ({
      ...step,
      answer: text(answers[index], index === 0 ? LIMITS.summary : 600),
    })),
    launch: text(submission?.launch, LIMITS.launch),
    receipts: text(submission?.receipts, LIMITS.receipts),
  };
}

export function pitchMarkdown(deck) {
  return [
    `# ${deck.name}\n\n${deck.team}\n\nZero to Launch · Five-minute pitch`,
    ...deck.slides.map((slide, index) => [
      `## ${index + 1}. ${slide.title} (${slide.window})`,
      slide.answer || `[${slide.prompt}]`,
      `Speaker notes: ${slide.cue}`,
      ...(slide.id === "website" ? [
        deck.liveUrl ? `Live site: ${deck.liveUrl}` : "[Add your live site URL]",
        deck.launch ? `What we shipped:\n${deck.launch}` : "",
        deck.receipts ? `Evidence:\n${deck.receipts}` : "",
      ] : []),
    ].filter(Boolean).join("\n\n")),
  ].join("\n\n");
}
