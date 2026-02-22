import { ArrowRight, Calendar, Hash, Image as ImageIcon, Sparkles, Users } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import RatingMedal from '@/components/atoms/RatingMedal'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { App } from '@/lib/types'

interface AppCardProps {
  app: App
}

export default function AppCard({ app }: AppCardProps) {
  const t = useTranslations('AppCard')
  const tCat = useTranslations('Categories')
  const tLic = useTranslations('Licenses')

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/60 bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_60px_rgba(0,0,0,0.5)]">
      <CardHeader className="p-0">
        <div className="relative flex aspect-video w-full items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/95 p-3 shadow-sm ring-1 ring-black/5 sm:h-24 sm:w-24">
            {app.logo ? (
              <Image
                src={app.logo}
                alt={app.name}
                className="size-20 max-h-full max-w-full object-contain"
                loading="lazy"
                width={0}
                height={0}
              />
            ) : (
              <ImageIcon className="size-10 text-muted-foreground/60" />
            )}
          </div>
          <div className="absolute top-3 right-3 flex flex-col items-end gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[0.6rem] font-bold text-white backdrop-blur-md border border-white/10">
              <Sparkles className="size-2.5 text-yellow-400" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`size-1 rounded-full ${i < app.popularity ? 'bg-yellow-400' : 'bg-white/20'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="line-clamp-1 text-lg font-semibold tracking-tight">{app.name}</CardTitle>
            <div className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
              <Users className="size-3" />
              <span className="line-clamp-1">{app.author}</span>
            </div>
          </div>
          <RatingMedal rating={app.rating} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 border-y border-border/40 py-3">
          <div className="space-y-1">
            <p className="text-[0.6rem] uppercase tracking-wider text-muted-foreground/70 font-semibold">
              {t('version')}
            </p>
            <div className="flex items-center gap-1 text-xs font-mono">
              <Hash className="size-3 text-primary/60" />
              <span className="truncate">{app.version}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[0.6rem] uppercase tracking-wider text-muted-foreground/70 font-semibold">
              {t('release')}
            </p>
            <div className="flex items-center gap-1 text-xs font-mono">
              <Calendar className="size-3 text-primary/60" />
              <span>{app.releaseDate.split('-')[0]}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-md border-border/40 bg-muted/30 px-1.5 py-0 font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground"
          >
            {tCat(app.category)}
          </Badge>
          <Badge
            variant="outline"
            className="rounded-md border-border/40 bg-muted/30 px-1.5 py-0 font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground"
          >
            {tLic(app.license)}
          </Badge>
        </div>

        {app.recommendedAlternatives && app.recommendedAlternatives.length > 0 && (
          <div className="mt-auto pt-5">
            <div className="rounded-xl border border-primary/10 bg-primary/5 p-3">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="size-3 text-primary" />
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-primary/90">{t('alternatives')}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {app.recommendedAlternatives.slice(0, 2).map((alt) => (
                  <span
                    key={alt}
                    className="text-[0.7rem] text-foreground/80 hover:text-primary transition-colors cursor-default"
                  >
                    {alt}
                  </span>
                ))}
                {app.recommendedAlternatives.length > 2 && (
                  <span className="text-[0.6rem] text-muted-foreground">+{app.recommendedAlternatives.length - 2}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
