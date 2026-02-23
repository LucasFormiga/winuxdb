import { getTranslations, setRequestLocale } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Contribute' })
  return { title: t('title') }
}

export default async function ContributePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Contribute')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="hero-glow relative overflow-hidden">
        <div className="surface-grid absolute inset-0 opacity-60" />
        <div className="surface-noise absolute inset-0 opacity-70" />

        <main className="relative z-10 mx-auto max-w-4xl px-6 pb-20 pt-12 lg:px-8">
          <section className="glass-panel rounded-3xl p-8 sm:p-12">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{t('title')}</h1>
            <p className="mt-4 text-lg text-primary/80">{t('subtitle')}</p>

            <div className="mt-12 space-y-12 leading-relaxed text-muted-foreground">
              <p className="text-xl text-foreground/90">{t('intro')}</p>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">{t('sections.reporting.title')}</h2>
                <p className="text-lg">{t('sections.reporting.content')}</p>
                <a
                  href="https://github.com/LucasFormiga/winuxdb"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded-full bg-primary/10 px-6 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
                >
                  GitHub Repository →
                </a>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">{t('sections.code.title')}</h2>
                <p className="text-lg">{t('sections.code.content')}</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">{t('sections.governance.title')}</h2>
                <p className="text-lg">{t('sections.governance.content')}</p>
              </div>

              <div className="mt-16 rounded-3xl border border-border/60 bg-card/40 p-8 text-center">
                <p className="text-sm">
                  Ready to start? Visit us on{' '}
                  <a href="https://github.com/LucasFormiga/winuxdb" className="text-primary underline">
                    GitHub
                  </a>{' '}
                  and let's make Linux better together.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
