import { Ban } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'

export default function NotFound() {
  const t = useTranslations('NotFound')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="hero-glow relative overflow-hidden">
        <div className="surface-grid absolute inset-0 opacity-60" />
        <div className="surface-noise absolute inset-0 opacity-70" />

        <main className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
          <div className="glass-panel relative flex flex-col items-center gap-8 rounded-3xl p-12 sm:p-20">
            <div className="flex size-24 items-center justify-center rounded-full border border-border/70 bg-card/80 text-muted-foreground/40 shadow-2xl">
              <Ban className="size-12" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">{t('title')}</h1>
              <p className="mx-auto max-w-md text-lg text-muted-foreground">
                {t('message')}
              </p>
            </div>

            <Button asChild size="lg" className="mt-4">
              <Link href="/">{t('cta')}</Link>
            </Button>

            {/* Decorative background glow for the 404 icon */}
            <div className="absolute -z-10 size-40 bg-primary/10 blur-[80px]" />
          </div>
        </main>
      </div>
    </div>
  )
}
