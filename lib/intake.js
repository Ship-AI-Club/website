/* ------------------------------------------------------------------
   Sponsor / mentor / judge intake — shared contract.

   The browser uploads files straight to Vercel Blob (client uploads,
   so the 4.5 MB serverless body limit never applies), then POSTs a
   JSON record naming those files. Both halves are validated against
   the constants here, so the client and the two route handlers agree
   on roles, paths, size caps and allowed types in exactly one place.

   Blob layout (store `shipai-intake`, private):

     intake/<role>/<submission-id>/record.json
     intake/<role>/<submission-id>/avatar-<file>
     intake/<role>/<submission-id>/logo-<file>
     intake/<role>/<submission-id>/asset-1-<file>
------------------------------------------------------------------ */

export const ROLES = [
  {
    id: "sponsor",
    label: "Sponsor",
    blurb: "Your logo goes on the site, the event pages and the announcements.",
  },
  {
    id: "mentor",
    label: "Mentor",
    blurb: "Saturday's 1:1 rotations. You're listed on the site with the teams you can help.",
  },
  {
    id: "judge",
    label: "Judge",
    blurb: "Sunday's pitches. You're listed on the site and you present an award.",
  },
];

export const ROLE_IDS = ROLES.map((r) => r.id);

export const BLOB_PREFIX = "intake/";
export const RECORD_FILE = "record.json";

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB — avatars and logos
export const MAX_ASSET_BYTES = 64 * 1024 * 1024; // 64 MB — brand kits, zips
export const MAX_ASSETS = 8;

export const IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
];

/* Brand kits arrive as zips, PDFs, .ai/.eps files and fonts. Anything the
   browser can't name lands as application/octet-stream, so that's allowed
   too — the size cap is the real guard, and nothing here is ever executed. */
export const ASSET_TYPES = [
  "image/*",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/postscript",
  "application/octet-stream",
  "font/*",
  "text/*",
];

/* Raster images are safe to render inline in the inbox. Everything else —
   SVG included, since it can carry script — is served as a download. */
export const INLINE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/gif",
];

export const FIELD_LIMITS = {
  name: 120,
  email: 160,
  title: 160,
  company: 160,
  note: 4000,
};

const SUBMISSION_ID_RE = /^\d{8}-\d{6}-[a-z0-9]{6}$/;
const SAFE_FILE_RE = /^[a-z0-9][a-z0-9._-]{0,120}$/;

/** Sortable, collision-resistant id: 20260727-161245-k3f9qa */
export function newSubmissionId(now = new Date()) {
  const p = (n, w = 2) => String(n).padStart(w, "0");
  const stamp =
    `${now.getFullYear()}${p(now.getMonth() + 1)}${p(now.getDate())}` +
    `-${p(now.getHours())}${p(now.getMinutes())}${p(now.getSeconds())}`;
  let rand = "";
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (const b of bytes) rand += alphabet[b % alphabet.length];
  return `${stamp}-${rand}`;
}

/** Lowercase, path-safe, extension-preserving. Never empty. */
export function safeFileName(name) {
  const cleaned = String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-.]+/, "")
    .slice(0, 100);
  return cleaned || "file";
}

export function blobPath({ role, id, kind, index, fileName }) {
  const prefix = kind === "asset" ? `asset-${index}` : kind;
  return `${BLOB_PREFIX}${role}/${id}/${prefix}-${safeFileName(fileName)}`;
}

export function recordPath({ role, id }) {
  return `${BLOB_PREFIX}${role}/${id}/${RECORD_FILE}`;
}

/**
 * Validates a blob pathname against the layout above. Returns null for
 * anything that doesn't fit — the upload route refuses to mint a token
 * for a path this rejects, so a client can't write outside its own folder.
 */
export function parseIntakePath(pathname) {
  const parts = String(pathname || "").split("/");
  if (parts.length !== 4) return null;

  const [root, role, id, file] = parts;
  if (root !== "intake") return null;
  if (!ROLE_IDS.includes(role)) return null;
  if (!SUBMISSION_ID_RE.test(id)) return null;
  if (!SAFE_FILE_RE.test(file)) return null;

  const kind =
    file === RECORD_FILE
      ? "record"
      : file.startsWith("avatar-")
        ? "avatar"
        : file.startsWith("logo-")
          ? "logo"
          : file.startsWith("asset-")
            ? "asset"
            : null;
  if (!kind) return null;

  return { role, id, file, kind };
}

export function isValidSubmissionId(id) {
  return SUBMISSION_ID_RE.test(String(id || ""));
}

export function formatBytes(bytes) {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
