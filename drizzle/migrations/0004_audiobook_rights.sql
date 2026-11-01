-- Audiobook listening and downloading.
--  - Anyone with access (member, buyer, admin) can listen.
--  - Only buyers (the book itself or a bundle that contains it) and admins can download.
-- Browsers can no longer make their own links to audio files: the site's server checks these
-- rules and hands out short-lived links. Book PDFs keep the existing rule.

create or replace function public.audiobook_rights(_product uuid)
returns table (can_listen boolean, can_download boolean)
language sql stable security definer set search_path = public as $$
  select
    public.has_access(_product),
    public.has_role(auth.uid(), 'admin')
      or exists (select 1 from public.products p where p.id = _product and p.access_tier = 'free')
      or (auth.uid() is not null and exists (select 1 from public.entitlements e
          where e.revoked_at is null
            and (e.user_id = auth.uid() or e.email = public.user_email(auth.uid()))
            and (e.product_id = _product
                 or exists (select 1 from public.bundle_items b
                            where b.bundle_id = e.product_id and b.product_id = _product))))
$$;
grant execute on function public.audiobook_rights(uuid) to anon, authenticated;

-- Signed-in users may still read book PDFs they have access to, but not audio files.
drop policy "files entitled read" on storage.objects;
create policy "files entitled read" on storage.objects for select to authenticated
  using (bucket_id = 'product-files' and exists (select 1 from public.products p
    where p.file_path = name and public.has_access(p.id)));
