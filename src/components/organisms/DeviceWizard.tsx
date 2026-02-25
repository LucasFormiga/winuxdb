'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Gamepad2,
  HardDrive,
  Info,
  Layout,
  Microchip,
  Monitor,
  MousePointer2,
  Plus,
  Settings,
  ShieldCheck,
  Terminal,
  Zap
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { parseSteamSystemInfo } from '@/lib/utils/steam-parser'
import { DESKTOP_ENVIRONMENTS, type Device } from '@/lib/validations/auth'

// Extend the API schema for the wizard form if needed, or use it directly.
// The API schema expects snake_case for some fields (distro_version, etc) but the form uses camelCase.
// We should map them. For now, let's keep the local schema but add steam_sys_info and map on submit.
const wizardSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  distro: z.string().min(1, 'Distribution is required'),
  distroVersion: z.string().optional(),
  de: z.string().min(1, 'Desktop Environment is required'),
  kernel: z.string().min(1, 'Kernel is required'),
  kernelVersion: z.string().optional(),
  cpu: z.string().min(1, 'CPU is required'),
  gpu: z.string().min(1, 'GPU is required'),
  gpuDriver: z.string().optional(),
  ram: z.string().min(1, 'RAM is required'),
  steamSysInfo: z.string().optional()
})

