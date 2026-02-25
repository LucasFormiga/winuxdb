import { Info, Layers, Terminal } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { App } from '@/lib/types'

interface AppCompatibilityProps {
  app: App
}

export default function AppCompatibility({ app }: AppCompatibilityProps) {
  const t = useTranslations('AppDetail')
  const hasWine = app.instructions?.wine
  const hasProton = app.instructions?.proton

  if (!hasProton && !hasWine) {
    return (
      <div className="glass-panel rounded-[2.5rem] p-12 text-center text-muted-foreground border-border/40">
        <Info className="mx-auto mb-6 size-12 opacity-20" />
        <p className="text-lg font-medium">{t('noInstructions')}</p>
      </div>
    )
  }

  return (
    <div className="glass-panel space-y-8 rounded-[3rem] p-8 md:p-12 border-border/40 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Layers className="size-32" />
      </div>

      <div className="flex items-center gap-4 relative z-10">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Layers className="size-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('compatibility')}</h2>
          <p className="text-sm text-muted-foreground">{t('expertInstructions')}</p>
        </div>
      </div>

      <Tabs defaultValue={hasWine ? 'wine' : 'proton'} className="w-full relative z-10">
        <TabsList className="mb-10 grid w-full max-w-md grid-cols-2 bg-muted/40 p-1 rounded-2xl h-14">
          <TabsTrigger
            value="wine"
            disabled={!hasWine}
            className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg h-full transition-all"
          >
            {t('wineTitle')}
          </TabsTrigger>
          <TabsTrigger
            value="proton"
            disabled={!hasProton}
            className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg h-full transition-all"
          >
            {t('protonTitle')}
          </TabsTrigger>
        </TabsList>

        {hasWine && (
          <TabsContent
            value="wine"
            className="space-y-6 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-400"
          >
            {app.instructions?.wine?.general && (
              <div className="group rounded-[2rem] border border-primary/20 bg-primary/5 p-8 transition-all hover:bg-primary/10">
                <h3 className="mb-4 flex items-center gap-3 text-lg font-bold tracking-tight text-primary">
                  <Terminal className="size-5" />
                  General Wine Instructions
                </h3>
                <p className="text-lg leading-relaxed text-foreground/80">{app.instructions.wine.general}</p>
              </div>
            )}
            {app.instructions?.wine?.playonlinux && (
              <div className="group rounded-[2rem] border border-border/40 bg-muted/30 p-8 transition-all hover:bg-muted/40">
                <h3 className="mb-4 flex items-center gap-3 text-lg font-bold tracking-tight">
                  <div className="size-3 rounded-full bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]" />
                  PlayOnLinux
                </h3>
                <p className="text-lg leading-relaxed text-muted-foreground/90">{app.instructions.wine.playonlinux}</p>
              </div>
            )}
            {app.instructions?.wine?.bottles && (
              <div className="group rounded-[2rem] border border-border/40 bg-muted/30 p-8 transition-all hover:bg-muted/40">
                <h3 className="mb-4 flex items-center gap-3 text-lg font-bold tracking-tight">
                  <div className="size-3 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.5)]" />
                  Bottles
                </h3>
                <p className="text-lg leading-relaxed text-muted-foreground/90">{app.instructions.wine.bottles}</p>
              </div>
            )}
          </TabsContent>
        )}

        {hasProton && (
          <TabsContent
            value="proton"
            className="space-y-6 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-400"
          >
            {app.instructions?.proton?.valve && (
              <div className="group rounded-[2rem] border border-border/40 bg-muted/30 p-8 transition-all hover:bg-muted/40">
                <h3 className="mb-4 flex items-center gap-3 text-lg font-bold tracking-tight">
                  <div className="size-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                  Steam Proton (Valve)
                </h3>
                <p className="text-lg leading-relaxed text-muted-foreground/90">{app.instructions.proton.valve}</p>
              </div>
            )}
            {app.instructions?.proton?.ge && (
              <div className="group rounded-[2rem] border border-border/40 bg-muted/30 p-8 transition-all hover:bg-muted/40">
                <h3 className="mb-4 flex items-center gap-3 text-lg font-bold tracking-tight">
                  <div className="size-3 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.5)]" />
                  Proton GE (GloriousEggroll)
                </h3>
                <p className="text-lg leading-relaxed text-muted-foreground/90">{app.instructions.proton.ge}</p>
              </div>
            )}
            {app.instructions?.proton?.cachyos && (
              <div className="group rounded-[2rem] border border-border/40 bg-muted/30 p-8 transition-all hover:bg-muted/40">
                <h3 className="mb-4 flex items-center gap-3 text-lg font-bold tracking-tight">
                  <div className="size-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]" />
                  Proton CachyOS
                </h3>
                <p className="text-lg leading-relaxed text-muted-foreground/90">{app.instructions.proton.cachyos}</p>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
