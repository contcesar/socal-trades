# SoCal Trades

A directory of trades companies in Southern California. Each listing is one
business with its own profile page, star rating, and reviews.

## Stack

- **Astro** (static output) + **Tailwind CSS v4** for the site
- **Netlify** for hosting + **Netlify Functions** for dynamic pieces
- **Supabase** (Postgres + Auth) as the single source of truth
- **Resend** for verification and notification emails
- **Google Places API (New)** for live ratings, reviews, and open/closed status
- **Fuse.js** for instant client-side search

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs static site to dist/
npm run preview
```

Copy `.env.example` to `.env` and fill in values for local work. Real secrets
live in the Netlify dashboard, never in the repo.

## Data ownership rules (important)

- Store each business's Google `place_id` permanently.
- **Do not** store Google review text or opening hours in the database. Fetch
  them fresh at view time through a Netlify Function that proxies the Places
  API. A rating number may be cached briefly for build-time display, but the
  page shows live data.

## Phases

- **Phase 0 (done):** scaffold, Tailwind + brand tokens, Netlify config, blank
  site deploying.
- **Phase 1 (done):** static directory (home, trade, county, city, combined,
  profile pages); client-side Fuse.js search; SEO (LocalBusiness JSON-LD,
  sitemap, robots); support pages. Data comes from a swappable layer
  (`src/lib/data.ts`) backed by a local seed today; swap to Supabase by editing
  that one module. Table SQL lives in `supabase/schema.sql` + `supabase/seed.sql`.
- **Phase 2:** live Google Places data (rating + open/closed island).
- **Phase 3:** profile claim with email domain match + verification.
- **Phase 4:** admin backend (CRUD, claims, subscribers, rebuild button).
- **Phase 5:** email opt-in (double opt-in) + notify-subscribers.

## Brand

- Primary blue `#1a417a` (`brand-blue`)
- Accent red `#d85153` (`brand-red`) — large/decorative only; use
  `brand-red-dark` `#b83d40` for normal-size text and solid buttons (AA safe)
- Background cream `#f9f4e9` (`brand-cream`)
