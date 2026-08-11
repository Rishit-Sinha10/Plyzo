-- ============================================================
-- RLS: Row Level Security enablement + ownership policies
-- Plyzo / Supabase
--
-- HOW TO APPLY
--   Option A (recommended): `supabase db push` after linking the project
--   Option B: run in Supabase Dashboard -> SQL Editor
--
-- IMPORTANT: The app schema is NOT committed in this repo, so this file
-- can only demonstrate the pattern. You MUST repeat the "user-owned table"
-- template below for EVERY table that holds per-user rows (documents,
-- favorites, files, settings, ...). Replace <table_name> and <user_column>.
-- ============================================================

-- ------------------------------------------------------------------
-- 1) PROFILES table (standard companion to auth.users)
-- ------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Never expose these RLS-controlled rows to the wider world by default.
alter table public.profiles enable row level security;
-- Each user may read/write only their OWN profile.
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = id);

-- Auto-create a profile row on signup (optional but recommended).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', new.email), new.raw_user_meta_data ->> 'avatar_url');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------------
-- 2) TEMPLATE — apply to EVERY other user-owned table.
--    Replace <table_name> with the real table and <user_column> with
--    the column that stores the row owner (commonly `user_id` or `owner_id`).
-- ------------------------------------------------------------------
-- alter table public.<table_name> enable row level security;
--
-- create policy "<table_name>_select_own" on public.<table_name>
--   for select using (auth.uid() = <user_column>);
--
-- create policy "<table_name>_insert_own" on public.<table_name>
--   for insert with check (auth.uid() = <user_column>);
--
-- create policy "<table_name>_update_own" on public.<table_name>
--   for update using (auth.uid() = <user_column>) with check (auth.uid() = <user_column>);
--
-- create policy "<table_name>_delete_own" on public.<table_name>
--   for delete using (auth.uid() = <user_column>);

-- ------------------------------------------------------------------
-- 3) Column defaults that keep ownership honest at insert time.
--    On any table that has a user_id column, set the default so a
--    row can never be inserted as someone else's:
--      alter table public.<table_name>
--        alter column <user_column> set default auth.uid();
-- ------------------------------------------------------------------

-- ------------------------------------------------------------------
-- 4) Useful verification queries (run after applying):
-- ------------------------------------------------------------------
-- select tablename, rowsecurity
--   from pg_tables
--   where schemaname = 'public';
--
-- select tablename, policyname
--   from pg_policies
--   where schemaname = 'public'
--   order by tablename;
-- ------------------------------------------------------------------
