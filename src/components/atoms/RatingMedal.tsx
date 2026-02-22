import { cva, type VariantProps } from 'class-variance-authority'
import { Ban, ShieldAlert, ShieldCheck, Star, Trophy, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Rating } from '@/lib/types'
import { cn } from '@/lib/utils'

const medalVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.08em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      rating: {
        BORKED: 'border-border/70 bg-muted/50 text-muted-foreground',
        BRONZE: 'border-border/70 bg-muted/50 text-amber-600 dark:text-amber-300/80',
        SILVER: 'border-border/70 bg-muted/50 text-slate-600 dark:text-slate-200/80',
        GOLD: 'border-border/70 bg-muted/50 text-yellow-600 dark:text-yellow-300/90',
        PLATINUM: 'border-border/70 bg-muted/50 text-cyan-600 dark:text-cyan-200/90',
        NATIVE: 'border-primary/60 bg-primary/10 text-primary shadow-[0_0_16px_rgba(255,60,60,0.1)] dark:shadow-[0_0_16px_rgba(255,60,60,0.25)]'
      }
    },
    defaultVariants: {
      rating: 'BORKED'
    }
  }
)

const iconMap = {
  BORKED: Ban,
  BRONZE: ShieldAlert,
  SILVER: ShieldCheck,
  GOLD: Trophy,
  PLATINUM: Star,
  NATIVE: Zap
}

export interface RatingMedalProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof medalVariants> {
  rating: Rating
}

export default function RatingMedal({ className, rating, ...props }: RatingMedalProps) {
  const t = useTranslations('Ratings')
  const Icon = iconMap[rating]

  return (
    <div className={cn(medalVariants({ rating }), className)} {...props}>
      <Icon className="mr-1 size-3" />
      {t(rating)}
    </div>
  )
}
