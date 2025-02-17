-- Create the role enum type
create type user_role_type as enum ('designer', 'homeowner');

-- Rename the table and convert role column to use enum
begin;
  -- Drop existing policies first
  drop policy if exists "Enable read access for authenticated users" on user_roles;
  drop policy if exists "Enable insert for authenticated users" on user_roles;
  drop policy if exists "Enable update for users on their own roles" on user_roles;

  -- Rename the table
  alter table if exists user_roles rename to user_role;

  -- Rename the role column and convert it to use enum
  alter table user_role 
    rename column role to user_role;
  
  -- Drop the check constraint before converting the column
  alter table user_role
    drop constraint if exists user_roles_role_check;
  
  -- Convert the column to the enum type
  alter table user_role 
    alter column user_role type user_role_type 
    using case 
      when user_role = 'designer' then 'designer'::user_role_type
      when user_role = 'homeowner' then 'homeowner'::user_role_type
      else null
    end;

  -- Enable RLS
  alter table user_role enable row level security;

  -- Recreate policies on the new table
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

  -- Update indexes for the renamed table
  drop index if exists user_roles_user_id_idx;
  drop index if exists user_roles_role_idx;
  create index user_role_user_id_idx on user_role(user_id);
  create index user_role_user_role_idx on user_role(user_role);
commit; 