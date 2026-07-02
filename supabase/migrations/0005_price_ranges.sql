-- ============================================================================
-- GUHAS GEMS AND JEWELLERIES — managed price bands for the Collections filter.
-- Editable from the admin Categories page. Run after 0001_init.sql.
-- ============================================================================

create table if not exists public.price_ranges (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  min_value   numeric(12,2) not null default 0,
  max_value   numeric(12,2),                 -- null = no upper bound ("and above")
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.price_ranges enable row level security;
drop policy if exists price_ranges_read  on public.price_ranges;
drop policy if exists price_ranges_admin on public.price_ranges;
create policy price_ranges_read  on public.price_ranges for select to anon          using (true);
create policy price_ranges_admin on public.price_ranges for all    to authenticated using (true) with check (true);

-- Seed the starter bands (only when the table is empty).
insert into public.price_ranges (label, min_value, max_value, sort_order)
select * from (values
  ('Under ₹5,000',      0::numeric,       5000::numeric,   1),
  ('₹5k – ₹25k',        5000::numeric,    25000::numeric,  2),
  ('₹25k – ₹50k',       25000::numeric,   50000::numeric,  3),
  ('₹50k – ₹1L',        50000::numeric,   100000::numeric, 4),
  ('₹1L – ₹2.5L',       100000::numeric,  250000::numeric, 5),
  ('Above ₹2.5L',       250000::numeric,  null::numeric,   6)
) as v(label, min_value, max_value, sort_order)
where not exists (select 1 from public.price_ranges);
