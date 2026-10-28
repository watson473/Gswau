-- Clippers and Shears podcast: the five episodes on Spotify
-- (https://open.spotify.com/show/65QG3LPqhf9qn4ddtSZaGE).
-- Each episode's audio link is its Spotify episode link, which the site plays in Spotify's player.
-- Safe to run more than once: an episode that already exists is updated, not duplicated.
insert into public.podcast_episodes
  (slug, title, description, audio_url, cover_image_url, duration_label, is_published, published_at)
values
  ('clippers-and-shears-ep1',
   'Episode 1: Building a Trust Fund as a Barber or Hairstylist',
   'This episode focuses on building a trust fund as a barber or a hairstylist. It provides you with the step by step process on what it takes to achieve this endeavor.',
   'https://open.spotify.com/episode/2NCXGINaukVlp6p2bw2d7v',
   'https://i.scdn.co/image/ab6765630000ba8ac5c83d2a5fcfcfd1e2abadb7',
   '8 min', true, '2025-05-27T06:10:00Z'),
  ('clippers-and-shears-ep2-part1',
   'Episode 2, Part 1: Barbering vs. Hairstyling, Key Differences and Similarities',
   'In this episode we are diving into barbering vs. hairstyling: the key differences and similarities.',
   'https://open.spotify.com/episode/6YVSYtj8rTHjoRTLdoDx7w',
   'https://i.scdn.co/image/ab6765630000ba8ac5c83d2a5fcfcfd1e2abadb7',
   '17 min', true, '2025-06-10T02:50:00Z'),
  ('clippers-and-shears-ep2-part2',
   'Episode 2, Part 2: Barbering vs. Hairstyling, Key Differences and Similarities',
   'Continuing from part one, this is part two of Barbering vs. Hairstyling: Key Differences and Similarities.',
   'https://open.spotify.com/episode/4OSKps2a9HPibyJQKfJ7g6',
   'https://i.scdn.co/image/ab6765630000ba8ac5c83d2a5fcfcfd1e2abadb7',
   '26 min', true, '2025-06-21T03:13:00Z'),
  ('clippers-and-shears-ep3-part1',
   'Episode 3, Part 1: The Science of Hair, Understanding Hair Types and Textures',
   'Understanding hair types and textures is very important, but many barbers do not make it a priority to understand this process. In this episode I made it my business to go and gather the information to bring it to you. Enjoy.',
   'https://open.spotify.com/episode/02E9soAu2nSq02EhWgVaIA',
   'https://i.scdn.co/image/ab6765630000ba8ac5c83d2a5fcfcfd1e2abadb7',
   '16 min', true, '2025-06-27T08:13:00Z'),
  ('clippers-and-shears-ep3-part2',
   'Episode 3, Part 2: The Science of Hair, Understanding Hair Types and Textures',
   'Continuing from part one, we are discussing the science of hair. Understanding the different types and textures of hair is very important for any barber or hairstylist. This second episode does just that by helping you to understand human hair even better. Enjoy.',
   'https://open.spotify.com/episode/4WgXk6Oo6Pg3vdPl4AJdZp',
   'https://i.scdn.co/image/ab6765630000ba8ac5c83d2a5fcfcfd1e2abadb7',
   '24 min', true, '2025-07-07T05:22:00Z')
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  audio_url = excluded.audio_url,
  cover_image_url = excluded.cover_image_url,
  duration_label = excluded.duration_label,
  is_published = excluded.is_published,
  published_at = excluded.published_at;
