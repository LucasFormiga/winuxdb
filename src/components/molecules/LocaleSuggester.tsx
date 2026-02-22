'use client'

import { X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from '@/i18n/routing'

const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  pt: 'Português',
  es: 'Español'
}

export default function LocaleSuggester() {
  const locale = useLocale()
  const t = useTranslations('LocaleSuggester')
  const pathname = usePathname()
  const router = useRouter()
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const isDismissed = localStorage.getItem('dismissed-locale-suggestion')
    if (isDismissed) return

    const browserLang = navigator.language.split('-')[0]
    if (['pt', 'es'].includes(browserLang) && browserLang !== locale) {
      setSuggestion(browserLang)
    }
  }, [locale])

  if (!suggestion || dismissed) return null

  const handleSwitch = () => {
    router.replace(pathname, { locale: suggestion as any })
    setDismissed(true)
  }

  const handleDismiss = () => {
    localStorage.setItem('dismissed-locale-suggestion', 'true')
    setDismissed(true)
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 rounded-2xl border border-primary/30 bg-card/95 p-4 shadow-2xl backdrop-blur-xl sm:gap-6">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-muted-foreground">
            {t('message', { language: LOCALE_NAMES[suggestion] })}
          </p>
          <button
            onClick={handleSwitch}
            className="text-left text-sm font-bold text-primary hover:underline"
          >
            {t('action', { language: LOCALE_NAMES[suggestion] })}
          </button>
        </div>
        <button
          onClick={handleDismiss}
          className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label={t('close')}
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
