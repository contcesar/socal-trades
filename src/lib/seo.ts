// ---------------------------------------------------------------------------
// SEO helpers shared by pages and the sitemap, so the indexing rules live in
// exactly one place.
//
// Indexing rule: a category page (trade landing, county landing, trade+county,
// or city) is indexable only when it lists at least MIN_LISTINGS_TO_INDEX
// businesses. Thin pages stay live for users and internal links but render
// <meta name="robots" content="noindex, follow"> and are left out of the
// sitemap. Business profile pages and static pages are always indexable.
// ---------------------------------------------------------------------------
import type { Business } from "./types";
import {
  getTrades,
  getCounties,
  getBusinessesByTrade,
  getBusinessesByCounty,
  getBusinessesByTradeAndCounty,
  getAllCities,
  getBusinessesByCity,
  getPublishedBusinesses,
} from "./data";

/** Minimum listings for a category page to be indexed and put in the sitemap. */
export const MIN_LISTINGS_TO_INDEX = 3;

export function isIndexableCount(n: number): boolean {
  return n >= MIN_LISTINGS_TO_INDEX;
}

/** Build-time (or request-time) current year, never hardcoded. */
export function currentYear(): number {
  return new Date().getFullYear();
}

/**
 * Newest updated_at (falling back to created_at) across a set of businesses,
 * formatted as YYYY-MM-DD for <lastmod>. Returns undefined when unknown.
 */
export function newestUpdated(
  businesses: Pick<Business, "updated_at" | "created_at">[],
): string | undefined {
  let max = 0;
  for (const b of businesses) {
    const d = Date.parse(b.updated_at || b.created_at || "");
    if (!Number.isNaN(d) && d > max) max = d;
  }
  return max ? new Date(max).toISOString().slice(0, 10) : undefined;
}

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
}

const SITE = "https://socaltrades.net";

// Static pages that are always indexable. Auth/admin/account and the claim
// pages are intentionally absent.
const STATIC_PATHS = [
  "/",
  "/about/",
  "/contact/",
  "/privacy/",
  "/terms/",
  "/list-your-company/",
  "/search/",
  "/saved/",
];

/**
 * Every URL that belongs in the sitemap, with a lastmod when we can derive one.
 * Category pages below the index threshold are omitted; claim pages are never
 * included.
 */
export async function buildSitemapEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  const push = (path: string, lastmod?: string) =>
    entries.push({ loc: new URL(path, SITE).href, lastmod });

  for (const p of STATIC_PATHS) push(p);

  const trades = await getTrades();
  const counties = await getCounties();

  // Trade landings.
  for (const t of trades) {
    const list = await getBusinessesByTrade(t.slug);
    if (isIndexableCount(list.length)) push(`/trades/${t.slug}/`, newestUpdated(list));
  }

  // County landings.
  for (const c of counties) {
    const list = await getBusinessesByCounty(c.slug);
    if (isIndexableCount(list.length)) push(`/locations/${c.slug}/`, newestUpdated(list));
  }

  // Trade + county.
  for (const t of trades) {
    for (const c of counties) {
      const list = await getBusinessesByTradeAndCounty(t.slug, c.slug);
      if (isIndexableCount(list.length)) {
        push(`/trades/${t.slug}/${c.slug}/`, newestUpdated(list));
      }
    }
  }

  // City pages.
  for (const city of await getAllCities()) {
    const list = await getBusinessesByCity(city.county.slug, city.slug);
    if (isIndexableCount(list.length)) {
      push(`/locations/${city.county.slug}/${city.slug}/`, newestUpdated(list));
    }
  }

  // Business profiles are always indexable.
  for (const b of await getPublishedBusinesses()) {
    push(`/business/${b.slug}/`, newestUpdated([b]));
  }

  return entries;
}
