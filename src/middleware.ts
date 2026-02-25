import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { updateSession } from './lib/supabase/middleware'

const intlMiddleware = createMiddleware(routing)

export default async function middleware(request: NextRequest) {
  // Update Supabase session
  const supabaseResponse = await updateSession(request)

  // Apply next-intl middleware
  const response = intlMiddleware(request)

  // Copy cookies from supabaseResponse to the final response
  // to ensure session updates are preserved
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, {
      ...cookie
      // Ensure we don't accidentally overwrite path if next-intl set it
    })
  })

  return response
}

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - all root files (favicon.ico, etc.)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
