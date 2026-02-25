import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import AppAbout from '@/components/organisms/AppAbout'
import AppHero from '@/components/organisms/AppHero'
import AppStats from '@/components/organisms/AppStats'
import ReviewSection from '@/components/organisms/ReviewSection'
import { getApp, getApps } from '@/lib/data/apps-loader'
import { getAppReviews } from '@/lib/data/reviews'

export async function generateStaticParams() {
  const apps = getApps()
  return apps.map((app) => ({
    id: app.id
  }))
}

interface AppPageProps {
  params: Promise<{ locale: string; id: string }>
}

export default async function AppPage({ params }: AppPageProps) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const app = getApp(id)
  if (!app) {
    notFound()
  }

  const reviews = getAppReviews(id)

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

              <ReviewSection appName={app.name} reviews={reviews} />
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
