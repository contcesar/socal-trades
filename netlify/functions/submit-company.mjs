// Public "List your company" submission endpoint.
//
// Creates a DRAFT business (status='draft') that the admin reviews and publishes
// (Phase 4). When Supabase env vars are present it writes to the `businesses`
// table via the REST API using the service role key. Until Supabase is
// configured, it logs the submission to the function log and still returns
// success, so nothing is silently lost and the UI flow works.
//
// Env used (set in Netlify, never committed):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   -> persist the draft
//   RESEND_API_KEY, EMAIL_FROM, ADMIN_ALLOWED_EMAILS -> optional admin notice

import { isBusinessEmail } from "./lib/freeEmailDomains.mjs";

const TRADE_SLUGS = new Set([
  "plumbing", "electrical", "hvac", "roofing", "general-contractor",
  "landscaping", "painting", "flooring", "concrete-masonry", "solar",
  "pool-spa", "fencing", "garage-doors", "handyman", "pest-control",
  "scaffolding", "home-improvement", "remodelers", "restoration-services",
  "utility-contractors", "paving", "underground-utility-contractors",
  "site-utility-contractors", "site-services",
]);

const COUNTIES = new Set([
  "Los Angeles", "Orange", "San Diego", "Riverside", "San Bernardino",
  "Ventura", "Imperial", "Kern",
]);

function slugify(input) {
  return String(input)
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const clean = (v, max) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

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

  const name = clean(data.name, 120);
  const trade = clean(data.trade, 60);
  const county = clean(data.county, 60);
  const city = clean(data.city, 80);
  const email = clean(data.email, 160).toLowerCase();
  const phone = clean(data.phone, 40);
  const website = clean(data.website, 200);
  const shortDescription = clean(data.short_description, 200);

  // Validation
  if (!name || !trade || !county || !city || !email) {
    return json(400, { error: "Missing required fields" });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json(400, { error: "Invalid email" });
  }
  if (!isBusinessEmail(email)) {
    return json(400, {
      error:
        "Please use a company email that matches your business website. If you only have a personal email, email hello@socaltrades.net and we will add your business for you.",
    });
  }
  if (!TRADE_SLUGS.has(trade)) return json(400, { error: "Unknown trade" });
  if (!COUNTIES.has(county)) return json(400, { error: "Unknown county" });

  const record = {
    slug: `${slugify(name) || "company"}-${crypto.randomUUID().slice(0, 5)}`,
    name,
    trade,
    county,
    city,
    email,
    phone: phone || null,
    website: website || null,
    short_description: shortDescription,
    status: "draft",
  };

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (SUPABASE_URL && SERVICE_ROLE) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/businesses`, {
        method: "POST",
        headers: {
          apikey: SERVICE_ROLE,
          Authorization: `Bearer ${SERVICE_ROLE}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(record),
      });
      if (!res.ok) {
        const detail = await res.text();
        console.error("Supabase insert failed:", res.status, detail);
        return json(502, { error: "Could not save submission" });
      }
    } catch (err) {
      console.error("Supabase request error:", err);
      return json(502, { error: "Could not save submission" });
    }
    await notifyAdmin(record);
    return json(200, { status: "accepted", persisted: true });
  }

  // Supabase not configured yet: capture in the function log so the submission
  // is recoverable, and still confirm to the user.
  console.log("New company submission (not persisted, Supabase unset):", record);
  return json(200, { status: "accepted", persisted: false });
};

async function notifyAdmin(record) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = (process.env.ADMIN_ALLOWED_EMAILS || "").split(",")[0]?.trim();
  if (!key || !from || !to) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `New company submission: ${record.name}`,
        text: `A new company was submitted for review.\n\n${JSON.stringify(record, null, 2)}`,
      }),
    });
  } catch (err) {
    console.error("Admin notify failed (non-fatal):", err);
  }
}
