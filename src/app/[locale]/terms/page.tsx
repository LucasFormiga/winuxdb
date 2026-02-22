import { getTranslations, setRequestLocale } from 'next-intl/server'
import SiteHeader from '@/components/organisms/SiteHeader'

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Terms')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="hero-glow relative overflow-hidden">
        <div className="surface-grid absolute inset-0 opacity-60" />
        <div className="surface-noise absolute inset-0 opacity-70" />
        <SiteHeader />

        <main className="relative z-10 mx-auto max-w-4xl px-6 pb-20 pt-12 lg:px-8">
          <section className="glass-panel rounded-3xl p-8 sm:p-12">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{t('title')}</h1>
            <p className="mt-4 text-sm text-muted-foreground">{t('lastUpdated')}</p>
            
            <div className="mt-10 space-y-12 leading-relaxed text-muted-foreground">
              <p className="text-lg text-foreground/90">{t('intro')}</p>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">{t('sections.noWarranty.title')}</h2>
                <p>{t('sections.noWarranty.content')}</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">{t('sections.liability.title')}</h2>
                <p>{t('sections.liability.content')}</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">{t('sections.affiliation.title')}</h2>
                <p>{t('sections.affiliation.content')}</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
