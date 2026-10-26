"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

export default function ShareActions({ url, text }) {
  const [copied, setCopied] = useState(false);
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const x = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="rs-share">
      <a className="btn btn-solid" href={linkedin} target="_blank" rel="noreferrer">
        Share on LinkedIn
      </a>
      <a className="btn btn-ghost" href={x} target="_blank" rel="noreferrer">
        Share on X
      </a>
      <button type="button" className="btn btn-ghost" onClick={copy}>
        {copied ? (
          <Check size={15} strokeWidth={1.75} aria-hidden="true" />
        ) : (
          <Link2 size={15} strokeWidth={1.75} aria-hidden="true" />
        )}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
