import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://winuxdb.com'
  const staticPages = ['', '/apps', '/about', '/contribute', '/privacy', '/terms']
  const locales = routing.locales

  const routes: MetadataRoute.Sitemap = []

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

  return routes
}
