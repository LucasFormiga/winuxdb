import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getApp, getApps } from '@/lib/data/apps-loader'
import AppHero from '@/components/organisms/AppHero'
import AppAbout from '@/components/organisms/AppAbout'
import AppGallery from '@/components/organisms/AppGallery'
import AppCompatibility from '@/components/organisms/AppCompatibility'
import AppAlternatives from '@/components/organisms/AppAlternatives'

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
  const t = await getTranslations({ locale, namespace: 'AppDetail' })
  const tCat = await getTranslations({ locale, namespace: 'Categories' })
  const tLic = await getTranslations({ locale, namespace: 'Licenses' })
  
  if (!app) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="hero-glow relative overflow-hidden">
        <div className="surface-grid absolute inset-0 opacity-60" />
        <div className="surface-noise absolute inset-0 opacity-70" />

        <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 pb-24 pt-12 lg:px-8">
          <AppHero app={app} />
          
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-12">
              <AppAbout app={app} />
              <AppCompatibility app={app} />
              <AppAlternatives app={app} />
            </div>
            
            <aside className="space-y-8">
              <AppGallery app={app} />
              
              <div className="glass-panel rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t('details')}</h3>
                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground mb-1">{t('license')}</dt>
                    <dd className="font-medium">{tLic(app.license)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground mb-1">{t('category')}</dt>
                    <dd className="font-medium">{tCat(app.category)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground mb-1">{t('author')}</dt>
                    <dd className="font-medium">{app.author}</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}
