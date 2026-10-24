-- Phase 1: access tiers, Gumroad memberships and purchases, previews, audiobooks,
-- site settings and analytics. Run once, after 0000 and 0001.

-- 1. Access tier per product: free for everyone / included with membership / premium extra.
create type public.access_tier as enum ('free', 'members', 'premium');

alter table public.products
  add column access_tier public.access_tier not null default 'members',
  add column gumroad_product_id text unique,
  add column gumroad_permalink text unique,
  add column preview_path text,
  add column audio_path text;

update public.products set access_tier = case when is_free then 'free'::public.access_tier else 'members'::public.access_tier end;

-- Gumroad links keep working after gswau.com moves to this site.
update public.products set gumroad_permalink = substring(buy_url from '/l/([A-Za-z0-9_-]+)') where buy_url like '%/l/%';
update public.products set buy_url = 'https://gswau.gumroad.com/l/' || gumroad_permalink where gumroad_permalink is not null;

-- is_free is now derived from the tier, so existing code keeps reading it.
alter table public.products drop column is_free, drop column included_with_subscription;
alter table public.products add column is_free boolean generated always as (access_tier = 'free') stored;

-- 2. Helpers.
create or replace function public.user_email(_user uuid) returns text
language sql stable security definer set search_path = public, auth as $$
  select lower(email) from auth.users where id = _user $$;

-- 3. Memberships (replaces the manual subscriptions table from 0001).
create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email = lower(email) and email like '%@%'),
  user_id uuid references auth.users(id) on delete set null,
  plan text not null default 'monthly' check (plan in ('monthly', 'annual', 'manual')),
  status text not null default 'active' check (status in ('active', 'cancelled', 'past_due', 'ended')),
  source text not null default 'gumroad' check (source in ('gumroad', 'admin', 'import')),
  gumroad_subscription_id text unique,
  gumroad_product_id text,
  manage_url text,
  started_at timestamptz not null default now(),
  current_period_end timestamptz,
  cancelled_at timestamptz,
  ended_at timestamptz,
  updated_at timestamptz not null default now()
);
create index memberships_email on public.memberships (email);
create index memberships_user on public.memberships (user_id);
create unique index memberships_one_manual_per_email on public.memberships (email) where source = 'admin';
create trigger memberships_touch before update on public.memberships for each row execute procedure public.touch_updated_at();
grant select, insert, update, delete on public.memberships to authenticated;
grant all on public.memberships to service_role;
alter table public.memberships enable row level security;
create policy "memberships read" on public.memberships for select to authenticated
  using (user_id = auth.uid() or email = public.user_email(auth.uid()) or public.has_role(auth.uid(),'admin'));
create policy "memberships admin" on public.memberships for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

insert into public.memberships (email, user_id, plan, status, source, started_at, current_period_end)
select lower(u.email), s.user_id, 'manual', case when s.status = 'active' then 'active' else 'ended' end, 'admin', s.started_at, s.current_period_end
from public.subscriptions s join auth.users u on u.id = s.user_id
on conflict do nothing;

drop function public.has_subscription(uuid);
drop table public.subscriptions;

