import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { getBaseUrl } from '../utils'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            request.cookies.set(name, value)
          }
          supabaseResponse = NextResponse.next({
            request
          })
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options)
          }
        }
      }
    }
  )

  // IMPORTANT: Use getUser() for secure session validation
  const { data: { user } } = await supabase.auth.getUser()

  const isBannedPage = request.nextUrl.pathname.includes('/banned')

  if (user) {
    // Check if user is banned
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_banned')
      .eq('id', user.id)
      .maybeSingle()

    if (profile?.is_banned) {
      // If banned user is NOT on /banned page and is on a restricted path, redirect to /banned
      if (!isBannedPage) {
        const isPublicPath = request.nextUrl.pathname.includes('/login') || 
                            request.nextUrl.pathname === '/' ||
                            request.nextUrl.pathname.includes('/apps')
        
        if (!isPublicPath || request.nextUrl.pathname.includes('/account') || request.nextUrl.pathname.includes('/contribute')) {
          return NextResponse.redirect(`${getBaseUrl()}/banned`)
        }
      }
    } else if (isBannedPage) {
      // If NOT banned but on /banned page, redirect to home
      return NextResponse.redirect(`${getBaseUrl()}/`)
    }
  } else if (isBannedPage) {
    // If NOT logged in but on /banned page, redirect to home
    return NextResponse.redirect(`${getBaseUrl()}/`)
  }

  return supabaseResponse
}
