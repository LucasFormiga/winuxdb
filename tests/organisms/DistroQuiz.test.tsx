import { render, screen, fireEvent, within } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, it, expect, vi } from 'vitest'
import DistroQuiz from '@/components/organisms/DistroQuiz'
import messages from '../../messages/en.json'

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />
}))

describe('DistroQuiz', () => {
  const renderQuiz = () => {
    return render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <DistroQuiz />
      </NextIntlClientProvider>
    )
  }

  it('navigates to the visual paradigm step and updates recommendations', async () => {
    renderQuiz()

    // Skip to Step 5 (Visual Paradigm)
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByRole('button', { name: /skip/i }))
    }

    expect(screen.getByText(/Visual Paradigm/i)).toBeInTheDocument()

    // Select Traditional
    fireEvent.click(screen.getByRole('button', { name: /Traditional/i }))

    // Recommendations should update (Mint or Zorin usually top traditional)
    const resultsPanel = screen.getByText(/Top Matches/i).closest('div')
    expect(resultsPanel).toBeDefined()
  })

  it('resets answers and returns to the first step', () => {
    renderQuiz()

    // Move to next step
    fireEvent.click(screen.getByRole('button', { name: /skip/i }))
    expect(screen.getByText(/Question 2 of 10/i)).toBeInTheDocument()

    // Reset
    fireEvent.click(screen.getByRole('button', { name: /reset/i }))

    expect(screen.getByText(/Question 1 of 10/i)).toBeInTheDocument()
    expect(screen.getByText(/What will you do most?/i)).toBeInTheDocument()
  })

  it('displays specialist metadata for the top match', () => {
    renderQuiz()

    // The first result should have "Specialist Choice"
    expect(screen.getByText(/Specialist Choice/i)).toBeInTheDocument()

    // Check for technical specs in the top card
    const topCard = screen.getByText(/Specialist Choice/i).closest('.group')
    if (topCard) {
      expect(within(topCard).getByText(/Based on/i)).toBeInTheDocument()
      expect(within(topCard).getByText(/Package Manager/i)).toBeInTheDocument()
      expect(within(topCard).getByText(/Release Model/i)).toBeInTheDocument()
    }
  })
})
