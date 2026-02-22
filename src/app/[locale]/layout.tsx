import type { Metadata } from 'next'
import { IBM_Plex_Mono, Saira, Saira_Condensed } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import './globals.css'

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

export const metadata: Metadata = {
  title: 'WinuxDB',
  description: 'Windows Apps compatibility database for Linux'
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

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang={locale} className="dark">
      <body className={`${saira.variable} ${sairaCondensed.variable} ${ibmPlexMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
