import type { Metadata } from 'next'
import { IBM_Plex_Mono, Saira, Saira_Condensed } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server'
import SmoothScroll from '@/components/atoms/SmoothScroll'
import LocaleSuggester from '@/components/molecules/LocaleSuggester'
import SiteHeader from '@/components/organisms/SiteHeader'
import SiteFooter from '@/components/organisms/SiteFooter'
import { routing } from '@/i18n/routing'
import './globals.css'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const saira = Saira({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
})

const sairaCondensed = Saira_Condensed({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700']
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500']
})

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    title: {
      template: '%s | WinuxDB',
      default: 'WinuxDB'
    },
    description: t('description')
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang={locale} className="dark">
      <body className={`${saira.variable} ${sairaCondensed.variable} ${ibmPlexMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll />
          <LocaleSuggester />
          <SiteHeader />
          {children}
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
