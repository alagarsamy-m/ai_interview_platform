import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') || '/dashboard'

    if (code) {
      const supabase = createRouteHandlerClient({ cookies })
      
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/error?error=${encodeURIComponent(error.message)}`
        )
      }

      // Successful authentication
      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    }

    // If no code is present, redirect to the error page
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/error?error=${encodeURIComponent('No authentication code provided')}`
    )
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/error?error=${encodeURIComponent('Authentication failed')}`
    )
  }
} 