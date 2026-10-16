-- The service role skips Row Level Security, but like any role it still needs
-- table privileges. Supabase usually grants them on new tables by default;
-- this project has that turned off, so they are spelled out here. The service
-- role is used by the dashboard's API, future server-side code and
-- scripts/test-rls.ts. Never expose its key to the browser.
grant select, insert, update, delete
  on public.landmarks, public.profiles, public.completions
  to service_role;
