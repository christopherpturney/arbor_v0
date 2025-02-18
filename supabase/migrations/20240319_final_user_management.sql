-- Drop existing triggers and functions
drop trigger if exists sync_user_metadata on auth.users;
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists create_user_role on auth.users;
drop function if exists sync_user_metadata() cascade;
drop function if exists handle_user_creation();
drop function if exists handle_user_role();
drop function if exists get_functions() cascade;
drop function if exists get_triggers() cascade;

-- Drop old tables
drop table if exists user_role;
drop table if exists user_roles;

-- Ensure user_role_type exists
do $$ begin
  create type user_role_type as enum ('designer', 'homeowner');
exception
  when duplicate_object then null;
end $$;

-- Add user_role column to users table if it doesn't exist
do $$ begin
  alter table users add column user_role user_role_type;
exception
  when duplicate_column then null;
end $$;

-- Set default role for existing users
update users
set user_role = 'homeowner'
where user_role is null;

-- Make user_role required
alter table users
alter column user_role set not null;

-- Create new user creation handler function
create or replace function handle_user_creation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_role user_role_type;
begin
  -- Log the incoming data for debugging
  raise log 'handle_user_creation() called with user_id: %, email: %, metadata: %', 
    new.id, new.email, new.raw_user_meta_data;

  -- Get and validate user role from metadata
  begin
    v_user_role := (new.raw_user_meta_data->>'user_type')::user_role_type;
  exception 
    when others then
      v_user_role := 'homeowner'::user_role_type;
      raise log 'Error casting user_type, defaulting to homeowner. Error: %', SQLERRM;
  end;

  -- Default to homeowner if no valid role
  if v_user_role is null then
    v_user_role := 'homeowner'::user_role_type;
    raise log 'No valid user_type in metadata, defaulting to homeowner';
  end if;

  -- Insert into users table with role
  begin
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
    raise log 'Successfully created user record for id: %', new.id;
  exception
    when others then
      raise log 'Error creating user record: %. User data: id=%, email=%, metadata=%', 
        SQLERRM, new.id, new.email, new.raw_user_meta_data;
      return null; -- Prevent the auth signup from proceeding if we can't create the user record
  end;

  return new;
end;
$$;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_user_creation();

-- Create sync_user_metadata function
create or replace function sync_user_metadata()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- For inserts and updates
  if (tg_op = 'UPDATE') then
    -- Update users table
    update public.users
    set
      email = new.email,
      full_name = coalesce(
        new.raw_user_meta_data->>'full_name',
        split_part(new.email, '@', 1)
      ),
      updated_at = now()
    where id = new.id;
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
  after update on auth.users
  for each row execute procedure sync_user_metadata();

-- Enable RLS
alter table public.users enable row level security;

-- Drop existing policies
drop policy if exists "Users can view own profile" on users;
drop policy if exists "Users can update own profile" on users;
drop policy if exists "Users can insert own profile" on users;
drop policy if exists "Service role can manage all users" on users;
drop policy if exists "Trigger can insert users" on users;
drop policy if exists "Allow authenticated users to insert their own profile" on users;

-- Create policies
create policy "Service role can manage all users"
  on users for all
  to service_role
  using (true)
  with check (true);

create policy "Users can view own profile"
  on users for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile"
  on users for update
  to authenticated
  using (auth.uid() = id);

-- Grant necessary permissions
grant usage on schema public to postgres, service_role, anon, authenticated;
grant all privileges on public.users to postgres, service_role;
grant select, update on public.users to authenticated;
grant usage on all sequences in schema public to postgres, service_role, anon, authenticated;

-- Ensure the trigger function has proper permissions
alter function handle_user_creation() security definer; 