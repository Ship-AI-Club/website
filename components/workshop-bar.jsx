"use client";

import { useEffect, useState } from "react";

/* A slim bar that repeats the price and the action once the board has
   scrolled out of view. It only ever points back to the board, so the
   email field exists in one place. */
export default function WorkshopBar({ title, meta, targetId = "seat" }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const board = document.getElementById(targetId);
    if (!board) return;
    const watcher = new IntersectionObserver(([entry]) => {
      setShown(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    watcher.observe(board);
    return () => watcher.disconnect();
  }, [targetId]);

  function go(event) {
    event.preventDefault();
    const board = document.getElementById(targetId);
    if (!board) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    board.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    board.querySelector("input[type=email]")?.focus({ preventScroll: true });
  }

  return (
    <div className={shown ? "ws-bar is-shown" : "ws-bar"} aria-hidden={!shown}>
      <p><b>{title}</b><span>{meta}</span></p>
      <a className="btn btn-solid btn-sm" href={"#" + targetId} onClick={go} tabIndex={shown ? 0 : -1}>Get the date</a>
    </div>
  );
}
