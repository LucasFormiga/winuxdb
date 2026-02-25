'use client'

import { Bug, HardDrive, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AccountHeader from '@/components/organisms/AccountHeader'
import DevicesSection from '@/components/organisms/DevicesSection'
import PreferencesSection from '@/components/organisms/PreferencesSection'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { getUserData } from '@/lib/actions/auth'
import type { Device } from '@/lib/validations/auth'

type UserData = NonNullable<Awaited<ReturnType<typeof getUserData>>>

interface AccountContentProps {
  user: UserData
}

export default function AccountContent({ user }: AccountContentProps) {
  const t = useTranslations('Account')
  const [_activeTab, setActiveTab] = useState('preferences')

  // Transform DB devices to Validation devices if needed, but they should match closely
  // cast to any or unknown first to avoid strict type mismatch if minor differences exist
  const devices = user.devices as unknown as Device[]

  return (
    <div className="container mx-auto max-w-6xl px-6 py-12 md:py-20">
      <div className="space-y-12">
        <AccountHeader user={user} />

        <Tabs defaultValue="preferences" onValueChange={setActiveTab} className="space-y-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            {/* Sidebar Navigation */}
            <TabsList className="flex h-auto w-full flex-col gap-2 bg-transparent p-0 md:w-64">
              <TabsTrigger
                value="preferences"
                className="group flex h-14 w-full items-center justify-start gap-4 rounded-2xl border-2 border-transparent px-6 text-left font-bold transition-all data-[state=active]:border-primary/20 data-[state=active]:bg-primary/5 data-[state=active]:text-primary"
              >
                <Settings className="size-5 transition-transform group-data-[state=active]:rotate-90" />
                {t('tabs.preferences')}
              </TabsTrigger>
              <TabsTrigger
                value="devices"
                className="group flex h-14 w-full items-center justify-start gap-4 rounded-2xl border-2 border-transparent px-6 text-left font-bold transition-all data-[state=active]:border-primary/20 data-[state=active]:bg-primary/5 data-[state=active]:text-primary"
              >
                <HardDrive className="size-5 transition-transform group-hover:scale-110" />
                {t('tabs.devices')}
              </TabsTrigger>

              <a
                href="https://forms.gle/hySiJzrRHsmCySrW7"
                target="_blank"
                rel="noreferrer"
                className="group flex h-14 w-full items-center justify-start gap-4 rounded-2xl border-2 border-transparent px-6 text-left text-sm font-medium transition-all text-muted-foreground hover:text-primary hover:bg-primary/5"
              >
                <Bug className="size-4.5 transition-transform group-hover:scale-110" />
                {t('tabs.reportBug')}
              </a>
            </TabsList>

            {/* Content Area */}
            <div className="flex-1 rounded-[2.5rem] border border-border/40 bg-muted/10 p-8 md:p-12">
              <TabsContent value="preferences" className="m-0 focus-visible:ring-0">
                <PreferencesSection user={user} />
              </TabsContent>
              <TabsContent value="devices" className="m-0 focus-visible:ring-0">
                <DevicesSection initialDevices={devices} />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
