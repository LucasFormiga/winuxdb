import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'

vi.mock('next/image', () => ({
  default: (props: any) => React.createElement('img', props)
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn()
}))

vi.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => ns ? `${ns}.${key}` : key,
  useLocale: () => 'en',
  NextIntlClientProvider: ({ children }: any) => children
}))

vi.mock('next-intl/server', () => ({
  getTranslations: (ns: string) => Promise.resolve((key: string) => ns ? `${ns}.${key}` : key),
  setRequestLocale: vi.fn()
}))

export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn()
}

vi.mock('@/i18n/routing', async (importOriginal) => {
  const actual = await importOriginal() as any
  return {
    ...actual,
    Link: ({ children, href, ...props }: any) => React.createElement('a', { href, ...props }, children),
    useRouter: vi.fn(() => mockRouter),
    usePathname: vi.fn(() => '/')
  }
})

const createMockBuilder = () => {
  const b: any = {
    select: vi.fn(),
    eq: vi.fn(),
    is: vi.fn(),
    or: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
    range: vi.fn(),
    update: vi.fn(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
    delete: vi.fn().mockResolvedValue({ data: null, error: null }),
  }
  
  const chainable = () => b
  b.select.mockImplementation(chainable)
  b.eq.mockImplementation(chainable)
  b.is.mockImplementation(chainable)
  b.or.mockImplementation(chainable)
  b.order.mockImplementation(chainable)
  b.limit.mockImplementation(chainable)
  b.range.mockImplementation(chainable)
  b.update.mockImplementation(chainable)
  
  // Terminal then for select() results as a mock function
  // biome-ignore lint/suspicious/noThenProperty: Needed for await support in mocks
  b.then = vi.fn().mockImplementation((onFulfilled: any) => 
    Promise.resolve({ data: [], error: null, count: 0 }).then(onFulfilled)
  )
  
  return b
}

// Single stable mock instance
export const mockSupabase = {
  auth: {
    getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    signInWithOAuth: vi.fn(() => Promise.resolve({ data: { url: 'https://example.com' }, error: null })),
    signOut: vi.fn(() => Promise.resolve({ error: null }))
  },
  from: vi.fn().mockImplementation(() => createMockBuilder())
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => mockSupabase),
  createPublicClient: vi.fn(() => mockSupabase)
}))
