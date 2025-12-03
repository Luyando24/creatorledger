-- Create brand_deals table
create table if not exists public.brand_deals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  brand_name text not null,
  contact_person text,
  contact_email text,
  deal_value decimal(12,2) default 0,
  currency text default 'USD',
  status text default 'pitching', -- 'pitching', 'negotiating', 'contract_sent', 'signed', 'in_progress', 'completed', 'cancelled'
  deliverables text,
  deadline date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.brand_deals enable row level security;

-- Policies
create policy "Users can view their own brand deals"
  on brand_deals for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own brand deals"
  on brand_deals for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own brand deals"
  on brand_deals for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own brand deals"
  on brand_deals for delete
  using ( auth.uid() = user_id );
