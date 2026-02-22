import { getTranslations, setRequestLocale } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'About' })
  return { title: t('title') }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('About')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="hero-glow relative overflow-hidden">
        <div className="surface-grid absolute inset-0 opacity-60" />
        <div className="surface-noise absolute inset-0 opacity-70" />

        <main className="relative z-10 mx-auto max-w-4xl px-6 pb-20 pt-12 lg:px-8">
          <section className="glass-panel rounded-3xl p-8 sm:p-12">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{t('title')}</h1>
            <p className="mt-4 text-lg text-primary/80">{t('subtitle')}</p>
            
            <div className="mt-12 space-y-16 leading-relaxed text-muted-foreground">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">{t('mission.title')}</h2>
                <p className="text-lg">{t('mission.content')}</p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">{t('history.title')}</h2>
                <p className="text-lg">{t('history.content')}</p>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
                <p className="text-center italic text-foreground/80">
                  "By the community, for the community."
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
