import localFont from 'next/font/local'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import SmoothScroll from '@/components/atoms/SmoothScroll'
import { ThemeProvider } from '@/components/atoms/ThemeProvider'
import LocaleSuggester from '@/components/molecules/LocaleSuggester'
import SiteFooter from '@/components/organisms/SiteFooter'
import SiteHeader from '@/components/organisms/SiteHeader'
import { TooltipProvider } from '@/components/ui/tooltip'
import { routing } from '@/i18n/routing'
import { getUserData } from '@/lib/actions/auth'
import './globals.css'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const saira = localFont({
  src: [
    { path: '../../../node_modules/@fontsource/saira/files/saira-latin-400-normal.woff2', weight: '400' },
    { path: '../../../node_modules/@fontsource/saira/files/saira-latin-500-normal.woff2', weight: '500' },
    { path: '../../../node_modules/@fontsource/saira/files/saira-latin-600-normal.woff2', weight: '600' },
    { path: '../../../node_modules/@fontsource/saira/files/saira-latin-700-normal.woff2', weight: '700' }
  ],
  variable: '--font-body',
  display: 'swap'
})

const sairaCondensed = localFont({
  src: [
    {
      path: '../../../node_modules/@fontsource/saira-condensed/files/saira-condensed-latin-500-normal.woff2',
      weight: '500'
    },
    {
      path: '../../../node_modules/@fontsource/saira-condensed/files/saira-condensed-latin-600-normal.woff2',
      weight: '600'
    },
    {
      path: '../../../node_modules/@fontsource/saira-condensed/files/saira-condensed-latin-700-normal.woff2',
      weight: '700'
    }
  ],
  variable: '--font-display',
  display: 'swap'
})

const ibmPlexMono = localFont({
  src: [
    {
      path: '../../../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2',
      weight: '400'
    },
    {
      path: '../../../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2',
      weight: '500'
    }
  ],
  variable: '--font-mono',
  display: 'swap'
})

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  const baseUrl = 'https://winuxdb.com'

  const languages = routing.locales.reduce(
    (acc, l) => {
      acc[l] = `${baseUrl}${l === 'en' ? '' : `/${l}`}`
      return acc
    },
    {} as Record<string, string>
  )

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: '%s | WinuxDB',
      default: 'WinuxDB - Windows App Compatibility Database for Linux'
    },
    description: t('description'),
    keywords: [
      'Linux',
      'Wine',
      'Proton',
      'Compatibility',
      'Windows Apps on Linux',
      'Gaming on Linux',
      'WineHQ',
      'Software database'
    ],
    alternates: {
      canonical: '/',
      languages: languages
    },
    openGraph: {
      title: 'WinuxDB',
      description: t('description'),
      url: baseUrl,
      siteName: 'WinuxDB',
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/images/winuxdb-logo.png',
          width: 800,
          height: 800,
          alt: 'WinuxDB Logo'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'WinuxDB',
      description: t('description'),
      images: ['/images/winuxdb-logo.png']
    },
    robots: {
      index: true,
      follow: true
    }
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

  setRequestLocale(locale)

  const messages = await getMessages()
  const user = await getUserData()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'WinuxDB',
    description: 'Windows App Compatibility Database for Linux',
    url: 'https://winuxdb.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://winuxdb.com/apps?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${saira.variable} ${sairaCondensed.variable} ${ibmPlexMono.variable} antialiased`}>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Necessary adjustment */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <NextIntlClientProvider messages={messages}>
            <TooltipProvider>
              <SmoothScroll />
              <LocaleSuggester />
              <SiteHeader user={user} />
              {children}
              <SiteFooter />
            </TooltipProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
