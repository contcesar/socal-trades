// Admin-only endpoint to trigger a Netlify build (regenerate static pages after
// data changes). The caller must send their Supabase access token; we verify it
// and confirm the user is in the `admins` table before hitting the build hook.
//
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NETLIFY_BUILD_HOOK_URL

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const HOOK = process.env.NETLIFY_BUILD_HOOK_URL;
  if (!SUPABASE_URL || !SERVICE_ROLE || !HOOK) {
    return json(503, { error: "Rebuild not configured" });
  }

  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return json(401, { error: "Not authenticated" });

  try {
    // Who is this token? Ask Supabase Auth.
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) return json(401, { error: "Invalid session" });
    const user = await userRes.json();
    if (!user?.id) return json(401, { error: "Invalid session" });

    // Is this user an admin?
    const adminRes = await fetch(
      `${SUPABASE_URL}/rest/v1/admins?user_id=eq.${user.id}&select=user_id`,
      {
        headers: {
          apikey: SERVICE_ROLE,
          Authorization: `Bearer ${SERVICE_ROLE}`,
        },
      },
    );
    const rows = adminRes.ok ? await adminRes.json() : [];
    if (!Array.isArray(rows) || rows.length === 0) {
      return json(403, { error: "Admins only" });
    }

    // Fire the build hook.
    const hookRes = await fetch(HOOK, { method: "POST" });
    if (!hookRes.ok) return json(502, { error: "Build hook failed" });
    return json(200, { status: "rebuild triggered" });
  } catch (err) {
    console.error("trigger-rebuild failed:", err);
    return json(502, { error: "Request failed" });
  }
};
