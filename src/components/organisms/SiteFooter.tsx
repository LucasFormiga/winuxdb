import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/routing'

export default async function SiteFooter() {
  const t = await getTranslations('Footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-20 border-t border-border/40 bg-card/30">
      <div className="surface-grid absolute inset-0 opacity-20" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full border border-border/70 bg-card/80">
                <Image src="/images/winuxdb-logo.png" alt="WinuxDB" width={32} height={32} className="size-7" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">WinuxDB</span>
            </Link>
            <p className="max-w-md text-sm leading-7 text-muted-foreground">
              {t('description')}
            </p>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t('links.product')}</h3>
            <nav className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Link href="/apps" className="transition-colors hover:text-foreground">
                {t('links.apps')}
              </Link>
              <Link href="/#quiz" className="transition-colors hover:text-foreground">
                {t('links.distros')}
              </Link>
              <a
                href="https://protondb.com"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                {t('links.games')}
              </a>
            </nav>
          </div>

          {/* Resources Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t('links.resources')}</h3>
            <nav className="flex flex-col gap-3 text-sm text-muted-foreground">
              <a
                href="https://github.com/LucasFormiga/winuxdb"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                {t('links.github')}
              </a>
              <Link href="/contribute" className="transition-colors hover:text-foreground">
                {t('links.contribute')}
              </Link>
              <Link href="/about" className="transition-colors hover:text-foreground">
                {t('links.about')}
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border/40 pt-8 sm:flex-row">
          <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground/60">
            {t('copyright', { year: currentYear })}
          </p>
          <div className="flex gap-6 text-[0.7rem] uppercase tracking-wider text-muted-foreground/60">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              {t('links.privacy')}
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              {t('links.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
