import localFont from "next/font/local";
import { ToastProvider } from "../components/toast-provider";
import { MODE_BOOT_SCRIPT } from "../lib/mode";
import "./globals.css";
import { DEFAULT_OG } from "../lib/og";

const besley = localFont({
  src: [
    { path: "../public/fonts/besley-latin.woff2", weight: "400 900", style: "normal" },
    { path: "../public/fonts/besley-italic-latin.woff2", weight: "400 900", style: "italic" },
  ],
  variable: "--font-besley",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const franklin = localFont({
  src: "../public/fonts/libre-franklin-latin.woff2",
  weight: "100 900",
  variable: "--font-libre-franklin",
  display: "swap",
});

const fragment = localFont({
  src: "../public/fonts/fragment-mono-latin.woff2",
  weight: "400",
  variable: "--font-fragment-mono",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.shipai.club"),
  title: "Ship AI — Hands-on AI Workshops in Phoenix",
  description:
    "Hands-on AI workshops and programs in Phoenix. Build real projects with expert guidance and a community of builders.",
  openGraph: {
    title: "Practical AI, Built Together — Ship AI Phoenix",
    description:
      "Hands-on AI workshops, expert guidance, and real projects in Phoenix. Craft over hype.",
    url: "https://www.shipai.club",
    siteName: "Ship AI",
    images: [DEFAULT_OG],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3EFE3" },
    { media: "(prefers-color-scheme: dark)", color: "#0D241E" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${besley.variable} ${franklin.variable} ${fragment.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MODE_BOOT_SCRIPT }} />
      </head>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
