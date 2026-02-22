import { useTranslations } from 'next-intl'

export default function HowItWorks() {
  const t = useTranslations('Home.how')
  const steps = [
    { title: t('step1.title'), description: t('step1.description') },
    { title: t('step2.title'), description: t('step2.description') },
    { title: t('step3.title'), description: t('step3.description') }
  ]

  return (
    <section className="grid gap-6 rounded-3xl border border-border/60 bg-card/40 p-6 sm:grid-cols-3">
      {steps.map((step, index) => (
        <div key={step.title} className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {t('stepLabel', { number: index + 1 })}
          </p>
          <h3 className="text-lg font-semibold">{step.title}</h3>
          <p className="text-sm text-muted-foreground">{step.description}</p>
        </div>
      ))}
    </section>
  )
}
