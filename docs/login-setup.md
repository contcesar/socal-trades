# Login setup (email + password)

Login uses Supabase Auth, entirely in the browser. It turns on once these are
set. Until then the login page shows a "not switched on yet" notice.

## Email confirmation (important right now)

By default Supabase requires new users to confirm their email before they can
log in, which needs working email delivery. While email is not set up:

- Supabase → Authentication → Providers → Email → turn **Confirm email OFF** so
  sign up works without email. Login and sign up then need no email at all.
- Password reset still sends an email, so it only works once email delivery is
  connected (see step 4).

Once you connect SMTP (step 4), turn Confirm email back ON so new accounts are
verified.

## 1. Create the Supabase project

If you have not yet, create a project at https://supabase.com and run
`supabase/schema.sql` then `supabase/seed.sql` in the SQL editor. The `admins`
table from the schema is what unlocks the admin link on the account page.

## 2. Netlify environment variables

In Netlify: Site configuration → Environment variables. Add the public pair
(safe to expose; row-level security protects the data):

- `PUBLIC_SUPABASE_URL` = your project URL (Supabase → Project Settings → API)
- `PUBLIC_SUPABASE_ANON_KEY` = the anon public key (same page)

Redeploy so the build bakes them in.

## 3. Supabase Auth URLs

Supabase → Authentication → URL Configuration:

- Site URL: `https://socaltrades.net`
- Additional redirect URLs: add each of these, with the `https://` scheme:
  - `https://socaltrades.net/auth/callback`
  - `https://socaltrades.net/reset`
  - `https://<your-site>.netlify.app/auth/callback`
  - `https://<your-site>.netlify.app/reset`

`/auth/callback` is used by the sign-up confirmation email, `/reset` by the
password-reset email. Without these on the list, those links are rejected.

## 4. Email delivery (recommended for production)

Supabase's built-in email sender is rate-limited and meant for testing. For
real traffic, connect your own SMTP under Authentication → Emails → SMTP. You
can point this at Resend (the same account used for other emails).

## 5. Make yourself an admin

After you log in once, find your user id in Supabase → Authentication → Users,
then in the SQL editor:

```sql
insert into admins (user_id) values ('<your-user-uuid>');
```

Reload the account page and the "Go to admin" link appears (the admin backend
itself is Phase 4).

## How it works

- Sign up creates an account with email + password (`signUp`). Log in uses
  `signInWithPassword`. Forgot password sends a reset link to `/reset`.
- The sign-up confirmation link (when Confirm email is on) returns to
  `/auth/callback`, which stores the session and routes the user on.
- The header shows "Log in / Sign up" or "Account" based on a small localStorage
  flag, so directory pages never load the auth SDK and stay fast.
