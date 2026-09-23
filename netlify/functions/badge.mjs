// Serves the "Find us on SoCal Trades" badge at /badges/featured.svg and logs
// each request (slug, referrer, date) so we can see which companies display it.
// Missing or unknown slugs still get the image. Logging is best-effort and
// env-gated; the image is always returned.
//
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (for logging only).
export const config = { path: "/badges/featured.svg" };

const BADGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="60" viewBox="0 0 160 60" role="img" aria-label="Find us on SoCal Trades">
  <rect x="1.5" y="1.5" width="157" height="57" rx="11" fill="#ffffff" stroke="#12417F" stroke-width="3"/>
  <text x="80" y="25" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" letter-spacing="0.5" fill="#4B5563">Find us on</text>
  <text x="80" y="45" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="18" fill="#12417F">SoCal Trades</text>
</svg>`;

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

  return new Response(BADGE_SVG, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
