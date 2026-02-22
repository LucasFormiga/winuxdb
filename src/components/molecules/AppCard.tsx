import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RatingMedal from "@/components/atoms/RatingMedal";
import type { App } from "@/lib/types";
import { Image as ImageIcon } from "lucide-react";

interface AppCardProps {
  app: App;
}

export default function AppCard({ app }: AppCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="flex aspect-video w-full items-center justify-center bg-zinc-100 dark:bg-zinc-900">
          {app.logo ? (
            <img
              src={app.logo}
              alt={app.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="size-12 text-zinc-300 dark:text-zinc-700" />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="line-clamp-1 text-lg font-bold">
            {app.name}
          </CardTitle>
          <RatingMedal rating={app.rating} />
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>{app.category}</span>
          <span>•</span>
          <span>{app.license}</span>
        </div>
      </CardContent>
    </Card>
  );
}
