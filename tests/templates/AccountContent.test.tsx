import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AccountContent from '@/components/templates/AccountContent'

// Mocks are in setup.ts

const mockUser = {
  id: '123',
  nickname: 'TestUser',
  email: 'test@example.com',
  avatar_url: 'https://example.com/avatar.png',
  default_language: 'en',
  devices: []
}

describe('AccountContent', () => {
  it('renders user information correctly', () => {
    render(<AccountContent user={mockUser as any} />)

    expect(screen.getByText('TestUser')).toBeDefined()
    expect(screen.getByText('test@example.com')).toBeDefined()
  })

  it('renders both navigation tabs', () => {
    render(<AccountContent user={mockUser as any} />)

    // Using getAllByText because "Preferences" and "Devices" appear in tabs and headers
    expect(screen.getAllByText(/Preferences/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Devices/i).length).toBeGreaterThan(0)
  })
})
