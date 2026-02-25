'use client'

import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import AppCard from '@/components/molecules/AppCard'
import FilterSort, { type SortOption } from '@/components/molecules/FilterSort'
import SearchInput from '@/components/molecules/SearchInput'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter } from '@/i18n/routing'
import type { App, Rating } from '@/lib/types'

interface AppsContentProps {
  apps: App[]
  categories: string[]
  licenses: string[]
  initialFilters: {
    search: string
    category: string
    rating: Rating | 'ALL'
    license: string
    sort: SortOption
    alternatives: 'ALL' | 'YES' | 'NO'
  }
}

export default function AppsContent({ apps, categories, licenses, initialFilters }: AppsContentProps) {
  const t = useTranslations('Apps')
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const containerRef = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState(1)

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

  const updateFilters = useCallback(
    (newFilters: Partial<typeof initialFilters>) => {
      const params = new URLSearchParams()
      const filters = { ...initialFilters, ...newFilters }

      if (filters.search) params.set('search', filters.search)
      if (filters.category !== 'ALL') params.set('category', filters.category)
      if (filters.rating !== 'ALL') params.set('rating', filters.rating)
      if (filters.license !== 'ALL') params.set('license', filters.license)
      if (filters.sort !== 'popularity') params.set('sort', filters.sort)
      if (filters.alternatives !== 'ALL') params.set('alternatives', filters.alternatives)

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [initialFilters, pathname, router]
  )

  const handleSearchChange = useCallback((v: string) => updateFilters({ search: v }), [updateFilters])
  const handleRatingChange = useCallback((v: Rating | 'ALL') => updateFilters({ rating: v }), [updateFilters])
  const handleSortChange = useCallback((v: SortOption) => updateFilters({ sort: v }), [updateFilters])
  const handleCategoryChange = useCallback((v: string) => updateFilters({ category: v }), [updateFilters])
  const handleLicenseChange = useCallback((v: string) => updateFilters({ license: v }), [updateFilters])
  const handleAlternativesChange = useCallback(
    (v: 'ALL' | 'YES' | 'NO') => updateFilters({ alternatives: v }),
    [updateFilters]
  )

  // Filter for alternatives client-side if it's not implemented in getApps yet
  const filteredApps = useMemo(() => {
    if (initialFilters.alternatives === 'ALL') return apps
    return apps.filter((app) => {
      const hasAlts = (app.recommendedAlternatives?.length || 0) > 0
      return initialFilters.alternatives === 'YES' ? hasAlts : !hasAlts
    })
  }, [apps, initialFilters.alternatives])

  const rows = useMemo(() => {
    const result = []
    for (let i = 0; i < filteredApps.length; i += columns) {
      result.push(filteredApps.slice(i, i + columns))
    }
    return result
  }, [filteredApps, columns])

  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => 440,
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
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  <span>{t('kicker')}</span>
                  <span className="text-primary/80">•</span>
                  <span>{t('kickerSecondary')}</span>
                </div>
                <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">{t('title')}</h1>
              </div>
              <Button asChild size="lg" className="self-start lg:self-auto">
                <a href="https://forms.gle/1iX4BgLv2myNTvoLA" target="_blank" rel="noreferrer">
                  {t('submitReview')}
                </a>
              </Button>
            </div>

            <div className="flex flex-col gap-8">
              <div className="max-w-2xl flex items-center gap-4">
                <SearchInput defaultValue={initialFilters.search} onChange={handleSearchChange} />
                {isPending && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />}
              </div>
              <FilterSort
                activeRating={initialFilters.rating}
                activeSort={initialFilters.sort}
                activeCategory={initialFilters.category}
                activeLicense={initialFilters.license}
                activeAlternatives={initialFilters.alternatives}
                categories={categories}
                licenses={licenses}
                onRatingChange={handleRatingChange}
                onSortChange={handleSortChange}
                onCategoryChange={handleCategoryChange}
                onLicenseChange={handleLicenseChange}
                onAlternativesChange={handleAlternativesChange}
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
                  <p>
                    {app.category} - {app.license}
                  </p>
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
