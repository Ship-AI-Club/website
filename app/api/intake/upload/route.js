import { handleUpload } from "@vercel/blob/client";
import {
  ASSET_TYPES,
  IMAGE_TYPES,
  MAX_ASSET_BYTES,
  MAX_IMAGE_BYTES,
  parseIntakePath,
} from "../../../../lib/intake";

/* Mints a short-lived, path-scoped upload token so the browser can PUT
   the file straight into the blob store. Nothing about the file passes
   through this function, which is the point: the 4.5 MB request body
   limit never applies and a 60 MB brand kit uploads fine. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const parsed = parseIntakePath(pathname);
        if (!parsed || parsed.kind === "record") {
          throw new Error("Refused: pathname outside the intake layout.");
        }

        const isAsset = parsed.kind === "asset";
        return {
          allowedContentTypes: isAsset ? ASSET_TYPES : IMAGE_TYPES,
          maximumSizeInBytes: isAsset ? MAX_ASSET_BYTES : MAX_IMAGE_BYTES,
          addRandomSuffix: false,
          // re-picking a file mid-form rewrites the same path
          allowOverwrite: true,
          validUntil: Date.now() + 60 * 60 * 1000,
          tokenPayload: JSON.stringify({ role: parsed.role, id: parsed.id }),
        };
      },
    });

    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error?.message || "Upload could not be authorized." },
      { status: 400 },
    );
  }
}
