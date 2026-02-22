import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'

export default function ConversionBand() {
  const t = useTranslations('Home.conversion')

  return (
    <section className="glass-panel flex flex-col gap-6 rounded-3xl px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t('kicker')}</p>
        <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{t('title')}</h2>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button asChild size="lg">
          <Link href="/apps">{t('ctaPrimary')}</Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href="#quiz">{t('ctaSecondary')}</Link>
        </Button>
      </div>
    </section>
  )
}
