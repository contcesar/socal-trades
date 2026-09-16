// Email opt-in. Adds an address to the `subscribers` table. Called when a user
// ticks "email me updates" during signup (their email is already theirs, so we
// mark it confirmed). Safe to call again for the same email (ignored).
//
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  let data;
  try {
    data = await req.json();
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const email = String(data.email || "").trim().toLowerCase().slice(0, 160);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json(400, { error: "Invalid email" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.log("Subscribe (not persisted, Supabase unset):", email);
    return json(200, { status: "accepted", persisted: false });
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
      method: "POST",
      headers: {
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
        "Content-Type": "application/json",
        // Ignore duplicates on the unique email constraint.
        Prefer: "return=minimal,resolution=ignore-duplicates",
      },
      body: JSON.stringify({
        email,
        confirmed: true,
        confirm_token: crypto.randomUUID(),
      }),
    });
    if (!res.ok && res.status !== 409) {
      console.error("Subscribe insert failed:", res.status, await res.text());
      return json(502, { error: "Could not subscribe" });
    }
  } catch (err) {
    console.error("Subscribe error:", err);
    return json(502, { error: "Could not subscribe" });
  }
  return json(200, { status: "subscribed" });
};
