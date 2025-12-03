-- Add new columns to social_accounts table
alter table public.social_accounts 
add column if not exists engagement_rate numeric default 0,
add column if not exists last_synced_at timestamp with time zone,
add column if not exists status text default 'connected'; -- connected, error, disconnected

-- Update existing rows to have defaults
update public.social_accounts 
set engagement_rate = 0, status = 'connected' 
where engagement_rate is null;
