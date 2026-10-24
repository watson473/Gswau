-- STEP 1: run this, then upload the files from covers-upload/ into Storage > covers.
insert into storage.buckets (id, name, public) values ('covers', 'covers', true) on conflict (id) do update set public = true;
create policy "covers admin write" on storage.objects for all to authenticated
  using (bucket_id = 'covers' and public.has_role(auth.uid(),'admin'))
  with check (bucket_id = 'covers' and public.has_role(auth.uid(),'admin'));
