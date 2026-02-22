import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, it, expect, vi } from 'vitest'
import FilterSort from '@/components/molecules/FilterSort'
import messages from '../../messages/en.json'

describe('FilterSort', () => {
  it('renders filter and sort options', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
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
      </NextIntlClientProvider>
    )
    expect(screen.getByText(/all ratings/i)).toBeDefined()
    expect(screen.getByText(/popularity/i)).toBeDefined()
  })
})
