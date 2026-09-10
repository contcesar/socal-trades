# Google Places API (New) — setup

This gets you the `GOOGLE_MAPS_API_KEY` used by the Phase 2 `place-details`
function for live ratings, review snippets, and the Open now / Closed badge.
Budget is protected with a hard quota cap and a billing alert.

## 1. Create a Google Cloud project

1. Go to https://console.cloud.google.com and sign in.
2. Top bar, click the project dropdown, then "New Project".
3. Name it `socal-trades`. Create it and select it.

## 2. Turn on billing (required, still free at your scale)

Google requires a billing account with a card on file even to use the free
tier. You will not be charged inside the free monthly call limits.

1. Left menu, "Billing".
2. Link or create a billing account. Add a card.

## 3. Enable the Places API (New)

1. Left menu, "APIs & Services" then "Library".
2. Search for "Places API (New)". Open it and click "Enable".
3. Make sure it is the one labeled "(New)", not the older "Places API".

## 4. Create the API key

1. "APIs & Services" then "Credentials".
2. "Create credentials" then "API key".
3. Copy the key. You will paste it into Netlify in step 7.

## 5. Restrict the key

We call Google from a Netlify Function (server side), so the key never touches
the browser. Referrer restrictions are for browser keys and do not apply here,
so lock it down by API instead and keep it server-only.

1. On the key, "Edit API key".
2. Under "API restrictions", choose "Restrict key" and select only
   "Places API (New)".
3. Under "Application restrictions", leave "None" (server-side calls have no
   fixed referrer or IP on Netlify). The protection is: key stays server-only +
   API restriction + the quota cap in the next step.
4. Save.

## 6. Cap spending so it can never surprise you

Two safety nets.

Quota cap (a hard stop):
1. "APIs & Services" then "Places API (New)" then "Quotas & System Limits".
2. Set the requests-per-day limit low to start, for example 500/day. Requests
   above the cap are refused, not billed.

Budget alert (a heads-up):
1. "Billing" then "Budgets & alerts" then "Create budget".
2. Set a small monthly amount, for example $5, with email alerts at 50/90/100%.

## 7. Add the key to Netlify

1. Netlify dashboard, your site, "Site configuration" then
   "Environment variables".
2. Add `GOOGLE_MAPS_API_KEY` with the key value. Save.
3. Redeploy so the functions pick it up.

## 8. Find a place_id for each business

Each business needs its Google `google_place_id` stored (permanent, allowed).

- Use Google's Place ID finder:
  https://developers.google.com/maps/documentation/places/web-service/place-id
- Search the business, copy the Place ID (starts with `ChIJ...`).
- In Phase 4 the admin form saves it per business. For now, send me the
  place_ids and I can add them to the seed.

## Notes on cost tier

- Free monthly calls reset on the 1st, no rollover.
- Ratings and reviews sit in the Enterprise tier: 1,000 free calls/month.
- Our function uses a tight field mask and short caching, and only calls when a
  profile is viewed, so a new directory stays well under the free limit.
