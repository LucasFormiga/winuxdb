import { getTranslations } from 'next-intl/server'
import AppCard from '@/components/molecules/AppCard'
import { getApps } from '@/lib/actions/apps'

export default async function HighlightsGrid() {
  const t = await getTranslations('Home.highlights')
  const { apps = [] } = await getApps({ limit: 50 })
  const highlights = [...apps].sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0)).slice(0, 4)

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t('kicker')}</p>
          <h2 className="mt-2 text-2xl font-semibold">{t('title')}</h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-md">{t('subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </section>
  )
}
