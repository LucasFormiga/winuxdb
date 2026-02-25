import { ShieldCheck } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'

interface GuidelinesPageProps {
  params: Promise<{ locale: string }>
}

export default async function GuidelinesPage({ params }: GuidelinesPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Guidelines')

  const sections = ['respect', 'trolls', 'integrity', 'legal', 'enforcement']

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <div className="hero-glow relative overflow-hidden">
        <div className="surface-grid absolute inset-0 opacity-60" />
        <div className="surface-noise absolute inset-0 opacity-70" />

        <main className="relative z-10 mx-auto max-w-4xl px-6 pb-32 pt-20 lg:px-8">
          <div className="mb-16 flex flex-col items-center text-center">
            <div className="mb-6 flex size-16 items-center justify-center rounded-[1.5rem] border border-primary/20 bg-primary/5 text-primary shadow-2xl shadow-primary/20">
              <ShieldCheck className="size-8" />
            </div>
            <h1 className="mb-4 text-4xl font-black uppercase tracking-tight sm:text-6xl">{t('title')}</h1>
            <p className="text-xl font-medium text-muted-foreground">{t('subtitle')}</p>
          </div>

          <div className="glass-panel relative overflow-hidden rounded-[2.5rem] border-border/40 p-8 sm:p-12 md:p-16">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground/90">{t('intro')}</p>

              <div className="mt-12 space-y-12">
                {sections.map((section) => (
                  <section key={section} className="space-y-4">
                    <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground">
                      {t(`sections.${section}.title`)}
                    </h2>
                    <p className="text-lg leading-relaxed text-muted-foreground/90">
                      {t(`sections.${section}.content`)}
                    </p>
                  </section>
                ))}
              </div>
            </div>

            {/* Decorative background glow */}
            <div className="absolute -bottom-24 -right-24 -z-10 size-64 rounded-full bg-primary/5 blur-[100px]" />
          </div>
        </main>
      </div>
    </div>
  )
}
