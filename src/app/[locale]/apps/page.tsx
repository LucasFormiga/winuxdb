'use client'

import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import AppCard from '@/components/molecules/AppCard'
import FilterSort, { type SortOption } from '@/components/molecules/FilterSort'
import SearchInput from '@/components/molecules/SearchInput'
import SiteHeader from '@/components/organisms/SiteHeader'
import { APPS } from '@/lib/data/apps'
import type { Rating } from '@/lib/types'

const RATING_ORDER: Record<Rating, number> = {
  NATIVE: 5,
  PLATINUM: 4,
  GOLD: 3,
  SILVER: 2,
  BRONZE: 1,
  BORKED: 0
}

export default function AppsPage() {
  const t = useTranslations('Apps')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Rating | 'ALL'>('ALL')
  const [sort, setSort] = useState<SortOption>('popularity')

  const filteredApps = useMemo(() => {
    return APPS.filter((app) => {
      const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = filter === 'ALL' || app.rating === filter
      return matchesSearch && matchesFilter
    }).sort((a, b) => {
      if (sort === 'popularity') {
        return b.popularity - a.popularity
      }
      if (sort === 'releaseDate') {
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      }
      if (sort === 'rating') {
        return RATING_ORDER[b.rating] - RATING_ORDER[a.rating]
      }
      return 0
    })
  }, [search, filter, sort])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="hero-glow relative overflow-hidden">
        <div className="surface-grid absolute inset-0 opacity-60" />
        <div className="surface-noise absolute inset-0 opacity-70" />
        <SiteHeader />

        <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pb-20 pt-12 lg:px-8">
          <section className="glass-panel rounded-3xl px-6 py-10 sm:px-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <span>{t('kicker')}</span>
                <span className="text-primary/80">•</span>
                <span>{t('kickerSecondary')}</span>
              </div>
              <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">{t('title')}</h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">{t('subtitleLong')}</p>
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <SearchInput onChange={setSearch} />
                <FilterSort activeFilter={filter} activeSort={sort} onFilterChange={setFilter} onSortChange={setSort} />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
            {filteredApps.length === 0 && (
              <div className="col-span-full rounded-2xl border border-border/60 bg-card/40 py-20 text-center text-muted-foreground">
                {t('emptyState')}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
