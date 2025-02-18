-- Drop existing trigger and function
drop trigger if exists sync_user_metadata on auth.users;
drop function if exists sync_user_metadata();

-- Create updated function to sync user metadata with role handling
create or replace function sync_user_metadata()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_user_role user_role_type;
begin
  -- For inserts and updates
  if (tg_op = 'INSERT' or tg_op = 'UPDATE') then
    -- Get and validate user role from metadata
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

    -- Update or insert into users table
    insert into public.users (id, email, full_name, user_role)
    values (
      new.id,
      new.email,
      coalesce(
        new.raw_user_meta_data->>'full_name',
        split_part(new.email, '@', 1)
      ),
      v_user_role
    )
    on conflict (id) do update set
      email = excluded.email,
      full_name = coalesce(
        new.raw_user_meta_data->>'full_name',
        split_part(new.email, '@', 1)
      ),
      user_role = v_user_role,
      updated_at = now();
  end if;

  return new;
exception
  when others then
    raise log 'Error in sync_user_metadata(): %. User data: id=%, email=%, metadata=%', 
      SQLERRM, new.id, new.email, new.raw_user_meta_data;
    return new;
end;
$$;

-- Create trigger
create trigger sync_user_metadata
  after insert or update on auth.users
  for each row execute procedure sync_user_metadata();

-- Grant necessary permissions
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on all tables in schema public to postgres, anon, authenticated, service_role;
grant all on all sequences in schema public to postgres, anon, authenticated, service_role; 