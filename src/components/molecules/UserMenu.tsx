'use client'

import { LogOut, Settings, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useRouter } from '@/i18n/routing'
import { signOut } from '@/lib/actions/auth'

interface UserMenuProps {
  user: {
    nickname: string
    avatar_url?: string
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()
  const t = useTranslations('UserMenu')

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full border border-white/10 p-0 overflow-hidden hover:bg-white/5 transition-all"
        >
          <Avatar className="h-full w-full">
            {user.avatar_url && (
              <AvatarImage
                src={user.avatar_url}
                alt={user.nickname || t('user')}
                onError={(e) => {
                  // Fallback if image fails to load (e.g. expired URL)
                  ;(e.target as any).style.display = 'none'
                }}
              />
            )}
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {(user.nickname || 'U').substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass-panel border-white/10 w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none uppercase tracking-wider">{user.nickname || t('user')}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem onClick={() => router.push('/account')} className="cursor-pointer focus:bg-white/5">
          <User className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{t('profile')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/account')} className="cursor-pointer focus:bg-white/5">
          <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{t('settings')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer focus:bg-destructive/10 text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
