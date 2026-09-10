import type { Trade } from "./types";

// The 21 launch categories. Seeded here now; the same rows go into the
// Supabase `trades` table later (see supabase/schema.sql).
export const TRADES: Trade[] = [
  { id: "t01", name: "Plumbing", slug: "plumbing", icon: "droplet", sort_order: 1 },
  { id: "t02", name: "Electrical", slug: "electrical", icon: "bolt", sort_order: 2 },
  { id: "t03", name: "HVAC (Heating & Air)", slug: "hvac", icon: "wind", sort_order: 3 },
  { id: "t04", name: "Roofing", slug: "roofing", icon: "home", sort_order: 4 },
  { id: "t05", name: "General Contractor", slug: "general-contractor", icon: "hardhat", sort_order: 5 },
  { id: "t06", name: "Landscaping", slug: "landscaping", icon: "leaf", sort_order: 6 },
  { id: "t07", name: "Painting", slug: "painting", icon: "brush", sort_order: 7 },
  { id: "t08", name: "Flooring", slug: "flooring", icon: "grid", sort_order: 8 },
  { id: "t09", name: "Concrete & Masonry", slug: "concrete-masonry", icon: "brick", sort_order: 9 },
  { id: "t10", name: "Solar", slug: "solar", icon: "sun", sort_order: 10 },
  { id: "t11", name: "Pool & Spa", slug: "pool-spa", icon: "wave", sort_order: 11 },
  { id: "t12", name: "Fencing", slug: "fencing", icon: "fence", sort_order: 12 },
  { id: "t13", name: "Garage Doors", slug: "garage-doors", icon: "garage", sort_order: 13 },
  { id: "t14", name: "Handyman", slug: "handyman", icon: "wrench", sort_order: 14 },
  { id: "t15", name: "Pest Control", slug: "pest-control", icon: "bug", sort_order: 15 },
  { id: "t16", name: "Scaffolding", slug: "scaffolding", icon: "tower", sort_order: 16 },
  { id: "t17", name: "Home Improvement", slug: "home-improvement", icon: "house-tools", sort_order: 17 },
  { id: "t18", name: "Remodelers", slug: "remodelers", icon: "hammer", sort_order: 18 },
  { id: "t19", name: "Restoration Services", slug: "restoration-services", icon: "shield", sort_order: 19 },
  { id: "t20", name: "Utility Contractors", slug: "utility-contractors", icon: "plug", sort_order: 20 },
  { id: "t21", name: "Paving", slug: "paving", icon: "road", sort_order: 21 },
  { id: "t22", name: "Underground Utility Contractors", slug: "underground-utility-contractors", icon: "plug", sort_order: 22 },
  { id: "t23", name: "Site Utility Contractors", slug: "site-utility-contractors", icon: "road", sort_order: 23 },
  { id: "t24", name: "Site Services", slug: "site-services", icon: "hardhat", sort_order: 24 },
];
