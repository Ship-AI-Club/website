import { LIMITS, safeUrl, text } from "./accounts.js";
import { readPitchBrand } from "./pitch-brand.js";

export const SUBMISSION_CATEGORY = "Best Marketing Site";

// Shared by the public requirements, the entry form, and server validation.
export const SUBMISSION_FIELDS = [
  { key: "project", name: "Project name", required: true, limit: LIMITS.project,
    copy: "What your site or project is called." },
  { key: "live_url", name: "Live marketing site URL", required: true, url: true, limit: LIMITS.url,
    copy: "A working site anyone can open without signing in. Check it in a private window.", placeholder: "https://" },
  { key: "summary", name: "What your business does", rows: 3, limit: LIMITS.summary,
    copy: "In one or two sentences: what you offer, who you help, and the result you create." },
  { key: "launch", name: "What you shipped", rows: 4, limit: LIMITS.launch,
    copy: "List the pages, features, and improvements you built during the weekend. Existing projects are welcome; tell us what changed." },
  { key: "receipts", name: "Receipts", required: true, rows: 5, limit: LIMITS.receipts,
    copy: "Show what you shipped with links to working pages and features, screenshots, a short demo, or before-and-after evidence. Traffic, signups, and revenue are not required." },
  { key: "repo_url", name: "Repository URL", url: true, limit: LIMITS.url,
    copy: "Optional. Share your code if you want to. You keep your IP.", placeholder: "https://github.com/…" },
];

export const PITCH_FIELDS = [
  { key: "positioning", name: "Why customers choose you", rows: 3, limit: 600,
    copy: "What would customers use instead? What makes your offer different, and why does that matter?" },
  { key: "icp", name: "Your ideal customer", rows: 3, limit: 600,
    copy: "Be specific: who they are, the problem they face, and what makes them ready to act." },
  { key: "design", name: "Your approach to design", rows: 3, limit: 600,
    copy: "What should visitors do next? Explain one or two choices in your layout, copy, visuals, or mobile experience that help them get there." },
];

export const PITCH_OPTIONS = [
  { value: "later", label: "I'll prepare it later", copy: "Submit your project now. No deck needed to submit." },
  { value: "custom", label: "Use my own deck", copy: "Present with your existing slides. You can share a link below." },
  { value: "generated", label: "Generate a deck from my answers", copy: "Use our four-slide draft, with optional website branding." },
];

export const PITCH_DECK_FIELD = { key: "pitch_deck_url", name: "Your deck URL", url: true, limit: LIMITS.url,
  copy: "Optional. Link to your slides or PDF and allow anyone with the link to view it. Check the link in a private window.", placeholder: "https://" };

export function submissionPitchMode(pitch) {
  if (PITCH_OPTIONS.some(option => option.value === pitch?.mode)) return pitch.mode;
  if (pitch?.deck_url) return "custom";
  return PITCH_FIELDS.some(field => pitch?.[field.key]) || pitch?.brand ? "generated" : "later";
}

export function customPitchDeckUrl(pitch) {
  return submissionPitchMode(pitch) === "custom" ? safeUrl(pitch?.deck_url) : "";
}

export const SUBMISSION_CHECKS = [
  "Open your live site in a private window and check that it works without a login.",
  "Check the design and layout on desktop and mobile.",
  "Have your shipped pages, working features, and supporting evidence ready for your recorded pitch.",
];

export function readSubmission(formData) {
  return {
    ...Object.fromEntries(SUBMISSION_FIELDS.map((field) => [
      field.key,
      field.url ? safeUrl(formData.get(field.key), field.limit) : text(formData.get(field.key), field.limit),
    ])),
    category: SUBMISSION_CATEGORY,
    pitch: { ...Object.fromEntries(PITCH_FIELDS.filter(field => formData.has(field.key))
      .map((field) => [field.key, text(formData.get(field.key), field.limit)])),
      ...(formData.has("pitch_brand") ? {brand:readPitchBrand(formData.get("pitch_brand"))} : {}),
      ...(formData.has("pitch_mode") ? {mode:submissionPitchMode({mode:formData.get("pitch_mode")})} : {}),
      ...(formData.has(PITCH_DECK_FIELD.key) ? {deck_url:safeUrl(formData.get(PITCH_DECK_FIELD.key), PITCH_DECK_FIELD.limit)} : {}),
    },
  };
}

export function missingSubmissionFields(entry) {
  return SUBMISSION_FIELDS.filter((field) => field.required && !entry[field.key])
    .map((field) => field.name.toLowerCase());
}

export function invalidSubmissionUrls(formData) {
  const fields = [...SUBMISSION_FIELDS,
    ...(!formData.has("pitch_mode") || formData.get("pitch_mode") === "custom" ? [PITCH_DECK_FIELD] : [])];
  return fields.filter(field => field.url && invalidUrl(text(formData.get(field.key), field.limit)));
}

export function invalidUrl(raw) {
  if (!raw) return false;
  if (/\s/.test(raw) || (/^[a-z][a-z0-9+.-]*:/i.test(raw) && !/^https?:\/\//i.test(raw))) return true;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return !url.hostname || Boolean(url.username || url.password);
  } catch { return true; }
}
