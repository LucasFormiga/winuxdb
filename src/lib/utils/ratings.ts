import type { CompatibilityLevel } from '@/lib/validations/apps'

export const RATING_PRIORITY: Record<CompatibilityLevel, number> = {
  NATIVE: 6,
  PLATINUM: 5,
  GOLD: 4,
  SILVER: 3,
  BRONZE: 2,
  BORKED: 1
}

export const RATING_BY_PRIORITY: Record<number, CompatibilityLevel> = {
  6: 'NATIVE',
  5: 'PLATINUM',
  4: 'GOLD',
  3: 'SILVER',
  2: 'BRONZE',
  1: 'BORKED'
}

/**
 * Calculates the overall rating based on reviews or default value.
 * Logic:
 * 1. If no reviews, use the app's overall_rating from DB.
 * 2. If has reviews, calculate the average of reviews' ratings.
 */
export function calculateOverallRating(
  dbOverallRating: CompatibilityLevel | null | undefined,
  reviews: { rating: CompatibilityLevel }[] | null | undefined
): CompatibilityLevel {
  if (!reviews || reviews.length === 0) {
    return dbOverallRating || 'BORKED'
  }

  const totalPriority = reviews.reduce((sum, review) => {
    return sum + (RATING_PRIORITY[review.rating] || 1)
  }, 0)

  const averagePriority = Math.round(totalPriority / reviews.length)

  // Ensure we stay within bounds [1, 6]
  const finalPriority = Math.max(1, Math.min(6, averagePriority))

  return RATING_BY_PRIORITY[finalPriority] || 'BORKED'
}
