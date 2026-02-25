'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Menu, LogIn, ExternalLink } from 'lucide-react'
import LanguageSelector from '@/components/molecules/LanguageSelector'
import { ThemeSwitcher } from '@/components/molecules/ThemeSwitcher'
import { Link, usePathname } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navLinks = [
  { href: '/', labelKey: 'home' },
  { href: '/apps', labelKey: 'apps' },
  { href: '/contribute', labelKey: 'contribute' }
]

const externalLinks = [
  { href: 'https://protondb.com/?utm_source=winuxdb', labelKey: 'games' },
  { href: 'https://areweanticheatyet.com/?utm_source=winuxdb', labelKey: 'antiCheat' }
]

export default function SiteHeader() {
  const t = useTranslations('Nav')
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300 px-4 lg:px-8', 
        isScrolled ? 'py-2' : 'py-4'
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between transition-all duration-500',
          isScrolled
            ? 'glass-header rounded-2xl px-4 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/5'
            : 'bg-transparent'
        )}
      >
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex size-9 items-center justify-center rounded-xl border border-border/70 bg-card/80 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/winuxdb-logo.png"
                alt="WinuxDB"
                width={28}
                height={28}
                className="size-6 z-10"
                priority
              />
              <div className="absolute inset-0 rounded-xl bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground transition-colors group-hover:text-primary">
                WinuxDB
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 text-[0.65rem] font-bold uppercase tracking-[0.15em] lg:flex">
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
            {externalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-muted-foreground/80 transition-colors hover:text-foreground flex items-center gap-1.5"
              >
                {t(link.labelKey)}
                <ExternalLink className="size-2.5 opacity-50" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <ThemeSwitcher />
            <LanguageSelector />
          </div>
          
          <Link href="/login">
            <Button 
              size="sm" 
              className="h-9 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-[0.7rem] uppercase tracking-wider px-5 shadow-[0_4px_12px_rgba(255,60,60,0.25)] hover:shadow-[0_6px_20px_rgba(255,60,60,0.4)] transition-all duration-300"
            >
              <LogIn className="size-3.5 mr-2" />
              {t('login')}
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 rounded-full bg-white/5 border border-white/5">
                <Menu className="size-5" />
                <span className="sr-only">{t('menu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-panel border-none w-[280px] p-6 flex flex-col gap-8">
              <SheetHeader className="text-left border-none">
                <div className="flex items-center gap-3">
                  <div className="relative flex size-9 items-center justify-center rounded-xl border border-border/70 bg-card/80">
                    <Image
                      src="/images/winuxdb-logo.png"
                      alt="WinuxDB"
                      width={28}
                      height={28}
                      className="size-6 z-10"
                    />
                    <div className="absolute inset-0 rounded-xl bg-primary/20 blur-md" />
                  </div>
                  <SheetTitle className="text-xl font-bold uppercase tracking-[0.2em] text-foreground">WinuxDB</SheetTitle>
                </div>
              </SheetHeader>
              
              <nav className="flex flex-col gap-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 px-2">{t('navigation')}</span>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-between',
                        isActive
                          ? 'text-primary bg-primary/10 border border-primary/20'
                          : 'text-foreground/80 hover:bg-white/5 border border-transparent'
                      )}
                    >
                      {t(link.labelKey)}
                      {isActive && <div className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(255,60,60,0.8)]" />}
                    </Link>
                  )
                })}
              </nav>

              <div className="h-px bg-white/10" />

              <nav className="flex flex-col gap-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 px-2">{t('external')}</span>
                {externalLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center justify-between hover:bg-white/5"
                  >
                    {t(link.labelKey)}
                    <ExternalLink className="size-3.5 opacity-30" />
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{t('theme')}</span>
                  <ThemeSwitcher />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{t('language')}</span>
                  <LanguageSelector />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