-- Cancelled and past-due members keep access until the paid period ends (plus 3 days' grace for retries).
create or replace function public.has_membership(_user uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = public as $$
  select _user is not null and exists (select 1 from public.memberships m
    where (m.user_id = _user or m.email = public.user_email(_user))
      and m.status <> 'ended'
      and (m.current_period_end + interval '3 days' > now()
           -- No end date: complimentary (admin) memberships, or an active one whose first charge we haven't seen.
           or (m.current_period_end is null and (m.source = 'admin' or m.status = 'active')))) $$;
grant execute on function public.has_membership(uuid) to authenticated;

-- 4. Purchases granted by email, so buyers without an account yet get access when they sign up.
alter table public.entitlements
  alter column user_id drop not null,
  add column email text check (email is null or email = lower(email)),
  add column source text not null default 'admin' check (source in ('admin', 'gumroad', 'import')),
  add column gumroad_sale_id text,
  add column revoked_at timestamptz;
update public.entitlements e set email = public.user_email(e.user_id) where e.email is null;
alter table public.entitlements add constraint entitlements_owner check (user_id is not null or email is not null);
create unique index entitlements_email_product on public.entitlements (email, product_id) where email is not null;
grant update on public.entitlements to authenticated;
drop policy "ent read" on public.entitlements;
create policy "ent read" on public.entitlements for select to authenticated
  using (user_id = auth.uid() or email = public.user_email(auth.uid()) or public.has_role(auth.uid(),'admin'));
create policy "ent admin update" on public.entitlements for update to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.has_access(_product uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.has_role(auth.uid(),'admin')
    or exists (select 1 from public.products p where p.id = _product and p.access_tier = 'free')
    or (exists (select 1 from public.products p where p.id = _product and p.access_tier = 'members')
        and public.has_membership(auth.uid()))
    or (auth.uid() is not null and exists (select 1 from public.entitlements e
        where e.revoked_at is null
          and (e.user_id = auth.uid() or e.email = public.user_email(auth.uid()))
          and (e.product_id = _product
               or exists (select 1 from public.bundle_items b where b.bundle_id = e.product_id and b.product_id = _product)))) $$;
grant execute on function public.has_access(uuid) to anon, authenticated;

-- Link past purchases and memberships to a new account by email.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email) values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  if (select count(*) from public.user_roles where role = 'admin') = 0 then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  update public.entitlements set user_id = new.id where user_id is null and email = lower(new.email);
  update public.memberships set user_id = new.id where user_id is null and email = lower(new.email);
  return new;
end; $$;

-- Downloads: the book PDF and the audiobook both follow has_access.
drop policy "files entitled read" on storage.objects;
create policy "files entitled read" on storage.objects for select to authenticated
  using (bucket_id = 'product-files' and exists (select 1 from public.products p
    where (p.file_path = name or p.audio_path = name) and public.has_access(p.id)));

-- 5. Gumroad notification log. Server-only (service role); admins can read it.
create table public.gumroad_events (
  id uuid primary key default gen_random_uuid(),
  dedupe_key text not null unique,
  resource text not null,
  sale_id text,
  subscription_id text,
  email text,
  gumroad_product_id text,
  permalink text,
  product_id uuid references public.products(id) on delete set null,
  is_test boolean not null default false,
  outcome text,
  error text,
  payload jsonb not null,
  received_at timestamptz not null default now()
);
grant select on public.gumroad_events to authenticated;
grant all on public.gumroad_events to service_role;
alter table public.gumroad_events enable row level security;
create policy "gumroad events admin read" on public.gumroad_events for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- 6. Site settings editable in Admin (checkout links, preview length).
create table public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);
create trigger site_settings_touch before update on public.site_settings for each row execute procedure public.touch_updated_at();
grant select on public.site_settings to anon, authenticated;
grant insert, update on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "settings read" on public.site_settings for select to anon, authenticated using (true);
create policy "settings admin" on public.site_settings for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
insert into public.site_settings (key, value) values
  ('membership_monthly_url', ''),
  ('membership_annual_url', ''),
  ('membership_permalinks', ''),
  ('preview_pages', '10')
on conflict (key) do nothing;

-- 7. Analytics events. Visitors can add allowed events; only admins can read them.
create table public.analytics_events (
  id bigint generated always as identity primary key,
  name text not null check (name in ('signup', 'preview_read', 'purchase', 'membership_start',
    'membership_cancel', 'podcast_play', 'newsletter_signup')),
  user_id uuid default auth.uid(),
  anon_id text check (anon_id is null or length(anon_id) <= 64),
  props jsonb not null default '{}' check (pg_column_size(props) <= 2048),
  created_at timestamptz not null default now()
);
create index analytics_events_name_time on public.analytics_events (name, created_at desc);
grant insert on public.analytics_events to anon, authenticated;
grant select on public.analytics_events to authenticated;
grant all on public.analytics_events to service_role;
alter table public.analytics_events enable row level security;
create policy "analytics insert" on public.analytics_events for insert to anon, authenticated
  with check (user_id is not distinct from auth.uid()
    and name in ('signup', 'preview_read', 'podcast_play', 'newsletter_signup'));
create policy "analytics admin read" on public.analytics_events for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- 8. Public bucket for book previews (first pages). Full files stay private in product-files.
insert into storage.buckets (id, name, public) values ('previews', 'previews', true) on conflict (id) do update set public = true;
create policy "previews admin write" on storage.objects for all to authenticated
  using (bucket_id = 'previews' and public.has_role(auth.uid(),'admin'))
  with check (bucket_id = 'previews' and public.has_role(auth.uid(),'admin'));
