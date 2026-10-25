import { hasRemoteMatch } from 'next/dist/shared/lib/match-remote-pattern'
import { describe, expect, it } from 'vitest'
import config from '../../../next.config'
import { getApps } from '@/lib/data/apps-loader'
import { DISTROS } from '@/lib/data/distros'

const remotePatterns = config.images?.remotePatterns
if (!remotePatterns) throw new Error('Remote image patterns must be configured')

const screenshots = [
  ...DISTROS.flatMap((distro) => distro.flavors.map((flavor) => flavor.screenshot)),
  ...getApps().flatMap((app) => app.screenshots ?? [])
].filter((src) => src.startsWith('https://') || src.startsWith('http://'))

describe('remote image policy', () => {
  it('permits every remote screenshot in the current catalog', () => {
    expect(screenshots.length).toBeGreaterThan(0)
    for (const src of screenshots) {
      expect(hasRemoteMatch([], remotePatterns, new URL(src)), src).toBe(true)
    }
  })

  it.each([
    'https://untrusted.example/image.png',
    'http://assets.ubuntu.com/image.png',
    'https://assets.ubuntu.com.untrusted.example/image.png',
    'https://localhost/image.png',
    'https://127.0.0.1/image.png',
    'https://[::1]/image.png',
    'https://169.254.169.254/image.png'
  ])('rejects untrusted image URL %s', (src) => {
    expect(hasRemoteMatch([], remotePatterns, new URL(src))).toBe(false)
  })

  it('does not opt into local-IP or SVG optimization', () => {
    expect(config.images?.dangerouslyAllowLocalIP).not.toBe(true)
    expect(config.images?.dangerouslyAllowSVG).not.toBe(true)
  })
})
