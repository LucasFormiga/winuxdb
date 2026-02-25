import { Bug, ShieldCheck } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import AppAbout from '@/components/organisms/AppAbout'
import AppHero from '@/components/organisms/AppHero'
import AppStats from '@/components/organisms/AppStats'
import ReviewSection from '@/components/organisms/ReviewSection'
import JSONLD from '@/components/atoms/seo/JSONLD'
import { Link, redirect } from '@/i18n/routing'
import { getAppBySlug, getApps } from '@/lib/actions/apps'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: AppPageProps): Promise<Metadata> {
  const { slug } = await params
  const app = await getAppBySlug(slug, true)
  
  if (!app) return {}

  const rating = app.overall_rating || 'BORKED'
  
  return {
    title: `${app.name} Linux Compatibility Rating: ${rating}`,
    description: `Check if ${app.name} runs on Linux. View community ratings, Wine/Proton versions, and setup instructions. Current rating: ${rating}.`,
    openGraph: {
      title: `${app.name} on Linux | WinuxDB`,
      description: `Community compatibility reports for ${app.name}. Running via Wine/Proton? Check the latest ratings.`,
      images: app.logo_url ? [app.logo_url] : []
    }
  }
}

export async function generateStaticParams() {
  // Pre-render apps to improve performance and SEO
  // We use a larger limit to cover most apps
  const { apps = [] } = await getApps({ 
    limit: 1000,
    sortBy: 'popularity' 
  })
  
  return apps.map((app) => ({
    slug: app.slug
  }))
}

interface AppPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export default async function AppPage({ params }: AppPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const app = await getAppBySlug(slug, true)
  if (!app) {
    notFound()
  }

  // Redirect to canonical slug if accessed via ID or outdated slug
  if (app.slug && app.slug !== slug) {
    redirect({ href: `/apps/${app.slug}`, locale })
  }

  // reviews are already fetched inside getAppBySlug via join
  const reviews = (app as any).reviews || []
  const isNative = (app.overall_rating || (app as any).rating) === 'NATIVE'
  const tDetail = await getTranslations('AppDetail')

  // Calculate most frequent engine/version from reviews
  const engineFrequency: Record<string, number> = {}
  for (const review of reviews) {
    if (review.wine_proton_version) {
      engineFrequency[review.wine_proton_version] = (engineFrequency[review.wine_proton_version] || 0) + 1
    }
  }

  const recommendedEngine = Object.entries(engineFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] || null

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    description: app.description || `Check compatibility for ${app.name} on Linux.`,
    applicationCategory: app.category || 'UtilitiesApplication',
    operatingSystem: 'Linux',
    softwareVersion: app.version,
    author: {
      '@type': 'Organization',
      name: app.author || 'Unknown'
    },
    aggregateRating: reviews.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: (app as any).score || 5,
      reviewCount: reviews.length
    } : undefined
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <JSONLD data={softwareSchema} />
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
                  </div>
                </section>
              ) : (
                <ReviewSection appName={app.name} appId={app.id} reviews={reviews} overallRating={app.overall_rating} />
              )}
            </div>

            {/* Right Column: Sidebar */}
            <div className="lg:col-span-4 sticky top-24 space-y-6">
              <AppStats app={app} recommendedEngine={recommendedEngine} />
              <div className="px-4">
                <Link
                  href="https://forms.gle/hySiJzrRHsmCySrW7"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-primary transition-colors"
                >
                  <Bug className="size-3" />
                  {tDetail('reportIssue')}
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
