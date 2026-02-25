import { describe, it, expect, vi, beforeEach } from 'vitest'
import { deleteDevice } from '@/lib/actions/devices'

const createMockBuilder = () => {
  const b: any = {
    select: vi.fn(),
    eq: vi.fn(),
    is: vi.fn(),
    order: vi.fn(),
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
  b.order.mockImplementation(chainable)
  b.update.mockImplementation(chainable)
  
  b.then = vi.fn().mockImplementation((onFulfilled: any) => 
    Promise.resolve({ data: [], error: null, count: 0 }).then(onFulfilled)
  )
  
  return b
}

const mockBuilder = createMockBuilder()

const mockSupabase = {
  auth: {
    getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'user-123' } }, error: null })),
  },
  from: vi.fn().mockReturnValue(mockBuilder)
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => mockSupabase)
}))

describe('Devices Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('deleteDevice', () => {
    it('performs soft delete and transfers primary status', async () => {
      const mockDevices = [
        { id: 'dev-1', is_primary: true, user_id: 'user-123' },
        { id: 'dev-2', is_primary: false, user_id: 'user-123' }
      ]
      
      // Override default then for the initial fetch in deleteDevice
      mockBuilder.then.mockImplementationOnce((res: any) => res({ data: mockDevices, error: null }))
      
      const result = await deleteDevice('dev-1')
      
      expect(result.success).toBe(true)
      expect(mockBuilder.update).toHaveBeenCalledWith(expect.objectContaining({
        deleted_at: expect.any(String),
        is_primary: false
      }))
      expect(mockBuilder.update).toHaveBeenCalledWith({ is_primary: true })
    })

    it('returns error if not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: null
      } as any)

      const result = await deleteDevice('any-id')
      expect(result.error).toBe('Not authenticated')
    })
  })
})
