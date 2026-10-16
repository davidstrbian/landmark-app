-- V03.1: tables for landmarks, user profiles and completions.
-- Run in the Supabase SQL editor (or `supabase db push`), then the RLS
-- migration, then supabase/seed.sql.

-- Landmarks: one row per fell, wilderness area and national park. Fields every
-- landmark has get their own column; category-specific fields (a fell's hike
-- and difficulty, a park's nature types and trail, a wilderness area's score,
-- notes, …) live in `details`. lib/landmark-row.ts converts both ways.
create table public.landmarks (
  id text primary key, -- slug, e.g. 'koli-national-park'
  name text not null,
  category text not null
    check (category in ('peak', 'wilderness-area', 'national-park')),
  region text not null,
  description text not null,
  lat double precision check (lat between -90 and 90),
  lng double precision check (lng between -180 and 180),
  elevation_m integer, -- fells
  area_km2 numeric, -- parks and wilderness areas
  image text not null default '', -- path under /public, '' until a photo exists
  image_credit text,
  sort_order integer not null, -- display order (the site owner's park order)
  details jsonb not null default '{}'::jsonb
    check (jsonb_typeof(details) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index landmarks_sort_order_idx on public.landmarks (sort_order);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger landmarks_set_updated_at
  before update on public.landmarks
  for each row execute function public.set_updated_at();

-- Profiles: one per signed-up user, created automatically on sign-up.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  created_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Completions: a landmark a user has conquered (fells) or visited (parks and
-- wilderness areas). One row per user and landmark.
create table public.completions (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  landmark_id text not null references public.landmarks (id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, landmark_id)
);

-- The unique constraint already indexes (user_id, landmark_id), which covers
-- lookups by user; landmark_id gets its own index for the foreign key.
create index completions_landmark_id_idx on public.completions (landmark_id);
