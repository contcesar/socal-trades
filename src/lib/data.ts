// ---------------------------------------------------------------------------
// Data access layer. This is the ONLY module pages import for data.
//
// Businesses load from Supabase at BUILD TIME when the project env is present
// (SUPABASE_URL/ANON_KEY, or the PUBLIC_ pair), and fall back to the local seed
// otherwise or if Supabase returns nothing. Trades and counties are static
// config (they mirror supabase/seed.sql). Pages, getStaticPaths, and the search
// index are unchanged — they just call these functions.
//
// Row Level Security means the anon key only ever returns published rows, so
// drafts and hidden listings never reach the public build.
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

function env(name: string): string {
  // Build runs in Node; read from process.env.
  return (process.env[name] ?? "").trim();
}

function supabaseUrl(): string {
  const raw = (env("SUPABASE_URL") || env("PUBLIC_SUPABASE_URL")).replace(/\/+$/, "");
  if (!raw) return "";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

function supabaseKey(): string {
  return env("SUPABASE_ANON_KEY") || env("PUBLIC_SUPABASE_ANON_KEY");
}

// Load once per build.
let cache: Promise<Business[]> | null = null;

async function loadBusinesses(): Promise<Business[]> {
  if (cache) return cache;
  cache = (async () => {
    const url = supabaseUrl();
    const key = supabaseKey();
    if (url && key) {
      try {
        const res = await fetch(
          `${url}/rest/v1/businesses?status=eq.published&select=*`,
          { headers: { apikey: key, Authorization: `Bearer ${key}` } },
        );
        if (res.ok) {
          const rows = (await res.json()) as Business[];
          if (Array.isArray(rows) && rows.length > 0) return rows;
          // Empty table: fall back to the seed so the site is never blank
          // during the transition. Real published rows take over automatically.
        } else {
          console.warn("Supabase businesses fetch:", res.status);
        }
      } catch (err) {
        console.warn("Supabase businesses fetch failed, using seed:", err);
      }
    }
    return BUSINESSES;
  })();
  return cache;
}

async function published(): Promise<Business[]> {
  return (await loadBusinesses()).filter((b) => b.status === "published");
}

function inTrade(b: Business, tradeSlug: string): boolean {
  return b.trade === tradeSlug || (b.secondary_trades ?? []).includes(tradeSlug);
}

const byName = (a: Business, b: Business) => a.name.localeCompare(b.name);

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
  return (await published()).sort(byName);
}

export async function getBusinessBySlug(slug: string): Promise<Business | undefined> {
  return (await published()).find((b) => b.slug === slug);
}

/**
 * Featured ("popular") businesses for the home carousel. Until live Google
 * ratings exist, this returns the first N published businesses.
 */
export async function getFeaturedBusinesses(limit = 8): Promise<Business[]> {
  const all = await getPublishedBusinesses();
  // Admin-featured companies (up to 4) come first, then the rest by highest
  // rating (unrated last), keeping name order as a tiebreak.
  return [...all]
    .sort((a, b) => {
      const fa = a.featured ? 1 : 0;
      const fb = b.featured ? 1 : 0;
      if (fa !== fb) return fb - fa;
      return (b.rating ?? -1) - (a.rating ?? -1);
    })
    .slice(0, limit);
}

/** Admin-featured companies, in rating order, capped at 4. */
export async function getFeaturedPicks(): Promise<Business[]> {
  return (await published())
    .filter((b) => b.featured)
    .sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1))
    .slice(0, 4);
}

/** Published businesses in a trade (primary or secondary), sorted by name. */
export async function getBusinessesByTrade(tradeSlug: string): Promise<Business[]> {
  return (await published()).filter((b) => inTrade(b, tradeSlug)).sort(byName);
}

export async function getBusinessesByCounty(countySlug: string): Promise<Business[]> {
  const county = COUNTIES.find((c) => c.slug === countySlug);
  if (!county) return [];
  return (await published()).filter((b) => b.county === county.name).sort(byName);
}

export async function getBusinessesByTradeAndCounty(
  tradeSlug: string,
  countySlug: string,
): Promise<Business[]> {
  const county = COUNTIES.find((c) => c.slug === countySlug);
  if (!county) return [];
  return (await published())
    .filter((b) => inTrade(b, tradeSlug) && b.county === county.name)
    .sort(byName);
}

/** Distinct cities within a county, derived from published businesses. */
export async function getCitiesForCounty(countySlug: string): Promise<CityRef[]> {
  const county = COUNTIES.find((c) => c.slug === countySlug);
  if (!county) return [];
  const byCity = new Map<string, CityRef>();
  for (const b of await published()) {
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
  return (await published())
    .filter((b) => b.county === county.name && slugify(b.city) === citySlug)
    .sort(byName);
}
