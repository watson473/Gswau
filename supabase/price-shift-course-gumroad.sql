-- Link The Price Shift COURSE to its own Gumroad product (gswau.gumroad.com/l/vlepqs, $97).
-- A Gumroad sale of vlepqs then unlocks this course only (see public.has_access), for the
-- buyer's email, as soon as they sign in. The audiobook (the-price-shift, Gumroad ogijmt,
-- $23.99) is not touched. Same effect as setting "Gumroad permalink" on the course in Admin.
-- Run once in the Supabase SQL editor.
update public.products
set gumroad_permalink = 'vlepqs'
where slug = 'the-price-shift-course'
  and type = 'course'
  and gumroad_permalink is null;

-- Expect one row: the course, linked to vlepqs. The audiobook should still show ogijmt.
select slug, type, access_tier, price_cents, gumroad_permalink
from public.products
where slug in ('the-price-shift-course', 'the-price-shift');
