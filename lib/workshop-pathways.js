export const WORKSHOP_PATHWAYS = [
  { id: "engineering", title: "From First Agent To Software Factory", description: "Start with a useful agent, move into code-based workflows, then develop the engineering and reliability skills for a delivery system.", slugs: ["your-first-agent", "build-your-first-agentic-workflow", "agentic-engineering", "ai-prototype-to-production", "build-your-ai-software-factory"] },
  { id: "launch", title: "From Brand To Lead Conversion", description: "Clarify your brand, build your public presence, give visitors useful value, and turn interested prospects into sales conversations.", slugs: ["build-your-brand", "vibe-coding-gtm", "ai-lead-magnets", "ai-lead-qualification", "ai-sales-gtm-team"] },
  { id: "creative", title: "From Brand To Content Pipeline", description: "Use a consistent brand foundation to produce campaign assets and build a repeatable publishing process.", slugs: ["build-your-brand", "creatives-agentic-workflow", "automate-social-media"] },
  { id: "revenue", title: "From Prospect Research To Sales Handoff", description: "Source and enrich prospects, evaluate fit, and connect qualified opportunities to a useful next sales action.", slugs: ["agentic-lead-generation", "ai-lead-qualification", "ai-sales-gtm-team"] },
  { id: "knowledge", title: "From Workflow To Company Intelligence", description: "Learn to build a workflow, ground answers in company knowledge, support customers, and report on the business.", slugs: ["build-your-first-agentic-workflow", "company-knowledge-engine", "ai-customer-support-team", "ai-business-intelligence-team"] },
  { id: "delivery", title: "From Workflow To Client Delivery", description: "Apply a reusable workflow to service delivery, then connect delivery activity to reporting and decisions.", slugs: ["build-your-first-agentic-workflow", "ai-client-delivery-system", "ai-business-intelligence-team"] },
  { id: "organization", title: "From First Workflow To AI Organization", description: "Build familiarity with agents and workflows before connecting AI opportunities across your organization.", slugs: ["your-first-agent", "build-your-first-agentic-workflow", "build-your-ai-organization"] },
];

const PRIMARY_PATH = {
  "your-first-agent": "engineering", "build-your-first-agentic-workflow": "engineering", "agentic-engineering": "engineering", "ai-prototype-to-production": "engineering", "build-your-ai-software-factory": "engineering",
  "build-your-brand": "launch", "vibe-coding-gtm": "launch", "ai-lead-magnets": "launch",
  "creatives-agentic-workflow": "creative", "automate-social-media": "creative",
  "agentic-lead-generation": "revenue", "ai-lead-qualification": "revenue", "ai-sales-gtm-team": "revenue",
  "company-knowledge-engine": "knowledge", "ai-customer-support-team": "knowledge", "ai-business-intelligence-team": "knowledge", "ai-client-delivery-system": "delivery", "build-your-ai-organization": "organization",
};

const RELATED = {
  "your-first-agent": ["build-your-brand", "ai-client-delivery-system"],
  "build-your-first-agentic-workflow": ["company-knowledge-engine", "ai-lead-magnets", "ai-client-delivery-system"],
  "agentic-engineering": ["build-your-first-agentic-workflow", "ai-lead-magnets"],
  "ai-prototype-to-production": ["company-knowledge-engine", "build-your-ai-software-factory"],
  "build-your-ai-software-factory": ["agentic-engineering", "ai-prototype-to-production", "ai-client-delivery-system"],
  "build-your-brand": ["creatives-agentic-workflow", "automate-social-media"],
  "vibe-coding-gtm": ["build-your-brand", "automate-social-media"],
  "ai-lead-magnets": ["build-your-first-agentic-workflow", "ai-lead-qualification"],
  "creatives-agentic-workflow": ["automate-social-media", "vibe-coding-gtm"],
  "automate-social-media": ["creatives-agentic-workflow", "ai-lead-magnets"],
  "agentic-lead-generation": ["ai-business-intelligence-team", "ai-sales-gtm-team"],
  "ai-lead-qualification": ["ai-lead-magnets", "agentic-lead-generation"],
  "ai-sales-gtm-team": ["ai-client-delivery-system", "ai-business-intelligence-team"],
  "company-knowledge-engine": ["ai-prototype-to-production", "ai-business-intelligence-team"],
  "ai-customer-support-team": ["company-knowledge-engine", "ai-client-delivery-system"],
  "ai-business-intelligence-team": ["ai-client-delivery-system", "ai-sales-gtm-team"],
  "ai-client-delivery-system": ["ai-sales-gtm-team", "ai-business-intelligence-team"],
  "build-your-ai-organization": ["ai-sales-gtm-team", "agentic-engineering", "ai-business-intelligence-team"],
};

export function pathwayFor(slug) {
  const path = WORKSHOP_PATHWAYS.find(item => item.id === PRIMARY_PATH[slug]);
  if (!path) return null;
  const index = path.slugs.indexOf(slug);
  return { ...path, previous: path.slugs[index - 1] || null, next: path.slugs[index + 1] || null, related: RELATED[slug] || [] };
}
