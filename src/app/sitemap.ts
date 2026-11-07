import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/gallery", "/contact", "/privacy"];
  return locales.flatMap((lang) =>
    pages.map((page) => ({
      url: `${SITE_URL}/${lang}${page}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: page === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${SITE_URL}/${l}${page}`])
        ),
      },
    }))
  );
}
