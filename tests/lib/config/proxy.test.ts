import { NextRequest, NextResponse } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { updateSession } from '@/lib/supabase/middleware'
import proxy from '@/proxy'

vi.mock('@/lib/supabase/middleware', () => ({
  updateSession: vi.fn()
}))

beforeEach(() => {
  vi.mocked(updateSession).mockResolvedValue(NextResponse.next())
})

describe('Next.js locale and session proxy', () => {
  it('rewrites the unprefixed default locale without redirecting', async () => {
    const request = new NextRequest('https://winuxdb.example/login')
    const response = await proxy(request)

    expect(updateSession).toHaveBeenCalledWith(request)
    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
    expect(response.headers.get('x-middleware-rewrite')).toBe('https://winuxdb.example/en/login')
  })

  it('keeps non-default locale routes intact', async () => {
    const response = await proxy(new NextRequest('https://winuxdb.example/pt/login'))

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
    expect(response.headers.get('x-middleware-rewrite')).toBeNull()
  })

  it('redirects an explicit default locale to its canonical unprefixed URL', async () => {
    const response = await proxy(new NextRequest('https://winuxdb.example/en/login'))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('https://winuxdb.example/login')
  })

  it('preserves refreshed session cookies and their security attributes', async () => {
    const sessionResponse = NextResponse.next()
    sessionResponse.cookies.set('test-session', 'refreshed', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax'
    })
    vi.mocked(updateSession).mockResolvedValue(sessionResponse)

    const response = await proxy(new NextRequest('https://winuxdb.example/login'))

    expect(response.cookies.get('test-session')).toMatchObject({
      value: 'refreshed',
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax'
    })
  })
})
