// ---------------------------------------------------------------------------
// JSON-LD builders. Each page renders a single <script type="application/ld+json">
// from graph([...]) below.
//
// Ratings rule: we NEVER output aggregateRating or review markup, because our
// visible ratings come from Google Business Profile and Google's policy only
// allows structured review data collected on our own site. The Google rating
// still shows on the page; it just isn't in the structured data.
// ---------------------------------------------------------------------------
import type { Business } from "./types";
import type { FAQ } from "../content/localSeo";

const SITE = "https://socaltrades.net";
const abs = (path: string): string => new URL(path, SITE).href;

// Trade slug -> most specific schema.org LocalBusiness subtype.
const SCHEMA_TYPE: Record<string, string> = {
  plumbing: "Plumber",
  electrical: "Electrician",
  roofing: "RoofingContractor",
  hvac: "HVACBusiness",
  "general-contractor": "GeneralContractor",
  remodelers: "GeneralContractor",
  painting: "HousePainter",
};

function schemaTypeForTrade(slug: string): string {
  return SCHEMA_TYPE[slug] ?? "HomeAndConstructionBusiness";
}

function normalizeUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const v = raw.trim();
  if (!v) return null;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function postalAddress(b: Business): Record<string, unknown> | null {
  if (!b.address && !b.city) return null;
  const addr: Record<string, unknown> = { "@type": "PostalAddress" };
  if (b.address) addr.streetAddress = b.address.split(",")[0].trim();
  if (b.city) addr.addressLocality = b.city;
  addr.addressRegion = "CA";
  const zip = (b.address ?? "").match(/\b\d{5}(?:-\d{4})?\b/);
  if (zip) addr.postalCode = zip[0];
  addr.addressCountry = "US";
  return addr;
}

/** LocalBusiness node for a business profile. No rating/review markup. */
export function businessSchema(b: Business): Record<string, unknown> {
  const url = abs(`/business/${b.slug}/`);
  const node: Record<string, unknown> = {
    "@type": schemaTypeForTrade(b.trade),
    "@id": `${url}#business`,
    name: b.name,
    url,
  };
  if (b.phone) node.telephone = b.phone;
  if (b.email) node.email = b.email;
  if (b.short_description) node.description = b.short_description;

  const website = normalizeUrl(b.website);
  if (website) node.sameAs = [website];

  const image = b.photo_urls?.[0] || b.logo_url;
  if (image) node.image = image;

  const address = postalAddress(b);
  if (address) node.address = address;

  const areas = [...new Set([b.city, ...(b.service_areas ?? [])].filter(Boolean))];
  if (areas.length) node.areaServed = areas.map((name) => ({ "@type": "City", name }));

  if (b.latitude != null && b.longitude != null) {
    node.geo = { "@type": "GeoCoordinates", latitude: b.latitude, longitude: b.longitude };
  }
  return node;
}

/** ItemList of businesses on a category page (links only, not full objects). */
export function itemListSchema(businesses: Business[]): Record<string, unknown> {
  return {
    "@type": "ItemList",
    itemListElement: businesses.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      url: abs(`/business/${b.slug}/`),
    })),
  };
}

export interface Crumb {
  name: string;
  /** Path (with trailing slash) for all but the current page. */
  path?: string;
}

export function breadcrumbSchema(crumbs: Crumb[]): Record<string, unknown> {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.path ? { item: abs(c.path) } : {}),
    })),
  };
}

export function faqSchema(faqs: FAQ[]): Record<string, unknown> {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function organizationSchema(): Record<string, unknown> {
  return {
    "@type": "Organization",
    "@id": `${SITE}/#organization`,
    name: "SoCal Trades",
    url: `${SITE}/`,
    logo: abs("/socal-trades.png"),
  };
}

export function websiteSchema(): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    name: "SoCal Trades",
    url: `${SITE}/`,
  };
}

/** Wrap one or more nodes in a single @graph document. Falsy nodes dropped. */
export function graph(nodes: (Record<string, unknown> | null | undefined)[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  });
}
