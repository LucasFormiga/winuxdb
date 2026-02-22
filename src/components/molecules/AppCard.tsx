import { Image as ImageIcon } from 'lucide-react'
import RatingMedal from '@/components/atoms/RatingMedal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { App } from '@/lib/types'

interface AppCardProps {
  app: App
}

export default function AppCard({ app }: AppCardProps) {
  return (
    <Card className="group overflow-hidden border-border/60 bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_60px_rgba(0,0,0,0.5)]">
      <CardHeader className="p-0">
        <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-black/60 via-black/30 to-primary/10">
          {app.logo ? (
            <img src={app.logo} alt={app.name} className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="size-12 text-muted-foreground/60" />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="line-clamp-1 text-lg font-semibold tracking-tight">{app.name}</CardTitle>
          <RatingMedal rating={app.rating} />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono uppercase tracking-[0.16em] text-[0.65rem]">{app.category}</span>
          <span className="text-primary/60">•</span>
          <span className="font-mono uppercase tracking-[0.16em] text-[0.65rem]">{app.license}</span>
        </div>
      </CardContent>
    </Card>
  )
}
