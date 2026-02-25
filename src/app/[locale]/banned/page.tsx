import { Ban } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'

export default function BannedPage() {
  const t = useTranslations('Banned')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="hero-glow relative overflow-hidden">
        <div className="surface-grid absolute inset-0 opacity-60" />
        <div className="surface-noise absolute inset-0 opacity-70" />

        <main className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
          <div className="glass-panel relative flex flex-col items-center gap-8 rounded-3xl p-12 sm:p-20">
            <div className="flex size-24 items-center justify-center rounded-full border border-destructive/20 bg-destructive/5 text-destructive shadow-2xl shadow-destructive/20">
              <Ban className="size-12" />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-black uppercase tracking-tight text-destructive sm:text-6xl">{t('title')}</h1>
              <p className="mx-auto max-w-md text-lg font-medium text-foreground/80">{t('message')}</p>
              <p className="mx-auto max-w-sm text-sm text-muted-foreground">{t('submessage')}</p>
            </div>

            <Button asChild size="lg" variant="secondary" className="mt-4 rounded-2xl">
              <Link href="/">{t('cta')}</Link>
            </Button>

            {/* Decorative background glow */}
            <div className="absolute -z-10 size-40 bg-destructive/10 blur-[80px]" />
          </div>
        </main>
      </div>
    </div>
  )
}
