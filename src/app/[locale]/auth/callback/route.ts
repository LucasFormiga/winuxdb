import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
// The client you created in Step 1
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  let next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const admin = createAdminClient()
    const {
      data: { session },
      error
    } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth error during code exchange:', error.message)
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    if (session?.user) {
      console.log('User authenticated via social login:', session.user.email)

      // Fetch user profile to get default language
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('default_language')
        .eq('id', session.user.id)
        .maybeSingle()

      if (profileError) {
        console.error('Error fetching user profile:', profileError.message)
      }

      // Fallback: If profile doesn't exist (trigger failed), create it manually using ADMIN client
      if (!profile) {
        console.log('Profile not found, creating manually for:', session.user.id)
        const nickname =
          session.user.user_metadata?.nickname ||
          session.user.user_metadata?.full_name ||
          session.user.email?.split('@')[0] ||
          'User'
        const avatarUrl = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture

        const { data: newProfile, error: createError } = await admin
          .from('profiles')
          .upsert(
            {
              id: session.user.id,
              nickname: nickname,
              default_language: 'en',
              avatar_url: avatarUrl
            },
            { onConflict: 'id' }
          )
          .select('default_language')
          .maybeSingle()

        if (createError) {
          console.error('Failed to create profile manually via admin:', createError.message)
        } else {
          profile = newProfile
        }
      }

      let redirectUrl = ''
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      // Determine base URL
      if (isLocalEnv) {
        redirectUrl = `${origin}`
      } else if (forwardedHost) {
        redirectUrl = `https://${forwardedHost}`
      } else {
        redirectUrl = `${origin}`
      }

      // Handle language redirection
      if (profile?.default_language) {
        // If next path starts with a locale, replace it
        // Regex to check if path starts with /en, /pt, /es etc.
        const localeRegex = /^\/(en|pt|es)(\/|$)/
        if (localeRegex.test(next)) {
          next = next.replace(localeRegex, `/${profile.default_language}$2`)
        } else if (next === '/') {
          next = `/${profile.default_language}`
        } else {
          // If no locale in path, prepend it
          next = `/${profile.default_language}${next}`
        }
      }

      const response = NextResponse.redirect(`${redirectUrl}${next}`)

      // Set the cookie for next-intl
      if (profile?.default_language) {
        response.cookies.set('NEXT_LOCALE', profile.default_language, { path: '/' })
      }

      return response
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
