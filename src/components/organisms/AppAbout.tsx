import { FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { App } from '@/lib/types'

interface AppAboutProps {
  app: App
}

export default function AppAbout({ app }: AppAboutProps) {
  const t = useTranslations('AppDetail')
  if (!app.description) return null

  return (
    <section className="glass-panel space-y-6 rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-3">
        <FileText className="size-5 text-primary" />
        <h2 className="text-xl font-semibold">{t('about', { name: app.name })}</h2>
      </div>

      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-muted-foreground/90">{app.description}</p>
      </div>
    </section>
  )
}
