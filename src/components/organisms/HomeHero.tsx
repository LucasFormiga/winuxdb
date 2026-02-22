import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'

export default function HomeHero() {
  const t = useTranslations('Home.hero')

  return (
    <section className="glass-panel rounded-3xl px-6 py-10 sm:px-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span>{t('kickerPrimary')}</span>
          <span className="text-primary/80">•</span>
          <span>{t('kickerSecondary')}</span>
        </div>
        <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">{t('title')}</h1>
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">{t('subtitle')}</p>
        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link href="/apps">{t('ctaPrimary')}</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="#quiz">{t('ctaSecondary')}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
