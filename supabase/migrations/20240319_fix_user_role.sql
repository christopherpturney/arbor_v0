-- Ensure user_role_type exists
do $$ begin
  create type user_role_type as enum ('designer', 'homeowner');
exception
  when duplicate_object then null;
end $$;

-- Add user_role column to users table
alter table public.users 
add column if not exists user_role user_role_type;

-- Set 'homeowner' as default role for all users
update public.users
set user_role = 'homeowner'
where user_role is null;

-- Make user_role required
alter table public.users
alter column user_role set not null; 