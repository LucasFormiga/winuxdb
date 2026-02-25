import { IBM_Plex_Mono, Saira, Saira_Condensed } from 'next/font/google'
import { notFound } from 'next/navigation'
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

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

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
