-- Add unique constraint to allow upsert
alter table public.social_accounts 
add constraint social_accounts_user_platform_key unique (user_id, platform, instagram_business_id);

-- Or just user_id and platform if we only allow one per platform?
-- Let's stick to flexible, but for upsert we need a constraint.
-- If instagram_business_id is null (for other platforms), this constraint allows multiple nulls.
-- But for Instagram it will enforce uniqueness.
