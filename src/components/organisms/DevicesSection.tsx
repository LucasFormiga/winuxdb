'use client'

import { Edit2, Monitor, Star, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { type Device } from '@/lib/validations/auth'
import { addDevice, deleteDevice, updateDevice } from '@/lib/actions/devices'
import { cn } from '@/lib/utils'
import DeviceWizard from './DeviceWizard'

interface DevicesSectionProps {
  initialDevices: Device[]
}

export default function DevicesSection({ initialDevices }: DevicesSectionProps) {
  const t = useTranslations('AccountDevices')
  const [devices, setDevices] = useState<Device[]>(initialDevices)

  const handleAddDevice = async (deviceData: Omit<Device, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (devices.length >= 5) return

    // Optimistic update
    const tempId = crypto.randomUUID()
    const newDevice = { 
      ...deviceData, 
      id: tempId, 
      user_id: 'temp', 
      created_at: new Date().toISOString(),
      name: deviceData.name || 'New Device'
    } as Device
    setDevices([...devices, newDevice])

    const result = await addDevice(deviceData)
    if (result.error) {
      console.error(result.error)
      setDevices(devices)
      return
    }
  }

  const handleUpdateDevice = async (id: string, deviceData: Partial<Device>) => {
    // Optimistic update
    setDevices(devices.map(d => d.id === id ? { ...d, ...deviceData } : d))

    const result = await updateDevice(id, deviceData)
    if (result.error) {
      console.error(result.error)
      setDevices(devices) // Revert
    }
  }

  const handleDeleteDevice = async (id: string) => {
    // Optimistic update
    const newDevices = devices.filter((d) => d.id !== id)
    setDevices(newDevices)

    const result = await deleteDevice(id)
    if (result.error) {
      console.error(result.error)
      setDevices(devices) // Revert
    }
  }

  const handleSetPrimary = async (id: string) => {
    // Optimistic update
    const newDevices = devices.map((d) => ({
      ...d,
      is_primary: d.id === id
    }))
    setDevices(newDevices)

    // We need to unset others and set this one. 
    // Ideally the backend handles the "unset others" logic via trigger or transaction.
    // Our migration has a unique index for is_primary=true per user, 
    // so we must set others to false FIRST or use a transaction.
    // But Supabase/Postgres doesn't support "update others" easily in one RLS call unless we use a stored procedure.
    // For now, let's just update the target device to is_primary=true. 
    // The unique index might fail if we don't unset the old one first.
    // A better approach: The server action `updateDevice` should handle this logic or we use a database trigger.
    // I'll assume we might need a specific action `setPrimaryDevice(id)` to handle this atomically.
    // For now, let's try updating just the target.
    
    // Actually, checking the migration:
    // CREATE UNIQUE INDEX IF NOT EXISTS unique_primary_device_per_user ON public.devices (user_id) WHERE (is_primary = true);
    // This prevents two true values. So we MUST set the current primary to false first.
    
    const currentPrimary = devices.find(d => d.is_primary)
    if (currentPrimary && currentPrimary.id !== id) {
       await updateDevice(currentPrimary.id!, { is_primary: false })
    }
    
    const result = await updateDevice(id, { is_primary: true })
    if (result.error) {
      console.error(result.error)
      setDevices(devices) // Revert
    }
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
                device.is_primary && 'border-primary/50 bg-primary/[0.03]'
              )}
            >
              {/* Primary Badge */}
              {device.is_primary && (
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
                  <h4 className="text-xl font-black uppercase tracking-tight">{device.name || 'Unnamed Device'}</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-muted-foreground">
                    <span>
                      {device.distro} {device.distro_version}
                    </span>
                    <span className="opacity-20">•</span>
                    <span>{device.cpu}</span>
                    <span className="opacity-20">•</span>
                    <span>{device.ram}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!device.is_primary && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetPrimary(device.id!)}
                    className="rounded-xl font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
                  >
                    {t('setPrimary')}
                  </Button>
                )}
                
                <DeviceWizard 
                  initialData={device} 
                  onUpdate={handleUpdateDevice}
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-12 rounded-2xl text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    >
                      <Edit2 className="size-5" />
                    </Button>
                  }
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteDevice(device.id!)}
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
