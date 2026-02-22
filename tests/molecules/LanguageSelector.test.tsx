import { fireEvent, render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, it, expect, vi } from 'vitest'
import LanguageSelector from '@/components/molecules/LanguageSelector'
import messages from '../../messages/en.json'

// Mock @/i18n/routing
const mockReplace = vi.fn()
vi.mock('@/i18n/routing', () => ({
  usePathname: () => '/',
  useRouter: () => ({ replace: mockReplace })
}))

vi.mock('@/components/ui/select', () => ({
  Select: ({ onValueChange, children }: { onValueChange: (value: string) => void; children: React.ReactNode }) => (
    <div>
      <button type="button" onClick={() => onValueChange('pt')}>
        Change language
      </button>
      {children}
    </div>
  ),
  SelectTrigger: ({ children, ...props }: { children: React.ReactNode }) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
  SelectValue: ({ placeholder }: { placeholder: string }) => <span>{placeholder}</span>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

describe('LanguageSelector', () => {
  it('renders with current language label', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <LanguageSelector />
      </NextIntlClientProvider>
    )
    expect(screen.getByLabelText(/language/i)).toBeDefined()
  })

  it('switches locale when selection changes', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <LanguageSelector />
      </NextIntlClientProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /change language/i }))
    expect(mockReplace).toHaveBeenCalledWith('/', { locale: 'pt' })
  })
})
