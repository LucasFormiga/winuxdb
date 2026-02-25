'use client'

import { User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { UserAccount } from '@/lib/types'

interface AccountHeaderProps {
  user: UserAccount
}

export default function AccountHeader({ user }: AccountHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border-none bg-muted/30 p-8 md:p-12">
      {/* Background Glow */}
      <div className="absolute -right-24 -top-24 size-64 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute -bottom-24 -left-24 size-64 rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
        <div className="group relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl transition-all duration-500 group-hover:bg-primary/30" />
          <Avatar className="size-24 border-4 border-background shadow-2xl md:size-32">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="size-10 md:size-12" />
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-black uppercase tracking-tight md:text-5xl">{user.nickname}</h1>
          <p className="text-lg font-medium text-muted-foreground">{user.email}</p>
        </div>
      </div>
    </div>
  )
}
