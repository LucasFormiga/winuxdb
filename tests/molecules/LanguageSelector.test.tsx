import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LanguageSelector from '@/components/molecules/LanguageSelector'
import { mockRouter } from '@/../tests/setup'

// The mocks are now in setup.ts

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => children,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick, 'data-testid': testId }: any) => (
    <button type="button" onClick={() => onClick && onClick()} data-testid={testId}>
      {children}
    </button>
  ),
}))

vi.mock('@/lib/actions/auth', () => ({
  updateProfile: vi.fn().mockResolvedValue({ success: true })
}))

describe('LanguageSelector', () => {
  it('renders correctly', () => {
    render(<LanguageSelector />)
    // Should find the trigger button
    expect(screen.getByTestId('language-selector-trigger')).toBeInTheDocument()
  })

  it('switches locale when selection changes', () => {
    render(<LanguageSelector />)

    const ptItem = screen.getByTestId('language-item-pt')
    fireEvent.click(ptItem)
    expect(mockRouter.replace).toHaveBeenCalledWith('/', { locale: 'pt' })
  })
})
