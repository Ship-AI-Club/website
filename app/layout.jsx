import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import SmoothScroll from "./smooth-scroll";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://www.shipai.club"),
  title: "Ship AI — programs for AI builders in Phoenix",
  description:
    "Free multi-session AI programs and workshops in Phoenix and Tempe. The work gets built live on screen, you ship something real, then 5-minute demos. Free and in person.",
  openGraph: {
    title: "Ship AI — programs for AI builders in Phoenix",
    description:
      "Free multi-session AI programs and workshops in Phoenix and Tempe. Built live on screen, shipped for real, demoed in five minutes. Demos over memos.",
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
