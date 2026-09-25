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
};

export function relatedTradeSlugs(slug: string): string[] {
  return RELATED_TRADES[slug] ?? [];
}
