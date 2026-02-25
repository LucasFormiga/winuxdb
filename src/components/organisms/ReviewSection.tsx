'use client'

import { Filter, MessageSquare } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import ReviewCard from '@/components/molecules/ReviewCard'
import ReviewDialog from '@/components/organisms/ReviewDialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { UserReview } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { getUserData } from '@/lib/actions/auth'

interface ReviewSectionProps {
  appName: string
  appId: string
  reviews: UserReview[]
}

export default function ReviewSection({ appName, appId, reviews }: ReviewSectionProps) {
  const t = useTranslations('AppDetail')
  const [filter, setFilter] = useState<'ALL' | string>('ALL')
  const [sort] = useState<'recent' | 'rating'>('recent')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    getUserData().then(setUser)
  }, [])

  const userHasReviewed = user && reviews.some(r => r.user_id === user.id)

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
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Ratings</SelectItem>
              <SelectItem value="NATIVE">Native</SelectItem>
              <SelectItem value="PLATINUM">Platinum</SelectItem>
              <SelectItem value="GOLD">Gold</SelectItem>
              <SelectItem value="SILVER">Silver</SelectItem>
              <SelectItem value="BRONZE">Bronze</SelectItem>
              <SelectItem value="BORKED">Borked</SelectItem>
            </SelectContent>
          </Select>

          {user && !userHasReviewed ? (
            <ReviewDialog appName={appName} appId={appId} userDevices={user.devices || []} />
          ) : !user ? (
            <Button variant="secondary" onClick={() => window.location.href = '/login'} className="rounded-xl">
              Log in to review
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              currentUserId={user?.id}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-border/60 bg-muted/10 py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-muted/50 text-muted-foreground/30 mb-4">
              <MessageSquare className="size-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
            <p className="text-muted-foreground max-w-sm mb-8">
              Be the first to share your experience with {appName} on Linux.
            </p>
            {user ? (
              <ReviewDialog appName={appName} appId={appId} userDevices={user.devices || []} />
            ) : (
              <Button variant="secondary" onClick={() => window.location.href = '/login'} className="rounded-xl px-10 h-12 font-bold uppercase tracking-widest">
                Log in to review
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
