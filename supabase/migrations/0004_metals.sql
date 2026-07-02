-- ============================================================================
-- GUHAS GEMS AND JEWELLERIES — managed "metals" vocabulary.
-- Lets the owner add/edit/remove the metal options offered on products,
-- from the admin Categories page. Run after 0003_products_metal.sql.
-- ============================================================================

create table if not exists public.metals (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.metals enable row level security;
drop policy if exists metals_read  on public.metals;
drop policy if exists metals_admin on public.metals;
create policy metals_read  on public.metals for select to anon          using (true);
create policy metals_admin on public.metals for all    to authenticated using (true) with check (true);

-- Seed the starter options (skip any that already exist).
insert into public.metals (name, sort_order) values
  ('Gold', 1),
  ('Rose Gold', 2),
  ('White Gold', 3),
  ('Silver', 4),
  ('Platinum', 5),
  ('Diamond', 6)
on conflict (name) do nothing;
