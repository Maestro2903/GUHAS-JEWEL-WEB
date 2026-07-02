-- ============================================================================
-- ella jewelry — CMS schema, RLS, and storage
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------------

create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text,
  price        numeric(12,2),                 -- nullable: shown only when set
  image_url    text,                          -- public URL (Supabase Storage or /images/*)
  image_path   text,                          -- storage path, for cleanup on delete
  category_id  uuid references public.categories(id) on delete set null,
  is_featured  boolean not null default false,
  is_published boolean not null default true,
  sort_order   int     not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists products_category_idx  on public.products(category_id);
create index if not exists products_published_idx on public.products(is_published);

create table if not exists public.reviews (
  id           uuid primary key default gen_random_uuid(),
  author_name  text not null,
  location     text,
  rating       int  not null default 5 check (rating between 1 and 5),
  content      text not null,
  avatar_url   text,
  avatar_path  text,
  is_published boolean not null default true,
  sort_order   int     not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  message     text not null,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- keep products.updated_at current
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security
--   anon          = the public website (publishable key, no user session)
--   authenticated = a logged-in admin in the dashboard
-- ----------------------------------------------------------------------------

alter table public.categories       enable row level security;
alter table public.products         enable row level security;
alter table public.reviews          enable row level security;
alter table public.contact_messages enable row level security;

-- categories: anyone can read; admins manage
drop policy if exists categories_read  on public.categories;
drop policy if exists categories_admin on public.categories;
create policy categories_read  on public.categories for select to anon                using (true);
create policy categories_admin on public.categories for all    to authenticated      using (true) with check (true);

-- products: public reads only published; admins read/write everything
drop policy if exists products_read_published on public.products;
drop policy if exists products_admin          on public.products;
create policy products_read_published on public.products for select to anon          using (is_published = true);
create policy products_admin          on public.products for all    to authenticated using (true) with check (true);

-- reviews: public reads only published; admins read/write everything
drop policy if exists reviews_read_published on public.reviews;
drop policy if exists reviews_admin          on public.reviews;
create policy reviews_read_published on public.reviews for select to anon            using (is_published = true);
create policy reviews_admin          on public.reviews for all    to authenticated   using (true) with check (true);

-- contact_messages: public can submit; only admins can read/manage
drop policy if exists contact_insert_public on public.contact_messages;
drop policy if exists contact_admin         on public.contact_messages;
create policy contact_insert_public on public.contact_messages for insert to anon, authenticated with check (true);
create policy contact_admin         on public.contact_messages for all    to authenticated      using (true) with check (true);

-- ----------------------------------------------------------------------------
-- Storage buckets (public read) + write policies for admins
-- ----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('review-avatars', 'review-avatars', true)
on conflict (id) do nothing;

drop policy if exists "media public read"  on storage.objects;
drop policy if exists "media admin write"   on storage.objects;
drop policy if exists "media admin update"  on storage.objects;
drop policy if exists "media admin delete"  on storage.objects;

create policy "media public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id in ('product-images', 'review-avatars'));

create policy "media admin write" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('product-images', 'review-avatars'));

create policy "media admin update" on storage.objects
  for update to authenticated
  using (bucket_id in ('product-images', 'review-avatars'));

create policy "media admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id in ('product-images', 'review-avatars'));
