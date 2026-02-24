'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import LanguageSelector from '@/components/molecules/LanguageSelector'
import { ThemeSwitcher } from '@/components/molecules/ThemeSwitcher'
import { Link, usePathname } from '@/i18n/routing'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', labelKey: 'home' },
  { href: '/apps', labelKey: 'apps' },
  { href: '/contribute', labelKey: 'contribute' }
]

export default function SiteHeader() {
  const t = useTranslations('Nav')
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn('sticky top-0 z-50 w-full transition-all duration-300 px-6 lg:px-8', isScrolled ? 'py-3' : 'py-6')}
    >
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between transition-all duration-500',
          isScrolled
            ? 'glass-header rounded-full px-6 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/5'
            : 'bg-transparent'
        )}
      >
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex size-10 items-center justify-center rounded-full border border-border/70 bg-card/80 transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/images/winuxdb-logo.png"
                alt="WinuxDB"
                width={32}
                height={32}
                className="size-7 z-10"
                priority
              />
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold uppercase tracking-[0.3em] text-foreground transition-colors group-hover:text-primary">
                WinuxDB
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] sm:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-full transition-all duration-200',
                    isActive
                      ? 'text-primary bg-primary/10 shadow-[0_0_12px_rgba(255,60,60,0.1)]'
                      : 'text-muted-foreground/80 hover:text-foreground hover:bg-white/5'
                  )}
                >
                  {t(link.labelKey)}
                </Link>
              )
            })}
            <div className="mx-2 h-4 w-px bg-border/40" />
            <Link
              href="https://protondb.com/?utm_source=winuxdb"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-muted-foreground/80 transition-colors hover:text-foreground hover:underline decoration-primary underline-offset-4"
            >
              {t('games')}
            </Link>
            <Link
              href="https://areweanticheatyet.com/?utm_source=winuxdb"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-muted-foreground/80 transition-colors hover:text-foreground hover:underline decoration-primary underline-offset-4"
            >
              {t('antiCheat')}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <LanguageSelector />
        </div>
      </div>
    </header>
  )
}
