-- Add columns for API integration
alter table public.social_accounts 
add column if not exists access_token text,
add column if not exists token_expires_at timestamp with time zone,
add column if not exists instagram_business_id text,
add column if not exists page_id text,
add column if not exists page_name text;

-- Create a function to update timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create trigger if not exists
drop trigger if exists update_social_accounts_updated_at on public.social_accounts;
create trigger update_social_accounts_updated_at
    before update on public.social_accounts
    for each row
    execute function update_updated_at_column();
