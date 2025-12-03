import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const userId = searchParams.get('state');
    const error = searchParams.get('error');

    if (error || !code || !userId) {
        return NextResponse.redirect(new URL('/dashboard?error=auth_failed', request.url));
    }

    const clientId = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID;
    const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/social/instagram/callback`;

    if (!clientId || !clientSecret) {
        console.error('Missing Facebook credentials');
        return NextResponse.redirect(new URL('/dashboard?error=config_missing', request.url));
    }

    try {
        // 1. Exchange code for access token
        const tokenRes = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`);
        const tokenData = await tokenRes.json();

        if (tokenData.error) {
            console.error('Token Exchange Error:', tokenData.error);
            throw new Error(tokenData.error.message);
        }

        const accessToken = tokenData.access_token;

        // 2. Get Pages and connected IG accounts
        const pagesRes = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}&fields=id,name,instagram_business_account`);
        const pagesData = await pagesRes.json();

        if (pagesData.error) {
            console.error('Pages Fetch Error:', pagesData.error);
            throw new Error(pagesData.error.message);
        }

        // Find first page with IG account
        const pageWithIg = pagesData.data?.find((p: any) => p.instagram_business_account);

        if (!pageWithIg) {
             return NextResponse.redirect(new URL('/dashboard?error=no_ig_account', request.url));
        }

        const igBusinessId = pageWithIg.instagram_business_account.id;

        // 3. Get IG Account Details
        const igRes = await fetch(`https://graph.facebook.com/v18.0/${igBusinessId}?fields=username,followers_count,media_count&access_token=${accessToken}`);
        const igData = await igRes.json();

        if (igData.error) throw new Error(igData.error.message);

        // 4. Save to Supabase
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        
        if (!supabaseServiceKey) {
            throw new Error('Missing Supabase Service Key');
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Check if account exists to decide on insert vs update (or use upsert with constraint)
        // We will attempt upsert assuming the constraint exists, or handle error
        const { error: dbError } = await supabase
            .from('social_accounts')
            .upsert({
                user_id: userId,
                platform: 'Instagram',
                handle: `@${igData.username}`,
                instagram_business_id: igBusinessId,
                access_token: accessToken, 
                follower_count: igData.followers_count,
                status: 'connected',
                last_synced_at: new Date().toISOString()
            }, { onConflict: 'user_id, platform, instagram_business_id' });

        if (dbError) {
            console.error('DB Error:', dbError);
            throw dbError;
        }

        return NextResponse.redirect(new URL('/dashboard?success=instagram_connected', request.url));

    } catch (err) {
        console.error('Instagram Auth Error:', err);
        return NextResponse.redirect(new URL('/dashboard?error=instagram_connection_failed', request.url));
    }
}
