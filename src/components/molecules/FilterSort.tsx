'use client'

import { useTranslations } from 'next-intl'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Rating } from '@/lib/types'

export type SortOption = 'popularity' | 'releaseDate' | 'rating' | 'name'

interface FilterSortProps {
  onRatingChange: (filter: Rating | 'ALL') => void
  onSortChange: (sort: SortOption) => void
  onCategoryChange: (category: string) => void
  onLicenseChange: (license: string) => void
  onAlternativesChange: (value: 'ALL' | 'YES' | 'NO') => void
  activeRating: Rating | 'ALL'
  activeSort: SortOption
  activeCategory: string
  activeLicense: string
  activeAlternatives: 'ALL' | 'YES' | 'NO'
  categories: string[]
  licenses: string[]
}

export default function FilterSort({
  onRatingChange,
  onSortChange,
  onCategoryChange,
  onLicenseChange,
  onAlternativesChange,
  activeRating,
  activeSort,
  activeCategory,
  activeLicense,
  activeAlternatives,
  categories,
  licenses
}: FilterSortProps) {
  const t = useTranslations()

  const ratings: (Rating | 'ALL')[] = ['ALL', 'BORKED', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'NATIVE']
  const sortOptions: SortOption[] = ['name', 'rating', 'popularity', 'releaseDate']

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-4">
      {/* Rating Filter */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
          {t('Ratings.filterLabel')}
        </label>
        <Select value={activeRating} onValueChange={onRatingChange as any}>
          <SelectTrigger className="w-[160px] h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ratings.map((rating) => (
              <SelectItem key={rating} value={rating} className="text-xs">
                {t(`Ratings.${rating}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
          {t('Filters.category')}
        </label>
        <Select value={activeCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[160px] h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL" className="text-xs">
              {t('Filters.all')}
            </SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat} className="text-xs">
                {t(`Categories.${cat}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* License Filter */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
          {t('Filters.license')}
        </label>
        <Select value={activeLicense} onValueChange={onLicenseChange}>
          <SelectTrigger className="w-[160px] h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL" className="text-xs">
              {t('Filters.all')}
            </SelectItem>
            {licenses.map((lic) => (
              <SelectItem key={lic} value={lic} className="text-xs">
                {t(`Licenses.${lic}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Alternatives Filter */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
          {t('Filters.alternatives')}
        </label>
        <Select value={activeAlternatives} onValueChange={onAlternativesChange as any}>
          <SelectTrigger className="w-[160px] h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL" className="text-xs">
              {t('Filters.all')}
            </SelectItem>
            <SelectItem value="YES" className="text-xs">
              {t('Filters.yes')}
            </SelectItem>
            <SelectItem value="NO" className="text-xs">
              {t('Filters.no')}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
          {t('Sort.label')}
        </label>
        <Select value={activeSort} onValueChange={onSortChange as any}>
          <SelectTrigger className="w-[160px] h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option} value={option} className="text-xs">
                {t(`Sort.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
