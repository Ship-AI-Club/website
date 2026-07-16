import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import SmoothScroll from "./smooth-scroll";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://www.shipai.club"),
  title: "Ship AI — Demos over memos",
  description:
    "Free, public AI education in Phoenix & Tempe for builders who've shipped. News briefing, community-voted debates, 5-minute demos. Demos over memos.",
  openGraph: {
    title: "Ship AI — Demos over memos",
    description:
      "Free, public AI education in Phoenix & Tempe for builders who've shipped. Questions first, hot takes welcome, receipts required.",
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
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}
    >
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
