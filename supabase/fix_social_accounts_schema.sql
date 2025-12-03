-- 1. Create table if it doesn't exist
create table if not exists public.social_accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  platform text not null,
  handle text,
  follower_count integer default 0,
  previous_follower_count integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Add new columns if they don't exist
alter table public.social_accounts 
add column if not exists engagement_rate numeric default 0,
add column if not exists last_synced_at timestamp with time zone,
add column if not exists status text default 'connected';

-- 3. Enable RLS
alter table public.social_accounts enable row level security;

-- 4. Create policies safely
do $$
begin
    -- View policy
    if not exists (select 1 from pg_policies where tablename = 'social_accounts' and policyname = 'Users can view their own social accounts') then
        create policy "Users can view their own social accounts"
          on social_accounts for select
          using ( auth.uid() = user_id );
    end if;

    -- Insert policy
    if not exists (select 1 from pg_policies where tablename = 'social_accounts' and policyname = 'Users can insert their own social accounts') then
        create policy "Users can insert their own social accounts"
          on social_accounts for insert
          with check ( auth.uid() = user_id );
    end if;

    -- Update policy
    if not exists (select 1 from pg_policies where tablename = 'social_accounts' and policyname = 'Users can update their own social accounts') then
        create policy "Users can update their own social accounts"
          on social_accounts for update
          using ( auth.uid() = user_id );
    end if;

    -- Delete policy
    if not exists (select 1 from pg_policies where tablename = 'social_accounts' and policyname = 'Users can delete their own social accounts') then
        create policy "Users can delete their own social accounts"
          on social_accounts for delete
          using ( auth.uid() = user_id );
    end if;
end
$$;
