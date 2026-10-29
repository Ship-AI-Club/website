import { LIMITS, safeUrl, text } from "./accounts.js";
import { invalidUrl } from "./submissions.js";

export const FW_CATEGORY = "Founder Weekend";

export const FW_SUBMISSION_FIELDS = [
  { key: "project", name: "Company name", required: true, limit: LIMITS.project,
    copy: "What your company is called. It goes on the certificate." },
  { key: "live_url", name: "Live product URL", required: true, url: true, limit: LIMITS.url,
    copy: "The working product judges will click. Check it in a private window, without signing in.", placeholder: "https://" },
  { key: "summary", name: "Your pitch", required: true, rows: 4, limit: LIMITS.summary,
    copy: "Who it's for, the problem, and why you win. Two or three sentences." },
  { key: "repo_url", name: "Repository URL", url: true, limit: LIMITS.url,
    copy: "Optional. Share your code if you want to. You keep your IP.", placeholder: "https://github.com/…" },
  { key: "deck_url", name: "Pitch deck URL", url: true, pitch: true, limit: LIMITS.url,
    copy: "Optional. Slides or a PDF anyone with the link can view.", placeholder: "https://" },
  { key: "marketing_url", name: "Marketing site URL", url: true, pitch: true, limit: LIMITS.url,
    copy: "Optional if it's the same as your product. Judges score the surface under go-to-market.", placeholder: "https://" },
  { key: "socials", name: "Socials", rows: 3, pitch: true, limit: 600,
    copy: "Optional. One link per line: X, LinkedIn, Instagram, TikTok, a launch post." },
];

export const FW_SUBMISSION_CHECKS = [
  "Open your product in a private window and check it works without your login.",
  "Rehearse the pitch out loud. Five minutes, and going over costs points.",
  "Have your numbers ready: market size, pricing, and any traction from the weekend.",
];

function value(field, formData) {
  const raw = formData.get(field.key);
  return field.url ? safeUrl(raw, field.limit) : text(raw, field.limit);
}

export function readFounderSubmission(formData) {
  const columns = FW_SUBMISSION_FIELDS.filter((f) => !f.pitch);
  const pitch = FW_SUBMISSION_FIELDS.filter((f) => f.pitch);
  return {
    ...Object.fromEntries(columns.map((f) => [f.key, value(f, formData)])),
    category: FW_CATEGORY,
    pitch: Object.fromEntries(pitch.map((f) => [f.key, value(f, formData)])),
  };
}

export function founderSubmissionValue(submission, key) {
  const field = FW_SUBMISSION_FIELDS.find((f) => f.key === key);
  return (field?.pitch ? submission?.pitch?.[key] : submission?.[key]) || "";
}

export function missingFounderFields(entry) {
  return FW_SUBMISSION_FIELDS.filter((f) => f.required && !entry[f.key]).map((f) => f.name.toLowerCase());
}

export function invalidFounderUrls(formData) {
  return FW_SUBMISSION_FIELDS.filter((f) => f.url && invalidUrl(text(formData.get(f.key), f.limit)));
}
