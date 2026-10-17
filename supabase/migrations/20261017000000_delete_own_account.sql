-- Account settings: lets a signed-in user delete their own account. The app
-- never holds the service role key, so deletion runs here, as the function's
-- owner (security definer), and only ever for the caller: auth.uid() is read
-- inside the function and nothing can be passed in. Their profile and
-- completions go with them through the foreign keys' on delete cascade.
-- Avatar files are removed by the app through the Storage API first, since
-- Supabase doesn't allow deleting storage rows with SQL.
create function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not signed in' using errcode = '42501';
  end if;
  delete from auth.users where id = uid;
end;
$$;

-- Postgres lets everyone execute new functions; only signed-in users may.
revoke execute on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
