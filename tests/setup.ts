import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { src, alt, ...rest } = props
    const resolvedSrc = typeof src === 'string' ? src : (src as { src?: string })?.src
    return React.createElement('img', { src: resolvedSrc, alt, ...rest })
  }
}))
