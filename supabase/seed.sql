-- Seed the 21 trade categories. Run after schema.sql. Slugs and icons match
-- src/lib/trades.ts so the swap to Supabase is seamless.
insert into trades (name, slug, icon, sort_order) values
  ('Plumbing', 'plumbing', 'droplet', 1),
  ('Electrical', 'electrical', 'bolt', 2),
  ('HVAC (Heating & Air)', 'hvac', 'wind', 3),
  ('Roofing', 'roofing', 'home', 4),
  ('General Contractor', 'general-contractor', 'hammer', 5),
  ('Landscaping', 'landscaping', 'leaf', 6),
  ('Painting', 'painting', 'brush', 7),
  ('Flooring', 'flooring', 'grid', 8),
  ('Concrete & Masonry', 'concrete-masonry', 'brick', 9),
  ('Fencing', 'fencing', 'fence', 12),
  ('Garage Doors', 'garage-doors', 'garage', 13),
  ('Power Generator Services', 'generator-services', 'generator', 15),
  ('Scaffolding', 'scaffolding', 'tower', 16),
  ('Excavation Services', 'excavation-services', 'excavator', 17),
  ('Remodelers', 'remodelers', 'hammer', 18),
  ('Restoration Services', 'restoration-services', 'shield', 19),
  ('Utility Contractors', 'utility-contractors', 'plug', 20),
  ('Paving', 'paving', 'road', 21),
  ('Site Services', 'site-services', 'porta-potty', 24),
  ('Dump Truck Hauling Service', 'dump-truck-hauling', 'dump-truck', 25),
  ('Crane Service', 'crane-service', 'crane', 26)
on conflict (slug) do nothing;
