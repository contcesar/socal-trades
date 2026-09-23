// "Get featured" advertising enquiry. Verifies Turnstile, then emails the
// details to the admin via Resend. When Resend isn't configured, logs it and
// still confirms so the form never appears broken.
//
// Env: RESEND_API_KEY, EMAIL_FROM, ADMIN_ALLOWED_EMAILS (first entry = to),
//      TURNSTILE_SECRET_KEY (optional bot check)

const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret,
          response: token,
          ...(ip ? { remoteip: ip } : {}),
        }),
      },
    );
    const out = await res.json();
    return Boolean(out.success);
  } catch {
    return false;
  }
}

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  let data;
  try {
    data = await req.json();
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const ip =
    req.headers.get("x-nf-client-connection-ip") ||
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  if (!(await verifyTurnstile(data["cf-turnstile-response"], ip))) {
    return json(400, { error: "Bot check failed. Please try again." });
  }

  const name = clean(data.name, 120);
  const phone = clean(data.phone, 40);
  const email = clean(data.email, 160);
  const company = clean(data.company, 160);
  const website = clean(data.website, 200);
  const wantFeatured = data.wantFeatured === true || data.wantFeatured === "on";

  if (!name || !phone || !email) {
    return json(400, { error: "Name, phone, and email are required." });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json(400, { error: "Please enter a valid email." });
  }

  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = (process.env.ADMIN_ALLOWED_EMAILS || "").split(",")[0]?.trim();
  const text =
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Email: ${email}\n` +
    `Company: ${company || "(not given)"}\n` +
    `Website: ${website || "(not given)"}\n` +
    `Wants to be featured: ${wantFeatured ? "Yes" : "No"}`;

  if (key && from && to) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to,
          reply_to: email,
          subject: `Featured enquiry: ${company || name}`,
          text,
        }),
      });
      if (!res.ok) {
        console.error("Resend featured send failed:", res.status, await res.text());
        return json(502, { error: "Could not send your enquiry." });
      }
    } catch (err) {
      console.error("Featured send error:", err);
      return json(502, { error: "Could not send your enquiry." });
    }
    return json(200, { status: "sent" });
  }

  console.log("Featured submission (email not configured):", {
    name,
    phone,
    email,
    company,
    website,
    wantFeatured,
  });
  return json(200, { status: "accepted" });
};
