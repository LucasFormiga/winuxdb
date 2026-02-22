import { useTranslations } from 'next-intl'

export default function TrustStrip() {
  const t = useTranslations('Home.trust')
  const stats = [
    { label: t('appsLabel'), value: t('appsValue') },
    { label: t('reportsLabel'), value: t('reportsValue') },
    { label: t('updatesLabel'), value: t('updatesValue') },
    { label: t('coverageLabel'), value: t('coverageValue') }
  ]

  return (
    <section className="grid gap-4 rounded-3xl border border-border/60 bg-card/40 p-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{stat.label}</p>
          <p className="text-2xl font-semibold">{stat.value}</p>
        </div>
      ))}
    </section>
  )
}
