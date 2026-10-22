import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { places } from "@/lib/places";

// /, /map, /places/[slug] (SPEC §12-5)
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: SITE.url, lastModified },
    { url: `${SITE.url}/map`, lastModified },
    ...places.map(({ slug }) => ({ url: `${SITE.url}/places/${slug}`, lastModified })),
  ];
}
