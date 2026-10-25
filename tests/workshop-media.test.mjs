import { test } from "node:test";
import assert from "node:assert/strict";
import { validCoverBytes } from "../lib/workshop-media-validation.js";
test("rejects HTML or SVG masquerading as a cover", () => { const bytes = new TextEncoder().encode("<svg onload='alert(1)'></svg>"); for (const type of ["image/png","image/jpeg","image/webp","image/svg+xml"]) assert.equal(validCoverBytes(type, bytes), false); });
test("accepts the supported raster signatures and rejects mismatches", () => { const png = new Uint8Array([137,80,78,71,13,10,26,10,0]); const jpg = new Uint8Array([255,216,255,224]); const webp = new Uint8Array([82,73,70,70,0,0,0,0,87,69,66,80,0]); assert.equal(validCoverBytes("image/png",png),true); assert.equal(validCoverBytes("image/jpeg",jpg),true); assert.equal(validCoverBytes("image/webp",webp),true); assert.equal(validCoverBytes("image/jpeg",png),false); assert.equal(validCoverBytes("image/webp",jpg),false); });
