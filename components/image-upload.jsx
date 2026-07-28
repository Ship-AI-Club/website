"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

import { AVATAR_TYPES, MAX_AVATAR_BYTES, uploadPath } from "../lib/accounts";

/* ------------------------------------------------------------------
   Avatars and team logos.

   The file goes straight from the browser to Vercel Blob through a
   token minted by /api/uploads, so a photo off a phone never passes
   through a serverless function and the 4.5 MB body limit never
   applies. The route records the resulting URL itself, which is why
   there is no hidden field here carrying one — a URL posted by the
   client would be a URL the client could invent.

   Size and type are checked here for a fast, clear message, and
   again on the token route because this check is a convenience, not
   a control.
------------------------------------------------------------------ */

function initials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export default function ImageUpload({
  kind = "avatar",
  ownerId,
  currentUrl = "",
  name = "",
  label = "Photo",
  hint = "A face makes the roster feel like a room. Square works best.",
}) {
  const [url, setUrl] = useState(currentUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const input = useRef(null);

  async function pick(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");

    if (!AVATAR_TYPES.includes(file.type)) {
      setError("PNG, JPEG, WebP, AVIF or GIF.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setError(`That's ${(file.size / 1024 / 1024).toFixed(1)} MB — 5 MB is the cap.`);
      return;
    }

    setBusy(true);
    try {
      const blob = await upload(uploadPath({ kind, ownerId, fileName: file.name }), file, {
        access: "public",
        handleUploadUrl: "/api/uploads",
      });
      setUrl(blob.url);
    } catch (err) {
      setError(err?.message || "That upload didn't go through. Try again.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="ac-field">
      <span className="ac-label">
        {label} <span className="ac-opt">optional</span>
      </span>
      <p className="ac-hint">{hint}</p>

      <div className="ac-upload">
        <span className="ac-avatar" aria-hidden={url ? undefined : "true"}>
          {url ? <img src={url} alt="" /> : <b>{initials(name)}</b>}
        </span>

        <div className="ac-upload-body">
          <button
            type="button"
            className="btn btn-ghost ac-btn-sm"
            onClick={() => input.current?.click()}
            disabled={busy}
          >
            {busy ? "Uploading…" : url ? "Replace" : "Upload"}
          </button>
          {error ? (
            <span className="ac-fine" style={{ color: "#ff9d9d" }}>
              {error}
            </span>
          ) : (
            <span className="ac-fine">PNG, JPEG, WebP or GIF, up to 5 MB.</span>
          )}
        </div>

        <input
          ref={input}
          type="file"
          accept={AVATAR_TYPES.join(",")}
          onChange={pick}
          className="ac-hp"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}
