import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getApps } from '@/lib/data/apps-loader'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://winuxdb.com'
  const apps = getApps()
  const staticPages = ['', '/apps', '/about', '/contribute', '/privacy', '/terms']
  const locales = routing.locales

  const routes: MetadataRoute.Sitemap = []

  // Static pages for each locale
  for (const locale of locales) {
    for (const page of staticPages) {
      // canonical root or prefixed locale path
      const urlPath = locale === routing.defaultLocale 
        ? page 
        : `/${locale}${page}`
      
      routes.push({
        url: `${baseUrl}${urlPath === '' ? '/' : urlPath}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: page === '' ? 1 : 0.8,
      })
    }
  }

  // Individual app pages (even if we don't have them yet, good to prep or skip)
  // For now, focusing on the main apps list which is the most high-value page.

  return routes
}
