import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') || '/'

    if (code) {
      // Pass the cookies function directly, do NOT await
      const supabase = createRouteHandlerClient({ cookies });
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('[Callback] Auth callback error:', error);
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/error?error=${encodeURIComponent(error.message)}`
        );
      }

      // Successful authentication
      console.log('[Callback] Successful authentication, redirecting to:', `${requestUrl.origin}${next}`);
      
      // Add a small delay to ensure session is properly set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    }

    // If no code is present, redirect to the error page
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/error?error=${encodeURIComponent('No authentication code provided')}`
    );
  } catch (error) {
    console.error('[Callback] Auth callback error (catch block):', error);
    // Ensure requestUrl is defined in the catch block
    let origin = '/';
    try {
      const requestUrl = new URL(request.url);
      origin = requestUrl.origin;
    } catch {}
    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent('Authentication failed')}`
    );
  }
} 