import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ThemeSwitcher } from '@/components/molecules/ThemeSwitcher'

const setThemeSpy = vi.fn()
let currentTheme = 'dark'

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: currentTheme, setTheme: setThemeSpy })
}))

describe('ThemeSwitcher', () => {
  it('toggles theme on click', () => {
    render(<ThemeSwitcher />)

    const button = screen.getByRole('button', { name: /toggle theme/i })
    fireEvent.click(button)
    expect(setThemeSpy).toHaveBeenCalledWith('light')
  })

  it('toggles back when light theme is active', () => {
    currentTheme = 'light'
    render(<ThemeSwitcher />)

    const button = screen.getByRole('button', { name: /toggle theme/i })
    fireEvent.click(button)
    expect(setThemeSpy).toHaveBeenCalledWith('dark')
    currentTheme = 'dark'
  })
})
