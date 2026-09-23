// Serves the "Find us on SoCal Trades" badge at /badges/featured.svg and logs
// each request (slug, referrer, date) so we can see which companies display it.
// The image itself is the uploaded artwork at public/badge.svg; this function
// fetches that static file and returns it, so updating badge.svg updates the
// badge everywhere. Missing or unknown slugs still get the image.
//
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (for logging only).
export const config = { path: "/badges/featured.svg" };

// Minimal fallback if the static file can't be fetched for some reason.
const FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="51" viewBox="0 0 200 51" role="img" aria-label="Find us on SoCal Trades"><rect x="1.5" y="1.5" width="197" height="48" rx="10" fill="#ffffff" stroke="#12417F" stroke-width="3"/><text x="100" y="31" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="16" fill="#12417F">Find us on SoCal Trades</text></svg>`;

async function logView(slug, referrer) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_ROLE) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/badge_events`, {
      method: "POST",
      headers: {
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ slug: slug || null, referrer: referrer || null }),
    });
  } catch {
    // Best-effort logging; never block the image.
  }
}

export default async (req) => {
  const url = new URL(req.url);
  const slug = (url.searchParams.get("b") || "").slice(0, 200);
  const referrer = req.headers.get("referer") || "";

  // Fire-and-forget the log so it can't slow the image response.
  logView(slug, referrer);

  let svg = FALLBACK_SVG;
  try {
    const res = await fetch(new URL("/badge.svg", url.origin).href);
    if (res.ok) svg = await res.text();
  } catch {
    // Use the fallback.
  }

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
