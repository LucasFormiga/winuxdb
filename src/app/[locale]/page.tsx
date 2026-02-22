import { getTranslations, setRequestLocale } from 'next-intl/server'
import ConversionBand from '@/components/organisms/ConversionBand'
import DistroQuiz from '@/components/organisms/DistroQuiz'
import HighlightsGrid from '@/components/organisms/HighlightsGrid'
import HomeHero from '@/components/organisms/HomeHero'
import HowItWorks from '@/components/organisms/HowItWorks'
import SiteHeader from '@/components/organisms/SiteHeader'
import TrustStrip from '@/components/organisms/TrustStrip'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Home')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="hero-glow relative overflow-hidden">
        <div className="surface-grid absolute inset-0 opacity-60" />
        <div className="surface-noise absolute inset-0 opacity-70" />
        <SiteHeader />

        <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pb-20 pt-12 lg:px-8">
          <HomeHero />
          <HowItWorks />
          <TrustStrip />
          <HighlightsGrid />
          <section id="quiz" className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t('quizKicker')}</p>
              <h2 className="mt-2 text-2xl font-semibold">{t('quizTitle')}</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t('quizSubtitle')}</p>
            </div>
            <DistroQuiz />
          </section>
          <ConversionBand />
        </main>
      </div>
    </div>
  )
}
