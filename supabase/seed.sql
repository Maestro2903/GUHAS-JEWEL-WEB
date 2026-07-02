-- ============================================================================
-- ella jewelry — sample data (optional). Run once, after 0001_init.sql.
-- Products reference images already shipped in apps/web/public/images, so the
-- site looks populated before the owner uploads real photos in the dashboard.
-- ============================================================================

insert into public.categories (name, slug, sort_order) values
  ('Rings',     'rings',     1),
  ('Bracelets', 'bracelets', 2),
  ('Pendants',  'pendants',  3),
  ('Earrings',  'earrings',  4)
on conflict (slug) do nothing;

-- Seed products only if the table is currently empty.
do $$
begin
  if not exists (select 1 from public.products) then
    insert into public.products
      (name, description, price, image_url, category_id, is_featured, sort_order)
    values
      ('Diamond In Platinum',
       'A brilliant cushion-cut diamond cradled in hand-finished platinum.',
       1280.00, '/images/product-diamond-platinum.png',
       (select id from public.categories where slug = 'rings'), true, 1),

      ('Makers Slice Ring',
       'A sculptural solitaire with a softly tapered band.',
       940.00, '/images/product-makers-slice.png',
       (select id from public.categories where slug = 'rings'), true, 2),

      ('Nesting Band Ring',
       'A delicate rose-gold wishbone band, made to stack.',
       null, '/images/product-nesting-band.png',
       (select id from public.categories where slug = 'rings'), false, 3),

      ('Olive Leaf Band Ring',
       'Three graduated stones on a yellow-gold band.',
       1050.00, '/images/product-olive-leaf.png',
       (select id from public.categories where slug = 'rings'), false, 4),

      ('Pink Sapphire Halo Ring',
       'A cushion pink sapphire framed by a diamond halo in rose gold.',
       null, '/images/product-pink-sapphire.png',
       (select id from public.categories where slug = 'rings'), true, 5),

      ('Paperclip Chain Bracelet',
       'An everyday 18k gold paperclip-link bracelet.',
       340.00, '/images/product-paperclip.png',
       (select id from public.categories where slug = 'bracelets'), true, 6),

      ('Beaded Gold Bracelet',
       'Hand-strung polished gold beads with a secure clasp.',
       290.00, '/images/product-beaded.png',
       (select id from public.categories where slug = 'bracelets'), false, 7),

      ('Olive Leaf Pendant',
       'A luminous pendant on a fine gold chain.',
       null, '/images/gallery-2.png',
       (select id from public.categories where slug = 'pendants'), false, 8);
  end if;
end $$;

-- Seed reviews only if the table is currently empty.
do $$
begin
  if not exists (select 1 from public.reviews) then
    insert into public.reviews (author_name, location, rating, content, sort_order) values
      ('Aarohi Menon', 'Bengaluru', 5,
       'The craftsmanship is exquisite. My engagement ring from Guhas gets compliments everywhere I go.', 1),
      ('Priya Nair', 'Kochi', 5,
       'Beautiful pieces and the team made the whole experience feel personal and special.', 2),
      ('Rhea Kapoor', 'Mumbai', 5,
       'I bought a bracelet for my mother and the quality is outstanding. Will be back for more.', 3),
      ('Ananya Rao', 'Chennai', 4,
       'Elegant, timeless designs. The gold finish is gorgeous and feels substantial.', 4);
  end if;
end $$;
