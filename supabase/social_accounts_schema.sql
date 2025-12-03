-- Create social_accounts table
create table if not exists public.social_accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  platform text not null,
  handle text,
  follower_count integer default 0,
  previous_follower_count integer default 0, -- To calculate growth/change
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.social_accounts enable row level security;

-- Policies
create policy "Users can view their own social accounts"
  on social_accounts for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own social accounts"
  on social_accounts for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own social accounts"
  on social_accounts for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own social accounts"
  on social_accounts for delete
  using ( auth.uid() = user_id );
