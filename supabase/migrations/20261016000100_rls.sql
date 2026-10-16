-- V03.3: Row Level Security. With RLS on, a table is closed to the anon and
-- authenticated roles except where a policy below opens it. The service role
-- (seed script, dashboard) bypasses RLS.

alter table public.landmarks enable row level security;
alter table public.profiles enable row level security;
alter table public.completions enable row level security;

-- Table privileges come first: a role needs them before any policy applies.
-- Supabase usually grants these on new tables by default, but projects can
-- turn that off, so they are spelled out here. The policies below then limit
-- which rows each role can reach.
grant select on public.landmarks to anon, authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.completions to authenticated;

-- Landmarks: anyone, signed in or not, can read them. There are no insert,
-- update or delete policies, so only the service role can change them.
create policy "Landmarks are readable by everyone"
  on public.landmarks for select
  to anon, authenticated
  using (true);

-- Profiles: each user can see and change only their own.
-- `(select auth.uid())` is evaluated once per query rather than per row.
create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

create policy "Users can create their own profile"
  on public.profiles for insert
  to authenticated
  with check (id = (select auth.uid()));

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "Users can delete their own profile"
  on public.profiles for delete
  to authenticated
  using (id = (select auth.uid()));

-- Completions: each user can see, add, change and remove only their own.
create policy "Users can view their own completions"
  on public.completions for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Users can add their own completions"
  on public.completions for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "Users can update their own completions"
  on public.completions for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Users can delete their own completions"
  on public.completions for delete
  to authenticated
  using (user_id = (select auth.uid()));
