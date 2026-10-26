import { createRequire } from "node:module";
import { join } from "node:path";
const { chromium, devices } = createRequire(join(process.cwd(), "index.js"))("@playwright/test");
const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const pages = process.argv[2].split(","); const widths = process.argv[3].split(",").map(Number);
const b = await chromium.launch({ channel: "chrome" });
for (const w of widths) {
  const c = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
  const pg = await c.newPage();
  for (const p of pages) {
    await pg.goto(BASE + p, { waitUntil: "networkidle" });
    const r = await pg.evaluate(() => {
      const out = [];
      document.querySelectorAll("main *").forEach((el) => {
        const cs = getComputedStyle(el);
        const boxed = (parseFloat(cs.borderLeftWidth) > 0 && cs.borderLeftStyle !== "none") || (parseFloat(cs.borderRightWidth) > 0 && cs.borderRightStyle !== "none") || (cs.backgroundColor !== "rgba(0, 0, 0, 0)" && el.tagName !== "BODY");
        if (!boxed) return;
        const r = el.getBoundingClientRect(); if (r.width < 60 || r.height < 20) return;
        if (el.closest("canvas,[aria-hidden='true'],button,a,.sap-tag,.sap-chip,.sap-btn,input,select,textarea,label,.sap-pill")) return;
        for (const n of el.childNodes) {
          if (n.nodeType !== 3 || !n.textContent.trim()) continue;
          const rg = document.createRange(); rg.selectNodeContents(n);
          for (const t of rg.getClientRects()) {
            if (t.width < 4) continue;
            const l = t.left - r.left, rt = r.right - t.right;
            if ((l < 10 && (parseFloat(cs.borderLeftWidth) > 0 || cs.backgroundColor !== "rgba(0, 0, 0, 0)")) || (rt < 10 && rt > -1000 && (parseFloat(cs.borderRightWidth) > 0 || cs.backgroundColor !== "rgba(0, 0, 0, 0)"))) { out.push(`${el.tagName.toLowerCase()}.${String(el.className).split(" ").slice(0,2).join(".")} l=${Math.round(l)} r=${Math.round(rt)} "${n.textContent.trim().slice(0,30)}"`); return; }
          }
        }
      });
      return out.slice(0, 12);
    });
    if (r.length) { console.log("== " + p + " @" + w); r.forEach((x) => console.log("  " + x)); }
  }
  await c.close();
}
await b.close();
