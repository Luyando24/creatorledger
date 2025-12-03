-- Create transactions table
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  amount decimal(12,2) not null,
  description text not null,
  category text not null, -- 'Brand Deal', 'Ad Revenue', 'Affiliate', 'Digital Product', 'Other'
  date date not null default current_date,
  status text default 'completed', -- 'pending', 'completed', 'cancelled'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.transactions enable row level security;

-- Policies
create policy "Users can view their own transactions"
  on transactions for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own transactions"
  on transactions for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own transactions"
  on transactions for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own transactions"
  on transactions for delete
  using ( auth.uid() = user_id );
