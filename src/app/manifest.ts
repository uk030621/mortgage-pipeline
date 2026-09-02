import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ledger — Mortgage Pipeline Tracker",
    short_name: "Ledger",
    description:
      "Track UK mortgages through your pipeline, from enquiry to completion.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F5EF", // matches globals.css `paper` background
    theme_color: "#1C2B39", // matches globals.css `ink` / brand navy
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
