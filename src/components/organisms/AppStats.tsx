'use client'

import { ArrowRight, Cpu, Info, Package, Shield, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import type { App } from '@/lib/types'

interface AppStatsProps {
  app: App
  recommendedEngine?: string | null
}

export default function AppStats({ app, recommendedEngine }: AppStatsProps) {
  const t = useTranslations('AppDetail')
  const tCat = useTranslations('Categories')
  const tLic = useTranslations('Licenses')

  const formatEngine = (engine: string | null | undefined) => {
    if (!engine) return null
    if (engine.startsWith('valve ')) return `Proton ${engine.replace('valve ', '')}`
    if (engine.startsWith('ge ')) return `GE-Proton ${engine.replace('ge ', '')}`
    if (engine.startsWith('cachyos ')) return `Proton-CachyOS ${engine.replace('cachyos ', '')}`
    return engine
  }

  const displayEngine = formatEngine(recommendedEngine)

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
                {(app.gpu_compatibility?.directx || app.gpuCompatibility?.directx) && (
                  <Badge variant="outline" className="text-[0.6rem] font-bold border-blue-500/30">
                    DirectX {app.gpu_compatibility?.directx || app.gpuCompatibility?.directx}
                  </Badge>
                )}
                {(app.gpu_compatibility?.vulkan || app.gpuCompatibility?.vulkan) && (
                  <Badge variant="outline" className="text-[0.6rem] font-bold border-red-500/30">
                    Vulkan {app.gpu_compatibility?.vulkan || app.gpuCompatibility?.vulkan}
                  </Badge>
                )}
                {!app.gpu_compatibility && !app.gpuCompatibility && (
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
                {(app.overall_rating || app.rating) === 'NATIVE'
                  ? t('nativeLinux')
                  : displayEngine || t('protonEngine')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alternatives Sidebar section */}
      <div className="glass-panel overflow-hidden rounded-[2.5rem] p-8 border-border/40">
        <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
          {t('alternatives')}
        </h3>

        <div className="space-y-8">
          {/* Native Alternatives Section */}
          <div className="space-y-4">
            <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-muted-foreground/70 px-1">
              {t('nativeAlternatives')}
            </span>
            {(app.native_alternatives?.length || 0) > 0 || (app.nativeAlternatives?.length || 0) > 0 ? (
              <div className="grid gap-2.5">
                {(app.native_alternatives || app.nativeAlternatives || []).map((alt) => (
                  <div
                    key={alt}
                    className="group/item flex items-center justify-between rounded-2xl bg-muted/30 px-4 py-3 text-sm border border-border/20 transition-all hover:bg-muted/50 hover:border-border/40"
                  >
                    <span className="font-semibold text-muted-foreground">{alt}</span>
                    <ArrowRight className="size-3.5 text-muted-foreground/30 transition-transform group-hover/item:translate-x-0.5" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-2xl border border-dashed border-border/40 bg-muted/5 px-4 py-6 text-center">
                <p className="text-[0.7rem] font-medium text-muted-foreground/40 leading-relaxed">
                  {t('nativeAlternativesEmpty')}
                </p>
              </div>
            )}
          </div>

          {/* Other Alternatives Section */}
          <div className="space-y-4">
            <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-muted-foreground/70 px-1">
              {t('otherAlternatives')}
            </span>
            {(app.recommended_alternatives?.length || 0) > 0 || (app.recommendedAlternatives?.length || 0) > 0 ? (
              <div className="grid gap-2.5">
                {(app.recommended_alternatives || app.recommendedAlternatives || []).map((alt) => (
                  <div
                    key={alt}
                    className="group/item flex items-center justify-between rounded-2xl bg-muted/30 px-4 py-3 text-sm border border-border/20 transition-all hover:bg-muted/50 hover:border-border/40"
                  >
                    <span className="font-semibold text-muted-foreground">{alt}</span>
                    <ArrowRight className="size-3.5 text-muted-foreground/30 transition-transform group-hover/item:translate-x-0.5" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-2xl border border-dashed border-border/40 bg-muted/5 px-4 py-6 text-center">
                <p className="text-[0.7rem] font-medium text-muted-foreground/40 leading-relaxed">
                  {t('otherAlternativesEmpty')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
