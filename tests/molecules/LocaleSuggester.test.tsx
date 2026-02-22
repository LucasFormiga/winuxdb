import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LocaleSuggester from '@/components/molecules/LocaleSuggester'

const replaceSpy = vi.fn()

vi.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string, values?: Record<string, string>) => {
    if (key === 'message') return `Browser set to ${values?.language}`
    if (key === 'action') return `Switch to ${values?.language}?`
    if (key === 'close') return 'Dismiss'
    return key
  }
}))

vi.mock('@/i18n/routing', () => ({
  usePathname: () => '/',
  useRouter: () => ({ replace: replaceSpy })
}))

describe('LocaleSuggester', () => {
  beforeEach(() => {
    replaceSpy.mockClear()
    localStorage.clear()
    Object.defineProperty(navigator, 'language', {
      value: 'pt-BR',
      configurable: true
    })
  })

  it('suggests switching locales and triggers navigation', () => {
    render(<LocaleSuggester />)

    const action = screen.getByRole('button', { name: /switch to português\?/i })
    fireEvent.click(action)

    expect(replaceSpy).toHaveBeenCalledWith('/', { locale: 'pt' })
  })

  it('dismisses suggestion and stores preference', () => {
    render(<LocaleSuggester />)

    const dismiss = screen.getByRole('button', { name: /dismiss/i })
    fireEvent.click(dismiss)

    expect(localStorage.getItem('dismissed-locale-suggestion')).toBe('true')
    expect(screen.queryByText(/browser set to/i)).toBeNull()
  })

  it('does not render when previously dismissed', () => {
    localStorage.setItem('dismissed-locale-suggestion', 'true')

    const { container } = render(<LocaleSuggester />)

    expect(container).toBeEmptyDOMElement()
  })
})
