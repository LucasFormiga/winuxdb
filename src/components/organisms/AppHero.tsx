import { Calendar, Hash, Image as ImageIcon, Sparkles, Users } from 'lucide-react'
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
  const tLic = useTranslations('Licenses')

  return (
    <section className="glass-panel relative overflow-hidden rounded-[2.5rem] p-8 md:p-12">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      
      <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
        {/* Logo Container */}
        <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-3xl bg-white/95 p-4 shadow-2xl ring-1 ring-black/5 md:h-40 md:w-40">
          {app.logo ? (
            <Image
              src={app.logo}
              alt={app.name}
              className="size-full object-contain"
              width={160}
              height={160}
              priority
            />
          ) : (
            <ImageIcon className="size-16 text-muted-foreground/40" />
          )}
        </div>

        {/* Info Container */}
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <RatingMedal rating={app.rating} className="px-4 py-1.5 text-xs" />
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              {tCat(app.category)}
            </Badge>
          </div>

          <h1 className="mb-2 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {app.name}
          </h1>
          
          <div className="mb-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground md:justify-start">
            <div className="flex items-center gap-1.5">
              <Users className="size-4" />
              <span>{app.author}</span>
            </div>
            <span className="hidden opacity-40 md:block">•</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              <span>{app.releaseDate}</span>
            </div>
            <span className="hidden opacity-40 md:block">•</span>
            <div className="flex items-center gap-1.5 font-mono">
              <Hash className="size-4" />
              <span>{app.version}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 md:justify-start">
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Sparkles
                    key={i}
                    className={`size-4 ${i < app.popularity ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{app.popularity}/5</span>
            </div>
            <div className="h-4 w-px bg-border/60" />
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase tracking-wider">
              {tLic(app.license)}
            </Badge>
          </div>
        </div>
      </div>
    </section>
  )
}
