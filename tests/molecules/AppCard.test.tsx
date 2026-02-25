import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, it, expect } from 'vitest'
import AppCard from '@/components/molecules/AppCard'
import messages from '../../messages/en.json'
import { App } from '@/lib/types'

const mockApp: App = {
  id: '1',
  name: 'Test App',
  version: 'Latest',
  recommendedVersion: 'Native',
  rating: 'GOLD',
  score: 4,
  category: 'Audio',
  license: 'Proprietary',
  author: 'Test Author',
  releaseDate: '2023-01-01',
  popularity: 100,
  recommendedAlternatives: [],
  nativeAlternatives: [],
  isVerified: false
}

describe('AppCard', () => {
  it('renders app name and rating', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <AppCard app={mockApp} />
      </NextIntlClientProvider>
    )
    expect(screen.getByText('Test App')).toBeDefined()
    expect(screen.getByText(/gold/i)).toBeDefined()
  })

  it('renders logo image when provided', () => {
    const appWithLogo: App = {
      ...mockApp,
      logo: 'https://example.com/logo.png'
    }

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <AppCard app={appWithLogo} />
      </NextIntlClientProvider>
    )

    const image = screen.getByRole('img', { name: 'Test App' })
    expect(image).toHaveAttribute('src', 'https://example.com/logo.png')
  })
})
