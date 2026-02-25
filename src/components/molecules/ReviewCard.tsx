import { Calendar, Cpu, Layers, Monitor, Terminal, Trash2, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import RatingMedal from '@/components/atoms/RatingMedal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { UserReview } from '@/lib/types'
import { deleteReview } from '@/lib/actions/reviews'
import { useState } from 'react'

interface ReviewCardProps {
  review: UserReview
  currentUserId?: string
}

export default function ReviewCard({ review, currentUserId }: ReviewCardProps) {
  const t = useTranslations('AppDetail')
  const [isDeleting, setIsDeleting] = useState(false)

  // Map DB fields to UI expected structure if needed
  const userName = (review as any).profiles?.nickname || (review as any).user?.name || 'Anonymous'
  const userAvatar = (review as any).profiles?.avatar_url || (review as any).user?.avatar
  const date = review.created_at || (review as any).date
  const hardware = (review as any).devices || (review as any).hardware
  const wineProton = review.wine_proton_version || `${(review as any).compatibility?.engine} ${(review as any).compatibility?.version}`
  const isOwner = currentUserId && review.user_id === currentUserId

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) return
    setIsDeleting(true)
    await deleteReview(review.id)
    setIsDeleting(false)
  }

  return (
    <div className={`glass-panel group relative overflow-hidden rounded-[2rem] border-border/40 transition-all hover:bg-muted/30 ${isDeleting ? 'opacity-50 grayscale' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* User & Rating */}
          <div className="flex items-center gap-4">
            <Avatar className="size-12 rounded-2xl border-2 border-background ring-1 ring-border/50">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="rounded-2xl bg-primary/10 text-primary font-bold">
                {userName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground/90">{userName}</span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="size-3" />
                {new Date(date).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <RatingMedal
              rating={review.rating as any}
              className="px-4 py-1.5 shadow-lg shadow-black/5"
            />
            {isOwner && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
                className="size-9 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mt-6">
          <p className="text-lg leading-relaxed text-muted-foreground/90 whitespace-pre-wrap">{review.content}</p>
        </div>

        {/* Hardware & Compatibility Specs */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {hardware && (
            <>
              <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-background/40 px-3 py-2 text-xs backdrop-blur-sm transition-colors hover:bg-background/60 h-auto min-h-[52px]">
                <Monitor className="size-3.5 text-primary opacity-70 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground font-bold">
                    {t('distroDe')}
                  </span>
                  <span className="font-medium break-words">
                    {hardware.distro} {hardware.distro_version} • {hardware.de}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-background/40 px-3 py-2 text-xs backdrop-blur-sm transition-colors hover:bg-background/60 h-auto min-h-[52px]">
                <Cpu className="size-3.5 text-blue-500 opacity-70 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground font-bold">
                    {t('cpuRam')}
                  </span>
                  <span className="font-medium break-words">
                    {hardware.cpu} • {hardware.ram}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-background/40 px-3 py-2 text-xs backdrop-blur-sm transition-colors hover:bg-background/60 h-auto min-h-[52px]">
                <Layers className="size-3.5 text-purple-500 opacity-70 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground font-bold">{t('gpu')}</span>
                  <span className="font-medium break-words">{hardware.gpu}</span>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-background/40 px-3 py-2 text-xs backdrop-blur-sm transition-colors hover:bg-background/60 h-auto min-h-[52px]">
            <Zap className="size-3.5 text-yellow-500 opacity-70 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground font-bold">
                {t('compatibility')}
              </span>
              <span className="font-medium break-words">
                {wineProton}
              </span>
            </div>
          </div>

          {hardware?.kernel && (
            <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-background/40 px-3 py-2 text-xs backdrop-blur-sm transition-colors hover:bg-background/60 h-auto min-h-[52px]">
              <Terminal className="size-3.5 text-green-500 opacity-70 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground font-bold">
                  {t('kernel')}
                </span>
                <span className="font-medium break-words">{hardware.kernel} {hardware.kernel_version}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
