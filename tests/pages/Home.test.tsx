import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HomeHero from '@/components/organisms/HomeHero'

// Mocks are in setup.ts

describe('HomeHero', () => {
  it('renders correctly', () => {
    render(<HomeHero />)
    expect(screen.getByText('Home.hero.title')).toBeDefined()
    expect(screen.getByText('Home.hero.ctaPrimary')).toBeDefined()
  })
})
