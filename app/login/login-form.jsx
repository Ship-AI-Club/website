"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Mail } from "lucide-react";

import { signInAction } from "./actions";

/* ------------------------------------------------------------------
   Two steps, one action, one piece of state.

   Step is server-owned: the action returns { step } and the form
   renders whichever half that names. It means a failed code attempt
   comes back on the code screen with the email intact, and a page
   refresh can't strand you on a step whose context is gone.
------------------------------------------------------------------ */

function Submit({ children, ...rest }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-solid" disabled={pending} {...rest}>
      {pending ? "One second…" : children}
    </button>
  );
}

export default function LoginForm({ next }) {
  const [state, action] = useActionState(signInAction, { step: "email", email: "", next });
  const codeRef = useRef(null);

  /* Land the cursor in the code box the moment the step flips —
     the user is coming back from their email client and shouldn't
     have to find the field. */
  useEffect(() => {
    if (state.step === "code") codeRef.current?.focus();
  }, [state.step]);

  return (
    <form action={action} className="ac-form is-tight">
      <input type="hidden" name="next" value={state.next || next} />

      {state.error && (
        <p className="ac-error" role="alert">
          {state.error}
        </p>
      )}

      {state.step === "code" ? (
        <>
          {state.notice && <p className="ac-ok">{state.notice}</p>}

          <input type="hidden" name="email" value={state.email} />

          <div className="ac-field">
            <label className="ac-label" htmlFor="code">
              Your code
            </label>
            <input
              ref={codeRef}
              id="code"
              name="code"
              className="ac-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="······"
              required
            />
          </div>

          {/* Local development has no mail provider — the code is
              printed here as well as on the server console so the flow
              is testable without one. Never rendered in production:
              the action only ever sets devCode when the send was
              skipped, which production refuses to do. */}
          {state.devCode && (
            <p className="ac-note">
              Development only — email isn&apos;t configured, so here&apos;s the code:{" "}
              <strong className="ac-mono">{state.devCode}</strong>
            </p>
          )}

          <div className="ac-actions">
            <Submit name="intent" value="verify">
              Sign in
              <ArrowRight
                size={15}
                strokeWidth={1.75}
                aria-hidden="true"
                style={{ marginLeft: ".4rem", verticalAlign: "-2px" }}
              />
            </Submit>
            {/* formNoValidate matters here. The code box is `required`,
                so without it the browser blocks these two submits
                while the box is empty — silently, with no message —
                and someone who mistyped their code has no way to ask
                for another without first typing junk into the field. */}
            <button
              type="submit"
              name="intent"
              value="send"
              className="ac-btn-link"
              formNoValidate
            >
              Send another
            </button>
            <button
              type="submit"
              name="intent"
              value="restart"
              className="ac-btn-link"
              formNoValidate
            >
              Use a different email
            </button>
          </div>

          <p className="ac-fine">
            The email also has a link in it — clicking that signs you in without the code.
          </p>
        </>
      ) : (
        <>
          <div className="ac-field">
            <label className="ac-label" htmlFor="email">
              Email
            </label>
            <p className="ac-hint">
              We&apos;ll send a six-digit code. No password to make, no password to forget.
            </p>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={state.email}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>

          <div className="ac-actions">
            <Submit name="intent" value="send">
              <Mail
                size={15}
                strokeWidth={1.75}
                aria-hidden="true"
                style={{ marginRight: ".45rem", verticalAlign: "-2px" }}
              />
              Email me a code
            </Submit>
          </div>
        </>
      )}
    </form>
  );
}
