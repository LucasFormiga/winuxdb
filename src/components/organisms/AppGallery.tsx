import Image from 'next/image'
import { Camera } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { App } from '@/lib/types'

interface AppGalleryProps {
  app: App
}

export default function AppGallery({ app }: AppGalleryProps) {
  const t = useTranslations('AppDetail')
  if (!app.screenshots || app.screenshots.length === 0) {
    return null
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <Camera className="size-5 text-primary" />
        <h2 className="text-xl font-semibold">{t('screenshots')}</h2>
      </div>

      <div className="flex w-full gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {app.screenshots.map((src, index) => (
          <div 
            key={index} 
            className="relative aspect-video h-[300px] shrink-0 overflow-hidden rounded-2xl border border-border/40 bg-muted/20 snap-center shadow-lg transition-transform hover:scale-[1.02]"
          >
            <Image
              src={src}
              alt={`${app.name} screenshot ${index + 1}`}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
