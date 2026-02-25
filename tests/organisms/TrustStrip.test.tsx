import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, it, expect } from 'vitest'
import TrustStrip from '@/components/organisms/TrustStrip'
import messages from '../../messages/en.json'

describe('TrustStrip', () => {
  it('renders dynamic counts correctly', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <TrustStrip appsCount={123} reviewsCount={45} distrosCount={30} />
      </NextIntlClientProvider>
    )

    expect(screen.getByText('123+')).toBeDefined()
    expect(screen.getByText('45+')).toBeDefined()
    expect(screen.getByText('30+')).toBeDefined()
  })
})
