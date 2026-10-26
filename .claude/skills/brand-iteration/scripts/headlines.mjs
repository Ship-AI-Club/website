import { createRequire } from "node:module";
import { join } from "node:path";
const { chromium, devices } = createRequire(join(process.cwd(), "index.js"))("@playwright/test");
const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const pages = ["/", ...process.argv.slice(2)];
const b = await chromium.launch({ channel: "chrome" });
const out = [];
for (const [vp, opts] of [["m", devices["iPhone 13"]], ["d", { viewport: { width: 1280, height: 900 } }]]) {
  const ctx = await b.newContext({ ...opts, colorScheme: "light", reducedMotion: "reduce" });
  const p = await ctx.newPage();
  for (const url of pages) {
    await p.goto(BASE + url, { waitUntil: "networkidle" });
    const r = await p.evaluate(() => {
      const res = { orphans: [], gaps: [], overflow: document.documentElement.scrollWidth > innerWidth + 1 };
      for (const h of document.querySelectorAll("main h1, main h2, main h3")) {
        if (!h.offsetParent) continue;
        const range = document.createRange(); range.selectNodeContents(h);
        const tops = [...new Set([...range.getClientRects()].filter(x => x.width > 2).map(x => Math.round(x.top)))];
        const lines = []; for (const t of tops) if (!lines.some(l => Math.abs(l - t) < 6)) lines.push(t);
        if (lines.length < 2) continue;
        const last = lines.sort((a, b) => a - b).at(-1);
        const words = [...range.getClientRects()].filter(x => Math.abs(Math.round(x.top) - last) < 6 && x.width > 2).reduce((s, x) => s + x.width, 0);
        const full = h.getBoundingClientRect().width;
        if (words / full < 0.28) res.orphans.push(`${h.tagName} "${h.textContent.trim().slice(0, 60)}" last line ${Math.round(words)}px of ${Math.round(full)}`);
      }
      const secs = [...document.querySelectorAll("main > section, main > div > section, main section.sap-sec, footer")].filter(s => s.offsetHeight > 0);
      const uniq = [...new Set(secs)].sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top).filter((s, i, arr) => !arr.some((o, j) => j !== i && o.contains(s)));
      const contentEdge = (s, bottom) => {
        const kids = [...s.querySelectorAll("*")].filter(e => { const st = getComputedStyle(e); const r = e.getBoundingClientRect(); return r.height > 0 && r.width > 0 && st.visibility !== "hidden" && !e.closest(".sap-scene,.sap-bg,[aria-hidden=true] canvas") && e.children.length === 0 && (e.textContent.trim() || ["IMG","SVG","CANVAS","INPUT","BUTTON","VIDEO"].includes(e.tagName)); });
        if (!kids.length) return null;
        return bottom ? Math.max(...kids.map(k => k.getBoundingClientRect().bottom)) : Math.min(...kids.map(k => k.getBoundingClientRect().top));
      };
      for (let i = 0; i < uniq.length - 1; i++) {
        const a = contentEdge(uniq[i], true), c = contentEdge(uniq[i + 1], false);
        if (a == null || c == null) continue;
        res.gaps.push({ gap: Math.round(c - a), from: (uniq[i].id || uniq[i].className || uniq[i].tagName).toString().slice(0, 40), to: (uniq[i + 1].id || uniq[i + 1].className || uniq[i + 1].tagName).toString().slice(0, 40) });
      }
      return res;
    });
    out.push({ vp, url, ...r });
  }
  await ctx.close();
}
await b.close();
for (const o of out) {
  const g = o.gaps.map(x => x.gap);
  const bad = o.gaps.filter(x => x.gap > (o.vp === "m" ? 190 : 280) || x.gap < (o.vp === "m" ? 40 : 60));
  if (!o.orphans.length && !bad.length && !o.overflow) continue;
  console.log(`\n[${o.vp}] ${o.url}${o.overflow ? " OVERFLOW" : ""}`);
  o.orphans.forEach(x => console.log("  orphan:", x));
  bad.forEach(x => console.log(`  gap ${x.gap}: ${x.from} -> ${x.to}`));
}
