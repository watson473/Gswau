-- Contact Us form: messages from visitors, read in Admin > Messages.
-- Anyone can send a message; only admins can read, mark handled or delete them.
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 100),
  email text not null check (length(email) between 3 and 255 and email like '%@%'),
  subject text not null default '' check (length(subject) <= 150),
  message text not null check (length(message) between 1 and 5000),
  handled boolean not null default false,
  created_at timestamptz not null default now()
);
grant insert on public.contact_messages to anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;
create policy "contact insert" on public.contact_messages for insert to anon, authenticated
  with check (handled = false);
create policy "contact admin read" on public.contact_messages for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "contact admin update" on public.contact_messages for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "contact admin delete" on public.contact_messages for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));
