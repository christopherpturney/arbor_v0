-- Drop existing triggers if they exist
drop trigger if exists sync_user_metadata on auth.users;
drop trigger if exists create_user_role on auth.users;

-- Drop existing functions if they exist
drop function if exists sync_user_metadata();
drop function if exists handle_user_role();

-- Create function to sync user metadata
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

-- Create function to handle user role creation
create or replace function handle_user_role()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  user_type text;
begin
  -- Get the user type from metadata
  user_type := new.raw_user_meta_data->>'user_type';
  
  -- Validate and insert the user role
  if user_type is not null and user_type in ('designer', 'homeowner') then
    insert into public.user_role (user_id, user_role)
    values (
      new.id,
      user_type::user_role_type
    )
    on conflict (user_id) do update set
      user_role = excluded.user_role,
      updated_at = now();
  else
    raise log 'Invalid or missing user_type in metadata: %', user_type;
  end if;

  return new;
exception
  when others then
    raise log 'Error in handle_user_role(): % | user_type: %', SQLERRM, user_type;
    return new;
end;
$$;

-- Create triggers
create trigger sync_user_metadata
  after insert or update on auth.users
  for each row execute procedure sync_user_metadata();

create trigger create_user_role
  after insert on auth.users
  for each row execute procedure handle_user_role();

-- Manually sync existing users
do $$
begin
  -- Sync user metadata
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

  -- Sync user roles
  insert into public.user_role (user_id, user_role)
  select 
    id,
    raw_user_meta_data->>'user_type'::user_role_type
  from auth.users 
  where raw_user_meta_data->>'user_type' in ('designer', 'homeowner')
  on conflict (user_id) do update set
    user_role = excluded.user_role,
    updated_at = now();
end;
$$; 