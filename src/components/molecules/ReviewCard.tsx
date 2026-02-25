import { Calendar, Cpu, Layers, Monitor, Terminal, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import RatingMedal from '@/components/atoms/RatingMedal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { UserReview } from '@/lib/types'

interface ReviewCardProps {
  review: UserReview
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const t = useTranslations('AppDetail')

  return (
    <div className="glass-panel group relative overflow-hidden rounded-[2rem] border-border/40 transition-all hover:bg-muted/30">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* User & Rating */}
          <div className="flex items-center gap-4">
            <Avatar className="size-12 rounded-2xl border-2 border-background ring-1 ring-border/50">
              <AvatarImage src={review.user.avatar} alt={review.user.name} />
              <AvatarFallback className="rounded-2xl bg-primary/10 text-primary font-bold">
                {review.user.name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground/90">{review.user.name}</span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="size-3" />
                {new Date(review.date).toLocaleDateString()}
              </div>
            </div>
          </div>

          <RatingMedal
            rating={review.rating}
            className="self-start md:self-auto px-4 py-1.5 shadow-lg shadow-black/5"
          />
        </div>

        {/* Content */}
        <div className="mt-6">
          <p className="text-lg leading-relaxed text-muted-foreground/90">{review.content}</p>
        </div>

        {/* Hardware & Compatibility Specs */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-background/40 px-3 py-2 text-xs backdrop-blur-sm transition-colors hover:bg-background/60">
            <Monitor className="size-3.5 text-primary opacity-70" />
            <div className="flex flex-col">
              <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground font-bold">
                {t('distroDe')}
              </span>
              <span className="font-medium truncate">
                {review.hardware.distro} • {review.hardware.de}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-background/40 px-3 py-2 text-xs backdrop-blur-sm transition-colors hover:bg-background/60">
            <Cpu className="size-3.5 text-blue-500 opacity-70" />
            <div className="flex flex-col">
              <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground font-bold">
                {t('cpuRam')}
              </span>
              <span className="font-medium truncate">
                {review.hardware.cpu} • {review.hardware.ram}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-background/40 px-3 py-2 text-xs backdrop-blur-sm transition-colors hover:bg-background/60">
            <Layers className="size-3.5 text-purple-500 opacity-70" />
            <div className="flex flex-col">
              <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground font-bold">{t('gpu')}</span>
              <span className="font-medium truncate">{review.hardware.gpu}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-background/40 px-3 py-2 text-xs backdrop-blur-sm transition-colors hover:bg-background/60">
            <Zap className="size-3.5 text-yellow-500 opacity-70" />
            <div className="flex flex-col">
              <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground font-bold">
                {t('compatibility')}
              </span>
              <span className="font-medium truncate">
                {review.compatibility.engine} {review.compatibility.version}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-background/40 px-3 py-2 text-xs backdrop-blur-sm transition-colors hover:bg-background/60">
            <Terminal className="size-3.5 text-green-500 opacity-70" />
            <div className="flex flex-col">
              <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground font-bold">
                {t('kernel')}
              </span>
              <span className="font-medium truncate">{review.hardware.kernel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
