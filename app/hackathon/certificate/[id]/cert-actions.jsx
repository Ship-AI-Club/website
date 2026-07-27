"use client";

import { useState } from "react";
import { Check, Copy, Printer } from "lucide-react";

/* LinkedIn no longer prefills its add-certification form from a link,
   so the useful thing we can do is put the five fields it asks for one
   paste away. Copy, then paste into the form field by field — still
   beats retyping a credential URL from a screenshot.

   Print uses the stylesheet in awards.css, which strips everything but
   the plate — that's the save-as-PDF path people attach to
   applications. */
export default function CertActions({ fields }) {
  const [copied, setCopied] = useState(false);

  async function copyFields() {
    const text = fields.map(([label, value]) => `${label}: ${value}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked (insecure context, denied permission) — the
         same values are printed on the plate above, so there's nothing
         to recover from and nothing worth an error dialog */
    }
  }

  return (
    <>
      <button type="button" className="btn btn-ghost" onClick={copyFields}>
        {copied ? (
          <Check size={15} strokeWidth={1.75} aria-hidden="true" />
        ) : (
          <Copy size={15} strokeWidth={1.75} aria-hidden="true" />
        )}
        {copied ? "Copied" : "Copy credential details"}
      </button>
      <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
        <Printer size={15} strokeWidth={1.75} aria-hidden="true" />
        Print or save as PDF
      </button>
    </>
  );
}
