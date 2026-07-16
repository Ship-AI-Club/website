import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://www.shipai.club"),
  title: "Ship AI — Demos over memos",
  description:
    "A high-signal community of AI craftspeople in Phoenix & Tempe. Show the build, the workflow, the decisions behind it. If it ships, it speaks.",
  openGraph: {
    title: "Ship AI — Demos over memos",
    description:
      "A high-signal community of AI craftspeople in Phoenix & Tempe. Socratic Nights: questions first, hot takes welcome, receipts required.",
    url: "https://www.shipai.club",
    siteName: "Ship AI",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
