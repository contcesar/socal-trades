# Login setup (magic link)

Login uses Supabase Auth, entirely in the browser. It turns on once these are
set. Until then the login page shows a "not switched on yet" notice.

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
- Additional redirect URLs: add
  `https://socaltrades.net/auth/callback` and your Netlify preview URL
  `https://<your-site>.netlify.app/auth/callback`

Without the callback URL on this list, the login link will be rejected.

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

- The login page sends a one-time link to the email (`signInWithOtp`).
- The link returns to `/auth/callback`, which stores the session and sends the
  user to `/account`.
- The header shows "Log in" or "Account" based on a small localStorage flag, so
  directory pages never load the auth SDK and stay fast.
