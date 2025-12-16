-- 1. Create Saved Plans Table
create table if not exists saved_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text,
  plan_data jsonb,
  checked_items jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS
alter table saved_plans enable row level security;

-- 3. Create Policies
-- Allow users to insert their own plans
create policy "Users can insert their own plans"
  on saved_plans for insert
  with check ( auth.uid() = user_id );

-- Allow users to view their own plans
create policy "Users can view own plans"
  on saved_plans for select
  using ( auth.uid() = user_id );

-- Allow users to update their own plans
create policy "Users can update own plans"
  on saved_plans for update
  using ( auth.uid() = user_id );

-- Allow users to delete their own plans
create policy "Users can delete own plans"
  on saved_plans for delete
  using ( auth.uid() = user_id );

-- 4. Account Deletion RPC
-- This allows a logged-in user to wipe their auth account self-service
create or replace function delete_user()
returns void
security definer
language sql
as $$
  delete from auth.users where id = auth.uid();
$$;
