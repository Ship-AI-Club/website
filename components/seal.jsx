import { useId } from "react";

export function Seal({ size = 30, className, title }) {
  const clip = useId();
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      fill="none"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <clipPath id={clip}>
        <circle cx="20" cy="20" r="16" />
      </clipPath>
      <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="20" cy="20" r="16.4" stroke="currentColor" strokeWidth=".5" />
      <g clipPath={`url(#${clip})`}>
        <path d="M11.5 6.6 12.37 8.83 14.6 9.7 12.37 10.57 11.5 12.8 10.63 10.57 8.4 9.7 10.63 8.83Z" fill="currentColor" />
        <path d="M13.4 10.3 20.8 11.5" stroke="currentColor" strokeWidth=".45" strokeDasharray="1 .8" />
        <path d="M7.5 24C15 23.6 24 23.1 32.4 21.8L28.6 27.6C22 27.9 15.6 27.9 10.2 27.8Z" fill="currentColor" />
        <path d="M13.5 23.6 14.6 19H24.2L26 23" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        <path d="M18 19 18.8 16.6H23L23.8 19" stroke="currentColor" strokeWidth="1" />
        <path d="M21.8 16.6 21 11.4M21.2 12.6H19.2" stroke="currentColor" strokeWidth="1" />
        <path d="M2 30.5q2.5-2 5 0t5 0 5 0 5 0 5 0 5 0 5 0" stroke="currentColor" strokeWidth="1" />
        <path d="M4 34q2.5-1.6 5 0t5 0 5 0 5 0 5 0 5 0" stroke="currentColor" strokeWidth=".8" />
      </g>
    </svg>
  );
}

export function Lockup({ compact = false, href = "/", descriptor = "Community", className = "" }) {
  return (
    <a href={href} className={`brand ${className}`.trim()} aria-label="Ship AI Community, home">
      <Seal />
      <span className="brand-wm">Ship AI</span>
      {!compact && <span className="brand-desc">{descriptor}</span>}
    </a>
  );
}
