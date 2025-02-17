-- Drop existing trigger if it exists
drop trigger if exists create_user_role on auth.users;

-- Create function to handle user role creation
create or replace function handle_user_role()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  user_type text;
begin
  -- Get the user type from metadata
  user_type := new.raw_user_meta_data->>'user_type';
  
  -- Validate and insert the user role
  if user_type is not null and user_type in ('designer', 'homeowner') then
    insert into public.user_role (user_id, user_role)
    values (
      new.id,
      user_type::user_role_type
    )
    on conflict (user_id) do update set
      user_role = excluded.user_role,
      updated_at = now();
  else
    raise log 'Invalid or missing user_type in metadata: %', user_type;
  end if;

  return new;
exception
  when others then
    raise log 'Error in handle_user_role(): % | user_type: %', SQLERRM, user_type;
    return new;
end;
$$;

-- Create trigger for user role creation
create trigger create_user_role
  after insert on auth.users
  for each row execute procedure handle_user_role();

-- Manually sync existing users' roles
do $$
declare
  r record;
begin
  for r in (
    select 
      id,
      raw_user_meta_data->>'user_type' as user_type
    from auth.users 
    where raw_user_meta_data->>'user_type' in ('designer', 'homeowner')
  ) loop
    insert into public.user_role (user_id, user_role)
    values (r.id, r.user_type::user_role_type)
    on conflict (user_id) do update set
      user_role = excluded.user_role,
      updated_at = now();
  end loop;
end;
$$; 