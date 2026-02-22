import { cva, type VariantProps } from "class-variance-authority";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { Rating } from "@/lib/types";
import {
  Ban,
  ShieldAlert,
  ShieldCheck,
  Trophy,
  Star,
  Zap,
} from "lucide-react";

const medalVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      rating: {
        BORKED: "border-transparent bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        BRONZE: "border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
        SILVER: "border-transparent bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300",
        GOLD: "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        PLATINUM: "border-transparent bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
        NATIVE: "border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      },
    },
    defaultVariants: {
      rating: "BORKED",
    },
  }
);

const iconMap = {
  BORKED: Ban,
  BRONZE: ShieldAlert,
  SILVER: ShieldCheck,
  GOLD: Trophy,
  PLATINUM: Star,
  NATIVE: Zap,
};

export interface RatingMedalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof medalVariants> {
  rating: Rating;
}

export default function RatingMedal({
  className,
  rating,
  ...props
}: RatingMedalProps) {
  const t = useTranslations("Ratings");
  const Icon = iconMap[rating];

  return (
    <div className={cn(medalVariants({ rating }), className)} {...props}>
      <Icon className="mr-1 size-3" />
      {t(rating)}
    </div>
  );
}
