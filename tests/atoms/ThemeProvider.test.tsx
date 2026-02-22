import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ThemeProvider } from '@/components/atoms/ThemeProvider'

const ThemeProviderMock = vi.fn(({ children, ...props }) => (
  <div data-testid="theme-provider" data-attribute={props.attribute} data-default={props.defaultTheme}>
    {children}
  </div>
))

vi.mock('next-themes', () => ({
  ThemeProvider: (props: { children: React.ReactNode }) => ThemeProviderMock(props)
}))

describe('ThemeProvider', () => {
  it('renders children with provided props', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system">
        <span>Theme content</span>
      </ThemeProvider>
    )

    expect(screen.getByText('Theme content')).toBeInTheDocument()
    const provider = screen.getByTestId('theme-provider')
    expect(provider).toHaveAttribute('data-attribute', 'class')
    expect(provider).toHaveAttribute('data-default', 'system')
  })
})
