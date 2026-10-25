"use client";

import { useEffect, useRef } from "react";
import { currentMode, subscribeMode } from "../lib/mode";

const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]].map((r) => r.map((v) => (v + 0.5) / 16));
const RAMP = " .·:-=+*#%@";
const FRAME_MS = 80;
const NIGHT_SCENES = new Set(["voyage", "slipway", "launch"]);

const hash = (x, y) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

function inPoly(x, y, poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

const HULL = [[0, 4], [214, -6], [236, 0], [214, 28], [16, 28]];
const HOUSE = [[56, -2], [62, -24], [158, -24], [176, -4]];
const WHEEL = [[110, -24], [116, -40], [152, -40], [160, -24]];

function vessel(x, y, ox, oy, s) {
  const X = (x - ox) / s;
  const Y = (y - oy) / s;
  if (X < -6 || X > 250 || Y < -70 || Y > 34) return false;
  return (
    inPoly(X, Y, HULL) ||
    inPoly(X, Y, HOUSE) ||
    inPoly(X, Y, WHEEL) ||
    (X > 132 && X < 136 && Y > -64 && Y < -40) ||
    (X > 122 && X < 146 && Y > -58 && Y < -55)
  );
}

function rotated(x, y, ox, oy, a, s) {
  const dx = x - ox;
  const dy = y - oy;
  const X = dx * Math.cos(a) + dy * Math.sin(a);
  const Y = -dx * Math.sin(a) + dy * Math.cos(a);
  return vessel(X, Y, 0, 0, s);
}

function figure(x, y, fx, fy, s = 1) {
  const X = (x - fx) / s;
  const Y = (y - fy) / s;
  if (Y > 0 || Y < -48 || Math.abs(X) > 11) return false;
  if (Math.hypot(X, Y + 41) < 5.5) return true;
  if (Y > -34 && Y < -14 && Math.abs(X) < 6.5) return true;
  if (Y >= -14 && Y <= 0 && (Math.abs(X - 3.5) < 2.6 || Math.abs(X + 3.5) < 2.6)) return true;
  if (Y > -32 && Y < -16 && Math.abs(X) >= 6.5 && Math.abs(X) < 10) return true;
  return false;
}

function seg(x, y, x1, y1, x2, y2, w) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const L2 = dx * dx + dy * dy || 1;
  let u = ((x - x1) * dx + (y - y1) * dy) / L2;
  u = u < 0 ? 0 : u > 1 ? 1 : u;
  return Math.hypot(x - (x1 + u * dx), y - (y1 + u * dy)) <= w / 2;
}

function nightSky(x, y, t, H, hz, mx, my) {
  let d = 0.82 - 0.55 * Math.pow(y / hz, 1.8);
  const md = Math.hypot(x - mx, y - my);
  if (md < 34) return 0;
  d -= Math.max(0, 0.5 - md / 260);
  const h = hash(Math.floor(x / 6), Math.floor(y / 4));
  if (h > 0.985 && Math.sin(t * 1.6 + h * 40) > -0.4) return 0;
  return clamp(d);
}

function nightWater(x, y, t, H, hz, mx) {
  const dz = (y - hz) / (H - hz);
  let d = 0.5 + 0.28 * Math.sin(x * 0.012 * (1 + dz * 2.5) + t * 0.9 + 9 / (dz + 0.08)) + 0.12 * Math.sin(x * 0.05 + t * 2 + dz * 30);
  const path = Math.abs(x - mx) - (20 + dz * 160);
  if (path < 0) d -= 0.55 * (0.6 + 0.4 * Math.sin(y * 0.7 + t * 3 + x * 0.05));
  return clamp(d * (0.55 + dz * 0.55));
}