interface DeviceWizardProps {
  onAdd?: (device: Omit<Device, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void
  onUpdate?: (id: string, device: Partial<Device>) => void
  initialData?: Device
  disabled?: boolean
  trigger?: React.ReactNode
}

export default function DeviceWizard({ onAdd, onUpdate, initialData, disabled, trigger }: DeviceWizardProps) {
  const t = useTranslations('AccountDevices.wizard')
  const tCommon = useTranslations('AppDetail')
  const tMain = useTranslations('AccountDevices')
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(initialData ? 3 : 1) // Start at step 3 if editing
  const [method, setMethod] = useState<'steam' | 'manual' | null>(initialData ? 'manual' : null)
  const [isParsing, setIsParsing] = useState(false)

  const form = useForm<z.infer<typeof wizardSchema>>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      name: initialData?.name || '',
      distro: initialData?.distro || '',
      distroVersion: initialData?.distro_version || '',
      de: initialData?.de || '',
      kernel: initialData?.kernel || '',
      kernelVersion: initialData?.kernel_version || '',
      cpu: initialData?.cpu || '',
      gpu: initialData?.gpu || '',
      gpuDriver: initialData?.gpu_driver || '',
      ram: initialData?.ram || '',
      steamSysInfo: initialData?.steam_sys_info || ''
    }
  })

  // Sync form with initialData when it changes (important for editing)
  useEffect(() => {
    if (initialData && open) {
      form.reset({
        name: initialData.name || '',
        distro: initialData.distro || '',
        distroVersion: initialData.distro_version || '',
        de: initialData.de || '',
        kernel: initialData.kernel || '',
        kernelVersion: initialData.kernel_version || '',
        cpu: initialData.cpu || '',
        gpu: initialData.gpu || '',
        gpuDriver: initialData.gpu_driver || '',
        ram: initialData.ram || '',
        steamSysInfo: initialData.steam_sys_info || ''
      })
      setStep(3)
      setMethod('manual')
    }
  }, [initialData, open, form])

  const nextStep = async () => {
    // Validate current step fields before proceeding
    let fieldsToValidate: (keyof z.infer<typeof wizardSchema>)[] = []

    if (step === 3) {
      fieldsToValidate = ['distro', 'de', 'kernel', 'cpu', 'gpu', 'ram']
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await form.trigger(fieldsToValidate)
      if (!isValid) return
    }

    setStep((s) => s + 1)
  }
  const prevStep = () => {
    if (step === 3 && method === 'manual') {
      setStep(1)
    } else {
      setStep((s) => s - 1)
    }
  }

  const handleSteamImport = (text: string) => {
    setIsParsing(true)
    try {
      const parsed = parseSteamSystemInfo(text)
      if (Object.keys(parsed).length > 0) {
        form.reset({
          name: form.getValues('name') || '',
          distro: parsed.distro || '',
          distroVersion: parsed.distroVersion || '',
          de: parsed.de || '',
          kernel: parsed.kernel || '',
          kernelVersion: parsed.kernelVersion || '',
          cpu: parsed.cpu || '',
          gpu: parsed.gpu || '',
          gpuDriver: parsed.gpuDriver || '',
          ram: parsed.ram || '',
          steamSysInfo: text
        })
        setStep(3)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsParsing(false)
    }
  }

  const onSubmit = (values: z.infer<typeof wizardSchema>) => {
    const payload = {
      name: values.name || 'My Device',
      is_primary: initialData?.is_primary || false,
      distro: values.distro,
      distro_version: values.distroVersion || '',
      de: values.de,
      kernel: values.kernel,
      kernel_version: values.kernelVersion || '',
      cpu: values.cpu,
      gpu: values.gpu,
      gpu_driver: values.gpuDriver,
      ram: values.ram,
      steam_sys_info: values.steamSysInfo
    }

    if (initialData?.id && onUpdate) {
      onUpdate(initialData.id, payload as any)
    } else if (onAdd) {
      onAdd(payload as any)
    }

    setOpen(false)
    setStep(1)
    setMethod(null)
    form.reset()
  }

  const steps = [
    { id: 1, title: t('step1') },
    { id: 2, title: t('step2') },
    { id: 3, title: t('step3') },
    { id: 4, title: t('step4') }
  ]

  const watchValues = form.watch()

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        if (!val) {
          setStep(initialData ? 3 : 1)
          setMethod(initialData ? 'manual' : null)
          form.reset()
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button
            disabled={disabled}
            className="h-14 rounded-2xl bg-primary px-8 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="mr-2 size-5" />
            {tMain('addDevice')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl overflow-hidden rounded-[2.5rem] border-border/40 bg-background/95 p-0 backdrop-blur-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
            {/* Elegant Header */}
            <div className="relative overflow-hidden border-b border-border/40 bg-muted/30 px-8 py-8">
              <div className="absolute -right-12 -top-12 size-48 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="flex size-14 items-center justify-center rounded-[1.25rem] bg-primary/10 text-primary shadow-inner">
                    <HardDrive className="size-7" />
                  </div>
                  <div className="space-y-0.5">
                    <DialogTitle className="text-2xl font-black uppercase tracking-tight">{t('title')}</DialogTitle>
                    <div className="flex items-center gap-1.5">
                      {steps.map((s) => (
                        <div
                          key={s.id}
                          className={cn(
                            'h-1.5 rounded-full transition-all duration-500',
                            step === s.id
                              ? 'bg-primary w-10'
                              : step > s.id
                                ? 'bg-primary/40 w-4'
                                : 'bg-muted-foreground/20 w-4'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-h-[480px] max-h-[70vh] overflow-y-auto px-10 py-10">
              {/* Step 1: Immersive Method Choice */}
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                  <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-2xl font-black uppercase tracking-tight">{t('methodTitle')}</h3>
                    <p className="text-muted-foreground">{t('methodDesc')}</p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMethod('steam')
                        setStep(2)
                      }}
                      className="group relative flex flex-col items-center gap-6 overflow-hidden rounded-[2.5rem] border-2 border-border/40 bg-muted/20 p-10 text-center transition-all hover:border-primary hover:bg-primary/[0.02] hover:shadow-2xl hover:shadow-primary/10"
                    >
                      <div className="absolute -right-8 -top-8 size-32 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/10" />
                      <div className="flex size-20 items-center justify-center rounded-[1.75rem] bg-background shadow-xl ring-1 ring-border/50 transition-all group-hover:scale-110 group-hover:rotate-3">
                        <Terminal className="size-10 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-black uppercase tracking-tight">{t('methodSteam')}</p>
                        <p className="text-sm leading-relaxed text-muted-foreground">{t('methodSteamDesc')}</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMethod('manual')
                        setStep(3)
                      }}
                      className="group relative flex flex-col items-center gap-6 overflow-hidden rounded-[2.5rem] border-2 border-border/40 bg-muted/20 p-10 text-center transition-all hover:border-primary hover:bg-primary/[0.02] hover:shadow-2xl hover:shadow-primary/10"
                    >
                      <div className="absolute -right-8 -top-8 size-32 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/10" />
                      <div className="flex size-20 items-center justify-center rounded-[1.75rem] bg-background shadow-xl ring-1 ring-border/50 transition-all group-hover:scale-110 group-hover:-rotate-3">
                        <MousePointer2 className="size-10 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-black uppercase tracking-tight">{t('methodManual')}</p>
                        <p className="text-sm leading-relaxed text-muted-foreground">{t('methodManualDesc')}</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Steam Import Tool */}
              {step === 2 && method === 'steam' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Terminal className="size-5" />
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-tight">{t('steamInputLabel')}</h3>
                    </div>
                    <div className="group relative">
                      <div className="absolute inset-0 rounded-[2rem] bg-primary/5 opacity-0 blur-xl transition-opacity group-focus-within:opacity-100" />
                      <Textarea
                        placeholder={t('steamInputPlaceholder')}
                        className="relative min-h-[240px] rounded-[2rem] border-2 border-border/40 bg-muted/20 p-8 text-sm font-mono focus-visible:border-primary/50 focus-visible:ring-0 focus-visible:shadow-none"
                        onChange={(e) => {
                          if (e.target.value.includes('Processor Information')) {
                            handleSteamImport(e.target.value)
                          }
                        }}
                      />
                      {isParsing && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
                          <Zap className="mb-4 size-10 animate-pulse text-primary" />
                          <p className="font-bold uppercase tracking-widest text-primary">{t('parsing')}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-primary/20 bg-primary/5 p-8">
                    <div className="flex items-center gap-3 font-black uppercase tracking-widest text-primary">
                      <Info className="size-5" /> {t('steamGuideTitle')}
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-xs font-black text-primary">
                            0{i}
                          </span>
                          <p className="text-xs font-medium leading-relaxed text-muted-foreground">
                            {t(`steamGuideStep${i}`)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Refined Hardware Configuration */}
              {step === 3 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tight">{t('manualTitle')}</h3>
                    <p className="text-sm text-muted-foreground">{t('manualDesc')}</p>
                  </div>

                  <div className="grid gap-10">
                    {/* OS Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <Layout className="size-5 text-primary" />
                        <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">
                          {t('sectionOS')}
                        </h4>
                        <div className="h-px flex-1 bg-border/40" />
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="distro"
                          render={({ field }) => (
                            <FormItem className="group rounded-[1.5rem] border border-border/40 bg-muted/20 p-5 transition-all focus-within:border-primary/40 focus-within:bg-muted/40">
                              <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                {t('distro')}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('distroPlaceholder')}
                                  className="h-auto border-none bg-transparent p-0 text-lg font-bold shadow-none focus-visible:ring-0 focus-visible:shadow-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-[10px]" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="distroVersion"
                          render={({ field }) => (
                            <FormItem className="group rounded-[1.5rem] border border-border/40 bg-muted/20 p-5 transition-all focus-within:border-primary/40 focus-within:bg-muted/40">
                              <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                {t('distroVersion')}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('distroVersionPlaceholder')}
                                  className="h-auto border-none bg-transparent p-0 text-lg font-bold shadow-none focus-visible:ring-0 focus-visible:shadow-none"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="de"
                          render={({ field }) => (
                            <FormItem className="group rounded-[1.5rem] border border-border/40 bg-muted/20 p-5 transition-all focus-within:border-primary/40 focus-within:bg-muted/40">
                              <FormLabel className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                                <Layout className="size-3" /> {tCommon('de')}
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-auto border-none bg-transparent p-0 text-lg font-bold shadow-none focus:ring-0">
                                    <SelectValue placeholder="Select DE" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-2xl border-border/40 bg-background/95 backdrop-blur-xl">
                                  {DESKTOP_ENVIRONMENTS.map((de) => (
                                    <SelectItem key={de} value={de} className="rounded-xl">
                                      {de}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-[10px]" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="kernel"
                          render={({ field }) => (
                            <FormItem className="group rounded-[1.5rem] border border-border/40 bg-muted/20 p-5 transition-all focus-within:border-primary/40 focus-within:bg-muted/40">
                              <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                {t('kernel')}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('kernelPlaceholder')}
                                  className="h-auto border-none bg-transparent p-0 text-lg font-bold shadow-none focus-visible:ring-0 focus-visible:shadow-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-[10px]" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="kernelVersion"
                          render={({ field }) => (
                            <FormItem className="group rounded-[1.5rem] border border-border/40 bg-muted/20 p-5 transition-all focus-within:border-primary/40 focus-within:bg-muted/40">
                              <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                {t('kernelVersion')}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('kernelVersionPlaceholder')}
                                  className="h-auto border-none bg-transparent p-0 text-lg font-bold shadow-none focus-visible:ring-0 focus-visible:shadow-none"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Hardware Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <Settings className="size-5 text-primary" />
                        <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">
                          {t('sectionHardware')}
                        </h4>
                        <div className="h-px flex-1 bg-border/40" />
                      </div>
                      <div className="grid gap-5">
                        <FormField
                          control={form.control}
                          name="cpu"
                          render={({ field }) => (
                            <FormItem className="group rounded-[1.5rem] border border-border/40 bg-muted/20 p-5 transition-all focus-within:border-primary/40 focus-within:bg-muted/40">
                              <FormLabel className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                                <Cpu className="size-3" /> {t('cpu')}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('cpuPlaceholder')}
                                  className="h-auto border-none bg-transparent p-0 text-lg font-bold shadow-none focus-visible:ring-0 focus-visible:shadow-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-[10px]" />
                            </FormItem>
                          )}
                        />
                        <div className="grid gap-5 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="gpu"
                            render={({ field }) => (
                              <FormItem className="group rounded-[1.5rem] border border-border/40 bg-muted/20 p-5 transition-all focus-within:border-primary/40 focus-within:bg-muted/40">
                                <FormLabel className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                                  <Monitor className="size-3" /> {t('gpu')}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t('gpuPlaceholder')}
                                    className="h-auto border-none bg-transparent p-0 text-lg font-bold shadow-none focus-visible:ring-0 focus-visible:shadow-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="gpuDriver"
                            render={({ field }) => (
                              <FormItem className="group rounded-[1.5rem] border border-border/40 bg-muted/20 p-5 transition-all focus-within:border-primary/40 focus-within:bg-muted/40">
                                <FormLabel className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                                  <ShieldCheck className="size-3" /> {t('gpuDriver')}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t('gpuDriverPlaceholder')}
                                    className="h-auto border-none bg-transparent p-0 text-lg font-bold shadow-none focus-visible:ring-0 focus-visible:shadow-none"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="ram"
                          render={({ field }) => (
                            <FormItem className="group rounded-[1.5rem] border border-border/40 bg-muted/20 p-5 transition-all focus-within:border-primary/40 focus-within:bg-muted/40">
                              <FormLabel className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                                <Microchip className="size-3" /> {t('ram')}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('ramPlaceholder')}
                                  className="h-auto border-none bg-transparent p-0 text-lg font-bold shadow-none focus-visible:ring-0 focus-visible:shadow-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-[10px]" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Beautiful Finalize & Preview */}
              {step === 4 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="text-center">
                    <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-[2rem] bg-primary/10 text-primary shadow-2xl shadow-primary/20">
                      <Gamepad2 className="size-10" />
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tight">{t('finalizeTitle')}</h3>
                    <p className="mt-2 text-muted-foreground">{t('finalizeDesc')}</p>
                  </div>

                  <div className="grid gap-8">
                    {/* Device Identity */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="rounded-[2rem] border-2 border-primary/20 bg-primary/5 p-8 transition-all focus-within:border-primary/40 focus-within:bg-primary/[0.08]">
                          <FormLabel className="text-xs font-black uppercase tracking-widest text-primary/60">
                            {t('deviceName')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('deviceNamePlaceholder')}
                              className="h-auto border-none bg-transparent p-0 text-2xl font-black uppercase tracking-tight shadow-none focus-visible:ring-0 focus-visible:shadow-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Summary Preview Card */}
                    <div className="overflow-hidden rounded-[2rem] border border-border/40 bg-muted/20">
                      <div className="border-b border-border/40 bg-muted/30 px-8 py-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                          {t('summaryTitle')}
                        </h4>
                      </div>
                      <div className="grid gap-6 p-8 sm:grid-cols-2">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="size-2 rounded-full bg-primary" />
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                                {t('distro')}
                              </p>
                              <p className="text-sm font-bold">
                                {watchValues.distro} {watchValues.distroVersion}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="size-2 rounded-full bg-primary/80" />
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                                {tCommon('de')}
                              </p>
                              <p className="text-sm font-bold">{watchValues.de}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="size-2 rounded-full bg-primary/60" />
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                                {t('kernel')}
                              </p>
                              <p className="text-sm font-bold">
                                {watchValues.kernel} {watchValues.kernelVersion}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Cpu className="size-4 text-primary" />
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                                {t('hardwareLabel')}
                              </p>
                              <p className="text-xs font-bold line-clamp-1">{watchValues.cpu}</p>
                              <p className="text-[10px] font-medium text-muted-foreground">
                                {watchValues.gpu} • {watchValues.ram}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Premium Footer */}
            <DialogFooter className="mt-auto border-t border-border/40 bg-muted/30 px-10 py-8 sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => (step === 1 ? setOpen(false) : prevStep())}
                className="h-12 rounded-xl px-6 font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted/50"
              >
                {step === 1 ? (
                  tCommon('cancel')
                ) : (
                  <>
                    <ChevronLeft className="mr-2 size-4" /> {tCommon('back')}
                  </>
                )}
              </Button>

              {step < 4 && step !== 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="h-12 rounded-xl bg-primary px-8 font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                >
                  {tCommon('next')} <ChevronRight className="ml-2 size-4" />
                </Button>
              ) : step >= 4 ? (
                <Button
                  type="submit"
                  className="h-12 rounded-xl bg-primary px-10 font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Check className="mr-2 size-5 stroke-[3]" />
                  {t('finish')}
                </Button>
              ) : null}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
