-- V03.5: profile page. Adds a username, a short bio and an avatar to each
-- profile, and the Storage bucket the avatars live in. Profiles stay private:
-- the existing RLS policies still let each user read and change only their
-- own row, and the table-level grants already cover the new columns.

alter table public.profiles
  add column username text,
  add column bio text,
  add column avatar_path text;

-- Lowercase letters, numbers and underscores, 3–20 characters. Being
-- lowercase-only, a plain unique index is enough to stop "Aino" and "aino"
-- both existing. A taken name fails with a unique violation (23505), so the
-- app never needs to read anyone else's row to check.
alter table public.profiles
  add constraint profiles_username_format check (username ~ '^[a-z0-9_]{3,20}$'),
  add constraint profiles_bio_length check (char_length(bio) <= 160),
  -- An avatar must be a file in the user's own folder, so a profile can't
  -- point at someone else's picture.
  add constraint profiles_avatar_in_own_folder check (avatar_path like id::text || '/%');

create unique index profiles_username_key on public.profiles (username);

-- Avatars: public to read (an avatar's URL works for anyone who has it; the
-- path is "<user id>/<timestamp>.webp"), small, and images only. Storage
-- enforces the size and type limits on upload.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 1048576, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Signed-in users can read, add, replace and remove files only in their own
-- folder, avatars/<their user id>/. Nobody else, anon included, can write.
create policy "Users can view their own avatar files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Users can upload avatars into their own folder"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Users can replace their own avatar files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Users can delete their own avatar files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
