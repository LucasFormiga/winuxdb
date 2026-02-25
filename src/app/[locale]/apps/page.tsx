import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getApps } from '@/lib/actions/apps'
import AppsContent from './AppsContent'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Apps' })
  return { title: t('title') }
}

interface AppsPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    search?: string
    category?: string
    rating?: string
    license?: string
    sort?: string
    alternatives?: string
  }>
}

export default async function AppsPage({ params, searchParams }: AppsPageProps) {
  const { locale } = await params
  const { search, category, rating, license, sort, alternatives } = await searchParams
  setRequestLocale(locale)

  const sortBy = sort === 'releaseDate' ? 'release_date' : (sort as any) || 'rating'

  const { apps = [] } = await getApps({
    search,
    category,
    rating,
    license,
    sortBy,
    order: 'desc',
    limit: 100 // Load more for better virtualizer experience
  })

  // We still need all categories and licenses for the filter selects
  // In a real app, these could be separate tables or a distinct query
  const { apps: allApps = [] } = await getApps({ limit: 1000 })
  const categories = Array.from(new Set(allApps.map((a) => a.category)))
    .filter(Boolean)
    .sort() as string[]
  const licenses = Array.from(new Set(allApps.map((a) => a.license)))
    .filter(Boolean)
    .sort() as string[]

  return (
    <AppsContent
      apps={apps}
      categories={categories}
      licenses={licenses}
      initialFilters={{
        search: search || '',
        category: category || 'ALL',
        rating: (rating as any) || 'ALL',
        license: license || 'ALL',
        sort: (sort as any) || 'rating',
        alternatives: (alternatives as any) || 'ALL'
      }}
    />
  )
}
