import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getApps, getAppBySlug, getStats } from '@/lib/actions/apps'

const { mockCreateClient, mockCreatePublicClient, mockBuilder } = vi.hoisted(() => {
  const b: any = {
    select: vi.fn(),
    eq: vi.fn(),
    is: vi.fn(),
    or: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
    range: vi.fn(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
    update: vi.fn().mockResolvedValue({ data: null, error: null }),
    delete: vi.fn().mockResolvedValue({ data: null, error: null }),
    then: vi.fn().mockImplementation((onFulfilled) => {
      return Promise.resolve({ data: [], error: null }).then(onFulfilled)
    })
  }
  
  b.select.mockImplementation(() => b)
  b.eq.mockImplementation(() => b)
  b.is.mockImplementation(() => b)
  b.or.mockImplementation(() => b)
  b.order.mockImplementation(() => b)
  b.limit.mockImplementation(() => b)
  b.range.mockImplementation(() => b)

  const mockSupabase = {
    from: vi.fn().mockReturnValue(b)
  }

  return {
    mockBuilder: b,
    mockCreateClient: vi.fn(() => Promise.resolve(mockSupabase)),
    mockCreatePublicClient: vi.fn(() => mockSupabase)
  }
})

vi.mock('@/lib/supabase/server', () => ({
  createClient: mockCreateClient,
  createPublicClient: mockCreatePublicClient
}))

describe('Apps Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getApps', () => {
    it('uses createPublicClient by default', async () => {
      mockBuilder.then.mockImplementationOnce((res: any) => res({ data: [], error: null }))
      await getApps()
      expect(mockCreatePublicClient).toHaveBeenCalled()
      expect(mockCreateClient).not.toHaveBeenCalled()
    })

    it('uses createClient when forceFresh is true', async () => {
      mockBuilder.then.mockImplementationOnce((res: any) => res({ data: [], error: null }))
      await getApps({ forceFresh: true })
      expect(mockCreateClient).toHaveBeenCalled()
    })

    it('fetches and calculates community ratings', async () => {
      mockBuilder.then.mockImplementationOnce((onFulfilled: any) => {
        return Promise.resolve({
          data: [
            { 
              id: '1', 
              name: 'Test App', 
              overall_rating: 'GOLD',
              reviews: [{ rating: 'PLATINUM' }, { rating: 'PLATINUM' }] 
            }
          ],
          count: 1
        }).then(onFulfilled)
      })

      const result = await getApps()
      
      expect(result.apps).toBeDefined()
      expect(result.apps![0].overall_rating).toBe('PLATINUM')
    })
  })

  describe('getAppBySlug', () => {
    it('uses createPublicClient by default', async () => {
      mockBuilder.maybeSingle.mockResolvedValue({ data: { id: '1' }, error: null })
      await getAppBySlug('test-app')
      expect(mockCreatePublicClient).toHaveBeenCalled()
      expect(mockCreateClient).not.toHaveBeenCalled()
    })

    it('uses createClient when forceFresh is true', async () => {
      mockBuilder.maybeSingle.mockResolvedValue({ data: { id: '1' }, error: null })
      await getAppBySlug('test-app', true)
      expect(mockCreateClient).toHaveBeenCalled()
    })

    it('returns null if app not found', async () => {
      mockBuilder.maybeSingle.mockResolvedValue({ data: null, error: null })
      
      const result = await getAppBySlug('non-existent')
      expect(result).toBeNull()
    })
  })

  describe('getStats', () => {
    it('returns counts from database', async () => {
      mockBuilder.then
        .mockImplementationOnce((res: any) => res({ count: 100, error: null }))
        .mockImplementationOnce((res: any) => res({ count: 50, error: null }))

      const stats = await getStats()
      expect(stats.appsCount).toBe(100)
      expect(stats.reviewsCount).toBe(50)
      expect(stats.distrosCount).toBeGreaterThan(0)
    })
  })
})
