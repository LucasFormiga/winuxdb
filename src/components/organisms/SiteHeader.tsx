'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import LanguageSelector from '@/components/molecules/LanguageSelector'
import { Link, usePathname } from '@/i18n/routing'

const navLinks = [
  { href: '/', labelKey: 'home' },
  { href: '/apps', labelKey: 'apps' },
  { href: '/contribute', labelKey: 'contribute' }
]

export default function SiteHeader() {
  const t = useTranslations('Nav')
  const tHome = useTranslations('Home')
  const tApps = useTranslations('Apps')
  const pathname = usePathname()
  const isApps = pathname.startsWith('/apps')
  const subtitle = isApps ? tApps('subtitle') : tHome('subtitle')

  return (
    <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full border border-border/70 bg-card/80">
            <Image src="/images/winuxdb-logo.png" alt="WinuxDB" width={32} height={32} className="size-7" priority />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">WinuxDB</span>
            <span className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground/70">{subtitle}</span>
          </div>
        </Link>
        <nav className="hidden items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground sm:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${isActive ? 'text-primary' : 'hover:text-foreground'}`}
              >
                {t(link.labelKey)}
              </Link>
            )
          })}
          <a
            href="https://protondb.com"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            {t('games')}
          </a>
        </nav>
      </div>
      <LanguageSelector />
    </header>
  )
}
