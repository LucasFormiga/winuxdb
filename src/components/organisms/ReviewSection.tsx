'use client'

import { Filter, MessageSquare } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import ReviewCard from '@/components/molecules/ReviewCard'
import ReviewDialog from '@/components/organisms/ReviewDialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { UserReview } from '@/lib/types'

interface ReviewSectionProps {
  appName: string
  reviews: UserReview[]
}

export default function ReviewSection({ appName, reviews }: ReviewSectionProps) {
  const t = useTranslations('AppDetail')
  const [filter, setFilter] = useState<'ALL' | string>('ALL')
  const [sort] = useState<'recent' | 'rating'>('recent')

  const filteredReviews = reviews
    .filter((r) => filter === 'ALL' || r.rating === filter)
    .sort((a, b) => {
      if (sort === 'recent') return new Date(b.date).getTime() - new Date(a.date).getTime()
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

          <ReviewDialog appName={appName} />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => <ReviewCard key={review.id} review={review} />)
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-border/60 bg-muted/10 py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-muted/50 text-muted-foreground/30 mb-4">
              <MessageSquare className="size-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
            <p className="text-muted-foreground max-w-sm mb-8">
              Be the first to share your experience with {appName} on Linux.
            </p>
            <ReviewDialog appName={appName} />
          </div>
        )}
      </div>
    </section>
  )
}
