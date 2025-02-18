-- Drop old user_role table and related objects
drop trigger if exists create_user_role on auth.users;
drop trigger if exists sync_user_metadata on auth.users;
drop function if exists handle_user_role();
drop table if exists user_role;
drop table if exists user_roles; 