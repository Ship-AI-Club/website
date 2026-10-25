const KEY = "sap-mode";

export function currentMode() {
  if (typeof document === "undefined") return "light";
  const set = document.documentElement.dataset.mode;
  if (set === "dark" || set === "light") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function setMode(mode) {
  document.documentElement.dataset.mode = mode;
  try {
    sessionStorage.setItem(KEY, mode);
  } catch {}
  window.dispatchEvent(new Event("sap-mode"));
}

export function subscribeMode(callback) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", callback);
  window.addEventListener("sap-mode", callback);
  return () => {
    media.removeEventListener("change", callback);
    window.removeEventListener("sap-mode", callback);
  };
}

export const MODE_BOOT_SCRIPT = `try{var m=sessionStorage.getItem(${JSON.stringify(KEY)});if(m==="dark"||m==="light")document.documentElement.dataset.mode=m;}catch(e){}`;
