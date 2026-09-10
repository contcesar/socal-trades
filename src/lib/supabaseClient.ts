// Client-side Supabase auth. Runs entirely in the browser: the anon key is
// public by design (row-level security protects data). Values come from
// build-time PUBLIC_ env vars, so they are baked into the auth pages only.
//
// Netlify env vars to set (safe to expose, they are the public pair):
//   PUBLIC_SUPABASE_URL
//   PUBLIC_SUPABASE_ANON_KEY
//
// Until those are set, isConfigured() is false and the login UI shows a notice
// instead of failing.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const anon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

/** A tiny localStorage flag the (SDK-free) header reads to show login state. */
export const AUTH_FLAG = "st_auth_email";

export function isConfigured(): boolean {
  return Boolean(url && anon);
}

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isConfigured()) return null;
  if (!client) {
    client = createClient(url!, anon!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // Magic links return tokens in the URL; parse them on the callback.
        detectSessionInUrl: true,
        flowType: "implicit",
      },
    });
  }
  return client;
}

/** Mirror the signed-in email into a light flag for the header. */
export function setAuthFlag(email: string | null): void {
  try {
    if (email) localStorage.setItem(AUTH_FLAG, email);
    else localStorage.removeItem(AUTH_FLAG);
  } catch {
    /* storage blocked; header just shows the logged-out state */
  }
}
