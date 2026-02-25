import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'

export default async function SiteFooter() {
  const t = await getTranslations('Footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-border/40 bg-card/30">
      <div className="surface-grid absolute inset-0 opacity-10 dark:opacity-20" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full border border-border/70 bg-card/80">
                <Image src="/images/winuxdb-logo.png" alt="WinuxDB" width={32} height={32} className="size-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground leading-none">
                  WinuxDB
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 ml-[2px] mt-1">
                  Beta
                </span>
              </div>
            </Link>
            <p className="max-w-md text-sm leading-7 text-muted-foreground">{t('description')}</p>
            <div className="flex items-center gap-4">
              <a
                href="https://x.com/WinuxDB"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground/40 transition-colors hover:text-foreground"
                aria-label="Follow WinuxDB on X"
              >
                <svg viewBox="0 0 24 24" className="size-4 fill-current">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
              </a>
            </div>
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
              <Link
                href="https://protondb.com/?utm_source=winuxdb"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                {t('links.games')}
              </Link>
              <Link
                href="https://areweanticheatyet.com/?utm_source=winuxdb"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                {t('links.antiCheat')}
              </Link>
            </nav>
          </div>

          {/* Resources Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t('links.resources')}</h3>
            <nav className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Link
                href="https://github.com/LucasFormiga/winuxdb"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                {t('links.github')}
              </Link>
              <Link
                href="https://x.com/WinuxDB"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                {t('links.x')}
              </Link>
              <Link href="/contribute" className="transition-colors hover:text-foreground">
                {t('links.contribute')}
              </Link>
              <Link
                href="https://forms.gle/1iX4BgLv2myNTvoLA"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                {t('links.submitReview')}
              </Link>
              <Link
                href="https://forms.gle/hySiJzrRHsmCySrW7"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                {t('links.reportBug')}
              </Link>
              <Link href="/about" className="transition-colors hover:text-foreground">
                {t('links.about')}
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border/40 pt-8 sm:flex-row">
          <div className="flex flex-col items-center gap-2 text-[0.7rem] uppercase tracking-wider text-muted-foreground/60 sm:items-start">
            <p>{t('copyright', { year: currentYear })}</p>
            <p>
              {t.rich('madeIn', {
                love: '❤️',
                br: '🇧🇷',
                link: (chunks) => (
                  <Link
                    href="https://github.com/LucasFormiga"
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    {chunks}
                  </Link>
                )
              })}
            </p>
          </div>
          <div className="flex gap-6 text-[0.7rem] uppercase tracking-wider text-muted-foreground/60">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              {t('links.privacy')}
            </Link>
            <Link href="/guidelines" className="transition-colors hover:text-foreground">
              {t('links.guidelines')}
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
