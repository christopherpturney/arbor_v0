-- Drop existing trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_user_creation();

-- Create new user creation handler function with better error handling
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

-- Grant necessary permissions
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all privileges on all tables in schema public to postgres, service_role;
grant all privileges on all sequences in schema public to postgres, service_role;
grant execute on function handle_user_creation() to postgres, service_role; 