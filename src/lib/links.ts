// ---------------------------------------------------------------------------
// Internal-link builders. Every link returned here points at a page that is
// indexable (at or above the listing threshold) and returns 200, so we never
// link into thin/noindex pages. Anchor text is descriptive.
// ---------------------------------------------------------------------------
import type { Business } from "./types";
import {
  getAllCities,
  getCountyBySlug,
  getBusinessesByTrade,
  getBusinessesByTradeAndCounty,
  getBusinessesByCity,
  getTradeBySlug,
  getCounties,
  type CityRef,
} from "./data";
import { COUNTIES } from "./counties";
import { isIndexableCount, tradePlural } from "./seo";
import { relatedTradeSlugs } from "./relatedTrades";
import { nearbyCitySlugs } from "./nearbyCities";
import { slugify } from "./slug";

export interface SeoLink {
  href: string;
  label: string;
}

// city slug -> CityRef entries (a slug can appear in more than one county).
let cityIndex: Promise<Map<string, CityRef[]>> | null = null;
function getCityIndex(): Promise<Map<string, CityRef[]>> {
  if (!cityIndex) {
    cityIndex = (async () => {
      const map = new Map<string, CityRef[]>();
      for (const c of await getAllCities()) {
        const list = map.get(c.slug) ?? [];
        list.push(c);
        map.set(c.slug, list);
      }
      return map;
    })();
  }
  return cityIndex;
}

async function tradeNameFor(slug: string): Promise<string> {
  return (await getTradeBySlug(slug))?.name ?? slug;
}

const countyNameFromSlug = (slug: string): string =>
  COUNTIES.find((c) => c.slug === slug)?.name ?? slug;

/** Nearby-city links (same all-trade city page family), indexable only. */
export async function nearbyCityLinks(citySlug: string, max = 6): Promise<SeoLink[]> {
  const index = await getCityIndex();
  const out: SeoLink[] = [];
  for (const slug of nearbyCitySlugs(citySlug)) {
    const refs = index.get(slug);
    if (!refs) continue;
    // Prefer an indexable instance of this city.
    const ref = refs.find((r) => isIndexableCount(r.count));
    if (!ref) continue;
    out.push({
      href: `/locations/${ref.county.slug}/${ref.slug}/`,
      label: `Trades companies in ${ref.name}`,
    });
    if (out.length >= max) break;
  }
  return out;
}

/** Related trades in the same county (trade+county pages), indexable only. */
export async function relatedTradeCountyLinks(
  tradeSlug: string,
  countySlug: string,
): Promise<SeoLink[]> {
  const county = countyNameFromSlug(countySlug);
  const out: SeoLink[] = [];
  for (const rt of relatedTradeSlugs(tradeSlug)) {
    const list = await getBusinessesByTradeAndCounty(rt, countySlug);
    if (!isIndexableCount(list.length)) continue;
    out.push({
      href: `/trades/${rt}/${countySlug}/`,
      label: `${tradePlural(rt, await tradeNameFor(rt))} in ${county} County`,
    });
  }
  return out;
}

/** Related trade landing pages (Southern California), indexable only. */
export async function relatedTradeLandingLinks(tradeSlug: string): Promise<SeoLink[]> {
  const out: SeoLink[] = [];
  for (const rt of relatedTradeSlugs(tradeSlug)) {
    const list = await getBusinessesByTrade(rt);
    if (!isIndexableCount(list.length)) continue;
    out.push({
      href: `/trades/${rt}/`,
      label: `${tradePlural(rt, await tradeNameFor(rt))} in Southern California`,
    });
  }
  return out;
}

/** Indexable city pages within a county (for the county landing chips). */
export async function indexableCityLinksForCounty(countySlug: string): Promise<SeoLink[]> {
  const index = await getCityIndex();
  const out: SeoLink[] = [];
  for (const refs of index.values()) {
    for (const ref of refs) {
      if (ref.county.slug !== countySlug) continue;
      if (!isIndexableCount(ref.count)) continue;
      out.push({
        href: `/locations/${ref.county.slug}/${ref.slug}/`,
        label: `Trades companies in ${ref.name}`,
      });
    }
  }
  return out.sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Geo/category links for a business profile: its trade+county page and its
 * city page, plus service-area city pages, each only if indexable.
 */
export async function businessGeoLinks(business: Business): Promise<SeoLink[]> {
  const out: SeoLink[] = [];
  const county = COUNTIES.find((c) => c.name === business.county);
  if (!county) return out;

  // Trade + county page.
  const tc = await getBusinessesByTradeAndCounty(business.trade, county.slug);
  if (isIndexableCount(tc.length)) {
    out.push({
      href: `/trades/${business.trade}/${county.slug}/`,
      label: `${tradePlural(business.trade, await tradeNameFor(business.trade))} in ${county.name} County`,
    });
  }

  // Home city + service-area cities (all-trade city pages), indexable only.
  const index = await getCityIndex();
  const citySlugs = new Set<string>([business.city, ...(business.service_areas ?? [])].map(slugify));
  for (const slug of citySlugs) {
    const refs = index.get(slug);
    const ref = refs?.find((r) => r.county.slug === county.slug && isIndexableCount(r.count));
    if (ref) {
      out.push({
        href: `/locations/${ref.county.slug}/${ref.slug}/`,
        label: `Trades companies in ${ref.name}`,
      });
    }
  }
  return out;
}
