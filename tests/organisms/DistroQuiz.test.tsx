import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import DistroQuiz from '@/components/organisms/DistroQuiz'

// Mocks are in setup.ts

describe('DistroQuiz', () => {
  const renderQuiz = () => {
    return render(<DistroQuiz />)
  }

  it('renders correctly and has a reset button', async () => {
    renderQuiz()
    expect(screen.getByText('Home.quiz.title')).toBeInTheDocument()
    expect(screen.getByText('Home.quiz.reset')).toBeInTheDocument()
  })

  it('navigates through steps', async () => {
    renderQuiz()

    // Skip to next step
    fireEvent.click(screen.getByText(/Home.quiz.skip/i))
    
    // Should show next question
    expect(screen.getByText('Home.quiz.questions.gpu.label')).toBeInTheDocument()
  })

  it('displays results', () => {
    renderQuiz()

    // The quiz shows results by default or after completion
    expect(screen.getByText('Home.quiz.topMatches')).toBeInTheDocument()
    expect(screen.getAllByText(/Home.quiz.specialistChoice/i).length).toBeGreaterThan(0)
  })
})
