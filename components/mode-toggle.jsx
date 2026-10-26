"use client";

import { useEffect, useState } from "react";
import { currentMode, setMode, subscribeMode } from "../lib/mode";

export default function ModeToggle() {
  const [mode, setState] = useState("light");
  useEffect(() => {
    const sync = () => setState(currentMode());
    sync();
    return subscribeMode(sync);
  }, []);
  const dark = mode === "dark";
  return (
    <button type="button" className="mode-toggle" role="switch" aria-checked={dark} aria-label="Dark mode" onClick={() => setMode(dark ? "light" : "dark")}>
      <svg className="mode-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M5.3 18.7 7 17M17 7l1.7-1.7" />
      </svg>
      <svg className="mode-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
      </svg>
    </button>
  );
}
