-- Drop existing trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_user_creation();

-- Create new user creation handler function with better error handling
create or replace function handle_user_creation()
returns trigger
language plpgsql
security definer
as $$
declare
  v_user_role user_role_type;
begin
  -- Log the incoming data for debugging
  raise log 'New user data: id=%, email=%, metadata=%', new.id, new.email, new.raw_user_meta_data;

  -- Get and validate user role from metadata, default to homeowner if not set
  begin
    v_user_role := (new.raw_user_meta_data->>'user_type')::user_role_type;
  exception 
    when others then
      v_user_role := 'homeowner';
      raise log 'Error casting user_type, defaulting to homeowner. Error: %', SQLERRM;
  end;

  -- Default to homeowner if no valid role
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
exception 
  when others then
    raise log 'Error in handle_user_creation(): %. User data: id=%, email=%, metadata=%', 
      SQLERRM, new.id, new.email, new.raw_user_meta_data;
    return new;
end;
$$;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_user_creation();

-- Grant necessary permissions
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on all tables in schema public to postgres, anon, authenticated, service_role;
grant all on all sequences in schema public to postgres, anon, authenticated, service_role;
grant all on all functions in schema public to postgres, anon, authenticated, service_role; 