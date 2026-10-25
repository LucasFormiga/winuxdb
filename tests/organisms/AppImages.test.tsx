import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import AppCard from '@/components/molecules/AppCard'
import AppGallery from '@/components/organisms/AppGallery'
import AppHero from '@/components/organisms/AppHero'
import type { App } from '@/lib/types'

vi.unmock('next/image')

const components = [
  ['card', AppCard],
  ['hero', AppHero],
  ['gallery', AppGallery]
] as const

function appWithImage(src: string): App {
  return {
    id: 'test-app',
    slug: 'test-app',
    name: 'Test App',
    score: 4,
    overall_rating: 'GOLD',
    logo_url: src,
    screenshots: [src]
  }
}

describe.each(components)('application %s images', (_, Component) => {
  it.each(['https://external-catalog.example/image.png', 'http://external-catalog.example/image.png'])(
    'renders database-sourced URL %s without a server-side image request',
    (src) => {
      render(<Component app={appWithImage(src)} />)

      const image = screen.getByRole('img', { name: /Test App/ })
      expect(image).toHaveAttribute('src', src)
      expect(image).not.toHaveAttribute('srcset')
    }
  )

  it('keeps optimization for local images', () => {
    render(<Component app={appWithImage('/images/local-image.png')} />)

    expect(screen.getByRole('img', { name: /Test App/ }).getAttribute('src')).toMatch(/^\/_next\/image\?/)
  })
})
