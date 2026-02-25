import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import AppAbout from '@/components/organisms/AppAbout'
import AppHero from '@/components/organisms/AppHero'
import AppStats from '@/components/organisms/AppStats'
import ReviewSection from '@/components/organisms/ReviewSection'
import { getAppBySlug } from '@/lib/actions/apps'
import { CheckCircle2, ShieldCheck } from 'lucide-react'

export async function generateStaticParams() {
  // In a real app with many apps, we might not want to pre-render all
  // For now, let's keep it simple or empty for dynamic rendering
  return []
}

interface AppPageProps {
  params: Promise<{ locale: string; id: string }>
}

export default async function AppPage({ params }: AppPageProps) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const app = await getAppBySlug(id)
  if (!app) {
    notFound()
  }

  // reviews are already fetched inside getAppBySlug via join
  const reviews = app.reviews || []
  const isNative = (app.overall_rating || app.rating) === 'NATIVE'
  const tDetail = await getTranslations('AppDetail')

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <div className="hero-glow relative overflow-hidden">
        <div className="surface-grid absolute inset-0 opacity-60" />
        <div className="surface-noise absolute inset-0 opacity-70" />

        <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 pb-32 pt-16 lg:px-8">
          {/* Main Hero Section */}
          <AppHero app={app} />

          <div className="grid gap-14 lg:grid-cols-12 lg:items-start">
            {/* Left Column: Content */}
            <div className="lg:col-span-8 space-y-16">
              <AppAbout app={app} />

              {isNative ? (
                <section className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-primary/[0.02] p-10 text-center md:p-16">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="mb-6 flex size-20 items-center justify-center rounded-[2rem] bg-primary/10 text-primary shadow-2xl shadow-primary/20">
                      <ShieldCheck className="size-10" />
                    </div>
                    <h2 className="mb-4 text-3xl font-black uppercase tracking-tight md:text-4xl">
                      {tDetail('nativeBanner.title')}
                    </h2>
                    <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground">
                      {tDetail('nativeBanner.description')}
                    </p>
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                      <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary">
                        <CheckCircle2 className="size-4" /> {tDetail('nativeBanner.featurePerformance')}
                      </div>
                      <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary">
                        <CheckCircle2 className="size-4" /> {tDetail('nativeBanner.featureHardware')}
                      </div>
                    </div>
                  </div>
                </section>
              ) : (
                <ReviewSection appName={app.name} appId={app.id} reviews={reviews} />
              )}
            </div>

            {/* Right Column: Sidebar */}
            <div className="lg:col-span-4 sticky top-24">
              <AppStats app={app} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
