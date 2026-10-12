create type public.app_role as enum ('admin', 'user');
create type public.product_type as enum ('ebook', 'audiobook', 'course', 'bundle');
create type public.lesson_type as enum ('video', 'audio', 'text');

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text, avatar_url text, email text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null, unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "profiles read" on public.profiles for select to authenticated using (id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "profiles update own" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email) values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  if (select count(*) from public.user_roles where role = 'admin') = 0 then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create table public.products (
  id uuid primary key default gen_random_uuid(),
  type public.product_type not null default 'ebook',
  title text not null, subtitle text not null default '', slug text not null unique,
  description text not null default '', cover_image_url text,
  price_cents integer not null default 0,
  is_free boolean not null default false, is_lead_magnet boolean not null default false,
  is_published boolean not null default true, is_featured boolean not null default false,
  buy_url text, file_path text, position integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger products_touch before update on public.products for each row execute procedure public.touch_updated_at();
grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "products public read" on public.products for select to anon, authenticated using (is_published or public.has_role(auth.uid(),'admin'));
create policy "products admin write" on public.products for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.bundle_items (
  bundle_id uuid not null references public.products(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  primary key (bundle_id, product_id)
);
grant select on public.bundle_items to anon;
grant select, insert, update, delete on public.bundle_items to authenticated;
grant all on public.bundle_items to service_role;
alter table public.bundle_items enable row level security;
create policy "bundle read" on public.bundle_items for select to anon, authenticated using (true);
create policy "bundle admin" on public.bundle_items for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null, product_id uuid not null references public.products(id) on delete cascade,
  granted_at timestamptz not null default now(), unique (user_id, product_id)
);
grant select, insert, delete on public.entitlements to authenticated;
grant all on public.entitlements to service_role;
alter table public.entitlements enable row level security;
create policy "ent read" on public.entitlements for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "ent admin" on public.entitlements for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "ent admin del" on public.entitlements for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create or replace function public.has_access(_product uuid) returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(auth.uid(),'admin')
    or exists (select 1 from public.products p where p.id = _product and p.is_free)
    or exists (select 1 from public.entitlements e where e.user_id = auth.uid() and (e.product_id = _product
       or exists (select 1 from public.bundle_items b where b.bundle_id = e.product_id and b.product_id = _product))) $$;

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.products(id) on delete cascade,
  title text not null, position integer not null default 0, created_at timestamptz not null default now()
);
grant select on public.modules to anon;
grant select, insert, update, delete on public.modules to authenticated;
grant all on public.modules to service_role;
alter table public.modules enable row level security;
create policy "modules read" on public.modules for select to anon, authenticated using (true);
create policy "modules admin" on public.modules for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null, type public.lesson_type not null default 'video',
  content_url text, body text, duration_minutes integer, is_preview boolean not null default false,
  position integer not null default 0, created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.lessons to authenticated;
grant all on public.lessons to service_role;
alter table public.lessons enable row level security;
create policy "lessons read" on public.lessons for select to authenticated using (
  is_preview or public.has_access((select m.course_id from public.modules m where m.id = module_id)));
create policy "lessons admin" on public.lessons for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.course_outline(_course uuid)
returns table (lesson_id uuid, module_id uuid, title text, lesson_type public.lesson_type, duration_minutes integer, is_preview boolean, sort_order integer)
language sql stable security definer set search_path = public as $$
  select l.id, l.module_id, l.title, l.type, l.duration_minutes, l.is_preview, l.position
  from public.lessons l join public.modules m on m.id = l.module_id where m.course_id = _course order by m.position, l.position $$;
grant execute on function public.course_outline(uuid) to anon, authenticated;

create table public.lesson_progress (
  user_id uuid not null, lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(), primary key (user_id, lesson_id)
);
grant select, insert, delete on public.lesson_progress to authenticated;
grant all on public.lesson_progress to service_role;
alter table public.lesson_progress enable row level security;
create policy "progress own" on public.lesson_progress for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null, source text not null default 'free-chapter', created_at timestamptz not null default now()
);
grant insert on public.leads to anon, authenticated;
grant select, delete on public.leads to authenticated;
grant all on public.leads to service_role;
alter table public.leads enable row level security;
create policy "leads insert" on public.leads for insert to anon, authenticated with check (length(email) between 3 and 255 and email like '%@%');
create policy "leads admin read" on public.leads for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "leads admin del" on public.leads for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null, location text, quote text not null, rating integer not null default 5,
  product_id uuid references public.products(id) on delete set null,
  is_published boolean not null default false, user_id uuid,
  created_at timestamptz not null default now()
);
grant select, insert on public.testimonials to anon, authenticated;
grant update, delete on public.testimonials to authenticated;
grant all on public.testimonials to service_role;
alter table public.testimonials enable row level security;
create policy "testimonials read" on public.testimonials for select to anon, authenticated using (is_published or public.has_role(auth.uid(),'admin'));
create policy "testimonials submit" on public.testimonials for insert to authenticated with check (user_id = auth.uid() and is_published = false and rating between 1 and 5);
create policy "testimonials admin" on public.testimonials for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "testimonials admin del" on public.testimonials for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, title text not null, excerpt text not null default '', body text not null default '',
  cover_image_url text, is_published boolean not null default false, published_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger blog_touch before update on public.blog_posts for each row execute procedure public.touch_updated_at();
grant select on public.blog_posts to anon;
grant select, insert, update, delete on public.blog_posts to authenticated;
grant all on public.blog_posts to service_role;
alter table public.blog_posts enable row level security;
create policy "blog read" on public.blog_posts for select to anon, authenticated using (is_published or public.has_role(auth.uid(),'admin'));
create policy "blog admin" on public.blog_posts for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "files admin write" on storage.objects for all to authenticated
  using (bucket_id = 'product-files' and public.has_role(auth.uid(),'admin'))
  with check (bucket_id = 'product-files' and public.has_role(auth.uid(),'admin'));
create policy "files entitled read" on storage.objects for select to authenticated
  using (bucket_id = 'product-files' and exists (select 1 from public.products p where p.file_path = name and public.has_access(p.id)));
