import { workshopMedia, workshopOgPath } from "./workshop-media";
import { titleCase } from "./title-case.js";
import { ogImage } from "./og.js";

const BASE = "https://www.shipai.club";
const IMAGE = ogImage({ kicker: "Workshops", title: "Hands-on AI workshops", key: "AI workshops", tagline: "Build a real project with expert guidance, in person in Phoenix." });

// Distinct search intent, stable URLs, and the same message on search/share surfaces.
export const WORKSHOP_SEO = {
  "build-your-first-agentic-workflow": { title: "Build Your First AI Workflow | Ship AI", description: "Build a small AI app, connect one tool, test the steps, and publish a preview." },
  "your-first-agent": { title: "Build Your First AI Agent | Ship AI", description: "Connect your email and build an AI agent that prepares responses for you to review." },
  "agentic-engineering": { title: "Build And Test Software With AI | Ship AI", description: "Use AI to build a feature, run tests, and check that it works before release." },
  "automate-social-media": { title: "Automate Your Social Media With AI | Ship AI", description: "Use AI to plan, write, review, and schedule content for your social media pages." },
  "agentic-lead-generation": { title: "Find And Research Sales Leads With AI | Ship AI", description: "Use AI to find sales leads, research companies and contacts, and add missing details. Build a useful lead list with expert help. $1,999; dates TBD." },
  "creatives-agentic-workflow": { title: "Create Images And Short Videos With AI | Ship AI", description: "Turn a clear brief into images and short video drafts that match your brand." },
  "ai-sales-gtm-team": { title: "Build Your Sales And Marketing Team With AI | Ship AI", description: "Connect customer records, draft follow-ups, and create sales sheets and pitch decks with AI." },
  "ai-customer-support-team": { title: "Build Your Customer Support Team With AI | Ship AI", description: "Build an AI support assistant that uses your company information and prepares responses for human review." },
  "ai-lead-magnets": { title: "Turn Website Visitors Into Leads With AI | Ship AI", description: "Build a useful AI website tool that gives visitors a result and captures interested leads." },
  "ai-lead-qualification": { title: "Check Customer Fit With AI | Ship AI", description: "Build an AI website assessment that checks customer fit and explains the next step." },
  "build-your-brand": { title: "Build Your Brand With AI | Ship AI", description: "Create design and writing rules that keep your website, emails, and content consistent." },
  "company-knowledge-engine": { title: "Find Company Answers With AI | Ship AI", description: "Build AI search that finds answers in company documents, shows sources, and checks access." },
  "ai-prototype-to-production": { title: "Test And Improve Your AI Systems | Ship AI", description: "Test AI answers, track errors, and add review and cost controls before release." },
  "ai-client-delivery-system": { title: "Deliver Client Projects With AI | Ship AI", description: "Use AI to organize client requests, prepare work for review, and keep clients informed." },
  "ai-business-intelligence-team": { title: "Build Business Reports And Dashboards With AI | Ship AI", description: "Build business reports and dashboards with AI, then check the results against your data." },
  "build-your-ai-software-factory": { title: "Build Your Software Factory With AI | Ship AI", description: "Connect Linear tasks to AI builds, tests, and code review with a reusable software process." },
};

export function workshopMetadata(workshop) {
  const seo = WORKSHOP_SEO[workshop.slug];
  return publicWorkshopMetadata({ slug: workshop.slug, title: seo.title, description: seo.description });
}

export async function publicWorkshopMetadata({ slug, title, description }) {
  title = titleCase(title);
  const url = `${BASE}/workshops${slug ? `/${slug}` : ""}`;
  const media = slug ? await workshopMedia(slug) : null;
  const shareImage = slug ? { url: workshopOgPath(slug, media.version), width: 1200, height: 630, alt: title.replace(" | Ship AI", "") } : IMAGE;
  return { title, description, alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", siteName: "Ship AI", images: [shareImage] },
    twitter: { card: "summary_large_image", title, description, images: [shareImage] },
  };
}

export function workshopBreadcrumbs(name, slug) {
  return { "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Ship AI", item: BASE },
    { "@type": "ListItem", position: 2, name: "AI Workshops", item: `${BASE}/workshops` },
    ...(slug ? [{ "@type": "ListItem", position: 3, name, item: `${BASE}/workshops/${slug}` }] : []),
  ] };
}

// Undated offerings describe courses, not scheduled events or bookable offers.
export function workshopCourseSchema(workshop) {
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "Course", "@id": `${BASE}/workshops/${workshop.slug}#course`, name: workshop.name,
      description: workshop.description, url: `${BASE}/workshops/${workshop.slug}`, image: `${BASE}${workshopOgPath(workshop.slug)}`,
      inLanguage: "en-US", isAccessibleForFree: false, coursePrerequisites: workshop.prerequisite,
      teaches: workshop.topics.map(topic => topic.title), ...(workshop.duration ? { timeRequired: `P${workshop.days || 2}D` } : {}),
      provider: { "@type": "Organization", name: "Ship AI", url: BASE },
    }, workshopBreadcrumbs(workshop.name, workshop.slug),
  ] };
}

export function workshopCatalogueSchema(workshops) {
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", "@id": `${BASE}/workshops#page`, name: "Ship AI Workshops", url: `${BASE}/workshops`,
      description: "Hands-on AI workshops for engineering, marketing, sales, support, knowledge, and business operations.",
      mainEntity: { "@type": "ItemList", numberOfItems: workshops.length, itemListElement: workshops.map((workshop,index) => ({ "@type": "ListItem", position: index + 1, name: workshop.name, url: `${BASE}/workshops/${workshop.slug}` })) },
    }, workshopBreadcrumbs("AI Workshops"),
  ] };
}
