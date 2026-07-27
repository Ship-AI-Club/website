import { get } from "@vercel/blob";
import { INLINE_TYPES, parseIntakePath } from "../../../../lib/intake";
import { isAuthorized } from "../../../../lib/intake-auth";

/* The store is private, so uploaded files have no public URL. The inbox
   reads them through here instead, gated on the same key as the inbox
   page itself. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  if (!isAuthorized(searchParams.get("key"))) {
    return new Response("Not found", { status: 404 });
  }

  const pathname = searchParams.get("path");
  const parsed = parseIntakePath(pathname);
  if (!parsed) return new Response("Not found", { status: 404 });

  let blob;
  try {
    blob = await get(pathname, { access: "private" });
  } catch {
    return new Response("Not found", { status: 404 });
  }
  if (!blob || blob.statusCode !== 200) {
    return new Response("Not found", { status: 404 });
  }

  const contentType = blob.blob.contentType || "application/octet-stream";
  // SVG can carry script, so only raster images are allowed to render inline
  const inline = INLINE_TYPES.includes(contentType) && searchParams.get("dl") !== "1";

  return new Response(blob.stream, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(blob.blob.size),
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${parsed.file}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
