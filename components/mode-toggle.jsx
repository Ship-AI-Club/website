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
    <button type="button" className="mode-toggle" aria-pressed={dark} onClick={() => setMode(dark ? "light" : "dark")}>
      {dark ? "Light mode" : "Dark mode"}
    </button>
  );
}
