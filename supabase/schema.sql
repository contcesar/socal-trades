-- SoCal Trades — Supabase schema
-- Run this in the Supabase SQL editor when your project is ready. The site's
-- data layer (src/lib/data.ts) reads these tables once you swap the seed for
-- Supabase queries. No Google review text or opening hours are stored here.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ---------------------------------------------------------------------------
-- Enum for publish status
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'business_status') then
    create type business_status as enum ('published', 'draft', 'hidden');
  end if;
end$$;

-- ---------------------------------------------------------------------------
-- Trades (categories)
-- ---------------------------------------------------------------------------
create table if not exists trades (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  icon        text not null default 'wrench',
  sort_order  int  not null default 0
);

-- ---------------------------------------------------------------------------
-- Businesses
-- ---------------------------------------------------------------------------
create table if not exists businesses (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  name              text not null,
  -- Categories are defined in the app (src/lib/trades.ts) and validated by the
  -- admin UI and the submit-company function, so `trade` is a plain slug with
  -- no foreign key. This lets categories change with a code deploy alone, with
  -- no matching database migration. (Older databases: run
  --   alter table businesses drop constraint if exists businesses_trade_fkey;)
  trade             text not null,
  secondary_trades  text[] not null default '{}',
  city              text not null,
  county            text not null,
  service_areas     text[] not null default '{}',
  keywords          text[] not null default '{}',
  address           text,
  latitude          double precision,
  longitude         double precision,
  phone             text,
  email             text,
  website           text,
  google_place_id   text,
  rating            real,
  review_count      integer,
  google_url        text,
  short_description text not null default '',
  long_description  text,
  logo_url          text,
  photo_urls        text[] not null default '{}',
  status            business_status not null default 'draft',
  claimable         boolean not null default true,
  featured          boolean not null default false,
  claimed_by        uuid references auth.users(id),
  claimed_at        timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Add keywords to an already-created table (no-op on a fresh install above).
alter table businesses add column if not exists keywords text[] not null default '{}';

-- Drop the old trade foreign key on already-created tables. Categories live in
-- the app now, so this constraint only blocked saving businesses under newly
-- added categories. No-op if it was never there.
alter table businesses drop constraint if exists businesses_trade_fkey;

-- Per-business "allow claiming" toggle on already-created tables (no-op fresh).
alter table businesses add column if not exists claimable boolean not null default true;

-- Admin "featured" flag on already-created tables (no-op fresh). Up to 4
-- companies are featured; the cap is enforced in the admin UI.
alter table businesses add column if not exists featured boolean not null default false;

create index if not exists businesses_trade_idx  on businesses(trade);
create index if not exists businesses_county_idx on businesses(county);
create index if not exists businesses_status_idx on businesses(status);
-- GIN index so keyword containment lookups stay fast if search moves server-side.
create index if not exists businesses_keywords_idx on businesses using gin(keywords);

-- ---------------------------------------------------------------------------
-- Claims (profile ownership requests)
-- ---------------------------------------------------------------------------
create table if not exists claims (
  id             uuid primary key default gen_random_uuid(),
  business_id    uuid not null references businesses(id) on delete cascade,
  email          text not null,
  token          text not null unique,
  domain_matched boolean not null default false,
  verified       boolean not null default false,
  created_at     timestamptz not null default now(),
  expires_at     timestamptz not null
);

create index if not exists claims_business_idx on claims(business_id);

-- ---------------------------------------------------------------------------
-- Subscribers (double opt-in email list)
-- ---------------------------------------------------------------------------
create table if not exists subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  confirmed     boolean not null default false,
  confirm_token text not null unique,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Admins — flag Supabase Auth users as admins
-- ---------------------------------------------------------------------------
create table if not exists admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER so this can read the admins table without being subject to
-- the admins RLS policy (which would otherwise recurse into is_admin()).
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- updated_at trigger for businesses
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists businesses_set_updated_at on businesses;
create trigger businesses_set_updated_at
  before update on businesses
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- The public site builds with the anon key and needs to read published
-- businesses and all trades. Everything else is admin/service-role only.
-- Claims and subscribers are written only by server-side functions using the
-- service role key, which bypasses RLS.
-- ---------------------------------------------------------------------------
alter table trades      enable row level security;
alter table businesses  enable row level security;
alter table claims      enable row level security;
alter table subscribers enable row level security;
alter table admins      enable row level security;

-- Trades: public read
drop policy if exists trades_public_read on trades;
create policy trades_public_read on trades
  for select using (true);

-- Businesses: public reads published only; admins read/write everything
drop policy if exists businesses_public_read on businesses;
create policy businesses_public_read on businesses
  for select using (status = 'published');

drop policy if exists businesses_admin_all on businesses;
create policy businesses_admin_all on businesses
  for all using (is_admin()) with check (is_admin());

-- A claimed owner may update their own listing (column limits enforced in app)
drop policy if exists businesses_owner_update on businesses;
create policy businesses_owner_update on businesses
  for update using (claimed_by = auth.uid()) with check (claimed_by = auth.uid());

-- Claims: admins only via client; functions use service role
drop policy if exists claims_admin_all on claims;
create policy claims_admin_all on claims
  for all using (is_admin()) with check (is_admin());

-- Subscribers: admins only via client; functions use service role
drop policy if exists subscribers_admin_all on subscribers;
create policy subscribers_admin_all on subscribers
  for all using (is_admin()) with check (is_admin());

-- Admins table: a user can read their own admin row (no recursion).
drop policy if exists admins_self_read on admins;
create policy admins_self_read on admins
  for select using (user_id = auth.uid());
