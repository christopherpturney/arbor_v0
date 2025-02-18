-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

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