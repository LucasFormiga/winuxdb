'use client'

import { Globe } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePathname, useRouter } from '@/i18n/routing'

export default function LanguageSelector() {
  const t = useTranslations('LanguageSelector')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function onSelectChange(nextLocale: string) {
    localStorage.setItem('dismissed-locale-suggestion', 'true')
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <Select value={locale} onValueChange={onSelectChange}>
      <SelectTrigger id="language-select" aria-label={t('label')} className="w-[110px]">
        <Globe className="size-4 mr-2" />
        <SelectValue placeholder={t('label')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{t('en')}</SelectItem>
        <SelectItem value="pt">{t('pt')}</SelectItem>
        <SelectItem value="es">{t('es')}</SelectItem>
      </SelectContent>
    </Select>
  )
}
