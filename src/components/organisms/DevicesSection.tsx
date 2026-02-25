'use client'

import { Monitor, Star, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { UserDevice } from '@/lib/types'
import { cn } from '@/lib/utils'
import DeviceWizard from './DeviceWizard'

interface DevicesSectionProps {
  initialDevices: UserDevice[]
}

export default function DevicesSection({ initialDevices }: DevicesSectionProps) {
  const t = useTranslations('AccountDevices')
  const [devices, setDevices] = useState<UserDevice[]>(initialDevices)

  const handleAddDevice = (device: UserDevice) => {
    if (devices.length >= 5) return
    const newDevices = [...devices, { ...device, isPrimary: devices.length === 0 }]
    setDevices(newDevices)
  }

  const handleDeleteDevice = (id: string) => {
    const newDevices = devices.filter((d) => d.id !== id)
    // If we deleted the primary, set the first one as primary
    if (newDevices.length > 0 && !newDevices.some((d) => d.isPrimary)) {
      newDevices[0].isPrimary = true
    }
    setDevices(newDevices)
  }

  const handleSetPrimary = (id: string) => {
    const newDevices = devices.map((d) => ({
      ...d,
      isPrimary: d.id === id
    }))
    setDevices(newDevices)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold uppercase tracking-tight">{t('title')}</h2>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <DeviceWizard onAdd={handleAddDevice} disabled={devices.length >= 5} />
      </div>

      {devices.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-border/40 bg-muted/20 p-12 text-center">
          <div className="mb-4 flex size-20 items-center justify-center rounded-[2rem] bg-muted/40 text-muted-foreground/40">
            <Monitor className="size-10" />
          </div>
          <p className="max-w-[280px] text-muted-foreground">{t('noDevices')}</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {devices.map((device) => (
            <div
              key={device.id}
              className={cn(
                'group relative flex flex-col gap-6 rounded-[2.5rem] border-2 border-border/40 bg-muted/20 p-8 transition-all hover:bg-muted/30 md:flex-row md:items-center',
                device.isPrimary && 'border-primary/50 bg-primary/[0.03]'
              )}
            >
              {/* Primary Badge */}
              {device.isPrimary && (
                <div className="absolute -left-2 top-8 flex items-center gap-1.5 rounded-r-full bg-primary px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20">
                  <Star className="size-3 fill-current" />
                  {t('primary')}
                </div>
              )}

              <div className="flex flex-1 items-start gap-6">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-[1.5rem] bg-background shadow-sm">
                  <Monitor className="size-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black uppercase tracking-tight">{device.name}</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-muted-foreground">
                    <span>
                      {device.distro} {device.distroVersion}
                    </span>
                    <span className="opacity-20">•</span>
                    <span>{device.cpu}</span>
                    <span className="opacity-20">•</span>
                    <span>{device.ram}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!device.isPrimary && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetPrimary(device.id)}
                    className="rounded-xl font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
                  >
                    {t('setPrimary')}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteDevice(device.id)}
                  className="size-12 rounded-2xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                >
                  <Trash2 className="size-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {devices.length >= 5 && (
        <p className="flex items-center justify-center gap-2 text-sm font-medium text-amber-500">
          <Star className="size-4" /> {t('maxDevices')}
        </p>
      )}
    </div>
  )
}
