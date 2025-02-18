-- Enable RLS on users table
alter table public.users enable row level security;

-- Drop existing policies
drop policy if exists "Users can view own profile" on users;
drop policy if exists "Users can update own profile" on users;
drop policy if exists "Users can insert own profile" on users;
drop policy if exists "Service role can manage all users" on users;
drop policy if exists "Trigger can insert users" on users;

-- Create policies
create policy "Users can view own profile"
  on users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on users for update
  using (auth.uid() = id);

create policy "Trigger can insert users"
  on users for insert
  to service_role, postgres
  with check (true);

create policy "Service role can manage all users"
  on users for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Grant permissions to the service role
grant usage on schema public to service_role;
grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role; 