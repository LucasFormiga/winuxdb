import { vi } from 'vitest'

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
  
  // biome-ignore lint/suspicious/noThenProperty: Needed for await support in mocks
  b.then = vi.fn().mockImplementation((onFulfilled: any) => 
    Promise.resolve({ data: [], error: null, count: 0 }).then(onFulfilled)
  )
  
  return b
}

export const mockSupabase = {
  auth: {
    getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    signInWithOAuth: vi.fn(() => Promise.resolve({ data: { url: 'https://example.com' }, error: null })),
    signOut: vi.fn(() => Promise.resolve({ error: null }))
  },
  from: vi.fn().mockImplementation(() => createMockBuilder())
}

export const createClient = vi.fn(() => mockSupabase)
export const createPublicClient = vi.fn(() => mockSupabase)
