export const COVER_TYPES = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };
export function validCoverBytes(type, bytes) {
  if (type === "image/png") return bytes.length > 8 && [137,80,78,71,13,10,26,10].every((v,i) => bytes[i] === v);
  if (type === "image/jpeg") return bytes.length > 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (type === "image/webp") return bytes.length > 12 && [82,73,70,70].every((v,i) => bytes[i] === v) && [87,69,66,80].every((v,i) => bytes[i+8] === v);
  return false;
}
