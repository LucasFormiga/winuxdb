'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Check,
  ChevronRight,
  Cpu,
  Cpu as GpuIcon,
  Loader2,
  MessageSquare,
  Monitor,
  Plus,
  Shield,
  Wine,
  Wrench,
  Zap
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState, useEffect } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from '@/i18n/routing'
import { submitReview } from '@/lib/actions/reviews'
import { CACHYOS_PROTON_VERSIONS, GE_PROTON_VERSIONS, PROTON_VERSIONS, WINE_VERSIONS } from '@/lib/data/review-options'
import type { Rating } from '@/lib/types'
import { cn } from '@/lib/utils'
import type { Device } from '@/lib/validations/auth'

interface ReviewDialogProps {
  appName: string
  appId: string
  userDevices: Device[]
  trigger?: React.ReactNode
  defaultRating?: Rating
}

export default function ReviewDialog({
  appName,
  appId,
  userDevices,
  trigger,
  defaultRating = 'GOLD'
}: ReviewDialogProps) {
  const t = useTranslations('AppDetail')
  const t_account = useTranslations('AccountDevices')
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)

  const formSchema = useMemo(
    () =>
      z.object({
        rating: z.enum(['BORKED', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'NATIVE']),
        stability: z.enum(['perfect', 'minor', 'crashes_occ', 'crashes_const']),
        performance: z.enum(['native', 'good', 'slow', 'unusable']),
        installation: z.enum(['easy', 'tweaks', 'difficult', 'failed']),
        tinkerSteps: z.array(z.string()).min(1, { message: t('required') }),
        engine: z.enum(['Wine', 'Proton']),
        engineFlavor: z.string().optional(),
        engineVersion: z.string().min(1, { message: t('required') }),
        pcProfileId: z.string().min(1, { message: t('required') }),
        appVersion: z.string().min(1, { message: t('required') }),
        content: z
          .string()
          .min(10, { message: t('commentMin') })
          .max(400, {
            message: t('commentLimit')
          })
      }),
    [t]
  )

  type FormValues = z.infer<typeof formSchema>

  const ratingsArr: Rating[] = ['BORKED', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM']

  const effectiveDefaultRating = defaultRating === 'NATIVE' ? 'GOLD' : defaultRating

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      rating: effectiveDefaultRating,
      stability: 'perfect',
      performance: 'native',
      installation: 'easy',
      tinkerSteps: [],
      engine: 'Wine',
      engineFlavor: 'valve',
      engineVersion: '',
      pcProfileId: userDevices.find((d) => d.is_primary)?.id || userDevices[0]?.id || '',
      appVersion: t('latest'),
      content: ''
    }
  })

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        rating: effectiveDefaultRating,
        stability: 'perfect',
        performance: 'native',
        installation: 'easy',
        tinkerSteps: [],
        engine: 'Wine',
        engineFlavor: 'valve',
        engineVersion: '',
        pcProfileId: userDevices.find((d) => d.is_primary)?.id || userDevices[0]?.id || '',
        appVersion: t('latest'),
        content: ''
      })
      setStep(1)
    }
  }, [open, form, effectiveDefaultRating, userDevices, t])

  const watchEngine = form.watch('engine')
  const watchFlavor = form.watch('engineFlavor')
  const watchContent = form.watch('content')

  const versionOptions = useMemo(() => {
    if (watchEngine === 'Wine') return WINE_VERSIONS
    if (watchFlavor === 'ge') return GE_PROTON_VERSIONS
    if (watchFlavor === 'cachyos') return CACHYOS_PROTON_VERSIONS
    return PROTON_VERSIONS
  }, [watchEngine, watchFlavor])

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    // Final validation check
    const isValid = await form.trigger()
    if (!isValid) return

    setIsSubmitting(true)

    const engineInfo =
      values.engine === 'Proton' ? `${values.engineFlavor} ${values.engineVersion}` : `Wine ${values.engineVersion}`

    const result = await submitReview({
      app_id: appId,
      device_id: values.pcProfileId,
      rating: values.rating,
      numerical_score: ratingsArr.indexOf(values.rating) + 1, // Map rating to 1-5 (BORKED=1, ..., PLATINUM=5)
      stability: values.stability,
      performance: values.performance,
      installation: values.installation,
      tinker_steps: values.tinkerSteps,
      content: values.content,
      app_version_tested: values.appVersion,
      wine_proton_version: engineInfo,
      is_verified_report: false
    })

    if (result.error) {
      console.error('Submit error:', result.error)
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(false)
    setOpen(false)
    form.reset()
    setStep(1)
    router.refresh()
  }

  const nextStep = async () => {
    // Validate current step fields
    let fieldsToValidate: any[] = []
    if (step === 1) fieldsToValidate = ['rating', 'stability', 'performance']
    if (step === 2) fieldsToValidate = ['engine', 'engineVersion']
    if (step === 3) fieldsToValidate = ['tinkerSteps']
    if (step === 4) fieldsToValidate = ['pcProfileId']
    if (step === 5) fieldsToValidate = ['content']

    const isValid = await form.trigger(fieldsToValidate)
    if (isValid) setStep((s) => s + 1)
  }
  const prevStep = () => setStep((s) => s - 1)

  const ratings: Rating[] = ['BORKED', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM']

  const steps = [
    { id: 1, title: t('reviewStep1') },
    { id: 2, title: t('reviewStep2') },
    { id: 3, title: t('reviewStep3') },
    { id: 4, title: t('reviewStep4') },
    { id: 5, title: t('reviewStep5') }
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="secondary" className="gap-2 rounded-2xl">
            <Plus className="size-4" />
            {t('submitReview')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl overflow-hidden rounded-[2rem] border-border/40 bg-background/95 p-0 backdrop-blur-xl">
        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-border/40 bg-muted/30 px-8 py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MessageSquare className="size-6" />
              </div>
              <div>
                <DialogTitle className="text-xl">{t('submitReview')}</DialogTitle>
                <DialogDescription>{t('reviewDialogDesc', { appName })}</DialogDescription>
              </div>
              <div className="ml-auto flex items-center gap-2 text-sm font-medium">
                {steps.map((s) => (
                  <div
                    key={s.id}
                    className={cn(
                      'size-2 rounded-full transition-all duration-300',
                      step === s.id ? 'bg-primary w-6' : 'bg-muted-foreground/20'
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Form Body */}
            <div className="min-h-[400px] max-h-[70vh] overflow-y-auto px-8 py-8">
              {/* Step 1: Rating & Basic Feedback */}
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <FormField
                    control={form.control as any}
                    name="rating"
                    render={({ field }) => (
                      <FormItem className="space-y-6">
                        <FormLabel className="text-base font-bold uppercase tracking-widest text-muted-foreground/60">
                          {t('compatibilityRating')}
                        </FormLabel>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {ratings.map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => field.onChange(r)}
                              className={cn(
                                'group relative flex flex-col items-start gap-2 rounded-[1.5rem] border-2 border-border/40 bg-muted/30 p-5 text-left transition-all duration-300 hover:bg-muted/50',
                                field.value === r && [
                                  'border-primary bg-primary/[0.03] ring-4 ring-primary/10 scale-[1.02]',
                                  r === 'NATIVE' && 'border-primary ring-primary/20',
                                  r === 'PLATINUM' && 'border-cyan-500 ring-cyan-500/20',
                                  r === 'GOLD' && 'border-yellow-500 ring-yellow-500/20',
                                  r === 'SILVER' && 'border-slate-400 ring-slate-400/20',
                                  r === 'BRONZE' && 'border-amber-600 ring-amber-600/20',
                                  r === 'BORKED' && 'border-red-500 ring-red-500/20'
                                ]
                              )}
                            >
                              <div className="flex w-full items-center justify-between">
                                {field.value === r && (
                                  <div className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground animate-in zoom-in duration-300">
                                    <Check className="size-3 stroke-[3]" />
                                  </div>
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-black uppercase tracking-tight">{r}</p>
                                <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                                  {t(`presets.ratings.${r}`)}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control as any}
                      name="stability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Shield className="size-4 opacity-60" /> {t('stability')}
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-border/40 bg-muted/30">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="perfect">{t('presets.stability.perfect')}</SelectItem>
                              <SelectItem value="minor">{t('presets.stability.minor')}</SelectItem>
                              <SelectItem value="crashes_occ">{t('presets.stability.crashes_occ')}</SelectItem>
                              <SelectItem value="crashes_const">{t('presets.stability.crashes_const')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="performance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Zap className="size-4 opacity-60" /> {t('performance')}
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-border/40 bg-muted/30">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="native">{t('presets.performance.native')}</SelectItem>
                              <SelectItem value="good">{t('presets.performance.good')}</SelectItem>
                              <SelectItem value="slow">{t('presets.performance.slow')}</SelectItem>
                              <SelectItem value="unusable">{t('presets.performance.unusable')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Engine & Version */}
              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid gap-8">
                    <FormField
                      control={form.control as any}
                      name="engine"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-base">{t('executionEngine')}</FormLabel>
                          <RadioGroup
                            onValueChange={(val) => {
                              field.onChange(val)
                              form.setValue('engineVersion', '')
                            }}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-4"
                          >
                            <FormItem>
                              <FormControl>
                                <RadioGroupItem value="Wine" className="sr-only" />
                              </FormControl>
                              <FormLabel
                                className={cn(
                                  'flex flex-col items-center justify-center rounded-2xl border-2 border-border/40 bg-muted/30 p-6 transition-all cursor-pointer hover:bg-muted/50',
                                  field.value === 'Wine' && 'border-primary bg-primary/5'
                                )}
                              >
                                <Wine className="mb-2 size-8 text-primary" />
                                <span className="text-lg font-bold">Wine</span>
                                <span className="text-xs text-muted-foreground">{t('wineDesc')}</span>
                              </FormLabel>
                            </FormItem>
                            <FormItem>
                              <FormControl>
                                <RadioGroupItem value="Proton" className="sr-only" />
                              </FormControl>
                              <FormLabel
                                className={cn(
                                  'flex flex-col items-center justify-center rounded-2xl border-2 border-border/40 bg-muted/30 p-6 transition-all cursor-pointer hover:bg-muted/50',
                                  field.value === 'Proton' && 'border-primary bg-primary/5'
                                )}
                              >
                                <Zap className="mb-2 size-8 text-blue-500" />
                                <span className="text-lg font-bold">Proton</span>
                                <span className="text-xs text-muted-foreground">{t('protonDesc')}</span>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormItem>
                      )}
                    />

                    <div className={cn('grid gap-6', watchEngine === 'Proton' ? 'sm:grid-cols-2' : 'grid-cols-1')}>
                      {watchEngine === 'Proton' && (
                        <FormField
                          control={form.control as any}
                          name="engineFlavor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('engineFlavor')}</FormLabel>
                              <Select
                                onValueChange={(val) => {
                                  field.onChange(val)
                                  form.setValue('engineVersion', '')
                                }}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="rounded-xl border-border/40 bg-muted/30 h-12">
                                    <SelectValue placeholder={t('engineFlavorPlaceholder')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-xl">
                                  <SelectItem value="valve">{t('flavors.valve')}</SelectItem>
                                  <SelectItem value="ge">{t('flavors.ge')}</SelectItem>
                                  <SelectItem value="cachyos">{t('flavors.cachyos')}</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control as any}
                        name="engineVersion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('engineVersion')}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="rounded-xl border-border/40 bg-muted/30 h-12">
                                  <SelectValue placeholder={t('engineVersionPlaceholder')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl max-h-[300px]">
                                {versionOptions.map((v) => (
                                  <SelectItem key={v} value={v}>
                                    {v}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Tinkering */}
              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-4">
                    <FormLabel className="text-base flex items-center gap-2">
                      <Wrench className="size-5 text-primary" /> {t('tinkerSteps')}
                    </FormLabel>
                    <div className="grid gap-3">
                      {[
                        { id: 'none', label: t('presets.tinkering.none') },
                        { id: 'tricks', label: t('presets.tinkering.tricks') },
                        { id: 'launch', label: t('presets.tinkering.launch') },
                        { id: 'dll', label: t('presets.tinkering.dll') },
                        { id: 'env', label: t('presets.tinkering.env') }
                      ].map((item) => {
                        const currentValues = form.watch('tinkerSteps') || []
                        const isNoneSelected = currentValues.includes('none')
                        const hasTweaksSelected = currentValues.some(v => v !== 'none')
                        
                        // Disable none if tweaks are selected
                        // Disable tweaks if none is selected
                        const isDisabled = item.id === 'none' ? hasTweaksSelected : isNoneSelected

                        return (
                          <FormField
                            key={item.id}
                            control={form.control as any}
                            name="tinkerSteps"
                            render={({ field }) => (
                              <FormItem
                                className={cn(
                                  'flex flex-row items-center space-x-3 space-y-0 rounded-2xl border border-border/40 bg-muted/30 p-4 transition-all hover:bg-muted/50',
                                  isDisabled && 'opacity-50 cursor-not-allowed'
                                )}
                              >
                                <FormControl>
                                  <Checkbox
                                    disabled={isDisabled}
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      let newValue = [...(field.value || [])]
                                      if (checked) {
                                        if (item.id === 'none') {
                                          newValue = ['none']
                                        } else {
                                          newValue = newValue.filter((v) => v !== 'none')
                                          newValue.push(item.id)
                                        }
                                      } else {
                                        newValue = newValue.filter((v) => v !== item.id)
                                      }
                                      field.onChange(newValue)
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className={cn('font-medium flex-1', !isDisabled && 'cursor-pointer')}>
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        )
                      })}
                    </div>
                    <FormMessage />
                  </div>
                </div>
              )}

              {/* Step 4: PC Profile */}
              {step === 4 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <FormField
                    control={form.control as any}
                    name="pcProfileId"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="text-base">{t('hardwareDetails')}</FormLabel>
                        <div className="grid gap-4">
                          {userDevices.map((profile) => (
                            <div
                              key={profile.id}
                              onClick={() => field.onChange(profile.id)}
                              className={cn(
                                'relative flex flex-col gap-4 rounded-[2rem] border-2 border-border/40 bg-muted/30 p-6 transition-all cursor-pointer hover:bg-muted/50',
                                field.value === profile.id && 'border-primary bg-primary/5 ring-1 ring-primary/50'
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex size-10 items-center justify-center rounded-xl bg-background shadow-sm">
                                    <Monitor className="size-5 text-primary" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold">{profile.name}</h4>
                                    <p className="text-xs text-muted-foreground">
                                      {profile.distro} {profile.distro_version} • {profile.de}
                                    </p>
                                  </div>
                                </div>
                                {field.value === profile.id && <Check className="size-5 text-primary" />}
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-[0.65rem] uppercase tracking-wider font-bold text-muted-foreground/60">
                                <div className="flex items-center gap-2">
                                  <Cpu className="size-3" /> {profile.cpu}
                                </div>
                                <div className="flex items-center gap-2">
                                  <GpuIcon className="size-3" /> {profile.gpu}
                                </div>
                              </div>
                            </div>
                          ))}
                          {userDevices.length === 0 && (
                            <div className="text-center py-10 rounded-[2rem] border-2 border-dashed border-border/40 bg-muted/10">
                              <p className="text-sm text-muted-foreground mb-4">
                                {t('noDevicesFound')}
                              </p>
                              <Button variant="secondary" onClick={() => (window.location.href = '/account')}>
                                {t_account('addDevice')}
                              </Button>
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 5: Final Comments */}
              {step === 5 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <FormField
                    control={form.control as any}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">{t('additionalComments')}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              placeholder={t('experiencePlaceholder')}
                              className="min-h-[200px] rounded-[2rem] border-border/40 bg-muted/30 p-6 focus-visible:ring-primary/30"
                              {...field}
                            />
                            <div
                              className={cn(
                                'absolute bottom-4 right-6 text-xs font-mono',
                                watchContent.length > 380 ? 'text-red-500' : 'text-muted-foreground'
                              )}
                            >
                              {t('charLimit', { count: 400 - watchContent.length })}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <DialogFooter className="border-t border-border/40 bg-muted/30 px-8 py-6 sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => (step === 1 ? setOpen(false) : prevStep())}
                className="rounded-xl"
              >
                {step === 1 ? t('cancel') : t('back')}
              </Button>

              {step < 5 ? (
                <Button type="button" onClick={nextStep} className="rounded-xl px-8 shadow-lg shadow-primary/20">
                  {t('next')} <ChevronRight className="ml-2 size-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="rounded-xl px-8 shadow-lg shadow-primary/20">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      {t('submitting')}
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 size-4" />
                      {t('submit')}
                    </>
                  )}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
