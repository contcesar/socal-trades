import type { APIRoute } from "astro";
import {
  getPublishedBusinesses,
  getTradeMap,
  getCounties,
} from "../lib/data";
import { slugify } from "../lib/slug";

// Build-time search index consumed by the client-side Fuse.js search on
// /search. Regenerated on every build (i.e. on every data change via the
// Netlify build hook).
export const GET: APIRoute = async () => {
  const [businesses, tradeMap, counties] = await Promise.all([
    getPublishedBusinesses(),
    getTradeMap(),
    getCounties(),
  ]);
  const countyBySlug = new Map(counties.map((c) => [c.name, c.slug]));

  const index = businesses.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    trade: b.trade,
    tradeName: tradeMap.get(b.trade)?.name ?? b.trade,
    secondaryTradeNames: b.secondary_trades.map(
      (s) => tradeMap.get(s)?.name ?? s,
    ),
    city: b.city,
    citySlug: slugify(b.city),
    county: b.county,
    countySlug: countyBySlug.get(b.county) ?? slugify(b.county),
    serviceAreas: b.service_areas,
    shortDescription: b.short_description,
  }));

  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json" },
  });
};
