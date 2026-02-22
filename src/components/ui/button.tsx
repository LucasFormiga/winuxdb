import { Slot } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/lib/utils'

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & {
  variant?: 'default' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : 'button'
  return (
    <Comp
      data-variant={variant}
      data-size={size}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-semibold uppercase tracking-[0.2em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
        'data-[size=default]:h-11 data-[size=default]:px-5 data-[size=default]:text-[0.65rem]',
        'data-[size=sm]:h-9 data-[size=sm]:px-4 data-[size=sm]:text-[0.6rem]',
        'data-[size=lg]:h-12 data-[size=lg]:px-6 data-[size=lg]:text-[0.7rem]',
        'data-[size=icon]:size-9',
        variant === 'default' &&
          'bg-primary text-primary-foreground shadow-[0_0_18px_rgba(255,60,60,0.28)] hover:shadow-[0_0_22px_rgba(255,60,60,0.35)]',
        variant === 'secondary' &&
          'bg-secondary text-secondary-foreground border border-border/70 hover:border-primary/50',
        variant === 'ghost' && 'text-foreground hover:bg-accent',
        className
      )}
      {...props}
    />
  )
}

export { Button }
