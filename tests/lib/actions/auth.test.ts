import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getUserData, updateProfile } from '@/lib/actions/auth'
import { createClient } from '@/lib/supabase/server'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn()
}))

describe('Auth Actions', () => {
  const mockSupabase = {
    auth: {
      getUser: vi.fn(),
      signOut: vi.fn()
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(createClient as any).mockResolvedValue(mockSupabase)
  })

  describe('getUserData', () => {
    it('returns null if no authenticated user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })
      
      const result = await getUserData()
      expect(result).toBeNull()
    })

    it('returns fallback data from auth metadata if profile missing', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { 
          user: { 
            id: '123', 
            email: 'test@example.com',
            user_metadata: { full_name: 'Test User' } 
          } 
        } 
      })
      mockSupabase.maybeSingle.mockResolvedValue({ data: null })

      const result = await getUserData()
      expect(result.nickname).toBe('Test User')
      expect(result.email).toBe('test@example.com')
    })

    it('returns combined profile data if exists', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: '123', email: 'test@example.com' } } 
      })
      mockSupabase.maybeSingle.mockResolvedValue({ 
        data: { id: '123', nickname: 'ProfileNick', avatar_url: 'url' } 
      })

      const result = await getUserData()
      expect(result.nickname).toBe('ProfileNick')
      expect(result.email).toBe('test@example.com')
    })
  })
})
