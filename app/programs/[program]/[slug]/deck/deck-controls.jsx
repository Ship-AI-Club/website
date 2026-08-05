"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------
   Deck runtime: navigation, progress, and the cue for entrance motion.

   The deck works without this client layer: scroll snap, touch and print
   are native. These controls add projector-friendly keys, fullscreen,
   progress and active-slide animation cues.
------------------------------------------------------------------ */

export default function DeckControls({ total }) {
  const [current, setCurrent] = useState(1);
  const [full, setFull] = useState(false);
  const [idle, setIdle] = useState(false);
  const track = useRef(null);

  useEffect(() => {
    const root = document.querySelector(".dk-track");
    const slides = [...document.querySelectorAll(".dk-slide")];
    if (!root || !slides.length || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.classList.toggle("is-active", e.intersectionRatio > 0.5);
      },
      { root, threshold: [0, 0.5, 1] }
    );
    slides.forEach((slide) => io.observe(slide));
    const armed = requestAnimationFrame(() => root.classList.add("dk-motion"));

    return () => {
      cancelAnimationFrame(armed);
      root.classList.remove("dk-motion");
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    track.current = document.querySelector(".dk-track");
    const el = track.current;
    if (!el) return;

    const at = () => Math.round(el.scrollTop / el.clientHeight) + 1;
    const go = (n) => {
      const target = Math.min(Math.max(n, 1), total);
      el.scrollTo({ top: (target - 1) * el.clientHeight, behavior: "smooth" });
    };

    /* Fragments: a walkthrough slide advances through its own stages
       before the deck moves on. State lives on the slide element so it
       survives scrolling away and back. */
    const fragAt = (slide) => Number(slide?.dataset.frag || 0);
    const setFrag = (slide, k) => {
      slide.dataset.frag = k;
      for (const f of slide.querySelectorAll(".dk-frag")) {
        const i = Number(f.dataset.i);
        f.classList.toggle("is-on", i < k);
        f.classList.toggle("is-now", i === k - 1);
      }
      for (const f of slide.querySelectorAll(".dk-frag-detail")) {
        f.classList.toggle("is-now", Number(f.dataset.i) === k - 1);
      }
    };
    const fragged = [...document.querySelectorAll(".dk-slide[data-frags]")];
    for (const slide of fragged) setFrag(slide, 1);

    const next = () => {
      const cur = document.getElementById(`slide-${at()}`);
      const frags = Number(cur?.dataset.frags || 0);
      if (frags && fragAt(cur) < frags) setFrag(cur, fragAt(cur) + 1);
      else go(at() + 1);
    };
    const prev = () => {
      const cur = document.getElementById(`slide-${at()}`);
      const frags = Number(cur?.dataset.frags || 0);
      if (frags && fragAt(cur) > 1) setFrag(cur, fragAt(cur) - 1);
      else go(at() - 1);
    };

    /* a rail step is also a control: click (or tap) jumps the
       walkthrough straight to that stage */
    const onRailClick = (e) => {
      const step = e.target.closest?.(".dk-frag");
      const slide = e.target.closest?.(".dk-slide[data-frags]");
      if (step && slide) setFrag(slide, Number(step.dataset.i) + 1);
    };

    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault(); next(); break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault(); prev(); break;
        case "Home":
          e.preventDefault(); go(1); break;
        case "End":
          e.preventDefault(); go(total); break;
        case "f":
        case "F":
          e.preventDefault();
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen?.();
          break;
        default:
      }
    };

    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; setCurrent(at()); });
    };
    const onFull = () => setFull(Boolean(document.fullscreenElement));

    window.addEventListener("keydown", onKey);
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("click", onRailClick);
    document.addEventListener("fullscreenchange", onFull);
    return () => {
      window.removeEventListener("keydown", onKey);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("click", onRailClick);
      document.removeEventListener("fullscreenchange", onFull);
    };
  }, [total]);

  useEffect(() => {
    let timer;
    const wake = () => {
      setIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIdle(true), 3000);
    };
    wake();
    for (const event of ["mousemove", "keydown", "wheel", "touchstart"]) window.addEventListener(event, wake, { passive: true });
    return () => {
      clearTimeout(timer);
      for (const event of ["mousemove", "keydown", "wheel", "touchstart"]) window.removeEventListener(event, wake);
    };
  }, []);

  const go = (n) => {
    const el = track.current;
    if (!el) return;
    const target = Math.min(Math.max(n, 1), total);
    el.scrollTo({ top: (target - 1) * el.clientHeight, behavior: "smooth" });
  };

  return (
    <div className={`dk-ui${idle ? " is-idle" : ""}`}>
      <nav className="dk-rail" aria-label="Slides">
        {Array.from({ length: total }, (_, i) => (
          <button key={i} type="button" className={i + 1 === current ? "is-current" : i + 1 < current ? "is-seen" : undefined} onClick={() => go(i + 1)} aria-label={`Slide ${i + 1}`} aria-current={i + 1 === current ? "true" : undefined} />
        ))}
      </nav>
      <div className="dk-controls">
        <button type="button" onClick={() => go(current - 1)} aria-label="Previous slide">←</button>
        <span className="dk-controls-n">{String(current).padStart(2, "0")}<span>/{String(total).padStart(2, "0")}</span></span>
        <button type="button" onClick={() => go(current + 1)} aria-label="Next slide">→</button>
        <button type="button" className="dk-controls-full" onClick={() => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.()}>{full ? "Exit" : "Full"}</button>
      </div>
    </div>
  );
}
