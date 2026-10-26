import { createRequire } from "node:module";
import { join } from "node:path";
const { chromium, devices } = createRequire(join(process.cwd(), "index.js"))("@playwright/test");
const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const pages = process.argv[2].split(",");
const widths = (process.argv[3] || "390,1280").split(",").map(Number);
const base = BASE;
const browser = await chromium.launch({ channel: "chrome" });
const fn = (process_all) => {
  const out = { overflow: document.documentElement.scrollWidth, vw: window.innerWidth, issues: [] };
  const main = document.querySelector("main");
  if (!main) return out;
  const vis = (el) => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return cs.display !== "none" && cs.visibility !== "hidden" && r.width > 0 && r.height > 0; };
  const skip = (el) => el.closest("canvas,[aria-hidden='true'],.sr-only");
  const extent = (root) => {
    let top = Infinity, bottom = -Infinity;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      if (!n.textContent.trim()) continue;
      const p = n.parentElement; if (!p || !vis(p) || skip(p)) continue;
      const range = document.createRange(); range.selectNodeContents(n);
      for (const r of range.getClientRects()) { if (r.width < 1) continue; top = Math.min(top, r.top); bottom = Math.max(bottom, r.bottom); }
    }
    root.querySelectorAll("img,button,input,textarea,select,video,table,.sap-window,.sap-stat,.sap-split__stage,.sap-split__sticky").forEach((el) => {
      if (!vis(el) || skip(el)) return; const r = el.getBoundingClientRect();
      if (getComputedStyle(el).position === "absolute" && !el.closest(".sap-window")) return;
      top = Math.min(top, r.top); bottom = Math.max(bottom, r.bottom);
    });
    return { top, bottom };
  };
  const sy = window.scrollY;
  const label = (el) => (el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "") + (el.getAttribute("aria-label") ? `[${el.getAttribute("aria-label")}]` : ""));
  let blocks = [...main.children].filter(vis);
  if (blocks.length === 1) blocks = [...blocks[0].children].filter(vis);
  const ex = blocks.map((b) => ({ b, e: extent(b) })).filter((x) => isFinite(x.e.top));
  for (let i = 0; i < ex.length - 1; i++) {
    const gap = ex[i + 1].e.top - ex[i].e.bottom;
    if (!ex[i].b.matches(".sap-phero") && !ex[i + 1].b.querySelector(".sap-stage") && (process_all || gap < 24 || gap > 260)) out.issues.push({ kind: "section-gap", gap: Math.round(gap), a: label(ex[i].b), b: label(ex[i + 1].b) });
  }
  const containers = [...main.querySelectorAll(".sap-wrap, section > div, .sap-sec")].filter(vis);
  const seen = new Set();
  for (const c of containers) {
    const kids = [...c.children].filter((k) => vis(k) && getComputedStyle(k).position !== "absolute" && !["SCRIPT", "STYLE"].includes(k.tagName) && !k.matches("canvas"));
    for (let i = 0; i < kids.length - 1; i++) {
      const a = kids[i].getBoundingClientRect(), b = kids[i + 1].getBoundingClientRect();
      const gap = b.top - a.bottom;
      if (b.left > a.right - 2 || a.left > b.right - 2) continue;
      if (gap < 12 && Math.abs(b.top - a.top) > 4) {
        const key = label(kids[i]) + label(kids[i + 1]) + Math.round(gap);
        if (seen.has(key)) continue; seen.add(key);
        out.issues.push({ kind: "sibling-gap", gap: Math.round(gap), a: label(kids[i]), b: label(kids[i + 1]), inside: label(c), y: Math.round(a.bottom + sy) });
      }
      if (gap > 110 && !kids[i].querySelector('.sap-stage,.sap-pstage')) out.issues.push({ kind: 'inner-wide-gap', gap: Math.round(gap), a: label(kids[i]), b: label(kids[i + 1]), inside: label(c), y: Math.round(a.bottom + sy) });
      const wa = a.width, wb = b.width;
      if (Math.abs(wa - wb) > 24 && wa > 300 && wb > 300 && kids[i].matches(".sap-window,.sap-how,.sap-ruled,.sap-frames") ) out.issues.push({ kind: "width-mismatch", a: label(kids[i]) + ":" + Math.round(wa), b: label(kids[i + 1]) + ":" + Math.round(wb), inside: label(c) });
    }
  }
  document.querySelectorAll(".sap-pstage .sap-window, .vg-frame").forEach((w) => {
    const r = w.getBoundingClientRect();
    const st = w.closest(".sap-pstage") || w;
    let nxt = st.nextElementSibling;
    while (nxt && !vis(nxt)) nxt = nxt.nextElementSibling;
    if (nxt) { const e = extent(nxt); if (isFinite(e.top)) { const gap = e.top - r.bottom; if (gap < 40) out.issues.push({ kind: "window-vs-next", gap: Math.round(gap), next: label(nxt) }); } }
  });
  if (window.innerWidth < 800) document.querySelectorAll("main *").forEach((el) => { const r = el.getBoundingClientRect(); if (r.right > window.innerWidth + 1 && r.width > 0 && vis(el) && !el.closest(".sap-compare__wrap,canvas") && out.issues.length < 40) { const cs = getComputedStyle(el); if (cs.position !== "fixed") out.issues.push({ kind: "overflow-el", el: label(el), right: Math.round(r.right) }); } });
  return out;
};
let total = 0;
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 500 ? 844 : 900 }, reducedMotion: "reduce", deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: ".reveal,[data-reveal-prepared]{opacity:1!important;transform:none!important}" });
    await page.waitForTimeout(300);
    const r = await page.evaluate(fn, !!process.env.ALL);
    const bad = r.overflow !== r.vw || r.issues.length;
    if (bad) { total++; console.log(`\n== ${p} @${w}  scrollW=${r.overflow}/${r.vw}`); for (const i of r.issues) console.log("  ", JSON.stringify(i)); }
  }
  await ctx.close();
}
console.log("\npages with issues:", total);
await browser.close();
