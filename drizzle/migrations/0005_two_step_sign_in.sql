-- Two-step sign-in (authenticator app, Supabase MFA), enforced by the database too, so a
-- password alone can't get around the website:
--  - admin powers need a session that has entered its code (aal2);
--  - an account with two-step sign-in on only reaches its books after entering its code.
-- No tables or rows change. Direct SQL (Supabase dashboard) and the server's service key are
-- unaffected.

-- True when this session entered its code, or the account doesn't use two-step sign-in.
create or replace function public.mfa_ok() returns boolean
language sql stable security definer set search_path = public, auth as $$
  select coalesce(auth.jwt() ->> 'aal', '') = 'aal2'
    or not exists (select 1 from auth.mfa_factors f
                   where f.user_id = auth.uid() and f.status = 'verified') $$;
grant execute on function public.mfa_ok() to anon, authenticated;

-- Admin only counts once the code has been entered (outside a signed-in request, unchanged).
create or replace function public.has_role(_user_id uuid, _role public.app_role) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
    and (_role <> 'admin'
         or auth.jwt() is null
         or coalesce(auth.jwt() ->> 'role', '') = 'service_role'
         or coalesce(auth.jwt() ->> 'aal', '') = 'aal2') $$;

create or replace function public.has_access(_product uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.has_role(auth.uid(),'admin')
    or exists (select 1 from public.products p where p.id = _product and p.access_tier = 'free')
    or (public.mfa_ok()
        and exists (select 1 from public.products p where p.id = _product and p.access_tier = 'members')
        and public.has_membership(auth.uid()))
    or (auth.uid() is not null and public.mfa_ok() and exists (select 1 from public.entitlements e
        where e.revoked_at is null
          and (e.user_id = auth.uid() or e.email = public.user_email(auth.uid()))
          and (e.product_id = _product
               or exists (select 1 from public.bundle_items b where b.bundle_id = e.product_id and b.product_id = _product)))) $$;

create or replace function public.audiobook_rights(_product uuid)
returns table (can_listen boolean, can_download boolean)
language sql stable security definer set search_path = public as $$
  select
    public.has_access(_product),
    public.has_role(auth.uid(), 'admin')
      or exists (select 1 from public.products p where p.id = _product and p.access_tier = 'free')
      or (auth.uid() is not null and public.mfa_ok() and exists (select 1 from public.entitlements e
          where e.revoked_at is null
            and (e.user_id = auth.uid() or e.email = public.user_email(auth.uid()))
            and (e.product_id = _product
                 or exists (select 1 from public.bundle_items b
                            where b.bundle_id = e.product_id and b.product_id = _product))))
$$;
