'use client'

import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'
import AppCard from '@/components/molecules/AppCard'
import FilterSort, { type SortOption } from '@/components/molecules/FilterSort'
import SearchInput from '@/components/molecules/SearchInput'
import type { App, Rating } from '@/lib/types'

const RATING_ORDER: Record<Rating, number> = {
  NATIVE: 5,
  PLATINUM: 4,
  GOLD: 3,
  SILVER: 2,
  BRONZE: 1,
  BORKED: 0
}

interface AppsContentProps {
  apps: App[]
}

export default function AppsContent({ apps }: AppsContentProps) {
  const t = useTranslations('Apps')
  const [search, setSearch] = useState('')
  const [rating, setRating] = useState<Rating | 'ALL'>('ALL')
  const [sort, setSort] = useState<SortOption>('rating')
  const [category, setCategory] = useState('ALL')
  const [license, setLicense] = useState('ALL')
  const [alternatives, setAlternatives] = useState<'ALL' | 'YES' | 'NO'>('ALL')
  
  const containerRef = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState(1)

  const categories = useMemo(() => Array.from(new Set(apps.map((a) => a.category))).sort(), [apps])
  const licenses = useMemo(() => Array.from(new Set(apps.map((a) => a.license))).sort(), [apps])

  // Update columns based on container width
  useEffect(() => {
    const updateColumns = () => {
      if (!containerRef.current) return
      const width = window.innerWidth
      if (width >= 1280) setColumns(4)
      else if (width >= 1024) setColumns(3)
      else if (width >= 640) setColumns(2)
      else setColumns(1)
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  const filteredApps = useMemo(() => {
    return apps
      .filter((app) => {
        const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) || 
                             app.author.toLowerCase().includes(search.toLowerCase())
        const matchesRating = rating === 'ALL' || app.rating === rating
        const matchesCategory = category === 'ALL' || app.category === category
        const matchesLicense = license === 'ALL' || app.license === license
        const matchesAlternatives = alternatives === 'ALL' || 
                                   (alternatives === 'YES' && app.recommendedAlternatives.length > 0) ||
                                   (alternatives === 'NO' && app.recommendedAlternatives.length === 0)
        
        return matchesSearch && matchesRating && matchesCategory && matchesLicense && matchesAlternatives
      })
      .sort((a, b) => {
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
  }, [apps, search, rating, sort, category, license, alternatives])

  const rows = useMemo(() => {
    const result = []
    for (let i = 0; i < filteredApps.length; i += columns) {
      result.push(filteredApps.slice(i, i + columns))
    }
    return result
  }, [filteredApps, columns])

  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => 440, // Increased estimate for larger cards
    overscan: 5,
    scrollMargin: containerRef.current?.offsetTop ?? 0
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="hero-glow relative overflow-hidden">
        <div className="surface-grid absolute inset-0 opacity-60" />
        <div className="surface-noise absolute inset-0 opacity-70" />

        <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-20 pt-12 lg:px-8">
          <section className="glass-panel space-y-8 rounded-3xl px-6 py-10 sm:px-10">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <span>{t('kicker')}</span>
                <span className="text-primary/80">•</span>
                <span>{t('kickerSecondary')}</span>
              </div>
              <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">{t('title')}</h1>
            </div>

            <div className="flex flex-col gap-8">
              <div className="max-w-2xl">
                <SearchInput onChange={setSearch} />
              </div>
              <FilterSort 
                activeRating={rating} 
                activeSort={sort} 
                activeCategory={category}
                activeLicense={license}
                activeAlternatives={alternatives}
                categories={categories}
                licenses={licenses}
                onRatingChange={setRating} 
                onSortChange={setSort} 
                onCategoryChange={setCategory}
                onLicenseChange={setLicense}
                onAlternativesChange={setAlternatives}
              />
            </div>
          </section>

          <section ref={containerRef} className="relative w-full">
            {filteredApps.length === 0 ? (
              <div className="rounded-2xl border border-border/60 bg-card/40 py-20 text-center text-muted-foreground">
                {t('emptyState')}
              </div>
            ) : (
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative'
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start - rowVirtualizer.options.scrollMargin}px)`
                    }}
                    className="grid grid-cols-1 gap-6 pb-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  >
                    {rows[virtualRow.index].map((app) => (
                      <AppCard key={app.id} app={app} />
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Visually hidden list for SEO crawlers to index all filtered apps */}
            <div className="sr-only" aria-hidden="true">
              {filteredApps.map((app) => (
                <article key={app.id}>
                  <h2>{app.name}</h2>
                  <p>{app.category} - {app.license}</p>
                  <p>Compatibility: {app.rating}</p>
                  <p>Author: {app.author}</p>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
