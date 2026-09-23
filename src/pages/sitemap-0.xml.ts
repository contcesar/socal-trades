import type { APIRoute } from "astro";
import { buildSitemapEntries } from "../lib/seo";

// The URL sitemap. Only indexable pages appear here (see buildSitemapEntries):
// thin category pages and the claim pages are excluded, and each entry carries
// a <lastmod> when we can derive one from the listings on that page.
export const GET: APIRoute = async () => {
  const entries = await buildSitemapEntries();
  const urls = entries
    .map(
      (e) =>
        `<url><loc>${e.loc}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}</url>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
