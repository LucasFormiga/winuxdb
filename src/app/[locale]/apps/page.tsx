import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getApps } from '@/lib/data/apps-loader'
import AppsContent from './AppsContent'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Apps' })
  return { title: t('title') }
}

export default async function AppsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const apps = getApps()
  
  return <AppsContent apps={apps} />
}
