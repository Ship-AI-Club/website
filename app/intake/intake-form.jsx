"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { CheckCircle2, Paperclip, Upload, X } from "lucide-react";
import {
  FIELD_LIMITS,
  MAX_ASSETS,
  MAX_ASSET_BYTES,
  MAX_IMAGE_BYTES,
  ROLES,
  blobPath,
  formatBytes,
  newSubmissionId,
} from "../../lib/intake";

const MULTIPART_ABOVE = 8 * 1024 * 1024;

const EMPTY = { name: "", email: "", title: "", company: "", note: "", website: "" };

function isImage(file) {
  return file && file.type.startsWith("image/");
}

/* ---------- one file, with a preview when it's an image ---------- */

function FileCard({ file, progress, onRemove }) {
  const preview = useMemo(
    () => (isImage(file) ? URL.createObjectURL(file) : null),
    [file],
  );

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="ik-file">
      <div className="ik-file-thumb">
        {preview ? (
          <img src={preview} alt="" />
        ) : (
          <Paperclip size={16} strokeWidth={1.75} aria-hidden="true" />
        )}
      </div>
      <div className="ik-file-meta">
        <p className="ik-file-name">{file.name}</p>
        <p className="ik-file-size">{formatBytes(file.size)}</p>
        {typeof progress === "number" && (
          <div className="ik-bar" role="presentation">
            <span style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
      {onRemove && (
        <button type="button" className="ik-file-x" onClick={onRemove}>
          <X size={15} strokeWidth={2} aria-hidden="true" />
          <span className="sr-only">Remove {file.name}</span>
        </button>
      )}
    </div>
  );
}

/* ---------- drop zone / picker ---------- */

function Dropzone({ id, label, hint, accept, multiple, files, progress, onFiles, onRemove, disabled }) {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);

  function handleDrop(event) {
    event.preventDefault();
    setOver(false);
    if (disabled) return;
    const dropped = Array.from(event.dataTransfer.files || []);
    if (dropped.length) onFiles(dropped);
  }

  return (
    <div className="ik-field">
      <label className="ik-label" htmlFor={id}>
        {label}
      </label>
      <p className="ik-hint" id={`${id}-hint`}>
        {hint}
      </p>

      <div
        className={`ik-drop${over ? " is-over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-describedby={`${id}-hint`}
          onChange={(e) => {
            const picked = Array.from(e.target.files || []);
            if (picked.length) onFiles(picked);
            e.target.value = "";
          }}
        />
        <Upload size={16} strokeWidth={1.75} aria-hidden="true" />
        <span>
          <button type="button" onClick={() => inputRef.current?.click()} disabled={disabled}>
            Choose {multiple ? "files" : "a file"}
          </button>{" "}
          or drop {multiple ? "them" : "it"} here
        </span>
      </div>

      {files.length > 0 && (
        <div className="ik-files">
          {files.map((file, i) => (
            <FileCard
              key={`${file.name}-${i}`}
              file={file}
              progress={progress[`${id}-${i}`]}
              onRemove={disabled ? null : () => onRemove(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- the form ---------- */

export default function IntakeForm() {
  const [role, setRole] = useState(ROLES[0].id);
  const [fields, setFields] = useState(EMPTY);
  const [avatar, setAvatar] = useState([]);
  const [logo, setLogo] = useState([]);
  const [assets, setAssets] = useState([]);
  const [progress, setProgress] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done
  const [error, setError] = useState("");

  const sending = status === "sending";
  const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

  function guard(files, { images, limit }) {
    for (const file of files) {
      if (images && !isImage(file)) {
        return `${file.name} isn't an image. PNG, JPG, WEBP or SVG.`;
      }
      if (file.size > limit) {
        return `${file.name} is ${formatBytes(file.size)} — the cap is ${formatBytes(limit)}.`;
      }
    }
    return "";
  }

  function accept(setter, files, opts, { multiple = false } = {}) {
    const problem = guard(files, opts);
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    setter((current) =>
      multiple ? [...current, ...files].slice(0, MAX_ASSETS) : files.slice(0, 1),
    );
  }

  async function send(event) {
    event.preventDefault();
    if (sending) return;

    if (!fields.name.trim() || !fields.email.trim() || !fields.title.trim()) {
      setError("Name, email and preferred title are required.");
      return;
    }

    setError("");
    setStatus("sending");
    setProgress({});

    const id = newSubmissionId();

    const queue = [
      ...avatar.map((file, i) => ({ file, kind: "avatar", key: `avatar-${i}` })),
      ...logo.map((file, i) => ({ file, kind: "logo", key: `logo-${i}` })),
      ...assets.map((file, i) => ({ file, kind: "asset", index: i + 1, key: `assets-${i}` })),
    ];

    try {
      const uploaded = [];
      for (const item of queue) {
        const result = await upload(
          blobPath({ role, id, kind: item.kind, index: item.index, fileName: item.file.name }),
          item.file,
          {
            access: "private",
            handleUploadUrl: "/api/intake/upload",
            contentType: item.file.type || undefined,
            multipart: item.file.size > MULTIPART_ABOVE,
            onUploadProgress: ({ percentage }) =>
              setProgress((p) => ({ ...p, [item.key]: Math.round(percentage) })),
          },
        );
        uploaded.push({
          kind: item.kind,
          pathname: result.pathname,
          name: item.file.name,
          size: item.file.size,
          contentType: item.file.type,
        });
      }

      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          id,
          ...fields,
          avatar: uploaded.find((u) => u.kind === "avatar") || null,
          logo: uploaded.find((u) => u.kind === "logo") || null,
          assets: uploaded.filter((u) => u.kind === "asset"),
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "That didn't go through.");

      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(err?.message || "That didn't go through. Try again in a moment.");
    }
  }

  if (status === "done") {
    return (
      <div className="ik-done">
        <CheckCircle2 size={22} strokeWidth={1.75} aria-hidden="true" />
        <h2>Got it.</h2>
        <p>
          Everything landed — details and files both. Santos picks these up by hand, so
          expect a reply from a person rather than an autoresponder. If something needs
          changing, send it again; the newer one wins.
        </p>
        <div className="cta-row">
          <a className="btn btn-ghost" href="/programs/zero-to-launch/hackathon">
            Back to the hackathon
          </a>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setFields(EMPTY);
              setAvatar([]);
              setLogo([]);
              setAssets([]);
              setProgress({});
              setStatus("idle");
            }}
          >
            Submit another
          </button>
        </div>
      </div>
    );
  }

  const activeRole = ROLES.find((r) => r.id === role);

  return (
    <form className="ik-form" onSubmit={send} noValidate>
      <fieldset className="ik-roles">
        <legend className="ik-label">You&apos;re here as</legend>
        <div className="ik-role-row">
          {ROLES.map((r) => (
            <label key={r.id} className={`ik-role${role === r.id ? " is-on" : ""}`}>
              <input
                type="radio"
                name="role"
                value={r.id}
                checked={role === r.id}
                disabled={sending}
                onChange={() => setRole(r.id)}
                className="sr-only"
              />
              {r.label}
            </label>
          ))}
        </div>
        <p className="ik-hint">{activeRole.blurb}</p>
      </fieldset>

      <div className="ik-field">
        <label className="ik-label" htmlFor="ik-name">
          Name <span className="ik-req">required</span>
        </label>
        <p className="ik-hint" id="ik-name-hint">
          Exactly as it should read on the site.
        </p>
        <input
          id="ik-name"
          type="text"
          autoComplete="name"
          maxLength={FIELD_LIMITS.name}
          value={fields.name}
          onChange={set("name")}
          disabled={sending}
          aria-describedby="ik-name-hint"
          required
        />
      </div>

      <div className="ik-field">
        <label className="ik-label" htmlFor="ik-email">
          Email <span className="ik-req">required</span>
        </label>
        <p className="ik-hint" id="ik-email-hint">
          Where the logistics go. Never published, never a list.
        </p>
        <input
          id="ik-email"
          type="email"
          autoComplete="email"
          maxLength={FIELD_LIMITS.email}
          value={fields.email}
          onChange={set("email")}
          disabled={sending}
          aria-describedby="ik-email-hint"
          required
        />
      </div>

      <div className="ik-field">
        <label className="ik-label" htmlFor="ik-title">
          Preferred title <span className="ik-req">required</span>
        </label>
        <p className="ik-hint" id="ik-title-hint">
          The one line under your name — &ldquo;Founder, Acme&rdquo; or &ldquo;VP Engineering,
          CEI Gateway&rdquo;. Your call, not ours.
        </p>
        <input
          id="ik-title"
          type="text"
          maxLength={FIELD_LIMITS.title}
          value={fields.title}
          onChange={set("title")}
          disabled={sending}
          aria-describedby="ik-title-hint"
          required
        />
      </div>

      <Dropzone
        id="avatar"
        label="Preferred avatar"
        hint="The headshot that runs next to your name. Square, 400×400 or bigger, PNG or JPG. A cropped conference photo is fine — it doesn't need a studio."
        accept="image/*"
        files={avatar}
        progress={progress}
        disabled={sending}
        onFiles={(files) => accept(setAvatar, files, { images: true, limit: MAX_IMAGE_BYTES })}
        onRemove={() => setAvatar([])}
      />

      <div className="ik-field">
        <label className="ik-label" htmlFor="ik-company">
          Company name
        </label>
        <p className="ik-hint" id="ik-company-hint">
          As it should appear in print. Skip it if you&apos;re here as yourself.
        </p>
        <input
          id="ik-company"
          type="text"
          autoComplete="organization"
          maxLength={FIELD_LIMITS.company}
          value={fields.company}
          onChange={set("company")}
          disabled={sending}
          aria-describedby="ik-company-hint"
        />
      </div>

      <Dropzone
        id="logo"
        label="Company logo"
        hint="SVG if you have it — it stays sharp everywhere we use it. Otherwise PNG with a transparent background, 1000px wide or more. The site is black, so send the light-on-dark version if one exists."
        accept="image/*"
        files={logo}
        progress={progress}
        disabled={sending}
        onFiles={(files) => accept(setLogo, files, { images: true, limit: MAX_IMAGE_BYTES })}
        onRemove={() => setLogo([])}
      />

      <Dropzone
        id="assets"
        label="Any other brand assets"
        hint={`Wordmark variants, an icon-only mark, brand guidelines, the hex codes you care about — anything that stops us guessing. Zip it if that's easier. Up to ${MAX_ASSETS} files, ${formatBytes(MAX_ASSET_BYTES)} each.`}
        multiple
        files={assets}
        progress={progress}
        disabled={sending}
        onFiles={(files) =>
          accept(setAssets, files, { images: false, limit: MAX_ASSET_BYTES }, { multiple: true })
        }
        onRemove={(i) => setAssets((current) => current.filter((_, n) => n !== i))}
      />

      <div className="ik-field">
        <label className="ik-label" htmlFor="ik-note">
          Anything else
        </label>
        <p className="ik-hint" id="ik-note-hint">
          The tier you&apos;re weighing, the Saturday block you can actually make, what you
          want to judge, someone to cc, a constraint we should know about. Or nothing.
        </p>
        <textarea
          id="ik-note"
          rows={6}
          maxLength={FIELD_LIMITS.note}
          value={fields.note}
          onChange={set("note")}
          disabled={sending}
          aria-describedby="ik-note-hint"
        />
      </div>

      {/* honeypot — hidden from people, irresistible to bots */}
      <div className="ik-hp" aria-hidden="true">
        <label htmlFor="ik-website">Website</label>
        <input
          id="ik-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={fields.website}
          onChange={set("website")}
        />
      </div>

      <div className="ik-submit">
        <button type="submit" className="btn btn-solid" disabled={sending}>
          {sending ? "Sending…" : "Send it"}
        </button>
        <p className="ik-status" role="status" aria-live="polite">
          {sending
            ? "Uploading — keep this tab open."
            : "Files upload straight to private storage. Nothing here is published until you see it on the site."}
        </p>
      </div>

      {error && (
        <p className="ik-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
