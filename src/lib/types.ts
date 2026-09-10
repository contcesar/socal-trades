// Shared types for the directory. These mirror the Supabase tables so the
// data layer can swap from the local seed to Supabase without touching pages.

export type BusinessStatus = "published" | "draft" | "hidden";

export interface Trade {
  id: string;
  name: string;
  slug: string;
  /** Icon keyword resolved by TradeIcon.astro. */
  icon: string;
  sort_order: number;
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  /** Trade slug (primary category). */
  trade: string;
  /** Optional extra trade slugs. */
  secondary_trades: string[];
  city: string;
  county: string;
  /** Cities/areas served beyond the home city. */
  service_areas: string[];
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  /** Permanent Google Places id. Live data is fetched via this at view time. */
  google_place_id: string | null;
  /** Manually entered rating (0–5) and review count, shown on cards/profile. */
  rating?: number | null;
  review_count?: number | null;
  short_description: string;
  long_description: string | null;
  logo_url: string | null;
  photo_urls: string[];
  status: BusinessStatus;
  claimed_by: string | null;
  claimed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface County {
  name: string;
  slug: string;
}
