'use client'

import { Filter, MessageSquare } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import ReviewCard from '@/components/molecules/ReviewCard'
import ReviewDialog from '@/components/organisms/ReviewDialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getUserData } from '@/lib/actions/auth'
import type { UserReview } from '@/lib/types'

interface ReviewSectionProps {
  appName: string
  appId: string
  reviews: UserReview[]
  overallRating?: string | null
}

export default function ReviewSection({ appName, appId, reviews, overallRating }: ReviewSectionProps) {
  const t = useTranslations('AppDetail')
  const t_ratings = useTranslations('Ratings')
  const [filter, setFilter] = useState<'ALL' | string>('ALL')
  const [sort] = useState<'recent' | 'rating'>('recent')
  const [user, setUser] = useState<any>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  useEffect(() => {
    getUserData().then((data) => {
      setUser(data)
      setIsLoadingUser(false)
    })
  }, [])

  const userHasReviewed = user && reviews.some((r) => r.user_id === user.id)

  const filteredReviews = reviews
    .filter((r) => filter === 'ALL' || r.rating === filter)
    .sort((a, b) => {
      const dateA = a.created_at || (a as any).date
      const dateB = b.created_at || (b as any).date
      if (sort === 'recent') return new Date(dateB).getTime() - new Date(dateA).getTime()
      // Rating sort could be added here
      return 0
    })

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MessageSquare className="size-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">{t('reviews', { count: reviews.length })}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[140px] rounded-xl border-border/40 bg-muted/30">
              <Filter className="mr-2 size-3.5 opacity-60" />
              <SelectValue placeholder={t_ratings('filterLabel')} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">{t_ratings('ALL')}</SelectItem>
              <SelectItem value="NATIVE">{t_ratings('NATIVE')}</SelectItem>
              <SelectItem value="PLATINUM">{t_ratings('PLATINUM')}</SelectItem>
              <SelectItem value="GOLD">{t_ratings('GOLD')}</SelectItem>
              <SelectItem value="SILVER">{t_ratings('SILVER')}</SelectItem>
              <SelectItem value="BRONZE">{t_ratings('BRONZE')}</SelectItem>
              <SelectItem value="BORKED">{t_ratings('BORKED')}</SelectItem>
            </SelectContent>
          </Select>

          {isLoadingUser ? (
            <div className="h-10 w-32 animate-pulse rounded-xl bg-muted/30" />
          ) : user && !userHasReviewed ? (
            <ReviewDialog
              appName={appName}
              appId={appId}
              userDevices={user.devices || []}
              defaultRating={overallRating as any}
            />
          ) : !user ? (
            <Button variant="secondary" onClick={() => (window.location.href = '/login')} className="rounded-xl">
              {t('loginToReview')}
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => <ReviewCard key={review.id} review={review} currentUserId={user?.id} />)
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-border/60 bg-muted/10 py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-muted/50 text-muted-foreground/30 mb-4">
              <MessageSquare className="size-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('noReviews')}</h3>
            <p className="text-muted-foreground max-w-sm mb-8">
              {t('beTheFirst', { appName })}
            </p>
            {isLoadingUser ? (
              <div className="h-12 w-40 animate-pulse rounded-xl bg-muted/30" />
            ) : user ? (
              <ReviewDialog
                appName={appName}
                appId={appId}
                userDevices={user.devices || []}
                defaultRating={overallRating as any}
              />
            ) : (
              <Button
                variant="secondary"
                onClick={() => (window.location.href = '/login')}
                className="rounded-xl px-10 h-12 font-bold uppercase tracking-widest"
              >
                {t('loginToReview')}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
