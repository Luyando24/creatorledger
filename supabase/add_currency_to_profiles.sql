-- Add currency column to profiles table
alter table public.profiles 
add column if not exists currency text default 'USD';

-- Update existing rows if needed (optional, as default handles new ones)
-- update public.profiles set currency = 'USD' where currency is null;
