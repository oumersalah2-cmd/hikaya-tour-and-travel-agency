import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HIKAYA Tour and Travel Agency",
    short_name: "HIKAYA",
    description: "Umrah packages, flight tickets, hotels and guided tours across Ethiopia.",
    start_url: "/en",
    display: "standalone",
    background_color: "#0a1f44",
    theme_color: "#0a1f44",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
