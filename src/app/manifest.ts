import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EGA BUDGET HOUSE",
    short_name: "Budget House",
    description:
      "Personal monthly budget tracker for fast transactions, safe balance protection, and monthly spending review.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8faf7",
    theme_color: "#15803d",
    orientation: "portrait",
    categories: ["finance", "productivity"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
