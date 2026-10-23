-- Subscriber access, product details, per-product review ratings and the podcast.

alter table public.products
  add column file_size_label text,
  add column length_label text,
  add column gallery_urls text[] not null default '{}',
  add column included_with_subscription boolean not null default false;

create table public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'canceled')),
  started_at timestamptz not null default now(),
  current_period_end timestamptz,
  provider text, provider_ref text
);
grant select, insert, update, delete on public.subscriptions to authenticated;
grant all on public.subscriptions to service_role;
alter table public.subscriptions enable row level security;
create policy "subscriptions read" on public.subscriptions for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "subscriptions admin" on public.subscriptions for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.has_subscription(_user uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.subscriptions s
    where s.user_id = _user and s.status = 'active' and (s.current_period_end is null or s.current_period_end > now())) $$;
grant execute on function public.has_subscription(uuid) to authenticated;

create or replace function public.has_access(_product uuid) returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(auth.uid(),'admin')
    or exists (select 1 from public.products p where p.id = _product and p.is_free)
    or exists (select 1 from public.products p where p.id = _product and p.included_with_subscription and public.has_subscription(auth.uid()))
    or exists (select 1 from public.entitlements e where e.user_id = auth.uid() and (e.product_id = _product
       or exists (select 1 from public.bundle_items b where b.bundle_id = e.product_id and b.product_id = _product))) $$;

create view public.product_ratings as
  select product_id, count(*)::int as review_count, round(avg(rating)::numeric, 1) as average,
    count(*) filter (where rating = 5)::int as stars_5, count(*) filter (where rating = 4)::int as stars_4,
    count(*) filter (where rating = 3)::int as stars_3, count(*) filter (where rating = 2)::int as stars_2,
    count(*) filter (where rating = 1)::int as stars_1
  from public.testimonials where is_published and product_id is not null group by product_id;
grant select on public.product_ratings to anon, authenticated;
grant all on public.product_ratings to service_role;

create table public.podcast_episodes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, title text not null, description text not null default '',
  audio_url text not null, cover_image_url text, duration_label text,
  is_published boolean not null default false, published_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger podcast_touch before update on public.podcast_episodes for each row execute procedure public.touch_updated_at();
grant select on public.podcast_episodes to anon;
grant select, insert, update, delete on public.podcast_episodes to authenticated;
grant all on public.podcast_episodes to service_role;
alter table public.podcast_episodes enable row level security;
create policy "podcast read" on public.podcast_episodes for select to anon, authenticated using (is_published or public.has_role(auth.uid(),'admin'));
create policy "podcast admin" on public.podcast_episodes for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
