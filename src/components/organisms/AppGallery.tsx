import { Camera } from 'lucide-react'
import Image from 'next/image'
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
    <section className="space-y-8">
      <div className="flex items-center gap-3 px-2">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Camera className="size-5" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">{t('screenshots')}</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {app.screenshots.map((src, index) => (
          <div
            key={index}
            className="group relative aspect-video overflow-hidden rounded-[2.5rem] border border-border/40 bg-muted/20 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-primary/40"
          >
            <Image
              src={src}
              alt={`${app.name} screenshot ${index + 1}`}
              className="object-cover transition-all duration-700 group-hover:scale-110"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </section>
  )
}
