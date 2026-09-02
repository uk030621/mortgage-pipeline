import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ledger — Mortgage Pipeline Tracker",
  description:
    "Track UK mortgages through your pipeline, from enquiry to completion.",
  // Using a static public/manifest.json instead of the app/manifest.ts
  // file convention — that means it's NOT auto-linked, so it has to be
  // pointed to explicitly here.
  manifest: "/manifest.json",
  // Same reasoning for icons: app/icon.png, apple-icon.png, and
  // favicon.ico (the auto-detected convention files) were removed, so
  // these need to be configured explicitly too, pointing at the actual
  // files now sitting in public/icons/.
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    // Still needed even with the manifest's "display": "standalone" —
    // iOS Safari doesn't reliably honour that on its own.
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ledger",
  },
};

export const viewport: Viewport = {
  themeColor: "#1C2B39",
  // Lets the app draw edge-to-edge under the notch/status bar in
  // standalone mode instead of leaving a black bar there.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        {/*
          Next.js's `appleWebApp.capable` metadata field emits
          `<meta name="mobile-web-app-capable">` instead of the classic
          `apple-mobile-web-app-capable` — a known Next.js regression
          (vercel/next.js#70272, #74524), changed to silence a Chrome
          DevTools deprecation warning. iOS Safari still requires the
          old tag name to actually launch in fullscreen/standalone mode
          from a home-screen icon, so it's added directly here rather
          than relying on the (currently broken) metadata config.
        */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
