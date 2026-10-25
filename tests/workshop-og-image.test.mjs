import { test, mock } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { loadWorkshopOgImage } from "../lib/workshop-og-image.js";

const URL = "https://images.example.test/avatar";

test("unavailable photos do not fail workshop cards", async t => {
  for (const status of [403, 404, 503]) {
    await t.test(`HTTP ${status}`, async () => {
      const fetch = mock.method(globalThis, "fetch", async () => new Response("Not an image", { status }));
      try { assert.equal(await loadWorkshopOgImage(URL), null); }
      finally { fetch.mock.restore(); }
    });
  }
  await t.test("network failure", async () => {
    const fetch = mock.method(globalThis, "fetch", async () => { throw new Error("Connection failed"); });
    try { assert.equal(await loadWorkshopOgImage(URL), null); }
    finally { fetch.mock.restore(); }
  });
});

test("HTML and truncated PNG responses are skipped even with an image MIME type", async () => {
  const png = await sharp({ create: { width: 20, height: 20, channels: 3, background: "red" } }).png().toBuffer();
  for (const bytes of [Buffer.from("<html>CDN unavailable</html>"), png.subarray(0, 32)]) {
    const fetch = mock.method(globalThis, "fetch", async () => new Response(bytes, { headers: { "content-type": "image/png" } }));
    try { assert.equal(await loadWorkshopOgImage(URL), null); }
    finally { fetch.mock.restore(); }
  }
});

test("uploaded image formats become complete PNGs with the requested avatar crop", async () => {
  for (const format of ["png", "jpeg", "webp", "avif", "gif"]) {
    const bytes = await sharp({ create: { width: 80, height: 40, channels: 3, background: "blue" } }).toFormat(format).toBuffer();
    const fetch = mock.method(globalThis, "fetch", async () => new Response(bytes));
    try {
      const result = await loadWorkshopOgImage(URL, { width: 164, height: 164 });
      const metadata = await sharp(result).metadata();
      assert.equal(metadata.format, "png");
      assert.equal(metadata.width, 164);
      assert.equal(metadata.height, 164);
      await sharp(result).raw().toBuffer();
    } finally { fetch.mock.restore(); }
  }
});

test("cover images retain their original dimensions", async () => {
  const bytes = await sharp({ create: { width: 1200, height: 630, channels: 3, background: "white" } }).webp().toBuffer();
  const fetch = mock.method(globalThis, "fetch", async () => new Response(bytes));
  try {
    const metadata = await sharp(await loadWorkshopOgImage(URL)).metadata();
    assert.equal(metadata.width, 1200);
    assert.equal(metadata.height, 630);
  } finally { fetch.mock.restore(); }
});

test("empty and oversized responses are skipped", async () => {
  for (const response of [new Response(null), new Response("large", { headers: { "content-length": String(6 * 1024 * 1024) } })]) {
    const fetch = mock.method(globalThis, "fetch", async () => response);
    try { assert.equal(await loadWorkshopOgImage(URL), null); }
    finally { fetch.mock.restore(); }
  }
});
