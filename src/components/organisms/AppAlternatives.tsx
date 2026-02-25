import { ArrowRight, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { App } from '@/lib/types'

interface AppAlternativesProps {
  app: App
}

export default function AppAlternatives({ app }: AppAlternativesProps) {
  const t = useTranslations('AppDetail')

  if (!app.recommendedAlternatives || app.recommendedAlternatives.length === 0) {
    return null
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <Sparkles className="size-5 text-primary" />
        <h2 className="text-xl font-semibold">{t('alternatives')}</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {app.recommendedAlternatives.map((alt) => (
          <div
            key={alt}
            className="group glass-panel flex items-center justify-between rounded-2xl p-4 transition-all hover:bg-primary/5 hover:border-primary/30"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                {alt[0].toUpperCase()}
              </div>
              <span className="font-medium">{alt}</span>
            </div>
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </div>
        ))}
      </div>
    </section>
  )
}
