-- Drop existing trigger if it exists
drop trigger if exists sync_user_metadata on auth.users;

-- Create function to sync user metadata with users table
create or replace function sync_user_metadata()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- For inserts and updates
  if (tg_op = 'INSERT' or tg_op = 'UPDATE') then
    -- Update or insert into users table
    insert into public.users (id, email, full_name)
    values (
      new.id,
      new.email,
      coalesce(
        new.raw_user_meta_data->>'full_name',
        split_part(new.email, '@', 1)
      )
    )
    on conflict (id) do update set
      email = excluded.email,
      full_name = coalesce(
        new.raw_user_meta_data->>'full_name',
        split_part(new.email, '@', 1)
      ),
      updated_at = now();
  end if;

  return new;
exception
  when others then
    raise log 'Error in sync_user_metadata(): %', SQLERRM;
    return new;
end;
$$;

-- Create trigger to sync metadata changes
create trigger sync_user_metadata
  after insert or update on auth.users
  for each row execute procedure sync_user_metadata();

-- Manually sync existing users
do $$
begin
  insert into public.users (id, email, full_name)
  select 
    id,
    email,
    coalesce(
      raw_user_meta_data->>'full_name',
      split_part(email, '@', 1)
    ) as full_name
  from auth.users
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    updated_at = now();
end;
$$; 