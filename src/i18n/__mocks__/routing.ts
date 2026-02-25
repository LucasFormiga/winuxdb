import React from 'react'
import { vi } from 'vitest'

export const Link = ({ children, href, ...props }: any) => React.createElement('a', { href, ...props }, children)

export const useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn()
}))

export const usePathname = vi.fn(() => '/')
