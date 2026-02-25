import { cva, type VariantProps } from 'class-variance-authority'
import { Ban, ShieldAlert, ShieldCheck, Star, Trophy, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Rating } from '@/lib/types'
import { cn } from '@/lib/utils'

const medalVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.12em] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      rating: {
        BORKED:
          'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400/90 shadow-[0_0_12px_rgba(239,68,68,0.1)]',
        BRONZE:
          'border-amber-600/30 bg-amber-600/10 text-amber-700 dark:text-amber-500/90 shadow-[0_0_12px_rgba(217,119,6,0.1)]',
        SILVER:
          'border-slate-400/30 bg-slate-400/10 text-slate-600 dark:text-slate-300/90 shadow-[0_0_12px_rgba(148,163,184,0.1)]',
        GOLD: 'border-yellow-500/40 bg-yellow-500/15 text-yellow-700 dark:text-yellow-400/95 shadow-[0_0_15px_rgba(234,179,8,0.15)]',
        PLATINUM:
          'border-cyan-400/50 bg-cyan-400/20 text-cyan-700 dark:text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/20',
        NATIVE:
          'border-primary/60 bg-primary/20 text-primary shadow-[0_0_25px_rgba(255,60,60,0.3)] dark:shadow-[0_0_25px_rgba(255,60,60,0.4)] ring-1 ring-primary/40'
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
