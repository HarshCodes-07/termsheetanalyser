import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Termsheet Analyser — understand before you sign",
    short_name: "Termsheet Analyser",
    description:
      "AI-powered termsheet analyser for founders. Get red flags, green flags, a safety score, and negotiation notes in plain english.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7f2",
    theme_color: "#ea5b0c",
    categories: ["business", "finance", "productivity"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo.jpeg",
        sizes: "1024x1024",
        type: "image/jpeg",
        purpose: "any",
      },
      {
        src: "/logo.jpeg",
        sizes: "1024x1024",
        type: "image/jpeg",
        purpose: "maskable",
      },
    ],
  };
}
