-- Function to list all functions in the public schema
create or replace function get_functions()
returns table (
  function_name text,
  function_args text,
  return_type text,
  function_body text
) language sql security definer as $$
  SELECT 
    p.proname::text as function_name,
    pg_get_function_arguments(p.oid)::text as function_args,
    pg_get_function_result(p.oid)::text as return_type,
    pg_get_functiondef(p.oid)::text as function_body
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public';
$$;

-- Function to list all triggers
create or replace function get_triggers()
returns table (
  trigger_name text,
  table_name text,
  function_name text,
  trigger_type text
) language sql security definer as $$
  SELECT 
    t.tgname::text as trigger_name,
    c.relname::text as table_name,
    p.proname::text as function_name,
    pg_get_triggerdef(t.oid)::text as trigger_type
  FROM pg_trigger t
  JOIN pg_class c ON t.tgrelid = c.oid
  JOIN pg_proc p ON t.tgfoid = p.oid
  WHERE NOT t.tgisinternal;
$$;

-- Grant access to the helper functions
grant execute on function get_functions to anon, authenticated;
grant execute on function get_triggers to anon, authenticated; 