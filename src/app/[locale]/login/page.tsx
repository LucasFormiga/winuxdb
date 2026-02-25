'use client'

import { ArrowLeft, Chrome, Github, MessageSquare } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from '@/i18n/routing'

export default function LoginPage() {
  const t = useTranslations('Login')

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 hero-glow opacity-50 pointer-events-none" />
      <div className="absolute inset-0 surface-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-700 slide-in-from-bottom-12">
        <Link
          href="/"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          {t('backToHome')}
        </Link>

        <Card className="glass-panel border-none shadow-2xl relative overflow-hidden group/card">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-50 pointer-events-none" />

          <CardHeader className="text-center relative z-10 space-y-2">
            <div className="mx-auto w-fit h-fit mb-4 flex items-center justify-center overflow-hidden relative">
              <Image
                src="/images/winuxdb-logo.png"
                alt="WinuxDB"
                width={48}
                height={48}
                className="size-10 z-10"
                priority
              />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground uppercase tracking-[0.1em]">
              {t('title')}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-pretty max-w-[280px] mx-auto leading-relaxed">
              {t('subtitle')}
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4 relative z-10 pt-4">
            <Button
              variant="secondary"
              className="relative h-12 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group/btn"
              onClick={() => {}}
            >
              <Chrome className="mr-3 size-5 text-[#4285F4]" />
              <span className="flex-1 text-center font-semibold">{t('google')}</span>
              <div className="absolute inset-0 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity neon-ring pointer-events-none" />
            </Button>

            <Button
              variant="secondary"
              className="relative h-12 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group/btn"
              onClick={() => {}}
            >
              <Github className="mr-3 size-5 text-foreground" />
              <span className="flex-1 text-center font-semibold">{t('github')}</span>
              <div className="absolute inset-0 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity neon-ring pointer-events-none" />
            </Button>

            <Button
              variant="secondary"
              className="relative h-12 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group/btn"
              onClick={() => {}}
            >
              <MessageSquare className="mr-3 size-5 text-[#5865F2]" />
              <span className="flex-1 text-center font-semibold">{t('discord')}</span>
              <div className="absolute inset-0 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity neon-ring pointer-events-none" />
            </Button>
          </CardContent>

          <CardFooter className="relative z-10 pt-6">
            <p className="text-center text-xs text-muted-foreground/60 leading-relaxed px-4">
              {t.rich('terms', {
                terms: (chunks) => (
                  <Link href="/terms" className="text-primary hover:underline underline-offset-4">
                    {chunks}
                  </Link>
                ),
                privacy: (chunks) => (
                  <Link href="/privacy" className="text-primary hover:underline underline-offset-4">
                    {chunks}
                  </Link>
                )
              })}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
