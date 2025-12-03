import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const clientId = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/social/instagram/callback`;
    const state = userId; // Pass user ID in state to identify user in callback

    if (!clientId) {
        return NextResponse.json({ error: 'Facebook Client ID is not configured' }, { status: 500 });
    }

    // Scopes required for Instagram Graph API
    const scopes = [
        'pages_show_list',
        'instagram_basic',
        'instagram_manage_insights',
        'pages_read_engagement'
    ].join(',');

    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scopes}&response_type=code`;

    return NextResponse.redirect(authUrl);
}
