// ---------------------------------------------------------------------------
// Data access layer. This is the ONLY module pages import for data.
//
// Today it reads from the local seed (src/lib/*.seed.ts, trades.ts, counties.ts)
// so the site builds before Supabase exists. To swap to Supabase later, replace
// the bodies of these functions with Supabase queries (using SUPABASE_URL +
// SUPABASE_ANON_KEY at build time) and keep the same signatures. Pages,
// getStaticPaths, and the search index need no changes.
//
// All functions are async so the Supabase swap is signature-compatible.
// ---------------------------------------------------------------------------
import type { Business, County, Trade } from "./types";
import { TRADES } from "./trades";
import { COUNTIES } from "./counties";
import { BUSINESSES } from "./businesses.seed";
import { slugify } from "./slug";

export interface CityRef {
  name: string;
  slug: string;
  county: County;
  count: number;
}

function published(): Business[] {
  return BUSINESSES.filter((b) => b.status === "published");
}

function inTrade(b: Business, tradeSlug: string): boolean {
  return b.trade === tradeSlug || b.secondary_trades.includes(tradeSlug);
}

/** All trades, ordered for display. */
export async function getTrades(): Promise<Trade[]> {
  return [...TRADES].sort((a, b) => a.sort_order - b.sort_order);
}

export async function getTradeBySlug(slug: string): Promise<Trade | undefined> {
  return TRADES.find((t) => t.slug === slug);
}

/** Trade slug -> Trade, for quick lookups when rendering listings. */
export async function getTradeMap(): Promise<Map<string, Trade>> {
  return new Map(TRADES.map((t) => [t.slug, t]));
}

export async function getCounties(): Promise<County[]> {
  return COUNTIES;
}

export async function getCountyBySlug(slug: string): Promise<County | undefined> {
  return COUNTIES.find((c) => c.slug === slug);
}

/** Every published business, sorted by name. */
export async function getPublishedBusinesses(): Promise<Business[]> {
  return published().sort((a, b) => a.name.localeCompare(b.name));
}

export async function getBusinessBySlug(slug: string): Promise<Business | undefined> {
  return published().find((b) => b.slug === slug);
}

/** Published businesses in a trade (primary or secondary), sorted by name. */
export async function getBusinessesByTrade(tradeSlug: string): Promise<Business[]> {
  return published()
    .filter((b) => inTrade(b, tradeSlug))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getBusinessesByCounty(countySlug: string): Promise<Business[]> {
  const county = COUNTIES.find((c) => c.slug === countySlug);
  if (!county) return [];
  return published()
    .filter((b) => b.county === county.name)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getBusinessesByTradeAndCounty(
  tradeSlug: string,
  countySlug: string,
): Promise<Business[]> {
  const county = COUNTIES.find((c) => c.slug === countySlug);
  if (!county) return [];
  return published()
    .filter((b) => inTrade(b, tradeSlug) && b.county === county.name)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Distinct cities within a county, derived from published businesses. */
export async function getCitiesForCounty(countySlug: string): Promise<CityRef[]> {
  const county = COUNTIES.find((c) => c.slug === countySlug);
  if (!county) return [];
  const byCity = new Map<string, CityRef>();
  for (const b of published()) {
    if (b.county !== county.name) continue;
    const slug = slugify(b.city);
    const existing = byCity.get(slug);
    if (existing) existing.count += 1;
    else byCity.set(slug, { name: b.city, slug, county, count: 1 });
  }
  return [...byCity.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** Every (county, city) pair that has at least one published business. */
export async function getAllCities(): Promise<CityRef[]> {
  const out: CityRef[] = [];
  for (const county of COUNTIES) {
    out.push(...(await getCitiesForCounty(county.slug)));
  }
  return out;
}

export async function getBusinessesByCity(
  countySlug: string,
  citySlug: string,
): Promise<Business[]> {
  const county = COUNTIES.find((c) => c.slug === countySlug);
  if (!county) return [];
  return published()
    .filter((b) => b.county === county.name && slugify(b.city) === citySlug)
    .sort((a, b) => a.name.localeCompare(b.name));
}
