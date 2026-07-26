import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import SmoothScroll from "./smooth-scroll";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://www.shipai.club"),
  title: "Ship AI — Zero to Launch",
  description:
    "Six free go-to-market sessions in Phoenix, Aug 5 – Oct 14 2026, then a hackathon Oct 16–18 where you launch. Free, in person, judged on what shipped. Demos over memos.",
  openGraph: {
    title: "Ship AI — Zero to Launch",
    description:
      "Six free go-to-market sessions, then a hackathon where you don't build — you launch. Phoenix, Aug–Oct 2026. Receipts required.",
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
