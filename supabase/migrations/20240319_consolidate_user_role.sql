-- Ensure user_role_type exists
do $$ begin
  create type user_role_type as enum ('designer', 'homeowner');
exception
  when duplicate_object then null;
end $$;

-- Add user_role column to users table
alter table users 
add column if not exists user_role user_role_type;

-- First, migrate existing roles from user_role table
update users u
set user_role = ur.user_role
from user_role ur
where u.id = ur.user_id;

-- Set default role from auth.users metadata if not set
update users u
set user_role = (raw_user_meta_data->>'user_type')::user_role_type
from auth.users au
where u.id = au.id
and u.user_role is null
and au.raw_user_meta_data->>'user_type' in ('designer', 'homeowner');

-- Set 'homeowner' as default role for any remaining users without a role
update users
set user_role = 'homeowner'
where user_role is null;

-- Make user_role required after migration
alter table users
alter column user_role set not null;

-- Drop old user_role table and related objects
drop trigger if exists create_user_role on auth.users;
drop trigger if exists sync_user_metadata on auth.users;
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_user_role();
drop function if exists handle_new_user();
drop table if exists user_role;

-- Create new user creation handler function
create or replace function handle_user_creation()
returns trigger
language plpgsql
as $$
declare
  v_user_role user_role_type;
begin
  -- Get and validate user role from metadata, default to homeowner if not set
  v_user_role := (new.raw_user_meta_data->>'user_type')::user_role_type;
  if v_user_role is null or v_user_role not in ('designer', 'homeowner') then
    v_user_role := 'homeowner';
    raise log 'No valid user_type in metadata, defaulting to homeowner';
  end if;

  -- Insert into users table with role
  insert into public.users (id, email, full_name, user_role)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1)
    ),
    v_user_role
  );

  return new;
end;
$$;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_user_creation();

-- Update RLS policies
drop policy if exists "Users can view own profile" on users;
drop policy if exists "Users can update own profile" on users;
drop policy if exists "Users can insert own profile" on users;

create policy "Users can view own profile"
  on users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on users for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on users for insert
  with check (auth.uid() = id); 