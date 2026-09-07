import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/en"].map((route) => ({ url: `${site.url}${route}`, alternates: { languages: { de: `${site.url}/`, en: `${site.url}/en` } } }));
}
