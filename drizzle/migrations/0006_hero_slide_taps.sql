-- Let the homepage phone record which slide people tap ("hero_slide_tap", with the slide's name).
-- Adds one event name to the analytics list; nothing else changes. The counts show in
-- Admin > Analytics as "hero slide tap: calculator", "...: audiobook", "...: course", "...: podcast".
-- Run once in the Supabase SQL editor. Safe to run again.
alter table public.analytics_events drop constraint if exists analytics_events_name_check;
alter table public.analytics_events add constraint analytics_events_name_check
  check (name in ('signup', 'preview_read', 'purchase', 'membership_start',
    'membership_cancel', 'podcast_play', 'newsletter_signup', 'hero_slide_tap'));

drop policy if exists "analytics insert" on public.analytics_events;
create policy "analytics insert" on public.analytics_events for insert to anon, authenticated
  with check (user_id is not distinct from auth.uid()
    and name in ('signup', 'preview_read', 'podcast_play', 'newsletter_signup', 'hero_slide_tap'));

-- Expect one row mentioning hero_slide_tap.
select pg_get_constraintdef(oid) from pg_constraint where conname = 'analytics_events_name_check';
