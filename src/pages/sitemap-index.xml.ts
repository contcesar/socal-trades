import type { APIRoute } from "astro";

// Sitemap index pointing at the single URL sitemap. Kept as a separate file so
// the public path /sitemap-index.xml (referenced by robots.txt) is unchanged.
export const GET: APIRoute = () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<sitemap><loc>https://socaltrades.net/sitemap-0.xml</loc></sitemap>
</sitemapindex>
`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
