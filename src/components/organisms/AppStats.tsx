'use client'

import { ArrowRight, Cpu, Info, Package, Shield, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import type { App } from '@/lib/types'

interface AppStatsProps {
  app: App
}

export default function AppStats({ app }: AppStatsProps) {
  const t = useTranslations('AppDetail')
  const tCat = useTranslations('Categories')
  const tLic = useTranslations('Licenses')

  return (
    <aside className="space-y-8">
      {/* Quick Details Card */}
      <div className="glass-panel overflow-hidden rounded-[2.5rem] p-8 border-border/40">
        <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{t('details')}</h3>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground">
              <Shield className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">{t('license')}</span>
              <span className="font-bold text-foreground">{tLic(app.license || 'Proprietary')}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground">
              <Package className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">{t('category')}</span>
              <span className="font-bold text-foreground">{tCat(app.category || 'Utility')}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground">
              <Info className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">{t('recommendedVersion')}</span>
              <Badge className="w-fit mt-1 bg-green-500/10 text-green-500 border-green-500/20 px-2 py-0 text-[0.65rem] font-bold shadow-none">
                {app.recommended_version || app.recommendedVersion || 'Latest'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Performance & Tech Card */}
      <div className="glass-panel overflow-hidden rounded-[2.5rem] p-8 border-border/40">
        <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
          {t('performanceTech')}
        </h3>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
              <Cpu className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">{t('gpuSupport')}</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {app.gpuCompatibility?.directx && (
                  <Badge variant="outline" className="text-[0.6rem] font-bold border-blue-500/30">
                    DirectX {app.gpuCompatibility.directx}
                  </Badge>
                )}
                {app.gpuCompatibility?.vulkan && (
                  <Badge variant="outline" className="text-[0.6rem] font-bold border-red-500/30">
                    Vulkan {app.gpuCompatibility.vulkan}
                  </Badge>
                )}
                {!app.gpuCompatibility && (
                  <span className="text-sm font-medium italic opacity-40">Standard CPU/GPU</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500">
              <Zap className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">{t('engineRecommendation')}</span>
              <span className="font-bold text-foreground">
                {(app.overall_rating || app.rating) === 'NATIVE' ? t('nativeLinux') : t('protonEngine')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alternatives Sidebar section */}
      {((app.nativeAlternatives && app.nativeAlternatives.length > 0) ||
        (app.recommendedAlternatives && app.recommendedAlternatives.length > 0)) && (
        <div className="glass-panel overflow-hidden rounded-[2.5rem] p-8 border-border/40">
          <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            {t('alternatives')}
          </h3>

          <div className="space-y-6">
            {app.nativeAlternatives && app.nativeAlternatives.length > 0 && (
              <div className="space-y-3">
                <span className="text-[0.65rem] font-black uppercase tracking-widest text-primary/70">
                  {t('nativeAlternatives')}
                </span>
                <div className="grid gap-2">
                  {app.nativeAlternatives.map((alt) => (
                    <div
                      key={alt}
                      className="flex items-center justify-between rounded-xl bg-primary/5 px-3 py-2 text-sm border border-primary/10 transition-colors hover:bg-primary/10"
                    >
                      <span className="font-semibold text-primary/90">{alt}</span>
                      <ArrowRight className="size-3 text-primary/50" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {app.recommendedAlternatives && app.recommendedAlternatives.length > 0 && (
              <div className="space-y-3">
                <span className="text-[0.65rem] font-black uppercase tracking-widest text-muted-foreground/70">
                  {t('otherAlternatives')}
                </span>
                <div className="grid gap-2">
                  {app.recommendedAlternatives.map((alt) => (
                    <div
                      key={alt}
                      className="flex items-center justify-between rounded-xl bg-muted/30 px-3 py-2 text-sm border border-border/20 transition-colors hover:bg-muted/50"
                    >
                      <span className="font-medium text-muted-foreground">{alt}</span>
                      <ArrowRight className="size-3 text-muted-foreground/30" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  )
}
