import type { MetadataRoute } from "next";
import { IS_PROD, SITE_URL } from "@/shared/constants/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: IS_PROD ? "/" : "",
      disallow: IS_PROD ? "" : "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
