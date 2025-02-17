-- Create users table
create table users (
  id uuid references auth.users primary key,
  full_name text not null,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_roles table
create table user_roles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users not null,
  role text not null check (role in ('designer', 'homeowner')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes
create index user_roles_user_id_idx on user_roles(user_id);
create index user_roles_role_idx on user_roles(role);

-- Enable RLS
alter table users enable row level security;
alter table user_roles enable row level security;

-- Policies for users table
create policy "Users can view own profile" 
  on users for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on users for update 
  using (auth.uid() = id);

create policy "Users can insert own profile" 
  on users for insert 
  with check (auth.uid() = id);

-- Policies for user_roles table
create policy "Users can view own roles" 
  on user_roles for select 
  using (auth.uid() = user_id);

create policy "Users can update own roles" 
  on user_roles for update 
  using (auth.uid() = user_id);

create policy "Users can insert own roles" 
  on user_roles for insert 
  with check (auth.uid() = user_id);

-- Function to handle user creation
create or replace function handle_new_user() 
returns trigger as $$
begin
  insert into users (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user(); 