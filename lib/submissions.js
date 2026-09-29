import { LIMITS, safeUrl, text } from "./accounts.js";

export const SUBMISSION_CATEGORY = "Best Marketing Site";

// Shared by the public requirements, the entry form, and server validation.
export const SUBMISSION_FIELDS = [
  { key: "project", name: "Project name", required: true, limit: LIMITS.project,
    copy: "What your site or project is called." },
  { key: "live_url", name: "Live marketing site URL", required: true, url: true, limit: LIMITS.url,
    copy: "A working site anyone can open without signing in. Check it in a private window.", placeholder: "https://" },
  { key: "summary", name: "What the site is for", rows: 3, limit: LIMITS.summary,
    copy: "A short description of your product, audience, and what visitors can do on the site." },
  { key: "launch", name: "What you shipped", rows: 4, limit: LIMITS.launch,
    copy: "List the pages, features, and improvements you built during the weekend. Existing projects are welcome; tell us what changed." },
  { key: "receipts", name: "Receipts", required: true, rows: 5, limit: LIMITS.receipts,
    copy: "Show what you shipped with links to working pages and features, screenshots, a short demo, or before-and-after evidence. Traffic, signups, and revenue are not required." },
  { key: "repo_url", name: "Repository URL", url: true, limit: LIMITS.url,
    copy: "Optional. Share your code if you want to. You keep your IP.", placeholder: "https://github.com/…" },
];

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
  };
}

export function missingSubmissionFields(entry) {
  return SUBMISSION_FIELDS.filter((field) => field.required && !entry[field.key])
    .map((field) => field.name.toLowerCase());
}