const SCENES = {
  voyage(x, y, t, H) {
    const hz = H * 0.6;
    if (vessel(x, y, 170, hz - 4 + Math.sin(t * 0.9) * 1.5, 1.05)) return 1;
    if (y < hz) return nightSky(x, y, t, H, hz, 1010, H * 0.2);
    let d = nightWater(x, y, t, H, hz, 1010);
    if (x < 172 && x > -80 && y > hz - 2 && y < hz + 6 + (172 - x) * 0.06) d -= 0.45;
    return clamp(d);
  },

  slipway(x, y, t, H) {
    const hz = H * 0.6;
    const shore = 640;
    const gy = hz - 14 + x * 0.03;
    const hx = 110;
    const hy = hz - 44;
    const hs = 1.25;
    if (vessel(x, y, hx, hy, hs)) return 1;
    for (const bx of [175, 265, 355]) if (Math.abs(x - bx) < 9 && y > hy + 27 * hs && y < gy + 2) return 1;
    for (const px of [84, 204, 324, 444]) if (Math.abs(x - px) < 3 && y > hz - 112 && y < gy) return 1;
    for (const ry of [hz - 72, hz - 104]) if (y > ry && y < ry + 4 && x > 78 && x < 450) return 1;
    if (figure(x, y, 300 + Math.sin(t * 0.6) * 1.5, hz - 104, 1)) return 1;
    if (figure(x, y, 500, gy, 1.1)) return 1;
    if (seg(x, y, 500, hz - 44, 440, hz - 60, 4)) return 1;
    if (x < shore && y > gy) {
      if (x > shore - 10) return 0.9;
      const plank = (y - gy) % 10;
      return plank < 2.4 ? 0.85 : 0.3;
    }
    if (y < hz) return nightSky(x, y, t, H, hz, 980, H * 0.22);
    return nightWater(x, y, t, H, hz, 980);
  },

  launch(x, y, t, H) {
    const hz = H * 0.62;
    const x1 = 70;
    const y1 = hz - 100;
    const x2 = 600;
    const y2 = hz + 36;
    const a = Math.atan2(y2 - y1, x2 - x1);
    const p = 0.52 + 0.04 * Math.sin(t * 0.35);
    const ox = x1 + (x2 - x1) * p;
    const oy = y1 + (y2 - y1) * p;
    if (rotated(x, y, ox, oy, a, 1.05)) return 1;
    if (seg(x, y, x1, y1 + 34, x2 + 60, y2 + 50, 5) || seg(x, y, x1, y1 + 46, x2 + 60, y2 + 62, 5)) return 1;
    for (const px of [120, 220, 320, 420]) {
      const ry = y1 + 46 + ((px - x1) / (x2 - x1)) * (y2 - y1);
      if (Math.abs(x - px) < 3 && y > ry && y < hz + 20 + (px - 120) * 0.08) return 1;
    }
    if (x < 230 && y > y1 - 10 && y < y1 - 4) return 1;
    for (const fx of [60, 110, 160, 200]) if (figure(x, y, fx, y1 - 10, 0.95)) return 1;
    const bowX = ox + 236 * 1.05 * Math.cos(a);
    const bowY = oy + 236 * 1.05 * Math.sin(a);
    if (bowY > hz - 6 && Math.hypot(x - bowX, y - bowY) < 60) {
      const h = hash(Math.floor(x / 6) + Math.floor(t * 4), Math.floor(y / 4));
      if (h > 0.55) return 0;
    }
    if (x < 230 && y > y1 - 4 && y < hz + 20) {
      const plank = (y - y1) % 10;
      return plank < 2.4 ? 0.8 : 0.3;
    }
    if (y < hz) return nightSky(x, y, t, H, hz, 1000, H * 0.2);
    return nightWater(x, y, t, H, hz, 1000);
  },

  workbench(x, y, t, H) {
    const ty = H * 0.56;
    const laptopBob = Math.sin(t * 0.5) * 0.5;
    if (x > 700 && x < 1010 && y > ty - 8 && y < ty) return 1;
    const sx1 = 724;
    const sx2 = 988;
    const sy1 = H * 0.2 + laptopBob;
    const sy2 = ty - 8;
    if (x > sx1 && x < sx2 && y > sy1 && y < sy2) {
      if (x < sx1 + 6 || x > sx2 - 6 || y < sy1 + 6 || y > sy2 - 6) return 1;
      const row = Math.floor((y - sy1 - 20) / 18);
      const inRow = (y - sy1 - 20) % 18 < 6;
      if (row >= 0 && row < 8 && inRow && x > sx1 + 22 && x < sx1 + 22 + [160, 120, 200, 90, 180, 60, 140, 110][row]) return 0.8;
      return 0.08;
    }
    if (x > 120 && x < 540 && y > ty + 30 && y < ty + 66) {
      if ((x - 120) % 20 < 3 && y < ty + 30 + ((x - 120) % 100 < 3 ? 22 : 12)) return 0.05;
      return 0.9;
    }
    const hx = 330;
    const hy = H * 0.3;
    if (Math.hypot(x - hx, y - hy) < 12) return Math.hypot(x - hx, y - hy) < 5 ? 0 : 1;
    const spread = 0.9 + 0.05 * Math.sin(t * 0.4);
    if (seg(x, y, hx, hy, hx - 60 * spread, ty + 24, 6) || seg(x, y, hx, hy, hx + 60 * spread, ty + 24, 6)) return 1;
    const cx = 620;
    const cy = ty + 50;
    const cd = Math.hypot(x - cx, y - cy);
    if (cd < 26) return cd > 20 || cd < 8 ? 1 : 0.15;
    if (x > cx && x < cx + 70 && Math.abs(y - cy) < 2.5) return 1;
    if (y > ty) {
      const grain = (x * 0.35 + y * 1.1 + Math.sin(x * 0.02) * 6) % 16;
      return grain < 1.8 ? 0.62 : 0.28;
    }
    const h = hash(Math.floor(x / 6), Math.floor(y / 4));
    return h > 0.992 ? 0.5 : 0.05;
  },

  harbor(x, y, t, H) {
    const hz = H * 0.58;
    const mx = 900;
    const my = H * 0.2;
    const boats = [[120, hz + 46, 0.85], [330, hz + 22, 0.7], [520, hz + 66, 1.1], [700, hz + 12, 0.55], [860, hz + 30, 0.62], [1040, hz + 54, 0.95]];
    for (const [ox, oy, s] of boats) {
      const bob = Math.sin(t * 0.8 + ox) * 1.5;
      if (vessel(x, y, ox, oy + bob, s)) return 1;
    }
    for (const [ox, oy, s] of boats) {
      const lx = ox + 134 * s;
      const ly = oy - 66 * s;
      if (Math.hypot(x - lx, y - ly) < 5 * s) return 1;
    }
    if (x < 190 && y > hz - 14 && y < hz - 6) return 0.95;
    for (const px of [20, 62, 104, 146, 184]) if (Math.abs(x - px) < 3 && y > hz - 6 && y < hz + 36) return 0.9;
    if (Math.abs(x - 170) < 2.5 && y > hz - 58 && y < hz - 14) return 1;
    if (Math.hypot(x - 170, y - hz - -62) < 7) return 1;
    if (y < hz) {
      const md = Math.hypot(x - mx, y - my);
      if (md < 30) return 1;
      const h = hash(Math.floor(x / 6), Math.floor(y / 4));
      if (h > 0.987) return 0.6 + 0.4 * Math.sin(t * 1.8 + h * 60);
      return md < 90 ? 0.18 - (md / 90) * 0.16 : 0.02;
    }
    const dz = (y - hz) / (H - hz);
    let d = 0.1 + 0.08 * Math.sin(x * 0.02 * (1 + dz * 2) + t * 0.8 + 6 / (dz + 0.1));
    if (Math.abs(x - mx) < 16 + dz * 140) d += 0.35 * (0.6 + 0.4 * Math.sin(y * 0.7 + t * 3 + x * 0.05));
    for (const [ox, oy, s] of boats) {
      const lx = ox + 134 * s;
      if (Math.abs(x - lx) < 4 && y > oy + 30 * s && y < oy + 30 * s + 70 * s) d += 0.6 * (0.5 + 0.5 * Math.sin(y * 0.6 + t * 2.5));
    }
    if (Math.abs(x - 170) < 4 && y > hz && y < hz + 70) d += 0.6 * (0.5 + 0.5 * Math.sin(y * 0.6 + t * 2.5));
    return clamp(d);
  },

  fleet(x, y, t, H) {
    const hz = H * 0.52;
    if (vessel(x, y, 60, hz + 70 + Math.sin(t) * 2, 2.2)) return 1;
    if (vessel(x, y, 640, hz + 22 + Math.sin(t * 1.2 + 1) * 1.5, 1.15)) return 1;
    if (vessel(x, y, 960, hz + 2 + Math.sin(t * 0.8 + 2), 0.62)) return 1;
    if (y < hz) return clamp(0.05 + 0.25 * Math.pow(y / hz, 4));
    const dz = (y - hz) / (H - hz);
    return clamp(0.18 + 0.22 * Math.sin(x * 0.015 * (1 + dz * 3) + t + 5 / (dz + 0.1)) * (0.4 + dz));
  },

  field(x, y, t) {
    const h = hash(Math.floor(x / 6), Math.floor(y / 4));
    if (h > 0.986) return 0.7 + 0.3 * Math.sin(t * 1.8 + h * 60);
    return h > 0.955 ? 0.28 : 0;
  },

  stars(x, y, t) {
    const h = hash(Math.floor(x / 8 + t * 0.3), Math.floor(y / 14));
    if (h > 0.975) return 0.6 + 0.4 * Math.sin(t * 2 + h * 50);
    if (h > 0.94) return 0.35;
    return 0;
  },

  swell(x, y, t, H) {
    return clamp(0.5 + 0.45 * Math.sin(x * 0.02 + t * 0.8 + Math.sin(y * 0.08 + t * 0.3) * 2) * (y / H));
  },
};

