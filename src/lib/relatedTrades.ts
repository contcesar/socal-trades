// Related-trade map for internal linking. Each key is a trade slug; the values
// are other trade slugs a customer on that page might also need. All values
// must be real slugs from src/lib/trades.ts.
export const RELATED_TRADES: Record<string, string[]> = {
  plumbing: ["hvac", "remodelers", "general-contractor"],
  electrical: ["hvac", "generator-services", "general-contractor"],
  hvac: ["electrical", "plumbing", "general-contractor"],
  roofing: ["general-contractor", "painting", "restoration-services"],
  "general-contractor": ["remodelers", "plumbing", "electrical"],
  landscaping: ["concrete-masonry", "fencing", "paving"],
  painting: ["general-contractor", "remodelers", "roofing"],
  flooring: ["remodelers", "general-contractor", "painting"],
  "concrete-masonry": ["paving", "fencing", "landscaping"],
  fencing: ["landscaping", "concrete-masonry", "garage-doors"],
  "garage-doors": ["general-contractor", "fencing", "electrical"],
  "generator-services": ["electrical", "hvac", "utility-contractors"],
  scaffolding: ["general-contractor", "painting", "roofing"],
  "excavation-services": ["utility-contractors", "paving", "concrete-masonry"],
  remodelers: ["general-contractor", "plumbing", "flooring"],
  "restoration-services": ["roofing", "remodelers", "general-contractor"],
  "utility-contractors": ["excavation-services", "paving", "site-services"],
  paving: ["concrete-masonry", "excavation-services", "utility-contractors"],
  "site-services": ["utility-contractors", "excavation-services", "dump-truck-hauling"],
  "dump-truck-hauling": ["excavation-services", "site-services", "paving"],
  "crane-service": ["scaffolding", "general-contractor", "excavation-services"],
};

export function relatedTradeSlugs(slug: string): string[] {
  return RELATED_TRADES[slug] ?? [];
}
