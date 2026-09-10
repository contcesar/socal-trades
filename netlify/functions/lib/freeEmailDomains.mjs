// Server-side copy of the free/consumer/disposable email domains. Keep in sync
// with src/lib/emailDomain.ts.
export const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com",
  "yahoo.com", "yahoo.co.uk", "yahoo.ca", "ymail.com", "rocketmail.com",
  "hotmail.com", "hotmail.co.uk", "outlook.com", "live.com", "msn.com",
  "icloud.com", "me.com", "mac.com",
  "aol.com", "aim.com",
  "protonmail.com", "proton.me", "pm.me",
  "gmx.com", "gmx.net", "mail.com", "yandex.com", "yandex.ru",
  "comcast.net", "sbcglobal.net", "att.net", "verizon.net", "cox.net",
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com",
  "temp-mail.org", "trashmail.com", "yopmail.com", "sharklasers.com",
  "getnada.com", "dispostable.com", "throwawaymail.com", "fakeinbox.com",
]);

export function isBusinessEmail(email) {
  const d = (String(email).split("@")[1] || "").trim().toLowerCase();
  return d.includes(".") && !FREE_EMAIL_DOMAINS.has(d);
}
