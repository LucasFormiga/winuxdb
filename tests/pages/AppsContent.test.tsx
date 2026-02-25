import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AppsContent from '@/app/[locale]/apps/AppsContent'

// Mocks are in setup.ts

const mockApps = [
  {
    id: '1',
    name: 'App One',
    slug: 'app-one',
    overall_rating: 'GOLD',
    category: 'Utility',
    license: 'Proprietary',
    popularity: 5,
    author: 'Author A'
  },
  {
    id: '2',
    name: 'App Two',
    slug: 'app-two',
    overall_rating: 'PLATINUM',
    category: 'Game',
    license: 'Open Source',
    popularity: 3,
    author: 'Author B'
  }
]

describe('AppsContent', () => {
  const initialFilters = {
    search: '',
    category: 'ALL',
    rating: 'ALL' as const,
    license: 'ALL',
    sort: 'rating' as const,
    alternatives: 'ALL' as const
  }

  it('renders the list of apps', () => {
    render(
      <AppsContent 
        apps={mockApps as any} 
        categories={['Utility', 'Game']} 
        licenses={['Proprietary', 'Open Source']}
        initialFilters={initialFilters}
      />
    )

    expect(screen.getAllByText('App One').length).toBeGreaterThan(0)
    expect(screen.getAllByText('App Two').length).toBeGreaterThan(0)
  })

  it('shows empty state when no apps match', () => {
    render(
      <AppsContent 
        apps={[]} 
        categories={[]} 
        licenses={[]}
        initialFilters={initialFilters}
      />
    )

    expect(screen.getByText('Apps.emptyState')).toBeDefined()
  })
})
