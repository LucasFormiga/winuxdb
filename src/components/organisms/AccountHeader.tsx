'use client'

import { ShieldCheck, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface AccountHeaderProps {
  user: {
    nickname: string
    email?: string
    avatar_url?: string
    is_admin?: boolean
    is_verified?: boolean
  }
}

export default function AccountHeader({ user }: AccountHeaderProps) {
  const t = useTranslations('AppDetail')

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border-none bg-muted/30 p-8 md:p-12">
      {/* Background Glow */}
      <div className="absolute -right-24 -top-24 size-64 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute -bottom-24 -left-24 size-64 rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
        <div className="group relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl transition-all duration-500 group-hover:bg-primary/30" />
          <Avatar className="size-24 border-4 border-background shadow-2xl md:size-32">
            <AvatarImage src={user.avatar_url} referrerPolicy="no-referrer" />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="size-10 md:size-12" />
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <h1 className="text-3xl font-black uppercase tracking-tight md:text-5xl">{user.nickname}</h1>
            <div className="flex items-center gap-2 mt-1">
              {user.is_verified && (
                <ShieldCheck className="size-5 text-blue-500 md:size-6" fill="currentColor" fillOpacity={0.1} />
              )}
              {user.is_admin && (
                <Badge variant="secondary" className="rounded-sm px-1.5 py-0.5 text-xs font-black uppercase bg-primary/10 text-primary border-none">
                  {t('admin')}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-lg font-medium text-muted-foreground">{user.email || 'Private Email'}</p>
        </div>
      </div>
    </div>
  )
}
