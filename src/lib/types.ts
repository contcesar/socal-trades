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
  /**
   * Free-form keywords/tags the company enters (services, specialties, brands
   * they work with). Indexed for search so customers can find them by the
   * words they actually type, not just the trade name.
   */
  keywords?: string[];
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
  /** Link to the company's Google Business Profile / Maps listing. */
  google_url?: string | null;
  short_description: string;
  long_description: string | null;
  logo_url: string | null;
  photo_urls: string[];
  status: BusinessStatus;
  /**
   * Admin-picked "featured" flag. Up to 4 companies can be featured; they sort
   * to the top of the home carousel and render with a highlighted card. The
   * cap is enforced in the admin UI, not the type.
   */
  featured?: boolean;
  /**
   * Whether visitors may claim this profile. Admin-controlled. Undefined/true
   * means claimable (the default); false hides the claim option.
   */
  claimable?: boolean;
  claimed_by: string | null;
  claimed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface County {
  name: string;
  slug: string;
}
