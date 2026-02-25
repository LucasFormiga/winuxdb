'use client'

import { HardDrive, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AccountHeader from '@/components/organisms/AccountHeader'
import DevicesSection from '@/components/organisms/DevicesSection'
import PreferencesSection from '@/components/organisms/PreferencesSection'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { UserAccount } from '@/lib/types'

// Mock initial data
const MOCK_USER: UserAccount = {
  id: 'user-1',
  nickname: 'LucasFormiga',
  email: 'lucas@winuxdb.com',
  preferredLanguage: 'en',
  devices: [
    {
      id: 'main-pc',
      name: 'Main Desktop',
      distro: 'CachyOS',
      distroVersion: 'Linux',
      kernel: 'Linux',
      kernelVersion: '6.13.2-cachyos',
      cpu: 'AMD Ryzen 7 5800X',
      gpu: 'NVIDIA RTX 3080',
      gpuDriver: '570.86.16',
      ram: '32GB',
      isPrimary: true
    }
  ]
}

export default function AccountPage() {
  const t = useTranslations('Account')
  const [_activeTab, setActiveTab] = useState('preferences')

  return (
    <div className="container mx-auto max-w-6xl px-6 py-12 md:py-20">
      <div className="space-y-12">
        <AccountHeader user={MOCK_USER} />

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
            </TabsList>

            {/* Content Area */}
            <div className="flex-1 rounded-[2.5rem] border border-border/40 bg-muted/10 p-8 md:p-12">
              <TabsContent value="preferences" className="m-0 focus-visible:ring-0">
                <PreferencesSection user={MOCK_USER} />
              </TabsContent>
              <TabsContent value="devices" className="m-0 focus-visible:ring-0">
                <DevicesSection initialDevices={MOCK_USER.devices} />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
