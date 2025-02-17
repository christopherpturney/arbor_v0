-- Drop existing policies
drop policy if exists "Enable read access for authenticated users" on user_role;
drop policy if exists "Enable insert for authenticated users" on user_role;
drop policy if exists "Enable update for users on their own roles" on user_role;
drop policy if exists "Enable insert for users on their own roles" on user_role;

-- Ensure RLS is enabled
alter table user_role enable row level security;

-- Recreate policies
create policy "Enable read access for authenticated users"
  on user_role for select
  using (auth.role() = 'authenticated');

create policy "Enable insert for users on their own roles"
  on user_role for insert
  with check (
    auth.uid() = user_id AND
    (select count(*) from user_role where user_id = auth.uid()) = 0
  );

create policy "Enable update for users on their own roles"
  on user_role for update
  using (auth.uid() = user_id); 