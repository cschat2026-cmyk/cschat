import type { MetadataRoute } from "next";

import { calculators, regions } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://example.com";

  return [
    {
      url: baseUrl,
    },
    {
      url: `${baseUrl}/about`,
    },
    {
      url: `${baseUrl}/privacy`,
    },
    ...calculators.map((calculator) => ({
      url: `${baseUrl}/calculators/${calculator.slug}`,
    })),
    ...regions.map((region) => ({
      url: `${baseUrl}/?region=${region.code}`,
    })),
  ];
}
