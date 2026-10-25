"use client";

import { createContext, useActionState, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { CheckCircle2, CircleAlert, X } from "lucide-react";
import { safeNext } from "../lib/nav";
import "./toast.css";

const ToastContext = createContext(null);

function Toast({ toast, dismiss }) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (toast.error || paused) return;
    const timer = setTimeout(() => dismiss(toast.id), 7000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.error, dismiss, paused]);
  const Icon = toast.error ? CircleAlert : CheckCircle2;
  return (
    <div className={`toast${toast.error ? " is-error" : ""}`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <Icon size={20} aria-hidden="true" />
      <p role={toast.error ? "alert" : "status"} aria-atomic="true">{toast.message}</p>
      <button type="button" aria-label="Dismiss notification" onClick={() => dismiss(toast.id)}><X size={16} aria-hidden="true" /></button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [mounted, setMounted] = useState(false);
  const sequence = useRef(0);
  useEffect(() => setMounted(true), []);
  const notify = useCallback((message, error = false) => {
    if (typeof message !== "string" || !message) return;
    const id = ++sequence.current;
    setToasts(items => [...items.slice(-2), { id, message, error }]);
  }, []);
  const dismiss = useCallback(id => setToasts(items => items.filter(item => item.id !== id)), []);
  const api = useMemo(() => ({ notify }), [notify]);
  return (
    <ToastContext.Provider value={api}>
      {children}
      {mounted && createPortal(<div className="toast-stack" role="region" aria-label="Notifications">{toasts.map(toast => <Toast key={toast.id} toast={toast} dismiss={dismiss} />)}</div>, document.body)}
    </ToastContext.Provider>
  );
}

// Announce every completed action, including repeated saves of the same text.
// The provider survives page navigation, so Save & next keeps its confirmation.
export function useToastActionState(action, initialState) {
  const { notify } = useContext(ToastContext);
  const router = useRouter();
  const wrapped = useCallback(async (previous, formData) => {
    const result = await action(previous, formData);
    if (result?.error) notify(result.error, true);
    else if (result?.ok) notify(result.ok);
    if (result?.nextUrl) router.push(safeNext(result.nextUrl));
    return result;
  }, [action, notify, router]);
  return useActionState(wrapped, initialState);
}
