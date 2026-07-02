-- ============================================================================
-- GUHAS GEMS AND JEWELLERIES — editable site banners
-- Announcement bar, homepage hero, and the promo cards, all managed from the
-- admin dashboard. Run once in the Supabase SQL Editor, after 0001_init.sql.
-- ============================================================================

create table if not exists public.site_banners (
  id          uuid primary key default gen_random_uuid(),
  slot        text not null,               -- 'announcement' | 'hero' | 'promo'
  eyebrow     text,
  title       text,
  subtitle    text,
  cta_label   text,
  cta_href    text,
  image_url   text,
  image_path  text,                        -- storage path, for cleanup on replace/delete
  is_active   boolean not null default true,
  sort_order  int     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists site_banners_slot_idx on public.site_banners(slot);

-- keep updated_at fresh (reuses the shared trigger fn from 0001_init.sql)
drop trigger if exists site_banners_set_updated_at on public.site_banners;
create trigger site_banners_set_updated_at
  before update on public.site_banners
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security
--   Banners hold no secrets, so anon may read every row (active OR inactive) —
--   the public site needs to see the inactive flag to honour an "off" toggle.
--   Only admins can write.
-- ----------------------------------------------------------------------------
alter table public.site_banners enable row level security;
drop policy if exists site_banners_read  on public.site_banners;
drop policy if exists site_banners_admin on public.site_banners;
create policy site_banners_read  on public.site_banners for select to anon          using (true);
create policy site_banners_admin on public.site_banners for all    to authenticated using (true) with check (true);

-- ----------------------------------------------------------------------------
-- Storage bucket for banner images (public read, admin write)
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('banner-images', 'banner-images', true)
on conflict (id) do nothing;

drop policy if exists "banner public read"  on storage.objects;
drop policy if exists "banner admin write"  on storage.objects;
drop policy if exists "banner admin update" on storage.objects;
drop policy if exists "banner admin delete" on storage.objects;

create policy "banner public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'banner-images');
create policy "banner admin write" on storage.objects
  for insert to authenticated with check (bucket_id = 'banner-images');
create policy "banner admin update" on storage.objects
  for update to authenticated using (bucket_id = 'banner-images');
create policy "banner admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'banner-images');

-- ----------------------------------------------------------------------------
-- Seed the current hard-coded content so the dashboard opens pre-filled.
-- Each insert is guarded so re-running the migration never duplicates rows.
-- ----------------------------------------------------------------------------
insert into public.site_banners (slot, title, is_active, sort_order)
select 'announcement', 'Book a private viewing at our Karur showroom.', true, 0
where not exists (select 1 from public.site_banners where slot = 'announcement');

insert into public.site_banners
  (slot, eyebrow, title, subtitle, cta_label, cta_href, image_url, is_active, sort_order)
select 'hero', 'New Arrivals', 'Crafted to Shine',
       'Our latest arrivals in solid gold and ethically sourced gemstones. Timeless pieces, crafted to be worn every day.',
       'Explore Collection', '/products', '/images/hero.png', true, 0
where not exists (select 1 from public.site_banners where slot = 'hero');

insert into public.site_banners (slot, eyebrow, title, cta_href, image_url, is_active, sort_order)
select 'promo', 'Must See New Style', 'Birthday Collection', '#', '/images/promo-birthday.png', true, 1
where not exists (select 1 from public.site_banners where slot = 'promo' and title = 'Birthday Collection');

insert into public.site_banners (slot, eyebrow, title, cta_href, image_url, is_active, sort_order)
select 'promo', 'New collection', 'Summer Essentials', '#', '/images/promo-summer.png', true, 2
where not exists (select 1 from public.site_banners where slot = 'promo' and title = 'Summer Essentials');
