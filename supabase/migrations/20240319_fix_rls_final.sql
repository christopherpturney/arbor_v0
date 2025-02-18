-- Drop existing policies
drop policy if exists "Users can view own profile" on users;
drop policy if exists "Users can update own profile" on users;
drop policy if exists "Users can insert own profile" on users;
drop policy if exists "Service role can manage all users" on users;
drop policy if exists "Trigger can insert users" on users;
drop policy if exists "Allow authenticated users to insert their own profile" on users;

-- Enable RLS
alter table public.users enable row level security;

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

-- Ensure public schema is in search_path
alter role authenticator set search_path to public; 