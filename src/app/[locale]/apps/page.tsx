import { setRequestLocale } from 'next-intl/server'
import { getApps } from '@/lib/data/apps-loader'
import AppsContent from './AppsContent'

export default async function AppsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const apps = getApps()
  
  return <AppsContent apps={apps} />
}
