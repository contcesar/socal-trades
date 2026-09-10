-- Seed the 21 trade categories. Run after schema.sql. Slugs and icons match
-- src/lib/trades.ts so the swap to Supabase is seamless.
insert into trades (name, slug, icon, sort_order) values
  ('Plumbing', 'plumbing', 'droplet', 1),
  ('Electrical', 'electrical', 'bolt', 2),
  ('HVAC (Heating & Air)', 'hvac', 'wind', 3),
  ('Roofing', 'roofing', 'home', 4),
  ('General Contractor', 'general-contractor', 'hardhat', 5),
  ('Landscaping', 'landscaping', 'leaf', 6),
  ('Painting', 'painting', 'brush', 7),
  ('Flooring', 'flooring', 'grid', 8),
  ('Concrete & Masonry', 'concrete-masonry', 'brick', 9),
  ('Solar', 'solar', 'sun', 10),
  ('Pool & Spa', 'pool-spa', 'wave', 11),
  ('Fencing', 'fencing', 'fence', 12),
  ('Garage Doors', 'garage-doors', 'garage', 13),
  ('Handyman', 'handyman', 'wrench', 14),
  ('Pest Control', 'pest-control', 'bug', 15),
  ('Scaffolding', 'scaffolding', 'tower', 16),
  ('Home Improvement', 'home-improvement', 'house-tools', 17),
  ('Remodelers', 'remodelers', 'hammer', 18),
  ('Restoration Services', 'restoration-services', 'shield', 19),
  ('Utility Contractors', 'utility-contractors', 'plug', 20),
  ('Paving', 'paving', 'road', 21),
  ('Underground Utility Contractors', 'underground-utility-contractors', 'plug', 22),
  ('Site Utility Contractors', 'site-utility-contractors', 'road', 23),
  ('Site Services', 'site-services', 'hardhat', 24)
on conflict (slug) do nothing;
