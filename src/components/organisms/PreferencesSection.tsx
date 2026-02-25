'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Loader2, Save } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { UserAccount } from '@/lib/types'

const prefSchema = z.object({
  nickname: z.string().min(2, { message: 'Nickname must be at least 2 characters.' }).max(30),
  preferredLanguage: z.string()
})

interface PreferencesSectionProps {
  user: UserAccount
}

export default function PreferencesSection({ user }: PreferencesSectionProps) {
  const t = useTranslations('Account.preferences')
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const form = useForm<z.infer<typeof prefSchema>>({
    resolver: zodResolver(prefSchema),
    defaultValues: {
      nickname: user.nickname,
      preferredLanguage: user.preferredLanguage
    }
  })

  async function onSubmit(values: z.infer<typeof prefSchema>) {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Saved preferences:', values)
    setIsSaving(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold uppercase tracking-tight">{t('title')}</h2>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl space-y-6">
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem className="rounded-3xl border border-border/40 bg-muted/20 p-6 transition-all focus-within:bg-muted/40">
                <FormLabel className="text-sm font-black uppercase tracking-widest opacity-60">
                  {t('nickname')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('nicknamePlaceholder')}
                    className="border-none bg-transparent p-0 text-xl font-bold shadow-none focus-visible:ring-0 focus-visible:shadow-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferredLanguage"
            render={({ field }) => (
              <FormItem className="rounded-3xl border border-border/40 bg-muted/20 p-6 transition-all focus-within:bg-muted/40">
                <FormLabel className="text-sm font-black uppercase tracking-widest opacity-60">
                  {t('language')}
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-auto border-none bg-transparent p-0 text-xl font-bold shadow-none focus:ring-0 focus:shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="en">English (EN)</SelectItem>
                    <SelectItem value="es">Español (ES)</SelectItem>
                    <SelectItem value="pt">Português (PT)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSaving}
            className="h-14 w-full rounded-2xl bg-primary px-8 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] sm:w-auto"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                {t('saving')}
              </>
            ) : showSuccess ? (
              <>
                <Check className="mr-2 size-5" />
                Saved
              </>
            ) : (
              <>
                <Save className="mr-2 size-5" />
                {t('save')}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
