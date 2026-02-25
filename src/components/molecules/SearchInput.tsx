'use client'

import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'

interface SearchInputProps {
  onChange: (value: string) => void
  defaultValue?: string
  debounceMs?: number
}

export default function SearchInput({ onChange, defaultValue = '', debounceMs = 300 }: SearchInputProps) {
  const t = useTranslations('Search')
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (value !== defaultValue) {
        onChange(value)
      }
    }, debounceMs)

    return () => clearTimeout(handler)
  }, [value, onChange, debounceMs, defaultValue])

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={t('placeholder')}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9 bg-input/60"
        aria-label={t('label')}
      />
    </div>
  )
}
