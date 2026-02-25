'use client'

import { Check, Globe, ChevronDown } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { usePathname, useRouter } from '@/i18n/routing'
import { cn } from '@/lib/utils'

const locales = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
  { code: 'es', label: 'Español' },
]

export default function LanguageSelector() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function onSelectChange(nextLocale: string) {
    localStorage.setItem('dismissed-locale-suggestion', 'true')
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-10 px-3 flex items-center gap-2 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
        >
          <Globe className="size-4 text-muted-foreground" />
          <span className="text-[0.7rem] font-bold uppercase tracking-wider hidden sm:inline-block">
            {locale}
          </span>
          <ChevronDown className="size-3 text-muted-foreground/50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-panel border-white/10 min-w-[140px] p-1">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => onSelectChange(l.code)}
            className={cn(
              "flex items-center justify-between px-3 py-2 text-xs font-medium cursor-pointer transition-colors rounded-sm",
              locale === l.code 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <div className="flex flex-col">
              <span className="font-bold">{l.code.toUpperCase()}</span>
              <span className="text-[10px] opacity-70">{l.label}</span>
            </div>
            {locale === l.code && <Check className="size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
