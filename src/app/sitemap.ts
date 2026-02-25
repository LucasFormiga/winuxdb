import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://winuxdb.com'
  const staticPages = ['', '/apps', '/about', '/contribute', '/privacy', '/terms']
  const locales = routing.locales

  const routes: MetadataRoute.Sitemap = []

  // 1. Static Pages
  for (const locale of locales) {
    for (const page of staticPages) {
      const urlPath = locale === routing.defaultLocale ? page : `/${locale}${page}`

      routes.push({
        url: `${baseUrl}${urlPath === '' ? '/' : urlPath}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: page === '' ? 1 : 0.8
      })
    }
  }

  // 2. Dynamic App Pages (All apps)
  try {
    const supabase = createAdminClient()
    const { data: apps } = await supabase
      .from('apps')
      .select('slug, updated_at')

    if (apps) {
      for (const locale of locales) {
        for (const app of apps) {
          if (!app.slug) continue

          const isDefaultLocale = locale === routing.defaultLocale
          const urlPath = isDefaultLocale ? `/apps/${app.slug}` : `/${locale}/apps/${app.slug}`
          
          routes.push({
            url: `${baseUrl}${urlPath}`,
            lastModified: app.updated_at ? new Date(app.updated_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.6
          })
        }
      }
    }
  } catch (error) {
    console.error('Sitemap app generation error:', error)
  }

  return routes
}
