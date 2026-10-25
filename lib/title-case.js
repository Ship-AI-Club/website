// Proper-case display titles while preserving acronyms and apostrophes.
export function titleCase(value) {
  return String(value).replace(/(^|[\s\-–—/])(\p{L})/gu, (_, separator, letter) => separator + letter.toUpperCase());
}
