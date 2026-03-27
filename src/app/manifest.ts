import type { MetadataRoute } from "next";
import { METADATA } from "@/shared/constants/metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: METADATA.siteName,
    short_name: METADATA.shortName,
    description: METADATA.description,
    start_url: "/",
    display: "browser",
    background_color: "#fcf8ef",
    theme_color: METADATA.themeColor,
    icons: [
      {
        src: "/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
