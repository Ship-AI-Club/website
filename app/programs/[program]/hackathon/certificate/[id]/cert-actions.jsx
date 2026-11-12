"use client";

import { useState } from "react";

/* The holder's tools, as quiet links under the certificate.

   LinkedIn no longer prefills its add-certification form from a link
   every time, so the useful thing we can do is put the five fields it
   asks for one paste away.

   Print uses the stylesheet in certificate.css, which strips everything
   but the plate: that's the save-as-PDF path people attach to
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
      /* clipboard blocked (insecure context, denied permission): the
         same values are printed on the plate above */
    }
  }

  return (
    <>
      <button type="button" className="cx-tool" onClick={copyFields}>
        <span aria-live="polite">{copied ? "Copied" : "Copy credential details"}</span>
      </button>
      <button type="button" className="cx-tool" onClick={() => window.print()}>
        Print or save as PDF
      </button>
    </>
  );
}
