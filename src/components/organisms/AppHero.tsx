import { Calendar, CheckCircle2, Hash, Image as ImageIcon, Star, Users } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import RatingMedal from '@/components/atoms/RatingMedal'
import { Badge } from '@/components/ui/badge'
import type { App } from '@/lib/types'

interface AppHeroProps {
  app: App
}

export default function AppHero({ app }: AppHeroProps) {
  const tCat = useTranslations('Categories')
  const t = useTranslations('AppDetail')

  const logo = app.logo_url || app.logo
  const rating = app.overall_rating || (app as any).rating || 'BORKED'
  const releaseDate = app.release_date || (app as any).releaseDate || 'N/A'
  const isVerified = app.is_verified || app.isVerified

  return (
    <section className="glass-panel relative overflow-hidden rounded-[3rem] p-8 md:p-14">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      <div className="surface-grid absolute inset-0 opacity-30" />

      <div className="relative z-10 flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-14">
        {/* Logo Container */}
        <div className="group relative">
          <div className="absolute -inset-4 rounded-[2.5rem] bg-primary/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-[2rem] bg-white/95 p-5 shadow-2xl ring-1 ring-black/5 md:h-48 md:w-48">
            {logo ? (
              <Image
                src={logo}
                alt={app.name}
                className="size-full object-contain transition-transform duration-500 group-hover:scale-110"
                width={192}
                height={192}
                priority
              />
            ) : (
              <ImageIcon className="size-20 text-muted-foreground/30" />
            )}
          </div>
        </div>

        {/* Info Container */}
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <RatingMedal rating={rating} className="px-5 py-2 text-xs shadow-xl" />
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1.5">
              {tCat(app.category || 'Utility')}
            </Badge>
          </div>

          <div className="mb-2 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">{app.name}</h1>
            {isVerified && (
              <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-sm">
                <CheckCircle2 className="size-5 md:size-6" />
                <span className="text-sm font-bold uppercase tracking-wider md:text-base">{t('verified')}</span>
              </div>
            )}
          </div>

          <div className="mb-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground/80 md:justify-start">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-muted/50 text-foreground">
                <Users className="size-4" />
              </div>
              <span className="font-medium">{app.author || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-muted/50 text-foreground">
                <Calendar className="size-4" />
              </div>
              <span className="font-medium">{releaseDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-muted/50 text-foreground">
                <Hash className="size-4" />
              </div>
              <span className="font-mono font-medium">{app.version || 'Latest'}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 md:justify-start">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                {t('popularity')}
              </span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-5 ${i < (app.popularity ?? 0) ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]' : 'text-muted-foreground/20'}`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold">{app.popularity ?? 0}/5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
