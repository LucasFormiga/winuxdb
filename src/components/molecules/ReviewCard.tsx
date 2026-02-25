import { Ban, Calendar, Cpu, Layers, Loader2, Monitor, Plus, Shield, ShieldCheck, Terminal, Trash2, Wrench, Zap } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import RatingMedal from '@/components/atoms/RatingMedal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { getUserData, setBanStatus } from '@/lib/actions/auth'
import { deleteReview } from '@/lib/actions/reviews'
import type { UserReview } from '@/lib/types'

interface ReviewCardProps {
  review: UserReview
  currentUserId?: string
}

export default function ReviewCard({ review, currentUserId }: ReviewCardProps) {
  const t = useTranslations('AppDetail')
  const locale = useLocale()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showBanDialog, setShowBanDialog] = useState(false)
  const [banReason, setBanReason] = useState('')
  const [isBanning, setIsBanning] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    if (currentUserId) {
      getUserData().then(setCurrentUser)
    }
  }, [currentUserId])

  // Map DB fields to UI expected structure if needed
  const reviewerProfile = (review as any).profiles
  const userName = reviewerProfile?.nickname || (review as any).user?.name || t('anonymous')
  const userAvatar = reviewerProfile?.avatar_url || (review as any).user?.avatar
  const isVerified = reviewerProfile?.is_verified || (review as any).user?.is_verified
  const isAdmin = reviewerProfile?.is_admin || (review as any).user?.is_admin
  
  const dateStr = review.created_at || (review as any).date
  
  // Supabase join data can come as an object or an array depending on relationship detection
  const devicesData = (review as any).devices || (review as any).device
  const hardware = (Array.isArray(devicesData) ? devicesData[0] : devicesData) || (review as any).hardware

  const formatEngine = (engine: string | null | undefined) => {
    if (!engine) return null
    if (engine.startsWith('valve ')) return `Proton ${engine.replace('valve ', '')}`
    if (engine.startsWith('ge ')) return `GE-Proton ${engine.replace('ge ', '')}`
    if (engine.startsWith('cachyos ')) return `Proton-CachyOS ${engine.replace('cachyos ', '')}`
    return engine
  }

  const wineProton = formatEngine(
    review.wine_proton_version || `${(review as any).compatibility?.engine} ${(review as any).compatibility?.version}`
  )
  const isOwner = currentUserId && review.user_id === currentUserId
  const isCurrentUserAdmin = currentUser?.is_admin

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteReview(review.id)
    setIsDeleting(false)
    setShowDeleteDialog(false)
  }

  const handleBan = async () => {
    setIsBanning(true)
    // We could store the reason in a separate audit log table if we had one
    // For now we just call the ban action
    await setBanStatus(review.user_id, true)
    setIsBanning(false)
    setShowBanDialog(false)
    // Refresh to hide reviews of banned user
    window.location.reload()
  }

  return (
    <div
      className={`glass-panel group relative overflow-hidden rounded-[2rem] border-border/40 transition-all hover:bg-muted/30 ${isDeleting ? 'opacity-50 grayscale' : ''}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* User & Rating */}
          <div className="flex items-center gap-4">
            <Avatar className="size-12 rounded-2xl border-2 border-background ring-1 ring-border/50">
              <AvatarImage src={userAvatar} alt={userName} referrerPolicy="no-referrer" />
              <AvatarFallback className="rounded-2xl bg-primary/10 text-primary font-bold">
                {userName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground/90">{userName}</span>
                {isVerified && (
                  <ShieldCheck className="size-3.5 text-blue-500" fill="currentColor" fillOpacity={0.1} />
                )}
                {isAdmin && (
                  <Badge variant="secondary" className="h-4 rounded-sm px-1 text-[10px] font-black uppercase leading-none bg-primary/10 text-primary border-none">
                    {t('admin')}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="size-3" />
                {dateStr ? new Date(dateStr).toLocaleDateString(locale) : '---'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <RatingMedal rating={review.rating as any} className="px-4 py-1.5 shadow-lg shadow-black/5" />
            
            <div className="flex items-center gap-1">
              {isCurrentUserAdmin && !isOwner && (
                <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Ban className="size-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md rounded-[2rem] border-border/40 bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="flex flex-col items-center text-center">
                      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                        <Ban className="size-6" />
                      </div>
                      <DialogTitle className="text-xl">{t('banUser')}</DialogTitle>
                      <DialogDescription className="mt-2">
                        {t('banConfirm')}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="my-6 space-y-3 px-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
                        {t('banReason')}
                      </label>
                      <Input 
                        placeholder={t('banReasonPlaceholder')}
                        value={banReason}
                        onChange={(e) => setBanReason(e.target.value)}
                        className="rounded-xl border-border/40 bg-muted/30 h-12 px-4"
                      />
                    </div>

                    <DialogFooter className="flex gap-3 sm:justify-center">
                      <Button variant="ghost" onClick={() => setShowBanDialog(false)} className="rounded-xl px-6">
                        {t('cancel')}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleBan}
                        disabled={isBanning || !banReason.trim()}
                        className="rounded-xl px-8 shadow-none"
                      >
                        {isBanning ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            {t('submitting')}
                          </>
                        ) : (
                          t('banConfirm')
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {isOwner && (
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md rounded-[2rem] border-border/40 bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="flex flex-col items-center text-center">
                      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                        <Trash2 className="size-6" />
                      </div>
                      <DialogTitle className="text-xl">{t('deleteReviewTitle')}</DialogTitle>
                      <DialogDescription className="mt-2">{t('deleteReviewConfirm')}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6 flex gap-3 sm:justify-center">
                      <Button variant="ghost" onClick={() => setShowDeleteDialog(false)} className="rounded-xl px-6">
                        {t('cancel')}
                      </Button>
                      <Button
                        variant="default"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="rounded-xl px-8 shadow-none"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            {t('submitting')}
                          </>
                        ) : (
                          t('delete')
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6">
          <p className="text-lg leading-relaxed text-muted-foreground/90 whitespace-pre-wrap">{review.content}</p>
        </div>

        {/* Tinker Steps Badges */}
        {(review as any).tinker_steps && (review as any).tinker_steps.length > 0 && !(review as any).tinker_steps.includes('none') && (
          <div className="mt-4 flex flex-wrap gap-2">
            {(review as any).tinker_steps.map((step: string) => (
              <div
                key={step}
                className="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-primary"
              >
                <Wrench className="size-3" />
                {t(`presets.tinkering.${step}`)}
              </div>
            ))}
          </div>
        )}

        {/* Hardware & Compatibility Specs */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(review as any).stability && (
            <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-background/40 px-3 py-2 text-xs backdrop-blur-sm transition-colors hover:bg-background/60 h-auto min-h-[52px]">
              <Shield className="size-3.5 text-green-500 opacity-70 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground font-bold">
                  {t('stability')}
                </span>
                <span className="font-medium break-words">
                  {t(`presets.stability.${(review as any).stability}`)}
                </span>
              </div>
            </div>
          )}

          {(review as any).performance && (
            <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-background/40 px-3 py-2 text-xs backdrop-blur-sm transition-colors hover:bg-background/60 h-auto min-h-[52px]">
              <Zap className="size-3.5 text-yellow-500 opacity-70 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground font-bold">
                  {t('performance')}
                </span>
                <span className="font-medium break-words">
                  {t(`presets.performance.${(review as any).performance}`)}
                </span>
              </div>
            </div>
          )}

          {(review as any).installation && (
            <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-background/40 px-3 py-2 text-xs backdrop-blur-sm transition-colors hover:bg-background/60 h-auto min-h-[52px]">
              <Plus className="size-3.5 text-blue-500 opacity-70 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground font-bold">
                  {t('installation')}
                </span>
                <span className="font-medium break-words">
                  {t(`presets.installation.${(review as any).installation}`)}
                </span>
              </div>
            </div>
          )}

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
                  <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground font-bold">
                    {t('gpu')}
                  </span>
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
              <span className="font-medium break-words">{wineProton}</span>
            </div>
          </div>

          {hardware?.kernel && (
            <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-background/40 px-3 py-2 text-xs backdrop-blur-sm transition-colors hover:bg-background/60 h-auto min-h-[52px]">
              <Terminal className="size-3.5 text-green-500 opacity-70 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground font-bold">
                  {t('kernel')}
                </span>
                <span className="font-medium break-words">
                  {hardware.kernel} {hardware.kernel_version}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
