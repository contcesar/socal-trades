// Business-email gate. A "business email" is any address whose domain is NOT a
// known free / consumer / disposable provider. Used to keep business-owner
// signups and public company submissions to work emails (admins bypass this
// and can add anyone).
//
// NOTE: netlify/functions/lib/freeEmailDomains.mjs keeps a copy of this list
// for the server side. Update both together.
export const FREE_EMAIL_DOMAINS: Set<string> = new Set([
  // consumer providers
  "gmail.com", "googlemail.com",
  "yahoo.com", "yahoo.co.uk", "yahoo.ca", "ymail.com", "rocketmail.com",
  "hotmail.com", "hotmail.co.uk", "outlook.com", "live.com", "msn.com",
  "icloud.com", "me.com", "mac.com",
  "aol.com", "aim.com",
  "protonmail.com", "proton.me", "pm.me",
  "gmx.com", "gmx.net", "mail.com", "yandex.com", "yandex.ru",
  "comcast.net", "sbcglobal.net", "att.net", "verizon.net", "cox.net",
  // disposable / throwaway
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com",
  "temp-mail.org", "trashmail.com", "yopmail.com", "sharklasers.com",
  "getnada.com", "dispostable.com", "throwawaymail.com", "fakeinbox.com",
]);

export function emailDomain(email: string): string {
  return (email.split("@")[1] || "").trim().toLowerCase();
}

/** True for free/consumer/disposable domains. */
export function isFreeEmail(email: string): boolean {
  return FREE_EMAIL_DOMAINS.has(emailDomain(email));
}

/** True for a plausible business email: a real domain that is not free. */
export function isBusinessEmail(email: string): boolean {
  const d = emailDomain(email);
  return d.includes(".") && !FREE_EMAIL_DOMAINS.has(d);
}
