import sharp from "sharp";

const MAX_BYTES = 5 * 1024 * 1024;
// libvips reports AVIF as HEIF, its container format.
const RASTER_FORMATS = new Set(["png", "jpeg", "webp", "avif", "heif", "gif"]);

/** Decode remote images before handing them to the share-card renderer.
 * Missing or damaged profile photos should leave the facilitator's name
 * on the card, rather than failing the entire image response. */
export async function loadWorkshopOgImage(url, { width, height } = {}) {
  if (!url) return null;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5_000) });
    if (!response.ok) return null;
    if (Number(response.headers.get("content-length")) > MAX_BYTES) return null;
    const bytes = Buffer.from(await response.arrayBuffer());
    if (!bytes.length || bytes.length > MAX_BYTES) return null;

    const image = sharp(bytes, { limitInputPixels: 32_000_000 }).rotate();
    const metadata = await image.metadata();
    if (!RASTER_FORMATS.has(metadata.format)) return null;
    if (width || height) image.resize(width, height, { fit: "cover" });
    return await image.png().toBuffer();
  } catch (error) {
    console.warn("workshop og: skipping unavailable image", error.message);
    return null;
  }
}
