// Related-trade map for internal linking. Each key is a trade slug; the values
// are other trade slugs a customer on that page might also need. All values
// must be real slugs from src/lib/trades.ts.
export const RELATED_TRADES: Record<string, string[]> = {
  plumbing: ["hvac", "general-contractor", "restoration-services"],
  electrical: ["hvac", "generator-services", "general-contractor"],
  hvac: ["electrical", "plumbing", "general-contractor"],
  roofing: ["general-contractor", "painting", "restoration-services"],
  "general-contractor": ["concrete-masonry", "plumbing", "electrical"],
  landscaping: ["concrete-masonry", "paving", "general-contractor"],
  painting: ["general-contractor", "roofing", "restoration-services"],
  "concrete-masonry": ["paving", "excavation-services", "landscaping"],
  "generator-services": ["electrical", "hvac", "utility-contractors"],
  scaffolding: ["general-contractor", "painting", "roofing"],
  "excavation-services": ["utility-contractors", "paving", "concrete-masonry"],
  "restoration-services": ["roofing", "painting", "general-contractor"],
  "utility-contractors": ["excavation-services", "paving", "site-services"],
  paving: ["concrete-masonry", "excavation-services", "utility-contractors"],
  "site-services": ["utility-contractors", "excavation-services", "dump-truck-hauling"],
  "dump-truck-hauling": ["excavation-services", "site-services", "paving"],
  "crane-service": ["scaffolding", "general-contractor", "excavation-services"],
  "adu-builders": ["general-contractor", "framing-carpentry", "seismic-retrofit-foundation"],
  "seismic-retrofit-foundation": ["general-contractor", "concrete-masonry", "structural-steel-welding"],
  "fire-hardening": ["landscaping", "roofing", "drought-tolerant-landscaping"],
  "drought-tolerant-landscaping": ["landscaping", "plumbing", "fire-hardening"],
  "ev-charger-installation": ["electrical", "generator-services", "low-voltage"],
  "demolition": ["roll-off-dumpsters", "excavation-services", "saw-cutting-core-drilling"],
  "framing-carpentry": ["general-contractor", "adu-builders", "structural-steel-welding"],
  "structural-steel-welding": ["crane-service", "framing-carpentry", "concrete-masonry"],
  "fire-protection": ["plumbing", "low-voltage", "general-contractor"],
  "low-voltage": ["electrical", "ev-charger-installation", "fire-protection"],
  "concrete-pumping": ["concrete-masonry", "saw-cutting-core-drilling", "equipment-rental"],
  "saw-cutting-core-drilling": ["concrete-masonry", "demolition", "concrete-pumping"],
  "roll-off-dumpsters": ["demolition", "dump-truck-hauling", "site-services"],
  "equipment-rental": ["crane-service", "scaffolding", "site-services"],
  "land-surveying": ["excavation-services", "utility-contractors", "swppp-erosion-control"],
  "traffic-control": ["paving", "utility-contractors", "site-services"],
  "swppp-erosion-control": ["excavation-services", "land-surveying", "site-services"],
  "hydro-excavation": ["utility-contractors", "excavation-services", "saw-cutting-core-drilling"],
};

export function relatedTradeSlugs(slug: string): string[] {
  return RELATED_TRADES[slug] ?? [];
}
