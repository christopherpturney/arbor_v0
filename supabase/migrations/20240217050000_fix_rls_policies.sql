-- Drop existing policies
drop policy if exists "Users can view own roles" on user_roles;
drop policy if exists "Users can update own roles" on user_roles;
drop policy if exists "Users can insert own roles" on user_roles;

-- Create new policies with proper permissions
create policy "Enable read access for authenticated users"
  on user_roles for select
  using (auth.role() = 'authenticated');

create policy "Enable insert for authenticated users"
  on user_roles for insert
  with check (auth.uid() = user_id);

create policy "Enable update for users on their own roles"
  on user_roles for update
  using (auth.uid() = user_id);

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on user_roles to anon, authenticated; 