export const SCENE_NAMES = Object.keys(SCENES);

function frameWidth(scene, width) {
  return (scene === "voyage" || scene === "slipway" || scene === "launch") && width < 600 ? 760 : 1200;
}

export default function Scene({ scene, mode = "bars", cell, band = false, alt, className = "" }) {
  const ref = useRef(null);
  const [cw, ch] = cell ?? (mode === "ascii" ? [8, 14] : [6, 4]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const fn = SCENES[scene];
    if (!ctx || !fn) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let Hc = 0;
    let dpr = 1;
    let last = 0;
    let stamp = 0;
    let visible = true;
    let raf = 0;
    let disposed = false;

    const draw = (t) => {
      if (!W) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, Hc);
      ctx.fillStyle = getComputedStyle(canvas).color;
      const k = frameWidth(scene, W) / W;
      const H = Hc * k;
      const flip = NIGHT_SCENES.has(scene) && !band && currentMode() === "dark";
      if (mode === "ascii") {
        ctx.font = `12px ${getComputedStyle(canvas).fontFamily}`;
        ctx.textBaseline = "top";
      }
      for (let j = 0, y = 0; y < Hc; y += ch, j++) {
        for (let i = 0, x = 0; x < W; x += cw, i++) {
          const v0 = fn((x + cw / 2) * k, (y + ch / 2) * k, t, H);
          const v = flip ? Math.pow(1 - v0, 1.7) : v0;
          if (mode === "ascii") {
            const c = RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))];
            if (c !== " ") ctx.fillText(c, x, y);
          } else if (v > BAYER[j & 3][i & 3]) ctx.fillRect(x, y + 0.5, cw - 1.2, ch - 1.6);
        }
      }
    };
    const size = () => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width;
      Hc = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(Hc * dpr);
      draw(last);
    };
    const loop = (now) => {
      if (disposed) return;
      raf = requestAnimationFrame(loop);
      if (!visible || now - stamp < FRAME_MS) return;
      stamp = now;
      last = now / 1000;
      draw(last);
    };

    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    const io = new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }, { rootMargin: "80px" });
    io.observe(canvas);
    const unsubscribe = subscribeMode(() => draw(last));
    document.fonts?.ready?.then(() => { if (!disposed && mode === "ascii") draw(last); });
    const idle = window.requestIdleCallback ?? ((cb) => window.setTimeout(cb, 300));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(() => { if (!disposed && !reduce) raf = requestAnimationFrame(loop); });

    return () => {
      disposed = true;
      cancelIdle(handle);
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      unsubscribe();
    };
  }, [scene, mode, band, cw, ch]);

  return (
    <canvas
      ref={ref}
      className={`scene ${className}`.trim()}
      role={alt ? "img" : undefined}
      aria-label={alt}
      aria-hidden={alt ? undefined : true}
    />
  );
}
