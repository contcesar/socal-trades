// Read the Cloudflare Turnstile token that the widget injects into a form as a
// hidden input. Returns undefined when Turnstile is not active (no widget).
export function turnstileToken(form: HTMLFormElement): string | undefined {
  const el = form.querySelector<HTMLInputElement>(
    '[name="cf-turnstile-response"]',
  );
  const v = el?.value?.trim();
  return v ? v : undefined;
}
