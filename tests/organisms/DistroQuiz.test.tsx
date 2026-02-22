import { render, screen, fireEvent } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, it, expect, vi } from 'vitest'
import DistroQuiz from '@/components/organisms/DistroQuiz'
import messages from '../../messages/en.json'

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />
}))

describe('DistroQuiz', () => {
  it('updates recommended flavor when a desktop option is selected', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <DistroQuiz />
      </NextIntlClientProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /flexible and familiar/i }))
    expect(screen.getAllByText(/kde/i).length).toBeGreaterThan(0)
  })

  it('resets answers to defaults', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <DistroQuiz />
      </NextIntlClientProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /rolling/i }))
    fireEvent.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.getByRole('button', { name: /stability and long-term support/i })).toHaveClass(
      'border-primary/60'
    )
  })
})
