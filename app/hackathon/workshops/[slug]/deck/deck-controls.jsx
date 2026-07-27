"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------
   Deck runtime: navigation, progress, and the cue for entrance motion.

   The deck works without any of this — it's a scroll-snap container, so
   trackpad, scrollbar and touch already move between slides, and the
   printed PDF doesn't care. This adds what a projector needs: arrows,
   space, home/end, F for fullscreen, a progress rail you can click, and
   an `is-active` class on the slide in view so its contents can animate
   in on arrival instead of all sixteen slides animating at load.
------------------------------------------------------------------ */

export default function DeckControls({ total }) {
  const [current, setCurrent] = useState(1);
  const [full, setFull] = useState(false);
  const [idle, setIdle] = useState(false);
  const track = useRef(null);

  /* Mark the slide in view so entrance animations fire on arrival.

     The `dk-motion` class is what arms the animations at all — the CSS
     keeps every slide fully visible until it's present. So if this
     effect never runs, or IntersectionObserver isn't available, the
     deck is a plain static deck rather than sixteen blank frames. */
  useEffect(() => {
    const root = document.querySelector(".dk-track");
    const slides = [...document.querySelectorAll(".dk-slide")];
    if (!root || !slides.length || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          e.target.classList.toggle("is-active", e.intersectionRatio > 0.5);
        }
      },
      { root, threshold: [0, 0.5, 1] }
    );
    slides.forEach((s) => io.observe(s));

    /* arm the animations only once the observer is live, and only after a
       frame, so the first slide animates in rather than snapping */
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

    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault();
          go(at() + 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          go(at() - 1);
          break;
        case "Home":
          e.preventDefault();
          go(1);
          break;
        case "End":
          e.preventDefault();
          go(total);
          break;
        case "f":
        case "F":
          e.preventDefault();
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen?.();
          break;
        default:
      }
    };

    /* rAF-throttled so a fast scroll doesn't set state every frame */
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        setCurrent(at());
      });
    };

    const onFull = () => setFull(Boolean(document.fullscreenElement));

    window.addEventListener("keydown", onKey);
    el.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("fullscreenchange", onFull);
    return () => {
      window.removeEventListener("keydown", onKey);
      el.removeEventListener("scroll", onScroll);
      document.removeEventListener("fullscreenchange", onFull);
    };
  }, [total]);

  /* fade the furniture out when nobody's touching anything — a deck on a
     projector shouldn't have a control pill glowing in the corner all night */
  useEffect(() => {
    let timer;
    const wake = () => {
      setIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIdle(true), 3000);
    };
    wake();
    for (const ev of ["mousemove", "keydown", "wheel", "touchstart"]) {
      window.addEventListener(ev, wake, { passive: true });
    }
    return () => {
      clearTimeout(timer);
      for (const ev of ["mousemove", "keydown", "wheel", "touchstart"]) {
        window.removeEventListener(ev, wake);
      }
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
          <button
            key={i}
            type="button"
            className={i + 1 === current ? "is-current" : i + 1 < current ? "is-seen" : undefined}
            onClick={() => go(i + 1)}
            aria-label={`Slide ${i + 1}`}
            aria-current={i + 1 === current ? "true" : undefined}
          />
        ))}
      </nav>

      <div className="dk-controls">
        <button type="button" onClick={() => go(current - 1)} aria-label="Previous slide">
          ←
        </button>
        <span className="dk-controls-n">
          {String(current).padStart(2, "0")}
          <span>/{String(total).padStart(2, "0")}</span>
        </span>
        <button type="button" onClick={() => go(current + 1)} aria-label="Next slide">
          →
        </button>
        <button
          type="button"
          className="dk-controls-full"
          onClick={() =>
            document.fullscreenElement
              ? document.exitFullscreen()
              : document.documentElement.requestFullscreen?.()
          }
        >
          {full ? "Exit" : "Full"}
        </button>
      </div>
    </div>
  );
}
