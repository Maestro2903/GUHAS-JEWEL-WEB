-- ============================================================================
-- GUHAS GEMS AND JEWELLERIES — add a "metal" attribute to products.
-- Powers the Metal filter + sort on the public Collections page.
-- Run once in the Supabase SQL Editor, after 0001_init.sql.
-- ============================================================================

alter table public.products
  add column if not exists metal text;   -- e.g. 'Gold', 'Silver', 'Platinum', 'Diamond'

create index if not exists products_metal_idx on public.products(metal);
