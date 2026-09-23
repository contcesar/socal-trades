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

// ---------------------------------------------------------------------------
// Trade display names (people-plural), used in titles, H1s and descriptions.
// These are separate from Trade.name (which is the category label like
// "HVAC (Heating & Air)") so we can say "HVAC Contractors" without renaming
// the trade everywhere.
// ---------------------------------------------------------------------------
export const TRADE_PLURAL: Record<string, string> = {
  plumbing: "Plumbers",
  electrical: "Electricians",
  hvac: "HVAC Contractors",
  roofing: "Roofers",
  "general-contractor": "General Contractors",
  landscaping: "Landscapers",
  painting: "Painters",
  flooring: "Flooring Contractors",
  "concrete-masonry": "Concrete & Masonry Contractors",
  fencing: "Fence Contractors",
  "garage-doors": "Garage Door Companies",
  "generator-services": "Generator Installers",
  scaffolding: "Scaffolding Companies",
  "excavation-services": "Excavation Contractors",
  remodelers: "Remodelers",
  "restoration-services": "Restoration Companies",
  "utility-contractors": "Utility Contractors",
  paving: "Paving Contractors",
  "site-services": "Site Services Companies",
  "dump-truck-hauling": "Dump Truck Hauling Companies",
};

/** People-plural display name for a trade, falling back to the category name. */
export function tradePlural(slug: string, fallback: string): string {
  return TRADE_PLURAL[slug] ?? fallback;
}

/** Keep a meta description within `max` chars, using a shorter fallback. */
function clampDescription(text: string, fallback: string, max = 155): string {
  if (text.length <= max) return text;
  if (fallback.length <= max) return fallback;
  return fallback.slice(0, max - 1).trimEnd() + "…";
}

// ---- Trade + county pages ----
export function tradeCountyTitle(slug: string, name: string, county: string): string {
  return `Best ${tradePlural(slug, name)} in ${county} County, CA (${currentYear()}) | SoCal Trades`;
}
export function tradeCountyH1(slug: string, name: string, county: string): string {
  return `${tradePlural(slug, name)} in ${county} County, CA`;
}
export function tradeCountyDescription(
  n: number,
  slug: string,
  name: string,
  county: string,
): string {
  const plural = tradePlural(slug, name).toLowerCase();
  return clampDescription(
    `Compare ${n} ${plural} in ${county} County, CA. See ratings, service areas and contact details on SoCal Trades.`,
    `Compare ${n} ${plural} in ${county} County, CA on SoCal Trades.`,
  );
}

// ---- Trade landing (all of Southern California) ----
export function tradeTitle(slug: string, name: string): string {
  return `Best ${tradePlural(slug, name)} in Southern California (${currentYear()}) | SoCal Trades`;
}
export function tradeH1(slug: string, name: string): string {
  return `${tradePlural(slug, name)} in Southern California`;
}
export function tradeDescription(n: number, slug: string, name: string): string {
  const plural = tradePlural(slug, name).toLowerCase();
  return clampDescription(
    `Compare ${n} ${plural} across Southern California. See ratings, service areas and contact details on SoCal Trades.`,
    `Compare ${n} ${plural} across Southern California on SoCal Trades.`,
  );
}

// ---- City pages (all trades in one city) ----
export function cityTitle(city: string): string {
  return `Best Trades Companies in ${city}, CA (${currentYear()}) | SoCal Trades`;
}
export function cityH1(city: string): string {
  return `Trades Companies in ${city}, CA`;
}
export function cityDescription(n: number, city: string): string {
  return clampDescription(
    `Compare ${n} trades companies in ${city}, CA. See ratings, service areas and contact details on SoCal Trades.`,
    `Compare ${n} trades companies in ${city}, CA on SoCal Trades.`,
  );
}

// ---- County landing (all trades in one county) ----
export function countyTitle(county: string): string {
  return `Best Trades Companies in ${county} County, CA (${currentYear()}) | SoCal Trades`;
}
export function countyH1(county: string): string {
  return `Trades Companies in ${county} County, CA`;
}
export function countyDescription(n: number, county: string): string {
  return clampDescription(
    `Compare ${n} trades companies across ${county} County, CA. See ratings, service areas and contact details on SoCal Trades.`,
    `Compare ${n} trades companies in ${county} County, CA on SoCal Trades.`,
  );
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

/**
 * Short, fact-free generic intro for an indexable page that has no reviewed
 * content entry yet. Deliberately says nothing specific (no prices, no permit
 * offices) so it can never be wrong.
 */
export function genericIntro(subject: string, place: string): string {
  return `Looking for ${subject} in ${place}? Browse the companies listed below, compare their ratings and service areas, and reach out directly. Each profile has contact details and the areas they cover so you can find a local pro that fits your project.`;
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
