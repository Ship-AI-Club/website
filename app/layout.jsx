import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import SmoothScroll from "./smooth-scroll";
import { ToastProvider } from "../components/toast-provider";
import "./globals.css";

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
    images: [{ url: "/ship-ai-social.jpg", width: 1280, height: 730 }],
  },
  twitter: { card: "summary_large_image", images: [{ url: "/ship-ai-social.jpg", alt: "Ship AI" }] },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbfbf9",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <SmoothScroll />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
