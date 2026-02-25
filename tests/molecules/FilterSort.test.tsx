import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import FilterSort from '@/components/molecules/FilterSort'

// Mocks are in setup.ts

describe('FilterSort', () => {
  it('renders filter and sort options', () => {
    render(
      <FilterSort
        onRatingChange={vi.fn()}
        onSortChange={vi.fn()}
        onCategoryChange={vi.fn()}
        onLicenseChange={vi.fn()}
        onAlternativesChange={vi.fn()}
        activeRating="ALL"
        activeSort="popularity"
        activeCategory="ALL"
        activeLicense="ALL"
        activeAlternatives="ALL"
        categories={['Audio', 'Video']}
        licenses={['Freeware', 'Proprietary']}
      />
    )
    
    // Check if Ratings ALL is present
    expect(screen.getAllByText(/Ratings.ALL/i).length).toBeGreaterThan(0)
    
    // Check if sort is present (it might show Filters.all or Filters.popularity depending on implementation)
    expect(screen.getAllByText(/Filters\./i).length).toBeGreaterThan(0)
    
    // Check if categories/licenses labels are present
    expect(screen.getByText(/Filters.category/i)).toBeInTheDocument()
    expect(screen.getByText(/Filters.license/i)).toBeInTheDocument()
  })
})
