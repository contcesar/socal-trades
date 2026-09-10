// Live Google data proxy for a single business.
//
// Takes ?place_id=... and returns { rating, userRatingCount, openNow, reviews }
// from the Places API (New). Per Google's terms we do NOT store review text or
// hours: the page fetches this fresh at view time. A short in-memory cache and
// a short CDN cache limit how many calls we make.
//
// Env: GOOGLE_MAPS_API_KEY (restricted to Places API (New), server-side only).

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const cache = new Map(); // place_id -> { at, body }

// Tight field mask keeps the response small and the SKU predictable.
const FIELD_MASK = [
  "rating",
  "userRatingCount",
  "currentOpeningHours.openNow",
  "reviews.rating",
  "reviews.text",
  "reviews.relativePublishTimeDescription",
  "reviews.authorAttribution",
].join(",");

const json = (status, body, cacheSeconds = 0) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": cacheSeconds
        ? `public, max-age=${cacheSeconds}`
        : "no-store",
    },
  });

export default async (req) => {
  const url = new URL(req.url);
  const placeId = url.searchParams.get("place_id");
  if (!placeId || !/^[A-Za-z0-9_-]{10,}$/.test(placeId)) {
    return json(400, { error: "Missing or invalid place_id" });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return json(503, { error: "Live data not configured" });

  // Serve from the warm-instance cache when fresh.
  const hit = cache.get(placeId);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return json(200, hit.body, 300);
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": FIELD_MASK,
        },
      },
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error("Places API error:", res.status, detail);
      return json(502, { error: "Upstream error" });
    }

    const data = await res.json();
    const body = {
      rating: typeof data.rating === "number" ? data.rating : null,
      userRatingCount: data.userRatingCount ?? 0,
      openNow: data.currentOpeningHours?.openNow ?? null,
      reviews: Array.isArray(data.reviews)
        ? data.reviews.slice(0, 5).map((r) => ({
            author: r.authorAttribution?.displayName ?? "Google user",
            rating: r.rating ?? null,
            text: r.text?.text ?? "",
            relativeTime: r.relativePublishTimeDescription ?? "",
          }))
        : [],
    };

    cache.set(placeId, { at: Date.now(), body });
    return json(200, body, 300);
  } catch (err) {
    console.error("place-details failed:", err);
    return json(502, { error: "Request failed" });
  }
};
