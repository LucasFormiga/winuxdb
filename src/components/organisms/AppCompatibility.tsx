import { Info, Layers, Terminal } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { App } from '@/lib/types'

interface AppCompatibilityProps {
  app: App
}

export default function AppCompatibility({ app }: AppCompatibilityProps) {
  const t = useTranslations('AppDetail')
  const hasProton = app.instructions?.proton
  const hasWine = app.instructions?.wine

  if (!hasProton && !hasWine) {
    return (
      <div className="glass-panel rounded-3xl p-8 text-center text-muted-foreground">
        <Info className="mx-auto mb-4 size-8 opacity-40" />
        <p>{t('noInstructions')}</p>
      </div>
    )
  }

  return (
    <div className="glass-panel space-y-6 rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-3">
        <Layers className="size-5 text-primary" />
        <h2 className="text-xl font-semibold">{t('compatibility')}</h2>
      </div>

      <Tabs defaultValue={hasProton ? 'proton' : 'wine'} className="w-full">
        <TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="proton" disabled={!hasProton}>Proton</TabsTrigger>
          <TabsTrigger value="wine" disabled={!hasWine}>Wine / Bottles</TabsTrigger>
        </TabsList>

        {hasProton && (
          <TabsContent value="proton" className="space-y-6 focus-visible:outline-none">
            {app.instructions?.proton?.valve && (
              <div className="rounded-2xl border border-border/40 bg-muted/30 p-5">
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <div className="size-2 rounded-full bg-blue-500" />
                  Steam Proton (Valve)
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {app.instructions.proton.valve}
                </p>
              </div>
            )}
            {app.instructions?.proton?.ge && (
              <div className="rounded-2xl border border-border/40 bg-muted/30 p-5">
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <div className="size-2 rounded-full bg-purple-500" />
                  Proton GE (GloriousEggroll)
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {app.instructions.proton.ge}
                </p>
              </div>
            )}
            {app.instructions?.proton?.cachyos && (
              <div className="rounded-2xl border border-border/40 bg-muted/30 p-5">
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <div className="size-2 rounded-full bg-green-500" />
                  Proton CachyOS
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {app.instructions.proton.cachyos}
                </p>
              </div>
            )}
          </TabsContent>
        )}

        {hasWine && (
          <TabsContent value="wine" className="space-y-6 focus-visible:outline-none">
            {app.instructions?.wine?.bottles && (
              <div className="rounded-2xl border border-border/40 bg-muted/30 p-5">
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <div className="size-2 rounded-full bg-orange-500" />
                  Bottles
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {app.instructions.wine.bottles}
                </p>
              </div>
            )}
            {app.instructions?.wine?.playonlinux && (
              <div className="rounded-2xl border border-border/40 bg-muted/30 p-5">
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <div className="size-2 rounded-full bg-cyan-500" />
                  PlayOnLinux
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {app.instructions.wine.playonlinux}
                </p>
              </div>
            )}
            {app.instructions?.wine?.general && (
              <div className="rounded-2xl border border-border/40 bg-muted/30 p-5">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-primary">
                  <Terminal className="size-4" />
                  General Wine Instructions
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {app.instructions.wine.general}
                </p>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
